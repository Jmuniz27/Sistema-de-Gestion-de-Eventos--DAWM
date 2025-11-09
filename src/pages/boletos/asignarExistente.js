/**
 * Módulo: Asignar Boletos a Usuario Existente
 * Responsable: Gestión de compra de boletos para usuarios logueados
 * 
 * Funcionalidad:
 * - Carga automática de datos del usuario desde la BD (si existen)
 * - Permite completar/editar datos faltantes
 * - Muestra resumen de la compra (usuario, evento, selección)
 * - Envía datos a Supabase para crear el boleto y asignación
 */

import stateManager from '../../js/state-manager.js';
import { supabase } from '../../scripts/supabase-client.js';
import enviarABaseDeDatos from './asignarBoletos.js';

// ==================== ELEMENTOS DOM ====================
const detalleEventoDiv = document.getElementById('detalleEvento');
const detalleSeleccionDiv = document.getElementById('detalleSeleccion');
const btnConfirmar = document.getElementById('btnConfirmar');
const btnCancelar = document.getElementById('btnCancelar');
const errorMessage = document.getElementById('errorMessage');
const loadingMessage = document.getElementById('loadingMessage');
const warningBanner = document.getElementById('warningBanner');

// Campos del formulario
const inputNombre = document.getElementById('clienteNombre');
const inputCorreo = document.getElementById('clienteCorreo');
const inputCedula = document.getElementById('clienteCedula');
const inputTelefono = document.getElementById('clienteTelefono');

// ==================== DATOS GLOBALES ====================
const usuarioActual = stateManager.getCurrentUser();
const evento = stateManager.getSelectedEvent();
const seleccion = stateManager.getSessionData('selectedTickets');

// ==================== FUNCIONES AUXILIARES ====================

/**
 * Muestra un mensaje de error en pantalla
 */
function mostrarError(mensaje) {
    errorMessage.textContent = '⚠️ ' + mensaje;
    errorMessage.classList.add('show');
    errorMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

/**
 * Oculta el mensaje de error
 */
function ocultarError() {
    errorMessage.classList.remove('show');
}

/**
 * Formatea una fecha a formato legible
 */
function formatearFecha(dateStr) {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleString('es-EC', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
    });
}

/**
 * Valida que un campo solo contenga números
 */
function validarSoloNumeros(input) {
    input.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/\D/g, '');
    });
}

/**
 * Valida el formato de email
 */
function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

/**
 * Valida el formulario completo
 */
function validarFormulario() {
    const errores = [];

    const nombre = inputNombre.value.trim();
    const correo = inputCorreo.value.trim();
    const cedula = inputCedula.value.trim();
    const telefono = inputTelefono.value.trim();

    if (!nombre) errores.push('El nombre es requerido');
    if (!correo) {
        errores.push('El correo es requerido');
    } else if (!validarEmail(correo)) {
        errores.push('El correo no tiene un formato válido');
    }
    if (!cedula) {
        errores.push('La cédula es requerida');
    } else if (cedula.length !== 10) {
        errores.push('La cédula debe tener 10 dígitos');
    }
    if (!telefono) {
        errores.push('El teléfono es requerido');
    } else if (telefono.length !== 10) {
        errores.push('El teléfono debe tener 10 dígitos');
    }

    if (errores.length > 0) {
        warningBanner.style.display = 'block';
        mostrarError(errores.join('. '));
        return false;
    }

    warningBanner.style.display = 'none';
    ocultarError();
    return true;
}

// ==================== FUNCIONES DE CARGA DE DATOS ====================

/**
 * Carga información del cliente desde Supabase usando el email del usuario
 */
async function cargarDatosCliente() {
    if (!usuarioActual || (!usuarioActual.email && !usuarioActual.usuario_email)) {
        console.log('⚠️ No hay email de usuario disponible');
        return null;
    }

    const emailUsuario = usuarioActual.email || usuarioActual.usuario_email;

    try {
        console.log('🔍 Buscando cliente con email:', emailUsuario);

        const { data: cliente, error } = await supabase
            .from('clientes')
            .select('*')
            .eq('cli_email', emailUsuario)
            .single();

        if (error) {
            console.log('⚠️ Cliente no encontrado en BD, permitiendo ingreso manual');
            return null;
        }

        console.log('✅ Cliente encontrado:', cliente);
        return cliente;

    } catch (err) {
        console.error('❌ Error inesperado:', err);
        return null;
    }
}

/**
 * Precarga los datos del usuario en el formulario
 */
async function precargarDatosUsuario() {
    // Intentar cargar desde BD
    const cliente = await cargarDatosCliente();

    if (cliente) {
        // Si existe en BD, precargar datos
        inputNombre.value = `${cliente.cli_nombre} ${cliente.cli_apellido}`;
        inputCorreo.value = cliente.cli_email;
        inputCedula.value = cliente.cli_identificacion;
        inputTelefono.value = cliente.cli_celular || '';
        
        console.log('✅ Datos precargados desde BD');
    } else {
        // Si no existe, precargar lo que tengamos del usuario logueado
        if (usuarioActual) {
            const nombreUsuario = usuarioActual.nombre || 
                                `${usuarioActual.usuario_nombre || ''} ${usuarioActual.usuario_apellido || ''}`.trim();
            const emailUsuario = usuarioActual.email || usuarioActual.usuario_email;

            if (nombreUsuario) inputNombre.value = nombreUsuario;
            if (emailUsuario) inputCorreo.value = emailUsuario;
        }
        
        console.log('⚠️ Datos precargados parcialmente, usuario debe completar');
    }
}

// ==================== FUNCIONES DE RENDERIZADO ====================

/**
 * Renderiza los detalles del evento
 */
function renderEvento() {
    if (!evento) {
        detalleEventoDiv.innerHTML = '<p style="color: #f44336;">No hay evento seleccionado.</p>';
        return;
    }

    detalleEventoDiv.innerHTML = `
        <p><strong>Evento:</strong> ${evento.evt_nombre}</p>
        <p><strong>Fecha Inicio:</strong> ${formatearFecha(evento.evt_fechainicio)}</p>
        <p><strong>Fecha Fin:</strong> ${formatearFecha(evento.evt_fechafin)}</p>
        <p><strong>Dirección:</strong> ${evento.evt_direccion || 'N/A'}</p>
        <p><strong>Ciudad:</strong> ${evento.ciudades?.ciu_nombre || 'N/A'}</p>
    `;
}

/**
 * Renderiza la selección de boletos del usuario
 */
function renderSeleccion() {
    if (!seleccion) {
        detalleSeleccionDiv.innerHTML = '<p style="color: #f44336;">No hay selección de boletos.</p>';
        return;
    }

    detalleSeleccionDiv.innerHTML = `
        <p><strong>Sección:</strong> ${seleccion.seccion}</p>
        <p><strong>Tipo de Boleto:</strong> ${seleccion.tipo}</p>
        <p><strong>Cantidad:</strong> ${seleccion.cantidad}</p>
        <p><strong>Precio Total:</strong> <span class="total-precio">$${seleccion.precioTotal.toFixed(2)}</span></p>
    `;
}

// ==================== VALIDACIONES INICIALES ====================

/**
 * Valida que existan todos los datos necesarios antes de mostrar la página
 */
function validarDatosIniciales() {
    let errores = [];

    if (!usuarioActual) {
        errores.push('No hay usuario en sesión. Por favor inicia sesión.');
    }

    if (!evento) {
        errores.push('No hay evento seleccionado.');
    }

    if (!seleccion) {
        errores.push('No hay selección de boletos.');
    }

    if (errores.length > 0) {
        mostrarError(errores.join(' '));
        btnConfirmar.disabled = true;
    }

    return errores.length === 0;
}

// ==================== MANEJADORES DE EVENTOS ====================

/**
 * Maneja el evento de confirmar compra
 */
async function handleConfirmarCompra() {
    // Validar formulario
    if (!validarFormulario()) {
        return;
    }

    // Validación de datos generales
    if (!usuarioActual || !evento || !seleccion) {
        mostrarError('Faltan datos necesarios para completar la compra.');
        return;
    }

    // Deshabilitar botones y mostrar loading
    btnConfirmar.disabled = true;
    btnCancelar.disabled = true;
    loadingMessage.classList.add('show');
    ocultarError();

    try {
        // Obtener datos del formulario
        const datosFormulario = {
            nombre: inputNombre.value.trim(),
            correo: inputCorreo.value.trim(),
            cedula: inputCedula.value.trim(),
            telefono: inputTelefono.value.trim()
        };

        // Preparar datos para enviar (formato compatible con asignarBoletos.js)
        const datosFinales = {
            cliente: datosFormulario,
            evento: evento,
            seleccion: seleccion
        };

        console.log('📤 Enviando datos a la base de datos:', datosFinales);
        console.log('👤 Usuario actual:', usuarioActual);

        // Enviar a Supabase usando la función existente
        const resultado = await enviarABaseDeDatos(datosFinales, usuarioActual);

        // Ocultar loading
        loadingMessage.classList.remove('show');

        if (resultado.exito) {
            console.log('✅ Compra exitosa:', resultado);
            alert('✅ ' + resultado.mensaje);
            
            // Limpiar datos de sesión
            stateManager.setSessionData('selectedTickets', null);
            
            // Redirigir a landing
            window.location.href = '../landing/landing.html';
        } else {
            console.error('❌ Error en la compra:', resultado);
            btnConfirmar.disabled = false;
            btnCancelar.disabled = false;
            mostrarError(resultado.mensaje);
        }

    } catch (error) {
        console.error('❌ Error inesperado al procesar compra:', error);
        loadingMessage.classList.remove('show');
        btnConfirmar.disabled = false;
        btnCancelar.disabled = false;
        mostrarError('Error inesperado al procesar la compra: ' + error.message);
    }
}

/**
 * Maneja el evento de cancelar compra
 */
function handleCancelar() {
    if (confirm('¿Estás seguro de cancelar esta compra?')) {
        // Limpiar selección
        stateManager.setSessionData('selectedTickets', null);
        // Volver a la página anterior
        window.history.back();
    }
}

// ==================== INICIALIZACIÓN ====================

/**
 * Función principal de inicialización
 */
async function inicializar() {
    console.log('🚀 Inicializando asignarExistente.js');
    console.log('📊 Datos iniciales:', { usuarioActual, evento, seleccion });

    // Validar datos iniciales
    const datosValidos = validarDatosIniciales();
    
    if (!datosValidos) {
        console.warn('⚠️ Datos iniciales incompletos');
        return;
    }

    // Aplicar validaciones a los campos
    validarSoloNumeros(inputCedula);
    validarSoloNumeros(inputTelefono);

    // Precargar datos del usuario
    await precargarDatosUsuario();

    // Renderizar información
    renderEvento();
    renderSeleccion();

    // Asignar event listeners
    btnConfirmar.addEventListener('click', handleConfirmarCompra);
    btnCancelar.addEventListener('click', handleCancelar);

    // Validar en tiempo real
    [inputNombre, inputCorreo, inputCedula, inputTelefono].forEach(input => {
        input.addEventListener('blur', () => {
            if (input.value.trim()) {
                warningBanner.style.display = 'none';
            }
        });
    });

    console.log('✅ Página inicializada correctamente');
}

// Ejecutar inicialización cuando el DOM esté listo
inicializar();