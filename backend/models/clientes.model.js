/**
 * ============================================
 * SISTEMA DE GESTIÓN DE EVENTOS - ESPOL
 * Modelo de Clientes
 * ============================================
 *
 * Este modelo maneja todas las operaciones de base de datos
 * relacionadas con el módulo de Clientes.
 *
 * Materia: SOFG1006 - Desarrollo de Aplicaciones Web y Móviles
 * Institución: Escuela Superior Politécnica del Litoral (ESPOL)
 */

// ============================================
// IMPORTACIÓN DE DEPENDENCIAS
// ============================================
const { executeQuery, sql } = require('../config/database');

// ============================================
// OPERACIONES CRUD
// ============================================

/**
 * Obtener todos los clientes
 *
 * @param {Object} filters - Filtros opcionales (búsqueda, paginación)
 * @returns {Promise<Array>} Array de clientes
 */
const findAll = async (filters = {}) => {
  try {
    let query = `
      SELECT
        c.id_Clientes,
        c.Cli_Nombre,
        c.Cli_Apellido,
        c.Cli_Email,
        c.Cli_Celular,
        c.Cli_Telefono,
        c.Cli_FechaNacimiento,
        c.Cli_Direccion,
        c.id_TipoCliente_Fk,
        tc.TipCli_Nombre AS TipoCliente_Nombre,
        c.id_GeneroSexo_Fk,
        gs.GenSex_Descripcion AS GeneroSexo,
        c.id_EstadoCivil_Fk,
        ec.EstCiv_Descripcion AS EstadoCivil,
        c.Cli_FechaRegistro,
        c.Cli_Estado
      FROM Clientes c
      LEFT JOIN TipoCliente tc ON c.id_TipoCliente_Fk = tc.id_TipoCliente
      LEFT JOIN GeneroSexo gs ON c.id_GeneroSexo_Fk = gs.id_GeneroSexo
      LEFT JOIN EstadoCivil ec ON c.id_EstadoCivil_Fk = ec.id_EstadoCivil
      WHERE c.Cli_Estado != 'Eliminado'
    `;

    const params = {};

    // Filtro de búsqueda
    if (filters.search) {
      query += ` AND (
        c.Cli_Nombre LIKE @search OR
        c.Cli_Apellido LIKE @search OR
        c.Cli_Email LIKE @search OR
        c.Cli_Celular LIKE @search
      )`;
      params.search = `%${filters.search}%`;
    }

    // Filtro por tipo de cliente
    if (filters.tipoCliente) {
      query += ` AND c.id_TipoCliente_Fk = @tipoCliente`;
      params.tipoCliente = filters.tipoCliente;
    }

    // Ordenamiento
    query += ` ORDER BY c.Cli_FechaRegistro DESC`;

    // Paginación
    if (filters.page && filters.limit) {
      const offset = (filters.page - 1) * filters.limit;
      query += ` OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY`;
      params.offset = offset;
      params.limit = filters.limit;
    }

    const result = await executeQuery(query, params);
    return result.recordset;

  } catch (error) {
    throw new Error(`Error al obtener clientes: ${error.message}`);
  }
};

/**
 * Obtener un cliente por ID
 *
 * @param {number} id - ID del cliente
 * @returns {Promise<Object|null>} Cliente o null si no existe
 */
const findById = async (id) => {
  try {
    const query = `
      SELECT
        c.id_Clientes,
        c.Cli_Nombre,
        c.Cli_Apellido,
        c.Cli_Email,
        c.Cli_Celular,
        c.Cli_Telefono,
        c.Cli_FechaNacimiento,
        c.Cli_Direccion,
        c.id_TipoCliente_Fk,
        tc.TipCli_Nombre AS TipoCliente_Nombre,
        c.id_GeneroSexo_Fk,
        gs.GenSex_Descripcion AS GeneroSexo,
        c.id_EstadoCivil_Fk,
        ec.EstCiv_Descripcion AS EstadoCivil,
        c.Cli_FechaRegistro,
        c.Cli_Estado
      FROM Clientes c
      LEFT JOIN TipoCliente tc ON c.id_TipoCliente_Fk = tc.id_TipoCliente
      LEFT JOIN GeneroSexo gs ON c.id_GeneroSexo_Fk = gs.id_GeneroSexo
      LEFT JOIN EstadoCivil ec ON c.id_EstadoCivil_Fk = ec.id_EstadoCivil
      WHERE c.id_Clientes = @id AND c.Cli_Estado != 'Eliminado'
    `;

    const result = await executeQuery(query, { id });

    return result.recordset.length > 0 ? result.recordset[0] : null;

  } catch (error) {
    throw new Error(`Error al obtener cliente: ${error.message}`);
  }
};

/**
 * Crear un nuevo cliente
 *
 * @param {Object} clienteData - Datos del cliente
 * @returns {Promise<Object>} Cliente creado
 */
const create = async (clienteData) => {
  try {
    const query = `
      INSERT INTO Clientes (
        Cli_Nombre,
        Cli_Apellido,
        Cli_Email,
        Cli_Celular,
        Cli_Telefono,
        Cli_FechaNacimiento,
        Cli_Direccion,
        id_TipoCliente_Fk,
        id_GeneroSexo_Fk,
        id_EstadoCivil_Fk,
        Cli_FechaRegistro,
        Cli_Estado
      )
      OUTPUT INSERTED.id_Clientes
      VALUES (
        @Cli_Nombre,
        @Cli_Apellido,
        @Cli_Email,
        @Cli_Celular,
        @Cli_Telefono,
        @Cli_FechaNacimiento,
        @Cli_Direccion,
        @id_TipoCliente_Fk,
        @id_GeneroSexo_Fk,
        @id_EstadoCivil_Fk,
        GETDATE(),
        'Activo'
      )
    `;

    const params = {
      Cli_Nombre: clienteData.Cli_Nombre,
      Cli_Apellido: clienteData.Cli_Apellido,
      Cli_Email: clienteData.Cli_Email,
      Cli_Celular: clienteData.Cli_Celular,
      Cli_Telefono: clienteData.Cli_Telefono || null,
      Cli_FechaNacimiento: clienteData.Cli_FechaNacimiento || null,
      Cli_Direccion: clienteData.Cli_Direccion || null,
      id_TipoCliente_Fk: clienteData.id_TipoCliente_Fk,
      id_GeneroSexo_Fk: clienteData.id_GeneroSexo_Fk || null,
      id_EstadoCivil_Fk: clienteData.id_EstadoCivil_Fk || null
    };

    const result = await executeQuery(query, params);
    const newId = result.recordset[0].id_Clientes;

    // Obtener el cliente recién creado
    return await findById(newId);

  } catch (error) {
    throw new Error(`Error al crear cliente: ${error.message}`);
  }
};

/**
 * Actualizar un cliente
 *
 * @param {number} id - ID del cliente
 * @param {Object} clienteData - Datos a actualizar
 * @returns {Promise<Object>} Cliente actualizado
 */
const update = async (id, clienteData) => {
  try {
    const query = `
      UPDATE Clientes
      SET
        Cli_Nombre = @Cli_Nombre,
        Cli_Apellido = @Cli_Apellido,
        Cli_Email = @Cli_Email,
        Cli_Celular = @Cli_Celular,
        Cli_Telefono = @Cli_Telefono,
        Cli_FechaNacimiento = @Cli_FechaNacimiento,
        Cli_Direccion = @Cli_Direccion,
        id_TipoCliente_Fk = @id_TipoCliente_Fk,
        id_GeneroSexo_Fk = @id_GeneroSexo_Fk,
        id_EstadoCivil_Fk = @id_EstadoCivil_Fk
      WHERE id_Clientes = @id AND Cli_Estado != 'Eliminado'
    `;

    const params = {
      id,
      Cli_Nombre: clienteData.Cli_Nombre,
      Cli_Apellido: clienteData.Cli_Apellido,
      Cli_Email: clienteData.Cli_Email,
      Cli_Celular: clienteData.Cli_Celular,
      Cli_Telefono: clienteData.Cli_Telefono || null,
      Cli_FechaNacimiento: clienteData.Cli_FechaNacimiento || null,
      Cli_Direccion: clienteData.Cli_Direccion || null,
      id_TipoCliente_Fk: clienteData.id_TipoCliente_Fk,
      id_GeneroSexo_Fk: clienteData.id_GeneroSexo_Fk || null,
      id_EstadoCivil_Fk: clienteData.id_EstadoCivil_Fk || null
    };

    await executeQuery(query, params);

    // Obtener el cliente actualizado
    return await findById(id);

  } catch (error) {
    throw new Error(`Error al actualizar cliente: ${error.message}`);
  }
};

/**
 * Eliminar un cliente (soft delete)
 *
 * @param {number} id - ID del cliente
 * @returns {Promise<boolean>} true si se eliminó correctamente
 */
const remove = async (id) => {
  try {
    const query = `
      UPDATE Clientes
      SET Cli_Estado = 'Eliminado'
      WHERE id_Clientes = @id
    `;

    await executeQuery(query, { id });
    return true;

  } catch (error) {
    throw new Error(`Error al eliminar cliente: ${error.message}`);
  }
};

/**
 * Contar total de clientes (para paginación)
 *
 * @param {Object} filters - Filtros opcionales
 * @returns {Promise<number>} Total de clientes
 */
const count = async (filters = {}) => {
  try {
    let query = `
      SELECT COUNT(*) as total
      FROM Clientes
      WHERE Cli_Estado != 'Eliminado'
    `;

    const params = {};

    if (filters.search) {
      query += ` AND (
        Cli_Nombre LIKE @search OR
        Cli_Apellido LIKE @search OR
        Cli_Email LIKE @search OR
        Cli_Celular LIKE @search
      )`;
      params.search = `%${filters.search}%`;
    }

    if (filters.tipoCliente) {
      query += ` AND id_TipoCliente_Fk = @tipoCliente`;
      params.tipoCliente = filters.tipoCliente;
    }

    const result = await executeQuery(query, params);
    return result.recordset[0].total;

  } catch (error) {
    throw new Error(`Error al contar clientes: ${error.message}`);
  }
};

// ============================================
// EXPORTACIONES
// ============================================
module.exports = {
  findAll,
  findById,
  create,
  update,
  remove,
  count
};
