import { generarFactura, actualizarFactura } from '../scripts/modules/factura_controlador.js'
import { obtenerFacturas, obtenerFacturaCompleta } from '../scripts/modules/servicios_facturacion.js'

// Helpers
function paramId() {
  const params = new URLSearchParams(location.search)
  return params.get('id')
}

// Render detalle dinámico
function renderDetalleItem(container, detalle = {}) {
  const row = document.createElement('div')
  row.className = 'detalle-item'
  row.style.gridTemplateColumns = '2.5fr 1fr 1fr 1fr auto'
  row.innerHTML = `
    <input type="text" placeholder="Descripción" value="${detalle.DetFac_Descripcion ?? ''}" class="desc" />
    <input type="number" placeholder="Cantidad" value="${detalle.DetFac_Cantidad ?? 1}" class="cant" min="1" />
    <input type="number" placeholder="Precio unitario" value="${detalle.DetFac_PrecioUnitario ?? 0}" class="precio" step="0.01" min="0" />
    <input type="number" placeholder="Descuento" value="${detalle.DetFac_Descuento ?? 0}" class="descnt" step="0.01" min="0" />
    <button type="button" class="btn">✕</button>
  `
  row.querySelector('button').addEventListener('click', () => row.remove())
  container.appendChild(row)
}

function recogerDetalles(container) {
  return Array.from(container.querySelectorAll('.detalle-item')).map(r => {
    const cantidad = parseInt(r.querySelector('.cant').value || '1', 10)
    const precioUnit = parseFloat(r.querySelector('.precio').value || '0')
    const descuento = parseFloat(r.querySelector('.descnt').value || '0')
    const subtotal = Math.max(0, cantidad * precioUnit - descuento)
    return {
      DetFac_Descripcion: r.querySelector('.desc').value.trim(),
      DetFac_Cantidad: cantidad,
      DetFac_PrecioUnitario: precioUnit,
      DetFac_Descuento: descuento,
      DetFac_Subtotal: subtotal
    }
  })
}

// Index
if (location.pathname.endsWith('/index.html') || location.pathname.endsWith('/') ) {
  document.addEventListener('DOMContentLoaded', async () => {
    try {
      let facturas = await obtenerFacturas()

      const buscador = document.getElementById('buscadorCliente')
      const cont = document.getElementById('listaFacturas')

      const renderLista = (items) => {
        cont.innerHTML = items.map(f => `
          <div class="detalle-item grid-4">
            <span>${f.Fac_Numero}</span>
            <span>${f.id_Clientes_Fk}</span>
            <span>$${Number(f.Fac_Total).toFixed(2)} ${f.Fac_Estado === 'Pagada' ? '<span class="badge badge-paid">Pagada</span>' : '<span class="badge badge-pending">'+f.Fac_Estado+'</span>'}</span>
            <div style="display:flex; gap:8px;">
              <button class="btn" onclick="location.href='./editar.html?id=${f.id_Factura}'">Editar</button>
            </div>
          </div>
        `).join('')
      }

      // Resumen
      const totalIngresos = facturas.reduce((acc, f) => acc + Number(f.Fac_Total || 0), 0)
      document.getElementById('ingresosTotales').textContent = `$${totalIngresos.toFixed(2)}`
      document.getElementById('facturasPagadas').textContent = facturas.filter(f => f.Fac_Estado === 'Pagada').length
      document.getElementById('facturasPendientes').textContent = facturas.filter(f => f.Fac_Estado === 'Pendiente').length

      // Render inicial
      renderLista(facturas)

      // Filtro simple
      buscador?.addEventListener('input', (e) => {
        const q = e.target.value.toLowerCase().trim()
        const filtered = facturas.filter(f =>
          (f.Fac_Numero?.toLowerCase().includes(q)) ||
          String(f.id_Clientes_Fk).includes(q)
        )
        renderLista(filtered)
      })
    } catch (err) {
      alert('Acceso denegado o error al cargar facturas: ' + err.message)
    }
  })
}

// Crear
if (location.pathname.endsWith('/crear.html')) {
  document.addEventListener('DOMContentLoaded', () => {
    const cont = document.getElementById('detallesContainer')
    renderDetalleItem(cont)

    document.getElementById('btnAgregarDetalle').addEventListener('click', () => renderDetalleItem(cont))

    document.getElementById('formFactura').addEventListener('submit', async e => {
      e.preventDefault()
      const clienteId = parseInt(document.getElementById('cliente').value, 10)
      const metodoPagoId = document.getElementById('metodoPago').value ? parseInt(document.getElementById('metodoPago').value, 10) : null
      const refPago = document.getElementById('refPago').value.trim() || null
      const observaciones = document.getElementById('observaciones').value.trim() || null
      const detalles = recogerDetalles(cont)

      try {
        const idFactura = await generarFactura(clienteId, detalles, metodoPagoId, refPago, observaciones)
        alert(`Factura creada: ${idFactura}`)
        location.href = './index.html'
      } catch (err) {
        alert('No tienes permisos para crear facturas: ' + err.message)
      }
    })
  })
}

// Editar
if (location.pathname.endsWith('/editar.html')) {
  document.addEventListener('DOMContentLoaded', async () => {
    const id = paramId()
    if (!id) { location.href = './index.html'; return; }
    try {
      const { factura, detalles } = await obtenerFacturaCompleta(id)
      document.getElementById('cliente').value = factura.id_Clientes_Fk
      document.getElementById('serie').value = factura.Fac_Serie ?? ''
      document.getElementById('metodoPago').value = factura.id_MetodoPago_Fk ?? ''
      document.getElementById('refPago').value = factura.Fac_ReferenciaPago ?? ''
      document.getElementById('observaciones').value = factura.Fac_Observaciones ?? ''
      document.getElementById('estado').value = factura.Fac_Estado ?? 'Emitida'

      const cont = document.getElementById('detallesContainer')
      cont.innerHTML = ''
      detalles.forEach(d => renderDetalleItem(cont, d))
      document.getElementById('btnAgregarDetalle').addEventListener('click', () => renderDetalleItem(cont))

      document.getElementById('formEditarFactura').addEventListener('submit', async e => {
        e.preventDefault()
        const nuevosDatos = {
          id_Clientes_Fk: parseInt(document.getElementById('cliente').value, 10),
          Fac_Serie: document.getElementById('serie').value.trim() || null,
          id_MetodoPago_Fk: document.getElementById('metodoPago').value ? parseInt(document.getElementById('metodoPago').value, 10) : null,
          Fac_ReferenciaPago: document.getElementById('refPago').value.trim() || null,
          Fac_Observaciones: document.getElementById('observaciones').value.trim() || null,
          Fac_Estado: document.getElementById('estado').value,
          Fac_FechaPago: document.getElementById('estado').value === 'Pagada' ? new Date().toISOString() : null
        }
        const nuevosDetalles = recogerDetalles(cont)
        try {
          await actualizarFactura(id, nuevosDatos, nuevosDetalles)
          alert('Factura actualizada correctamente')
          location.href = './index.html'
        } catch (err) {
          alert('No tienes permisos para actualizar facturas: ' + err.message)
        }
      })
    } catch (err) {
      alert('Acceso denegado o error al cargar factura: ' + err.message)
      location.href = './index.html'
    }
  })
}


