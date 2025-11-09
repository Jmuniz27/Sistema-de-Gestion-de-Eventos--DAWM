/**
 * Módulo: Registro de Usuario
 * Responsable: TUMBACO SANTANA GABRIEL ALEJANDRO
 *
 * Maneja el formulario de registro, validación básica y llamada a auth.js
 */

import { register } from '../../auth.js'

// Función para validar email básico
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Función para validar formulario
function validateForm(formData) {
  const errors = []

  if (!formData.nombre.trim()) errors.push('El nombre es obligatorio.')
  if (!formData.apellido.trim()) errors.push('El apellido es obligatorio.')
  if (!isValidEmail(formData.email)) errors.push('El correo no es válido.')
  if (formData.password.length < 6) errors.push('La contraseña debe tener al menos 6 caracteres.')
  if (formData.password !== formData.password_2) errors.push('Las contraseñas no coinciden.')

  return errors
}

// Función principal para manejar el registro
async function handleRegister(event) {
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

  // Llamar a la función register de auth.js
  const { data: userData, error } = await register(data.email, data.password, {
    nombre: data.nombre,
    apellido: data.apellido
  })

  if (error) {
    alert('Error al registrar: Es posible que el usuario ya esté registrado')
  } else {
    alert('Cuenta creada exitosamente. Ahora puedes iniciar sesión.')
    // Redirigir a login
    window.location.href = '/pages/autenticacion/login.html'
  }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.form')
  if (form) {
    form.addEventListener('submit', handleRegister)
  }
})

/*
-- Schema de la base de datos (no borrar)

-- Tabla: ESTADOS_GENERALES
CREATE TABLE estados_generales (
    id_estado SERIAL PRIMARY KEY,
    estg_nombre VARCHAR(255) NOT NULL,
    estg_descripcion VARCHAR(255)
);

-- ======================================
-- TABLA: usuarios
-- ======================================
CREATE TABLE usuarios (
    id_usuario SERIAL PRIMARY KEY,
    usuario_nombre VARCHAR(255) NOT NULL,
    usuario_apellido VARCHAR(255) NOT NULL,
    usuario_email VARCHAR(255) UNIQUE NOT NULL,
    usuario_password VARCHAR(255) NOT NULL,
    usuario_token VARCHAR(255),
    usuario_token_exp TIMESTAMP,
    id_estado_fk INT NOT NULL,
    CONSTRAINT fk_usuarios_estadosgenerales
        FOREIGN KEY (id_estado_fk)
        REFERENCES estados_generales (id_estado)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

-- ======================================
-- TABLA: roles
-- ======================================
CREATE TABLE roles (
    id_rol SERIAL PRIMARY KEY,
    rol_nombre VARCHAR(255) UNIQUE NOT NULL,
    rol_descripcion VARCHAR(255)
);

-- ======================================
-- TABLA: permisos
-- ======================================
CREATE TABLE permisos (
    id_permiso SERIAL PRIMARY KEY,
    permiso_nombre VARCHAR(255) UNIQUE NOT NULL,
    permiso_descripcion VARCHAR(255)
);

-- ======================================
-- TABLA: usuarios_roles
-- ======================================
CREATE TABLE usuarios_roles (
    id_usuario_fk INT NOT NULL,
    id_rol_fk INT NOT NULL,
    PRIMARY KEY (id_usuario_fk, id_rol_fk),
    CONSTRAINT fk_usuariosroles_usuario
        FOREIGN KEY (id_usuario_fk)
        REFERENCES usuarios (id_usuario)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT fk_usuariosroles_rol
        FOREIGN KEY (id_rol_fk)
        REFERENCES roles (id_rol)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

-- ======================================
-- TABLA: roles_permisos
-- ======================================
CREATE TABLE roles_permisos (
    id_rol_fk INT NOT NULL,
    id_permiso_fk INT NOT NULL,
    PRIMARY KEY (id_rol_fk, id_permiso_fk),
    CONSTRAINT fk_rolespermisos_rol
        FOREIGN KEY (id_rol_fk)
        REFERENCES roles (id_rol)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT fk_rolespermisos_permiso
        FOREIGN KEY (id_permiso_fk)
        REFERENCES permisos (id_permiso)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);
*/

