/**
 * Vista pública de notificaciones en landing.
 * Presenta los registros como filas de una tabla simple.
 */

import { NotificacionesCRUD } from '../../scripts/modules/notificaciones/notificaciones_crud.js';
import { normalizeNotificacion, normalizeEstado, formatDate as formatDateUtil } from '../../scripts/utils.js';
import { escapeHtml, truncateText, setTableMessage as sharedSetTableMessage } from '../shared/table-helpers.js';

const TABLE_BODY_ID = 'notificationsTableBody';
// Identificadores de los filtros declarados en la vista
const FILTER_ID_INPUT_ID = 'notificationFilterId';
const FILTER_TYPE_SELECT_ID = 'notificationFilterType';
const FILTER_STATE_SELECT_ID = 'notificationFilterState';
const FILTER_RESET_ID = 'notificationFiltersReset';
// Número total de columnas para mantener colspan correcto en mensajes
const TOTAL_COLUMNS = 8;
// Ruta del editor (reutiliza enviar.html en modo edición)
const EDIT_PAGE_PATH = './enviar.html';
// Mantiene el formato de fecha consistente con la landing pública
const DATE_FORMAT = {
  year: 'numeric',
  month: 'short',
  day: 'numeric'
};

let tableBodyRef = null;
// Cache de datos originales para aplicar filtros sin reconsultar
let allNotifications = [];

// Referencias centralizadas de los controles de filtrado
const filterRefs = {
  idInput: null,
  typeSelect: null,
  stateSelect: null,
  resetButton: null
};
//Cuando el documento termina de iniciarse se ejecuta la funcion de inicializacion
document.addEventListener('DOMContentLoaded', initializeNotificationsTable);
//Funcion que inicializa la tabla de notificaciones
async function initializeNotificationsTable() {
    //Busca la talbla almacenada dentro de la variable tableBodyRef
    tableBodyRef = document.getElementById(TABLE_BODY_ID);
    //Si no se encuentra la tabla, se sale de la funcion
    if (!tableBodyRef) return;
    //Agrega un listener para el evento de click en la tabla
    tableBodyRef.addEventListener('click', handleTableClick);
    //Almacena en memoria las referencias a los controles de filtrado (inputs/selects) para reutilizarlas sin repetir búsquedas.
    cacheFilterRefs();
    //Configura los listeners para los controles de filtrado
    setupFilterListeners();
    //Carga las notificaciones desde la base de datos
    await loadNotifications();
}

//Función que carga las notificaciones desde la base de datos
async function loadNotifications() {
  if (!tableBodyRef) return;
  // Inicia con un mensaje de carga para evitar parpadeos
  sharedSetTableMessage(tableBodyRef, 'Cargando notificaciones...', TOTAL_COLUMNS, 'loading');

  //Obtenemos hasta 20notificaciones ordenadas por fechaprogramada
  const { data, error } = await NotificacionesCRUD.getAll({
    orderBy: 'not_fechaprogramada',
    ascending: false,
    limit: 20
  });

  if (error) {
    console.error('Error fetching notifications:', error);
    // Los errores se muestran en la tabla para mantener el layout
    sharedSetTableMessage(
      tableBodyRef,
      'No se pudieron cargar las notificaciones. Inténtalo de nuevo más tarde.',
      TOTAL_COLUMNS,
      'error'
    );
    return;
  }

  const notificaciones = (data ?? []).map(normalizeNotificacion);
  allNotifications = notificaciones;

  if (notificaciones.length === 0) {
    // Mensaje vacío amigable cuando la tabla no tiene registros
    sharedSetTableMessage(tableBodyRef, 'No hay notificaciones registradas.', TOTAL_COLUMNS, 'empty');
    return;
  }

  applyFilters();
}

function renderTableRows(tbody, notificaciones) {
  // Se compone todo el HTML en memoria para minimizar reflows
  tbody.innerHTML = notificaciones
    .map(notificacion => {
      const statusMeta = getStatusMeta(notificacion.Not_Estado);
      const programada = formatDateUtil(
        notificacion.Not_FechaProgramada,
        {
          locale: 'es-EC',
          format: DATE_FORMAT,
          fallback: ''
        }
      ) || '-';
      const enviada = formatDateUtil(
        notificacion.Not_FechaEnvio,
        {
          locale: 'es-EC',
          format: DATE_FORMAT,
          fallback: ''
        }
      ) || '-';
      const notificationId = notificacion.id_Notificaciones ?? '';
      const normalizedState = normalizeEstado(notificacion.Not_Estado);
      const isEditable = !['enviado', 'cancelado', 'fallido'].includes(normalizedState);

      return `
        <tr>
          <td class="notifications-table__id">${escapeHtml(
            notificationId ? String(notificationId) : '-'
          )}</td>
          <td>
            <div class="notifications-table__subject">
              <span class="notifications-table__subject-title">${escapeHtml(
                notificacion.Not_Asunto || 'Notificación sin asunto'
              )}</span>
              <span class="notifications-table__subject-message">${escapeHtml(
                truncateText(notificacion.Not_Mensaje, 90)
              )}</span>
            </div>
          </td>
          <td><span class="notification-type">${escapeHtml(
            notificacion.Not_TipoEnvio || 'Email'
          )}</span></td>
          <td><span class="notification-status ${statusMeta.className}">${
            statusMeta.label
          }</span></td>
          <td>${programada}</td>
          <td>${enviada}</td>
          <td>${notificacion.Not_NumIntentos ?? 0}</td>
          <td class="table-actions">
            ${isEditable ? `
              <button
                type="button"
                class="btn btn-outline btn-sm table-action table-action--edit"
                data-action="edit"
                data-id="${escapeHtml(notificationId ? String(notificationId) : '')}"
              >Editar</button>
            ` : ''}
            <button
              type="button"
              class="btn btn-outline btn-sm table-action table-action--delete"
              data-action="delete"
              data-id="${escapeHtml(notificationId ? String(notificationId) : '')}"
            >Eliminar</button>
          </td>
        </tr>
      `;
    })
    .join('');
}

 

function cacheFilterRefs() {
  // Guarda las referencias para evitar repetidas búsquedas en el DOM
  filterRefs.idInput = document.getElementById(FILTER_ID_INPUT_ID);
  filterRefs.typeSelect = document.getElementById(FILTER_TYPE_SELECT_ID);
  filterRefs.stateSelect = document.getElementById(FILTER_STATE_SELECT_ID);
  filterRefs.resetButton = document.getElementById(FILTER_RESET_ID);
}

function setupFilterListeners() {
  const { idInput, typeSelect, stateSelect, resetButton } = filterRefs;

  if (idInput) {
    // Uso debounce para no aplicar filtros en cada pulsación
    idInput.addEventListener('input', debounceFilters);
  }

  if (typeSelect) {
    typeSelect.addEventListener('change', applyFilters);
  }

  if (stateSelect) {
    stateSelect.addEventListener('change', applyFilters);
  }

  if (resetButton) {
    resetButton.addEventListener('click', resetFilters);
  }
}

let filterDebounceTimer = null;
function debounceFilters() {
  // Evita múltiples renders mientras el usuario escribe el ID
  window.clearTimeout(filterDebounceTimer);
  filterDebounceTimer = window.setTimeout(applyFilters, 200);
}

function applyFilters() {
  if (!tableBodyRef) return;

  // Trabaja sobre una copia para preservar la lista original
  let results = [...allNotifications];
  const { idInput, typeSelect, stateSelect } = filterRefs;

  const idQuery = idInput?.value.trim();
  if (idQuery) {
    const normalizedQuery = idQuery.toLowerCase();
    results = results.filter(item =>
      String(item.id_Notificaciones ?? '')
        .toLowerCase()
        .includes(normalizedQuery)
    );
  }

  const typeValue = typeSelect?.value ?? 'all';
  if (typeValue !== 'all') {
  // Se compara en minúsculas para que el filtro sea case-insensitive (solo Email/Push)
    results = results.filter(item =>
      (item.Not_TipoEnvio ?? 'Email').toLowerCase() === typeValue
    );
  }

  const stateValue = stateSelect?.value ?? 'all';
  if (stateValue !== 'all') {
    // Reutiliza normalizeEstado para unificar estados antes de filtrar
    results = results.filter(item => normalizeEstado(item.Not_Estado) === stateValue);
  }

  if (results.length === 0) {
    sharedSetTableMessage(tableBodyRef, 'No hay notificaciones que coincidan con los filtros.', TOTAL_COLUMNS, 'empty');
    return;
  }

  renderTableRows(tableBodyRef, results);
}

function resetFilters() {
  const { idInput, typeSelect, stateSelect } = filterRefs;

  if (idInput) idInput.value = '';
  if (typeSelect) typeSelect.value = 'all';
  if (stateSelect) stateSelect.value = 'all';

  applyFilters();
}

function handleTableClick(event) {
  // Delegación de eventos para manejar botones de editar/eliminar
  const target = event.target.closest('.table-action');
  if (!target || !tableBodyRef?.contains(target)) return;

  const { action, id } = target.dataset;
  if (!id) return;

  if (action === 'edit') {
    handleEdit(id);
  } else if (action === 'delete') {
    handleDelete(id);
  }
}

function handleEdit(id) {
  // Redirige al editor manteniendo el ID en la querystring
  const url = new URL(EDIT_PAGE_PATH, window.location.href);
  url.searchParams.set('notificacion', id);
  window.location.href = url.toString();
}

async function handleDelete(id) {
  // Confirma la acción antes de eliminar definitivamente
  const confirmDelete = window.confirm('¿Deseas eliminar esta notificación?');
  if (!confirmDelete) return;

  if (!tableBodyRef) return;

  sharedSetTableMessage(tableBodyRef, 'Eliminando notificación...', TOTAL_COLUMNS, 'loading');

  const targetId = Number.isNaN(Number(id)) ? id : Number(id);
  const { error } = await NotificacionesCRUD.delete(targetId);

  if (error) {
    console.error('Error deleting notification:', error);
    sharedSetTableMessage(
      tableBodyRef,
      'No se pudo eliminar la notificación. Inténtalo nuevamente.',
      TOTAL_COLUMNS,
      'error'
    );
    return;
  }

  await loadNotifications();
}

function getStatusMeta(rawEstado) {
  // Centraliza la traducción de estado para mantener CSS y texto alineados
  const estado = normalizeEstado(rawEstado);
  switch (estado) {
    case 'enviado':
      return { label: 'Enviada', className: 'status-enviado' };
    case 'programado':
      return { label: 'Programada', className: 'status-programado' };
    case 'fallido':
      return { label: 'Fallida', className: 'status-fallido' };
    case 'cancelado':
      return { label: 'Cancelada', className: 'status-cancelado' };
    default:
      return { label: 'Pendiente', className: 'status-pendiente' };
  }
}

