/**
 * ============================================
 * VISTA: TABLA DE NOTIFICACIONES (ADMIN)
 * ============================================
 * Archivo: src/js/notificaciones/notificaciones.js
 * 
 * PROPÓSITO:
 * Vista de administración que muestra TODAS las notificaciones del sistema
 * en formato de tabla con opciones de filtrado y acciones CRUD.
 * 
 * CARACTERÍSTICAS:
 * - Tabla con todas las notificaciones (últimas 20)
 * - Filtros por: ID, Tipo (Email/Push), Estado
 * - Acciones: Editar (si no enviada), Eliminar
 * - Redirección a formulario de edición
 * 
 * PERMISOS:
 * Solo para usuarios ADMINISTRADORES
 * 
 * PÁGINA HTML:
 * pages/notificaciones/notificaciones.html
 * 
 * DIFERENCIA CON VISTA DE CLIENTE:
 * - Esta muestra TODAS las notificaciones (Admin)
 * - La otra muestra solo las del cliente específico (Cliente)
 * ============================================
 */

import { NotificacionesCRUD } from '../../scripts/modules/notificaciones.js';
import { normalizeNotificacion, normalizeEstado, formatDate } from '../../scripts/utils.js';
import { escapeHtml, truncateText, setTableMessage } from '../shared/table-helpers.js';

const CONFIG = {
  bodyId: 'notificationsTableBody',
  filterIds: {
    id: 'notificationFilterId',
    type: 'notificationFilterType',
    state: 'notificationFilterState',
    reset: 'notificationFiltersReset'
  },
  totalColumns: 8,
  editPath: './enviar.html',
  dateFormat: { year: 'numeric', month: 'short', day: 'numeric' }
};

let tableBodyRef, allNotifications = [];
const filterRefs = {};
let filterDebounceTimer;

const STATUS_MAP = {
  enviado: { label: 'Enviada', className: 'status-enviado' },
  programado: { label: 'Programada', className: 'status-programado' },
  fallido: { label: 'Fallida', className: 'status-fallido' },
  cancelado: { label: 'Cancelada', className: 'status-cancelado' },
  default: { label: 'Pendiente', className: 'status-pendiente' }
};

document.addEventListener('DOMContentLoaded', init);

async function init() {
  tableBodyRef = document.getElementById(CONFIG.bodyId);
  if (!tableBodyRef) return;

  cacheFilterRefs();
  setupFilterListeners();
  tableBodyRef.addEventListener('click', handleTableClick);
  await loadNotifications();
}

async function loadNotifications() {
  setTableMessage(tableBodyRef, 'Cargando notificaciones...', CONFIG.totalColumns, 'loading');

  const { data, error } = await NotificacionesCRUD.getAll({
    orderBy: 'not_fechaprogramada',
    ascending: false,
    limit: 20
  });

  if (error) {
    console.error('Error fetching notifications:', error);
    setTableMessage(tableBodyRef, 'No se pudieron cargar las notificaciones.', CONFIG.totalColumns, 'error');
    return;
  }

  allNotifications = (data ?? []).map(normalizeNotificacion);

  if (allNotifications.length === 0) {
    setTableMessage(tableBodyRef, 'No hay notificaciones registradas.', CONFIG.totalColumns, 'empty');
    return;
  }

  applyFilters();
}

function renderTableRows(notifications) {
  tableBodyRef.innerHTML = notifications.map(n => {
    const statusMeta = STATUS_MAP[normalizeEstado(n.Not_Estado)] || STATUS_MAP.default;
    const programada = formatDate(n.Not_FechaProgramada, { locale: 'es-EC', format: CONFIG.dateFormat, fallback: '-' });
    const enviada = formatDate(n.Not_FechaEnvio, { locale: 'es-EC', format: CONFIG.dateFormat, fallback: '-' });
    const id = n.id_Notificaciones ?? '';
    const normalizedState = normalizeEstado(n.Not_Estado);
    const isEditable = !['enviado', 'cancelado', 'fallido'].includes(normalizedState);

    return `
      <tr>
        <td class="notifications-table__id">${escapeHtml(String(id) || '-')}</td>
        <td>
          <div class="notifications-table__subject">
            <span class="notifications-table__subject-title">${escapeHtml(n.Not_Asunto || 'Sin asunto')}</span>
            <span class="notifications-table__subject-message">${escapeHtml(truncateText(n.Not_Mensaje, 90))}</span>
          </div>
        </td>
        <td><span class="notification-type">${escapeHtml(n.Not_TipoEnvio || 'Email')}</span></td>
        <td><span class="notification-status ${statusMeta.className}">${statusMeta.label}</span></td>
        <td>${programada}</td>
        <td>${enviada}</td>
        <td>${n.Not_NumIntentos ?? 0}</td>
        <td class="table-actions">
          ${isEditable ? `<button type="button" class="btn btn-outline btn-sm table-action table-action--edit" data-action="edit" data-id="${escapeHtml(String(id))}">Editar</button>` : ''}
          <button type="button" class="btn btn-outline btn-sm table-action table-action--delete" data-action="delete" data-id="${escapeHtml(String(id))}">Eliminar</button>
        </td>
      </tr>
    `;
  }).join('');
}

function cacheFilterRefs() {
  Object.entries(CONFIG.filterIds).forEach(([key, id]) => {
    filterRefs[key] = document.getElementById(id);
  });
}

function setupFilterListeners() {
  if (filterRefs.id) filterRefs.id.addEventListener('input', () => {
    clearTimeout(filterDebounceTimer);
    filterDebounceTimer = setTimeout(applyFilters, 200);
  });
  if (filterRefs.type) filterRefs.type.addEventListener('change', applyFilters);
  if (filterRefs.state) filterRefs.state.addEventListener('change', applyFilters);
  if (filterRefs.reset) filterRefs.reset.addEventListener('click', resetFilters);
}

function applyFilters() {
  let results = [...allNotifications];

  const idQuery = filterRefs.id?.value.trim().toLowerCase();
  if (idQuery) results = results.filter(item => String(item.id_Notificaciones ?? '').toLowerCase().includes(idQuery));

  const typeValue = filterRefs.type?.value ?? 'all';
  if (typeValue !== 'all') results = results.filter(item => (item.Not_TipoEnvio ?? 'Email').toLowerCase() === typeValue);

  const stateValue = filterRefs.state?.value ?? 'all';
  if (stateValue !== 'all') results = results.filter(item => normalizeEstado(item.Not_Estado) === stateValue);

  if (results.length === 0) {
    setTableMessage(tableBodyRef, 'No hay notificaciones que coincidan con los filtros.', CONFIG.totalColumns, 'empty');
    return;
  }

  renderTableRows(results);
}

function resetFilters() {
  if (filterRefs.id) filterRefs.id.value = '';
  if (filterRefs.type) filterRefs.type.value = 'all';
  if (filterRefs.state) filterRefs.state.value = 'all';
  applyFilters();
}

function handleTableClick(event) {
  const target = event.target.closest('.table-action');
  if (!target) return;

  const { action, id } = target.dataset;
  if (!id) return;

  if (action === 'edit') {
    const url = new URL(CONFIG.editPath, window.location.href);
    url.searchParams.set('notificacion', id);
    window.location.href = url.toString();
  } else if (action === 'delete') {
    deleteNotification(id);
  }
}

async function deleteNotification(id) {
  if (!confirm('¿Deseas eliminar esta notificación?')) return;

  setTableMessage(tableBodyRef, 'Eliminando notificación...', CONFIG.totalColumns, 'loading');

  const targetId = isNaN(Number(id)) ? id : Number(id);
  const { error } = await NotificacionesCRUD.delete(targetId);

  if (error) {
    console.error('Error deleting notification:', error);
    setTableMessage(tableBodyRef, 'No se pudo eliminar la notificación.', CONFIG.totalColumns, 'error');
    return;
  }

  await loadNotifications();
}
