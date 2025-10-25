/**
 * ============================================
 * SISTEMA DE GESTIÓN DE EVENTOS - ESPOL
 * Configuración de Base de Datos (Azure SQL Database)
 * ============================================
 *
 * Este archivo configura la conexión a Azure SQL Database usando el paquete mssql.
 * Utiliza un pool de conexiones para optimizar el rendimiento y la gestión de recursos.
 *
 * Materia: SOFG1006 - Desarrollo de Aplicaciones Web y Móviles
 * Institución: Escuela Superior Politécnica del Litoral (ESPOL)
 */

// ============================================
// IMPORTACIÓN DE DEPENDENCIAS
// ============================================
const sql = require('mssql');
const dotenv = require('dotenv');

// Cargar variables de entorno
dotenv.config();

// ============================================
// CONFIGURACIÓN DE LA CONEXIÓN
// ============================================
/**
 * Configuración del pool de conexiones a Azure SQL Database
 *
 * Documentación: https://www.npmjs.com/package/mssql#configuration
 */
const config = {
  // Servidor de Azure SQL Database
  server: process.env.DB_SERVER,

  // Puerto (por defecto 1433 para SQL Server)
  port: parseInt(process.env.DB_PORT || '1433'),

  // Nombre de la base de datos
  database: process.env.DB_DATABASE,

  // Credenciales de autenticación
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,

  // Opciones de conexión
  options: {
    // Encriptar la conexión (obligatorio para Azure SQL Database)
    encrypt: true,

    // Confiar en el certificado del servidor (necesario para Azure)
    trustServerCertificate: false,

    // Habilitar MARS (Multiple Active Result Sets)
    enableArithAbort: true,

    // Timeout de conexión (30 segundos)
    connectionTimeout: 30000,

    // Timeout de petición (30 segundos)
    requestTimeout: 30000
  },

  // Configuración del pool de conexiones
  pool: {
    // Número máximo de conexiones en el pool
    max: 10,

    // Número mínimo de conexiones en el pool
    min: 0,

    // Tiempo máximo de inactividad antes de cerrar conexión (30 segundos)
    idleTimeoutMillis: 30000
  }
};

// ============================================
// POOL DE CONEXIONES
// ============================================
/**
 * Pool de conexiones global
 * Se inicializa una vez y se reutiliza en toda la aplicación
 */
let pool = null;

/**
 * Obtener el pool de conexiones
 * Si no existe, lo crea; si ya existe, lo reutiliza
 *
 * @returns {Promise<sql.ConnectionPool>} Pool de conexiones
 */
const getPool = async () => {
  try {
    // Si el pool ya existe y está conectado, reutilizarlo
    if (pool && pool.connected) {
      return pool;
    }

    // Si el pool existe pero está cerrado, crear uno nuevo
    if (pool && !pool.connected) {
      pool = null;
    }

    // Crear nuevo pool de conexiones
    pool = await new sql.ConnectionPool(config).connect();

    console.log('✅ Pool de conexiones creado exitosamente');

    // Event listeners para monitorear el pool
    pool.on('error', (err) => {
      console.error('❌ Error en el pool de conexiones:', err);
      pool = null; // Resetear el pool en caso de error
    });

    return pool;

  } catch (error) {
    console.error('❌ Error al crear el pool de conexiones:', error.message);
    throw error;
  }
};

/**
 * Cerrar el pool de conexiones
 * Útil para testing y para cerrar la aplicación gracefully
 */
const closePool = async () => {
  try {
    if (pool) {
      await pool.close();
      pool = null;
      console.log('✅ Pool de conexiones cerrado');
    }
  } catch (error) {
    console.error('❌ Error al cerrar el pool de conexiones:', error.message);
    throw error;
  }
};

// ============================================
// FUNCIÓN PARA EJECUTAR QUERIES
// ============================================
/**
 * Ejecutar una query SQL
 *
 * @param {string} query - Query SQL a ejecutar
 * @param {Object} params - Parámetros de la query (opcional)
 * @returns {Promise<sql.IResult>} Resultado de la query
 *
 * @example
 * const result = await executeQuery(
 *   'SELECT * FROM Clientes WHERE id_Clientes = @id',
 *   { id: 1 }
 * );
 */
const executeQuery = async (query, params = {}) => {
  let connection;

  try {
    // Obtener el pool de conexiones
    const poolConnection = await getPool();

    // Crear una nueva request
    const request = poolConnection.request();

    // Agregar parámetros a la request
    Object.keys(params).forEach(key => {
      request.input(key, params[key]);
    });

    // Ejecutar la query
    const result = await request.query(query);

    return result;

  } catch (error) {
    console.error('❌ Error al ejecutar query:', error.message);
    console.error('Query:', query);
    console.error('Params:', params);
    throw error;
  }
};

/**
 * Ejecutar un stored procedure
 *
 * @param {string} procedureName - Nombre del stored procedure
 * @param {Object} params - Parámetros del stored procedure
 * @returns {Promise<sql.IResult>} Resultado del stored procedure
 *
 * @example
 * const result = await executeStoredProcedure('sp_GetCliente', { id: 1 });
 */
const executeStoredProcedure = async (procedureName, params = {}) => {
  try {
    // Obtener el pool de conexiones
    const poolConnection = await getPool();

    // Crear una nueva request
    const request = poolConnection.request();

    // Agregar parámetros a la request
    Object.keys(params).forEach(key => {
      request.input(key, params[key]);
    });

    // Ejecutar el stored procedure
    const result = await request.execute(procedureName);

    return result;

  } catch (error) {
    console.error('❌ Error al ejecutar stored procedure:', error.message);
    console.error('Procedure:', procedureName);
    console.error('Params:', params);
    throw error;
  }
};

// ============================================
// FUNCIÓN PARA PROBAR LA CONEXIÓN
// ============================================
/**
 * Probar la conexión a la base de datos
 * Útil para verificar que las credenciales y configuración son correctas
 *
 * @returns {Promise<boolean>} true si la conexión es exitosa
 */
const testConnection = async () => {
  try {
    console.log('🔍 Probando conexión a Azure SQL Database...');
    console.log(`   Servidor: ${process.env.DB_SERVER}`);
    console.log(`   Base de datos: ${process.env.DB_DATABASE}`);
    console.log(`   Usuario: ${process.env.DB_USER}`);

    // Intentar obtener el pool
    const poolConnection = await getPool();

    // Ejecutar una query simple para verificar la conexión
    const result = await poolConnection.request().query('SELECT 1 AS test');

    if (result.recordset[0].test === 1) {
      console.log('✅ Conexión a la base de datos exitosa');
      return true;
    }

    throw new Error('La query de prueba no retornó el resultado esperado');

  } catch (error) {
    console.error('❌ Error al conectar a la base de datos:', error.message);
    console.error('');
    console.error('Verifica:');
    console.error('  1. Que el archivo .env tenga las credenciales correctas');
    console.error('  2. Que Azure SQL Database esté accesible');
    console.error('  3. Que tu IP esté en las reglas de firewall de Azure');
    console.error('  4. Que el usuario y contraseña sean correctos');

    throw error;
  }
};

// ============================================
// TIPOS DE DATOS SQL
// ============================================
/**
 * Exportar tipos de datos de SQL para usar en las queries
 * Documentación: https://www.npmjs.com/package/mssql#data-types
 */
const sqlTypes = sql.TYPES;

// ============================================
// EXPORTACIONES
// ============================================
module.exports = {
  sql,                      // Objeto sql completo
  sqlTypes,                 // Tipos de datos SQL
  getPool,                  // Función para obtener el pool
  closePool,                // Función para cerrar el pool
  executeQuery,             // Función para ejecutar queries
  executeStoredProcedure,   // Función para ejecutar stored procedures
  testConnection            // Función para probar la conexión
};
