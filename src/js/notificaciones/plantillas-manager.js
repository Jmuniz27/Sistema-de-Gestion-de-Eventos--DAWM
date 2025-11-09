/**
 * ============================================
 * MÓDULO CONSOLIDADO: PLANTILLAS (Tabla + Editor)
 * ============================================
 * Archivo: src/js/notificaciones/plantillas-manager.js
 * 
 * PROPÓSITO:
 * Maneja AMBAS vistas de plantillas en un solo archivo:
 * - Vista de tabla (listado con filtros CRUD)
 * - Vista de editor (crear/editar plantilla individual)
 * 
 * DETECCIÓN AUTOMÁTICA:
 * - Si encuentra #templatesTableBody → Inicia vista de TABLA
 * - Si encuentra #templateForm → Inicia vista de EDITOR
 * 
 * VISTA TABLA (plantillas.html):
 * - Lista todas las plantillas con 7 columnas
 * - Filtros: ID, Tipo, Estado
 * - Acciones: Editar (→ editor.html?id=X), Eliminar
 * - Usa PlantillasCRUD.getAll() / .delete()
 * 
 * VISTA EDITOR (editor.html):
 * - Formulario para crear/editar plantilla
 * - Campos: Tipo, Módulo, Asunto, Contenido, Estado
 * - Nombre auto-generado: {Tipo}_{Modulo}_{timestamp}
 * - Usa PlantillasCRUD.create() / .update()
 * 
 * BENEFICIO DE CONSOLIDACIÓN:
 * - Comparte helpers (normalización, formato)
 * - Lógica de filtros reutilizada
 * - Reduce código duplicado
 * - Un archivo en lugar de dos (plantillas.js + plantillas-editor.js)
 * 
 * PÁGINAS HTML:
 * - pages/notificaciones/plantillas.html (Tabla)
 * - pages/notificaciones/editor.html (Editor)
 * ============================================
 */

import { PlantillasCRUD } from '../../scripts/modules/notificaciones.js';
import { escapeHtml, truncateText, setTableMessage } from '../shared/table-helpers.js';
import { normalizePlantilla, buildTemplateNameWithModule, splitTemplateName, TEMPLATE_MODULES } from '../shared/plantillas-helpers.js';
import { formatDate as formatDateUtil } from '../../scripts/utils.js';

// ============================================
// VISTA DE TABLA
// ============================================
const TABLE_CONFIG = {
  bodyId: 'templatesTableBody',
  filterIdInput: 'templateFilterId',
  filterTypeSelect: 'templateFilterType',
  filterStateSelect: 'templateFilterState',
  filterReset: 'templateFiltersReset',
  totalColumns: 7,
  editPagePath: './editor.html',
  dateFormat: { year: 'numeric', month: 'short', day: 'numeric' }
};

let tableBodyRef = null;
let allTemplates = [];
const filterRefs = {};
let filterDebounceTimer = null;

function initTable() {
  tableBodyRef = document.getElementById(TABLE_CONFIG.bodyId);
  if (!tableBodyRef) return;

  cacheFilterRefs();
  setupFilterListeners();
  tableBodyRef.addEventListener('click', handleTableClick);
  loadTemplates();
}

async function loadTemplates() {
  setTableMessage(tableBodyRef, 'Cargando plantillas...', TABLE_CONFIG.totalColumns, 'loading');
  const { data, error } = await PlantillasCRUD.getAll();

  if (error) {
    console.error('Error fetching templates:', error);
    setTableMessage(tableBodyRef, 'No se pudieron cargar las plantillas.', TABLE_CONFIG.totalColumns, 'error');
    return;
  }

  allTemplates = (data ?? []).map(normalizePlantilla);
  if (allTemplates.length === 0) {
    setTableMessage(tableBodyRef, 'No hay plantillas registradas.', TABLE_CONFIG.totalColumns, 'empty');
    return;
  }

  applyFilters();
}

function renderTableRows(templates) {
  tableBodyRef.innerHTML = templates.map(p => {
    const updatedAt = formatDateUtil(p.updatedAt || p.createdAt, { locale: 'es-EC', format: TABLE_CONFIG.dateFormat });
    const status = p.isActive ? { label: 'Activa', className: 'status-programado' } : { label: 'Inactiva', className: 'status-cancelado' };
    const id = p.id ?? '';

    return `
      <tr>
        <td class="notifications-table__id">${escapeHtml(String(id) || '-')}</td>
        <td>${escapeHtml(p.module || 'General')}</td>
        <td>
          <div class="notifications-table__subject">
            <span class="notifications-table__subject-title">${escapeHtml(p.name || 'Sin título')}</span>
            <span class="notifications-table__subject-message">${escapeHtml(truncateText(p.subject, 90))}</span>
          </div>
        </td>
        <td><span class="notification-type">${escapeHtml(p.type || 'Email')}</span></td>
        <td><span class="notification-status ${status.className}">${status.label}</span></td>
        <td>${updatedAt}</td>
        <td class="table-actions">
          <button type="button" class="btn btn-outline btn-sm table-action table-action--edit" data-action="edit" data-id="${escapeHtml(String(id))}">Editar</button>
          <button type="button" class="btn btn-outline btn-sm table-action table-action--delete" data-action="delete" data-id="${escapeHtml(String(id))}">Eliminar</button>
        </td>
      </tr>
    `;
  }).join('');
}

function cacheFilterRefs() {
  filterRefs.idInput = document.getElementById(TABLE_CONFIG.filterIdInput);
  filterRefs.typeSelect = document.getElementById(TABLE_CONFIG.filterTypeSelect);
  filterRefs.stateSelect = document.getElementById(TABLE_CONFIG.filterStateSelect);
  filterRefs.resetButton = document.getElementById(TABLE_CONFIG.filterReset);
}

function setupFilterListeners() {
  const { idInput, typeSelect, stateSelect, resetButton } = filterRefs;
  if (idInput) idInput.addEventListener('input', () => {
    clearTimeout(filterDebounceTimer);
    filterDebounceTimer = setTimeout(applyFilters, 200);
  });
  if (typeSelect) typeSelect.addEventListener('change', applyFilters);
  if (stateSelect) stateSelect.addEventListener('change', applyFilters);
  if (resetButton) resetButton.addEventListener('click', resetFilters);
}

function applyFilters() {
  let results = [...allTemplates];
  const { idInput, typeSelect, stateSelect } = filterRefs;

  const idQuery = idInput?.value.trim();
  if (idQuery) results = results.filter(item => String(item.id ?? '').toLowerCase().includes(idQuery.toLowerCase()));

  const typeValue = typeSelect?.value ?? 'all';
  if (typeValue !== 'all') results = results.filter(item => (item.type || 'email').toLowerCase() === typeValue);

  const stateValue = stateSelect?.value ?? 'all';
  if (stateValue !== 'all') results = results.filter(item => item.isActive === (stateValue === 'active'));

  if (results.length === 0) {
    setTableMessage(tableBodyRef, 'No hay plantillas que coincidan con los filtros.', TABLE_CONFIG.totalColumns, 'empty');
    return;
  }

  renderTableRows(results);
}

function resetFilters() {
  const { idInput, typeSelect, stateSelect } = filterRefs;
  if (idInput) idInput.value = '';
  if (typeSelect) typeSelect.value = 'all';
  if (stateSelect) stateSelect.value = 'all';
  applyFilters();
}

function handleTableClick(event) {
  const target = event.target.closest('.table-action');
  if (!target) return;

  const { action, id } = target.dataset;
  if (!id) return;

  if (action === 'edit') {
    const url = new URL(TABLE_CONFIG.editPagePath, window.location.href);
    url.searchParams.set('plantilla', id);
    window.location.href = url.toString();
  } else if (action === 'delete') {
    deleteTemplate(id);
  }
}

async function deleteTemplate(id) {
  if (!confirm('¿Deseas eliminar esta plantilla?')) return;

  setTableMessage(tableBodyRef, 'Eliminando plantilla...', TABLE_CONFIG.totalColumns, 'loading');
  const templateId = isNaN(Number(id)) ? id : Number(id);
  const { error } = await PlantillasCRUD.delete(templateId);

  if (error) {
    console.error('Error deleting template:', error);
    setTableMessage(tableBodyRef, 'No se pudo eliminar la plantilla.', TABLE_CONFIG.totalColumns, 'error');
    return;
  }

  loadTemplates();
}

// ============================================
// EDITOR DE PLANTILLAS
// ============================================
class TemplateEditor {
  constructor() {
    this.form = document.getElementById('templateEditorForm');
    if (!this.form) return;

    this.mode = 'create';
    this.templateId = null;
    this.cacheElements();
    this.populateModuleOptions();
    this.bindEvents();
    this.initializeFromQuery();
  }

  cacheElements() {
    this.title = document.getElementById('templateEditorTitle');
    this.subtitle = document.getElementById('templateEditorSubtitle');
    this.saveButton = document.getElementById('templateSaveButton');
    this.fields = {
      name: document.getElementById('templateName'),
      module: document.getElementById('templateModule'),
      type: document.getElementById('templateType'),
      subject: document.getElementById('templateSubject'),
      content: document.getElementById('templateContent'),
      isActive: document.getElementById('templateIsActive')
    };
  }

  populateModuleOptions() {
    if (!this.fields.module) return;
    this.fields.module.innerHTML = TEMPLATE_MODULES.map(opt => 
      `<option value="${opt.value}">${opt.label}</option>`
    ).join('');
  }

  bindEvents() {
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleSubmit();
    });
  }

  async initializeFromQuery() {
    const params = new URLSearchParams(window.location.search);
    const idParam = params.get('plantilla');

    if (!idParam) {
      this.updateUI();
      return;
    }

    this.mode = 'edit';
    this.templateId = isNaN(Number(idParam)) ? idParam : Number(idParam);
    await this.loadTemplate();
  }

  async loadTemplate() {
    if (!this.templateId) return;

    this.setFormDisabled(true);
    const { data, error } = await PlantillasCRUD.getById(this.templateId);
    this.setFormDisabled(false);

    if (error || !data) {
      alert('No se pudo cargar la plantilla.');
      return;
    }

    const plantilla = normalizePlantilla(data);
    this.fillForm(plantilla);
    this.updateUI(plantilla);
  }

  fillForm(p) {
    const allowedModules = new Set(TEMPLATE_MODULES.map(opt => opt.value));
    this.fields.name.value = (p.name ?? '').trim();
    this.fields.module.value = allowedModules.has(p.module) ? p.module : TEMPLATE_MODULES[0].value;
    this.fields.type.value = p.type ?? 'Email';
    this.fields.subject.value = p.subject ?? '';
    this.fields.content.value = p.content ?? '';
    this.fields.isActive.checked = Boolean(p.isActive);
  }

  updateUI(plantilla) {
    if (this.mode === 'edit') {
      const name = plantilla?.name ? ` ${plantilla.name}` : '';
      if (this.title) this.title.textContent = `Editar plantilla${name}`;
      if (this.subtitle) this.subtitle.textContent = 'Actualiza el contenido sin perder consistencia.';
      if (this.saveButton) this.saveButton.textContent = 'Actualizar plantilla';
    } else {
      if (this.title) this.title.textContent = 'Nueva plantilla';
      if (this.subtitle) this.subtitle.textContent = 'Define el contenido base para notificaciones.';
      if (this.saveButton) this.saveButton.textContent = 'Guardar plantilla';
    }
  }

  async handleSubmit() {
    const payload = this.collectFormData();
    if (!payload) return;

    this.setFormDisabled(true);

    try {
      const { error } = this.mode === 'edit' 
        ? await PlantillasCRUD.update(this.templateId, {
            pla_nombre: payload.Pla_Nombre,
            pla_asunto: payload.Pla_Asunto,
            pla_contenido: payload.Pla_Contenido,
            pla_tipo: payload.Pla_Tipo,
            pla_estado: payload.Pla_Estado
          })
        : await PlantillasCRUD.create(payload);

      if (error) throw error;

      alert('Plantilla guardada correctamente.');
      window.location.href = './plantillas.html';
    } catch (error) {
      console.error('Error saving template:', error);
      alert('Error al guardar la plantilla.');
      this.setFormDisabled(false);
    }
  }

  collectFormData() {
    const name = this.fields.name.value.trim();
    const module = this.fields.module.value;
    const type = this.fields.type.value;
    const subject = this.fields.subject.value.trim();
    const content = this.fields.content.value.trim();
    const isActive = this.fields.isActive.checked;

    if (!name || !subject || !content) {
      alert('Completa nombre, asunto y contenido.');
      return null;
    }

    return {
      Pla_Nombre: buildTemplateNameWithModule(name, module),
      Pla_Modulo: module,
      Pla_Asunto: subject,
      Pla_Contenido: content,
      Pla_Tipo: ['Email', 'Push'].includes(type) ? type : 'Email',
      Pla_Estado: isActive ? 'Activo' : 'Inactivo'
    };
  }

  setFormDisabled(disabled) {
    Object.values(this.fields).forEach(el => { if (el) el.disabled = disabled; });
    if (this.saveButton) this.saveButton.disabled = disabled;
  }
}

// ============================================
// INICIALIZACIÓN
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  // Detectar si estamos en la tabla o en el editor
  if (document.getElementById(TABLE_CONFIG.bodyId)) {
    initTable();
  } else if (document.getElementById('templateEditorForm')) {
    new TemplateEditor();
  }
});
