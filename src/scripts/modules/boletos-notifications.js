/**
 * ============================================
 * INTEGRACIÓN: BOLETOS + NOTIFICACIONES
 * ============================================
 * Sistema de Gestión de Eventos - ESPOL
 * Responsable: ARMIJOS ROMERO ERICK DANILO
 * 
 * Módulo de integración entre el sistema de boletos y notificaciones.
 * Envía confirmaciones automáticas por email cuando se compran boletos.
 * 
 * Características:
 * - Email de confirmación con template HTML profesional
 * - Recupera información del cliente, boleto y evento automáticamente
 * - Notificación push opcional si está disponible
 * - Manejo de errores sin interrumpir el flujo de compra
 * 
 * Uso:
 * Importar en el módulo de boletos y llamar después de crear entrada asignada.
 * 
 * @module boletos-notifications
 * @requires notification-sender
 * @requires supabase-client
 * ============================================
 */

import { NotificationSender } from './notification-sender.js';
import { supabase } from '../supabase-client.js';

/**
 * ============================================
 * HOOK: BOLETO COMPRADO
 * ============================================
 * Función principal que se llama después de completar una compra.
 * Recupera toda la información necesaria de la BD y envía confirmación.
 * 
 * Flujo:
 * 1. Obtiene datos del cliente (nombre, email)
 * 2. Obtiene datos del boleto y evento asociado
 * 3. Formatea información para el email
 * 4. Llama a sendEnhancedPurchaseConfirmation()
 * 5. Retorna resultado (éxito/error)
 * 
 * Nota: Los errores no interrumpen el flujo de compra.
 * Si falla el envío, la compra ya está guardada en BD.
 * 
 * @param {Object} purchaseInfo - Información básica de la compra
 * @param {number} purchaseInfo.clienteId - ID del cliente que compra (requerido)
 * @param {number} purchaseInfo.boletoId - ID del boleto comprado (requerido)
 * @param {number} purchaseInfo.cantidad - Cantidad de boletos (requerido)
 * @param {number} purchaseInfo.precioTotal - Precio total pagado (requerido)
 * @returns {Promise<Object>} Resultado {success, error}
 * 
 * @example
 * // En el módulo de boletos, después de crear entrada asignada
 * const entradaResult = await crearEntradaAsignada({
 *   boletoId: 1,
 *   clienteId: 5,
 *   usuarioId: 2,
 *   cantidad: 2,
 *   fechaValida: '2025-12-31'
 * });
 * 
 * if (entradaResult.success) {
 *   // Enviar confirmación (no esperar, no bloquear)
 *   onBoletoComprado({
 *     clienteId: 5,
 *     boletoId: 1,
 *     cantidad: 2,
 *     precioTotal: 100.00
 *   }).catch(err => {
 *     console.error('Error al enviar confirmación (no crítico):', err);
 *   });
 *   
 *   // Continuar con el flujo normal
 *   alert('¡Compra exitosa!');
 *   window.location.href = './index.html';
 * }
 */
export async function onBoletoComprado(purchaseInfo) {
  try {
    console.log('🎫 Procesando compra de boleto...');

    // Obtener información del cliente
    const { data: cliente, error: clienteError } = await supabase
      .from('clientes')
      .select('cli_nombre, cli_apellido, cli_email')
      .eq('id_clientes', purchaseInfo.clienteId)
      .single();

    if (clienteError || !cliente) {
      console.error('Error al obtener información del cliente:', clienteError);
      return { success: false, error: 'Cliente no encontrado' };
    }

    // Obtener información del boleto y evento
    const { data: boleto, error: boletoError } = await supabase
      .from('boleto')
      .select(`
        *,
        eventos:id_evento_fk(
          evt_nombre,
          evt_fecha,
          evt_lugar
        ),
        tiposboleto:id_tipoboleto_fk(
          tipb_nombre
        )
      `)
      .eq('id_boleto', purchaseInfo.boletoId)
      .single();

    if (boletoError || !boleto) {
      console.error('Error al obtener información del boleto:', boletoError);
      return { success: false, error: 'Boleto no encontrado' };
    }

    // Preparar datos para la notificación
    const customerName = `${cliente.cli_nombre} ${cliente.cli_apellido}`;
    const customerEmail = cliente.cli_email;
    const eventName = boleto.eventos?.evt_nombre || 'Evento';
    const eventDate = boleto.eventos?.evt_fecha 
      ? new Date(boleto.eventos.evt_fecha).toLocaleDateString('es-EC', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      : 'Por confirmar';
    const eventLocation = boleto.eventos?.evt_lugar || 'Por confirmar';
    const ticketType = boleto.tiposboleto?.tipb_nombre || 'General';
    const ticketQuantity = purchaseInfo.cantidad;
    const totalAmount = purchaseInfo.precioTotal;

    // Enviar confirmación de compra
    const result = await NotificationSender.sendPurchaseConfirmation({
      customerEmail,
      customerName,
      eventName,
      eventDate,
      eventLocation,
      ticketType,
      ticketQuantity,
      totalAmount
    });

    if (result.success) {
      console.log('✅ Notificación de compra enviada exitosamente');
    } else {
      console.error('❌ Error al enviar notificación de compra:', result.error);
    }

    return result;
  } catch (err) {
    console.error('Excepción al procesar compra de boleto:', err);
    return { success: false, error: err.message };
  }
}

/**
 * ============================================
 * ENVIAR CONFIRMACIÓN MEJORADA
 * ============================================
 * Versión mejorada del email de confirmación con más detalles.
 * Incluye template HTML profesional con diseño responsivo.
 * 
 * Características del email:
 * - Diseño moderno con gradientes
 * - Tarjeta de boleto visual
 * - Detalles completos del evento
 * - Resumen de compra
 * - Instrucciones para el día del evento
 * - Links a redes sociales
 * - Responsivo (mobile-friendly)
 * 
 * @param {Object} purchaseData - Datos completos de la compra
 * @param {string} purchaseData.customerEmail - Email destinatario
 * @param {string} purchaseData.customerName - Nombre del cliente
 * @param {string} purchaseData.eventName - Nombre del evento
 * @param {string} purchaseData.eventDate - Fecha formateada del evento
 * @param {string} purchaseData.eventLocation - Ubicación del evento
 * @param {string} purchaseData.ticketType - Tipo de boleto
 * @param {number} purchaseData.ticketQuantity - Cantidad
 * @param {number} purchaseData.totalAmount - Total pagado
 * @returns {Promise<Object>} Resultado {success, error}
 * 
 * @private
 */
export async function sendEnhancedPurchaseConfirmation(purchaseData) {
  const {
    customerEmail,
    customerName,
    eventName,
    eventDate,
    eventLocation,
    ticketType,
    ticketQuantity,
    totalAmount
  } = purchaseData;

  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.6; 
          color: #333;
          background-color: #f4f4f4;
        }
        .container { 
          max-width: 600px; 
          margin: 20px auto; 
          background: white;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header { 
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white; 
          padding: 40px 20px; 
          text-align: center; 
        }
        .header h1 { 
          font-size: 28px; 
          margin-bottom: 10px;
        }
        .header p { 
          font-size: 16px; 
          opacity: 0.9;
        }
        .content { 
          padding: 30px; 
        }
        .greeting { 
          font-size: 18px; 
          margin-bottom: 20px;
        }
        .ticket-card {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 10px;
          padding: 20px;
          color: white;
          margin: 20px 0;
        }
        .ticket-card h2 {
          font-size: 24px;
          margin-bottom: 15px;
        }
        .ticket-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin: 10px 0;
          padding: 10px 0;
          border-top: 1px solid rgba(255,255,255,0.2);
        }
        .ticket-info:first-child {
          border-top: none;
        }
        .ticket-label {
          font-size: 14px;
          opacity: 0.9;
        }
        .ticket-value {
          font-size: 16px;
          font-weight: bold;
        }
        .details { 
          background: #f9f9f9; 
          padding: 20px; 
          margin: 20px 0; 
          border-radius: 8px;
          border-left: 4px solid #667eea; 
        }
        .details h3 {
          color: #667eea;
          margin-bottom: 15px;
          font-size: 18px;
        }
        .detail-row {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px solid #e0e0e0;
        }
        .detail-row:last-child {
          border-bottom: none;
          font-weight: bold;
          font-size: 18px;
          color: #667eea;
        }
        .button { 
          display: inline-block; 
          padding: 14px 30px; 
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white; 
          text-decoration: none; 
          border-radius: 8px; 
          margin: 20px 0;
          font-weight: bold;
          transition: transform 0.2s;
        }
        .button:hover {
          transform: translateY(-2px);
        }
        .info-box {
          background: #fff3cd;
          border: 1px solid #ffc107;
          border-radius: 8px;
          padding: 15px;
          margin: 20px 0;
        }
        .info-box p {
          margin: 5px 0;
          color: #856404;
        }
        .footer { 
          text-align: center; 
          padding: 20px; 
          background: #f9f9f9;
          color: #666; 
          font-size: 13px; 
        }
        .footer p {
          margin: 5px 0;
        }
        .social-links {
          margin: 15px 0;
        }
        .social-links a {
          display: inline-block;
          margin: 0 10px;
          color: #667eea;
          text-decoration: none;
        }
        @media only screen and (max-width: 600px) {
          .container { margin: 0; border-radius: 0; }
          .content { padding: 20px; }
          .ticket-card { padding: 15px; }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 ¡Compra Confirmada!</h1>
          <p>Tu entrada está lista</p>
        </div>
        
        <div class="content">
          <p class="greeting">Hola <strong>${customerName}</strong>,</p>
          <p>¡Felicitaciones! Tu compra ha sido procesada exitosamente. Aquí están los detalles de tu entrada:</p>
          
          <div class="ticket-card">
            <h2>🎫 ${eventName}</h2>
            <div class="ticket-info">
              <span class="ticket-label">📅 Fecha</span>
              <span class="ticket-value">${eventDate}</span>
            </div>
            <div class="ticket-info">
              <span class="ticket-label">📍 Lugar</span>
              <span class="ticket-value">${eventLocation}</span>
            </div>
            <div class="ticket-info">
              <span class="ticket-label">🎟️ Tipo</span>
              <span class="ticket-value">${ticketType}</span>
            </div>
            <div class="ticket-info">
              <span class="ticket-label">🔢 Cantidad</span>
              <span class="ticket-value">${ticketQuantity} boleto${ticketQuantity > 1 ? 's' : ''}</span>
            </div>
          </div>

          <div class="details">
            <h3>💳 Resumen de Compra</h3>
            <div class="detail-row">
              <span>Subtotal</span>
              <span>$${totalAmount.toFixed(2)}</span>
            </div>
            <div class="detail-row">
              <span>Fecha de compra</span>
              <span>${new Date().toLocaleDateString('es-EC')}</span>
            </div>
            <div class="detail-row">
              <span>Total Pagado</span>
              <span>$${totalAmount.toFixed(2)}</span>
            </div>
          </div>

          <div class="info-box">
            <p><strong>📧 ¿Qué sigue?</strong></p>
            <p>• Recibirás tus boletos electrónicos en un correo separado</p>
            <p>• Presenta tu código QR en el evento</p>
            <p>• Llega 30 minutos antes para evitar contratiempos</p>
          </div>
          
          <center>
            <a href="${typeof window !== 'undefined' ? window.location.origin : ''}/pages/eventos/" class="button">
              Ver Mis Eventos
            </a>
          </center>
        </div>
        
        <div class="footer">
          <p><strong>EventManager</strong> - Sistema de Gestión de Eventos</p>
          <p>Este es un correo automático, por favor no responder.</p>
          <div class="social-links">
            <a href="#">Facebook</a> • 
            <a href="#">Twitter</a> • 
            <a href="#">Instagram</a>
          </div>
          <p style="margin-top: 10px;">&copy; ${new Date().getFullYear()} EventManager. Todos los derechos reservados.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  // Importar EmailService dinámicamente para evitar dependencias circulares
  const { EmailService, PushService } = await import('./notification-sender.js');

  // Enviar email
  const emailResult = await EmailService.send({
    to: customerEmail,
    subject: `✅ Confirmación de Compra - ${eventName}`,
    html: emailHtml
  });

  // Intentar enviar notificación push también
  if (PushService.isAvailable() && PushService.getPermissionStatus() === 'granted') {
    await PushService.send({
      title: '🎉 ¡Compra Confirmada!',
      body: `Has comprado ${ticketQuantity} boletos para ${eventName}`,
      icon: '/assets/images/ticket-icon.png',
      url: typeof window !== 'undefined' ? window.location.origin + '/pages/eventos/' : ''
    });
  }

  return emailResult;
}

/**
 * ============================================
 * SOBRESCRIBIR MÉTODO BASE
 * ============================================
 * Reemplaza el método básico de NotificationSender con la versión mejorada.
 * Esto permite que cualquier parte del sistema use la versión mejorada.
 */
if (typeof NotificationSender !== 'undefined') {
  NotificationSender.sendPurchaseConfirmation = sendEnhancedPurchaseConfirmation;
}

/**
 * ============================================
 * EXPORTACIÓN POR DEFECTO
 * ============================================
 * Exporta objeto con todas las funciones públicas del módulo
 */
export default {
  onBoletoComprado,
  sendEnhancedPurchaseConfirmation
};
