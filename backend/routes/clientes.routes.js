/**
 * ============================================
 * SISTEMA DE GESTIÓN DE EVENTOS - ESPOL
 * Rutas de Clientes
 * ============================================
 *
 * Define todas las rutas del módulo de Clientes
 * y aplica las validaciones correspondientes.
 *
 * Materia: SOFG1006 - Desarrollo de Aplicaciones Web y Móviles
 * Institución: Escuela Superior Politécnica del Litoral (ESPOL)
 */

// ============================================
// IMPORTACIÓN DE DEPENDENCIAS
// ============================================
const express = require('express');
const router = express.Router();
const ClientesController = require('../controllers/clientes.controller');
const {
  validateId,
  validateEmail,
  validateCelular,
  validateNombre,
  validateTextoObligatorio,
  validateTextoOpcional,
  validateEnteroPositivo,
  validatePaginacion,
  validateExportFormat,
  validateRequest,
  body
} = require('../middleware/validateRequest');

// ============================================
// VALIDACIONES ESPECÍFICAS PARA CLIENTES
// ============================================

/**
 * Validaciones para crear/actualizar cliente
 */
const validateClienteData = [
  ...validateNombre('Cli_Nombre'),
  ...validateNombre('Cli_Apellido'),
  ...validateEmail('Cli_Email'),
  ...validateCelular('Cli_Celular'),
  ...validateTextoOpcional('Cli_Telefono', 20),
  body('Cli_FechaNacimiento')
    .optional()
    .isISO8601()
    .withMessage('La fecha de nacimiento debe ser válida')
    .toDate(),
  ...validateTextoOpcional('Cli_Direccion', 300),
  ...validateEnteroPositivo('id_TipoCliente_Fk'),
  body('id_GeneroSexo_Fk')
    .optional()
    .isInt({ min: 1 })
    .withMessage('El género debe ser un ID válido')
    .toInt(),
  body('id_EstadoCivil_Fk')
    .optional()
    .isInt({ min: 1 })
    .withMessage('El estado civil debe ser un ID válido')
    .toInt(),
  validateRequest
];

// ============================================
// RUTAS
// ============================================

/**
 * @route   GET /api/v1/clientes/export/:format
 * @desc    Exportar clientes en el formato especificado
 * @access  Public
 * @params  format: pdf, excel, csv, json, txt
 * @query   search, tipoCliente
 */
router.get(
  '/export/:format',
  validateExportFormat,
  ClientesController.exportClientes
);

/**
 * @route   GET /api/v1/clientes
 * @desc    Obtener todos los clientes
 * @access  Public
 * @query   page, limit, search, tipoCliente
 */
router.get(
  '/',
  validatePaginacion,
  ClientesController.getAllClientes
);

/**
 * @route   GET /api/v1/clientes/:id
 * @desc    Obtener un cliente por ID
 * @access  Public
 */
router.get(
  '/:id',
  validateId,
  ClientesController.getClienteById
);

/**
 * @route   POST /api/v1/clientes
 * @desc    Crear un nuevo cliente
 * @access  Public
 * @body    Cli_Nombre, Cli_Apellido, Cli_Email, Cli_Celular, etc.
 */
router.post(
  '/',
  validateClienteData,
  ClientesController.createCliente
);

/**
 * @route   PUT /api/v1/clientes/:id
 * @desc    Actualizar un cliente
 * @access  Public
 * @body    Cli_Nombre, Cli_Apellido, Cli_Email, Cli_Celular, etc.
 */
router.put(
  '/:id',
  validateId,
  validateClienteData,
  ClientesController.updateCliente
);

/**
 * @route   DELETE /api/v1/clientes/:id
 * @desc    Eliminar un cliente (soft delete)
 * @access  Public
 */
router.delete(
  '/:id',
  validateId,
  ClientesController.deleteCliente
);

// ============================================
// EXPORTACIÓN
// ============================================
module.exports = router;
