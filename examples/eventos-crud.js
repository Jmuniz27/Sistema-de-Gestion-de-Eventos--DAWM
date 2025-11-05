/**
 * Ejemplos de operaciones CRUD para el módulo Eventos
 *
 * Este archivo demuestra cómo realizar operaciones básicas
 * para el manejo de eventos y boletos.
 *
 * @module examples/eventos-crud
 */

import { supabase } from '../lib/supabase.js';

// ============================================
// CREATE - Crear eventos
// ============================================

/**
 * Crea un nuevo evento
 *
 * @param {Object} eventoData - Datos del evento
 * @returns {Promise<Object>} Evento creado o error
 */
export async function crearEvento(eventoData) {
  try {
    const { data, error } = await supabase
      .from('Eventos')
      .insert([
        {
          Evt_Nombre: eventoData.nombre,
          Evt_Descripcion: eventoData.descripcion,
          Evt_FechaInicio: eventoData.fechaInicio,
          Evt_FechaFin: eventoData.fechaFin,
          Evt_Lugar: eventoData.lugar,
          Evt_Direccion: eventoData.direccion,
          id_Ciudades_Fk: eventoData.ciudad,
          Evt_CapacidadTotal: eventoData.capacidadTotal,
          Evt_CapacidadDisponible: eventoData.capacidadTotal, // Inicialmente igual a la total
          Evt_ImagenURL: eventoData.imagenURL || null,
          Evt_PrecioBaseGeneral: eventoData.precioBase,
          id_CategoriaEvento_Fk: eventoData.categoria,
          id_TipoIngreso_Fk: eventoData.tipoIngreso,
          id_Proveedores_Fk: eventoData.proveedor || null,
          Evt_Estado: 'Programado'
        }
      ])
      .select();

    if (error) {
      console.error('❌ Error al crear evento:', error.message);
      return { success: false, error };
    }

    console.log('✅ Evento creado exitosamente:', data[0]);
    return { success: true, data: data[0] };

  } catch (err) {
    console.error('❌ Error inesperado:', err.message);
    return { success: false, error: err };
  }
}

// ============================================
// READ - Consultar eventos
// ============================================

/**
 * Obtiene eventos próximos (programados y en curso)
 *
 * @param {number} limite - Cantidad máxima de eventos a retornar
 * @returns {Promise<Array>} Lista de eventos
 */
export async function obtenerEventosProximos(limite = 20) {
  try {
    const ahora = new Date().toISOString();

    const { data, error } = await supabase
      .from('Eventos')
      .select(`
        id_Eventos,
        Evt_Nombre,
        Evt_Descripcion,
        Evt_FechaInicio,
        Evt_FechaFin,
        Evt_Lugar,
        Evt_Direccion,
        Evt_CapacidadTotal,
        Evt_CapacidadDisponible,
        Evt_ImagenURL,
        Evt_PrecioBaseGeneral,
        Evt_Estado,
        Ciudades (Ciu_Nombre, Provincias (Prov_Nombre)),
        CategoriaEvento (CatEvt_Nombre, CatEvt_Descripcion),
        TipoIngreso (TIng_Nombre)
      `)
      .gte('Evt_FechaInicio', ahora)
      .in('Evt_Estado', ['Programado', 'EnCurso'])
      .order('Evt_FechaInicio', { ascending: true })
      .limit(limite);

    if (error) {
      console.error('❌ Error al obtener eventos:', error.message);
      return { success: false, error };
    }

    console.log(`✅ ${data.length} eventos próximos encontrados`);
    return { success: true, data };

  } catch (err) {
    console.error('❌ Error inesperado:', err.message);
    return { success: false, error: err };
  }
}

/**
 * Busca eventos por nombre o descripción
 *
 * @param {string} termino - Término de búsqueda
 * @returns {Promise<Array>} Eventos que coinciden con la búsqueda
 */
export async function buscarEventos(termino) {
  try {
    const { data, error } = await supabase
      .from('Eventos')
      .select(`
        id_Eventos,
        Evt_Nombre,
        Evt_Descripcion,
        Evt_FechaInicio,
        Evt_Lugar,
        Evt_PrecioBaseGeneral,
        Evt_Estado,
        CategoriaEvento (CatEvt_Nombre)
      `)
      .or(`Evt_Nombre.ilike.%${termino}%,Evt_Descripcion.ilike.%${termino}%`)
      .limit(10);

    if (error) {
      console.error('❌ Error en búsqueda:', error.message);
      return { success: false, error };
    }

    console.log(`✅ ${data.length} eventos encontrados`);
    return { success: true, data };

  } catch (err) {
    console.error('❌ Error inesperado:', err.message);
    return { success: false, error: err };
  }
}

/**
 * Obtiene eventos por categoría
 *
 * @param {number} categoriaId - ID de la categoría
 * @returns {Promise<Array>} Eventos de la categoría
 */
export async function obtenerEventosPorCategoria(categoriaId) {
  try {
    const { data, error } = await supabase
      .from('Eventos')
      .select(`
        *,
        CategoriaEvento (CatEvt_Nombre),
        Ciudades (Ciu_Nombre)
      `)
      .eq('id_CategoriaEvento_Fk', categoriaId)
      .eq('Evt_Estado', 'Programado')
      .order('Evt_FechaInicio', { ascending: true });

    if (error) {
      console.error('❌ Error al obtener eventos:', error.message);
      return { success: false, error };
    }

    console.log(`✅ ${data.length} eventos encontrados en esta categoría`);
    return { success: true, data };

  } catch (err) {
    console.error('❌ Error inesperado:', err.message);
    return { success: false, error: err };
  }
}

/**
 * Obtiene detalles completos de un evento por ID
 *
 * @param {number} id - ID del evento
 * @returns {Promise<Object>} Detalles del evento
 */
export async function obtenerDetallesEvento(id) {
  try {
    const { data, error } = await supabase
      .from('Eventos')
      .select(`
        *,
        Ciudades (
          Ciu_Nombre,
          Provincias (Prov_Nombre)
        ),
        CategoriaEvento (CatEvt_Nombre, CatEvt_Descripcion, CatEvt_Color),
        TipoIngreso (TIng_Nombre, TIng_Descripcion),
        Proveedores (Prov_Nombre, Prov_Telefono, Prov_Email)
      `)
      .eq('id_Eventos', id)
      .single();

    if (error) {
      console.error('❌ Error al obtener evento:', error.message);
      return { success: false, error };
    }

    console.log('✅ Detalles del evento obtenidos');
    return { success: true, data };

  } catch (err) {
    console.error('❌ Error inesperado:', err.message);
    return { success: false, error: err };
  }
}

// ============================================
// UPDATE - Actualizar eventos
// ============================================

/**
 * Actualiza información de un evento
 *
 * @param {number} id - ID del evento
 * @param {Object} updates - Campos a actualizar
 * @returns {Promise<Object>} Evento actualizado
 */
export async function actualizarEvento(id, updates) {
  try {
    updates.Evt_FechaUltimaModificacion = new Date().toISOString();

    const { data, error } = await supabase
      .from('Eventos')
      .update(updates)
      .eq('id_Eventos', id)
      .select();

    if (error) {
      console.error('❌ Error al actualizar evento:', error.message);
      return { success: false, error };
    }

    console.log('✅ Evento actualizado exitosamente');
    return { success: true, data: data[0] };

  } catch (err) {
    console.error('❌ Error inesperado:', err.message);
    return { success: false, error: err };
  }
}

/**
 * Reduce la capacidad disponible al vender un boleto
 *
 * @param {number} eventoId - ID del evento
 * @param {number} cantidad - Cantidad de boletos vendidos
 * @returns {Promise<Object>} Resultado de la operación
 */
export async function reducirCapacidadDisponible(eventoId, cantidad = 1) {
  try {
    // Primero obtenemos la capacidad actual
    const { data: evento, error: errorEvento } = await supabase
      .from('Eventos')
      .select('Evt_CapacidadDisponible')
      .eq('id_Eventos', eventoId)
      .single();

    if (errorEvento) {
      return { success: false, error: errorEvento };
    }

    const nuevaCapacidad = evento.Evt_CapacidadDisponible - cantidad;

    if (nuevaCapacidad < 0) {
      return {
        success: false,
        error: { message: 'No hay suficiente capacidad disponible' }
      };
    }

    // Actualizamos la capacidad
    const { data, error } = await supabase
      .from('Eventos')
      .update({ Evt_CapacidadDisponible: nuevaCapacidad })
      .eq('id_Eventos', eventoId)
      .select();

    if (error) {
      console.error('❌ Error al actualizar capacidad:', error.message);
      return { success: false, error };
    }

    console.log(`✅ Capacidad reducida. Disponible: ${nuevaCapacidad}`);
    return { success: true, data: data[0] };

  } catch (err) {
    console.error('❌ Error inesperado:', err.message);
    return { success: false, error: err };
  }
}

// ============================================
// OPERACIONES CON BOLETOS
// ============================================

/**
 * Crea un nuevo boleto para un evento
 *
 * @param {Object} boletoData - Datos del boleto
 * @returns {Promise<Object>} Boleto creado
 */
export async function crearBoleto(boletoData) {
  try {
    const { data, error } = await supabase
      .from('Boletos')
      .insert([
        {
          id_Eventos_Fk: boletoData.eventoId,
          id_Clientes_Fk: boletoData.clienteId,
          Bol_FechaCompra: new Date().toISOString(),
          Bol_Precio: boletoData.precio,
          Bol_NumeroAsiento: boletoData.numeroAsiento || null,
          id_TipoEntrada_Fk: boletoData.tipoEntrada,
          Bol_CodigoQR: boletoData.codigoQR || `QR-${Date.now()}`,
          Bol_Estado: 'Activo'
        }
      ])
      .select(`
        *,
        Eventos (Evt_Nombre, Evt_FechaInicio, Evt_Lugar),
        Clientes (Cli_Nombre, Cli_Apellido, Cli_Email),
        TipoEntrada (TEnt_Nombre)
      `);

    if (error) {
      console.error('❌ Error al crear boleto:', error.message);
      return { success: false, error };
    }

    // Reducir capacidad disponible del evento
    await reducirCapacidadDisponible(boletoData.eventoId, 1);

    console.log('✅ Boleto creado exitosamente');
    return { success: true, data: data[0] };

  } catch (err) {
    console.error('❌ Error inesperado:', err.message);
    return { success: false, error: err };
  }
}

/**
 * Obtiene boletos de un cliente
 *
 * @param {number} clienteId - ID del cliente
 * @returns {Promise<Array>} Lista de boletos del cliente
 */
export async function obtenerBoletosCliente(clienteId) {
  try {
    const { data, error } = await supabase
      .from('Boletos')
      .select(`
        *,
        Eventos (
          Evt_Nombre,
          Evt_FechaInicio,
          Evt_Lugar,
          Evt_Direccion,
          Evt_ImagenURL
        ),
        TipoEntrada (TEnt_Nombre, TEnt_Descripcion)
      `)
      .eq('id_Clientes_Fk', clienteId)
      .order('Bol_FechaCompra', { ascending: false });

    if (error) {
      console.error('❌ Error al obtener boletos:', error.message);
      return { success: false, error };
    }

    console.log(`✅ ${data.length} boletos encontrados`);
    return { success: true, data };

  } catch (err) {
    console.error('❌ Error inesperado:', err.message);
    return { success: false, error: err };
  }
}

/**
 * Verifica un boleto por código QR
 *
 * @param {string} codigoQR - Código QR del boleto
 * @returns {Promise<Object>} Datos del boleto
 */
export async function verificarBoleto(codigoQR) {
  try {
    const { data, error } = await supabase
      .from('Boletos')
      .select(`
        *,
        Eventos (Evt_Nombre, Evt_FechaInicio),
        Clientes (Cli_Nombre, Cli_Apellido),
        TipoEntrada (TEnt_Nombre)
      `)
      .eq('Bol_CodigoQR', codigoQR)
      .single();

    if (error) {
      console.error('❌ Boleto no encontrado');
      return { success: false, error };
    }

    if (data.Bol_Estado === 'Usado') {
      console.log('⚠️ Advertencia: Este boleto ya fue usado');
      return {
        success: false,
        error: { message: 'Boleto ya fue usado anteriormente' },
        data
      };
    }

    console.log('✅ Boleto válido');
    return { success: true, data };

  } catch (err) {
    console.error('❌ Error inesperado:', err.message);
    return { success: false, error: err };
  }
}

/**
 * Marca un boleto como usado
 *
 * @param {number} boletoId - ID del boleto
 * @returns {Promise<Object>} Boleto actualizado
 */
export async function marcarBoletoComoUsado(boletoId) {
  try {
    const { data, error } = await supabase
      .from('Boletos')
      .update({
        Bol_Estado: 'Usado',
        Bol_FechaUltimaModificacion: new Date().toISOString()
      })
      .eq('id_Boletos', boletoId)
      .select();

    if (error) {
      console.error('❌ Error al marcar boleto:', error.message);
      return { success: false, error };
    }

    console.log('✅ Boleto marcado como usado');
    return { success: true, data: data[0] };

  } catch (err) {
    console.error('❌ Error inesperado:', err.message);
    return { success: false, error: err };
  }
}

// ============================================
// ESTADÍSTICAS
// ============================================

/**
 * Obtiene estadísticas de un evento
 *
 * @param {number} eventoId - ID del evento
 * @returns {Promise<Object>} Estadísticas del evento
 */
export async function obtenerEstadisticasEvento(eventoId) {
  try {
    // Obtener evento
    const { data: evento, error: errorEvento } = await supabase
      .from('Eventos')
      .select('Evt_Nombre, Evt_CapacidadTotal, Evt_CapacidadDisponible')
      .eq('id_Eventos', eventoId)
      .single();

    // Contar boletos vendidos
    const { count: boletosVendidos, error: errorBoletos } = await supabase
      .from('Boletos')
      .select('*', { count: 'exact', head: true })
      .eq('id_Eventos_Fk', eventoId);

    // Calcular ingresos
    const { data: boletos, error: errorIngresos } = await supabase
      .from('Boletos')
      .select('Bol_Precio')
      .eq('id_Eventos_Fk', eventoId);

    if (errorEvento || errorBoletos || errorIngresos) {
      console.error('❌ Error al obtener estadísticas');
      return { success: false };
    }

    const ingresosTotales = boletos.reduce((sum, b) => sum + parseFloat(b.Bol_Precio), 0);
    const porcentajeOcupacion = ((boletosVendidos / evento.Evt_CapacidadTotal) * 100).toFixed(2);

    const estadisticas = {
      evento: evento.Evt_Nombre,
      capacidadTotal: evento.Evt_CapacidadTotal,
      capacidadDisponible: evento.Evt_CapacidadDisponible,
      boletosVendidos,
      porcentajeOcupacion: `${porcentajeOcupacion}%`,
      ingresosTotales: `$${ingresosTotales.toFixed(2)}`
    };

    console.log('✅ Estadísticas obtenidas:', estadisticas);
    return { success: true, data: estadisticas };

  } catch (err) {
    console.error('❌ Error inesperado:', err.message);
    return { success: false, error: err };
  }
}

export default {
  crearEvento,
  obtenerEventosProximos,
  buscarEventos,
  obtenerEventosPorCategoria,
  obtenerDetallesEvento,
  actualizarEvento,
  reducirCapacidadDisponible,
  crearBoleto,
  obtenerBoletosCliente,
  verificarBoleto,
  marcarBoletoComoUsado,
  obtenerEstadisticasEvento
};
