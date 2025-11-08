/**
 * Módulo: Reset de Contraseña
 * Responsable: TUMBACO SANTANA GABRIEL ALEJANDRO
 *
 * Valida token y actualiza contraseña
 */

import { supabase } from '../../supabase-client.js'
import { hashPassword } from '../../auth.js'

// Función para validar token y actualizar password
async function resetPassword(token, newPassword) {
  if (!token || !newPassword || newPassword.length < 6) {
    return { error: 'Token y contraseña válidos requeridos' }
  }

  // Buscar usuario por token
  const { data: user, error } = await supabase
    .from('usuarios')
    .select('id_usuario')
    .eq('usuario_token', token)
    .single()

  if (error || !user) {
    return { error: 'Token inválido o expirado' }
  }

  // Hashear nueva password
  const hashedPassword = await hashPassword(newPassword)

  // Actualizar password y limpiar token
  const { error: updateError } = await supabase
    .from('usuarios')
    .update({ usuario_password: hashedPassword, usuario_token: null })
    .eq('id_usuario', user.id_usuario)

  if (updateError) {
    return { error: 'Error al actualizar contraseña' }
  }

  return { success: true }
}

// Manejo del formulario
document.addEventListener('DOMContentLoaded', () => {
  // Poblar token desde query param
  const urlParams = new URLSearchParams(window.location.search)
  const token = urlParams.get('token')
  console.log(token)
  if (token) {
    document.getElementById('token').value = token
  }

  const form = document.getElementById('resetPasswordForm')
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault()
      const tokenValue = e.target.token.value
      const password = e.target.password.value

      const { success, error } = await resetPassword(tokenValue, password)
      if (error) {
        alert(error)
      } else {
        alert('Contraseña actualizada exitosamente. Ahora puedes iniciar sesión.')
        window.location.href = 'login.html'
      }
    })
  }
})