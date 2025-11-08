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
          Debes <a href="../autenticacion/login.html">iniciar sesión</a> para ver tus entradas
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
    <div class="container" style="margin-bottom: 20px;">
      <p style="font-size: 1.1em;">
        <strong>Usuario:</strong> ${user.usuario_nombre} ${user.usuario_apellido}
      </p>
      <p style="color: #666;">
        Total de entradas asignadas: <strong>${resultado.data.length}</strong>
      </p>
    </div>

    <!-- Events Grid (reutilizando estilos del landing) -->
    <div class="events-grid">
  `;

  // Mostrar cada entrada como tarjeta (estilo similar a eventos)
  resultado.data.forEach((entrada, index) => {
    const nombreEvento = entrada.boleto?.eventos?.evt_nombre || 'Sin información del evento';
    const descripcionEvento = entrada.boleto?.eventos?.evt_descripcion || 'Sin descripción';
    const fechaEvento = entrada.boleto?.eventos?.evt_fechainicio || null;
    const imagenEvento = entrada.boleto?.eventos?.evt_imagenportada || '';
    const cantidad = entrada.enta_cantidad || 0;
    const precioUnitario = entrada.boleto?.bol_precio || 0;
    const precioTotal = precioUnitario * cantidad;
    const fechaValida = entrada.enta_fechavalida || null;

    html += `
      <div class="event-card">
        ${imagenEvento ? 
          `<img src="${imagenEvento}" alt="${nombreEvento}" class="event-image">` : 
          '<div style="height: 200px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);"></div>'
        }
        <div class="event-content">
          <span class="event-badge">Entrada #${index + 1}</span>
          <h3 class="event-title">${nombreEvento}</h3>
          <p class="event-description" style="font-size: 0.9em; margin: 10px 0;">
            ${descripcionEvento.substring(0, 100)}${descripcionEvento.length > 100 ? '...' : ''}
          </p>
          
          <div class="event-info">
            <div class="info-item">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              <span>${fechaEvento ? new Date(fechaEvento).toLocaleDateString('es-EC') : 'Fecha no disponible'}</span>
            </div>
            
            <div class="info-item">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              <span>${cantidad} ${cantidad === 1 ? 'entrada' : 'entradas'}</span>
            </div>
          </div>

          <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #eee;">
            <p style="margin: 5px 0;">
              <strong>Precio unitario:</strong> $${precioUnitario.toFixed(2)}
            </p>
            <p style="margin: 5px 0;">
              <strong>Total:</strong> <span style="color: #2E4A8B; font-size: 1.2em; font-weight: bold;">$${precioTotal.toFixed(2)}</span>
            </p>
            <p style="margin: 5px 0; font-size: 0.9em; color: #666;">
              <strong>Válido hasta:</strong> ${fechaValida ? new Date(fechaValida).toLocaleDateString('es-EC') : 'No especificada'}
            </p>
          </div>
        </div>
      </div>
    `;
  });

  html += '</div>'; // Cierre events-grid

  container.innerHTML = html;
}

// Cargar al iniciar
document.addEventListener('DOMContentLoaded', cargarEntradas);