/**
 * Módulo: Instrucciones de Email
 * Muestra el email y token de simulación
 */

document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search)
  const email = urlParams.get('email')
  const token = urlParams.get('token')

  if (email) {
    document.getElementById('userEmail').textContent = email
  }

  if (token) {
    document.getElementById('resetToken').textContent = token
    const resetLink = document.getElementById('resetLink')
    resetLink.href = `reset_password.html?token=${token}`
  }
})