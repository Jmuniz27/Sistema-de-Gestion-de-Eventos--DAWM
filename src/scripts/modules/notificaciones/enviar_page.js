/**
 * ============================================
 * PÁGINA DE PROGRAMACIÓN DE NOTIFICACIONES
 * ============================================
 * Permite crear o editar notificaciones seleccionando una plantilla,
 * definiendo módulo, asunto y fecha de envío.
 */

import { PlantillasCRUD } from './plantillas_crud.js';
import { NotificacionesCRUD } from './notificaciones_crud.js';
import { validateRequired } from '../../utils.js';

const BUTTON_ICON = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>';

const getPlantillaId = (record = {}) => record?.id_Plantillas ?? record?.id_plantillas ?? null;
const getPlantillaNombre = (record = {}) => record?.Pla_Nombre ?? record?.pla_nombre ?? 'Plantilla sin nombre';
const getPlantillaTipo = (record = {}) => record?.Pla_Tipo ?? record?.pla_tipo ?? '';
const getPlantillaModulo = (record = {}) => record?.Pla_Modulo ?? record?.pla_modulo ?? 'General';
const getPlantillaAsunto = (record = {}) => record?.Pla_Asunto ?? record?.pla_asunto ?? '';
const getPlantillaContenido = (record = {}) => record?.Pla_Contenido ?? record?.pla_contenido ?? '';

/**
 * Convierte una fecha ISO a formato datetime-local preservando la hora exacta
 * Sin ajustes de zona horaria - muestra la hora tal cual está en la BD
 */
const toLocalDateTimeValue = (isoString) => {
  if (!isoString) return '';
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return '';
  
  // Obtener componentes de fecha/hora en hora local
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

/**
 * Convierte el valor del input datetime-local a ISO string
 * Preserva la hora local sin conversión a UTC
 */
const toISOStringFromInput = (inputValue) => {
  if (!inputValue) return '';
  
  // El input viene en formato "YYYY-MM-DDTHH:mm"
  // Lo convertimos a ISO pero manteniendo la hora local como UTC
  const localDate = new Date(inputValue);
  if (Number.isNaN(localDate.getTime())) return '';
  
  // Obtener componentes en hora local
  const year = localDate.getFullYear();
  const month = String(localDate.getMonth() + 1).padStart(2, '0');
  const day = String(localDate.getDate()).padStart(2, '0');
  const hours = String(localDate.getHours()).padStart(2, '0');
  const minutes = String(localDate.getMinutes()).padStart(2, '0');
  const seconds = String(localDate.getSeconds()).padStart(2, '0');
  
  // Retornar en formato ISO pero con la hora local (sin Z al final para evitar conversión UTC)
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
};

class NotificacionFormPage {
  constructor() {
    this.templates = [];
    this.selectedTemplate = null;
    this.previewMessageOverride = null;

    const params = new URLSearchParams(window.location.search);
    this.notificationId = params.get('notificacion');
    this.isEditMode = Boolean(this.notificationId);

    this.cacheElements();
    this.bindEvents();
    this.updateLabels();
    this.setInitialDate();
    void this.init();
  }

  cacheElements() {
    this.elements = {
      selectPlantilla: document.getElementById('selectPlantilla'),
      selectCliente: document.getElementById('selectCliente'),
      asuntoInput: document.getElementById('notificacionAsunto'),
      fechaInput: document.getElementById('fechaProgramada'),
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
    this.elements.selectPlantilla?.addEventListener('change', (event) => {
      this.handleTemplateChange(event.target.value);
    });

    this.elements.asuntoInput?.addEventListener('input', () => {
      this.updatePreview();
    });

    this.elements.submitBtn?.addEventListener('click', () => {
      void this.handleSubmit();
    });
  }

  updateLabels() {
    if (this.isEditMode) {
      if (this.elements.titulo) this.elements.titulo.textContent = 'Editar notificación';
      if (this.elements.subtitulo) {
        this.elements.subtitulo.textContent = 'Actualiza los detalles y reprograma el envío según sea necesario.';
      }
      this.setSubmitButton('Actualizar Notificación', false);
    } else {
      if (this.elements.titulo) this.elements.titulo.textContent = 'Enviar notificación';
      if (this.elements.subtitulo) {
        this.elements.subtitulo.textContent = 'Programa una notificación seleccionando la plantilla y los datos clave.';
      }
      this.setSubmitButton('Programar Envío', false);
    }
  }

  setInitialDate() {
    if (!this.elements.fechaInput || this.isEditMode) return;
    const now = new Date();
    
    // Obtener componentes en hora local
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    
    this.elements.fechaInput.value = `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  async init() {
    await Promise.all([
      this.loadTemplates(),
      this.loadClientes()
    ]);
    if (this.isEditMode) {
      await this.loadNotification();
    }
    this.updatePreview();
  }

  async loadTemplates() {
    if (!this.elements.selectPlantilla) return;

    this.elements.selectPlantilla.disabled = true;
    this.elements.selectPlantilla.innerHTML = '<option value="">Cargando plantillas...</option>';

    const { data, error } = await PlantillasCRUD.getActive();
    if (error) {
      console.error('Error al cargar plantillas:', error);
      this.elements.selectPlantilla.innerHTML = '<option value="">No se pudieron cargar las plantillas</option>';
      this.elements.selectPlantilla.disabled = false;
      return;
    }

    this.templates = Array.isArray(data) ? data : [];
    this.renderTemplateOptions();
    this.elements.selectPlantilla.disabled = false;
  }

  /**
   * ============================================
   * CARGAR CLIENTES PARA ASIGNACIÓN
   * ============================================
   * Obtiene la lista de clientes desde la base de datos
   * para permitir asignar notificaciones específicas.
   * 
   * Lógica de asignación:
   * - Si se selecciona un cliente: Notificación específica (id_cliente_fk guardado)
   * - Si NO se selecciona: Notificación general (se envía a todos los clientes activos)
   * 
   * La tabla Destinatarios manejará el registro de envíos:
   * - Notificación específica → 1 registro en Destinatarios
   * - Notificación general → N registros en Destinatarios (uno por cliente)
   */
  async loadClientes() {
    if (!this.elements.selectCliente) return;

    this.elements.selectCliente.disabled = true;
    this.elements.selectCliente.innerHTML = '<option value="">Cargando clientes...</option>';

    try {
      const supabaseModule = await import('../../supabase-client.js');
      const supabase = supabaseModule.supabase;
      
      // Obtener todos los clientes ordenados por nombre
      // No filtramos por estado aquí - el filtro se aplicará al momento de enviar
      const { data, error } = await supabase
        .from('clientes')
        .select('id_clientes, cli_nombre, cli_apellido, cli_email')
        .order('cli_nombre', { ascending: true });

      if (error) {
        console.error('Error al cargar clientes:', error);
        throw error;
      }

      const clientes = Array.isArray(data) ? data : [];
      this.renderClienteOptions(clientes);
      this.elements.selectCliente.disabled = false;
    } catch (error) {
      console.error('Error al cargar clientes:', error);
      this.elements.selectCliente.innerHTML = '<option value="">Error al cargar clientes</option>';
      this.elements.selectCliente.disabled = false;
    }
  }

  /**
   * ============================================
   * RENDERIZAR OPCIONES DE CLIENTES
   * ============================================
   * Genera el HTML de opciones para el select de clientes.
   * 
   * @param {Array} clientes - Lista de clientes desde la BD
   * @param {number|null} selectedId - ID del cliente a pre-seleccionar (modo edición)
   * 
   * Opción por defecto (vacía):
   * - Representa una notificación GENERAL
   * - Se enviará a TODOS los clientes activos
   * - No se guarda id_cliente_fk en la tabla notificaciones
   * 
   * Opción con cliente específico:
   * - Notificación INDIVIDUAL
   * - Se enviará SOLO a ese cliente
   * - Se guarda id_cliente_fk en la tabla notificaciones
   */
  renderClienteOptions(clientes, selectedId = null) {
    if (!this.elements.selectCliente) return;
    
    const options = clientes
      .map((cliente) => {
        // Normalizar nombres de columnas (soporta PascalCase y lowercase)
        const id = cliente.id_Clientes ?? cliente.id_clientes;
        const nombre = `${cliente.Cli_Nombre ?? cliente.cli_nombre} ${cliente.Cli_Apellido ?? cliente.cli_apellido}`;
        const email = cliente.Cli_Email ?? cliente.cli_email;
        const selected = selectedId !== null && String(selectedId) === String(id) ? 'selected' : '';
        return `<option value="${id}" ${selected}>${nombre} (${email})</option>`;
      })
      .join('');

    this.elements.selectCliente.innerHTML = `<option value="">📢 Notificación general (todos los clientes)</option>${options}`;
  }

  renderTemplateOptions(selectedId = null) {
    if (!this.elements.selectPlantilla) return;
    const options = this.templates
      .filter((template) => getPlantillaId(template) !== null)
      .map((template) => {
        const id = getPlantillaId(template);
        const name = getPlantillaNombre(template);
        const tipo = getPlantillaTipo(template);
        const tipoLabel = tipo ? ` (${tipo})` : '';
        const selected = selectedId !== null && String(selectedId) === String(id) ? 'selected' : '';
        return `<option value="${id}" ${selected}>${name}${tipoLabel}</option>`;
      })
      .join('');

    this.elements.selectPlantilla.innerHTML = `<option value="">Selecciona una plantilla</option>${options}`;
  }

  findTemplateById(id) {
    if (id === null || id === undefined || id === '') return null;
    const normalized = String(id);
    return this.templates.find((template) => String(getPlantillaId(template)) === normalized) ?? null;
  }

  handleTemplateChange(templateId) {
    const template = this.findTemplateById(templateId);
    this.selectedTemplate = template;
    this.previewMessageOverride = null;
    this.updatePreview();
  }

  updatePreview() {
    const asuntoValue = this.elements.asuntoInput?.value.trim() || 'Sin asunto';

    const templateName = this.selectedTemplate ? getPlantillaNombre(this.selectedTemplate) : 'Selecciona una plantilla';
    const templateTipo = this.selectedTemplate ? (getPlantillaTipo(this.selectedTemplate) || '-') : '-';
    const templateModulo = this.selectedTemplate ? getPlantillaModulo(this.selectedTemplate) : 'Sin módulo definido';
    const templateContent = this.previewMessageOverride ?? (this.selectedTemplate ? getPlantillaContenido(this.selectedTemplate) : 'Selecciona una plantilla para ver el contenido.');

    if (this.elements.previewNombre) this.elements.previewNombre.textContent = templateName;
    if (this.elements.previewTipo) this.elements.previewTipo.textContent = templateTipo || '-';
    if (this.elements.previewModulo) this.elements.previewModulo.textContent = templateModulo || '-';
    if (this.elements.previewAsunto) this.elements.previewAsunto.textContent = asuntoValue;
    if (this.elements.previewContenido) this.elements.previewContenido.textContent = templateContent || 'Selecciona una plantilla para ver el contenido.';
  }

  async loadNotification() {
    const id = Number(this.notificationId);
    if (Number.isNaN(id)) return;

    const { data, error } = await NotificacionesCRUD.getById(id);
    
    if (error || !data) {
      alert('No se pudo cargar la notificación seleccionada.');
      window.location.href = './notificaciones.html';
      return;
    }

    // Cargar el módulo si existe en la notificación, sino usar el de la plantilla
    const moduloGuardado = data.not_modulo ?? null;

    if (this.elements.asuntoInput) {
      this.elements.asuntoInput.value = data.not_asunto ?? '';
    }

    if (this.elements.fechaInput && data.not_fechaprogramada) {
      this.elements.fechaInput.value = toLocalDateTimeValue(data.not_fechaprogramada);
    }

    // Cargar cliente si existe
    if (this.elements.selectCliente && data.id_cliente_fk) {
      this.elements.selectCliente.value = String(data.id_cliente_fk);
    }

    const plantillaId = data.id_plantillas_fk;
    if (plantillaId) {
      let template = this.findTemplateById(plantillaId);
      
      if (!template) {
        // Si la plantilla no se encuentra en las activas, cargarla directamente desde BD
        console.log(`⚠️ Plantilla #${plantillaId} no está activa, cargándola desde BD...`);
        const { data: plantillaData, error: plantillaError } = await PlantillasCRUD.getById(plantillaId);
        
        if (!plantillaError && plantillaData) {
          // Agregar la plantilla inactiva a la lista temporal
          this.templates.push(plantillaData);
          template = plantillaData;
          console.log('✅ Plantilla cargada:', plantillaData);
        } else {
          // Último recurso: crear fallback con los datos de la notificación
          console.warn('❌ No se pudo cargar la plantilla desde BD, usando fallback');
          template = {
            id_Plantillas: plantillaId,
            id_plantillas: plantillaId,
            Pla_Nombre: `Plantilla #${plantillaId} (Inactiva)`,
            pla_nombre: `Plantilla #${plantillaId} (Inactiva)`,
            Pla_Tipo: data.not_tipo ?? '',
            pla_tipo: data.not_tipo ?? '',
            Pla_Modulo: 'General',
            pla_modulo: 'General',
            Pla_Asunto: data.not_asunto ?? '',
            pla_asunto: data.not_asunto ?? '',
            Pla_Contenido: data.not_mensaje ?? '',
            pla_contenido: data.not_mensaje ?? ''
          };
          this.templates.push(template);
        }
      }
      
      this.selectedTemplate = template;
      this.renderTemplateOptions(plantillaId);

      if (this.elements.selectPlantilla) {
        this.elements.selectPlantilla.value = String(plantillaId);
      }
    }

    this.previewMessageOverride = data.not_mensaje ?? null;
    this.updatePreview();
  }

  async handleSubmit() {
    const asuntoValue = this.elements.asuntoInput?.value ?? '';
    const fechaValue = this.elements.fechaInput?.value ?? '';

    if (!validateRequired(asuntoValue, 'Asunto')) return;

    if (!fechaValue) {
      alert('Selecciona la fecha y hora de envío.');
      return;
    }

    if (!this.selectedTemplate) {
      alert('Selecciona una plantilla para continuar.');
      return;
    }

    const fechaISO = toISOStringFromInput(fechaValue);
    if (!fechaISO) {
      alert('La fecha seleccionada no es válida.');
      return;
    }

    const plantillaId = getPlantillaId(this.selectedTemplate);
    if (!plantillaId) {
      alert('La plantilla seleccionada no es válida.');
      return;
    }

    // ============================================
    // LÓGICA DE ASIGNACIÓN DE CLIENTE
    // ============================================
    // Obtener cliente seleccionado del dropdown
    const clienteId = this.elements.selectCliente?.value ?? '';
    
    // Construir payload base de la notificación
    const payload = {
      not_asunto: asuntoValue.trim(),
      not_mensaje: getPlantillaContenido(this.selectedTemplate),
      not_tipo: getPlantillaTipo(this.selectedTemplate) || 'Push',
      id_plantillas_fk: plantillaId,
      not_fechaprogramada: fechaISO,
      not_estado: 'Pendiente'
    };

    // ============================================
    // ASIGNACIÓN CONDICIONAL DE CLIENTE
    // ============================================
    // CASO 1: Cliente específico seleccionado
    // - Se guarda id_cliente_fk en notificaciones
    // - Al procesar, se creará 1 registro en Destinatarios
    // - Solo ese cliente recibirá la notificación
    //
    // CASO 2: Sin cliente (opción "general")
    // - id_cliente_fk = null en notificaciones
    // - Al procesar, se buscarán TODOS los clientes activos
    // - Se crearán N registros en Destinatarios (uno por cliente)
    // - Todos los clientes recibirán la notificación
    if (clienteId && clienteId !== '') {
      payload.id_cliente_fk = Number(clienteId);
      console.log('📌 Notificación ESPECÍFICA para cliente:', clienteId);
    } else {
      console.log('📢 Notificación GENERAL (se enviará a todos los clientes activos)');
    }

    this.setSubmitButton(this.isEditMode ? 'Actualizando...' : 'Guardando...', true);

    try {
      if (this.isEditMode) {
        await this.updateNotification(payload);
        alert('Notificación actualizada correctamente.');
      } else {
        await this.createNotification(payload);
        alert('Notificación programada correctamente.');
      }
      window.location.href = './notificaciones.html';
    } catch (error) {
      console.error('Error al guardar la notificación:', error);
      alert('Ocurrió un error al guardar la notificación. Inténtalo nuevamente.');
    } finally {
      this.updateLabels();
    }
  }

  async createNotification(payload) {
    const { error } = await NotificacionesCRUD.create(payload);
    if (error) {
      throw error;
    }
  }

  async updateNotification(payload) {
    const id = Number(this.notificationId);
    if (Number.isNaN(id)) {
      throw new Error('Identificador de notificación inválido.');
    }

    const { error } = await NotificacionesCRUD.update(id, payload);
    if (error) {
      throw error;
    }
  }

  setSubmitButton(label, disabled) {
    if (!this.elements.submitBtn) return;
    this.elements.submitBtn.innerHTML = `${BUTTON_ICON} ${label}`;
    this.elements.submitBtn.disabled = Boolean(disabled);
  }
}

const bootstrap = () => {
  new NotificacionFormPage();
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrap);
} else {
  bootstrap();
}
