import { supabase } from '../supabaseClient.js'


export async function obtenerFacturas() {
  const { data, error } = await supabase
    .from('Factura')
    .select('*')
    .order('Fac_FechaEmision', { ascending: false })

  if (error) throw new Error(error.message)
  return data ?? []
}


export async function obtenerFacturaCompleta(idFactura) {
  const { data: factura, error } = await supabase
    .from('Factura')
    .select('*')
    .eq('id_Factura', idFactura)
    .single()

  if (error) throw new Error(error.message)

  const { data: detalles, error: errDet } = await supabase
    .from('Detalle_factura')
    .select('*')
    .eq('id_Factura_Fk', idFactura)
    .order('DetFac_FechaCreacion', { ascending: true })

  if (errDet) throw new Error(errDet.message)

  return { factura, detalles: detalles ?? [] }
}


export async function crearFacturaConDetalles(factura, detalles) {
  const { data, error } = await supabase
    .from('Factura')
    .insert(factura)
    .select()

  if (error) throw new Error(error.message)

  const idFactura = data[0].id_Factura

  if (Array.isArray(detalles) && detalles.length > 0) {
    const detallesConFk = detalles.map(d => ({
      id_Factura_Fk: idFactura,
      id_EntradaAsignada_Fk: d.id_EntradaAsignada_Fk ?? null,
      DetFac_Descripcion: d.DetFac_Descripcion,
      DetFac_Cantidad: d.DetFac_Cantidad,
      DetFac_PrecioUnitario: d.DetFac_PrecioUnitario,
      DetFac_Descuento: d.DetFac_Descuento ?? 0,
      DetFac_Subtotal: d.DetFac_Subtotal,
      id_modulo: 'facturacion'
    }))

    const { error: errDetalles } = await supabase
      .from('Detalle_factura')
      .insert(detallesConFk)

    if (errDetalles) throw new Error(errDetalles.message)
  }

  return idFactura
}


export async function actualizarFacturaYDetalles(idFactura, nuevosDatos, nuevosDetalles = []) {
  const { error } = await supabase
    .from('Factura')
    .update(nuevosDatos)
    .eq('id_Factura', idFactura)

  if (error) throw new Error(error.message)

  if (Array.isArray(nuevosDetalles) && nuevosDetalles.length > 0) {
    // Eliminar detalles anteriores
    const { error: errDel } = await supabase
      .from('Detalle_factura')
      .delete()
      .eq('id_Factura_Fk', idFactura)

    if (errDel) throw new Error(errDel.message)

    // Insertar nuevos detalles
    const detallesConFk = nuevosDetalles.map(d => ({
      id_Factura_Fk: idFactura,
      id_EntradaAsignada_Fk: d.id_EntradaAsignada_Fk ?? null,
      DetFac_Descripcion: d.DetFac_Descripcion,
      DetFac_Cantidad: d.DetFac_Cantidad,
      DetFac_PrecioUnitario: d.DetFac_PrecioUnitario,
      DetFac_Descuento: d.DetFac_Descuento ?? 0,
      DetFac_Subtotal: d.DetFac_Subtotal,
      id_modulo: 'facturacion'
    }))

    const { error: errIns } = await supabase
      .from('Detalle_factura')
      .insert(detallesConFk)

    if (errIns) throw new Error(errIns.message)
  }
}
