/**
 * ============================================
 * SISTEMA DE GESTIÓN DE EVENTOS - ESPOL
 * Utilidades de Validación
 * ============================================
 *
 * Este archivo proporciona funciones de validación personalizadas
 * que pueden usarse tanto en el backend como referencia para frontend.
 *
 * Materia: SOFG1006 - Desarrollo de Aplicaciones Web y Móviles
 * Institución: Escuela Superior Politécnica del Litoral (ESPOL)
 */

// ============================================
// VALIDACIONES DE IDENTIFICACIÓN ECUATORIANA
// ============================================

/**
 * Validar cédula ecuatoriana
 * Algoritmo oficial de validación del Registro Civil
 *
 * @param {string} cedula - Cédula a validar (10 dígitos)
 * @returns {boolean} true si es válida
 */
const validateCedula = (cedula) => {
  // Verificar que sea string
  if (typeof cedula !== 'string') {
    cedula = String(cedula);
  }

  // Eliminar espacios
  cedula = cedula.trim();

  // Verificar longitud
  if (cedula.length !== 10) {
    return false;
  }

  // Verificar que solo contenga números
  if (!/^\d{10}$/.test(cedula)) {
    return false;
  }

  // Obtener código de provincia (primeros 2 dígitos)
  const provincia = parseInt(cedula.substring(0, 2));

  // Verificar código de provincia (01-24)
  if (provincia < 1 || provincia > 24) {
    return false;
  }

  // Algoritmo de validación
  const digits = cedula.split('').map(Number);
  const coefficients = [2, 1, 2, 1, 2, 1, 2, 1, 2];
  let sum = 0;

  for (let i = 0; i < 9; i++) {
    let product = digits[i] * coefficients[i];
    if (product >= 10) {
      product -= 9;
    }
    sum += product;
  }

  const checkDigit = sum % 10 === 0 ? 0 : 10 - (sum % 10);

  return checkDigit === digits[9];
};

/**
 * Validar RUC ecuatoriano
 *
 * @param {string} ruc - RUC a validar (13 dígitos)
 * @returns {boolean} true si es válido
 */
const validateRUC = (ruc) => {
  // Verificar que sea string
  if (typeof ruc !== 'string') {
    ruc = String(ruc);
  }

  // Eliminar espacios
  ruc = ruc.trim();

  // Verificar longitud
  if (ruc.length !== 13) {
    return false;
  }

  // Verificar que solo contenga números
  if (!/^\d{13}$/.test(ruc)) {
    return false;
  }

  // Verificar tipo de RUC según tercer dígito
  const tercerDigito = parseInt(ruc[2]);

  // Persona natural (tercer dígito < 6)
  if (tercerDigito < 6) {
    // Los primeros 10 dígitos deben ser una cédula válida
    const cedula = ruc.substring(0, 10);
    if (!validateCedula(cedula)) {
      return false;
    }

    // Los últimos 3 dígitos deben ser 001
    return ruc.substring(10) === '001';
  }

  // Sociedad pública (tercer dígito = 6)
  if (tercerDigito === 6) {
    // Validación específica para entidades públicas
    const codigoEstablecimiento = ruc.substring(10, 13);
    return codigoEstablecimiento !== '000';
  }

  // Sociedad privada (tercer dígito = 9)
  if (tercerDigito === 9) {
    // Algoritmo de validación para sociedades privadas
    const coefficients = [4, 3, 2, 7, 6, 5, 4, 3, 2];
    const digits = ruc.substring(0, 9).split('').map(Number);
    let sum = 0;

    for (let i = 0; i < 9; i++) {
      sum += digits[i] * coefficients[i];
    }

    const checkDigit = sum % 11 === 0 ? 0 : 11 - (sum % 11);
    return checkDigit === parseInt(ruc[9]);
  }

  return false;
};

// ============================================
// VALIDACIONES DE CONTACTO
// ============================================

/**
 * Validar email
 *
 * @param {string} email - Email a validar
 * @returns {boolean} true si es válido
 */
const validateEmail = (email) => {
  if (typeof email !== 'string') {
    return false;
  }

  // Expresión regular para validar email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

/**
 * Validar celular ecuatoriano
 * Formato: 09XXXXXXXX (10 dígitos)
 *
 * @param {string} celular - Celular a validar
 * @returns {boolean} true si es válido
 */
const validateCelular = (celular) => {
  if (typeof celular !== 'string') {
    celular = String(celular);
  }

  // Eliminar espacios y guiones
  celular = celular.trim().replace(/[-\s]/g, '');

  // Verificar formato: debe comenzar con 09 y tener 10 dígitos
  return /^09\d{8}$/.test(celular);
};

/**
 * Validar teléfono convencional ecuatoriano
 * Formato: 02XXXXXXX, 03XXXXXXX, 04XXXXXXX, 05XXXXXXX, 06XXXXXXX, 07XXXXXXX
 *
 * @param {string} telefono - Teléfono a validar
 * @returns {boolean} true si es válido
 */
const validateTelefono = (telefono) => {
  if (typeof telefono !== 'string') {
    telefono = String(telefono);
  }

  // Eliminar espacios y guiones
  telefono = telefono.trim().replace(/[-\s]/g, '');

  // Verificar formato: debe comenzar con 02-07 y tener 9 dígitos
  return /^0[2-7]\d{7}$/.test(telefono);
};

// ============================================
// VALIDACIONES DE FORMATO
// ============================================

/**
 * Validar que un string contenga solo letras y espacios
 *
 * @param {string} str - String a validar
 * @returns {boolean} true si es válido
 */
const validateOnlyLetters = (str) => {
  if (typeof str !== 'string') {
    return false;
  }

  // Permitir letras (incluyendo acentuadas), espacios, ñ y Ñ
  return /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(str.trim());
};

/**
 * Validar que un string contenga solo números
 *
 * @param {string} str - String a validar
 * @returns {boolean} true si es válido
 */
const validateOnlyNumbers = (str) => {
  if (typeof str !== 'string') {
    str = String(str);
  }

  return /^\d+$/.test(str.trim());
};

/**
 * Validar URL
 *
 * @param {string} url - URL a validar
 * @returns {boolean} true si es válida
 */
const validateURL = (url) => {
  if (typeof url !== 'string') {
    return false;
  }

  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// ============================================
// VALIDACIONES DE RANGO
// ============================================

/**
 * Validar que un número esté dentro de un rango
 *
 * @param {number} value - Valor a validar
 * @param {number} min - Valor mínimo
 * @param {number} max - Valor máximo
 * @returns {boolean} true si está en el rango
 */
const validateRange = (value, min, max) => {
  const num = Number(value);

  if (isNaN(num)) {
    return false;
  }

  return num >= min && num <= max;
};

/**
 * Validar que un string tenga una longitud específica
 *
 * @param {string} str - String a validar
 * @param {number} min - Longitud mínima
 * @param {number} max - Longitud máxima
 * @returns {boolean} true si está en el rango
 */
const validateLength = (str, min, max) => {
  if (typeof str !== 'string') {
    return false;
  }

  const length = str.trim().length;
  return length >= min && length <= max;
};

// ============================================
// VALIDACIONES DE FECHA
// ============================================

/**
 * Validar que una fecha sea válida
 *
 * @param {string|Date} date - Fecha a validar
 * @returns {boolean} true si es válida
 */
const validateDate = (date) => {
  const dateObj = new Date(date);
  return dateObj instanceof Date && !isNaN(dateObj);
};

/**
 * Validar que una fecha sea futura
 *
 * @param {string|Date} date - Fecha a validar
 * @returns {boolean} true si es futura
 */
const validateFutureDate = (date) => {
  if (!validateDate(date)) {
    return false;
  }

  const dateObj = new Date(date);
  const now = new Date();

  return dateObj > now;
};

/**
 * Validar que una fecha sea pasada
 *
 * @param {string|Date} date - Fecha a validar
 * @returns {boolean} true si es pasada
 */
const validatePastDate = (date) => {
  if (!validateDate(date)) {
    return false;
  }

  const dateObj = new Date(date);
  const now = new Date();

  return dateObj < now;
};

/**
 * Validar que una fecha esté dentro de un rango
 *
 * @param {string|Date} date - Fecha a validar
 * @param {string|Date} minDate - Fecha mínima
 * @param {string|Date} maxDate - Fecha máxima
 * @returns {boolean} true si está en el rango
 */
const validateDateRange = (date, minDate, maxDate) => {
  if (!validateDate(date) || !validateDate(minDate) || !validateDate(maxDate)) {
    return false;
  }

  const dateObj = new Date(date);
  const minDateObj = new Date(minDate);
  const maxDateObj = new Date(maxDate);

  return dateObj >= minDateObj && dateObj <= maxDateObj;
};

// ============================================
// VALIDACIONES DE NEGOCIO
// ============================================

/**
 * Validar que un precio sea válido (número positivo con máximo 2 decimales)
 *
 * @param {number} price - Precio a validar
 * @returns {boolean} true si es válido
 */
const validatePrice = (price) => {
  const num = Number(price);

  if (isNaN(num) || num < 0) {
    return false;
  }

  // Verificar que tenga máximo 2 decimales
  const decimals = (price.toString().split('.')[1] || '').length;
  return decimals <= 2;
};

/**
 * Validar que una cantidad sea válida (entero positivo)
 *
 * @param {number} quantity - Cantidad a validar
 * @returns {boolean} true si es válida
 */
const validateQuantity = (quantity) => {
  const num = Number(quantity);

  if (isNaN(num) || num < 0) {
    return false;
  }

  // Verificar que sea entero
  return Number.isInteger(num);
};

// ============================================
// FUNCIÓN HELPER PARA SANITIZAR STRINGS
// ============================================

/**
 * Sanitizar un string eliminando caracteres peligrosos
 *
 * @param {string} str - String a sanitizar
 * @returns {string} String sanitizado
 */
const sanitizeString = (str) => {
  if (typeof str !== 'string') {
    return '';
  }

  return str
    .trim()
    .replace(/[<>]/g, '') // Eliminar < y >
    .replace(/javascript:/gi, '') // Eliminar javascript:
    .replace(/on\w+=/gi, ''); // Eliminar event handlers
};

/**
 * Sanitizar SQL input (escapar comillas)
 *
 * @param {string} str - String a sanitizar
 * @returns {string} String sanitizado
 */
const sanitizeSQLInput = (str) => {
  if (typeof str !== 'string') {
    return '';
  }

  return str
    .trim()
    .replace(/'/g, "''") // Escapar comillas simples
    .replace(/;/g, ''); // Eliminar punto y coma
};

// ============================================
// EXPORTACIONES
// ============================================
module.exports = {
  // Validaciones de identificación
  validateCedula,
  validateRUC,

  // Validaciones de contacto
  validateEmail,
  validateCelular,
  validateTelefono,

  // Validaciones de formato
  validateOnlyLetters,
  validateOnlyNumbers,
  validateURL,

  // Validaciones de rango
  validateRange,
  validateLength,

  // Validaciones de fecha
  validateDate,
  validateFutureDate,
  validatePastDate,
  validateDateRange,

  // Validaciones de negocio
  validatePrice,
  validateQuantity,

  // Funciones de sanitización
  sanitizeString,
  sanitizeSQLInput
};
