/*
 * Módulo: Eventos
 * Responsable: BARZOLA DE LA O STEVEN ARIEL
 *
 * Tablas: Eventos, Detalle_Eventos, CategoriasEvento, TipoIngreso
 * Nomenclatura: Evt_Nombre, Evt_Fecha, Evt_Lugar, Evt_Capacidad
 * PK: id_Eventos
 */

import { supabase } from '../supabase-client.js';


/*========================================= CRUD ========================================= */

/*======================= CATEGORIA EVENTO =======================*/

export async function obtenerCategoriaEvento() {
  const { data, error } = await supabase
    .from('categoriaevento')
    .select('*');

  if (error) return { success: false, error: error.message };
  return { success: true, data };
}

export async function obtenerCategoriaEventoPorId(id) {
  const { data, error } = await supabase
    .from('categoriaevento')
    .select('*')
    .eq('id_categoriaevento', id)
    .single();

  if (error) return { success: false, error: error.message };
  return { success: true, data };
}

export async function crearCategoriaEvento(categoria) {
  const { data, error } = await supabase
    .from('categoriaevento')
    .insert([{
      catevt_nombre: categoria.nombre,
	  catevt_descripcion: categoria.descripcion
    }])
    .select();

  if (error) return { success: false, error: error.message };
  return { success: true, data: data?.[0] };
}

export async function actualizarCategoriaEvento(id, categoria) {
  const { data, error } = await supabase
    .from('categoriaevento')
    .update({ 
		catevt_nombre: categoria.nombre,
		catevt_descripcion: categoria.descripcion	
	})
    .eq('id_categoriaevento', id)
    .select();

  if (error) return { success: false, error: error.message };
  return { success: true, data: data?.[0] };
}

export async function eliminarCategoriaEvento(id) {
  const { error } = await supabase
    .from('categoriaevento')
    .delete()
    .eq('id_categoriaevento', id);

  if (error) return { success: false, error: error.message };
  return { success: true };
}

/*======================= TIPO DE INGRESO =======================*/

export async function obtenerTipoIngreso() {
  const { data, error } = await supabase
    .from('tipoingreso')
    .select('*');

  if (error) return { success: false, error: error.message };
  return { success: true, data };
}

export async function obtenerTipoIngresoPorId(id) {
  const { data, error } = await supabase
    .from('tipoingreso')
    .select('*')
    .eq('id_tipoingreso', id)
    .single();

  if (error) return { success: false, error: error.message };
  return { success: true, data };
}

export async function crearTipoIngreso(tipo) {
  const { data, error } = await supabase
    .from('tipoingreso')
    .insert([{
	  ting_nombre: tipo.nombre,
	  ting_descripcion: tipo.descripcion,
	  ting_requiereboleto: tipo.requiereBoleto
    }])
    .select();

  if (error) return { success: false, error: error.message };
  return { success: true, data: data?.[0] };
}

export async function actualizarTipoIngreso(id, tipo) {
  const { data, error } = await supabase
    .from('tipoingreso')
    .update({ 
		ting_nombre: tipo.nombre,
		ting_descripcion: tipo.descripcion,
		ting_requiereboleto: tipo.requiereBoleto	
	})
    .eq('id_tipoingreso', id)
    .select();

  if (error) return { success: false, error: error.message };
  return { success: true, data: data?.[0] };
}

export async function eliminarTipoIngreso(id) {
  const { error } = await supabase
    .from('tipoingreso')
    .delete()
    .eq('id_tipoingreso', id);

  if (error) return { success: false, error: error.message };
  return { success: true };
}

/*======================= EVENTOS =======================*/

export async function obtenerEvento() {
  const { data, error } = await supabase
    .from('eventos')
    .select('*');

  if (error) return { success: false, error: error.message };
  return { success: true, data };
}

/*Ej para seleccionar atributos específico: .select('id_evento, nombre, fecha')*/
export async function obtenerEventoPorId(id) {
  const { data, error } = await supabase
    .from('eventos')
    .select('*')
    .eq('id_eventos', id)
    .single();

  if (error) return { success: false, error: error.message };
  return { success: true, data };
}

export async function crearEvento(evento) {
  const { data, error } = await supabase
    .from('eventos')
    .insert([{
	  evt_nombre: evento.nombre,
	  evt_descripcion: evento.descripcion,
	  evt_fechainicio: evento.fechaInicio,
	  evt_fechafin: evento.fechaFin,
	  evt_direccion: evento.direccion,
	  id_ciudades_fk: evento.ciudadesId,
	  evt_capacidadtotal: evento.capacidadTotal,
	  evt_capacidaddisponible: evento.capacidadDisponible,
	  evt_preciobasegeneral: evento.precioBaseGeneral,
	  evt_imagenportada: evento.imagenPortada,
	  evt_estado: evento.estado
    }])
    .select();

  if (error) return { success: false, error: error.message };
  return { success: true, data: data?.[0] };
}

export async function actualizarEvento(id, evento) {
  const { data, error } = await supabase
    .from('eventos')
    .update({ 
		evt_nombre: evento.nombre,
		evt_descripcion: evento.descripcion,
		evt_fechainicio: evento.fechaInicio,
		evt_fechafin: evento.fechaFin,
		evt_direccion: evento.direccion,
		id_ciudades_fk: evento.ciudadesId,
		evt_capacidadtotal: evento.capacidadTotal,
		evt_capacidaddisponible: evento.capacidadDisponible,
		evt_preciobasegeneral: evento.precioBaseGeneral,
		evt_imagenportada: evento.imagenPortada,
		evt_estado: evento.estado
	})
    .eq('id_eventos', id)
    .select();

  if (error) return { success: false, error: error.message };
  return { success: true, data: data?.[0] };
}

export async function eliminarEvento(id) {
  const { error } = await supabase
    .from('eventos')
    .delete()
    .eq('id_eventos', id);

  if (error) return { success: false, error: error.message };
  return { success: true };
}

/*======================= DETALLES EVENTOS =======================*/

export async function obtenerDetalleEvento() {
  const { data, error } = await supabase
    .from('detalle_eventos')
    .select('*');

  if (error) return { success: false, error: error.message };
  return { success: true, data };
}

export async function obtenerDetallesEventoPorEventoId(eventoId) {
  const { data, error } = await supabase
    .from('detalle_eventos')
    .select('*')
    .eq('id_eventos_fk', eventoId);
  if (error) return { success: false, error: error.message };
  return { success: true, data };
}

export async function crearDetalleEvento(evento) {
  const { data, error } = await supabase
    .from('detalle_eventos')
    .insert([{
		id_eventos_fk: detalle.eventoId,
		id_tipoingreso_fk: detalle.tipoIngresoId,
		id_categoriaevento_fk: detalle.categoriaEventoId
    }])
    .select();

  if (error) return { success: false, error: error.message };
  return { success: true, data: data?.[0] };
}

export async function eliminarDetalleEvento(eventoId, tipoIngresoId, categoriaEventoId) {
  const { error } = await supabase
    .from('detalle_eventos')
    .delete()
    .eq('id_eventos_fk', eventoId)
    .eq('id_tipoingreso_fk', tipoIngresoId)
    .eq('id_categoriaevento_fk', categoriaEventoId);
  if (error) return { success: false, error: error.message };
  return { success: true };
}

/* Nota: Esta tabla normalmente no tiene UPDATE porque su PRIMARY KEY son las 3 foreign keys. Si necesitas "actualizar", tendrías que eliminar y crear de nuevo. */


/* ========================================= PRINCIPAL - pages/eventos/index.html ========================================= */
