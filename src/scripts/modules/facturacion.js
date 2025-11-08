/**
 * Módulo: Facturación
 * Responsable: MAZA PUNNE ISSAC ALEXANDER
 *
 * Tablas: Factura, Detalle_factura
 * Reportes integrados con Clientes, Eventos y Boletos
 */


// supabase-crud.js
import { supabase } from '../supabase-client.js'

// /src/services/facturacionService.js

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

// Validación de campos obligatorios
function validarFactura(factura) {
  if (!factura.Fac_Numero || !factura.id_Clientes_Fk || !factura.Fac_Subtotal || !factura.Fac_Total) {
    throw new Error('Campos obligatorios faltantes en la factura')
  }
}

// ✅ Crear factura con detalles
export async function crearFacturaConDetalles(factura, detalles) {
  try {
    validarFactura(factura)

    const { data: facturaInsertada, error: errorFactura } = await supabase
      .from('Factura')
      .insert([factura])
      .select('id_Factura')

    if (errorFactura) throw errorFactura

    const idFactura = facturaInsertada[0].id_Factura

    const detallesConFk = detalles.map(d => ({
      ...d,
      id_Factura_Fk: idFactura
    }))

    const { error: errorDetalles } = await supabase
      .from('Detalle_factura')
      .insert(detallesConFk)

    if (errorDetalles) throw errorDetalles

    return idFactura
  } catch (err) {
    console.error('Error al crear factura con detalles:', err.message)
    throw err
  }
}

// ✅ Leer factura con sus detalles
export async function obtenerFacturaCompleta(idFactura) {
  try {
    const { data: factura, error: errorFactura } = await supabase
      .from('Factura')
      .select('*')
      .eq('id_Factura', idFactura)
      .single()

    const { data: detalles, error: errorDetalles } = await supabase
      .from('Detalle_factura')
      .select('*')
      .eq('id_Factura_Fk', idFactura)

    if (errorFactura || errorDetalles) throw errorFactura || errorDetalles

    return { factura, detalles }
  } catch (err) {
    console.error('Error al obtener factura completa:', err.message)
    throw err
  }
}

// ✅ Actualizar factura y sus detalles
export async function actualizarFacturaYDetalles(idFactura, nuevosDatos, nuevosDetalles) {
  try {
    validarFactura(nuevosDatos)

    const { error: errorFactura } = await supabase
      .from('Factura')
      .update(nuevosDatos)
      .eq('id_Factura', idFactura)

    if (errorFactura) throw errorFactura

    await supabase
      .from('Detalle_factura')
      .delete()
      .eq('id_Factura_Fk', idFactura)

    const detallesConFk = nuevosDetalles.map(d => ({
      ...d,
      id_Factura_Fk: idFactura
    }))

    const { error: errorDetalles } = await supabase
      .from('Detalle_factura')
      .insert(detallesConFk)

    if (errorDetalles) throw errorDetalles

    return true
  } catch (err) {
    console.error('Error al actualizar factura y detalles:', err.message)
    throw err
  }
}

// ✅ Eliminar factura (y sus detalles por cascada)
export async function eliminarFactura(idFactura) {
  try {
    const { error } = await supabase
      .from('Factura')
      .delete()
      .eq('id_Factura', idFactura)

    if (error) throw error
    return true
  } catch (err) {
    console.error('Error al eliminar factura:', err.message)
    throw err
  }
}


// TODO: Implementar generación de facturas
// TODO: Implementar cálculos de totales con IVA
