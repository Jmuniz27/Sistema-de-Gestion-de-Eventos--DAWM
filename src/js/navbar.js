/**
 * Navbar Component Loader and Functionality
 * Loads navbar.html and handles mobile menu interactions
 */

// Load Navbar Component
async function loadNavbar() {
  try {
    const navbarContainer = document.getElementById('navbar-container');
    if (!navbarContainer) return;

    // Fetch navbar HTML
    const response = await fetch('/components/navbar.html');
    if (!response.ok) throw new Error('Failed to load navbar');

    const navbarHTML = await response.text();
    navbarContainer.innerHTML = navbarHTML;

    // Initialize navbar functionality
    initializeNavbar();

    // Load footer as well
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
}

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
async function loadFooter() {
  try {
    const footerContainer = document.getElementById('footer-container');
    if (!footerContainer) return;

    // Fetch footer HTML
    const response = await fetch('/components/footer.html');
    if (!response.ok) throw new Error('Failed to load footer');

    const footerHTML = await response.text();
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
