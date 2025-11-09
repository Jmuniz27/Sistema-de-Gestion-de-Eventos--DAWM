/**
 * ============================================
 * MÓDULO: CRUD de Notificaciones
 * ============================================
 * Archivo: src/scripts/modules/notificaciones/notificaciones_crud.js
 * Responsable: ARMIJOS ROMERO ERICK DANILO
 * 
 * Descripción: Operaciones de base de datos para la tabla Notificaciones
 * 
 * Tablas: Notificaciones, Destinatarios, Plantillas
 * 
 * Funcionalidades:
 * - create: Crear notificación
 * - getAll: Obtener todas las notificaciones (con opciones de filtro)
 * - getById: Obtener notificación por ID
 * - getByEstado: Filtrar por estado
 * - getByTipo: Filtrar por tipo de envío
 * - getByCliente: Filtrar por cliente autenticado (NUEVO)
 * - update: Actualizar notificación
 * - delete: Eliminar notificación
 * - incrementarIntentos: Incrementar contador de intentos de envío
 * - marcarComoEnviado: Cambiar estado a "Enviado"
 * 
 * Fecha creación: Octubre 2024
 * Última modificación: Noviembre 2024 (agregado getByCliente)
 * ============================================
 */

import { supabase } from '../../supabase-client.js'

const NotificacionesCRUD = {
  
  /**
   * ============================================
   * CREATE - CREAR NOTIFICACIÓN
   * ============================================
   * Inserta una nueva notificación en la base de datos
   * 
   * @param {Object} notificacionData - Datos de la notificación a crear
   * @param {string} notificacionData.Not_Modulo - Módulo de la notificación
   * @param {string} notificacionData.Not_Descripcion - Descripción de la notificación
   * @param {string} notificacionData.Not_Asunto - Asunto del mensaje
   * @param {string} notificacionData.Not_Mensaje - Contenido del mensaje
   * @param {string} notificacionData.Not_TipoEnvio - Tipo de envío (Email, Push, SMS)
   * @param {number} notificacionData.id_Plantillas_Fk - ID de la plantilla utilizada
   * @param {string} notificacionData.Not_FechaProgramada - Fecha programada de envío
   * @returns {Promise<Object>} Resultado de la operación {data, error}
   */
  async create(notificacionData) {
    try {
      // Normalizar los nombres de las propiedades a minúsculas (como están en la BD)
      const payload = {
        not_asunto: notificacionData.not_asunto ?? notificacionData.Not_Asunto ?? '',
        not_mensaje: notificacionData.not_mensaje ?? notificacionData.Not_Mensaje ?? '',
        not_tipo: notificacionData.not_tipo ?? notificacionData.Not_TipoEnvio ?? notificacionData.Not_Tipo ?? 'Push',
        id_plantillas_fk: notificacionData.id_plantillas_fk ?? notificacionData.id_Plantillas_Fk ?? null,
        not_fechaprogramada: notificacionData.not_fechaprogramada ?? notificacionData.Not_FechaProgramada ?? new Date().toISOString(),
        not_estado: notificacionData.not_estado ?? notificacionData.Not_Estado ?? 'Pendiente',
        not_intentosenvio: notificacionData.not_intentosenvio ?? notificacionData.Not_IntentosEnvio ?? notificacionData.Not_NumIntentos ?? 0
      };

      // Agregar campos opcionales solo si existen
      if (notificacionData.not_modulo || notificacionData.Not_Modulo) {
        payload.not_modulo = notificacionData.not_modulo ?? notificacionData.Not_Modulo;
      }
      if (notificacionData.not_fechaenvio || notificacionData.Not_FechaEnvio) {
        payload.not_fechaenvio = notificacionData.not_fechaenvio ?? notificacionData.Not_FechaEnvio;
      }
      if (notificacionData.id_cliente_fk || notificacionData.id_Cliente_Fk) {
        payload.id_cliente_fk = notificacionData.id_cliente_fk ?? notificacionData.id_Cliente_Fk;
      }
      if (notificacionData.id_boleto_fk || notificacionData.id_Boleto_Fk) {
        payload.id_boleto_fk = notificacionData.id_boleto_fk ?? notificacionData.id_Boleto_Fk;
      }
      if (notificacionData.id_factura_fk || notificacionData.id_Factura_Fk) {
        payload.id_factura_fk = notificacionData.id_factura_fk ?? notificacionData.id_Factura_Fk;
      }

      console.log('📤 Creando notificación con payload:', payload);
      
      const { data, error } = await supabase
        .from('notificaciones')
        .insert([payload])
        .select();

      console.log('✅ Resultado de la creación:', { data, error });
      return { data, error };
    } catch (err) {
      console.error('Error al crear notificación:', err);
      return { data: null, error: err };
    }
  }, // Finaliza la definición del método create dentro del objeto CRUD.
  
  /**
   * ============================================
   * READ - LEER TODAS LAS NOTIFICACIONES
   * ============================================
   * Obtiene todas las notificaciones de la base de datos
   * ordenadas por fecha programada descendente
   * 
   * @returns {Promise<Object>} Resultado de la operación {data, error}
   */
  async getAll(options = {}) {
    // Permite personalizar orden, límite y columnas según la vista consumidora
    try {
      const {
        orderBy = 'not_fechaprogramada',
        ascending = false,
        limit,
        select = '*'
      } = options;

      let query = supabase
        .from('notificaciones')
        .select(select);

      if (orderBy) {
        // Orden configurable con fallback a fecha programada
        query = query.order(orderBy, { ascending });
      }

      if (typeof limit === 'number') {
        // Limita resultados cuando la vista solo necesita un subconjunto
        query = query.limit(limit);
      }

      const { data, error } = await query;
      
      return { data, error };
    } catch (err) {
      console.error('Error al obtener notificaciones:', err);
      return { data: null, error: err };
    }
  },
  
  /**
   * ============================================
   * READ - LEER NOTIFICACIÓN POR ID
   * ============================================
   * Obtiene una notificación específica por su ID
   * 
   * @param {number} id - ID de la notificación
   * @returns {Promise<Object>} Resultado de la operación {data, error}
   */
  async getById(id) {
    try {
      console.log('🔍 Consultando notificación ID:', id);
      
      const { data, error } = await supabase
        .from('notificaciones')
        .select('*')
        .eq('id_notificaciones', id);
      
      const result = data && data.length > 0 ? data[0] : null;
      console.log('📋 Notificación encontrada:', result);
      
      return { 
        data: result, 
        error 
      };
    } catch (err) {
      console.error('Error al obtener notificación por ID:', err);
      return { data: null, error: err };
    }
  },
  
  /**
   * ============================================
   * READ - LEER NOTIFICACIONES POR ESTADO
   * ============================================
   * Obtiene notificaciones filtradas por estado
   * 
   * @param {string} estado - Estado de las notificaciones (Enviado, Programado, etc.)
   * @returns {Promise<Object>} Resultado de la operación {data, error}
   */
  async getByEstado(estado) {
    try {
      const { data, error } = await supabase
        .from('notificaciones')
        .select('*')
        .eq('not_estado', estado)
        .order('not_fechaprogramada', { ascending: false });
      
      return { data, error };
    } catch (err) {
      console.error('Error al obtener notificaciones por estado:', err);
      return { data: null, error: err };
    }
  },
  
  /**
   * ============================================
   * READ - LEER NOTIFICACIONES POR TIPO
   * ============================================
   * Obtiene notificaciones filtradas por tipo de envío
   * 
   * @param {string} tipo - Tipo de envío (Email, Push, SMS)
   * @returns {Promise<Object>} Resultado de la operación {data, error}
   */
  async getByTipo(tipo) {
    try {
      const { data, error } = await supabase
        .from('notificaciones')
        .select('*')
        .eq('not_tipo', tipo)
        .order('not_fechaprogramada', { ascending: false });
      
      return { data, error };
    } catch (err) {
      console.error('Error al obtener notificaciones por tipo:', err);
      return { data: null, error: err };
    }
  },
  
  /**
   * ============================================
   * READ - LEER NOTIFICACIONES POR CLIENTE
   * ============================================
   * Obtiene notificaciones específicas de un cliente
   * Incluye notificaciones directamente asignadas y aquellas
   * que tienen al cliente como destinatario
   * 
   * @param {number} clienteId - ID del cliente
   * @returns {Promise<Object>} Resultado de la operación {data, error}
   */
  async getByCliente(clienteId) {
    try {
      console.log('🔍 Consultando notificaciones del cliente ID:', clienteId);

      const [destinatariosResult, directResult] = await Promise.all([
        supabase
          .from('destinatarios')
          .select(`
            id_destinatario,
            dest_estado,
            dest_fechaenvio,
            dest_fechalectura,
            notificaciones (*)
          `)
          .eq('id_clientes_fk', clienteId)
          .order('not_fechaprogramada', { ascending: false, foreignTable: 'notificaciones' }),
        supabase
          .from('notificaciones')
          .select('*')
          .eq('id_cliente_fk', clienteId)
          .order('not_fechaprogramada', { ascending: false })
      ]);

      if (destinatariosResult.error) {
        console.error('Error al obtener destinatarios del cliente:', destinatariosResult.error);
        return { data: null, error: destinatariosResult.error };
      }

      if (directResult.error) {
        console.error('Error al obtener notificaciones directas del cliente:', directResult.error);
        return { data: null, error: directResult.error };
      }

      const notificationsMap = new Map();

      (destinatariosResult.data ?? []).forEach(row => {
        const notif = row?.notificaciones;
        if (!notif) return;

        const notifId = notif.id_notificaciones ?? notif.id_Notificaciones;
        notificationsMap.set(notifId, {
          ...notif,
          destinatario: {
            id_destinatario: row.id_destinatario,
            dest_estado: row.dest_estado,
            dest_fechaenvio: row.dest_fechaenvio,
            dest_fechalectura: row.dest_fechalectura
          }
        });
      });

      (directResult.data ?? []).forEach(notif => {
        const notifId = notif.id_notificaciones ?? notif.id_Notificaciones;
        if (!notificationsMap.has(notifId)) {
          notificationsMap.set(notifId, notif);
        }
      });

      const mergedNotifications = Array.from(notificationsMap.values()).sort((a, b) => {
        const dateA = new Date(a.not_fechaprogramada ?? a.Not_FechaProgramada ?? 0).getTime();
        const dateB = new Date(b.not_fechaprogramada ?? b.Not_FechaProgramada ?? 0).getTime();
        return dateB - dateA;
      });

      console.log('📋 Notificaciones del cliente encontradas:', mergedNotifications.length);

      return { data: mergedNotifications, error: null };
    } catch (err) {
      console.error('Error al obtener notificaciones del cliente:', err);
      return { data: null, error: err };
    }
  },
  
  /**
   * ============================================
   * UPDATE - ACTUALIZAR NOTIFICACIÓN
   * ============================================
   * Actualiza los datos de una notificación existente
   * 
   * @param {number} id - ID de la notificación a actualizar
   * @param {Object} updates - Objeto con los campos a actualizar
   * @returns {Promise<Object>} Resultado de la operación {data, error}
   */
  async update(id, updates) {
    try {
      console.log('📝 Actualizando notificación ID:', id);
      console.log('📝 Con datos:', updates);
      
      // Mapear solo los campos que existen en la BD
      const mappedUpdates = {};
      if (updates.not_estado !== undefined) mappedUpdates.not_estado = updates.not_estado;
      if (updates.not_asunto !== undefined) mappedUpdates.not_asunto = updates.not_asunto;
      if (updates.not_mensaje !== undefined) mappedUpdates.not_mensaje = updates.not_mensaje;
      if (updates.not_tipo !== undefined) mappedUpdates.not_tipo = updates.not_tipo;
      if (updates.not_fechaprogramada !== undefined) mappedUpdates.not_fechaprogramada = updates.not_fechaprogramada;
      if (updates.not_fechaenvio !== undefined) mappedUpdates.not_fechaenvio = updates.not_fechaenvio;
      if (updates.not_intentosenvio !== undefined) mappedUpdates.not_intentosenvio = updates.not_intentosenvio;
      if (updates.id_plantillas_fk !== undefined) mappedUpdates.id_plantillas_fk = updates.id_plantillas_fk;
      
      console.log('📝 Datos mapeados:', mappedUpdates);
      
      const { data, error } = await supabase
        .from('notificaciones')
        .update(mappedUpdates)
        .eq('id_notificaciones', id)
        .select();
      
      console.log('✅ Resultado de la actualización:', { data, error });
      return { data, error };
    } catch (err) {
      console.error('Error al actualizar notificación:', err);
      return { data: null, error: err };
    }
  },
  
  /**
   * ============================================
   * UPDATE - CAMBIAR ESTADO DE NOTIFICACIÓN
   * ============================================
   * Actualiza solo el estado de una notificación
   * 
   * @param {number} id - ID de la notificación
   * @param {string} nuevoEstado - Nuevo estado a asignar
   * @returns {Promise<Object>} Resultado de la operación {data, error}
   */
  async updateEstado(id, nuevoEstado) {
    try {
      const { data, error } = await supabase
        .from('notificaciones')
        .update({ not_estado: nuevoEstado })
        .eq('id_notificaciones', id);
      
      return { data, error };
    } catch (err) {
      console.error('Error al actualizar estado de notificación:', err);
      return { data: null, error: err };
    }
  },
  
  /**
   * ============================================
   * UPDATE - INCREMENTAR INTENTOS
   * ============================================
   * Incrementa el número de intentos de envío de una notificación.
   * Útil para llevar control de reintentos en envíos fallidos.
   * 
   * @param {number} id - ID de la notificación
   * @returns {Promise<Object>} Resultado de la operación {data, error}
   * 
   * @example
   * const result = await NotificacionesCRUD.incrementarIntentos(1);
   * if (result.error) console.error(result.error);
   */
  async incrementarIntentos(id) {
    try {
      // Primero obtener el número actual de intentos
      const { data: notif, error: getError } = await this.getById(id);
      
      if (getError || !notif) {
        return { data: null, error: getError };
      }
      
      // Incrementar los intentos (usar lowercase para BD)
      const intentosActuales = notif.not_intentosenvio ?? notif.Not_IntentosEnvio ?? notif.Not_NumIntentos ?? 0;
      
      const { data, error } = await supabase
        .from('notificaciones')
        .update({ not_intentosenvio: intentosActuales + 1 })
        .eq('id_notificaciones', id)
        .select();
      
      return { data, error };
    } catch (err) {
      console.error('Error al incrementar intentos:', err);
      return { data: null, error: err };
    }
  },
  
  /**
   * ============================================
   * UPDATE - MARCAR COMO ENVIADO
   * ============================================
   * Marca una notificación como enviada y registra la fecha de envío actual.
   * Actualiza el estado a "Enviada" y establece not_fechaenvio.
   * 
   * @param {number} id - ID de la notificación
   * @returns {Promise<Object>} Resultado de la operación {data, error}
   * 
   * @example
   * const result = await NotificacionesCRUD.marcarComoEnviado(1);
   * if (result.error) console.error('Error al marcar como enviado');
   */
  async marcarComoEnviado(id) {
    try {
      const { data, error } = await supabase
        .from('notificaciones')
        .update({ 
          not_estado: 'Enviada',
          not_fechaenvio: new Date().toISOString()
        })
        .eq('id_notificaciones', id)
        .select();
      
      return { data, error };
    } catch (err) {
      console.error('Error al marcar como enviado:', err);
      return { data: null, error: err };
    }
  },
  
  /**
   * ============================================
   * UPDATE - REPROGRAMAR NOTIFICACIÓN
   * ============================================
   * Reprograma una notificación fallida o cancelada para un nuevo envío.
   * Cambia el estado a "Pendiente" y actualiza la fecha programada.
   * Útil para reintentar envíos fallidos.
   * 
   * @param {number} id - ID de la notificación
   * @param {string} nuevaFecha - Nueva fecha de programación (ISO string)
   * @returns {Promise<Object>} Resultado de la operación {data, error}
   * 
   * @example
   * const result = await NotificacionesCRUD.reprogramar(1, '2025-11-15T10:00:00Z');
   * if (result.success) console.log('Notificación reprogramada');
   */
  async reprogramar(id, nuevaFecha) {
    try {
      const { data, error } = await supabase
        .from('notificaciones')
        .update({ 
          not_estado: 'Pendiente',
          not_fechaprogramada: nuevaFecha || new Date().toISOString()
        })
        .eq('id_notificaciones', id)
        .select();
      
      return { data, error };
    } catch (err) {
      console.error('Error al reprogramar notificación:', err);
      return { data: null, error: err };
    }
  },
  
  /**
   * ============================================
   * DELETE - ELIMINAR NOTIFICACIÓN
   * ============================================
   * Elimina una notificación de la base de datos
   * 
   * @param {number} id - ID de la notificación a eliminar
   * @returns {Promise<Object>} Resultado de la operación {data, error}
   */
  async delete(id) {
    try {
      const { data, error } = await supabase
        .from('notificaciones')
        .delete()
        .eq('id_notificaciones', id);
      
      return { data, error };
    } catch (err) {
      console.error('Error al eliminar notificación:', err);
      return { data: null, error: err };
    }
  },
  
  /**
   * ============================================
   * DELETE - ELIMINAR NOTIFICACIONES ANTIGUAS
   * ============================================
   * Elimina notificaciones más antiguas que una fecha específica
   * 
   * @param {string} fechaLimite - Fecha límite en formato ISO
   * @returns {Promise<Object>} Resultado de la operación {data, error}
   */
  async deleteOlderThan(fechaLimite) {
    try {
      const { data: notificaciones, error: getError } = await this.getAll();
      
      if (getError || !notificaciones) {
        return { data: null, error: getError };
      }
      
      const idsToDelete = notificaciones
        .filter(n => new Date(n.Not_FechaProgramada) < new Date(fechaLimite))
        .map(n => n.id_Notificaciones);
      
      if (idsToDelete.length === 0) {
        return { data: [], error: null };
      }
      
      // Eliminar cada notificación
      const results = await Promise.all(
        idsToDelete.map(id => this.delete(id))
      );
      
      return { data: results, error: null };
    } catch (err) {
      console.error('Error al eliminar notificaciones antiguas:', err);
      return { data: null, error: err };
    }
  },

  /**
   * ============================================
   * PROCESAR NOTIFICACIONES PENDIENTES
   * ============================================
   * Procesa notificaciones pendientes y crea registros en Destinatarios.
   * 
   * Lógica:
   * - Si id_cliente_fk existe: Crea 1 destinatario (notificación específica)
   * - Si id_cliente_fk es null: Crea N destinatarios (notificación general a todos)
   * 
   * Esta función debe ejecutarse periódicamente (cron job o trigger).
   * 
   * @returns {Promise<Object>} Resultado del procesamiento
   */
  async procesarPendientes() {
    try {
      console.log('🚀 Procesando notificaciones pendientes...');
      
      // Obtener notificaciones pendientes que ya deben enviarse
      const { data: notificaciones, error } = await supabase
        .from('notificaciones')
        .select('*')
        .eq('not_estado', 'Pendiente')
        .lte('not_fechaprogramada', new Date().toISOString())
        .order('not_fechaprogramada', { ascending: true });

      if (error) {
        console.error('❌ Error al obtener pendientes:', error);
        return { success: false, error };
      }

      if (!notificaciones || notificaciones.length === 0) {
        console.log('✅ No hay notificaciones pendientes');
        return { success: true, processed: 0 };
      }

      console.log(`📋 Procesando ${notificaciones.length} notificación(es)...`);

      // Procesar cada una
      const resultados = await Promise.allSettled(
        notificaciones.map(n => this._procesarUna(n))
      );

      const exitosas = resultados.filter(r => r.status === 'fulfilled' && r.value.success).length;
      
      console.log(`✅ Completado: ${exitosas}/${notificaciones.length} exitosas`);

      return {
        success: true,
        processed: notificaciones.length,
        exitosas,
        fallidas: notificaciones.length - exitosas
      };

    } catch (err) {
      console.error('❌ Error en procesamiento:', err);
      return { success: false, error: err };
    }
  },

  /**
   * ============================================
   * PROCESAR UNA NOTIFICACIÓN
   * ============================================
   * Método interno para procesar una notificación individual.
   * 
   * @param {Object} notificacion - Notificación a procesar
   * @returns {Promise<Object>} Resultado
   * @private
   */
  async _procesarUna(notificacion) {
    const notId = notificacion.id_notificaciones;
    const clienteId = notificacion.id_cliente_fk;

    try {
      let destinatarios = [];

      // CASO 1: Notificación específica (tiene id_cliente_fk)
      if (clienteId) {
        console.log(`📌 #${notId} → Cliente #${clienteId}`);
        
        const { data: cliente, error } = await supabase
          .from('clientes')
          .select('id_clientes, cli_email, cli_celular')
          .eq('id_clientes', clienteId)
          .single();

        if (error || !cliente) {
          throw new Error(`Cliente #${clienteId} no encontrado`);
        }

        destinatarios = [{
          id_notificaciones_fk: notId,
          id_clientes_fk: cliente.id_clientes,
          dest_email: cliente.cli_email,
          dest_telefono: cliente.cli_celular,
          dest_estado: 'Pendiente'
        }];
      } 
      // CASO 2: Notificación general (sin cliente específico)
      else {
        console.log(`📢 #${notId} → Todos los clientes`);
        
        const { data: clientes, error } = await supabase
          .from('clientes')
          .select('id_clientes, cli_email, cli_celular');

        if (error) {
          throw new Error('Error obteniendo clientes: ' + error.message);
        }

        if (!clientes || clientes.length === 0) {
          throw new Error('No hay clientes en el sistema');
        }

        console.log(`   👥 ${clientes.length} cliente(s)`);

        destinatarios = clientes.map(c => ({
          id_notificaciones_fk: notId,
          id_clientes_fk: c.id_clientes,
          dest_email: c.cli_email,
          dest_telefono: c.cli_celular,
          dest_estado: 'Pendiente'
        }));
      }

      // Insertar destinatarios
      const { error: insertError } = await supabase
        .from('destinatarios')
        .insert(destinatarios);

      if (insertError) {
        throw new Error('Error insertando destinatarios: ' + insertError.message);
      }

      // Actualizar estado de notificación
      await supabase
        .from('notificaciones')
        .update({
          not_estado: 'Enviada',
          not_fechaenvio: new Date().toISOString(),
          not_intentosenvio: (notificacion.not_intentosenvio || 0) + 1
        })
        .eq('id_notificaciones', notId);

      console.log(`   ✅ #${notId} procesada (${destinatarios.length} destinatario(s))`);

      return { success: true, destinatariosCreados: destinatarios.length };

    } catch (error) {
      console.error(`   ❌ #${notId} falló:`, error.message);

      // Registrar error
      await supabase
        .from('notificaciones')
        .update({
          not_estado: 'Fallida',
          not_errormensaje: error.message,
          not_intentosenvio: (notificacion.not_intentosenvio || 0) + 1
        })
        .eq('id_notificaciones', notId);

      return { success: false, error: error.message };
    }
  }
};

// Exportar el objeto NotificacionesCRUD para ser usado en otros archivos
export { NotificacionesCRUD };