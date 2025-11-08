/**
 * Módulo: Boletos y Entradas
 * Responsable: BARRENO HERRERA ANDIE MATTHIUS
 *
 * Tablas: Boletos, TiposBoleto, EntradasAsignadas
 * Nomenclatura: Bol_Codigo, Bol_Tipo, Bol_Precio, Bol_Estado
 */

import { supabase } from '../supabase-client.js'

// ==================== TIPOS DE BOLETO ====================

export async function obtenerTiposBoleto() {
  const { data, error } = await supabase
    .from('tiposboleto')
    .select('*');

  if (error) return { success: false, error: error.message };
  return { success: true, data };
}

export async function crearTipoBoleto(tipo) {
  const { data, error } = await supabase
    .from('tiposboleto')
    .insert([{
      id_tiposboleto: tipo.id,
      tipb_nombre: tipo.nombre
    }])
    .select();

  if (error) return { success: false, error: error.message };
  return { success: true, data: data[0] };
}

export async function actualizarTipoBoleto(id, tipo) {
  const { data, error } = await supabase
    .from('tiposboleto')
    .update({ tipb_nombre: tipo.nombre })
    .eq('id_tiposboleto', id)
    .select();

  if (error) return { success: false, error: error.message };
  return { success: true, data: data[0] };
}

export async function eliminarTipoBoleto(id) {
  const { error } = await supabase
    .from('tiposboleto')
    .delete()
    .eq('id_tiposboleto', id);

  if (error) return { success: false, error: error.message };
  return { success: true };
}

// ==================== ESTADO BOLETO ====================

export async function obtenerEstadosBoleto() {
  const { data, error } = await supabase
    .from('estadoboleto')
    .select('*');

  if (error) return { success: false, error: error.message };
  return { success: true, data };
}

export async function crearEstadoBoleto(estado) {
  const { data, error } = await supabase
    .from('estadoboleto')
    .insert([{ estb_nombre: estado.nombre }])
    .select();

  if (error) return { success: false, error: error.message };
  return { success: true, data: data[0] };
}

export async function actualizarEstadoBoleto(id, estado) {
  const { data, error } = await supabase
    .from('estadoboleto')
    .update({ estb_nombre: estado.nombre })
    .eq('id_estadoboleto', id)
    .select();

  if (error) return { success: false, error: error.message };
  return { success: true, data: data[0] };
}

export async function eliminarEstadoBoleto(id) {
  const { error } = await supabase
    .from('estadoboleto')
    .delete()
    .eq('id_estadoboleto', id);

  if (error) return { success: false, error: error.message };
  return { success: true };
}

// ==================== BOLETOS ====================

export async function obtenerBoletos() {
  const { data, error } = await supabase
    .from('boleto')
    .select(`
      *,
      eventos:id_evento_fk(*),
      tiposboleto:id_tipoboleto_fk(*),
      estadoboleto:id_estadoboleto_fk(*),
      proveedores:id_proveedor_fk(*)
    `);

  if (error) return { success: false, error: error.message };
  return { success: true, data };
}

export async function obtenerBoletoPorId(id) {
  const { data, error } = await supabase
    .from('boleto')
    .select(`
      *,
      eventos:id_evento_fk(*),
      tiposboleto:id_tipoboleto_fk(*),
      estadoboleto:id_estadoboleto_fk(*),
      proveedores:id_proveedor_fk(*)
    `)
    .eq('id_boleto', id)
    .single();

  if (error) return { success: false, error: error.message };
  return { success: true, data };
}

export async function crearBoleto(boleto) {
  const { data, error } = await supabase
    .from('boleto')
    .insert([{
      id_evento_fk: boleto.eventoId,
      id_tipoboleto_fk: boleto.tipoBoletoId,
      id_estadoboleto_fk: boleto.estadoBoletoId,
      id_proveedor_fk: boleto.proveedorId,
      bol_precio: boleto.precio,
      bol_fila: boleto.fila,
      bol_asiento: boleto.asiento,
      bol_seccion: boleto.seccion
    }])
    .select();

  if (error) return { success: false, error: error.message };
  return { success: true, data: data[0] };
}

export async function actualizarBoleto(id, boleto) {
  const { data, error } = await supabase
    .from('boleto')
    .update({
      id_evento_fk: boleto.eventoId,
      id_tipoboleto_fk: boleto.tipoBoletoId,
      id_estadoboleto_fk: boleto.estadoBoletoId,
      id_proveedor_fk: boleto.proveedorId,
      bol_precio: boleto.precio,
      bol_fila: boleto.fila,
      bol_asiento: boleto.asiento,
      bol_seccion: boleto.seccion
    })
    .eq('id_boleto', id)
    .select();

  if (error) return { success: false, error: error.message };
  return { success: true, data: data[0] };
}

export async function eliminarBoleto(id) {
  const { error } = await supabase
    .from('boleto')
    .delete()
    .eq('id_boleto', id);

  if (error) return { success: false, error: error.message };
  return { success: true };
}

// ==================== ENTRADAS ASIGNADAS ====================

export async function obtenerEntradasAsignadas() {
  const { data, error } = await supabase
    .from('entradasasignadas')
    .select(`
      *,
      boleto:id_boleto_fk(*),
      clientes:id_cliente_fk(*),
      usuarios:id_usuario_fk(*)
    `);

  if (error) return { success: false, error: error.message };
  return { success: true, data };
}

export async function obtenerEntradaPorId(id) {
  const { data, error } = await supabase
    .from('entradasasignadas')
    .select(`
      *,
      boleto:id_boleto_fk(*),
      clientes:id_cliente_fk(*),
      usuarios:id_usuario_fk(*)
    `)
    .eq('id_entradaasignada', id)
    .single();

  if (error) return { success: false, error: error.message };
  return { success: true, data };
}

export async function crearEntradaAsignada(entrada) {
  const { data, error } = await supabase
    .from('entradasasignadas')
    .insert([{
      id_boleto_fk: entrada.boletoId,
      id_cliente_fk: entrada.clienteId,
      id_usuario_fk: entrada.usuarioId,
      enta_cantidad: entrada.cantidad,
      enta_fechavalida: entrada.fechaValida
    }])
    .select();

  if (error) return { success: false, error: error.message };
  return { success: true, data: data[0] };
}

export async function actualizarEntradaAsignada(id, entrada) {
  const { data, error } = await supabase
    .from('entradasasignadas')
    .update({
      id_boleto_fk: entrada.boletoId,
      id_cliente_fk: entrada.clienteId,
      id_usuario_fk: entrada.usuarioId,
      enta_cantidad: entrada.cantidad,
      enta_fechavalida: entrada.fechaValida
    })
    .eq('id_entradaasignada', id)
    .select();

  if (error) return { success: false, error: error.message };
  return { success: true, data: data[0] };
}

export async function eliminarEntradaAsignada(id) {
  const { error } = await supabase
    .from('entradasasignadas')
    .delete()
    .eq('id_entradaasignada', id);

  if (error) return { success: false, error: error.message };
  return { success: true };
}

// ==================== FILTRAR POR USUARIO ====================

export async function obtenerEntradasPorUsuario(idUsuario) {
  const { data, error } = await supabase
    .from('entradasasignadas')
    .select(`
      *,
      boleto:id_boleto_fk(
        *,
        eventos:id_evento_fk(*)
      )
    `)
    .eq('id_usuario_fk', idUsuario);

  if (error) return { success: false, error: error.message };
  return { success: true, data };
}