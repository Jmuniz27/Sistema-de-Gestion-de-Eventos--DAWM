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
      id_estado_fk: 5 // Estado pendiente (deben verificar correo)
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

export async function getDataUsers() {
  const { data, error } = await supabase.from('roles').select('*')
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

