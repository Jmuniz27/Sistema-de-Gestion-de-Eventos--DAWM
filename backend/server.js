/**
 * ============================================
 * SISTEMA DE GESTIÓN DE EVENTOS - ESPOL
 * Servidor Principal (Express.js)
 * ============================================
 *
 * Este archivo es el punto de entrada principal del servidor backend.
 * Configura Express, middlewares, rutas y conexión a la base de datos.
 *
 * Materia: SOFG1006 - Desarrollo de Aplicaciones Web y Móviles
 * Institución: Escuela Superior Politécnica del Litoral (ESPOL)
 */

// ============================================
// IMPORTACIÓN DE DEPENDENCIAS
// ============================================
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { testConnection } = require('./config/database');
const errorHandler = require('./middleware/errorHandler');
const routes = require('./routes');

// ============================================
// CONFIGURACIÓN DE VARIABLES DE ENTORNO
// ============================================
// Cargar variables de entorno desde archivo .env
dotenv.config();

// ============================================
// INICIALIZACIÓN DE LA APLICACIÓN EXPRESS
// ============================================
const app = express();

// Puerto del servidor (Azure App Service asigna automáticamente el puerto)
const PORT = process.env.PORT || 3000;

// ============================================
// CONFIGURACIÓN DE MIDDLEWARES
// ============================================

/**
 * CORS (Cross-Origin Resource Sharing)
 * Permite que el frontend haga peticiones al backend desde diferentes orígenes
 */
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',')
    : ['http://localhost:3000', 'http://127.0.0.1:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions));

/**
 * Middleware para parsear JSON
 * Permite recibir datos en formato JSON en las peticiones
 */
app.use(express.json({ limit: '10mb' }));

/**
 * Middleware para parsear datos de formularios
 * Permite recibir datos codificados en URL (application/x-www-form-urlencoded)
 */
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

/**
 * Middleware para servir archivos estáticos del frontend
 * Sirve los archivos HTML, CSS, JS e imágenes desde la carpeta frontend
 */
app.use(express.static('frontend'));

/**
 * Middleware para logging de peticiones (solo en desarrollo)
 */
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
  });
}

// ============================================
// RUTAS DE LA API
// ============================================

/**
 * Ruta raíz - Información básica de la API
 */
app.get('/', (req, res) => {
  res.json({
    message: 'Sistema de Gestión de Eventos - ESPOL',
    version: '1.0.0',
    materia: 'SOFG1006 - Desarrollo de Aplicaciones Web y Móviles',
    endpoints: {
      api: '/api/v1',
      health: '/health',
      modules: [
        '/api/v1/modulo-general',
        '/api/v1/clientes',
        '/api/v1/eventos',
        '/api/v1/boletos',
        '/api/v1/facturacion',
        '/api/v1/notificaciones',
        '/api/v1/autenticacion'
      ]
    }
  });
});

/**
 * Ruta de salud - Para verificar que el servidor está funcionando
 * Útil para Azure App Service health checks
 */
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

/**
 * Montar todas las rutas de la API bajo el prefijo /api/v1
 */
app.use('/api/v1', routes);

// ============================================
// MANEJO DE RUTAS NO ENCONTRADAS (404)
// ============================================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint no encontrado',
    path: req.url,
    method: req.method
  });
});

// ============================================
// MIDDLEWARE DE MANEJO DE ERRORES GLOBAL
// ============================================
// Este debe ser el último middleware
app.use(errorHandler);

// ============================================
// FUNCIÓN PARA INICIAR EL SERVIDOR
// ============================================
/**
 * Inicia el servidor después de verificar la conexión a la base de datos
 */
const startServer = async () => {
  try {
    // Probar conexión a la base de datos
    console.log('🔍 Verificando conexión a Azure SQL Database...');
    await testConnection();
    console.log('✅ Conexión a la base de datos establecida correctamente');

    // Iniciar el servidor
    app.listen(PORT, () => {
      console.log('============================================');
      console.log('📚 Sistema de Gestión de Eventos - ESPOL');
      console.log('============================================');
      console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
      console.log(`🌍 Entorno: ${process.env.NODE_ENV || 'development'}`);
      console.log(`📡 API disponible en: http://localhost:${PORT}/api/v1`);
      console.log(`❤️  Health check: http://localhost:${PORT}/health`);
      console.log('============================================');
    });

  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error.message);
    console.error('');
    console.error('Posibles causas:');
    console.error('  1. Variables de entorno no configuradas correctamente (.env)');
    console.error('  2. Azure SQL Database no accesible (verificar firewall)');
    console.error('  3. Credenciales de base de datos incorrectas');
    console.error('');
    console.error('Verifica tu archivo .env y las configuraciones de Azure SQL Database');

    // En producción, no cerrar el servidor inmediatamente
    // Azure App Service necesita tiempo para detectar el problema
    if (process.env.NODE_ENV === 'production') {
      console.log('⚠️  Servidor en modo producción - continuando sin base de datos...');
      app.listen(PORT, () => {
        console.log(`⚠️  Servidor corriendo en puerto ${PORT} SIN BASE DE DATOS`);
      });
    } else {
      process.exit(1);
    }
  }
};

// ============================================
// MANEJO DE ERRORES NO CAPTURADOS
// ============================================
/**
 * Captura errores no manejados para evitar que el servidor se caiga
 */
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  // No cerrar el servidor en producción
  if (process.env.NODE_ENV !== 'production') {
    process.exit(1);
  }
});

process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  // No cerrar el servidor en producción
  if (process.env.NODE_ENV !== 'production') {
    process.exit(1);
  }
});

// ============================================
// INICIAR EL SERVIDOR
// ============================================
startServer();

// ============================================
// EXPORTAR LA APLICACIÓN (para testing)
// ============================================
module.exports = app;
