/**
 * Módulo: Recuperación de Contraseña
 * Responsable: TUMBACO SANTANA GABRIEL ALEJANDRO
 *
 * Simula el envío de email para recuperación de contraseña
 */

import { supabase } from '../../supabase-client.js'

// Función para generar token temporal (simula reset token)
function generateResetToken() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

// Función para validar email básico
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Función para simular envío de email
export async function sendPasswordReset(email) {
  // Validación básica
  if (!email || !isValidEmail(email)) {
    return { error: 'Ingresa un email válido' }
  }

  // Verificar si el usuario existe en la tabla usuarios
  const { data: user, error } = await supabase
    .from('usuarios')
    .select('id_usuario')
    .eq('usuario_email', email.toLowerCase())
    .single()

  if (error || !user) {
    return { error: 'Usuario no encontrado' }
  }

  // Generar token y guardar en BD
  const resetToken = generateResetToken()
  const { error: updateError } = await supabase
    .from('usuarios')
    .update({ usuario_token: resetToken })
    .eq('id_usuario', user.id_usuario)

  if (updateError) {
    return { error: 'Error al generar token' }
  }

  return { success: true, token: resetToken }
}

// Manejo del formulario
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('resetForm')
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault()
      const email = e.target.email.value

      const { success, error, token } = await sendPasswordReset(email)
      if (error) {
        alert(error)
      } else {
        // Redirigir a email_instructions.html con el token (simulación)
        window.location.href = `email_instructions.html?token=${token}&email=${encodeURIComponent(email)}`
      }
    })
  }
})