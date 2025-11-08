export function calcularTotalesFactura(detalles, ivaPorcentaje = 12, descuento = 0) {
  const subtotal = detalles.reduce((acc, d) => acc + Number(d.DetFac_Subtotal || 0), 0)
  const valorIVA = subtotal * (ivaPorcentaje / 100)
  const total = subtotal + valorIVA - descuento

  return {
    Fac_Subtotal: Number(subtotal.toFixed(2)),
    Fac_PorcentajeIVA: ivaPorcentaje,
    Fac_ValorIVA: Number(valorIVA.toFixed(2)),
    Fac_Descuento: Number(descuento.toFixed(2)),
    Fac_Total: Number(total.toFixed(2)),
    Fac_Estado: 'Emitida',
    Fac_FechaEmision: new Date().toISOString()
  }
}
