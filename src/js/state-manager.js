/**
 * State Manager - Sistema de Gestión de Estado Global
 * Maneja el estado del usuario autenticado y datos compartidos entre páginas
 */

class StateManager {
  constructor() {
    this.listeners = {};
    this.init();
  }

  /**
   * Inicializar el estado desde localStorage
   */
  init() {
    // Cargar usuario desde localStorage si existe
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        this.user = JSON.parse(savedUser);
      } catch (error) {
        console.error('Error parsing saved user:', error);
        this.user = null;
      }
    } else {
      this.user = null;
    }
  }

  /**
   * Obtener usuario actual
   */
  getCurrentUser() {
    return this.user;
  }

  /**
   * Verificar si hay un usuario autenticado
   */
  isAuthenticated() {
    return this.user !== null;
  }

  /**
   * Establecer usuario actual (después del login)
   */
  setCurrentUser(user) {
    this.user = user;
    localStorage.setItem('user', JSON.stringify(user));
    this.notify('userChanged', user);
  }

  /**
   * Cerrar sesión
   */
  logout() {
    this.user = null;
    localStorage.removeItem('user');
    localStorage.removeItem('selectedEvent');
    sessionStorage.clear();
    this.notify('userChanged', null);
  }

  /**
   * Guardar datos del evento seleccionado
   * Para pasar información entre páginas (ej: landing -> detalle evento)
   */
  setSelectedEvent(event) {
    localStorage.setItem('selectedEvent', JSON.stringify(event));
    sessionStorage.setItem('lastEventId', event.id_Eventos);
  }

  /**
   * Obtener evento seleccionado
   */
  getSelectedEvent() {
    const savedEvent = localStorage.getItem('selectedEvent');
    if (savedEvent) {
      try {
        return JSON.parse(savedEvent);
      } catch (error) {
        console.error('Error parsing saved event:', error);
        return null;
      }
    }
    return null;
  }

  /**
   * Limpiar evento seleccionado
   */
  clearSelectedEvent() {
    localStorage.removeItem('selectedEvent');
    sessionStorage.removeItem('lastEventId');
  }

  /**
   * Guardar datos temporales en sesión (se pierden al cerrar navegador)
   */
  setSessionData(key, value) {
    sessionStorage.setItem(key, JSON.stringify(value));
  }

  /**
   * Obtener datos temporales de sesión
   */
  getSessionData(key) {
    const data = sessionStorage.getItem(key);
    if (data) {
      try {
        return JSON.parse(data);
      } catch (error) {
        return data;
      }
    }
    return null;
  }

  /**
   * Guardar datos persistentes (permanecen después de cerrar navegador)
   */
  setPersistentData(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  /**
   * Obtener datos persistentes
   */
  getPersistentData(key) {
    const data = localStorage.getItem(key);
    if (data) {
      try {
        return JSON.parse(data);
      } catch (error) {
        return data;
      }
    }
    return null;
  }

  /**
   * Eliminar datos persistentes
   */
  removePersistentData(key) {
    localStorage.removeItem(key);
  }

  /**
   * Sistema de observadores para reactividad
   * Permite que los componentes se suscriban a cambios
   */
  subscribe(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);

    // Retornar función para desuscribirse
    return () => {
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    };
  }

  /**
   * Notificar a los observadores
   */
  notify(event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(callback => callback(data));
    }
  }

  /**
   * Guardar carrito de compras (para módulo de boletos)
   */
  setCart(cart) {
    this.setPersistentData('cart', cart);
    this.notify('cartChanged', cart);
  }

  /**
   * Obtener carrito de compras
   */
  getCart() {
    return this.getPersistentData('cart') || [];
  }

  /**
   * Agregar ítem al carrito
   */
  addToCart(item) {
    const cart = this.getCart();
    cart.push(item);
    this.setCart(cart);
  }

  /**
   * Eliminar ítem del carrito
   */
  removeFromCart(itemId) {
    const cart = this.getCart();
    const updatedCart = cart.filter(item => item.id !== itemId);
    this.setCart(updatedCart);
  }

  /**
   * Limpiar carrito
   */
  clearCart() {
    this.setCart([]);
  }

  /**
   * Obtener información de navegación (breadcrumbs)
   */
  getNavigationHistory() {
    return this.getSessionData('navigationHistory') || [];
  }

  /**
   * Agregar página al historial de navegación
   */
  addToNavigationHistory(page) {
    const history = this.getNavigationHistory();
    history.push({
      page,
      timestamp: new Date().toISOString()
    });
    // Mantener solo las últimas 10 páginas
    if (history.length > 10) {
      history.shift();
    }
    this.setSessionData('navigationHistory', history);
  }

  /**
   * Exportar estado completo (para debugging)
   */
  exportState() {
    return {
      user: this.user,
      selectedEvent: this.getSelectedEvent(),
      cart: this.getCart(),
      navigationHistory: this.getNavigationHistory()
    };
  }
}

// Crear instancia global única (Singleton)
const stateManager = new StateManager();

// Exportar instancia
export default stateManager;

// También exportar en window para acceso global desde scripts no-module
if (typeof window !== 'undefined') {
  window.StateManager = stateManager;
}
