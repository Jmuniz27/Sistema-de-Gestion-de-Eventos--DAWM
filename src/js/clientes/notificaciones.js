/**
 * ============================================
 * VISTA: NOTIFICACIONES DEL CLIENTE (SOLO LECTURA)
 * ============================================
 * Archivo: src/js/clientes/notificaciones.js
 * 
 * PROPÓSITO:
 * Vista de notificaciones filtrada EXCLUSIVAMENTE para el cliente autenticado.
 * Muestra SOLO las notificaciones asignadas a ese cliente específico.
 * 
 * CARACTERÍSTICAS:
 * - Autenticación y validación del usuario cliente
 * - Tabla simplificada (2 columnas: ID, Asunto)
 * - Modal de vista previa con detalles completos
 * - SOLO LECTURA: No puede editar ni eliminar
 * 
 * FLUJO:
 * 1. Valida que el usuario esté autenticado
 * 2. Resuelve el id_clientes desde sesión o por email
 * 3. Obtiene notificaciones usando NotificacionesCRUD.getByCliente()
 * 4. Renderiza tabla con ID y Asunto
 * 5. Al hacer click, abre modal con detalles completos
 * 
 * PERMISOS:
 * Solo para usuarios CLIENTES autenticados
 * 
 * PÁGINA HTML:
 * pages/clientes/notificaciones.html
 * 
 * DIFERENCIA CON VISTA ADMIN:
 * - Esta muestra solo notificaciones del cliente (Cliente)
 * - La otra muestra TODAS las notificaciones (Admin)
 * - Esta NO permite editar/eliminar
 * ============================================
 */

import { NotificacionesCRUD } from '../../scripts/modules/notificaciones.js';
import { normalizeNotificacion, normalizeEstado, formatDate as formatDateUtil } from '../../scripts/utils.js';
import { escapeHtml, setTableMessage } from '../shared/table-helpers.js';
import stateManager from '../state-manager.js';

// ============================================
// CONSTANTES DE CONFIGURACION
// ============================================

/** ID del elemento tbody donde se renderiza la tabla de notificaciones */
const TABLE_BODY_ID = 'clientNotificationsTableBody';

/** Numero total de columnas de la tabla (para mensajes de estado con colspan) */
const TOTAL_COLUMNS = 2;

/** ID del contenedor principal del modal */
const MODAL_ID = 'clientNotificationModal';

/** ID del elemento que contiene el cuerpo del modal */
const MODAL_BODY_ID = 'clientNotificationModalBody';

/** ID del elemento que muestra el titulo del modal */
const MODAL_TITLE_ID = 'clientNotificationModalTitle';

/** Opciones de formato de fechas para las notificaciones */
const DATE_OPTIONS = {
  includeTime: true,
  locale: 'es-EC',
  format: {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  },
  fallback: '-'
};

// ============================================
// ESTADO DEL MODULO
// ============================================

/** Referencia al elemento tbody de la tabla */
let tableBodyRef = null;

/** Cache de las notificaciones cargadas del cliente actual */
let clienteNotifications = [];

/** ID del cliente autenticado actualmente */
let currentClienteId = null;

/** Referencias a los elementos DOM del modal */
const modalRefs = {
  modal: null,
  body: null,
  title: null
};

// ============================================
// INICIALIZACION
// ============================================

/**
 * Punto de entrada del modulo cuando el DOM esta listo.
 * Maneja errores globales durante la inicializacion.
 */
document.addEventListener('DOMContentLoaded', () => {
  initializeClientNotifications().catch(error => {
    console.error('Error inicializando las notificaciones del cliente:', error);
    if (tableBodyRef) {
      setTableMessage(tableBodyRef, 'Ocurrio un problema al cargar tus notificaciones.', TOTAL_COLUMNS, 'error');
    }
  });
});

/**
 * Inicializa el modulo de notificaciones para clientes.
 * Valida la autenticacion, resuelve el cliente actual, configura eventos y carga datos.
 * 
 * Flujo de inicializacion:
 * 1. Obtener referencia al elemento tbody de la tabla
 * 2. Validar que el usuario este autenticado
 * 3. Obtener datos del usuario actual desde el stateManager
 * 4. Resolver el id_clientes (desde el usuario o consultando Supabase)
 * 5. Inicializar el modal de vista previa
 * 6. Configurar listener para clicks en la tabla
 * 7. Cargar y renderizar las notificaciones del cliente
 * 
 * @async
 * @returns {Promise<void>}
 */
async function initializeClientNotifications() {
  // Obtener referencia al tbody de la tabla
  tableBodyRef = document.getElementById(TABLE_BODY_ID);
  if (!tableBodyRef) return;

  // Validar autenticacion del usuario
  if (!stateManager.isAuthenticated()) {
    redirectToLogin('Debes iniciar sesion para ver tus notificaciones.');
    return;
  }

  // Obtener usuario actual desde el state manager
  const currentUser = stateManager.getCurrentUser();
  if (!currentUser) {
    redirectToLogin('No se pudo obtener la informacion de tu sesion. Vuelve a iniciar sesion.');
    return;
  }

  // Resolver el ID del cliente (puede venir en el objeto user o requerir consulta a Supabase)
  await resolveClienteId(currentUser);
  if (!currentClienteId) {
    setTableMessage(tableBodyRef, 'No se encontro un perfil de cliente asociado a tu cuenta. Contacta al administrador.', TOTAL_COLUMNS, 'error');
    return;
  }

  // Configurar modal y eventos
  initializeModal();
  tableBodyRef.addEventListener('click', handleTableClick);

  // Cargar notificaciones del cliente
  await loadNotifications();
}

// ============================================
// GESTION DE CLIENTE
// ============================================

/**
 * Resuelve el ID del cliente autenticado.
 * Intenta obtenerlo desde el objeto user (puede venir como id_clientes, idCliente o id_Cliente_Fk).
 * Si no existe en el objeto, consulta la tabla clientes en Supabase usando el email del usuario.
 * 
 * @async
 * @param {Object} user - Objeto con datos del usuario autenticado
 * @param {string} [user.id_clientes] - ID del cliente (formato snake_case)
 * @param {string} [user.idCliente] - ID del cliente (formato camelCase)
 * @param {string} [user.id_Cliente_Fk] - ID del cliente (formato alternativo)
 * @param {string} [user.usuario_email] - Email del usuario (formato snake_case)
 * @param {string} [user.email] - Email del usuario (formato alternativo)
 * @returns {Promise<void>} Actualiza la variable global currentClienteId
 */
async function resolveClienteId(user) {
  // Intentar obtener el ID del cliente desde el objeto user (multiples formatos posibles)
  currentClienteId = user?.id_clientes || user?.idCliente || user?.id_Cliente_Fk || null;
  if (currentClienteId) return;

  // Si no existe el ID, intentar resolverlo consultando Supabase por email
  const email = user?.usuario_email || user?.email;
  if (!email) return;

  try {
    // Importar dinamicamente el cliente de Supabase
    const { supabase } = await import('../../scripts/supabase-client.js');
    
    // Consultar la tabla clientes usando el email
    const { data, error } = await supabase
      .from('clientes')
      .select('id_clientes')
      .eq('cli_email', email)
      .maybeSingle();

    if (error) {
      console.error('No se pudo obtener el cliente por email:', error);
      return;
    }

    // Guardar el ID del cliente si se encontro
    if (data?.id_clientes) {
      currentClienteId = data.id_clientes;
    }
  } catch (err) {
    console.error('Error resolviendo cliente:', err);
  }
}

// ============================================
// CARGA Y RENDERIZADO DE DATOS
// ============================================

/**
 * Carga las notificaciones asignadas al cliente autenticado.
 * Utiliza NotificacionesCRUD.getByCliente que une notificaciones directas
 * y notificaciones asignadas via tabla destinatarios.
 * 
 * Proceso:
 * 1. Mostrar mensaje de carga
 * 2. Llamar a getByCliente con el currentClienteId
 * 3. Normalizar cada notificacion usando normalizeNotificacion
 * 4. Preservar datos de destinatario si existen
 * 5. Renderizar tabla o mostrar mensaje si no hay datos
 * 
 * @async
 * @returns {Promise<void>}
 */
async function loadNotifications() {
  // Mostrar mensaje de carga mientras se obtienen los datos
  setTableMessage(tableBodyRef, 'Cargando notificaciones...', TOTAL_COLUMNS, 'loading');

  // Obtener notificaciones del cliente desde el CRUD
  // getByCliente une notificaciones directas + asignadas via destinatarios
  const { data, error } = await NotificacionesCRUD.getByCliente(currentClienteId);
  
  if (error) {
    console.error('Error al obtener notificaciones del cliente:', error);
    setTableMessage(tableBodyRef, 'No se pudieron cargar tus notificaciones. Intentalo mas tarde.', TOTAL_COLUMNS, 'error');
    return;
  }

  // Los datos ya vienen correctos desde el módulo, solo asignarlos
  clienteNotifications = data ?? [];

  // Si no hay notificaciones, mostrar mensaje informativo
  if (!clienteNotifications.length) {
    setTableMessage(tableBodyRef, 'Aun no tienes notificaciones asignadas.', TOTAL_COLUMNS, 'empty');
    return;
  }

  // Renderizar la tabla con las notificaciones obtenidas
  renderTable(clienteNotifications);
}

/**
 * Renderiza las notificaciones en la tabla HTML.
 * Genera filas con 2 columnas: ID y Asunto.
 * Cada fila incluye un atributo data-notification-id para identificacion en eventos.
 * 
 * @param {Array<Object>} rows - Array de notificaciones normalizadas
 * @param {string|number} rows[].id_notificaciones - ID de la notificacion
 * @param {string} rows[].not_asunto - Asunto de la notificacion
 * @returns {void}
 */
function renderTable(rows) {
  tableBodyRef.innerHTML = rows
    .map(notification => {
      // Obtener ID y asunto (en minúsculas porque Supabase devuelve así)
      const id = notification.id_notificaciones ?? '';
      const subject = notification.not_asunto || 'Sin asunto';

      // Generar fila HTML con datos escapados para prevenir XSS
      return `
        <tr data-notification-id="${escapeHtml(String(id))}">
          <td>${escapeHtml(id ? String(id) : '-')}</td>
          <td>${escapeHtml(subject)}</td>
        </tr>
      `;
    })
    .join('');
}

// ============================================
// MANEJO DE EVENTOS DE TABLA
// ============================================

/**
 * Maneja clicks en la tabla de notificaciones.
 * Detecta clicks en filas y abre el modal de vista previa con los detalles.
 * 
 * Proceso:
 * 1. Detectar si el click fue en una fila valida (tr con data-notification-id)
 * 2. Extraer el ID de la notificacion del atributo data
 * 3. Buscar la notificacion completa en el cache clienteNotifications
 * 4. Abrir el modal con los detalles de la notificacion
 * 
 * @param {Event} event - Evento click del DOM
 * @returns {void}
 */
function handleTableClick(event) {
  // Buscar el elemento <tr> mas cercano con data-notification-id
  const row = event.target.closest('tr[data-notification-id]');
  if (!row) return;

  // Extraer el ID de la notificacion desde el atributo data
  const notificationId = row.dataset.notificationId;
  if (!notificationId) return;

  // Buscar la notificacion completa en el cache (usar minúsculas)
  const notification = clienteNotifications.find(item => {
    const id = item.id_notificaciones;
    return String(id) === String(notificationId);
  });

  // Si se encuentra, abrir el modal con sus detalles
  if (!notification) return;
  openModal(notification);
}

// ============================================
// GESTION DEL MODAL DE VISTA PREVIA
// ============================================

/**
 * Inicializa el modal de vista previa de notificaciones.
 * Obtiene referencias a los elementos del DOM y configura event listeners.
 * 
 * Funcionalidades configuradas:
 * - Cierre al hacer click en el overlay o contenedor principal
 * - Cierre mediante botones con atributo [data-modal-close]
 * - Cierre con tecla Escape
 * 
 * @returns {void}
 */
function initializeModal() {
  // Obtener referencias a los elementos del modal
  modalRefs.modal = document.getElementById(MODAL_ID);
  modalRefs.body = document.getElementById(MODAL_BODY_ID);
  modalRefs.title = document.getElementById(MODAL_TITLE_ID);

  // Validar que todos los elementos existan
  if (!modalRefs.modal || !modalRefs.body || !modalRefs.title) {
    console.warn('Modal de notificaciones para clientes no esta presente en la pagina.');
    modalRefs.modal = null;
    modalRefs.body = null;
    modalRefs.title = null;
    return;
  }

  // Listener para cerrar al hacer click en el overlay o fondo del modal
  modalRefs.modal.addEventListener('click', event => {
    if (event.target === modalRefs.modal || event.target.classList.contains('modal-overlay') || event.target.dataset.modalClose === 'true') {
      closeModal();
    }
  });

  // Listener para todos los botones de cerrar dentro del modal
  const closeButtons = modalRefs.modal.querySelectorAll('[data-modal-close]');
  closeButtons.forEach(button => {
    button.addEventListener('click', closeModal);
  });

  // Listener global para cerrar con tecla Escape
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      closeModal();
    }
  });
}

/**
 * Abre el modal de vista previa con los detalles de una notificacion.
 * Formatea y escapa todos los datos antes de insertarlos en el HTML.
 * 
 * Informacion mostrada:
 * - Titulo: Asunto de la notificacion
 * - Metadatos: Estado, Fecha programada, Fecha de envio, Tipo
 * - Contenido: Mensaje completo con saltos de linea preservados
 * 
 * Accesibilidad:
 * - Actualiza aria-hidden a false
 * - Bloquea scroll del body mientras el modal esta abierto
 * 
 * @param {Object} notification - Objeto con los datos de la notificacion
 * @param {string} notification.Not_Asunto - Asunto de la notificacion
 * @param {string} notification.Not_Estado - Estado actual (Enviado, Pendiente, etc.)
 * @param {string} notification.Not_FechaProgramada - Fecha en que se programo
 * @param {string} notification.Not_FechaEnvio - Fecha en que se envio (si aplica)
 * @param {string} notification.Not_TipoEnvio - Tipo de envio (Email, Push, etc.)
 * @param {string} notification.Not_Mensaje - Contenido del mensaje
 * @returns {void}
 */
function openModal(notification) {
  // Validar que el modal este inicializado
  if (!modalRefs.modal || !modalRefs.body || !modalRefs.title) return;

  // Formatear datos de la notificacion (usar minúsculas porque Supabase devuelve así)
  const estado = formatEstado(notification.not_estado);
  const programada = formatDateUtil(notification.not_fechaprogramada, DATE_OPTIONS);
  const enviada = formatDateUtil(notification.not_fechaenvio, DATE_OPTIONS);
  const tipo = notification.not_tipo || 'Email';

  // Establecer el titulo del modal
  modalRefs.title.textContent = notification.not_asunto || 'Notificacion';

  // Escapar el mensaje y preservar saltos de linea convirtiendolos a <br>
  const safeMessage = escapeHtml(notification.not_mensaje || 'Sin contenido').replace(/\n/g, '<br>');

  // Construir el contenido HTML del modal
  modalRefs.body.innerHTML = `
    <div class="notification-preview">
      <ul class="notification-preview__meta">
        <li><strong>Estado:</strong> ${escapeHtml(estado)}</li>
        <li><strong>Programada:</strong> ${escapeHtml(programada)}</li>
        <li><strong>Enviada:</strong> ${escapeHtml(enviada)}</li>
        <li><strong>Tipo:</strong> ${escapeHtml(tipo)}</li>
      </ul>
      <div class="notification-preview__content">
        <h4>Mensaje</h4>
        <p>${safeMessage}</p>
      </div>
    </div>
  `;

  // Mostrar el modal y actualizar atributos de accesibilidad
  modalRefs.modal.classList.add('modal--open');
  modalRefs.modal.removeAttribute('aria-hidden');
  modalRefs.modal.removeAttribute('inert');
  
  // Bloquear scroll del body mientras el modal esta abierto
  document.body.style.overflow = 'hidden';
}

/**
 * Cierra el modal de vista previa.
 * Remueve clases de visibilidad y restaura el scroll del body.
 * 
 * @returns {void}
 */
function closeModal() {
  if (!modalRefs.modal) return;
  
  // Ocultar el modal
  modalRefs.modal.classList.remove('modal--open');
  
  // Actualizar atributos de accesibilidad (inert previene focus)
  modalRefs.modal.setAttribute('aria-hidden', 'true');
  modalRefs.modal.setAttribute('inert', '');
  
  // Restaurar scroll del body
  document.body.style.overflow = '';
}

// ============================================
// FUNCIONES AUXILIARES
// ============================================

/**
 * Formatea el estado de una notificacion para mostrar en UI.
 * Normaliza el valor y capitaliza la primera letra.
 * 
 * @param {string} value - Estado sin formatear (enviado, pendiente, programado, etc.)
 * @returns {string} Estado formateado con primera letra mayuscula
 * @example
 * formatEstado('enviado') // 'Enviado'
 * formatEstado('PENDIENTE') // 'Pendiente'
 * formatEstado('') // 'Pendiente'
 */
function formatEstado(value) {
  const normalized = normalizeEstado(value || '');
  return normalized ? normalized.charAt(0).toUpperCase() + normalized.slice(1) : 'Pendiente';
}

/**
 * Redirige al usuario a la pagina de login mostrando un mensaje.
 * Se usa cuando el usuario no esta autenticado o la sesion es invalida.
 * 
 * @param {string} message - Mensaje a mostrar antes de redirigir
 * @returns {void}
 */
function redirectToLogin(message) {
  alert(message);
  window.location.href = '../autenticacion/login.html';
}
