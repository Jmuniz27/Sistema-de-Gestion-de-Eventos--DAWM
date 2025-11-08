// /src/utils/calculosFactura.js

/**
 * Calcula subtotal, IVA, descuento y total de una factura
 * @param {Array} detalles - Lista de ítems con cantidad, precio y descuento
 * @param {number} porcentajeIVA - Porcentaje de IVA (ej. 12)
 * @returns {Object} Totales calculados
 */
export function calcularTotalesFactura(detalles, porcentajeIVA = 12) {
  let subtotal = 0
  let totalDescuento = 0

  for (const item of detalles) {
    const precio = parseFloat(item.DetFac_PrecioUnitario || 0)
    const cantidad = parseInt(item.DetFac_Cantidad || 1)
    const descuento = parseFloat(item.DetFac_Descuento || 0)

    const bruto = precio * cantidad
    subtotal += bruto
    totalDescuento += descuento
  }

  const baseImponible = subtotal - totalDescuento
  const valorIVA = (baseImponible * porcentajeIVA) / 100
  const total = baseImponible + valorIVA

  return {
    Fac_Subtotal: subtotal.toFixed(2),
    Fac_Descuento: totalDescuento.toFixed(2),
    Fac_ValorIVA: valorIVA.toFixed(2),
    Fac_Total: total.toFixed(2),
    Fac_PorcentajeIVA: porcentajeIVA
  }
}
