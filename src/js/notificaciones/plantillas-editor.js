/**
 * Editor unificado para crear y actualizar plantillas de notificaciones.
 * Reutiliza la misma clase para ambos flujos (crear / editar) con un formulario único.
 */

import { PlantillasCRUD } from '../../scripts/modules/notificaciones/plantillas_crud.js';
import {
  buildTemplateNameWithModule,
  normalizePlantilla,
  splitTemplateName,
  TEMPLATE_MODULES
} from '../shared/plantillas-helpers.js';

class TemplateEditor {
  constructor() {
    this.form = document.getElementById('templateEditorForm');
    if (!this.form) return;

    this.mode = 'create';
    this.templateId = null;
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

    this.originalStoredName = null;
    this.originalBaseName = null;
    this.originalModule = null;

    this.populateModuleOptions();
    this.bindEvents();
    this.initializeFromQuery();
  }

  /**
   * Carga opciones de módulos desde el helper compartido para evitar duplicaciones.
   */
  populateModuleOptions() {
    const select = this.fields.module;
    if (!select) return;

    select.innerHTML = TEMPLATE_MODULES.map(option => `
      <option value="${option.value}">${option.label}</option>
    `).join('');
  }

  /**
   * Registra los listeners principales del formulario y los botones auxiliares.
   */
  bindEvents() {
    this.form.addEventListener('submit', (event) => {
      event.preventDefault();
      this.handleSubmit();
    });
  }

  /**
   * Determina si el editor está en modo creación o edición usando la querystring.
   */
  async initializeFromQuery() {
    const params = new URLSearchParams(window.location.search);
    const idParam = params.get('plantilla');

    if (!idParam) {
      this.syncHeader();
      return;
    }

    this.mode = 'edit';
    this.templateId = Number.isNaN(Number(idParam)) ? idParam : Number(idParam);
    await this.loadTemplate();
  }

  /**
   * Obtiene la plantilla desde Supabase cuando estamos en modo edición.
   */
  async loadTemplate() {
    if (!this.templateId) return;

    this.setFormDisabled(true);
    const { data, error } = await PlantillasCRUD.getById(this.templateId);
    this.setFormDisabled(false);

    if (error || !data) {
      console.error('Error loading template', error);
      alert('No se pudo cargar la plantilla seleccionada.');
      return;
    }

    const plantilla = normalizePlantilla(data);

    this.originalStoredName = plantilla?.storedName
      ?? data?.Pla_Nombre_Completo
      ?? data?.pla_nombre
      ?? data?.Pla_Nombre
      ?? null;
    this.originalBaseName = plantilla?.name ?? null;
    this.originalModule = plantilla?.module ?? null;

    this.fillForm(plantilla);
    this.syncHeader(plantilla);
  }

  /**
   * Rellena el formulario con los datos existentes.
   * @param {Object} plantilla - Plantilla normalizada.
   */
  fillForm(plantilla) {
    const allowedModules = new Set(TEMPLATE_MODULES.map(option => option.value));

    this.fields.name.value = (plantilla.name ?? '').trim();
    this.fields.module.value = allowedModules.has(plantilla.module)
      ? plantilla.module
      : TEMPLATE_MODULES[0].value;
    this.fields.type.value = plantilla.type ?? 'Email';
    this.fields.subject.value = plantilla.subject ?? '';
    this.fields.content.value = plantilla.content ?? '';
    this.fields.isActive.checked = Boolean(plantilla.isActive);
  }

  /**
   * Actualiza títulos y textos de acuerdo al modo actual del editor.
   * @param {Object} plantilla - Datos existentes (solo para modo edición).
   */
  syncHeader(plantilla) {
    if (!this.title || !this.subtitle || !this.saveButton) return;

    if (this.mode === 'edit') {
      const name = plantilla?.name ? ` ${plantilla.name}` : '';
      this.title.textContent = `Editar plantilla${name}`;
      this.subtitle.textContent = 'Actualiza el contenido sin perder la consistencia de tus campañas.';
      this.saveButton.textContent = 'Actualizar plantilla';
    } else {
      this.title.textContent = 'Nueva plantilla';
      this.subtitle.textContent = 'Define el contenido base que usaremos al generar notificaciones.';
      this.saveButton.textContent = 'Guardar plantilla';
    }
  }

  /**
   * Valida y envía el formulario delegando la persistencia al CRUD.
   */
  async handleSubmit() {
    const payload = this.collectFormData();
    if (!payload) return;

    this.setFormDisabled(true);
    let success = false;

    try {
      const { success: result } = await (this.mode === 'edit'
        ? this.updateTemplate(payload)
        : this.createTemplate(payload));
      success = Boolean(result);
    } catch (error) {
      console.error('Unexpected error saving template', error);
      alert('Ocurrió un error inesperado al guardar la plantilla.');
    }

    this.setFormDisabled(false);

    if (!success) return;

    alert('La plantilla se guardó correctamente.');
    window.location.href = './plantillas.html';
  }

  /**
   * Extrae y valida los datos del formulario.
   * @returns {Object|null} Datos listos para enviar o null si falta información.
   */
  collectFormData() {
    const name = this.fields.name.value.trim();
    const module = this.fields.module.value;
    const type = this.fields.type.value;
    const subject = this.fields.subject.value.trim();
    const content = this.fields.content.value.trim();
    const isActive = this.fields.isActive.checked;

    if (!name || !subject || !content) {
      alert('Completa al menos el nombre, asunto y contenido de la plantilla.');
      return null;
    }

    const validTypes = ['Email', 'Push'];
    const normalizedType = validTypes.includes(type) ? type : 'Email';
    const allowedModules = TEMPLATE_MODULES.map(option => option.value);
    const normalizedModule = allowedModules.includes(module) ? module : TEMPLATE_MODULES[0].value;

    const storedName = buildTemplateNameWithModule(name, normalizedModule);

    return {
      Pla_Nombre: storedName,
      Pla_Modulo: normalizedModule,
      Pla_Asunto: subject,
      Pla_Contenido: content,
      Pla_Tipo: normalizedType,
      Pla_Estado: isActive ? 'Activo' : 'Inactivo'
    };
  }

  /**
   * Ejecuta la creación de una plantilla nueva en Supabase.
   */
  async createTemplate(payload) {
    const { error } = await PlantillasCRUD.create(payload);
    if (error) {
      console.error('Error creating template', error);
      const message = error.userMessage || 'No se pudo crear la plantilla. Inténtalo más tarde.';
      alert(message);
      return { success: false };
    }
    return { success: true };
  }

  /**
   * Ejecuta la actualización de la plantilla existente en Supabase.
   */
  async updateTemplate(payload) {
    if (!this.templateId) return { success: false };

    const updates = {
      pla_asunto: payload.Pla_Asunto,
      pla_contenido: payload.Pla_Contenido,
      pla_tipo: payload.Pla_Tipo,
      pla_estado: payload.Pla_Estado,
      pla_fechaultimamodificacion: new Date().toISOString()
    };

    const originalParts = splitTemplateName(this.originalStoredName ?? '');
    const currentBaseName = this.originalBaseName ?? originalParts.baseName ?? '';
    const currentModule = this.originalModule ?? originalParts.module ?? '';

    const nextParts = splitTemplateName(payload.Pla_Nombre ?? '');
    const nextBaseName = nextParts.baseName || this.fields.name.value.trim();
    const nextModule = payload.Pla_Modulo ?? nextParts.module ?? this.fields.module.value;

    const baseNameChanged = (currentBaseName || '').trim() !== (nextBaseName || '').trim();
    const moduleChanged = (currentModule || '').trim() !== (nextModule || '').trim();

    const shouldUpdateStoredName = this.originalStoredName == null
      ? Boolean(payload.Pla_Nombre)
      : baseNameChanged || moduleChanged;

    if (shouldUpdateStoredName) {
      updates.pla_nombre = payload.Pla_Nombre;
    }

    console.debug('Plantilla update payload check', {
      originalStoredName: this.originalStoredName,
      originalBaseName: currentBaseName,
      originalModule: currentModule,
      generatedStoredName: payload.Pla_Nombre,
      nextBaseName,
      nextModule,
      willUpdateStoredName: shouldUpdateStoredName,
      updates
    });

    const { error } = await PlantillasCRUD.update(this.templateId, updates);
    if (error) {
      console.error('Error updating template', error);
      const message = error.userMessage || 'No se pudo actualizar la plantilla.';
      alert(message);
      return { success: false };
    }

    if (shouldUpdateStoredName) {
      this.originalStoredName = payload.Pla_Nombre;
      this.originalBaseName = nextBaseName;
      this.originalModule = nextModule;
    }
    return { success: true };
  }

  /**
   * Habilita o deshabilita todos los campos y botones del formulario.
   * @param {boolean} value - true para deshabilitar.
   */
  setFormDisabled(value) {
    const elements = [
      this.fields.name,
      this.fields.module,
      this.fields.type,
      this.fields.subject,
      this.fields.content,
      this.fields.isActive,
      this.saveButton
    ];

    elements.forEach((el) => {
      if (el) el.disabled = value;
    });
  }
}

// Inicializa el editor cuando el DOM esté listo.
document.addEventListener('DOMContentLoaded', () => {
  new TemplateEditor();
});
