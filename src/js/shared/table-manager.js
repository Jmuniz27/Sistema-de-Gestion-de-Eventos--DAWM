/**
 * ============================================
 * GESTOR GENÉRICO DE TABLAS CON FILTROS
 * ============================================
 * Centraliza toda la lógica repetida de tablas con filtros,
 * eliminando duplicación entre notificaciones.js y plantillas-manager.js
 */

import { setTableMessage } from './table-helpers.js';

/**
 * Clase base para manejar tablas con filtros y acciones CRUD
 */
export class TableManager {
  constructor(config) {
    this.config = config;
    this.tableBodyRef = null;
    this.allItems = [];
    this.filterRefs = {};
    this.filterDebounceTimer = null;
  }

  /**
   * Inicializa la tabla y sus listeners
   */
  init() {
    this.tableBodyRef = document.getElementById(this.config.bodyId);
    if (!this.tableBodyRef) return false;

    this.cacheFilterRefs();
    this.setupFilterListeners();
    this.tableBodyRef.addEventListener('click', (e) => this.handleTableClick(e));
    return true;
  }

  /**
   * Cachea las referencias de los elementos de filtro
   */
  cacheFilterRefs() {
    const filterIds = this.config.filterIds || {};
    Object.entries(filterIds).forEach(([key, id]) => {
      this.filterRefs[key] = document.getElementById(id);
    });
  }

  /**
   * Configura los listeners de los filtros
   */
  setupFilterListeners() {
    if (this.filterRefs.id) {
      this.filterRefs.id.addEventListener('input', () => {
        clearTimeout(this.filterDebounceTimer);
        this.filterDebounceTimer = setTimeout(() => this.applyFilters(), 200);
      });
    }
    if (this.filterRefs.type) {
      this.filterRefs.type.addEventListener('change', () => this.applyFilters());
    }
    if (this.filterRefs.state) {
      this.filterRefs.state.addEventListener('change', () => this.applyFilters());
    }
    if (this.filterRefs.reset) {
      this.filterRefs.reset.addEventListener('click', () => this.resetFilters());
    }
  }

  /**
   * Muestra mensaje de estado en la tabla
   */
  showMessage(message, state) {
    setTableMessage(this.tableBodyRef, message, this.config.totalColumns, state);
  }

  /**
   * Carga los datos desde la fuente (debe ser implementado por subclases)
   */
  async loadData() {
    throw new Error('loadData() debe ser implementado por la subclase');
  }

  /**
   * Renderiza las filas de la tabla (debe ser implementado por subclases)
   */
  renderRows(items) {
    throw new Error('renderRows() debe ser implementado por la subclase');
  }

  /**
   * Normaliza un item para aplicar filtros (puede ser sobreescrito)
   */
  normalizeItem(item) {
    return item;
  }

  /**
   * Aplica los filtros activos a los datos
   */
  applyFilters() {
    let results = [...this.allItems];

    // Filtro por ID
    const idQuery = this.filterRefs.id?.value.trim().toLowerCase();
    if (idQuery) {
      results = results.filter(item => {
        const id = this.getItemId(item);
        return String(id ?? '').toLowerCase().includes(idQuery);
      });
    }

    // Filtro por tipo
    const typeValue = this.filterRefs.type?.value ?? 'all';
    if (typeValue !== 'all') {
      results = results.filter(item => this.matchesType(item, typeValue));
    }

    // Filtro por estado
    const stateValue = this.filterRefs.state?.value ?? 'all';
    if (stateValue !== 'all') {
      results = results.filter(item => this.matchesState(item, stateValue));
    }

    if (results.length === 0) {
      this.showMessage(this.config.emptyFilterMessage || 'No hay elementos que coincidan con los filtros.', 'empty');
      return;
    }

    this.renderRows(results);
  }

  /**
   * Resetea todos los filtros
   */
  resetFilters() {
    if (this.filterRefs.id) this.filterRefs.id.value = '';
    if (this.filterRefs.type) this.filterRefs.type.value = 'all';
    if (this.filterRefs.state) this.filterRefs.state.value = 'all';
    this.applyFilters();
  }

  /**
   * Maneja clicks en acciones de la tabla
   */
  handleTableClick(event) {
    const target = event.target.closest('.table-action');
    if (!target) return;

    const { action, id } = target.dataset;
    if (!id) return;

    if (action === 'edit') {
      this.handleEdit(id);
    } else if (action === 'delete') {
      this.handleDelete(id);
    }
  }

  /**
   * Maneja la acción de editar
   */
  handleEdit(id) {
    const url = new URL(this.config.editPath, window.location.href);
    url.searchParams.set(this.config.editParam || 'id', id);
    window.location.href = url.toString();
  }

  /**
   * Maneja la acción de eliminar (debe ser implementado por subclases)
   */
  async handleDelete(id) {
    throw new Error('handleDelete() debe ser implementado por la subclase');
  }

  /**
   * Métodos auxiliares que pueden ser sobreescritos
   */
  getItemId(item) {
    return item.id;
  }

  matchesType(item, typeValue) {
    return false; // Sobreescribir en subclases
  }

  matchesState(item, stateValue) {
    return false; // Sobreescribir en subclases
  }
}

/**
 * Mapa de estados compartido
 */
export const STATUS_MAP = {
  enviado: { label: 'Enviada', className: 'status-enviado' },
  programado: { label: 'Programada', className: 'status-programado' },
  fallido: { label: 'Fallida', className: 'status-fallido' },
  cancelado: { label: 'Cancelada', className: 'status-cancelado' },
  default: { label: 'Pendiente', className: 'status-pendiente' }
};
