// /src/controllers/facturaController.js

import { calcularTotalesFactura } from '../utils/calculosFactura.js'
import { crearFacturaConDetalles } from '../services/facturacionService.js'

function generarCodigoFactura() {
  const fecha = new Date()
  const año = fecha.getFullYear()
  const aleatorio = Math.floor(Math.random() * 1000)
  return `FAC-${aleatorio}-${año}`
}

/**
 * Genera una factura completa con detalles y cálculos automáticos
 * @param {number} clienteId - ID del cliente
 * @param {Array} detalles - Lista de ítems de la factura
 * @param {number} metodoPagoId - ID del método de pago
 * @returns {number} idFactura - ID generado en Supabase
 */
export async function generarFactura(clienteId, detalles, metodoPagoId) {
  const totales = calcularTotalesFactura(detalles, 12)

  const factura = {
    Fac_Numero: generarCodigoFactura(),
    id_Clientes_Fk: clienteId,
    id_MetodoPago_Fk: metodoPagoId,
    ...totales
  }

  const idFactura = await crearFacturaConDetalles(factura, detalles)
  return idFactura
}
