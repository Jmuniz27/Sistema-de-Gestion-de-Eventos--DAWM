/**
 * Archivo: src/scripts/utils.js
 * Propósito: Funciones utilitarias reutilizables en toda la aplicación
 *
 * Funciones a implementar:
 * - showModal(title, message, type): Mostrar modal con mensaje
 * - hideModal(): Ocultar modal
 * - showToast(message, type): Mostrar notificación temporal
 * - formatDate(date): Formatear fecha a formato local
 * - formatCurrency(amount): Formatear números a moneda
 * - getUrlParam(param): Obtener parámetro de URL
 * - validateEmail(email): Validar formato de email
 * - validatePhone(phone): Validar formato de teléfono
 * - sanitizeInput(input): Limpiar input para prevenir XSS
 * - exportToCSV(data, filename): Exportar datos a CSV
 * - exportToJSON(data, filename): Exportar datos a JSON
 * - exportToTXT(data, filename): Exportar datos a TXT
 * - debounce(func, delay): Función debounce para búsquedas
 * - paginate(data, page, perPage): Paginar resultados
 *
 * Uso:
 * import { showModal, formatDate } from './utils.js'
 * showModal('Éxito', 'Cliente creado correctamente', 'success')
 *
 * Usado por:
 * - Todos los módulos
 * - Todas las páginas
 */

/**
 * Mostrar modal
 * @param {string} title - Título del modal
 * @param {string} message - Mensaje del modal
 * @param {string} type - Tipo: 'success', 'error', 'warning', 'info'
 */
export function showModal(title, message, type = 'info') {
  // TODO: Implementar
}

/**
 * Obtener parámetro de URL
 * @param {string} param - Nombre del parámetro
 * @returns {string|null} - Valor del parámetro o null
 */
export function getUrlParam(param) {
  // TODO: Implementar usando URLSearchParams
}

/**
 * Validar formato de email
 * @param {string} email - Email a validar
 * @returns {boolean} - true si es válido
 */
export function validateEmail(email) {
  // TODO: Implementar regex de validación
}

/**
 * Formatear fecha
 * @param {string|Date} date - Fecha a formatear
 * @returns {string} - Fecha formateada
 */
//export function formatDate(date) {
  // TODO: Implementar usando Intl.DateTimeFormat
//}
/**
 * ============================================
 * FORMATEO DE FECHAS
 * ============================================
 */

/**
 * Formatea una fecha a formato local español
 * @param {string} dateString - Fecha en formato ISO
 * @param {boolean} includeTime - Si incluir hora o solo fecha
 * @returns {string} Fecha formateada
 */
export function formatDate(
  dateInput,
  {
    includeTime = true,
    locale = 'es-ES',
    fallback = '-',
    format
  } = {}
) {
  if (!dateInput) return fallback;

  const date = new Date(dateInput);
  if (Number.isNaN(date.getTime())) return fallback;

  const baseFormat = format
    ? { ...format }
    : { day: '2-digit', month: '2-digit', year: 'numeric' };

  if (includeTime) {
    baseFormat.hour = baseFormat.hour ?? '2-digit';
    baseFormat.minute = baseFormat.minute ?? '2-digit';
  }

  return date.toLocaleString(locale, baseFormat);
}


// TODO: Implementar resto de funciones utilitarias

/**
 * ============================================
 * GESTIÓN DE MODALES
 * ============================================
 */

/**
 * Abre un modal por su ID
 * @param {string} modalId - ID del modal a abrir
 */
export function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('active');
  }
}

/**
 * Cierra un modal por su ID
 * @param {string} modalId - ID del modal a cerrar
 */
export function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('active');
  }
}

/**
 * Cierra todos los modales abiertos
 */
export function closeAllModals() {
  document.querySelectorAll('.modal').forEach(modal => {
    modal.classList.remove('active');
  });
}

/**
 * ============================================
 * GESTIÓN DEL MENÚ MÓVIL
 * ============================================
 */

/**
 * Alterna el menú de navegación móvil
 */
function toggleMobileMenu() {
  const nav = document.getElementById('mainNav');
  const btn = document.getElementById('mobileMenuBtn');
  
  if (nav && btn) {
    nav.classList.toggle('active');
    btn.classList.toggle('active');
  }
}

/**
 * Cierra el menú de navegación móvil
 */
function closeMobileMenu() {
  const nav = document.getElementById('mainNav');
  const btn = document.getElementById('mobileMenuBtn');
  
  if (nav && btn) {
    nav.classList.remove('active');
    btn.classList.remove('active');
  }
}

/**
 * ============================================
 * ICONOS SVG
 * ============================================
 */

/**
 * Obtiene el icono SVG según el tipo de envío
 * @param {string} tipo - Tipo de envío (Email, Push, SMS)
 * @returns {string} HTML del icono SVG
 */
export function getTipoIcon(tipo) {
  const icons = {
    'Email': '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>',
    'Push': '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>',
  };
  return icons[tipo] || '';
}

/**
 * ============================================
 * BADGES DE ESTADO
 * ============================================
 */

/**
 * Genera un badge HTML según el estado
 * @param {string} estado - Estado de la notificación
 * @returns {string} HTML del badge
 */
export function getEstadoBadge(estado) {
  const e = normalizeEstado(estado); 
  const variants = {
    'enviado': 'status-enviado',
    'programado': 'status-programado',
    'pendiente': 'status-pendiente',
    'cancelado': 'status-cancelado',
    'fallido': 'status-fallido'
  };
  
  return `<span class="notification-status ${variants[e] || 'status-programado'}">${e}</span>`;
}


/**
 * ============================================
 * REEMPLAZO DE VARIABLES
 * ============================================
 */

/**
 * Reemplaza variables en un texto con sus valores
 * @param {string} text - Texto con variables en formato {variable}
 * @param {Object} data - Objeto con los valores de las variables
 * @returns {string} Texto con variables reemplazadas
 */
function replaceVariables(text, data) {
  if (!text || !data) return text;
  
  let result = text;
  Object.keys(data).forEach(key => {
    const regex = new RegExp(`{${key}}`, 'g');
    result = result.replace(regex, data[key]);
  });
  return result;
}

/**
 * Extrae variables de un texto
 * @param {string} text - Texto con variables en formato {variable}
 * @returns {Array} Array con los nombres de las variables encontradas
 */
function extractVariables(text) {
  if (!text) return [];
  
  const regex = /{([^}]+)}/g;
  const variables = [];
  let match;
  
  while ((match = regex.exec(text)) !== null) {
    const variable = match[1];
    if (!variables.includes(variable)) {
      variables.push(variable);
    }
  }
  
  return variables;
}


/**
 * ============================================
 * INICIALIZACIÓN DE EVENTOS COMUNES
 * ============================================
 */

/**
 * Inicializa eventos comunes del sistema
 */
function initCommonEvents() {
  // Menú móvil
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', toggleMobileMenu);
  }
  
  // Cerrar modales con ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllModals();
    }
  });
  
  // Cerrar modales al hacer clic fuera
  document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
      }
    });
  });
  
  // Cerrar modales con botón X
  document.querySelectorAll('.modal-close').forEach(btn => {
    btn.addEventListener('click', () => {
      closeAllModals();
    });
  });
}



/**
 * ============================================
 * VALIDACION DE DATOS EN CAMPOS OBLIGATORIOS
 * ============================================
 */

/**
 * Renderiza variables dentro de un texto.
 * Soporta tanto {{var}} como {var}.
 */
export function validateRequired(value, label) {
  const v = (value ?? '').toString().trim();
  if (!v) {
    alert(`El campo "${label}" es obligatorio.`);
    return false;
  }
  return true;
}

/**
 * Renderiza variables dentro de un texto.
 * Soporta tanto {{var}} como {var}.
 */
export function renderTemplate(texto, mapa = {}) {
  if (!texto) return '';
  const repl = (_, k) => {
    const key = String(k).trim();
    return Object.prototype.hasOwnProperty.call(mapa, key) ? String(mapa[key]) : '';
  };
  // primero {{var}}, luego {var}
  return texto
    .replace(/\{\{\s*(.*?)\s*\}\}/g, repl)
    .replace(/\{\s*(.*?)\s*\}/g, repl);
}


/**
 * ============================================
 * INICIALIZACIÓN AL CARGAR PÁGINA
 * ============================================
 */

// Inicializar eventos comunes cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  initCommonEvents();
});


/**
 * ============================================
 * Normalizar contenido notificaciones
 * ============================================
 */

export function normalizeNotificacion(row = {}) {
  // Vienen de la BD en snake_case:
  const {
    id_notificaciones,
    not_fechaprogramada,
    not_fechaenvio,
    not_asunto,
    not_mensaje,
    not_tipo,
    not_estado,
    not_intentosenvio,
    id_plantillas_fk,
    id_boleto_fk,
    id_cliente_fk,
    id_factura_fk,
  } = row;

  // Devuélvelos en el formato que espera TU UI:
  return {
    id_Notificaciones: id_notificaciones ?? row.id_Notificaciones ?? null,

    // Fechas
    Not_FechaProgramada: not_fechaprogramada ?? row.Not_FechaProgramada ?? null,
    Not_FechaEnvio: not_fechaenvio ?? row.Not_FechaEnvio ?? null,

    // Texto
    Not_Asunto: not_asunto ?? row.Not_Asunto ?? '',
    // Tu UI usa Not_Descripcion en filtros/lista; lo igualamos al asunto
    Not_Descripcion: not_asunto ?? row.Not_Descripcion ?? '',
    Not_Mensaje: not_mensaje ?? row.Not_Mensaje ?? '',

    // Tipo/estado/contador
    Not_TipoEnvio: not_tipo ?? row.Not_TipoEnvio ?? 'Email',
    Not_Estado: normalizeEstado(not_estado ?? row.Not_Estado ?? 'Pendiente'),
    Not_NumIntentos: not_intentosenvio ?? row.Not_NumIntentos ?? 0,

    // FK
    id_Plantillas_Fk: id_plantillas_fk ?? row.id_Plantillas_Fk ?? null,
    id_Boleto_Fk: id_boleto_fk ?? row.id_Boleto_Fk ?? null,
    id_Cliente_Fk: id_cliente_fk ?? row.id_Cliente_Fk ?? null,
    id_Factura_Fk: id_factura_fk ?? row.id_Factura_Fk ?? null,

    // Campo que NO existe en tu tabla. Si tu UI lo muestra como badge,
    // dale un valor por defecto para no romper la vista:
    Not_Modulo: row.Not_Modulo ?? 'Notificaciones',
  };
}


export function normalizeEstado(valor) {
  const v = (valor || '').trim().toLowerCase();
  // Unificar género y variantes
  if (v === 'enviada' || v === 'enviado') return 'enviado';
  if (v === 'pendiente') return 'pendiente';
  if (v === 'programado' || v === 'programada') return 'programado';
  if (v === 'cancelado' || v === 'cancelada') return 'cancelado';
  if (v === 'fallido' || v === 'fallida') return 'fallido';
  // default
  return 'pendiente';
}

