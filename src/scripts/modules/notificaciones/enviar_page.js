/**
 * ============================================
 * FORMULARIO: ENVIAR/EDITAR NOTIFICACIONES
 * ============================================
 * Archivo: src/scripts/modules/notificaciones/enviar_page.js
 * 
 * PROPÓSITO:
 * Formulario completo para crear NUEVAS notificaciones o editar las existentes.
 * Permite seleccionar plantillas predefinidas y asignar clientes destinatarios.
 * 
 * CARACTERÍSTICAS:
 * - Modo creación (sin parámetro) o edición (?notificacion=ID)
 * - Selección de plantilla con autocompletado de asunto/mensaje
 * - Fecha/hora de envío configurable
 * - Asignación de clientes destinatarios (checkbox múltiple)
 * - Vista previa del mensaje final
 * - Validación de campos obligatorios
 * 
 * FLUJO CREACIÓN:
 * 1. Carga plantillas disponibles
 * 2. Usuario selecciona plantilla (opcional)
 * 3. Completa asunto, mensaje, tipo, fecha
 * 4. Selecciona clientes destinatarios
 * 5. Envía → Crea notificación + registros en destinatarios
 * 
 * FLUJO EDICIÓN:
 * 1. Detecta parámetro ?notificacion=ID
 * 2. Carga datos existentes desde NotificacionesCRUD.getById()
 * 3. Precarga formulario con valores actuales
 * 4. Usuario modifica y guarda
 * 5. Actualiza notificación + destinatarios
 * 
 * PÁGINA HTML:
 * pages/notificaciones/enviar.html
 * 
 * DEPENDENCIAS:
 * - NotificacionesCRUD.create() / .update()
 * - PlantillasCRUD.getAll()
 * ============================================
 */

import { PlantillasCRUD, NotificacionesCRUD } from '../notificaciones.js';
import { validateRequired } from '../../utils.js';
import { splitTemplateName } from '../../../js/shared/plantillas-helpers.js';

const BUTTON_ICON = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>';

// Helpers para plantillas
const getField = (record, pascalKey, lowerKey, fallback = null) => record?.[pascalKey] ?? record?.[lowerKey] ?? fallback;
const getPlantillaId = (r) => getField(r, 'id_Plantillas', 'id_plantillas');
const getPlantillaNombre = (r) => splitTemplateName(getField(r, 'Pla_Nombre', 'pla_nombre', 'Plantilla sin nombre')).baseName;
const getPlantillaTipo = (r) => getField(r, 'Pla_Tipo', 'pla_tipo', '');
const getPlantillaModulo = (r) => getField(r, 'Pla_Modulo', 'pla_modulo', 'General');
const getPlantillaAsunto = (r) => getField(r, 'Pla_Asunto', 'pla_asunto', '');
const getPlantillaContenido = (r) => getField(r, 'Pla_Contenido', 'pla_contenido', '');

// Helpers de fecha
const formatDateForInput = (isoString) => {
  if (!isoString) return '';
  const d = new Date(isoString);
  if (isNaN(d.getTime())) return '';
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const formatDateToISO = (inputValue) => {
  if (!inputValue) return '';
  const d = new Date(inputValue);
  if (isNaN(d.getTime())) return '';
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
};

class NotificationForm {
  constructor() {
    this.templates = [];
    this.selectedTemplate = null;
    this.previewMessageOverride = null;

    const params = new URLSearchParams(window.location.search);
    this.notificationId = params.get('notificacion');
    this.isEditMode = Boolean(this.notificationId);

    this.cacheElements();
    this.bindEvents();
    this.updateUI();
    this.setInitialDate();
    this.init();
  }

  cacheElements() {
    this.el = {
      plantilla: document.getElementById('selectPlantilla'),
      cliente: document.getElementById('selectCliente'),
      asunto: document.getElementById('notificacionAsunto'),
      fecha: document.getElementById('fechaProgramada'),
      previewNombre: document.getElementById('previewNombre'),
      previewModulo: document.getElementById('previewModulo'),
      previewTipo: document.getElementById('previewTipo'),
      previewAsunto: document.getElementById('previewAsunto'),
      previewContenido: document.getElementById('previewContenido'),
      submitBtn: document.getElementById('enviarBtn'),
      titulo: document.querySelector('.section-title'),
      subtitulo: document.querySelector('.section-subtitle')
    };
  }

  bindEvents() {
    this.el.plantilla?.addEventListener('change', (e) => this.handleTemplateChange(e.target.value));
    this.el.asunto?.addEventListener('input', () => this.updatePreview());
    this.el.submitBtn?.addEventListener('click', () => this.handleSubmit());
  }

  updateUI() {
    const texts = this.isEditMode 
      ? { title: 'Editar notificación', subtitle: 'Actualiza los detalles y reprograma el envío.', btn: 'Actualizar Notificación' }
      : { title: 'Enviar notificación', subtitle: 'Programa una notificación seleccionando plantilla y fecha.', btn: 'Programar Envío' };
    
    if (this.el.titulo) this.el.titulo.textContent = texts.title;
    if (this.el.subtitulo) this.el.subtitulo.textContent = texts.subtitle;
    this.setSubmitButton(texts.btn, false);
  }

  setInitialDate() {
    if (!this.el.fecha || this.isEditMode) return;
    const now = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    this.el.fecha.value = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`;
  }

  async init() {
    await Promise.all([this.loadTemplates(), this.loadClientes()]);
    if (this.isEditMode) await this.loadNotification();
    this.updatePreview();
  }

  async loadTemplates() {
    if (!this.el.plantilla) return;

    this.el.plantilla.disabled = true;
    this.el.plantilla.innerHTML = '<option value="">Cargando plantillas...</option>';

    const { data, error } = await PlantillasCRUD.getActive();
    if (error) {
      console.error('Error al cargar plantillas:', error);
      this.el.plantilla.innerHTML = '<option value="">Error al cargar plantillas</option>';
      this.el.plantilla.disabled = false;
      return;
    }

    this.templates = Array.isArray(data) ? data : [];
    this.renderTemplateOptions();
    this.el.plantilla.disabled = false;
  }

  async loadClientes() {
    if (!this.el.cliente) return;

    this.el.cliente.disabled = true;
    this.el.cliente.innerHTML = '<option value="">Cargando clientes...</option>';

    try {
      const { supabase } = await import('../../supabase-client.js');
      const { data, error } = await supabase
        .from('clientes')
        .select('id_clientes, cli_nombre, cli_apellido, cli_email')
        .order('cli_nombre', { ascending: true });

      if (error) throw error;

      const clientes = Array.isArray(data) ? data : [];
      this.renderClienteOptions(clientes);
      this.el.cliente.disabled = false;
    } catch (error) {
      console.error('Error al cargar clientes:', error);
      this.el.cliente.innerHTML = '<option value="">Error al cargar clientes</option>';
      this.el.cliente.disabled = false;
    }
  }

  renderClienteOptions(clientes, selectedId = null) {
    if (!this.el.cliente) return;
    
    const options = clientes.map(c => {
      const id = c.id_Clientes ?? c.id_clientes;
      const nombre = `${c.Cli_Nombre ?? c.cli_nombre} ${c.Cli_Apellido ?? c.cli_apellido}`;
      const email = c.Cli_Email ?? c.cli_email;
      const selected = selectedId !== null && String(selectedId) === String(id) ? 'selected' : '';
      return `<option value="${id}" ${selected}>${nombre} (${email})</option>`;
    }).join('');

    this.el.cliente.innerHTML = `<option value="">📢 Notificación general (todos los clientes)</option>${options}`;
  }

  renderTemplateOptions(selectedId = null) {
    if (!this.el.plantilla) return;
    const options = this.templates
      .filter(t => getPlantillaId(t) !== null)
      .map(t => {
        const id = getPlantillaId(t);
        const name = getPlantillaNombre(t);
        const tipo = getPlantillaTipo(t);
        const tipoLabel = tipo ? ` (${tipo})` : '';
        const selected = selectedId !== null && String(selectedId) === String(id) ? 'selected' : '';
        return `<option value="${id}" ${selected}>${name}${tipoLabel}</option>`;
      }).join('');

    this.el.plantilla.innerHTML = `<option value="">Selecciona una plantilla</option>${options}`;
  }

  findTemplateById(id) {
    if (!id) return null;
    return this.templates.find(t => String(getPlantillaId(t)) === String(id)) ?? null;
  }

  handleTemplateChange(templateId) {
    this.selectedTemplate = this.findTemplateById(templateId);
    this.previewMessageOverride = null;
    this.updatePreview();
  }

  updatePreview() {
    const asunto = this.el.asunto?.value.trim() || 'Sin asunto';
    const nombre = this.selectedTemplate ? getPlantillaNombre(this.selectedTemplate) : 'Selecciona una plantilla';
    const tipo = this.selectedTemplate ? (getPlantillaTipo(this.selectedTemplate) || '-') : '-';
    const modulo = this.selectedTemplate ? getPlantillaModulo(this.selectedTemplate) : 'Sin módulo';
    const contenido = this.previewMessageOverride ?? (this.selectedTemplate ? getPlantillaContenido(this.selectedTemplate) : 'Selecciona una plantilla.');

    if (this.el.previewNombre) this.el.previewNombre.textContent = nombre;
    if (this.el.previewTipo) this.el.previewTipo.textContent = tipo;
    if (this.el.previewModulo) this.el.previewModulo.textContent = modulo;
    if (this.el.previewAsunto) this.el.previewAsunto.textContent = asunto;
    if (this.el.previewContenido) this.el.previewContenido.textContent = contenido;
  }

  async loadNotification() {
    const id = Number(this.notificationId);
    if (isNaN(id)) return;

    const { data, error } = await NotificacionesCRUD.getById(id);
    
    if (error || !data) {
      alert('No se pudo cargar la notificación.');
      window.location.href = './notificaciones.html';
      return;
    }

    if (this.el.asunto) this.el.asunto.value = data.not_asunto ?? '';
    if (this.el.fecha && data.not_fechaprogramada) this.el.fecha.value = formatDateForInput(data.not_fechaprogramada);
    if (this.el.cliente && data.id_cliente_fk) this.el.cliente.value = String(data.id_cliente_fk);

    const plantillaId = data.id_plantillas_fk;
    if (plantillaId) {
      let template = this.findTemplateById(plantillaId);
      
      if (!template) {
        const { data: plantillaData, error: plantillaError } = await PlantillasCRUD.getById(plantillaId);
        
        if (!plantillaError && plantillaData) {
          this.templates.push(plantillaData);
          template = plantillaData;
        } else {
          template = {
            id_plantillas: plantillaId,
            pla_nombre: `Plantilla #${plantillaId} (Inactiva)`,
            pla_tipo: data.not_tipo ?? '',
            pla_modulo: 'General',
            pla_asunto: data.not_asunto ?? '',
            pla_contenido: data.not_mensaje ?? ''
          };
          this.templates.push(template);
        }
      }
      
      this.selectedTemplate = template;
      this.renderTemplateOptions(plantillaId);
      if (this.el.plantilla) this.el.plantilla.value = String(plantillaId);
    }

    this.previewMessageOverride = data.not_mensaje ?? null;
    this.updatePreview();
  }

  async handleSubmit() {
    const asunto = this.el.asunto?.value ?? '';
    const fecha = this.el.fecha?.value ?? '';

    if (!validateRequired(asunto, 'Asunto')) return;
    if (!fecha) { alert('Selecciona la fecha y hora de envío.'); return; }
    if (!this.selectedTemplate) { alert('Selecciona una plantilla.'); return; }

    const fechaISO = formatDateToISO(fecha);
    if (!fechaISO) { alert('La fecha seleccionada no es válida.'); return; }

    const plantillaId = getPlantillaId(this.selectedTemplate);
    if (!plantillaId) { alert('La plantilla seleccionada no es válida.'); return; }

    const clienteId = this.el.cliente?.value ?? '';
    const payload = {
      not_asunto: asunto.trim(),
      not_mensaje: getPlantillaContenido(this.selectedTemplate),
      not_tipo: getPlantillaTipo(this.selectedTemplate) || 'Push',
      id_plantillas_fk: plantillaId,
      not_fechaprogramada: fechaISO,
      not_estado: 'Pendiente'
    };

    if (clienteId) {
      payload.id_cliente_fk = Number(clienteId);
      console.log('📌 Notificación ESPECÍFICA para cliente:', clienteId);
    } else {
      console.log('📢 Notificación GENERAL');
    }

    this.setSubmitButton(this.isEditMode ? 'Actualizando...' : 'Guardando...', true);

    try {
      const { error } = this.isEditMode 
        ? await NotificacionesCRUD.update(Number(this.notificationId), payload)
        : await NotificacionesCRUD.create(payload);

      if (error) throw error;

      alert(this.isEditMode ? 'Notificación actualizada.' : 'Notificación programada.');
      window.location.href = './notificaciones.html';
    } catch (error) {
      console.error('Error al guardar:', error);
      alert('Error al guardar la notificación.');
    } finally {
      this.updateUI();
    }
  }

  setSubmitButton(label, disabled) {
    if (!this.el.submitBtn) return;
    this.el.submitBtn.innerHTML = `${BUTTON_ICON} ${label}`;
    this.el.submitBtn.disabled = Boolean(disabled);
  }
}

const bootstrap = () => new NotificationForm();
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrap);
} else {
  bootstrap();
}
