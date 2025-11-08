/**
 * Vista pública de plantillas.
 * Reutiliza la estructura y estilos de la tabla de notificaciones,
 * añadiendo filtros básicos por ID, tipo y estado.
 */

import { PlantillasCRUD } from '../../scripts/modules/notificaciones/plantillas_crud.js';
import { escapeHtml, truncateText, setTableMessage } from '../shared/table-helpers.js';
import { normalizePlantilla } from '../shared/plantillas-helpers.js';
import { formatDate as formatDateUtil } from '../../scripts/utils.js';

const TABLE_BODY_ID = 'templatesTableBody';
const FILTER_ID_INPUT_ID = 'templateFilterId';
const FILTER_TYPE_SELECT_ID = 'templateFilterType';
const FILTER_STATE_SELECT_ID = 'templateFilterState';
const FILTER_RESET_ID = 'templateFiltersReset';
const TOTAL_COLUMNS = 7;
const EDIT_PAGE_PATH = './editor.html';

// Formato común de fecha para mantener coherencia con otras tablas públicas
const DATE_FORMAT = {
  year: 'numeric',
  month: 'short',
  day: 'numeric'
};

let tableBodyRef = null;
let allTemplates = [];

const filterRefs = {
  idInput: null,
  typeSelect: null,
  stateSelect: null,
  resetButton: null
};

document.addEventListener('DOMContentLoaded', initializeTemplatesTable);

async function initializeTemplatesTable() {
  tableBodyRef = document.getElementById(TABLE_BODY_ID);
  if (!tableBodyRef) return;

  cacheFilterRefs();
  setupFilterListeners();
  tableBodyRef.addEventListener('click', handleTableClick);
  await loadTemplates();
}

async function loadTemplates() {
  if (!tableBodyRef) return;
  setTableMessage(tableBodyRef, 'Cargando plantillas...', TOTAL_COLUMNS, 'loading');

  const { data, error } = await PlantillasCRUD.getAll();

  if (error) {
    console.error('Error fetching templates:', error);
    setTableMessage(
      tableBodyRef,
      'No se pudieron cargar las plantillas. Inténtalo de nuevo más tarde.',
      TOTAL_COLUMNS,
      'error'
    );
    return;
  }

  allTemplates = (data ?? []).map(normalizePlantilla);

  if (allTemplates.length === 0) {
    setTableMessage(tableBodyRef, 'No hay plantillas registradas.', TOTAL_COLUMNS, 'empty');
    return;
  }

  applyFilters();
}

// Dibuja las filas visibles en la tabla reutilizando estilos del landing.
function renderTableRows(templates) {
  tableBodyRef.innerHTML = templates
    .map(plantilla => {
  const updatedAt = formatDateUtil(
    plantilla.updatedAt || plantilla.createdAt,
    {
      locale: 'es-EC',
      format: DATE_FORMAT
    }
  );
      const statusMeta = getTemplateStatus(plantilla.isActive);
      const templateId = plantilla.id ?? '';

      return `
        <tr>
          <td class="notifications-table__id">${escapeHtml(templateId ? String(templateId) : '-')}</td>
          <td>${escapeHtml(plantilla.module || 'General')}</td>
          <td>
            <div class="notifications-table__subject">
              <span class="notifications-table__subject-title">${escapeHtml(
                plantilla.name || 'Plantilla sin título'
              )}</span>
              <span class="notifications-table__subject-message">${escapeHtml(
                truncateText(plantilla.subject, 90)
              )}</span>
            </div>
          </td>
          <td><span class="notification-type">${escapeHtml(plantilla.type || 'Email')}</span></td>
          <td><span class="notification-status ${statusMeta.className}">${statusMeta.label}</span></td>
          <td>${updatedAt}</td>
          <td class="table-actions">
            <button
              type="button"
              class="btn btn-outline btn-sm table-action table-action--edit"
              data-action="edit"
              data-id="${escapeHtml(templateId ? String(templateId) : '')}"
            >Editar</button>
            <button
              type="button"
              class="btn btn-outline btn-sm table-action table-action--delete"
              data-action="delete"
              data-id="${escapeHtml(templateId ? String(templateId) : '')}"
            >Eliminar</button>
          </td>
        </tr>
      `;
    })
    .join('');
}

// Guarda referencias de los filtros para no consultar el DOM repetidamente.
function cacheFilterRefs() {
  filterRefs.idInput = document.getElementById(FILTER_ID_INPUT_ID);
  filterRefs.typeSelect = document.getElementById(FILTER_TYPE_SELECT_ID);
  filterRefs.stateSelect = document.getElementById(FILTER_STATE_SELECT_ID);
  filterRefs.resetButton = document.getElementById(FILTER_RESET_ID);
}

// Configura los listeners de búsqueda y selects para aplicar filtros en vivo.
function setupFilterListeners() {
  const { idInput, typeSelect, stateSelect, resetButton } = filterRefs;

  if (idInput) {
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
// Evita aplicar filtros con cada pulsación al buscar por ID.
function debounceFilters() {
  window.clearTimeout(filterDebounceTimer);
  filterDebounceTimer = window.setTimeout(applyFilters, 200);
}

// Aplica los tres filtros disponibles (ID, tipo, estado) sobre la lista original.
function applyFilters() {
  if (!tableBodyRef) return;

  let results = [...allTemplates];
  const { idInput, typeSelect, stateSelect } = filterRefs;

  const idQuery = idInput?.value.trim();
  if (idQuery) {
    const normalizedQuery = idQuery.toLowerCase();
    results = results.filter(item =>
      String(item.id ?? '')
        .toLowerCase()
        .includes(normalizedQuery)
    );
  }

  const typeValue = typeSelect?.value ?? 'all';
  if (typeValue !== 'all') {
    results = results.filter(item => (item.type || 'email').toLowerCase() === typeValue);
  }

  const stateValue = stateSelect?.value ?? 'all';
  if (stateValue !== 'all') {
    const shouldBeActive = stateValue === 'active';
    results = results.filter(item => item.isActive === shouldBeActive);
  }

  if (results.length === 0) {
    setTableMessage(tableBodyRef, 'No hay plantillas que coincidan con los filtros.', TOTAL_COLUMNS, 'empty');
    return;
  }

  renderTableRows(results);
}

// Restaura los filtros a su estado inicial y vuelve a dibujar la tabla.
function resetFilters() {
  const { idInput, typeSelect, stateSelect } = filterRefs;

  if (idInput) idInput.value = '';
  if (typeSelect) typeSelect.value = 'all';
  if (stateSelect) stateSelect.value = 'all';

  applyFilters();
}

// Gestiona acciones de la tabla por delegación (editar/eliminar).
function handleTableClick(event) {
  const target = event.target.closest('.table-action');
  if (!target || !tableBodyRef?.contains(target)) return;

  const { action, id } = target.dataset;
  if (!id) return;

  if (action === 'edit') {
    redirectToEditor(id);
  } else if (action === 'delete') {
    deleteTemplate(id);
  }
}

// Navega al editor reutilizando el mismo formulario usado en notificaciones.
function redirectToEditor(id) {
  const url = new URL(EDIT_PAGE_PATH, window.location.href);
  url.searchParams.set('plantilla', id);
  window.location.href = url.toString();
}

// Confirma y elimina la plantilla seleccionada; recarga la tabla al terminar.
async function deleteTemplate(id) {
  const confirmDelete = window.confirm('¿Deseas eliminar esta plantilla?');
  if (!confirmDelete) return;

  if (!tableBodyRef) return;

  setTableMessage(tableBodyRef, 'Eliminando plantilla...', TOTAL_COLUMNS, 'loading');

  const templateId = Number.isNaN(Number(id)) ? id : Number(id);
  const { error } = await PlantillasCRUD.delete(templateId);

  if (error) {
    console.error('Error deleting template:', error);
    setTableMessage(
      tableBodyRef,
      'No se pudo eliminar la plantilla. Inténtalo nuevamente.',
      TOTAL_COLUMNS,
      'error'
    );
    return;
  }

  await loadTemplates();
}

// Devuelve etiqueta y clase CSS según si la plantilla está activa.
function getTemplateStatus(isActive) {
  if (isActive) {
    return { label: 'Activa', className: 'status-programado' };
  }
  return { label: 'Inactiva', className: 'status-cancelado' };
}
