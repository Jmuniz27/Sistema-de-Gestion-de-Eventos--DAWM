/**
 * Navbar secundario para el módulo de Notificaciones
 * Usa las clases existentes: navbar--secondary
 */

function renderNavbarNotificaciones() {
  const container = document.getElementById('navbar-notificaciones');
  if (!container) return;

  const currentPath = window.location.pathname;
  const isActive = (path) => currentPath.includes(path) ? 'active' : '';

  container.innerHTML = `
    <nav class="navbar navbar--secondary">
      <div class="navbar-container">
        <div class="navbar-brand navbar-brand--secondary">
          <div class="navbar-secondary-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
          </div>
          <div class="navbar-secondary-texts">
            <span class="navbar-secondary-label">Módulo</span>
            <span class="navbar-secondary-title">Notificaciones</span>
          </div>
        </div>
        <div class="navbar-nav navbar-nav--secondary">
          <a href="./notificaciones.html" class="navbar-link navbar-link--secondary ${isActive('notificaciones.html')}">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
            Historial
          </a>
          <a href="./enviar.html" class="navbar-link navbar-link--secondary ${isActive('enviar.html')}">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="22" y1="2" x2="11" y2="13"/>
              <polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
            Enviar
          </a>
          <a href="./plantillas.html" class="navbar-link navbar-link--secondary ${isActive('plantillas.html')}">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <line x1="9" y1="9" x2="15" y2="9"/>
              <line x1="9" y1="15" x2="15" y2="15"/>
            </svg>
            Plantillas
          </a>
        </div>
      </div>
    </nav>
  `;
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', renderNavbarNotificaciones);
} else {
  renderNavbarNotificaciones();
}

export { renderNavbarNotificaciones };
