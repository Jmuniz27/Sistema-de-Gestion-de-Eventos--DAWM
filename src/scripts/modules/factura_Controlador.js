import { supabase } from '../supabaseClient.js'

// Obtener todas las facturas
export async function obtenerFacturas() {
  const { data, error } = await supabase.from('Factura').select('*')
  if (error) throw error
  return data
}

// Obtener factura completa con detalles
export async function obtenerFacturaCompleta(idFactura) {
  const { data: factura, error } = await supabase
    .from('Factura')
    .select('*')
    .eq('id_Factura', idFactura)
    .single()

  const { data: detalles } = await supabase
    .from('DetalleFactura')
    .select('*')
    .eq('id_Factura_Fk', idFactura)

  if (error) throw error
  return { factura, detalles }
}

// Crear factura con detalles
export async function crearFacturaConDetalles(factura, detalles) {
  const { data, error } = await supabase.from('Factura').insert(factura).select()
  if (error) throw error

  const idFactura = data[0].id_Factura
  for (const d of detalles) {
    await supabase.from('DetalleFactura').insert({
      id_Factura_Fk: idFactura,
      ...d
    })
  }
  return idFactura
}

// Actualizar factura y detalles
export async function actualizarFacturaYDetalles(idFactura, nuevosDatos, nuevosDetalles) {
  const { error } = await supabase
    .from('Factura')
    .update(nuevosDatos)
    .eq('id_Factura', idFactura)

  if (error) throw error

  // Actualizar detalles si se pasan
  if (nuevosDetalles.length > 0) {
    await supabase.from('DetalleFactura').delete().eq('id_Factura_Fk', idFactura)
    for (const d of nuevosDetalles) {
      await supabase.from('DetalleFactura').insert({
        id_Factura_Fk: idFactura,
        ...d
      })
    }
  }
}
