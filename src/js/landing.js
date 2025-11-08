/**
 * Landing Page JavaScript
 * Carga eventos desde Supabase y maneja interacciones
 */

import { supabase } from '../scripts/supabase-client.js';
import stateManager from './state-manager.js';

/**
 * Cargar eventos desde Supabase
 */
async function loadEventsFromDatabase() {
  const eventsGrid = document.getElementById('eventsGrid');
  if (!eventsGrid) return;

  try {
    // Mostrar loading
    showLoadingState(eventsGrid);

    // Consultar eventos con sus relaciones
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
        evt_imagenportada,
        evt_estado,
        ciudades (
          ciu_nombre
        )
      `)
      .eq('evt_estado', 'Programado')
      .order('evt_fechainicio', { ascending: true });

    // Mostrar datos crudos en consola
    console.log('Datos crudos de eventos desde Supabase:', eventos);
    if (error) {
      console.error('Error fetching events:', error);
      showErrorState(eventsGrid, 'No se pudieron cargar los eventos');
      return;
    }

    // Si no hay eventos
    if (!eventos || eventos.length === 0) {
      showEmptyState(eventsGrid);
      return;
    }

    // Obtener categorías de cada evento
    const eventosConCategorias = await Promise.all(
      eventos.map(async (evento) => {
        // Consultar categoría del evento desde detalle_eventos
        const { data: detalles } = await supabase
          .from('detalle_eventos')
          .select(`
            categoriaevento (
              catevt_nombre
            )
          `)
          .eq('id_eventos_fk', evento.id_eventos)
          .limit(1)
          .single();

        return {
          ...evento,
          categoria: detalles?.categoriaevento?.catevt_nombre || 'Evento'
        };
      })
    );

    // Mostrar datos finales en consola
    console.log('Eventos con categoría:', eventosConCategorias);

    // Renderizar eventos
    renderEvents(eventsGrid, eventosConCategorias);

  } catch (error) {
    console.error('Error loading events:', error);
    showErrorState(eventsGrid, 'Ocurrió un error al cargar los eventos');
  }
}

/**
 * Renderizar eventos en el grid
 */
function renderEvents(container, eventos) {
  // Limpiar contenido
  container.innerHTML = '';

  eventos.forEach((evento, index) => {
    const eventCard = createEventCard(evento);
    eventCard.style.animationDelay = `${index * 0.1}s`;
    eventCard.classList.add('fade-in');
    container.appendChild(eventCard);
  });
}

/**
 * Crear tarjeta de evento
 */
function createEventCard(evento) {
  const card = document.createElement('div');
  card.className = 'event-card';
  card.setAttribute('data-event-id', evento.id_eventos);

  // Formatear fecha
  const fecha = new Date(evento.evt_fechainicio);
  const fechaFormateada = fecha.toLocaleDateString('es-EC', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Nombre de ciudad
  const ciudad = evento.ciudades?.ciu_nombre || 'Ecuador';

  // Calcular disponibilidad
  const disponibilidad = evento.evt_capacidaddisponible;
  const capacidadTotal = evento.evt_capacidadtotal;
  const porcentajeDisponible = (disponibilidad / capacidadTotal) * 100;

  // Badge de disponibilidad
  let badgeDisponibilidad = '';
  if (porcentajeDisponible < 20) {
    badgeDisponibilidad = '<span class="availability-badge low">Últimas entradas</span>';
  } else if (porcentajeDisponible < 50) {
    badgeDisponibilidad = '<span class="availability-badge medium">Disponibilidad limitada</span>';
  }

  const portada = evento.evt_imagenportada || `https://via.placeholder.com/300x200/2E4A8B/FFFFFF?text=${encodeURIComponent(evento.evt_nombre.substring(0, 20))}`;

  card.innerHTML = `
    <div class="event-card-image">
      <img
        src="${portada}"
        alt="${evento.evt_nombre}"
        loading="lazy"
      >
      <span class="event-badge">${evento.categoria}</span>
      ${badgeDisponibilidad}
    </div>
    <div class="event-card-content">
      <h3 class="event-card-title">${evento.evt_nombre}</h3>
      <p class="event-card-description">${evento.evt_descripcion || ''}</p>
      <p class="event-card-date">
        <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"/>
        </svg>
        ${fechaFormateada}
      </p>
      <p class="event-card-location">
        <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"/>
        </svg>
        ${ciudad}, Ecuador
      </p>
      <p class="event-card-capacity">
        <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
          <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
        </svg>
        ${disponibilidad.toLocaleString()} lugares disponibles
      </p>
      <div class="event-card-footer">
        <span class="event-card-price">Desde $${evento.evt_preciobasegeneral.toFixed(2)}</span>
        <button class="btn btn-primary btn-sm" onclick="window.handleEventClick(${evento.id_eventos})">
          Ver Detalles
        </button>
      </div>
    </div>
  `;

  return card;
}

/**
 * Manejar click en evento
 */
window.handleEventClick = async function(eventId) {
  try {
    // Obtener datos completos del evento
    const { data: evento, error } = await supabase
      .from('eventos')
      .select(`
        *,
        ciudades (*),
        detalle_eventos (
          categoriaevento (*),
          tipoingreso (*)
        )
      `)
      .eq('id_eventos', eventId)
      .single();

    if (error) {
      console.error('Error fetching event details:', error);
      alert('Error al cargar los detalles del evento');
      return;
    }

    // Guardar evento en el estado global
    stateManager.setSelectedEvent(evento);

    // Registrar en el historial de navegación
    stateManager.addToNavigationHistory('landing-to-event-detail');

    // Redirigir a la página de detalles
    // El otro miembro del grupo puede acceder a los datos con:
    // const evento = stateManager.getSelectedEvent();
    window.location.href = `/pages/eventos/mostrarEvento.html?id=${eventId}`;

  } catch (error) {
    console.error('Error handling event click:', error);
    alert('Ocurrió un error al procesar la solicitud');
  }
};

/**
 * Mostrar estado de carga
 */
function showLoadingState(container) {
  container.innerHTML = `
    <div class="loading">
      <div class="loading-spinner"></div>
      <p>Cargando eventos...</p>
    </div>
  `;
}

/**
 * Mostrar estado vacío
 */
function showEmptyState(container) {
  container.innerHTML = `
    <div class="empty-state">
      <div class="empty-state-icon">📅</div>
      <h3 class="empty-state-title">No hay eventos disponibles</h3>
      <p class="empty-state-description">
        Vuelve pronto para ver los próximos eventos
      </p>
    </div>
  `;
}

/**
 * Mostrar estado de error
 */
function showErrorState(container, message) {
  container.innerHTML = `
    <div class="empty-state error-state">
      <div class="empty-state-icon">⚠️</div>
      <h3 class="empty-state-title">Error al cargar eventos</h3>
      <p class="empty-state-description">${message}</p>
      <button class="btn btn-primary" onclick="location.reload()">
        Reintentar
      </button>
    </div>
  `;
}

/**
 * Smooth Scroll para anchor links
 */
function initializeSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));

      if (target) {
        const offsetTop = target.offsetTop - 80; // Account for fixed navbar
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });
}

/**
 * Agregar animaciones al hacer scroll
 */
function initializeScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observar secciones
  document.querySelectorAll('.features-section, .events-section').forEach(section => {
    observer.observe(section);
  });
}

/**
 * Verificar autenticación y actualizar UI
 */
function checkAuthentication() {
  const user = stateManager.getCurrentUser();

  if (user) {
    console.log('Usuario autenticado:', user.Usuario_Nombre);
    // Podrías actualizar el navbar para mostrar el nombre del usuario
    // o agregar un mensaje de bienvenida
  }
}

/**
 * Inicializar landing page
 */
function initializeLandingPage() {
  // Verificar autenticación
  checkAuthentication();

  // Cargar eventos desde Supabase
  loadEventsFromDatabase();

  // Inicializar smooth scrolling
  initializeSmoothScroll();

  // Inicializar animaciones de scroll
  initializeScrollAnimations();

  // Registrar página en historial
  stateManager.addToNavigationHistory('landing');

  // Log del estado global (para debugging)
  console.log('Estado global:', stateManager.exportState());
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeLandingPage);
} else {
  initializeLandingPage();
}

// Exportar funciones para uso externo
export {
  loadEventsFromDatabase,
  showLoadingState,
  showEmptyState,
  showErrorState
};
