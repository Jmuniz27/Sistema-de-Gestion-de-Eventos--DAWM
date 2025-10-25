/**
 * ============================================
 * SISTEMA DE GESTIÓN DE EVENTOS - ESPOL
 * Registro Central de Rutas
 * ============================================
 *
 * Este archivo centraliza todas las rutas de los diferentes módulos
 * y las expone bajo el prefijo /api/v1
 *
 * Materia: SOFG1006 - Desarrollo de Aplicaciones Web y Móviles
 * Institución: Escuela Superior Politécnica del Litoral (ESPOL)
 */

// ============================================
// IMPORTACIÓN DE DEPENDENCIAS
// ============================================
const express = require('express');
const router = express.Router();

// ============================================
// IMPORTACIÓN DE RUTAS DE MÓDULOS
// ============================================
const clientesRoutes = require('./clientes.routes');
// Las siguientes rutas se importarán cuando se implementen sus módulos
// const moduloGeneralRoutes = require('./modulo-general.routes');
// const eventosRoutes = require('./eventos.routes');
// const boletosRoutes = require('./boletos.routes');
// const facturacionRoutes = require('./facturacion.routes');
// const notificacionesRoutes = require('./notificaciones.routes');
// const autenticacionRoutes = require('./autenticacion.routes');

// ============================================
// REGISTRO DE RUTAS
// ============================================

/**
 * Ruta raíz de la API
 * GET /api/v1/
 */
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'API del Sistema de Gestión de Eventos - ESPOL',
    version: '1.0.0',
    documentation: '/api/v1/docs',
    modules: {
      clientes: {
        base: '/api/v1/clientes',
        endpoints: [
          'GET /api/v1/clientes - Listar todos los clientes',
          'GET /api/v1/clientes/:id - Obtener cliente por ID',
          'POST /api/v1/clientes - Crear nuevo cliente',
          'PUT /api/v1/clientes/:id - Actualizar cliente',
          'DELETE /api/v1/clientes/:id - Eliminar cliente',
          'GET /api/v1/clientes/export/:format - Exportar clientes'
        ]
      },
      // Módulos pendientes de implementar
      moduloGeneral: {
        base: '/api/v1/modulo-general',
        status: 'Pendiente de implementación'
      },
      eventos: {
        base: '/api/v1/eventos',
        status: 'Pendiente de implementación'
      },
      boletos: {
        base: '/api/v1/boletos',
        status: 'Pendiente de implementación'
      },
      facturacion: {
        base: '/api/v1/facturacion',
        status: 'Pendiente de implementación'
      },
      notificaciones: {
        base: '/api/v1/notificaciones',
        status: 'Pendiente de implementación'
      },
      autenticacion: {
        base: '/api/v1/autenticacion',
        status: 'Pendiente de implementación'
      }
    }
  });
});

// ============================================
// MONTAR RUTAS DE MÓDULOS
// ============================================

// Módulo de Clientes
router.use('/clientes', clientesRoutes);

// Módulo General (a implementar)
// router.use('/modulo-general', moduloGeneralRoutes);

// Módulo de Eventos (a implementar)
// router.use('/eventos', eventosRoutes);

// Módulo de Boletos (a implementar)
// router.use('/boletos', boletosRoutes);

// Módulo de Facturación (a implementar)
// router.use('/facturacion', facturacionRoutes);

// Módulo de Notificaciones (a implementar)
// router.use('/notificaciones', notificacionesRoutes);

// Módulo de Autenticación (a implementar)
// router.use('/autenticacion', autenticacionRoutes);

// ============================================
// EXPORTACIÓN
// ============================================
module.exports = router;
