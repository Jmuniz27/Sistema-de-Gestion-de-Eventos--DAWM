/**
 * ============================================
 * SISTEMA DE GESTIÓN DE EVENTOS - ESPOL
 * Middleware de Validación de Peticiones
 * ============================================
 *
 * Este middleware proporciona funciones de validación usando express-validator.
 * Incluye validaciones comunes y un middleware para verificar errores.
 *
 * Materia: SOFG1006 - Desarrollo de Aplicaciones Web y Móviles
 * Institución: Escuela Superior Politécnica del Litoral (ESPOL)
 */

// ============================================
// IMPORTACIÓN DE DEPENDENCIAS
// ============================================
const { body, param, query, validationResult } = require('express-validator');

// ============================================
// MIDDLEWARE PARA VERIFICAR ERRORES DE VALIDACIÓN
// ============================================
/**
 * Verifica si hay errores de validación y los formatea
 * Este middleware debe usarse después de las reglas de validación
 *
 * @param {Request} req - Objeto de petición
 * @param {Response} res - Objeto de respuesta
 * @param {NextFunction} next - Función next
 */
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    // Formatear errores para que sean más legibles
    const formattedErrors = errors.array().map(error => ({
      field: error.path || error.param,
      message: error.msg,
      value: error.value,
      location: error.location
    }));

    return res.status(400).json({
      success: false,
      message: 'Error de validación',
      errors: formattedErrors
    });
  }

  next();
};

// ============================================
// VALIDACIONES COMUNES
// ============================================

/**
 * Validación para ID numérico en parámetros de URL
 * Ejemplo: /api/clientes/:id
 */
const validateId = [
  param('id')
    .notEmpty()
    .withMessage('El ID es requerido')
    .isInt({ min: 1 })
    .withMessage('El ID debe ser un número entero positivo'),
  validateRequest
];

/**
 * Validación para email
 */
const validateEmail = (fieldName = 'email') => [
  body(fieldName)
    .notEmpty()
    .withMessage(`El campo ${fieldName} es requerido`)
    .isEmail()
    .withMessage('Debe ser un email válido')
    .normalizeEmail()
    .toLowerCase()
];

/**
 * Validación para teléfono celular ecuatoriano
 * Formato aceptado: 09XXXXXXXX (10 dígitos empezando con 09)
 */
const validateCelular = (fieldName = 'celular') => [
  body(fieldName)
    .notEmpty()
    .withMessage(`El campo ${fieldName} es requerido`)
    .matches(/^09\d{8}$/)
    .withMessage('El celular debe tener 10 dígitos y comenzar con 09')
];

/**
 * Validación para cédula ecuatoriana
 * Formato: 10 dígitos
 */
const validateCedula = (fieldName = 'cedula') => [
  body(fieldName)
    .notEmpty()
    .withMessage(`El campo ${fieldName} es requerido`)
    .matches(/^\d{10}$/)
    .withMessage('La cédula debe tener exactamente 10 dígitos')
    .custom((value) => {
      // Validación del dígito verificador de la cédula ecuatoriana
      if (value.length !== 10) return false;

      const digits = value.split('').map(Number);
      const provinceCode = parseInt(value.substring(0, 2));

      // Verificar que el código de provincia sea válido (01-24)
      if (provinceCode < 1 || provinceCode > 24) {
        throw new Error('Código de provincia inválido');
      }

      // Algoritmo de validación de cédula ecuatoriana
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

      if (checkDigit !== digits[9]) {
        throw new Error('Cédula inválida');
      }

      return true;
    })
];

/**
 * Validación para RUC ecuatoriano
 * Formato: 13 dígitos
 */
const validateRUC = (fieldName = 'ruc') => [
  body(fieldName)
    .notEmpty()
    .withMessage(`El campo ${fieldName} es requerido`)
    .matches(/^\d{13}$/)
    .withMessage('El RUC debe tener exactamente 13 dígitos')
    .custom((value) => {
      // Los primeros 10 dígitos deben ser una cédula válida
      const cedula = value.substring(0, 10);

      // Verificar que termine en 001 (persona natural) o sea empresa válida
      const suffix = value.substring(10);
      if (!['001'].includes(suffix)) {
        // Para empresas, verificar que el tercer dígito sea 9
        if (value[2] !== '9') {
          throw new Error('RUC inválido');
        }
      }

      return true;
    })
];

/**
 * Validación para nombre (solo letras y espacios)
 */
const validateNombre = (fieldName = 'nombre') => [
  body(fieldName)
    .notEmpty()
    .withMessage(`El campo ${fieldName} es requerido`)
    .isLength({ min: 2, max: 100 })
    .withMessage(`El ${fieldName} debe tener entre 2 y 100 caracteres`)
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    .withMessage(`El ${fieldName} solo puede contener letras y espacios`)
    .trim()
];

/**
 * Validación para fecha (formato ISO 8601)
 */
const validateFecha = (fieldName = 'fecha') => [
  body(fieldName)
    .notEmpty()
    .withMessage(`El campo ${fieldName} es requerido`)
    .isISO8601()
    .withMessage('Debe ser una fecha válida en formato ISO 8601')
    .toDate()
];

/**
 * Validación para fecha futura
 */
const validateFechaFutura = (fieldName = 'fecha') => [
  body(fieldName)
    .notEmpty()
    .withMessage(`El campo ${fieldName} es requerido`)
    .isISO8601()
    .withMessage('Debe ser una fecha válida')
    .custom((value) => {
      const date = new Date(value);
      const now = new Date();
      if (date <= now) {
        throw new Error('La fecha debe ser futura');
      }
      return true;
    })
    .toDate()
];

/**
 * Validación para número decimal positivo
 */
const validatePrecio = (fieldName = 'precio') => [
  body(fieldName)
    .notEmpty()
    .withMessage(`El campo ${fieldName} es requerido`)
    .isFloat({ min: 0 })
    .withMessage(`El ${fieldName} debe ser un número positivo`)
    .toFloat()
];

/**
 * Validación para número entero positivo
 */
const validateEnteroPositivo = (fieldName) => [
  body(fieldName)
    .notEmpty()
    .withMessage(`El campo ${fieldName} es requerido`)
    .isInt({ min: 0 })
    .withMessage(`El ${fieldName} debe ser un número entero positivo`)
    .toInt()
];

/**
 * Validación para campo obligatorio de texto
 */
const validateTextoObligatorio = (fieldName, minLength = 1, maxLength = 500) => [
  body(fieldName)
    .notEmpty()
    .withMessage(`El campo ${fieldName} es requerido`)
    .isLength({ min: minLength, max: maxLength })
    .withMessage(`El ${fieldName} debe tener entre ${minLength} y ${maxLength} caracteres`)
    .trim()
];

/**
 * Validación para campo opcional de texto
 */
const validateTextoOpcional = (fieldName, maxLength = 500) => [
  body(fieldName)
    .optional()
    .isLength({ max: maxLength })
    .withMessage(`El ${fieldName} no puede exceder ${maxLength} caracteres`)
    .trim()
];

/**
 * Validación para URL
 */
const validateURL = (fieldName = 'url') => [
  body(fieldName)
    .notEmpty()
    .withMessage(`El campo ${fieldName} es requerido`)
    .isURL()
    .withMessage('Debe ser una URL válida')
];

/**
 * Validación para boolean
 */
const validateBoolean = (fieldName) => [
  body(fieldName)
    .notEmpty()
    .withMessage(`El campo ${fieldName} es requerido`)
    .isBoolean()
    .withMessage(`El ${fieldName} debe ser verdadero o falso`)
    .toBoolean()
];

/**
 * Validación para query parameter de paginación
 */
const validatePaginacion = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('La página debe ser un número entero positivo')
    .toInt(),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('El límite debe ser un número entre 1 y 100')
    .toInt(),
  validateRequest
];

/**
 * Validación para formato de exportación
 */
const validateExportFormat = [
  param('format')
    .notEmpty()
    .withMessage('El formato de exportación es requerido')
    .isIn(['pdf', 'excel', 'csv', 'json', 'txt'])
    .withMessage('Formato inválido. Use: pdf, excel, csv, json, o txt'),
  validateRequest
];

// ============================================
// FUNCIÓN HELPER PARA CREAR VALIDACIONES PERSONALIZADAS
// ============================================
/**
 * Crear una validación personalizada
 *
 * @param {string} fieldName - Nombre del campo
 * @param {Function} validatorFn - Función de validación
 * @param {string} errorMessage - Mensaje de error
 * @returns {ValidationChain}
 */
const createCustomValidation = (fieldName, validatorFn, errorMessage) => {
  return body(fieldName)
    .custom(validatorFn)
    .withMessage(errorMessage);
};

// ============================================
// EXPORTACIONES
// ============================================
module.exports = {
  // Middleware principal
  validateRequest,

  // Validaciones comunes
  validateId,
  validateEmail,
  validateCelular,
  validateCedula,
  validateRUC,
  validateNombre,
  validateFecha,
  validateFechaFutura,
  validatePrecio,
  validateEnteroPositivo,
  validateTextoObligatorio,
  validateTextoOpcional,
  validateURL,
  validateBoolean,
  validatePaginacion,
  validateExportFormat,

  // Helper para validaciones personalizadas
  createCustomValidation,

  // Re-exportar funciones de express-validator para uso directo
  body,
  param,
  query
};
