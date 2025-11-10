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

// Index (listado de facturas)
if (
  location.pathname.endsWith('/index.html') ||
  location.pathname.endsWith('/') ||
  location.pathname.includes('/facturacion/index.html')
) {
  document.addEventListener('DOMContentLoaded', async () => {
    const buscador = document.getElementById('buscadorCliente')
    const cont = document.getElementById('listaFacturas')
    const emptyState = document.getElementById('emptyState')

    const formatFecha = iso => {
      if (!iso) return 'Sin fecha'
      const d = new Date(iso)
      const dia = d.getDate().toString().padStart(2, '0')
      const mesStr = d.toLocaleString('es-ES', { month: 'short' }).replace('.', '')
      const año = d.getFullYear()
      return `${dia} ${mesStr} ${año}`
    }

    const estadoBadgeClass = estado => (estado === 'Pagada' ? 'badge-paid' : 'badge-pending')

	const cont = document.getElementById('listaFacturas')
	const emptyState = document.getElementById('emptyState')

	 if (!items || items.length === 0) {
		cont.innerHTML = ''
		cont.classList.add('d-none')      // Oculta SOLO la lista
		emptyState.classList.remove('d-none')
		return
	 }
	 
	  cont.classList.remove('d-none')
      emptyState.classList.add('d-none')

      cont.innerHTML = items.map(f => `
        <div class="factura-row fade-in">
          <div class="factura-cell doc">
            <div class="doc-icon">📄</div>
            <div class="doc-info">
              <div class="doc-num">${f.Fac_Numero ?? 'SIN-NUM'}</div>
              <div class="doc-client">${f.ClienteNombre ?? f.id_Clientes_Fk ?? 'Sin cliente'}</div>
            </div>
          </div>

          <div class="factura-cell monto">
            <div class="amount">$${Number(f.Fac_Total ?? 0).toFixed(0)}</div>
            <div class="date">${formatFecha(f.Fac_Fecha)}</div>
          </div>

          <div class="factura-cell estado">
            <span class="badge ${estadoBadgeClass(f.Fac_Estado)}">${f.Fac_Estado ?? 'Emitida'}</span>
          </div>

          <div class="factura-cell acciones">
            <button class="icon-btn" title="Ver" data-action="ver" data-id="${f.id_Factura}">👁️</button>
            <button class="icon-btn" title="Descargar" data-action="descargar" data-id="${f.id_Factura}">⬇️</button>
          </div>
        </div>
      `).join('')

      // Acciones
      cont.querySelectorAll('.icon-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
          const action = e.currentTarget.dataset.action
          const id = e.currentTarget.dataset.id
          if (action === 'ver') {
            location.href = `./editar.html?id=${id}`
          } else if (action === 'descargar') {
            const item = items.find(x => String(x.id_Factura) === String(id))
            const numero = item?.Fac_Numero ?? id
            const total = item?.Fac_Total ?? 0
            const cliente = item?.ClienteNombre ?? item?.id_Clientes_Fk ?? 'Sin cliente'
            const fecha = formatFecha(item?.Fac_Fecha)
            const contenido = `Factura ${numero}\nCliente: ${cliente}\nTotal: $${Number(total).toFixed(2)}\nFecha: ${fecha}`
            const blob = new Blob([contenido], { type: 'text/plain' })
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `Factura-${numero}.txt`
            a.click()
            URL.revokeObjectURL(url)
          }
        })
      })
    }

    // Carga y fallback
    let facturas = []
    try {
      facturas = await obtenerFacturas()
    } catch (err) {
      // Fallback simulado para pruebas locales
      facturas = [
        { id_Factura: 1, Fac_Numero: 'FAC-001-2025', ClienteNombre: 'Juan Pérez', Fac_Total: 250, Fac_Fecha: new Date().toISOString(), Fac_Estado: 'Pagada' },
        { id_Factura: 2, Fac_Numero: 'FAC-002-2025', ClienteNombre: 'María García', Fac_Total: 120, Fac_Fecha: new Date().toISOString(), Fac_Estado: 'Pendiente' },
        { id_Factura: 3, Fac_Numero: 'FAC-003-2025', ClienteNombre: 'Tech Solutions', Fac_Total: 80, Fac_Fecha: new Date().toISOString(), Fac_Estado: 'Pagada' },
      ]
      console.warn('Usando datos simulados de facturas para render local.')
    }

    // Resumen
    const totalIngresos = facturas.reduce((acc, f) => acc + Number(f.Fac_Total || 0), 0)
    document.getElementById('ingresosTotales').textContent = `$${totalIngresos.toFixed(2)}`
    document.getElementById('facturasPagadas').textContent = facturas.filter(f => f.Fac_Estado === 'Pagada').length
    document.getElementById('facturasPendientes').textContent = facturas.filter(f => f.Fac_Estado === 'Pendiente').length

    // Render inicial
    renderLista(facturas)

    // Filtro
    buscador?.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase().trim()
      const filtered = facturas.filter(f =>
        (f.Fac_Numero?.toLowerCase().includes(q)) ||
        (String(f.id_Clientes_Fk ?? '').toLowerCase().includes(q)) ||
        ((f.ClienteNombre ?? '').toLowerCase().includes(q))
      )
      renderLista(filtered)
    })
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


