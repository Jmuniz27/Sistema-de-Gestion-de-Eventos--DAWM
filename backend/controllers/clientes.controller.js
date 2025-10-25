/**
 * ============================================
 * SISTEMA DE GESTIÓN DE EVENTOS - ESPOL
 * Controlador de Clientes
 * ============================================
 *
 * Este controlador maneja la lógica de negocio del módulo de Clientes
 * y actúa como intermediario entre las rutas y el modelo.
 *
 * Materia: SOFG1006 - Desarrollo de Aplicaciones Web y Móviles
 * Institución: Escuela Superior Politécnica del Litoral (ESPOL)
 */

// ============================================
// IMPORTACIÓN DE DEPENDENCIAS
// ============================================
const ClientesModel = require('../models/clientes.model');
const { createNotFoundError } = require('../middleware/errorHandler');
const { exportData, getContentType, getFileExtension } = require('../utils/exporters');

// ============================================
// CONTROLADORES CRUD
// ============================================

/**
 * Obtener todos los clientes
 * GET /api/v1/clientes
 */
const getAllClientes = async (req, res, next) => {
  try {
    // Extraer parámetros de query
    const { page, limit, search, tipoCliente } = req.query;

    // Construir filtros
    const filters = {};

    if (search) filters.search = search;
    if (tipoCliente) filters.tipoCliente = parseInt(tipoCliente);
    if (page && limit) {
      filters.page = parseInt(page);
      filters.limit = parseInt(limit);
    }

    // Obtener clientes y total
    const [clientes, total] = await Promise.all([
      ClientesModel.findAll(filters),
      ClientesModel.count(filters)
    ]);

    // Calcular metadatos de paginación
    const metadata = {
      total,
      page: filters.page || 1,
      limit: filters.limit || total,
      totalPages: filters.limit ? Math.ceil(total / filters.limit) : 1
    };

    res.status(200).json({
      success: true,
      message: 'Clientes obtenidos exitosamente',
      data: clientes,
      metadata
    });

  } catch (error) {
    next(error);
  }
};

/**
 * Obtener un cliente por ID
 * GET /api/v1/clientes/:id
 */
const getClienteById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const cliente = await ClientesModel.findById(id);

    if (!cliente) {
      throw createNotFoundError('Cliente', id);
    }

    res.status(200).json({
      success: true,
      message: 'Cliente obtenido exitosamente',
      data: cliente
    });

  } catch (error) {
    next(error);
  }
};

/**
 * Crear un nuevo cliente
 * POST /api/v1/clientes
 */
const createCliente = async (req, res, next) => {
  try {
    const clienteData = req.body;

    const nuevoCliente = await ClientesModel.create(clienteData);

    res.status(201).json({
      success: true,
      message: 'Cliente creado exitosamente',
      data: nuevoCliente
    });

  } catch (error) {
    next(error);
  }
};

/**
 * Actualizar un cliente
 * PUT /api/v1/clientes/:id
 */
const updateCliente = async (req, res, next) => {
  try {
    const { id } = req.params;
    const clienteData = req.body;

    // Verificar que el cliente existe
    const clienteExiste = await ClientesModel.findById(id);
    if (!clienteExiste) {
      throw createNotFoundError('Cliente', id);
    }

    const clienteActualizado = await ClientesModel.update(id, clienteData);

    res.status(200).json({
      success: true,
      message: 'Cliente actualizado exitosamente',
      data: clienteActualizado
    });

  } catch (error) {
    next(error);
  }
};

/**
 * Eliminar un cliente (soft delete)
 * DELETE /api/v1/clientes/:id
 */
const deleteCliente = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Verificar que el cliente existe
    const clienteExiste = await ClientesModel.findById(id);
    if (!clienteExiste) {
      throw createNotFoundError('Cliente', id);
    }

    await ClientesModel.remove(id);

    res.status(200).json({
      success: true,
      message: 'Cliente eliminado exitosamente',
      data: { id }
    });

  } catch (error) {
    next(error);
  }
};

// ============================================
// CONTROLADOR DE EXPORTACIÓN
// ============================================

/**
 * Exportar clientes en diferentes formatos
 * GET /api/v1/clientes/export/:format
 */
const exportClientes = async (req, res, next) => {
  try {
    const { format } = req.params;
    const { search, tipoCliente } = req.query;

    // Construir filtros (sin paginación para exportar todo)
    const filters = {};
    if (search) filters.search = search;
    if (tipoCliente) filters.tipoCliente = parseInt(tipoCliente);

    // Obtener todos los clientes que cumplan los filtros
    const clientes = await ClientesModel.findAll(filters);

    if (clientes.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No hay clientes para exportar'
      });
    }

    // Preparar datos para exportación (solo campos relevantes)
    const dataParaExportar = clientes.map(cliente => ({
      ID: cliente.id_Clientes,
      Nombre: cliente.Cli_Nombre,
      Apellido: cliente.Cli_Apellido,
      Email: cliente.Cli_Email,
      Celular: cliente.Cli_Celular,
      Telefono: cliente.Cli_Telefono || 'N/A',
      'Tipo Cliente': cliente.TipoCliente_Nombre || 'N/A',
      Genero: cliente.GeneroSexo || 'N/A',
      'Estado Civil': cliente.EstadoCivil || 'N/A',
      'Fecha Registro': new Date(cliente.Cli_FechaRegistro).toLocaleDateString('es-EC'),
      Estado: cliente.Cli_Estado
    }));

    // Opciones de exportación
    const exportOptions = {
      title: 'Reporte de Clientes',
      subtitle: 'Sistema de Gestión de Eventos - ESPOL',
      sheetName: 'Clientes'
    };

    // Exportar datos
    const exportedData = await exportData(dataParaExportar, format, exportOptions);

    // Configurar headers de respuesta
    const contentType = getContentType(format);
    const fileExtension = getFileExtension(format);
    const fileName = `clientes_${new Date().toISOString().split('T')[0]}.${fileExtension}`;

    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);

    // Enviar archivo
    res.send(exportedData);

  } catch (error) {
    next(error);
  }
};

// ============================================
// EXPORTACIONES
// ============================================
module.exports = {
  getAllClientes,
  getClienteById,
  createCliente,
  updateCliente,
  deleteCliente,
  exportClientes
};
