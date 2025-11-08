export function calcularTotalesFactura(detalles, ivaPorcentaje = 12) {
  const subtotal = detalles.reduce((acc, d) => acc + (d.monto || 0), 0)
  const iva = subtotal * (ivaPorcentaje / 100)
  const total = subtotal + iva

  return {
    Fac_Subtotal: subtotal,
    Fac_IVA: iva,
    Fac_Total: total,
    Fac_Estado: 'Emitida',
    Fac_FechaEmision: new Date().toISOString()
  }
}
