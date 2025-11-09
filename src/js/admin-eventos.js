import { supabase } from '../scripts/supabase-client.js';
import stateManager from './state-manager.js';

// PROTECCIÓN DE RUTA: Solo administradores
(async function protegerRuta() {
  const usuario = stateManager.getCurrentUser();

  if (!usuario) {
    alert('Debe iniciar sesión para acceder a esta página.');
    window.location.href = '/pages/autenticacion/login.html';
    return;
  }

  if (usuario.rol !== 'Administrador') {
    alert('Acceso denegado. Solo administradores pueden acceder a este panel.');
    window.location.href = '/';
    return;
  }
})();

// Cargar y mostrar eventos en tabla
async function cargarEventos() {
  const tableContent = document.getElementById('tableContent');

  try {
    // Mostrar loading
    tableContent.innerHTML = `
      <div class="loading-table">
        <div class="loading-spinner"></div>
        <p>Cargando eventos...</p>
      </div>
    `;

    // Obtener eventos ordenados por fecha más próxima (ascendente desde hoy)
    const { data: eventos, error } = await supabase
      .from('eventos')
      .select(`
        id_eventos,
        evt_nombre,
        evt_descripcion,
        evt_fechainicio,
        evt_fechafin,
        evt_direccion,
        evt_capacidadtotal,
        evt_capacidaddisponible,
        evt_preciobasegeneral,
        evt_estado,
        evt_imagenportada,
        ciudades (ciu_nombre)
      `)
      .order('evt_fechainicio', { ascending: true });

    if (error) {
      throw error;
    }

    // Si no hay eventos
    if (!eventos || eventos.length === 0) {
      tableContent.innerHTML = `
        <div class="empty-state">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          <h3>No hay eventos registrados</h3>
          <p>Comienza creando tu primer evento</p>
        </div>
      `;
      return;
    }

    // Generar tabla
    let tableHTML = `
      <div class="table-wrapper">
        <table class="events-table">
          <thead>
            <tr>
              <th>Imagen</th>
              <th>Nombre</th>
              <th>Fecha</th>
              <th>Ciudad</th>
              <th>Capacidad</th>
              <th>Precio</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
    `;

    eventos.forEach(evento => {
      const fechaInicio = new Date(evento.evt_fechainicio);
      const fechaFormateada = fechaInicio.toLocaleDateString('es-EC', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
      const horaFormateada = fechaInicio.toLocaleTimeString('es-EC', {
        hour: '2-digit',
        minute: '2-digit'
      });

      // Calcular disponibilidad
      const porcentajeDisponible = (evento.evt_capacidaddisponible / evento.evt_capacidadtotal) * 100;
      let capacityClass = 'capacity-high';
      if (porcentajeDisponible < 20) {
        capacityClass = 'capacity-low';
      } else if (porcentajeDisponible < 50) {
        capacityClass = 'capacity-medium';
      }

      // Estado badge
      const estadoNormalizado = (evento.evt_estado || 'programado').toLowerCase();

      tableHTML += `
        <tr data-evento-id="${evento.id_eventos}">
          <td>
            ${evento.evt_imagenportada ?
              `<img src="${evento.evt_imagenportada}" alt="${evento.evt_nombre}" class="event-table-image">` :
              `<div class="event-table-image-placeholder">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
              </div>`
            }
          </td>
          <td class="event-name-cell" title="${evento.evt_nombre}">${evento.evt_nombre}</td>
          <td class="event-date-cell">
            <span class="event-date-primary">${fechaFormateada}</span>
            <span class="event-date-time">${horaFormateada}</span>
          </td>
          <td>${evento.ciudades?.ciu_nombre || 'N/A'}</td>
          <td class="capacity-cell">
            <span class="capacity-value ${capacityClass}">${evento.evt_capacidaddisponible}</span>
            <span class="capacity-label">de ${evento.evt_capacidadtotal}</span>
          </td>
          <td class="price-cell">$${parseFloat(evento.evt_preciobasegeneral || 0).toFixed(2)}</td>
          <td>
            <span class="status-badge ${estadoNormalizado}">${evento.evt_estado || 'Programado'}</span>
          </td>
          <td>
            <div class="actions-cell">
              <button class="btn-icon" onclick="window.verEvento(${evento.id_eventos})" title="Ver detalles">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              </button>
              <button class="btn-icon btn-delete" onclick="window.eliminarEvento(${evento.id_eventos}, '${evento.evt_nombre}')" title="Eliminar">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
              </button>
            </div>
          </td>
        </tr>
      `;
    });

    tableHTML += `
          </tbody>
        </table>
      </div>
    `;

    tableContent.innerHTML = tableHTML;
  } catch (error) {
    console.error('Error al cargar eventos:', error);
    tableContent.innerHTML = `
      <div class="empty-state">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        <h3>Error al cargar eventos</h3>
        <p>${error.message || 'Ocurrió un error inesperado'}</p>
      </div>
    `;
  }
}

// Función global para ver evento
window.verEvento = function(id) {
  alert(`Función de ver/editar evento ${id} - Por implementar`);
  // TODO: Implementar modal o página de edición
};

// Función global para eliminar evento
window.eliminarEvento = async function(id, nombre) {
  if (!confirm(`¿Estás seguro de eliminar el evento "${nombre}"?`)) {
    return;
  }

  try {
    const { error } = await supabase
      .from('eventos')
      .delete()
      .eq('id_eventos', id);

    if (error) {
      throw error;
    }

    alert('Evento eliminado exitosamente');
    cargarEventos(); // Recargar tabla
  } catch (error) {
    console.error('Error al eliminar evento:', error);
    alert('Error al eliminar evento: ' + error.message);
  }
};

// Botón refrescar
document.getElementById('btnRefrescar')?.addEventListener('click', () => {
  cargarEventos();
});

// Cargar eventos al iniciar
document.addEventListener('DOMContentLoaded', () => {
  cargarEventos();
});
