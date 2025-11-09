/**
 * Navbar Component Loader and Functionality
 * Carga navbar y footer sin fetch, importando los HTML como raw (compatible Vite)
 */
import navbarHTML from '../components/navbar.html?raw';
import footerHTML from '../components/footer.html?raw';
import notificationsNavbarHTML from '../components/navbar-notificaciones.html?raw';
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

// Load Notifications Module Navbar when available
function loadNotificacionesNavbar() {
  try {
    const moduleNavbarContainer = document.getElementById('navbar-notificaciones');
    if (!moduleNavbarContainer) return;

    moduleNavbarContainer.innerHTML = notificationsNavbarHTML;
  } catch (error) {
    console.error('Error loading notifications navbar:', error);
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
  const authButtonsGuest = document.getElementById('authButtonsGuest');
  const authButtonsUser = document.getElementById('authButtonsUser');
  const userRoleText = document.getElementById('userRoleText');
  const btnZonaAdmin = document.getElementById('btnZonaAdmin');
  const btnMisEntradas = document.getElementById('btnMisEntradas');
  const btnCerrarSesion = document.getElementById('btnCerrarSesion');

  if (!authButtonsGuest || !authButtonsUser) return;

  const isAuthenticated = stateManager.isAuthenticated();
  const currentUser = stateManager.getCurrentUser();

  if (isAuthenticated && currentUser) {
    const rol = currentUser.rol;

    // Mostrar sección de usuario autenticado
    authButtonsGuest.style.display = 'none';
    authButtonsUser.style.display = 'flex';

    // Actualizar texto del rol
    if (userRoleText) {
      userRoleText.textContent = rol === 'Administrador' ? 'Admin' : 'Usuario';
    }

    // Mostrar/ocultar elementos según rol
    const adminOnlyElements = document.querySelectorAll('[data-admin-only]');
    const userOnlyElements = document.querySelectorAll('[data-user-only]');

    if (rol === 'Administrador') {
      // Admin: mostrar todo
      adminOnlyElements.forEach(el => {
        el.style.display = '';
      });
      userOnlyElements.forEach(el => {
        el.style.display = 'none';
      });

      if (btnZonaAdmin) btnZonaAdmin.style.display = '';
      if (btnMisEntradas) btnMisEntradas.style.display = 'none';
    } else {
      // Usuario normal: ocultar admin-only
      adminOnlyElements.forEach(el => {
        el.style.display = 'none';
      });
      userOnlyElements.forEach(el => {
        el.style.display = '';
      });

      if (btnZonaAdmin) btnZonaAdmin.style.display = 'none';
      if (btnMisEntradas) btnMisEntradas.style.display = '';
    }

    // Agregar evento de cerrar sesión
    if (btnCerrarSesion) {
      btnCerrarSesion.onclick = logout;
    }
  } else {
    // Usuario no autenticado
    authButtonsGuest.style.display = 'flex';
    authButtonsUser.style.display = 'none';

    // Ocultar todos los elementos admin-only
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
  window.location.href = '../index.html';
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
    const isActive = currentPath === linkPath || (currentPath === '/' && linkPath === '/index.html');
    if (isActive) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    } else {
      link.classList.remove('active');
      link.removeAttribute('aria-current');
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
document.addEventListener('DOMContentLoaded', function() {
  loadNavbar();
  loadNotificacionesNavbar();
  highlightActivePage();
});

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
