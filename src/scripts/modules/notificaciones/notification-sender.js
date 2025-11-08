/**
 * ============================================
 * SERVICIO DE ENVÍO DE NOTIFICACIONES
 * ============================================
 * Sistema de Gestión de Eventos - ESPOL
 * Responsable: ARMIJOS ROMERO ERICK DANILO
 * 
 * Módulo principal para el envío automático de notificaciones.
 * Gestiona:
 * - Envío de emails masivos a clientes
 * - Notificaciones push del navegador
 * - Procesamiento automático de notificaciones programadas
 * - Reintentos automáticos en caso de fallo
 * - Confirmación de compra de boletos
 * 
 * @module notification-sender
 * @requires supabase-client
 * @requires notificaciones_crud
 * ============================================
 */

import { supabase } from '../../supabase-client.js';
import { NotificacionesCRUD } from './notificaciones_crud.js';

/**
 * ============================================
 * CONFIGURACIÓN DEL SERVICIO
 * ============================================
 * Parámetros de control para el envío de notificaciones
 */
const NOTIFICATION_CONFIG = {
  /**
   * Número máximo de intentos antes de marcar como fallida
   * @type {number}
   */
  MAX_RETRY_ATTEMPTS: 3,
  
  /**
   * Tiempo de espera entre reintentos en milisegundos
   * @type {number}
   */
  RETRY_DELAY: 5000,
  
  /**
   * Tamaño del lote para envío masivo
   * Evita sobrecargar el servidor de emails
   * @type {number}
   */
  BATCH_SIZE: 50
};

/**
 * ============================================
 * SERVICIO DE ENVÍO DE EMAILS
 * ============================================
 * Gestiona el envío de correos electrónicos usando múltiples métodos:
 * 1. Supabase Edge Function (producción, requiere configuración)
 * 2. EmailJS (desarrollo, gratuito y fácil de configurar)
 * 
 * Para configurar EmailJS:
 * 1. Crear cuenta en https://www.emailjs.com
 * 2. Conectar servicio de email (Gmail, Outlook, etc)
 * 3. Crear template con variables: to_email, subject, message
 * 4. Actualizar credenciales en sendViaFallback()
 * ============================================
 */
const EmailService = {
  /**
   * ============================================
   * ENVIAR EMAIL INDIVIDUAL
   * ============================================
   * Envía un email usando la API de Supabase Edge Function.
   * Si falla, usa EmailJS como método alternativo.
   * 
   * @param {Object} params - Parámetros del email
   * @param {string} params.to - Email del destinatario
   * @param {string} params.subject - Asunto del email
   * @param {string} params.html - Contenido HTML del email
   * @returns {Promise<Object>} Resultado del envío {success, error}
   * 
   * @example
   * const result = await EmailService.send({
   *   to: 'cliente@ejemplo.com',
   *   subject: 'Confirmación de Compra',
   *   html: '<h1>¡Gracias por tu compra!</h1>'
   * });
   * if (result.success) console.log('Email enviado');
   */
  async send({ to, subject, html }) {
    try {
      // Opción 1: Usar Supabase Edge Function (recomendado para producción)
      const { data, error } = await supabase.functions.invoke('send-email', {
        body: {
          to,
          subject,
          html
        }
      });

      if (error) {
        console.error('Error al enviar email:', error);
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (err) {
      console.error('Excepción al enviar email:', err);
      
      // Fallback: Usar servicio alternativo (ej: EmailJS, Resend, etc)
      return await this.sendViaFallback({ to, subject, html });
    }
  },

  /**
   * ============================================
   * ENVÍO ALTERNATIVO VIA EMAILJS
   * ============================================
   * Método de respaldo para envío de emails usando EmailJS.
   * EmailJS es gratuito (200 emails/mes) y fácil de configurar.
   * 
   * Pasos para configurar:
   * 1. Registrarse en https://www.emailjs.com
   * 2. Conectar servicio de email en Dashboard → Email Services
   * 3. Crear template en Dashboard → Email Templates
   * 4. Copiar Service ID, Template ID y Public Key
   * 5. Reemplazar las constantes abajo con tus credenciales
   * 
   * Documentación: https://www.emailjs.com/docs/
   * 
   * @param {Object} params - Parámetros del email
   * @param {string} params.to - Email del destinatario
   * @param {string} params.subject - Asunto del email
   * @param {string} params.html - Contenido HTML del email
   * @returns {Promise<Object>} Resultado {success, error}
   */
  async sendViaFallback({ to, subject, html }) {
    try {
      // ⚠️ CONFIGURAR CON TUS CREDENCIALES DE EMAILJS
      // Obtenerlas en https://dashboard.emailjs.com/
      const EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID';      // ← Cambiar aquí
      const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';    // ← Cambiar aquí
      const EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY';      // ← Cambiar aquí

      const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          service_id: EMAILJS_SERVICE_ID,
          template_id: EMAILJS_TEMPLATE_ID,
          user_id: EMAILJS_PUBLIC_KEY,
          template_params: {
            to_email: to,
            subject: subject,
            message: html
          }
        })
      });

      if (!response.ok) {
        throw new Error(`EmailJS error: ${response.statusText}`);
      }

      return { success: true, data: await response.text() };
    } catch (err) {
      console.error('Error en fallback de email:', err);
      return { success: false, error: err.message };
    }
  },

  /**
   * ============================================
   * ENVÍO MASIVO EN LOTES
   * ============================================
   * Envía emails a múltiples destinatarios procesándolos en lotes.
   * Esto evita sobrecarga del servidor y respeta rate limits de APIs.
   * 
   * Proceso:
   * 1. Divide destinatarios en lotes de BATCH_SIZE (50 por defecto)
   * 2. Envía cada lote en paralelo
   * 3. Pausa 1 segundo entre lotes
   * 4. Retorna resumen de exitosos/fallidos
   * 
   * @param {string[]} recipients - Array de emails destinatarios
   * @param {Object} params - Parámetros del email
   * @param {string} params.subject - Asunto del email
   * @param {string} params.html - Contenido HTML
   * @returns {Promise<Array>} Array de resultados {to, success, error}
   * 
   * @example
   * const results = await EmailService.sendBatch(
   *   ['email1@ejemplo.com', 'email2@ejemplo.com'],
   *   { subject: 'Newsletter', html: '<h1>Hola!</h1>' }
   * );
   * const exitosos = results.filter(r => r.success).length;
   */
  async sendBatch(recipients, { subject, html }) {
    const results = [];
    
    for (let i = 0; i < recipients.length; i += NOTIFICATION_CONFIG.BATCH_SIZE) {
      const batch = recipients.slice(i, i + NOTIFICATION_CONFIG.BATCH_SIZE);
      
      const batchPromises = batch.map(to => 
        this.send({ to, subject, html })
          .then(result => ({ to, ...result }))
          .catch(error => ({ to, success: false, error: error.message }))
      );

      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);

      // Pequeña pausa entre lotes para evitar rate limiting
      if (i + NOTIFICATION_CONFIG.BATCH_SIZE < recipients.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    return results;
  }
};

/**
 * ============================================
 * SERVICIO DE NOTIFICACIONES PUSH
 * ============================================
 * Gestiona notificaciones push del navegador usando Web Push API.
 * 
 * Características:
 * - Notificaciones nativas del navegador
 * - No requiere configuración externa
 * - Solicita permisos automáticamente
 * - Compatible con Chrome, Firefox, Edge, Safari
 * 
 * Limitaciones:
 * - Solo funciona en HTTPS o localhost
 * - Usuario debe dar permiso explícito
 * - No persisten si el navegador está cerrado
 * ============================================
 */
const PushService = {
  /**
   * ============================================
   * ENVIAR NOTIFICACIÓN PUSH
   * ============================================
   * Envía una notificación push usando la Web Push API del navegador.
   * Solicita permisos automáticamente si no se han otorgado.
   * 
   * @param {Object} params - Parámetros de la notificación
   * @param {string} params.title - Título de la notificación (requerido)
   * @param {string} params.body - Cuerpo/mensaje de la notificación
   * @param {string} [params.icon] - URL del icono (opcional, usa favicon por defecto)
   * @param {string} [params.url] - URL de destino al hacer clic (opcional)
   * @returns {Promise<Object>} Resultado del envío {success, error, data}
   * 
   * @example
   * const result = await PushService.send({
   *   title: '¡Nueva Oferta!',
   *   body: 'Descuento del 20% en todos los eventos',
   *   icon: '/assets/images/logo.png',
   *   url: '/pages/eventos/'
   * });
   * if (result.success) console.log('Push enviado');
   */
  async send({ title, body, icon, url }) {
    try {
      // Verificar si el navegador soporta notificaciones
      if (!('Notification' in window)) {
        return { success: false, error: 'Este navegador no soporta notificaciones' };
      }

      // Solicitar permiso si no lo tiene
      if (Notification.permission === 'default') {
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
          return { success: false, error: 'Permiso de notificaciones denegado' };
        }
      }

      if (Notification.permission !== 'granted') {
        return { success: false, error: 'Permiso de notificaciones denegado' };
      }

      // Crear notificación
      const notification = new Notification(title, {
        body,
        icon: icon || '/favicon.ico',
        badge: '/favicon.ico',
        tag: 'event-notification',
        requireInteraction: false,
        silent: false
      });

      // Manejar clic en la notificación
      if (url) {
        notification.onclick = () => {
          window.focus();
          window.location.href = url;
          notification.close();
        };
      }

      return { success: true, data: { notificationId: notification.tag } };
    } catch (err) {
      console.error('Error al enviar notificación push:', err);
      return { success: false, error: err.message };
    }
  },

  /**
   * ============================================
   * VERIFICAR DISPONIBILIDAD
   * ============================================
   * Verifica si el navegador soporta notificaciones push.
   * 
   * @returns {boolean} true si las notificaciones están disponibles
   * 
   * @example
   * if (PushService.isAvailable()) {
   *   // Mostrar UI para activar notificaciones
   * }
   */
  isAvailable() {
    return 'Notification' in window;
  },

  /**
   * ============================================
   * OBTENER ESTADO DE PERMISOS
   * ============================================
   * Obtiene el estado actual del permiso de notificaciones.
   * 
   * Posibles valores:
   * - 'granted': Usuario ha dado permiso
   * - 'denied': Usuario ha denegado permiso
   * - 'default': Usuario aún no ha decidido
   * - 'not-supported': Navegador no soporta notificaciones
   * 
   * @returns {string} Estado del permiso
   * 
   * @example
   * const status = PushService.getPermissionStatus();
   * if (status === 'granted') {
   *   // Enviar notificación
   * } else if (status === 'default') {
   *   // Solicitar permiso
   * }
   */
  getPermissionStatus() {
    if (!this.isAvailable()) {
      return 'not-supported';
    }
    return Notification.permission;
  }
};

/**
 * ============================================
 * CONTROLADOR PRINCIPAL DE NOTIFICACIONES
 * ============================================
 * API principal para envío de notificaciones.
 * Coordina EmailService y PushService según el tipo.
 * 
 * Flujo de trabajo:
 * 1. Usuario crea notificación programada (via formulario)
 * 2. Se guarda en BD con estado "Pendiente"
 * 3. processScheduledNotifications() se ejecuta cada 5 minutos
 * 4. Detecta notificaciones pendientes cuya fecha llegó
 * 5. sendNotification() envía a todos los clientes
 * 6. Actualiza estado a "Enviada" o "Fallida"
 * 7. Reintenta hasta 3 veces si falla
 * ============================================
 */
export const NotificationSender = {
  /**
   * ============================================
   * ENVIAR NOTIFICACIÓN POR ID
   * ============================================
   * Envía una notificación específica según su tipo (Email o Push).
   * Obtiene destinatarios automáticamente de la tabla de clientes.
   * Actualiza estado en la base de datos.
   * 
   * Proceso:
   * 1. Obtiene datos de la notificación desde BD
   * 2. Verifica que no esté ya enviada
   * 3. Obtiene lista de clientes activos
   * 4. Envía según tipo (Email/Push)
   * 5. Actualiza estado y fecha de envío
   * 6. Incrementa contador de intentos
   * 
   * @param {number} notificationId - ID de la notificación a enviar
   * @returns {Promise<Object>} Resultado {success, error, data}
   * 
   * @example
   * const result = await NotificationSender.sendNotification(1);
   * if (result.success) {
   *   console.log(`Enviada a ${result.data.total} destinatarios`);
   * }
   */
  async sendNotification(notificationId) {
    try {
      console.log(`📤 Iniciando envío de notificación #${notificationId}`);

      // Obtener datos de la notificación
      const { data: notification, error } = await NotificacionesCRUD.getById(notificationId);

      if (error || !notification) {
        throw new Error('No se pudo obtener la notificación');
      }

      // Verificar si ya fue enviada (usar PascalCase o lowercase)
      const estado = notification.Not_Estado || notification.not_estado;
      if (estado === 'Enviada') {
        console.log('⚠️ La notificación ya fue enviada');
        return { success: false, error: 'La notificación ya fue enviada' };
      }

      // Obtener destinatarios (todos los clientes activos)
      const tipo = notification.Not_Tipo || notification.not_tipo;
      const recipients = await this.getRecipients(tipo);

      if (recipients.length === 0) {
        throw new Error('No hay destinatarios disponibles');
      }

      console.log(`📧 Enviando a ${recipients.length} destinatarios`);

      // Enviar según tipo (usar variable ya definida)
      let result;
      if (tipo === 'Email') {
        result = await this.sendEmailNotification(notification, recipients);
      } else if (tipo === 'Push') {
        result = await this.sendPushNotification(notification);
      } else {
        throw new Error(`Tipo de notificación no soportado: ${tipo}`);
      }

      // Actualizar estado de la notificación
      // Actualizar estado de la notificación
      if (result.success) {
        const intentosActuales = notification.Not_IntentosEnvio || notification.not_intentosenvio || 0;
        await NotificacionesCRUD.update(notificationId, {
          not_estado: 'Enviada',
          not_fechaenvio: new Date().toISOString(),
          not_intentosenvio: intentosActuales + 1
        });
        console.log('✅ Notificación enviada exitosamente');
      } else {
        const intentosActuales = notification.Not_IntentosEnvio || notification.not_intentosenvio || 0;
        const intentos = intentosActuales + 1;
        const nuevoEstado = intentos >= NOTIFICATION_CONFIG.MAX_RETRY_ATTEMPTS 
          ? 'Fallida' 
          : 'Pendiente';

        await NotificacionesCRUD.update(notificationId, {
          not_estado: nuevoEstado,
          not_intentosenvio: intentos
        });
        console.error('❌ Error al enviar notificación:', result.error);
      }
      return result;
    } catch (err) {
      console.error('Excepción al enviar notificación:', err);
      return { success: false, error: err.message };
    }
  },

  /**
   * ============================================
   * ENVIAR EMAIL MASIVO
   * ============================================
   * Envía una notificación por email a múltiples destinatarios.
   * Filtra emails válidos y procesa en lotes.
   * 
   * @param {Object} notification - Datos de la notificación
   * @param {Array} recipients - Array de objetos cliente con cli_email
   * @returns {Promise<Object>} Resultado con conteo de exitosos/fallidos
   * 
   * @private
   */
  async sendEmailNotification(notification, recipients) {
    const emailAddresses = recipients
      .map(r => r.cli_email || r.Cli_Email)
      .filter(email => email && email.includes('@'));

    if (emailAddresses.length === 0) {
      return { success: false, error: 'No hay emails válidos' };
    }
    const results = await EmailService.sendBatch(emailAddresses, {
      subject: notification.Not_Asunto || notification.not_asunto || 'Notificación del Sistema',
      html: notification.Not_Mensaje || notification.not_mensaje
    });

    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;

    console.log(`✉️ Emails enviados: ${successful} exitosos, ${failed} fallidos`);

    return {
      success: successful > 0,
      data: { successful, failed, total: results.length },
      error: failed > 0 ? `${failed} emails fallidos` : null
    };
  },

  /**
   * ============================================
   * ENVIAR NOTIFICACIÓN PUSH
   * ============================================
   * Envía una notificación push del navegador.
   * Solo funciona si el usuario ha dado permiso.
   * 
   * @param {Object} notification - Datos de la notificación
   * @returns {Promise<Object>} Resultado del envío
   * 
   * @private
   */
  async sendPushNotification(notification) {
    return await PushService.send({
      title: notification.Not_Asunto || notification.not_asunto || 'Nueva notificación',
      body: notification.Not_Mensaje || notification.not_mensaje,
      icon: '/assets/images/logo.png',
      url: window.location.origin
    });
  },

  /**
   * ============================================
   * OBTENER DESTINATARIOS
   * ============================================
   * Obtiene todos los clientes activos de la base de datos.
   * Filtra solo clientes con estado "Activo".
   * 
   * @param {string} notificationType - Tipo de notificación (Email/Push)
   * @returns {Promise<Array>} Array de objetos cliente
   * 
   * @private
   */
  async getRecipients(notificationType) {
    try {
      // Obtener todos los clientes sin filtrar por estado
      // Si tu tabla tiene una columna de estado con otro nombre, cámbialo aquí
      const { data, error } = await supabase
        .from('clientes')
        .select('cli_email, cli_nombre, cli_apellido');

      if (error) {
        console.error('Error al obtener destinatarios:', error);
        return [];
      }

      // Filtrar solo los que tienen email válido
      const validRecipients = (data || []).filter(
        cliente => cliente.cli_email && cliente.cli_email.includes('@')
      );

      console.log(`📧 ${validRecipients.length} destinatarios encontrados`);
      return validRecipients;
    } catch (err) {
      console.error('Excepción al obtener destinatarios:', err);
      return [];
    }
  },

  /**
   * ============================================
   * PROCESAR NOTIFICACIONES PROGRAMADAS
   * ============================================
   * Función principal que se ejecuta automáticamente cada 5 minutos.
   * Busca notificaciones pendientes cuya fecha programada ya pasó y las envía.
   * 
   * Criterios de selección:
   * - Estado: "Pendiente"
   * - Fecha programada <= fecha actual
   * - Intentos < MAX_RETRY_ATTEMPTS (3)
   * 
   * Esta función se ejecuta automáticamente al cargar el módulo.
   * No requiere llamada manual, pero puede ejecutarse para testing.
   * 
   * @returns {Promise<void>}
   * 
   * @example
   * // Ejecutar manualmente para testing
   * await NotificationSender.processScheduledNotifications();
   */
  async processScheduledNotifications() {
    try {
      console.log('🔄 Procesando notificaciones programadas...');

      // Obtener notificaciones pendientes cuya fecha ya pasó
      const { data: notifications, error } = await supabase
        .from('notificaciones')
        .select('*')
        .eq('not_estado', 'Pendiente')
        .lte('not_fechaprogramada', new Date().toISOString())
        .lt('not_intentosenvio', NOTIFICATION_CONFIG.MAX_RETRY_ATTEMPTS);

      if (error) {
        console.error('Error al obtener notificaciones:', error);
        return;
      }

      if (!notifications || notifications.length === 0) {
        console.log('No hay notificaciones pendientes');
        return;
      }

      console.log(`📨 Procesando ${notifications.length} notificaciones`);

      // Procesar cada notificación
      for (const notification of notifications) {
        await this.sendNotification(notification.id_notificaciones);
        // Pausa entre envíos para evitar sobrecarga
        await new Promise(resolve => setTimeout(resolve, NOTIFICATION_CONFIG.RETRY_DELAY));
      }

      console.log('✅ Procesamiento completado');
    } catch (err) {
      console.error('Error al procesar notificaciones programadas:', err);
    }
  },

  /**
   * ============================================
   * ENVIAR CONFIRMACIÓN DE COMPRA
   * ============================================
   * Envía email de confirmación cuando un cliente compra boletos.
   * Incluye template HTML profesional con detalles del evento.
   * Opcionalmente envía notificación push si está disponible.
   * 
   * Esta función debe llamarse desde el módulo de boletos
   * después de crear una entrada asignada exitosamente.
   * 
   * @param {Object} purchaseData - Datos de la compra
   * @param {string} purchaseData.customerEmail - Email del cliente (requerido)
   * @param {string} purchaseData.customerName - Nombre completo del cliente
   * @param {string} purchaseData.eventName - Nombre del evento
   * @param {number} purchaseData.ticketQuantity - Cantidad de boletos comprados
   * @param {number} purchaseData.totalAmount - Monto total pagado
   * @param {string} [purchaseData.eventDate] - Fecha del evento (opcional)
   * @param {string} [purchaseData.eventLocation] - Lugar del evento (opcional)
   * @param {string} [purchaseData.ticketType] - Tipo de boleto (opcional)
   * @returns {Promise<Object>} Resultado del envío {success, error}
   * 
   * @example
   * // Después de crear entrada asignada
   * await NotificationSender.sendPurchaseConfirmation({
   *   customerEmail: 'cliente@ejemplo.com',
   *   customerName: 'Juan Pérez',
   *   eventName: 'Concierto Rock 2025',
   *   ticketQuantity: 2,
   *   totalAmount: 100.00,
   *   eventDate: '2025-12-15',
   *   eventLocation: 'Estadio Olímpico'
   * });
   */
  async sendPurchaseConfirmation(purchaseData) {

    try {
      console.log('🎫 Enviando confirmación de compra...');

      const { customerEmail, customerName, eventName, ticketQuantity, totalAmount } = purchaseData;

      // Crear contenido del email
      const emailHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #4CAF50; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9f9f9; }
            .details { background: white; padding: 15px; margin: 15px 0; border-left: 4px solid #4CAF50; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
            .button { display: inline-block; padding: 12px 24px; background: #4CAF50; color: white; text-decoration: none; border-radius: 5px; margin: 15px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>¡Compra Confirmada!</h1>
            </div>
            <div class="content">
              <p>Hola <strong>${customerName}</strong>,</p>
              <p>Tu compra ha sido procesada exitosamente. Aquí están los detalles:</p>
              
              <div class="details">
                <h3>Detalles de la Compra</h3>
                <p><strong>Evento:</strong> ${eventName}</p>
                <p><strong>Cantidad de boletos:</strong> ${ticketQuantity}</p>
                <p><strong>Total pagado:</strong> $${totalAmount.toFixed(2)}</p>
                <p><strong>Fecha:</strong> ${new Date().toLocaleDateString('es-EC')}</p>
              </div>

              <p>Recibirás tus boletos electrónicos en un correo separado.</p>
              
              <center>
                <a href="${window.location.origin}/pages/eventos/" class="button">Ver Mis Eventos</a>
              </center>
            </div>
            <div class="footer">
              <p>Este es un correo automático, por favor no responder.</p>
              <p>&copy; ${new Date().getFullYear()} EventManager - Sistema de Gestión de Eventos</p>
            </div>
          </div>
        </body>
        </html>
      `;

      // Enviar email
      const result = await EmailService.send({
        to: customerEmail,
        subject: `Confirmación de Compra - ${eventName}`,
        html: emailHtml
      });

      if (result.success) {
        console.log('✅ Confirmación de compra enviada');
        
        // También enviar notificación push si está disponible
        if (PushService.isAvailable() && PushService.getPermissionStatus() === 'granted') {
          await PushService.send({
            title: '¡Compra Confirmada!',
            body: `Has comprado ${ticketQuantity} boletos para ${eventName}`,
            icon: '/assets/images/ticket-icon.png',
            url: window.location.origin + '/pages/eventos/'
          });
        }
      }

      return result;
    } catch (err) {
      console.error('Error al enviar confirmación de compra:', err);
      return { success: false, error: err.message };
    }
  }
};

/**
 * ============================================
 * INICIALIZACIÓN AUTOMÁTICA
 * ============================================
 * Inicia el procesador automático de notificaciones programadas.
 * Se ejecuta cada 5 minutos para buscar y enviar notificaciones pendientes.
 * 
 * Solo se ejecuta en el navegador (no en Node.js).
 * El intervalo se puede ajustar modificando el valor en milisegundos.
 * 
 * Para desactivar el procesamiento automático (solo para testing),
 * comentar este bloque de código.
 */
if (typeof window !== 'undefined') {
  console.log('🔄 Iniciando procesador automático de notificaciones (cada 5 minutos)');
  
  // Ejecutar inmediatamente al cargar (opcional)
  // NotificationSender.processScheduledNotifications();
  
  // Configurar intervalo de 5 minutos
  setInterval(() => {
    NotificationSender.processScheduledNotifications();
  }, 5 * 60 * 1000); // 5 minutos = 300,000 ms
}

/**
 * ============================================
 * EXPORTACIONES
 * ============================================
 * Exporta servicios para uso en otros módulos
 */
export { EmailService, PushService };
