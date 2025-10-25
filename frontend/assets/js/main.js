/**
 * ============================================
 * SISTEMA DE GESTIÓN DE EVENTOS - ESPOL
 * JavaScript Principal
 * ============================================
 *
 * Inicialización de la aplicación y event listeners globales.
 *
 * Materia: SOFG1006 - Desarrollo de Aplicaciones Web y Móviles
 * Institución: Escuela Superior Politécnica del Litoral (ESPOL)
 */

// ============================================
// INICIALIZACIÓN AL CARGAR EL DOM
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('Sistema de Gestión de Eventos - ESPOL');
    console.log('Aplicación iniciada correctamente');

    // Inicializar componentes
    initializeApp();

    // Configurar event listeners globales
    setupGlobalEventListeners();

    // Verificar conexión con la API
    checkAPIConnection();
});

// ============================================
// FUNCIÓN DE INICIALIZACIÓN
// ============================================
function initializeApp() {
    // Obtener año actual para el footer
    const yearElement = document.getElementById('currentYear');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    // Inicializar tooltips de Bootstrap
    initializeTooltips();

    // Inicializar popovers de Bootstrap
    initializePopovers();

    // Configurar tema (si hay preferencia guardada)
    loadThemePreference();
}

// ============================================
// EVENT LISTENERS GLOBALES
// ============================================
function setupGlobalEventListeners() {
    // Confirmar antes de salir si hay cambios sin guardar
    window.addEventListener('beforeunload', function(e) {
        if (window.hasUnsavedChanges) {
            e.preventDefault();
            e.returnValue = '';
        }
    });

    // Scroll to top button
    setupScrollToTopButton();

    // Cerrar dropdowns al hacer click fuera
    document.addEventListener('click', function(e) {
        const dropdowns = document.querySelectorAll('.dropdown-menu.show');
        dropdowns.forEach(dropdown => {
            if (!dropdown.parentElement.contains(e.target)) {
                dropdown.classList.remove('show');
            }
        });
    });
}

// ============================================
// INICIALIZACIÓN DE COMPONENTES BOOTSTRAP
// ============================================
function initializeTooltips() {
    const tooltipTriggerList = [].slice.call(
        document.querySelectorAll('[data-bs-toggle="tooltip"]')
    );

    tooltipTriggerList.map(function(tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
}

function initializePopovers() {
    const popoverTriggerList = [].slice.call(
        document.querySelectorAll('[data-bs-toggle="popover"]')
    );

    popoverTriggerList.map(function(popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl);
    });
}

// ============================================
// SCROLL TO TOP BUTTON
// ============================================
function setupScrollToTopButton() {
    // Crear botón si no existe
    if (!document.getElementById('scrollToTopBtn')) {
        const btn = document.createElement('button');
        btn.id = 'scrollToTopBtn';
        btn.className = 'btn btn-primary';
        btn.innerHTML = '<i class="bi bi-arrow-up"></i>';
        btn.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            display: none;
            z-index: 1000;
            border-radius: 50%;
            width: 50px;
            height: 50px;
        `;
        btn.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });
        document.body.appendChild(btn);
    }

    // Mostrar/ocultar según scroll
    window.addEventListener('scroll', function() {
        const btn = document.getElementById('scrollToTopBtn');
        if (window.pageYOffset > 300) {
            btn.style.display = 'block';
        } else {
            btn.style.display = 'none';
        }
    });
}

// ============================================
// PREFERENCIAS DE TEMA
// ============================================
function loadThemePreference() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.body.setAttribute('data-theme', savedTheme);
    }
}

function toggleTheme() {
    const currentTheme = document.body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
}

// ============================================
// VERIFICAR CONEXIÓN CON API
// ============================================
async function checkAPIConnection() {
    try {
        const response = await fetch('/api/v1/');
        if (response.ok) {
            console.log('Conexión con API establecida correctamente');
        }
    } catch (error) {
        console.warn('No se pudo conectar con la API:', error.message);
        // Mostrar alerta solo si estamos en una página que requiere la API
        if (window.location.pathname.includes('/pages/')) {
            showConnectionError();
        }
    }
}

function showConnectionError() {
    const alert = document.createElement('div');
    alert.className = 'alert alert-warning alert-dismissible fade show';
    alert.innerHTML = `
        <strong>Advertencia:</strong> No se pudo conectar con el servidor.
        Algunas funcionalidades pueden no estar disponibles.
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;

    const container = document.querySelector('.container');
    if (container) {
        container.insertBefore(alert, container.firstChild);
    }
}

// ============================================
// UTILIDADES GLOBALES
// ============================================

/**
 * Debounce function para optimizar eventos que se disparan frecuentemente
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Copiar texto al portapapeles
 */
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        utils.showAlert('Texto copiado al portapapeles', 'success');
    } catch (error) {
        utils.showAlert('Error al copiar al portapapeles', 'danger');
    }
}

/**
 * Descargar datos como archivo
 */
function downloadAsFile(data, filename, type = 'text/plain') {
    const blob = new Blob([data], { type });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
}

// ============================================
// EXPORTAR FUNCIONES GLOBALES
// ============================================
window.app = {
    toggleTheme,
    checkAPIConnection,
    debounce,
    copyToClipboard,
    downloadAsFile
};
