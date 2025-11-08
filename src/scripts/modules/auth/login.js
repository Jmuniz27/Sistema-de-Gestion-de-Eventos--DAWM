/**
 * Módulo: Login de Usuario
 * Responsable: TUMBACO SANTANA GABRIEL ALEJANDRO
 *
 * Maneja el formulario de login, validación básica y llamada a auth.js
 */

import { login } from '../../auth.js'

// Función para validar email básico
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Función para validar formulario
function validateForm(formData) {
  const errors = []

  if (!isValidEmail(formData.email)) errors.push('El correo no es válido.')
  if (!formData.password.trim()) errors.push('La contraseña es obligatoria.')

  return errors
}

// Función principal para manejar el login
async function handleLogin(event) {
  event.preventDefault()

  const form = event.target
  const formData = new FormData(form)
  const data = Object.fromEntries(formData)

  // Validación básica
  const errors = validateForm(data)
  if (errors.length > 0) {
    alert('Errores en el formulario:\n' + errors.join('\n'))
    return
  }

  // Llamar a la función login de auth.js
  const { data: userData, error } = await login(data.email, data.password)

  if (error) {
    alert('Error al iniciar sesión: ' + error)
  } else {
    localStorage.setItem('user', JSON.stringify(userData))
    alert('Inicio de sesión exitoso.')
    window.location.href = '../index.html'
  }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.form')
  if (form) {
    form.addEventListener('submit', handleLogin)
  }
})
