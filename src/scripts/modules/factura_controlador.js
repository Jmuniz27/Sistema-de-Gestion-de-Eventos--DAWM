
import { crearFacturaConDetalles, actualizarFacturaYDetalles } from './facturacionService.js'
import { calcularTotalesFactura } from './calculosFactura.js'


export async function generarFactura(
  clienteId,
  detalles = [],
  metodoPagoId = null,
  refPago = null,
  observaciones = null,
  ivaPorcentaje = 12,
  descuento = 0,
  serie = '001-001'
) {
  try {
    // Calcular totales (subtotal, IVA, descuento, total)
    const totales = calcularTotalesFactura(detalles, ivaPorcentaje, descuento)

    // Construir objeto factura
    const factura = {
      Fac_Numero: 'FAC-' + Date.now(),   // Número único basado en timestamp
      Fac_Serie: serie,
      id_Clientes_Fk: clienteId,
      id_MetodoPago_Fk: metodoPagoId,
      Fac_ReferenciaPago: refPago,
      Fac_Observaciones: observaciones,
      ...totales
    }

    // Insertar factura y detalles en la base de datos
    return await crearFacturaConDetalles(factura, detalles)
  } catch (err) {
    // Manejo de errores (incluye RLS: acceso denegado)
    throw new Error('Error al generar factura: ' + err.message)
  }
}

export async function actualizarFactura(idFactura, nuevosDatos, nuevosDetalles = []) {
  try {
    // Recalcular totales si hay detalles nuevos
    if (Array.isArray(nuevosDetalles) && nuevosDetalles.length > 0) {
      const iva = nuevosDatos.Fac_PorcentajeIVA ?? 12
      const desc = nuevosDatos.Fac_Descuento ?? 0
      const recalculados = calcularTotalesFactura(nuevosDetalles, iva, desc)
      nuevosDatos = { ...nuevosDatos, ...recalculados }
    }

    // Usar servicio para actualizar factura y detalles
    await actualizarFacturaYDetalles(idFactura, nuevosDatos, nuevosDetalles)
  } catch (err) {
    // Manejo de errores (incluye RLS: acceso denegado)
    throw new Error('Error al actualizar factura: ' + err.message)
  }
}
