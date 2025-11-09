/**
 * Módulo: Gestión de Usuarios
 * Responsable: TUMBACO SANTANA GABRIEL ALEJANDRO
 *
 * Maneja la carga y visualización básica de usuarios del sistema
 */

import { getUsersWithRolesAndPermissions } from '../auth.js'

// Estado de la aplicación
let allUsers = []

// Elementos del DOM
let usuariosTableBody
let btnCrearUsuario

/**
 * Inicializar la página cuando el DOM esté listo
 */
document.addEventListener('DOMContentLoaded', () => {
  // Obtener referencias a elementos del DOM
  usuariosTableBody = document.getElementById('usuariosTableBody')
  btnCrearUsuario = document.getElementById('btnCrearUsuario')

  // Inicializar eventos
  initializeEvents()

  // Cargar usuarios
  loadUsers()
})

/**
 * Inicializar eventos de la página
 */
function initializeEvents() {
  // Evento para el botón de crear usuario
  if (btnCrearUsuario) {
    btnCrearUsuario.addEventListener('click', () => {
      window.location.href = '/pages/autenticacion/crear_cuenta.html'
    })
  }
}

/**
 * Cargar usuarios desde la base de datos
 */
async function loadUsers() {
  try {
    showLoading()

    const { data: users, error } = await getUsersWithRolesAndPermissions()

    if (error) {
      console.error('Error al cargar usuarios:', error)
      showError('Error al cargar los usuarios')
      return
    }

    allUsers = users || []
    renderUsers()

  } catch (error) {
    console.error('Error inesperado:', error)
    showError('Error inesperado al cargar usuarios')
  }
}

/**
 * Renderizar usuarios en la tabla
 */
function renderUsers() {
  if (!usuariosTableBody) return

  if (allUsers.length === 0) {
    usuariosTableBody.innerHTML = `
      <tr>
        <td colspan="7" class="text-center">
          <p>No se encontraron usuarios</p>
        </td>
      </tr>
    `
    return
  }

  usuariosTableBody.innerHTML = allUsers.map(user => `
    <tr>
      <td>${user.id_usuario}</td>
      <td>${user.usuario_nombre}</td>
      <td>${user.usuario_apellido}</td>
      <td>${user.usuario_email}</td>
      <td>
        <span class="badge badge-${getRoleBadgeClass(user.usuarios_roles?.[0]?.roles?.rol_nombre)}">
          ${user.usuarios_roles?.[0]?.roles?.rol_nombre || 'Sin rol'}
        </span>
      </td>
      <td>
        <span class="badge badge-${getStatusBadgeClass(user.estados_generales?.estg_nombre)}">
          ${user.estados_generales?.estg_nombre || 'Desconocido'}
        </span>
      </td>
      <td>
        <div class="action-buttons">
          <button class="btn btn-sm btn-outline" onclick="editUser(${user.id_usuario})" title="Editar">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z" />
              <path d="M20.71 7.04a1.003 1.003 0 0 0 0-1.42l-2.34-2.34a1.003 1.003 0 0 0-1.42 0l-1.83 1.83 3.75 3.75 1.84-1.82z" />
            </svg>
          </button>
          <button class="btn btn-sm btn-danger" onclick="deleteUser(${user.id_usuario})" title="Eliminar">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
              <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
            </svg>
          </button>
        </div>
      </td>
    </tr>
  `).join('')
}

/**
 * Obtener clase CSS para el badge del rol
 */
function getRoleBadgeClass(role) {
  switch (role?.toLowerCase()) {
    case 'admin':
    case 'administrador':
      return 'danger'
    case 'cliente':
      return 'primary'
    default:
      return 'secondary'
  }
}

/**
 * Obtener clase CSS para el badge del estado
 */
function getStatusBadgeClass(status) {
  switch (status?.toLowerCase()) {
    case 'activo':
      return 'success'
    case 'pendiente':
      return 'warning'
    case 'inactivo':
    case 'bloqueado':
      return 'danger'
    default:
      return 'secondary'
  }
}

/**
 * Mostrar estado de carga
 */
function showLoading() {
  if (usuariosTableBody) {
    usuariosTableBody.innerHTML = `
      <tr>
        <td colspan="7" class="text-center">
          <div class="loading-spinner">
            <div class="spinner"></div>
            <p>Cargando usuarios...</p>
          </div>
        </td>
      </tr>
    `
  }
}

/**
 * Mostrar error
 */
function showError(message) {
  if (usuariosTableBody) {
    usuariosTableBody.innerHTML = `
      <tr>
        <td colspan="7" class="text-center">
          <div class="error-message">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            <p>${message}</p>
          </div>
        </td>
      </tr>
    `
  }
}

// Funciones globales para los botones de acción (se implementarán después)
window.viewUser = (userId) => {
  console.log('Ver usuario:', userId)
  // TODO: Implementar vista de detalle
}

window.editUser = (userId) => {
  console.log('Editar usuario:', userId)
  // TODO: Implementar edición
}

window.deleteUser = (userId) => {
  console.log('Eliminar usuario:', userId)
  // TODO: Implementar eliminación con confirmación
}
