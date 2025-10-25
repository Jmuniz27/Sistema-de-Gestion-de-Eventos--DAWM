/**
 * ============================================
 * SISTEMA DE GESTIÓN DE EVENTOS - ESPOL
 * Utilidades JavaScript
 * ============================================
 *
 * Funciones de utilidad para el frontend.
 *
 * Materia: SOFG1006 - Desarrollo de Aplicaciones Web y Móviles
 * Institución: Escuela Superior Politécnica del Litoral (ESPOL)
 */

// ============================================
// FORMATEO DE DATOS
// ============================================

/**
 * Formatear fecha a formato local
 */
function formatDate(date, options = {}) {
    if (!date) return 'N/A';

    const defaultOptions = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        ...options
    };

    return new Date(date).toLocaleDateString('es-EC', defaultOptions);
}

/**
 * Formatear fecha y hora
 */
function formatDateTime(date) {
    if (!date) return 'N/A';

    return new Date(date).toLocaleString('es-EC', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
}

/**
 * Formatear precio
 */
function formatPrice(price) {
    if (price === null || price === undefined) return 'N/A';

    return new Intl.NumberFormat('es-EC', {
        style: 'currency',
        currency: 'USD'
    }).format(price);
}

/**
 * Formatear número
 */
function formatNumber(number) {
    if (number === null || number === undefined) return 'N/A';

    return new Intl.NumberFormat('es-EC').format(number);
}

// ============================================
// VALIDACIONES
// ============================================

/**
 * Validar email
 */
function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

/**
 * Validar celular ecuatoriano
 */
function validateCelular(celular) {
    const regex = /^09\d{8}$/;
    return regex.test(celular);
}

/**
 * Validar cédula ecuatoriana
 */
function validateCedula(cedula) {
    if (!cedula || cedula.length !== 10) return false;

    const provincia = parseInt(cedula.substring(0, 2));
    if (provincia < 1 || provincia > 24) return false;

    const digits = cedula.split('').map(Number);
    const coefficients = [2, 1, 2, 1, 2, 1, 2, 1, 2];
    let sum = 0;

    for (let i = 0; i < 9; i++) {
        let product = digits[i] * coefficients[i];
        if (product >= 10) product -= 9;
        sum += product;
    }

    const checkDigit = sum % 10 === 0 ? 0 : 10 - (sum % 10);
    return checkDigit === digits[9];
}

// ============================================
// UI HELPERS
// ============================================

/**
 * Mostrar loading overlay
 */
function showLoading() {
    const overlay = document.createElement('div');
    overlay.className = 'loading-overlay';
    overlay.id = 'loadingOverlay';
    overlay.innerHTML = '<div class="loading-spinner"></div>';
    document.body.appendChild(overlay);
}

/**
 * Ocultar loading overlay
 */
function hideLoading() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) overlay.remove();
}

/**
 * Mostrar mensaje de alerta
 */
function showAlert(message, type = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.role = 'alert';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;

    const container = document.querySelector('.container') || document.body;
    container.insertBefore(alertDiv, container.firstChild);

    // Auto-dismiss después de 5 segundos
    setTimeout(() => {
        alertDiv.classList.remove('show');
        setTimeout(() => alertDiv.remove(), 150);
    }, 5000);
}

/**
 * Confirmar acción
 */
function confirmAction(message) {
    return confirm(message);
}

/**
 * Scroll to top
 */
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ============================================
// MANIPULACIÓN DE FORMULARIOS
// ============================================

/**
 * Obtener datos de formulario como objeto
 */
function getFormData(formId) {
    const form = document.getElementById(formId);
    if (!form) return null;

    const formData = new FormData(form);
    const data = {};

    for (let [key, value] of formData.entries()) {
        data[key] = value;
    }

    return data;
}

/**
 * Limpiar formulario
 */
function clearForm(formId) {
    const form = document.getElementById(formId);
    if (form) form.reset();
}

/**
 * Llenar formulario con datos
 */
function fillForm(formId, data) {
    const form = document.getElementById(formId);
    if (!form) return;

    Object.keys(data).forEach(key => {
        const input = form.elements[key];
        if (input) {
            if (input.type === 'checkbox') {
                input.checked = data[key];
            } else if (input.type === 'date') {
                input.value = data[key] ? data[key].split('T')[0] : '';
            } else {
                input.value = data[key] || '';
            }
        }
    });
}

// ============================================
// MANIPULACIÓN DE TABLAS
// ============================================

/**
 * Crear fila de tabla
 */
function createTableRow(data, columns, actions) {
    const tr = document.createElement('tr');

    // Agregar celdas de datos
    columns.forEach(col => {
        const td = document.createElement('td');
        td.textContent = data[col.key] || 'N/A';
        if (col.formatter) {
            td.textContent = col.formatter(data[col.key]);
        }
        tr.appendChild(td);
    });

    // Agregar celda de acciones
    if (actions && actions.length > 0) {
        const td = document.createElement('td');
        td.className = 'action-buttons';

        actions.forEach(action => {
            const btn = document.createElement('button');
            btn.className = `btn btn-sm btn-${action.type || 'primary'}`;
            btn.innerHTML = action.icon ? `<i class="${action.icon}"></i>` : action.label;
            btn.onclick = () => action.onClick(data);
            td.appendChild(btn);
        });

        tr.appendChild(td);
    }

    return tr;
}

/**
 * Limpiar tabla
 */
function clearTable(tableBodyId) {
    const tbody = document.getElementById(tableBodyId);
    if (tbody) tbody.innerHTML = '';
}

// ============================================
// PAGINACIÓN
// ============================================

/**
 * Crear paginación
 */
function createPagination(containerId, currentPage, totalPages, onPageChange) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = '';

    const nav = document.createElement('nav');
    const ul = document.createElement('ul');
    ul.className = 'pagination justify-content-center';

    // Botón anterior
    const prevLi = document.createElement('li');
    prevLi.className = `page-item ${currentPage === 1 ? 'disabled' : ''}`;
    prevLi.innerHTML = `<a class="page-link" href="#">Anterior</a>`;
    if (currentPage > 1) {
        prevLi.querySelector('a').onclick = (e) => {
            e.preventDefault();
            onPageChange(currentPage - 1);
        };
    }
    ul.appendChild(prevLi);

    // Números de página
    for (let i = 1; i <= totalPages; i++) {
        // Mostrar solo algunas páginas alrededor de la actual
        if (i === 1 || i === totalPages || (i >= currentPage - 2 && i <= currentPage + 2)) {
            const li = document.createElement('li');
            li.className = `page-item ${i === currentPage ? 'active' : ''}`;
            li.innerHTML = `<a class="page-link" href="#">${i}</a>`;
            li.querySelector('a').onclick = (e) => {
                e.preventDefault();
                onPageChange(i);
            };
            ul.appendChild(li);
        } else if (i === currentPage - 3 || i === currentPage + 3) {
            // Mostrar puntos suspensivos
            const li = document.createElement('li');
            li.className = 'page-item disabled';
            li.innerHTML = '<span class="page-link">...</span>';
            ul.appendChild(li);
        }
    }

    // Botón siguiente
    const nextLi = document.createElement('li');
    nextLi.className = `page-item ${currentPage === totalPages ? 'disabled' : ''}`;
    nextLi.innerHTML = `<a class="page-link" href="#">Siguiente</a>`;
    if (currentPage < totalPages) {
        nextLi.querySelector('a').onclick = (e) => {
            e.preventDefault();
            onPageChange(currentPage + 1);
        };
    }
    ul.appendChild(nextLi);

    nav.appendChild(ul);
    container.appendChild(nav);
}

// ============================================
// UTILIDADES DE STRING
// ============================================

/**
 * Capitalizar primera letra
 */
function capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Truncar texto
 */
function truncate(str, length = 50) {
    if (!str) return '';
    return str.length > length ? str.substring(0, length) + '...' : str;
}

// ============================================
// EXPORTAR A WINDOW (para uso global)
// ============================================
window.utils = {
    formatDate,
    formatDateTime,
    formatPrice,
    formatNumber,
    validateEmail,
    validateCelular,
    validateCedula,
    showLoading,
    hideLoading,
    showAlert,
    confirmAction,
    scrollToTop,
    getFormData,
    clearForm,
    fillForm,
    createTableRow,
    clearTable,
    createPagination,
    capitalize,
    truncate
};
