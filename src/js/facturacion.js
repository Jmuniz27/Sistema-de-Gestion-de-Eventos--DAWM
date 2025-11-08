import { generarFactura } from '../controllers/facturaController.js'
import { obtenerFacturaCompleta, actualizarFacturaYDetalles } from '../services/facturacionService.js'

// En crear.html
document.querySelector('#btnGuardar').addEventListener('click', async () => {
  const clienteId = obtenerCliente()
  const metodoPagoId = obtenerMetodo()
  const detalles = obtenerDetalles()

  try {
    const idFactura = await generarFactura(clienteId, detalles, metodoPagoId)
    alert(`Factura creada: ${idFactura}`)
    window.location.href = 'index.html'
  } catch (err) {
    alert('Error: ' + err.message)
  }
})

// En editar.html
document.addEventListener('DOMContentLoaded', async () => {
  const id = obtenerIdDesdeURL()
  const { factura, detalles } = await obtenerFacturaCompleta(id)
  cargarFormulario(factura, detalles)
})

document.querySelector('#btnActualizar').addEventListener('click', async () => {
  const id = obtenerIdDesdeURL()
  const nuevosDatos = obtenerFacturaEditada()
  const nuevosDetalles = obtenerDetallesEditados()

  try {
    await actualizarFacturaYDetalles(id, nuevosDatos, nuevosDetalles)
    alert('Factura actualizada')
    window.location.href = 'index.html'
  } catch (err) {
    alert('Error: ' + err.message)
  }
})
