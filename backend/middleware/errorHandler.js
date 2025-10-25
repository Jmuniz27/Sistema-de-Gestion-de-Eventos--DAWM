/**
 * ============================================
 * SISTEMA DE GESTIÓN DE EVENTOS - ESPOL
 * Middleware de Manejo de Errores
 * ============================================
 *
 * Este middleware centraliza el manejo de errores en toda la aplicación.
 * Captura errores de las rutas y controllers, y devuelve respuestas consistentes.
 *
 * Materia: SOFG1006 - Desarrollo de Aplicaciones Web y Móviles
 * Institución: Escuela Superior Politécnica del Litoral (ESPOL)
 */

// ============================================
// MIDDLEWARE GLOBAL DE MANEJO DE ERRORES
// ============================================
/**
 * Middleware de manejo de errores
 * Este debe ser el último middleware en la cadena
 *
 * @param {Error} err - Objeto de error
 * @param {Request} req - Objeto de petición
 * @param {Response} res - Objeto de respuesta
 * @param {NextFunction} next - Función next
 */
const errorHandler = (err, req, res, next) => {
  // Log del error en consola (solo en desarrollo)
  if (process.env.NODE_ENV === 'development') {
    console.error('❌ ERROR:', err);
  }

  // Determinar el código de estado HTTP
  let statusCode = err.statusCode || err.status || 500;

  // Si el código es 200 pero hay un error, cambiar a 500
  if (statusCode === 200) {
    statusCode = 500;
  }

  // Mensaje de error
  let message = err.message || 'Error interno del servidor';

  // Detalles adicionales del error
  let errorDetails = {};

  // ============================================
  // TIPOS DE ERRORES ESPECÍFICOS
  // ============================================

  /**
   * Errores de Base de Datos (SQL Server)
   */
  if (err.name === 'RequestError' || err.number) {
    // Error de SQL Server
    statusCode = 400;

    switch (err.number) {
      case 2627: // Violación de clave única
        message = 'Ya existe un registro con estos datos';
        errorDetails.field = err.message.match(/\(([^)]+)\)/)?.[1];
        break;

      case 547: // Violación de clave foránea
        message = 'No se puede completar la operación debido a referencias existentes';
        break;

      case 515: // Campo nulo no permitido
        message = 'Faltan campos obligatorios';
        errorDetails.field = err.message.match(/'([^']+)'/)?.[1];
        break;

      case 207: // Nombre de columna inválido
        message = 'Error en la consulta a la base de datos';
        break;

      case 208: // Objeto inválido
        message = 'La tabla especificada no existe';
        break;

      default:
        message = 'Error en la operación con la base de datos';
    }

    // En desarrollo, incluir detalles del error SQL
    if (process.env.NODE_ENV === 'development') {
      errorDetails.sqlError = {
        number: err.number,
        state: err.state,
        class: err.class,
        lineNumber: err.lineNumber,
        serverName: err.serverName,
        procName: err.procName
      };
    }
  }

  /**
   * Errores de Validación (express-validator)
   */
  if (err.name === 'ValidationError' || err.array) {
    statusCode = 400;
    message = 'Error de validación';
    errorDetails.validationErrors = err.array?.() || err.errors;
  }

  /**
   * Errores de Sintaxis JSON
   */
  if (err.type === 'entity.parse.failed') {
    statusCode = 400;
    message = 'JSON inválido en la petición';
    errorDetails.parseError = err.body;
  }

  /**
   * Errores de Autenticación
   */
  if (err.name === 'UnauthorizedError' || err.name === 'AuthenticationError') {
    statusCode = 401;
    message = 'No autorizado - Token inválido o expirado';
  }

  /**
   * Errores de Permisos
   */
  if (err.name === 'ForbiddenError') {
    statusCode = 403;
    message = 'No tienes permisos para realizar esta acción';
  }

  /**
   * Errores de Recurso No Encontrado
   */
  if (err.name === 'NotFoundError') {
    statusCode = 404;
    message = err.message || 'Recurso no encontrado';
  }

  /**
   * Errores de Conexión a la Base de Datos
   */
  if (err.name === 'ConnectionError') {
    statusCode = 503;
    message = 'Error de conexión a la base de datos';
    errorDetails.retryAfter = '30 segundos';
  }

  // ============================================
  // ESTRUCTURA DE LA RESPUESTA DE ERROR
  // ============================================
  const errorResponse = {
    success: false,
    message: message,
    error: {
      type: err.name || 'Error',
      statusCode: statusCode,
      timestamp: new Date().toISOString(),
      path: req.url,
      method: req.method,
      ...errorDetails
    }
  };

  // En desarrollo, incluir el stack trace completo
  if (process.env.NODE_ENV === 'development') {
    errorResponse.error.stack = err.stack;
    errorResponse.error.originalMessage = err.message;
  }

  // ============================================
  // LOG DEL ERROR
  // ============================================
  // En producción, aquí se podría enviar a un servicio de logging
  // como Azure Application Insights, Sentry, etc.
  if (process.env.NODE_ENV === 'production') {
    console.error(`[${new Date().toISOString()}] ${statusCode} - ${message}`, {
      path: req.url,
      method: req.method,
      error: err.name
    });
  }

  // ============================================
  // ENVIAR RESPUESTA
  // ============================================
  res.status(statusCode).json(errorResponse);
};

// ============================================
// FUNCIONES HELPER PARA CREAR ERRORES
// ============================================

/**
 * Crear un error de validación
 * @param {string} message - Mensaje de error
 * @param {Array} errors - Array de errores de validación
 * @returns {Error} Error con propiedades adicionales
 */
const createValidationError = (message, errors = []) => {
  const error = new Error(message);
  error.name = 'ValidationError';
  error.statusCode = 400;
  error.errors = errors;
  return error;
};

/**
 * Crear un error de recurso no encontrado
 * @param {string} resource - Nombre del recurso
 * @param {any} id - ID del recurso
 * @returns {Error} Error con propiedades adicionales
 */
const createNotFoundError = (resource, id = null) => {
  const message = id
    ? `${resource} con ID ${id} no encontrado`
    : `${resource} no encontrado`;

  const error = new Error(message);
  error.name = 'NotFoundError';
  error.statusCode = 404;
  return error;
};

/**
 * Crear un error de autenticación
 * @param {string} message - Mensaje de error
 * @returns {Error} Error con propiedades adicionales
 */
const createAuthError = (message = 'No autorizado') => {
  const error = new Error(message);
  error.name = 'UnauthorizedError';
  error.statusCode = 401;
  return error;
};

/**
 * Crear un error de permisos
 * @param {string} message - Mensaje de error
 * @returns {Error} Error con propiedades adicionales
 */
const createForbiddenError = (message = 'Acceso denegado') => {
  const error = new Error(message);
  error.name = 'ForbiddenError';
  error.statusCode = 403;
  return error;
};

/**
 * Crear un error de base de datos
 * @param {string} message - Mensaje de error
 * @param {Error} originalError - Error original de la base de datos
 * @returns {Error} Error con propiedades adicionales
 */
const createDatabaseError = (message, originalError = null) => {
  const error = new Error(message);
  error.name = 'DatabaseError';
  error.statusCode = 500;

  if (originalError) {
    error.originalError = originalError.message;
    error.stack = originalError.stack;
  }

  return error;
};

// ============================================
// EXPORTACIONES
// ============================================
module.exports = errorHandler;

// Exportar también las funciones helper
module.exports.createValidationError = createValidationError;
module.exports.createNotFoundError = createNotFoundError;
module.exports.createAuthError = createAuthError;
module.exports.createForbiddenError = createForbiddenError;
module.exports.createDatabaseError = createDatabaseError;
