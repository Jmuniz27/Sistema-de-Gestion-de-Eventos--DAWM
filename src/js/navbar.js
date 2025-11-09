/**
 * Navbar Component Loader and Functionality
 * Carga navbar y footer sin fetch, importando los HTML como raw (compatible Vite)
 */
import navbarHTML from '../components/navbar.html?raw';
import footerHTML from '../components/footer.html?raw';
import stateManager from './state-manager.js';

// Load Navbar Component
function loadNavbar() {
  try {
    const navbarContainer = document.getElementById('navbar-container');
    if (!navbarContainer) return;

    // Insertar HTML del navbar
    navbarContainer.innerHTML = navbarHTML;

    // Inicializar funcionalidad del navbar
    initializeNavbar();

    // Cargar footer también
    loadFooter();
  } catch (error) {
    console.error('Error loading navbar:', error);
  }
}

// Initialize Navbar Functionality
function initializeNavbar() {
  const navbarToggle = document.getElementById('navbarToggle');
  const navbarMenu = document.getElementById('navbarMenu');

  if (!navbarToggle || !navbarMenu) return;

  // Toggle mobile menu
  navbarToggle.addEventListener('click', function() {
    navbarToggle.classList.toggle('active');
    navbarMenu.classList.toggle('active');

    // Update aria-expanded
    const isExpanded = navbarToggle.classList.contains('active');
    navbarToggle.setAttribute('aria-expanded', isExpanded);

    // Prevent body scroll when menu is open
    if (isExpanded) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  });

  // Close menu when clicking outside
  document.addEventListener('click', function(event) {
    const isClickInside = navbarToggle.contains(event.target) || navbarMenu.contains(event.target);
    if (!isClickInside && navbarMenu.classList.contains('active')) {
      closeNavbar();
    }
  });

  // Close menu on escape key
  document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape' && navbarMenu.classList.contains('active')) {
      closeNavbar();
    }
  });

  // Close menu when clicking on a link
  const navbarLinks = navbarMenu.querySelectorAll('.navbar-link');
  navbarLinks.forEach(link => {
    link.addEventListener('click', function() {
      if (window.innerWidth < 1024) {
        closeNavbar();
      }
    });
  });

  // Highlight active page
  highlightActivePage();

  // Update auth links based on user state
  updateAuthLinks();

  // Subscribe to user changes
  stateManager.subscribe('userChanged', () => {
    updateAuthLinks();
  });
}

// Update Authentication Links Based on User State
function updateAuthLinks() {
  const navbarActions = document.querySelector('.navbar-actions');
  if (!navbarActions) return;

  const isAuthenticated = stateManager.isAuthenticated();
  const currentUser = stateManager.getCurrentUser();

  if (isAuthenticated && currentUser) {
    // Try multiple possible property names for role
    const roleLabel = currentUser.rol || '';

    // Build the HTML including the user-info block so the role text is visible
    let userActions = `
      <div class="user-info">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" class="user-icon" aria-hidden="true">
          <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"/>
        </svg>
        <span class="user-role" id="userRoleText">${roleLabel || (currentUser.usuario_nombre || currentUser.name || 'Usuario')}</span>
      </div>
    `;

    // Add role-specific links
    if ((roleLabel || '').toString().toLowerCase() === 'administrador' || (roleLabel || '').toString().toLowerCase() === 'admin') {
      userActions += `
        <a href="/pages/admin-eventos.html" class="btn btn-outline btn-sm">Zona Admin</a>
      `;
    } else {
      userActions += `
        <a href="/pages/boletos/index.html" class="btn btn-outline btn-sm">Mis Entradas</a>
      `;
    }

    // Add logout button
    userActions += `
      <button class="btn btn-secondary btn-sm" onclick="logout()">Cerrar Sesión</button>
    `;

    navbarActions.innerHTML = userActions;

    // Mostrar/ocultar elementos admin-only según rol
    const adminOnlyElements = document.querySelectorAll('[data-admin-only]');
    const isAdmin = (roleLabel || '').toString().toLowerCase() === 'administrador' ||
                    (roleLabel || '').toString().toLowerCase() === 'admin';

    adminOnlyElements.forEach(el => {
      el.style.display = isAdmin ? '' : 'none';
    });
  } else {
    // Default: not authenticated
    navbarActions.innerHTML = `
      <a href="/pages/autenticacion/login.html" class="btn btn-outline btn-sm">Iniciar Sesión</a>
      <a href="/pages/autenticacion/crear_cuenta.html" class="btn btn-primary btn-sm">Registrarse</a>
    `;

    // Ocultar todos los elementos admin-only si no está autenticado
    const adminOnlyElements = document.querySelectorAll('[data-admin-only]');
    adminOnlyElements.forEach(el => {
      el.style.display = 'none';
    });
  }
}

// Global logout function
window.logout = function() {
  stateManager.logout();
  alert('Sesión cerrada exitosamente.');
  window.location.href = '/';
};

// Close Navbar
function closeNavbar() {
  const navbarToggle = document.getElementById('navbarToggle');
  const navbarMenu = document.getElementById('navbarMenu');

  if (navbarToggle && navbarMenu) {
    navbarToggle.classList.remove('active');
    navbarMenu.classList.remove('active');
    navbarToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
}

// Highlight Active Page
function highlightActivePage() {
  const currentPath = window.location.pathname;
  const navbarLinks = document.querySelectorAll('.navbar-link');

  navbarLinks.forEach(link => {
    const linkPath = new URL(link.href).pathname;
    if (currentPath === linkPath || (currentPath === '/' && linkPath === '/index.html')) {
      link.classList.add('active');
    }
  });
}

// Load Footer Component
function loadFooter() {
  try {
    const footerContainer = document.getElementById('footer-container');
    if (!footerContainer) return;
    footerContainer.innerHTML = footerHTML;
  } catch (error) {
    console.error('Error loading footer:', error);
  }
}

// Initialize on DOM Content Loaded
document.addEventListener('DOMContentLoaded', loadNavbar);

// Handle window resize
let resizeTimer;
window.addEventListener('resize', function() {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(function() {
    // Close mobile menu if resizing to desktop
    if (window.innerWidth >= 1024) {
      closeNavbar();
    }
  }, 250);
});
