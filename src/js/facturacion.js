import { generarFactura } from 'scripts/modules/controllers/factura_Controller.js'
import {
  obtenerFacturaCompleta,
  actualizarFacturaYDetalles
} from '../services/facturacionService.js'

function obtenerIdDesdeURL() {
  const params = new URLSearchParams(window.location.search)
  return params.get('id')
}

function obtenerCliente() {
  return parseInt(document.getElementById('cliente').value)
}

function obtenerMetodo() {
  return parseInt(document.getElementById('metodoPago')?.value || 1)
}

function obtenerDetalles() {
  // Simulación básica: puedes reemplazar con lógica real
  return []
}

function cargarFormulario(factura) {
  document.getElementById('cliente').value = factura.id_Clientes_Fk
  document.getElementById('fecha').value = factura.Fac_FechaEmision?.split('T')[0]
  document.getElementById('monto').value = factura.Fac_Total
  document.getElementById('estado').value = factura.Fac_Estado
}

function obtenerFacturaEditada() {
  return {
    id_Clientes_Fk: obtenerCliente(),
    Fac_Total: parseFloat(document.getElementById('monto').value),
    Fac_Estado: document.getElementById('estado').value,
    Fac_FechaPago: new Date().toISOString()
  }
}

function obtenerDetallesEditados() {
  return [] // Puedes implementar edición de ítems si lo necesitas
}

// Detectar vista actual
const ruta = location.pathname

if (ruta.includes('crear.html')) {
  document.getElementById('formFactura')?.addEventListener('submit', async e => {
    e.preventDefault()
    const clienteId = obtenerCliente()
    const metodoPagoId = obtenerMetodo()
    const detalles = obtenerDetalles()

    try {
      const idFactura = await generarFactura(clienteId, detalles, metodoPagoId)
      alert(`Factura creada: ${idFactura}`)
      location.href = 'index.html'
    } catch (err) {
      alert('Error: ' + err.message)
    }
  })
}

if (ruta.includes('editar.html')) {
  const idFactura = obtenerIdDesdeURL()

  document.addEventListener('DOMContentLoaded', async () => {
    const { factura } = await obtenerFacturaCompleta(idFactura)
    cargarFormulario(factura)
  })

  document.getElementById('formEditarFactura')?.addEventListener('submit', async e => {
    e.preventDefault()
    const nuevosDatos = obtenerFacturaEditada()
    const nuevosDetalles = obtenerDetallesEditados()

    try {
      await actualizarFacturaYDetalles(idFactura, nuevosDatos, nuevosDetalles)
      alert('Factura actualizada correctamente')
      location.href = 'index.html'
    } catch (err) {
      alert('Error: ' + err.message)
    }
  })
}

