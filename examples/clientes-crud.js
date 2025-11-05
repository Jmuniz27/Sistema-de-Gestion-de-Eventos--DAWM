/**
 * Ejemplos de operaciones CRUD para el módulo Clientes
 *
 * Este archivo demuestra cómo realizar operaciones básicas
 * de Crear, Leer, Actualizar y Eliminar en la tabla Clientes.
 *
 * @module examples/clientes-crud
 */

import { supabase } from '../lib/supabase.js';

// ============================================
// CREATE - Crear un nuevo cliente
// ============================================

/**
 * Crea un nuevo cliente en la base de datos
 *
 * @param {Object} clienteData - Datos del cliente
 * @returns {Promise<Object>} Cliente creado o error
 */
export async function crearCliente(clienteData) {
  try {
    const { data, error } = await supabase
      .from('Clientes')
      .insert([
        {
          Cli_Nombre: clienteData.nombre,
          Cli_Apellido: clienteData.apellido,
          Cli_Email: clienteData.email,
          Cli_Celular: clienteData.celular,
          Cli_Telefono: clienteData.telefono || null,
          Cli_FechaNacimiento: clienteData.fechaNacimiento || null,
          Cli_Identificacion: clienteData.identificacion || null,
          id_TipoDocumento_Fk: clienteData.tipoDocumento || null,
          id_GeneroSexo_Fk: clienteData.genero || null,
          id_EstadoCivil_Fk: clienteData.estadoCivil || null,
          id_TipoCliente_Fk: clienteData.tipoCliente,
          id_Operadora_Fk: clienteData.operadora || null,
          Cli_Estado: 'Activo'
        }
      ])
      .select();

    if (error) {
      console.error('❌ Error al crear cliente:', error.message);
      return { success: false, error };
    }

    console.log('✅ Cliente creado exitosamente:', data[0]);
    return { success: true, data: data[0] };

  } catch (err) {
    console.error('❌ Error inesperado:', err.message);
    return { success: false, error: err };
  }
}

// Ejemplo de uso:
// const nuevoCliente = await crearCliente({
//   nombre: 'María',
//   apellido: 'González',
//   email: 'maria.gonzalez@example.com',
//   celular: '0987654321',
//   telefono: '042345678',
//   fechaNacimiento: '1995-05-15',
//   identificacion: '0923456789',
//   tipoDocumento: 1, // ID del tipo de documento (ej: Cédula)
//   genero: 1, // ID del género
//   estadoCivil: 1, // ID del estado civil
//   tipoCliente: 1, // ID del tipo de cliente (requerido)
//   operadora: 1 // ID de la operadora
// });

// ============================================
// READ - Leer/Consultar clientes
// ============================================

/**
 * Obtiene todos los clientes activos
 *
 * @returns {Promise<Array>} Lista de clientes
 */
export async function obtenerClientesActivos() {
  try {
    const { data, error } = await supabase
      .from('Clientes')
      .select(`
        id_Clientes,
        Cli_Nombre,
        Cli_Apellido,
        Cli_Email,
        Cli_Celular,
        Cli_Telefono,
        Cli_FechaNacimiento,
        Cli_Identificacion,
        Cli_Estado,
        Cli_FechaRegistro,
        TipoDocumento (id_TipoDocumento, TDoc_Nombre),
        GeneroSexo (id_GeneroSexo, Gen_Nombre),
        EstadoCivil (id_EstadoCivil, EstCiv_Nombre),
        TipoCliente (id_TipoCliente, TpCli_Nombre),
        Operadora (id_Operadora, Op_Nombre)
      `)
      .eq('Cli_Estado', 'Activo')
      .order('Cli_FechaRegistro', { ascending: false });

    if (error) {
      console.error('❌ Error al obtener clientes:', error.message);
      return { success: false, error };
    }

    console.log(`✅ ${data.length} clientes encontrados`);
    return { success: true, data };

  } catch (err) {
    console.error('❌ Error inesperado:', err.message);
    return { success: false, error: err };
  }
}

/**
 * Busca un cliente por ID
 *
 * @param {number} id - ID del cliente
 * @returns {Promise<Object>} Cliente encontrado o error
 */
export async function obtenerClientePorId(id) {
  try {
    const { data, error } = await supabase
      .from('Clientes')
      .select(`
        *,
        TipoDocumento (TDoc_Nombre),
        GeneroSexo (Gen_Nombre),
        EstadoCivil (EstCiv_Nombre),
        TipoCliente (TpCli_Nombre),
        Operadora (Op_Nombre)
      `)
      .eq('id_Clientes', id)
      .single();

    if (error) {
      console.error('❌ Error al obtener cliente:', error.message);
      return { success: false, error };
    }

    console.log('✅ Cliente encontrado:', data);
    return { success: true, data };

  } catch (err) {
    console.error('❌ Error inesperado:', err.message);
    return { success: false, error: err };
  }
}

/**
 * Busca clientes por email (búsqueda parcial)
 *
 * @param {string} email - Email o parte del email a buscar
 * @returns {Promise<Array>} Lista de clientes que coinciden
 */
export async function buscarClientesPorEmail(email) {
  try {
    const { data, error } = await supabase
      .from('Clientes')
      .select('id_Clientes, Cli_Nombre, Cli_Apellido, Cli_Email, Cli_Celular')
      .ilike('Cli_Email', `%${email}%`)
      .limit(10);

    if (error) {
      console.error('❌ Error en búsqueda:', error.message);
      return { success: false, error };
    }

    console.log(`✅ ${data.length} clientes encontrados`);
    return { success: true, data };

  } catch (err) {
    console.error('❌ Error inesperado:', err.message);
    return { success: false, error: err };
  }
}

// ============================================
// UPDATE - Actualizar cliente
// ============================================

/**
 * Actualiza los datos de un cliente
 *
 * @param {number} id - ID del cliente
 * @param {Object} updates - Campos a actualizar
 * @returns {Promise<Object>} Cliente actualizado o error
 */
export async function actualizarCliente(id, updates) {
  try {
    // Agregar fecha de última modificación
    updates.Cli_FechaUltimaModificacion = new Date().toISOString();

    const { data, error } = await supabase
      .from('Clientes')
      .update(updates)
      .eq('id_Clientes', id)
      .select();

    if (error) {
      console.error('❌ Error al actualizar cliente:', error.message);
      return { success: false, error };
    }

    console.log('✅ Cliente actualizado exitosamente:', data[0]);
    return { success: true, data: data[0] };

  } catch (err) {
    console.error('❌ Error inesperado:', err.message);
    return { success: false, error: err };
  }
}

// Ejemplo de uso:
// const actualizado = await actualizarCliente(1, {
//   Cli_Celular: '0998765432',
//   Cli_Telefono: '042987654'
// });

/**
 * Cambia el estado de un cliente (Activo/Inactivo/Suspendido)
 *
 * @param {number} id - ID del cliente
 * @param {string} nuevoEstado - 'Activo', 'Inactivo' o 'Suspendido'
 * @returns {Promise<Object>} Cliente actualizado o error
 */
export async function cambiarEstadoCliente(id, nuevoEstado) {
  const estadosValidos = ['Activo', 'Inactivo', 'Suspendido'];

  if (!estadosValidos.includes(nuevoEstado)) {
    return {
      success: false,
      error: { message: `Estado inválido. Debe ser: ${estadosValidos.join(', ')}` }
    };
  }

  return actualizarCliente(id, { Cli_Estado: nuevoEstado });
}

// ============================================
// DELETE - Eliminar cliente (soft delete)
// ============================================

/**
 * Desactiva un cliente (soft delete)
 * No elimina físicamente el registro, solo cambia el estado a 'Inactivo'
 *
 * @param {number} id - ID del cliente
 * @returns {Promise<Object>} Resultado de la operación
 */
export async function desactivarCliente(id) {
  return cambiarEstadoCliente(id, 'Inactivo');
}

/**
 * Elimina permanentemente un cliente (hard delete)
 * ⚠️ PRECAUCIÓN: Esta operación no se puede deshacer
 *
 * @param {number} id - ID del cliente
 * @returns {Promise<Object>} Resultado de la operación
 */
export async function eliminarClientePermanente(id) {
  try {
    const { error } = await supabase
      .from('Clientes')
      .delete()
      .eq('id_Clientes', id);

    if (error) {
      console.error('❌ Error al eliminar cliente:', error.message);
      return { success: false, error };
    }

    console.log('✅ Cliente eliminado permanentemente');
    return { success: true };

  } catch (err) {
    console.error('❌ Error inesperado:', err.message);
    return { success: false, error: err };
  }
}

// ============================================
// OPERACIONES AVANZADAS
// ============================================

/**
 * Obtiene estadísticas de clientes
 *
 * @returns {Promise<Object>} Estadísticas de clientes
 */
export async function obtenerEstadisticasClientes() {
  try {
    // Total de clientes
    const { count: total, error: errorTotal } = await supabase
      .from('Clientes')
      .select('*', { count: 'exact', head: true });

    // Clientes activos
    const { count: activos, error: errorActivos } = await supabase
      .from('Clientes')
      .select('*', { count: 'exact', head: true })
      .eq('Cli_Estado', 'Activo');

    // Clientes por tipo
    const { data: porTipo, error: errorTipo } = await supabase
      .from('Clientes')
      .select('id_TipoCliente_Fk, TipoCliente(TpCli_Nombre)')
      .eq('Cli_Estado', 'Activo');

    if (errorTotal || errorActivos || errorTipo) {
      console.error('❌ Error al obtener estadísticas');
      return { success: false };
    }

    const estadisticas = {
      total,
      activos,
      inactivos: total - activos,
      porTipo: {}
    };

    // Contar por tipo
    porTipo.forEach(cliente => {
      const tipo = cliente.TipoCliente?.TpCli_Nombre || 'Sin tipo';
      estadisticas.porTipo[tipo] = (estadisticas.porTipo[tipo] || 0) + 1;
    });

    console.log('✅ Estadísticas obtenidas:', estadisticas);
    return { success: true, data: estadisticas };

  } catch (err) {
    console.error('❌ Error inesperado:', err.message);
    return { success: false, error: err };
  }
}

/**
 * Obtiene clientes con paginación
 *
 * @param {number} pagina - Número de página (empezando en 1)
 * @param {number} porPagina - Cantidad de registros por página
 * @returns {Promise<Object>} Clientes paginados
 */
export async function obtenerClientesPaginados(pagina = 1, porPagina = 10) {
  try {
    const inicio = (pagina - 1) * porPagina;
    const fin = inicio + porPagina - 1;

    const { data, error, count } = await supabase
      .from('Clientes')
      .select('*', { count: 'exact' })
      .eq('Cli_Estado', 'Activo')
      .order('Cli_FechaRegistro', { ascending: false })
      .range(inicio, fin);

    if (error) {
      console.error('❌ Error al obtener clientes:', error.message);
      return { success: false, error };
    }

    const totalPaginas = Math.ceil(count / porPagina);

    console.log(`✅ Página ${pagina} de ${totalPaginas} (${data.length} registros)`);
    return {
      success: true,
      data,
      paginacion: {
        paginaActual: pagina,
        totalPaginas,
        totalRegistros: count,
        porPagina
      }
    };

  } catch (err) {
    console.error('❌ Error inesperado:', err.message);
    return { success: false, error: err };
  }
}

// ============================================
// EXPORTAR TODAS LAS FUNCIONES
// ============================================

export default {
  crearCliente,
  obtenerClientesActivos,
  obtenerClientePorId,
  buscarClientesPorEmail,
  actualizarCliente,
  cambiarEstadoCliente,
  desactivarCliente,
  eliminarClientePermanente,
  obtenerEstadisticasClientes,
  obtenerClientesPaginados
};
