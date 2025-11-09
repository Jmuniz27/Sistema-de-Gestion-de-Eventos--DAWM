/**
 * Archivo: src/scripts/auth.js
 * Propósito: Funciones de autenticación manual (sin Supabase Auth)
 * NOTA: Este sistema es inseguro y solo para aprendizaje/prototipo
 */

import { supabase } from "./supabase-client.js"

// Función para hashear password 
export async function hashPassword(password) {
  // Para aprendizaje
  return btoa(password) // Base64 encode (inseguro)
}

// Función para verificar password
async function verifyPassword(inputPassword, storedHash) {
  return btoa(inputPassword) === storedHash 
}

/**
 * Registrar usuario (inserta en tabla usuarios y asigna rol cliente)
 */
export async function register(email, password, userData = {}) {
  const hashedPassword = await hashPassword(password)
  const { data: userDataInserted, error: userError } = await supabase
    .from('usuarios')
    .insert([{
      usuario_email: email,
      usuario_password: hashedPassword,
      usuario_nombre: userData.nombre || '',
      usuario_apellido: userData.apellido || '',
      id_estado_fk: 1
    }])
    .select('id_usuario') // Para obtener el id insertado
    .single()

  if (userError) return { error: userError }

  // Asignar rol cliente (id_rol_fk = 6)
  const { error: roleError } = await supabase
    .from('usuarios_roles')
    .insert([{
      id_usuario_fk: userDataInserted.id_usuario,
      id_rol_fk: 6
    }])

  if (roleError) {
    // Opcional: Si falla el rol, podrías eliminar el usuario, pero para simplicidad, solo reportar error
    return { error: roleError }
  }

  return { data: userDataInserted }
}

/**
 * Login manual (consulta tabla y verifica)
 */
export async function login(email, password) {
  const { data: users, error } = await supabase
    .from('usuarios')
    .select('*')
    .eq('usuario_email', email)
    .single()

  if (error || !users) return { error: 'Usuario no encontrado' }

  const isValid = await verifyPassword(password, users.usuario_password)
  if (!isValid) return { error: 'Contraseña incorrecta' }

  return { data: users }
}

/**
 * Logout
 */
export async function logout() {
  localStorage.removeItem('user')
  return { success: true }
}

/**
 * Obtener usuario actual (desde localStorage)
 */
export async function getCurrentUser() {
  const user = localStorage.getItem('user')
  return user ? { user: JSON.parse(user) } : { user: null }
}

/**
 * Verificar si hay sesión activa
 */
export async function checkAuth() {
  const user = await getCurrentUser()
  return { authenticated: !!user.user }
}

/**
 * Redirigir si no autenticado (helper)
 */
export function redirectIfNotAuthenticated(redirectTo = '/pages/autenticacion/login.html') {
  if (!checkAuth().authenticated) {
    window.location.href = redirectTo
  }
}

/**
 * Actualizar rol (opcional)
 */
export async function updateUserRole(userId, roleId) {
  const { data, error } = await supabase
    .from('usuarios')
    .update({ rol_id: roleId })
    .eq('id_usuario', userId)
  return { data, error }
}

/**
 * Función demo para obtener datos (ej. estados_generales)
 */
export async function getData() {
  const { data, error } = await supabase.from('estados_generales').select('*')
  return { data, error }
}

/**
 * Obtener todos los estados de la tabla `estados_generales`
 * Devuelve arreglo de filas con todos los campos de la tabla.
 */
export async function getEstadosGenerales() {
  // Intentamos ordenar por nombre de estado si existe la columna `estg_nombre`
  const { data, error } = await supabase
    .from('estados_generales')
    .select('*')
    .order('estg_nombre', { ascending: true })

  return { data, error }
}

/**
 * Obtener lista de roles disponibles
 */
export async function getRoles() {
  const { data, error } = await supabase
    .from('roles')
    .select('*')
    .order('rol_nombre', { ascending: true })

  return { data, error }
}

export async function getDataUsers() {
  const { data, error } = await supabase.from('usuarios').select('*')
  return { data, error }
}

/**
 * Función para obtener información cruzada de usuarios con roles, permisos y estados
 */
export async function getUsersWithRolesAndPermissions() {
  const { data, error } = await supabase
    .from('usuarios')
    .select(`
      *,
      usuarios_roles (
        roles (
          *,
          roles_permisos (
            permisos (*)
          )
        )
      ),
      estados_generales (*)
    `)
    .order('id_usuario', { ascending: true })
  return { data, error }
}

/**
 * Función para obtener el rol de un usuario específico
 */
export async function getUserRole(userId) {
  const { data: rolesData, error } = await supabase
    .from('usuarios_roles')
    .select('roles(rol_nombre)')
    .eq('id_usuario_fk', userId)
    .single()

  if (error) return { error }

  const rol = rolesData?.roles?.rol_nombre || 'Cliente'
  return { data: { rol } }
}

/**
 * Función para eliminar un usuario específico (elimina también relaciones por CASCADE)
 */
export async function deleteUser(userId) {
  const { data, error } = await supabase
    .from('usuarios')
    .delete()
    .eq('id_usuario', userId)
  return { data, error }
}

/**
 * Actualizar rol y estado de un usuario
 * @param {number} userId - id_usuario a actualizar
 * @param {number|null} roleId - id del rol (usuarios_roles.id_rol_fk). Si es null, no actualizar rol.
 * @param {number|null} estadoId - id del estado (usuarios.id_estado_fk). Si es null, no actualizar estado.
 * @returns {Object} { data: { role: {...}, estado: {...} }, error: { roleError, estadoError } }
 */
export async function updateUserRoleAndEstado(userId, roleId = null, estadoId = null) {
  const result = { data: {}, error: {} }

  // Primero gestionar el rol en la tabla usuarios_roles (si se proporcionó)
  // Under the single-role assumption: try to update existing row; if none updated, insert one
  if (roleId !== null) {
    try {
      const { data: roleUpdated, error: roleUpdateError } = await supabase
        .from('usuarios_roles')
        .update({ id_rol_fk: roleId })
        .eq('id_usuario_fk', userId)
        .select()

      if (roleUpdateError) {
        result.error.roleError = roleUpdateError
      } else if (roleUpdated && roleUpdated.length > 0) {
        // Updated existing role row
        result.data.role = roleUpdated[0]
      } else {
        // No existing row updated -> insert a new one
        const { data: roleInserted, error: roleInsertError } = await supabase
          .from('usuarios_roles')
          .insert([{ id_usuario_fk: userId, id_rol_fk: roleId }])
          .select()

        result.data.role = roleInserted ? roleInserted[0] : null
        if (roleInsertError) result.error.roleError = roleInsertError
      }
    } catch (err) {
      result.error.roleError = err
    }
  }

  // Luego actualizar el estado en la tabla usuarios (si se proporcionó)
  if (estadoId !== null) {
    try {
      const { data: estadoUpdated, error: estadoError } = await supabase
        .from('usuarios')
        .update({ id_estado_fk: estadoId })
        .eq('id_usuario', userId)

      result.data.estado = estadoUpdated
      if (estadoError) result.error.estadoError = estadoError
    } catch (err) {
      result.error.estadoError = err
    }
  }

  // Si no hubo errores, limpiar el objeto error
  if (!result.error.roleError && !result.error.estadoError) {
    result.error = null
  }

  return result
}

