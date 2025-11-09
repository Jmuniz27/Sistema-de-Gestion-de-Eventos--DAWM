/**
 * ============================================
 * MÓDULO: NOTIFICACIONES (CRUD CONSOLIDADO)
 * ============================================
 * Responsable: ARMIJOS ROMERO ERICK DANILO
 * 
 * PROPÓSITO:
 * Este es el módulo BACKEND/CRUD que maneja TODAS las operaciones
 * de base de datos relacionadas con notificaciones.
 * 
 * FUNCIONALIDADES:
 * 1. NOTIFICACIONES CRUD: Crear, leer, actualizar, eliminar notificaciones
 * 2. PLANTILLAS CRUD: Gestión de plantillas de notificaciones
 * 3. DESTINATARIOS CRUD: Gestión de asignación de notificaciones a clientes
 * 4. ENVÍO DE EMAILS: Integración con servicio de correo
 * 
 * TABLAS RELACIONADAS:
 * - notificaciones: Almacena las notificaciones programadas
 * - plantillas: Templates reutilizables para notificaciones
 * - destinatarios: Relación entre notificaciones y clientes
 * 
 * USO:
 * Este módulo es importado por:
 * - js/notificaciones/notificaciones.js (Vista admin)
 * - js/clientes/notificaciones.js (Vista cliente)
 * - scripts/modules/notificaciones/enviar_page.js (Formulario)
 * - js/notificaciones/plantillas-manager.js (Gestión de plantillas)
 * ============================================
 */

import { supabase } from '../supabase-client.js';

// ==================== CONFIGURACIÓN ====================

const CONFIG = {
  MAX_RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 5000,
  BATCH_SIZE: 50
};

// ==================== NOTIFICACIONES CRUD ====================
/**
 * Operaciones CRUD para la tabla 'notificaciones'
 * Permite crear, leer, actualizar y eliminar notificaciones programadas
 */

/**
 * Crea una nueva notificación en la base de datos
 * @param {Object} notificacionData - Datos de la notificación
 * @returns {Promise<{data, error}>}
 */
export async function crearNotificacion(notificacionData) {
  const payload = {
    not_asunto: notificacionData.not_asunto ?? notificacionData.Not_Asunto ?? '',
    not_mensaje: notificacionData.not_mensaje ?? notificacionData.Not_Mensaje ?? '',
    not_tipo: notificacionData.not_tipo ?? notificacionData.Not_TipoEnvio ?? 'Push',
    id_plantillas_fk: notificacionData.id_plantillas_fk ?? notificacionData.id_Plantillas_Fk ?? null,
    not_fechaprogramada: notificacionData.not_fechaprogramada ?? notificacionData.Not_FechaProgramada ?? new Date().toISOString(),
    not_estado: notificacionData.not_estado ?? notificacionData.Not_Estado ?? 'Pendiente',
    not_intentosenvio: notificacionData.not_intentosenvio ?? 0
  };

  if (notificacionData.not_modulo) payload.not_modulo = notificacionData.not_modulo;
  if (notificacionData.id_cliente_fk) payload.id_cliente_fk = notificacionData.id_cliente_fk;
  if (notificacionData.id_boleto_fk) payload.id_boleto_fk = notificacionData.id_boleto_fk;
  if (notificacionData.id_factura_fk) payload.id_factura_fk = notificacionData.id_factura_fk;

  const { data, error } = await supabase
    .from('notificaciones')
    .insert([payload])
    .select();

  return { data, error };
}

export async function obtenerNotificaciones() {
  const { data, error } = await supabase
    .from('notificaciones')
    .select('*')
    .order('not_fechaprogramada', { ascending: false });

  return { data, error };
}

export async function obtenerNotificacionPorId(id) {
  const { data, error } = await supabase
    .from('notificaciones')
    .select('*')
    .eq('id_notificaciones', id)
    .single();

  return { data, error };
}

export async function obtenerNotificacionesPorEstado(estado) {
  const { data, error } = await supabase
    .from('notificaciones')
    .select('*')
    .eq('not_estado', estado)
    .order('not_fechaprogramada', { ascending: false });

  return { data, error };
}

export async function obtenerNotificacionesPorCliente(clienteId) {
  // Primero obtenemos los destinatarios (sin order para diagnosticar)
  const { data: destinatariosData, error: destError } = await supabase
    .from('destinatarios')
    .select('*')
    .eq('id_clientes_fk', clienteId);

  if (destError) {
    console.error('Error obteniendo destinatarios:', destError);
    return { data: null, error: destError };
  }

  if (!destinatariosData || destinatariosData.length === 0) {
    return { data: [], error: null };
  }

  // Luego obtenemos las notificaciones asociadas
  const notificacionIds = destinatariosData.map(d => d.id_notificaciones_fk);
  
  const { data: notificacionesData, error: notError } = await supabase
    .from('notificaciones')
    .select('*')
    .in('id_notificaciones', notificacionIds);

  if (notError) {
    console.error('Error obteniendo notificaciones:', notError);
    return { data: null, error: notError };
  }

  // Combinar y ordenar los datos manualmente
  // Mapear para que cada elemento tenga todos los campos de notificacion directamente
  const resultado = destinatariosData
    .map(dest => {
      const notif = notificacionesData.find(n => n.id_notificaciones === dest.id_notificaciones_fk);
      return {
        // Campos de notificacion (minúsculas porque Supabase devuelve así)
        id_notificaciones: notif?.id_notificaciones,
        not_asunto: notif?.not_asunto,
        not_mensaje: notif?.not_mensaje,
        not_tipo: notif?.not_tipo,
        not_estado: notif?.not_estado,
        not_fechacreacion: notif?.not_fechacreacion,
        not_fechaenvio: notif?.not_fechaenvio,
        not_fechaprogramada: notif?.not_fechaprogramada,
        not_intentosenvio: notif?.not_intentosenvio,
        id_plantillas_fk: notif?.id_plantillas_fk,
        // Campos de destinatario
        id_destinatarios: dest.id_destinatarios,
        id_clientes_fk: dest.id_clientes_fk,
        id_notificaciones_fk: dest.id_notificaciones_fk,
        des_estado: dest.des_estado,
        des_fechaenvio: dest.des_fechaenvio
      };
    })
    .sort((a, b) => b.id_destinatarios - a.id_destinatarios);

  return { data: resultado, error: null };
}

export async function actualizarNotificacion(id, updates) {
  const payload = {};
  
  if (updates.not_asunto !== undefined) payload.not_asunto = updates.not_asunto;
  if (updates.not_mensaje !== undefined) payload.not_mensaje = updates.not_mensaje;
  if (updates.not_tipo !== undefined) payload.not_tipo = updates.not_tipo;
  if (updates.not_estado !== undefined) payload.not_estado = updates.not_estado;
  if (updates.not_fechaprogramada !== undefined) payload.not_fechaprogramada = updates.not_fechaprogramada;
  if (updates.not_intentosenvio !== undefined) payload.not_intentosenvio = updates.not_intentosenvio;
  if (updates.id_plantillas_fk !== undefined) payload.id_plantillas_fk = updates.id_plantillas_fk;

  const { data, error } = await supabase
    .from('notificaciones')
    .update(payload)
    .eq('id_notificaciones', id)
    .select();

  return { data, error };
}

export async function eliminarNotificacion(id) {
  const { error } = await supabase
    .from('notificaciones')
    .delete()
    .eq('id_notificaciones', id);

  return { error };
}

export async function marcarComoEnviada(id) {
  return actualizarNotificacion(id, {
    not_estado: 'Enviada',
    not_fechaenvio: new Date().toISOString()
  });
}

// ==================== PLANTILLAS CRUD ====================

export async function crearPlantilla(plantillaData) {
  const payload = {
    pla_nombre: plantillaData.pla_nombre ?? plantillaData.Pla_Nombre ?? '',
    pla_asunto: plantillaData.pla_asunto ?? plantillaData.Pla_Asunto ?? null,
    pla_contenido: plantillaData.pla_contenido ?? plantillaData.Pla_Contenido ?? null,
    pla_tipo: plantillaData.pla_tipo ?? plantillaData.Pla_Tipo ?? null,
    pla_estado: plantillaData.pla_estado ?? plantillaData.Pla_Estado ?? 'Activo'
  };

  const { data, error } = await supabase
    .from('plantillas')
    .insert([payload])
    .select();

  return { data, error };
}

export async function obtenerPlantillas() {
  const { data, error } = await supabase
    .from('plantillas')
    .select('*')
    .order('id_plantillas', { ascending: false });

  return { data, error };
}

export async function obtenerPlantillaPorId(id) {
  const { data, error } = await supabase
    .from('plantillas')
    .select('*')
    .eq('id_plantillas', id)
    .single();

  return { data, error };
}

export async function obtenerPlantillasActivas() {
  const { data, error } = await supabase
    .from('plantillas')
    .select('*')
    .eq('pla_estado', 'Activo')
    .order('pla_nombre');

  return { data, error };
}

export async function actualizarPlantilla(id, updates) {
  const payload = {};
  
  if (updates.pla_nombre !== undefined) payload.pla_nombre = updates.pla_nombre;
  if (updates.pla_asunto !== undefined) payload.pla_asunto = updates.pla_asunto;
  if (updates.pla_contenido !== undefined) payload.pla_contenido = updates.pla_contenido;
  if (updates.pla_tipo !== undefined) payload.pla_tipo = updates.pla_tipo;
  if (updates.pla_estado !== undefined) payload.pla_estado = updates.pla_estado;

  const { data, error } = await supabase
    .from('plantillas')
    .update(payload)
    .eq('id_plantillas', id)
    .select();

  return { data, error };
}

export async function eliminarPlantilla(id) {
  const { error } = await supabase
    .from('plantillas')
    .delete()
    .eq('id_plantillas', id);

  return { error };
}

// ==================== DESTINATARIOS ====================

export async function crearDestinatario(destinatarioData) {
  const payload = {
    id_notificaciones_fk: destinatarioData.id_notificacion_fk,
    id_clientes_fk: destinatarioData.id_cliente_fk,
    dest_estado: destinatarioData.dest_estado ?? 'Pendiente'
  };

  const { data, error } = await supabase
    .from('destinatarios')
    .insert([payload])
    .select();

  return { data, error };
}

export async function obtenerDestinatariosPorNotificacion(notificacionId) {
  const { data, error } = await supabase
    .from('destinatarios')
    .select(`
      *,
      clientes (cli_nombre, cli_apellido, cli_email)
    `)
    .eq('id_notificaciones_fk', notificacionId);

  return { data, error };
}

export async function actualizarEstadoDestinatario(id, estado) {
  const { data, error } = await supabase
    .from('destinatarios')
    .update({ dest_estado: estado })
    .eq('id_destinatarios', id)
    .select();

  return { data, error };
}

// ==================== ENVÍO DE EMAILS ====================

async function enviarEmail({ to, subject, html }) {
  try {
    const { data, error } = await supabase.functions.invoke('send-email', {
      body: { to, subject, html }
    });

    if (error) return { success: false, error: error.message };
    return { success: true, data };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

async function enviarEmailAClientes(notificacion) {
  const { data: clientes, error } = await supabase
    .from('clientes')
    .select('id_clientes, cli_email, cli_nombre, cli_apellido')
    .not('cli_email', 'is', null);

  if (error || !clientes?.length) {
    console.error('No se encontraron clientes');
    return { success: false, error: 'No hay clientes' };
  }

  let exitosos = 0;
  let fallidos = 0;

  for (let i = 0; i < clientes.length; i += CONFIG.BATCH_SIZE) {
    const lote = clientes.slice(i, i + CONFIG.BATCH_SIZE);
    
    const promesas = lote.map(async (cliente) => {
      const destinatario = {
        id_notificacion_fk: notificacion.id_notificaciones,
        id_cliente_fk: cliente.id_clientes,
        dest_estado: 'Pendiente'
      };
      await crearDestinatario(destinatario);

      const resultado = await enviarEmail({
        to: cliente.cli_email,
        subject: notificacion.not_asunto,
        html: notificacion.not_mensaje
      });

      if (resultado.success) {
        exitosos++;
        await actualizarEstadoDestinatario(destinatario.id_destinatarios, 'Enviada');
      } else {
        fallidos++;
      }
    });

    await Promise.all(promesas);
    if (i + CONFIG.BATCH_SIZE < clientes.length) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  return { success: true, exitosos, fallidos, total: clientes.length };
}

// ==================== NOTIFICACIONES PUSH ====================

async function solicitarPermisoNotificaciones() {
  if (!('Notification' in window)) {
    console.warn('Este navegador no soporta notificaciones');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
}

async function enviarNotificacionPush({ titulo, mensaje, icono }) {
  const permiso = await solicitarPermisoNotificaciones();
  
  if (!permiso) {
    return { success: false, error: 'Permiso denegado' };
  }

  try {
    new Notification(titulo, {
      body: mensaje,
      icon: icono || '/assets/images/logo.png',
      badge: '/assets/images/badge.png'
    });
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

// ==================== PROCESAMIENTO AUTOMÁTICO ====================

async function procesarNotificacionesProgramadas() {
  const ahora = new Date().toISOString();
  
  const { data: notificaciones, error } = await supabase
    .from('notificaciones')
    .select('*')
    .eq('not_estado', 'Pendiente')
    .lte('not_fechaprogramada', ahora)
    .lt('not_intentosenvio', CONFIG.MAX_RETRY_ATTEMPTS);

  if (error || !notificaciones?.length) return;

  for (const notificacion of notificaciones) {
    try {
      let resultado;

      if (notificacion.not_tipo === 'Email') {
        resultado = await enviarEmailAClientes(notificacion);
      } else if (notificacion.not_tipo === 'Push') {
        resultado = await enviarNotificacionPush({
          titulo: notificacion.not_asunto,
          mensaje: notificacion.not_mensaje
        });
      }

      if (resultado?.success) {
        await marcarComoEnviada(notificacion.id_notificaciones);
      } else {
        await actualizarNotificacion(notificacion.id_notificaciones, {
          not_intentosenvio: notificacion.not_intentosenvio + 1,
          not_estado: notificacion.not_intentosenvio + 1 >= CONFIG.MAX_RETRY_ATTEMPTS ? 'Fallida' : 'Pendiente'
        });
      }
    } catch (err) {
      console.error('Error procesando notificación:', err);
    }
  }
}

// Iniciar procesamiento automático cada 5 minutos
setInterval(procesarNotificacionesProgramadas, 5 * 60 * 1000);

// ==================== CONFIRMACIÓN DE COMPRA ====================

export async function enviarConfirmacionCompra(boleto) {
  const notificacion = {
    not_asunto: '¡Compra Confirmada!',
    not_mensaje: `
      <h1>¡Gracias por tu compra!</h1>
      <p>Tu boleto <strong>${boleto.codigo}</strong> ha sido confirmado.</p>
      <p>Evento: ${boleto.evento}</p>
      <p>Fecha: ${boleto.fecha}</p>
    `,
    not_tipo: 'Email',
    not_estado: 'Pendiente',
    not_fechaprogramada: new Date().toISOString(),
    id_boleto_fk: boleto.id
  };

  return crearNotificacion(notificacion);
}

// ==================== EXPORTS LEGACY ====================

export const NotificacionesCRUD = {
  create: crearNotificacion,
  getAll: obtenerNotificaciones,
  getById: obtenerNotificacionPorId,
  getByEstado: obtenerNotificacionesPorEstado,
  getByCliente: obtenerNotificacionesPorCliente,
  update: actualizarNotificacion,
  delete: eliminarNotificacion,
  marcarComoEnviado: marcarComoEnviada
};

export const PlantillasCRUD = {
  create: crearPlantilla,
  getAll: obtenerPlantillas,
  getById: obtenerPlantillaPorId,
  getActive: obtenerPlantillasActivas,
  update: actualizarPlantilla,
  delete: eliminarPlantilla
};

export default {
  NotificacionesCRUD,
  PlantillasCRUD,
  enviarConfirmacionCompra,
  solicitarPermisoNotificaciones
};
