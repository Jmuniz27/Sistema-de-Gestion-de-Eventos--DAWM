import stateManager from '../../js/state-manager.js';
import { obtenerEntradasPorUsuario } from '../../scripts/modules/boletos.js';

// Cargar entradas del usuario
async function cargarEntradas() {
  const container = document.getElementById('entradas-container');
  
  // Obtener usuario logueado
  const user = stateManager.getCurrentUser();
  
  if (!user) {
    container.innerHTML = `
      <div class="container">
        <p style="text-align: center; padding: 40px;">
          Debes <a href="/pages/autenticacion/login.html">iniciar sesión</a> para ver tus entradas
        </p>
      </div>
    `;
    return;
  }

  // Mostrar loading
  container.innerHTML = `
    <div class="loading">
      <div class="loading-spinner"></div>
      <p>Cargando tus entradas...</p>
    </div>
  `;

  // Obtener entradas del usuario
  const resultado = await obtenerEntradasPorUsuario(user.id_usuario);

  if (!resultado.success) {
    container.innerHTML = `
      <div class="container">
        <p style="text-align: center; padding: 40px; color: red;">
          Error al cargar entradas: ${resultado.error}
        </p>
      </div>
    `;
    return;
  }

  if (resultado.data.length === 0) {
    container.innerHTML = `
      <div class="container">
        <p style="text-align: center; padding: 40px;">
          No tienes entradas asignadas en este momento
        </p>
      </div>
    `;
    return;
  }

  // Mostrar información del usuario y grid de entradas
  let html = `
    <div class="ticket-summary">
      <div class="ticket-summary-card">
        <div class="ticket-summary-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </div>
        <div class="ticket-summary-content">
          <p class="ticket-summary-label">Usuario</p>
          <p class="ticket-summary-value">${user.usuario_nombre} ${user.usuario_apellido}</p>
        </div>
      </div>
      <div class="ticket-summary-card">
        <div class="ticket-summary-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 10H3M21 6H3M21 14H3M21 18H3"></path>
          </svg>
        </div>
        <div class="ticket-summary-content">
          <p class="ticket-summary-label">Total de Entradas</p>
          <p class="ticket-summary-value">${resultado.data.length}</p>
        </div>
      </div>
    </div>

    <div class="tickets-grid">
  `;

  // Mostrar cada entrada como tarjeta mejorada
  resultado.data.forEach((entrada, index) => {
    const nombreEvento = entrada.boleto?.eventos?.evt_nombre || 'Sin información del evento';
    const descripcionEvento = entrada.boleto?.eventos?.evt_descripcion || 'Sin descripción';
    const fechaEvento = entrada.boleto?.eventos?.evt_fechainicio || null;
    const imagenEvento = entrada.boleto?.eventos?.evt_imagenportada || '';
    const cantidad = entrada.enta_cantidad || 0;
    const precioUnitario = entrada.boleto?.bol_precio || 0;
    const precioTotal = precioUnitario * cantidad;
    const fechaValida = entrada.enta_fechavalida || null;

    // Formatear fecha en español
    const formatearFecha = (fecha) => {
      if (!fecha) return 'Fecha no disponible';
      const opciones = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(fecha).toLocaleDateString('es-EC', opciones);
    };

    html += `
      <div class="ticket-card">
        <div class="ticket-card-image">
          ${imagenEvento ?
            `<img src="${imagenEvento}" alt="${nombreEvento}">` :
            `<div class="ticket-card-image-placeholder">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
            </div>`
          }
          <span class="ticket-badge">Entrada #${index + 1}</span>
        </div>

        <div class="ticket-card-content">
          <h3 class="ticket-card-title">${nombreEvento}</h3>
          <p class="ticket-card-description">
            ${descripcionEvento.substring(0, 80)}${descripcionEvento.length > 80 ? '...' : ''}
          </p>

          <div class="ticket-info-grid">
            <div class="ticket-info-item">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              <div class="ticket-info-text">
                <span class="ticket-info-label">Fecha del Evento</span>
                <span class="ticket-info-value">${formatearFecha(fechaEvento)}</span>
              </div>
            </div>

            <div class="ticket-info-item">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
              </svg>
              <div class="ticket-info-text">
                <span class="ticket-info-label">Cantidad</span>
                <span class="ticket-info-value">${cantidad} ${cantidad === 1 ? 'boleto' : 'boletos'}</span>
              </div>
            </div>

            <div class="ticket-info-item">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              <div class="ticket-info-text">
                <span class="ticket-info-label">Válido hasta</span>
                <span class="ticket-info-value">${formatearFecha(fechaValida)}</span>
              </div>
            </div>

            <div class="ticket-info-item">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="12" y1="1" x2="12" y2="23"></line>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
              </svg>
              <div class="ticket-info-text">
                <span class="ticket-info-label">Precio Unitario</span>
                <span class="ticket-info-value">$${precioUnitario.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div class="ticket-card-footer">
            <div class="ticket-total">
              <span class="ticket-total-label">Total Pagado</span>
              <span class="ticket-total-value">$${precioTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    `;
  });

  html += '</div>'; // Cierre tickets-grid

  container.innerHTML = html;
}

// Cargar al iniciar
document.addEventListener('DOMContentLoaded', cargarEntradas);