/**
 * Carga estadísticas y eventos desde Supabase
 */

import { supabase } from '../supabase-client.js'
import stateManager from '../../js/state-manager.js';
import { jsPDF } from 'jspdf';

/**
 * Cargar todas las estadísticas del dashboard
 */
async function loadDashboardStats() {
  try {
    // Cargar en paralelo todas las estadísticas
    const [
      totalEventos,
      totalClientes,
      totalBoletos,
      totalIngresos
    ] = await Promise.all([
      getTotalEventos(),
      getTotalClientes(),
      getTotalBoletos(),
      getTotalIngresos()
    ]);

    // Actualizar UI con los datos
    updateStatCard('totalEventos', totalEventos);
    updateStatCard('totalClientes', totalClientes);
    updateStatCard('totalBoletos', totalBoletos);
    updateStatCard('totalIngresos', `$${totalIngresos.toLocaleString('es-EC', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);

  } catch (error) {
    console.error('Error loading dashboard stats:', error);
    showStatsError();
  }
}

/**
 * Obtener total de eventos
 */
async function getTotalEventos() {
  const { count, error } = await supabase
    .from('eventos')
    .select('*', { count: 'exact', head: true });

  if (error) {
    console.error('Error fetching eventos:', error);
    return 0;
  }

  return count || 0;
}

/**
 * Obtener total de clientes
 */
async function getTotalClientes() {
  const { count, error } = await supabase
    .from('clientes')
    .select('*', { count: 'exact', head: true });

  if (error) {
    console.error('Error fetching clientes:', error);
    return 0;
  }

  return count || 0;
}

/**
 * Obtener total de boletos vendidos
 * Cuenta boletos con estado "Vendido" (id_estadoboleto_fk = 3 según seed.sql)
 */
async function getTotalBoletos() {
  const { count, error } = await supabase
    .from('boleto')
    .select('*', { count: 'exact', head: true })
    .eq('id_estadoboleto_fk', 3); // Estado "Vendido"

  if (error) {
    console.error('Error fetching boletos:', error);
    return 0;
  }

  return count || 0;
}

/**
 * Obtener total de ingresos
 * Suma todos los totales de facturas pagadas
 */
async function getTotalIngresos() {
  const { data, error } = await supabase
    .from('factura')
    .select('fac_total')
    .eq('fac_estado', 'Pagada');

  if (error) {
    console.error('Error fetching ingresos:', error);
    return 0;
  }

  if (!data || data.length === 0) {
    return 0;
  }

  // Sumar todos los totales
  const total = data.reduce((sum, factura) => {
    return sum + (parseFloat(factura.fac_total) || 0);
  }, 0);

  return total;
}

/**
 * Actualizar tarjeta de estadística
 */
function updateStatCard(elementId, value) {
  const element = document.getElementById(elementId);
  if (element) {
    element.innerHTML = value;
  }
}

/**
 * Mostrar error en estadísticas
 */
function showStatsError() {
  const statElements = [
    'totalEventos',
    'totalClientes',
    'totalBoletos',
    'totalIngresos'
  ];

  statElements.forEach(id => {
    const element = document.getElementById(id);
    if (element) {
      element.innerHTML = '<span style="color: #ef4444;">Error</span>';
    }
  });
}

/**
 * Cargar próximos eventos
 */
async function loadProximosEventos() {
  const container = document.getElementById('proximosEventos');
  if (!container) return;

  try {
    showLoadingState(container);

    // Obtener próximos eventos programados
    const { data: eventos, error } = await supabase
      .from('eventos')
      .select(`
        id_eventos,
        evt_nombre,
        evt_fechainicio,
        evt_capacidaddisponible,
        ciudades (
          ciu_nombre
        )
      `)
      .eq('evt_estado', 'Programado')
      .gte('evt_fechainicio', new Date().toISOString())
      .order('evt_fechainicio', { ascending: true })
      .limit(5);

    if (error) {
      console.error('Error fetching eventos:', error);
      showErrorState(container, 'Error al cargar eventos');
      return;
    }

    if (!eventos || eventos.length === 0) {
      showEmptyEventsState(container);
      return;
    }

    renderEventos(container, eventos);

  } catch (error) {
    console.error('Error loading eventos:', error);
    showErrorState(container, 'Ocurrió un error al cargar los eventos');
  }
}

/**
 * Renderizar lista de eventos
 */
function renderEventos(container, eventos) {
  const eventList = document.createElement('div');
  eventList.className = 'event-list';

  eventos.forEach(evento => {
    const eventItem = createEventItem(evento);
    eventList.appendChild(eventItem);
  });

  container.innerHTML = '';
  container.appendChild(eventList);
}

/**
 * Crear item de evento
 */
function createEventItem(evento) {
  const item = document.createElement('div');
  item.className = 'event-item';
  item.setAttribute('data-event-id', evento.id_eventos);

  const fecha = new Date(evento.evt_fechainicio);
  const fechaFormateada = fecha.toLocaleDateString('es-EC', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  const ciudad = evento.ciudades?.ciu_nombre || 'Ecuador';

  item.innerHTML = `
    <div class="event-item-header">
      <h3 class="event-item-title">${evento.evt_nombre}</h3>
      <span class="event-item-capacity">${evento.evt_capacidaddisponible} Asistentes</span>
    </div>
    <p class="event-item-date">
      <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"/>
      </svg>
      ${fechaFormateada} - ${ciudad}
    </p>
  `;

  item.addEventListener('click', () => {
    handleEventClick(evento.id_eventos);
  });

  return item;
}

/**
 * Manejar click en evento
 */
async function handleEventClick(eventId) {
  try {
    const { data: evento, error } = await supabase
      .from('eventos')
      .select(`
        *,
        ciudades (*),
        detalle_eventos (
          categoriaevento (*),
          tipoingreso (*)
        )
      `)
      .eq('id_eventos', eventId)
      .single();

    if (error) {
      console.error('Error fetching event details:', error);
      alert('Error al cargar los detalles del evento');
      return;
    }

    stateManager.setSelectedEvent(evento);
    window.location.href = `/pages/eventos/mostrarEvento.html?id=${eventId}`;

  } catch (error) {
    console.error('Error handling event click:', error);
    alert('Ocurrió un error al procesar la solicitud');
  }
}

/**
 * Cargar ventas recientes (boletos vendidos)
 */
async function loadVentasRecientes() {
  const container = document.getElementById('ventasRecientes');
  if (!container) return;

  try {
    showLoadingState(container);

    // CORRECCIÓN: Estructura de consulta simplificada
    const { data: facturas, error } = await supabase
      .from('factura')
      .select(`
        id_factura,
        fac_fechaemision,
        fac_total,
        clientes (
          cli_nombre,
          cli_apellido
        )
      `)
      .eq('fac_estado', 'Pagada')
      .order('fac_fechaemision', { ascending: false })
      .limit(5);

    if (error) {
      console.error('Error fetching ventas recientes:', error);
      showErrorState(container, 'Error al cargar las ventas');
      return;
    }

    if (!facturas || facturas.length === 0) {
      showEmptySalesState(container);
      return;
    }

    renderVentasRecientes(container, facturas);

  } catch (error) {
    console.error('Error loading ventas recientes:', error);
    showErrorState(container, 'Ocurrió un error al cargar las ventas');
  }
}

/**
 * Renderizar lista de ventas recientes
 */
function renderVentasRecientes(container, facturas) {
  const salesList = document.createElement('div');
  salesList.className = 'sales-list';

  facturas.forEach(factura => {
    const saleItem = createSaleItem(factura);
    salesList.appendChild(saleItem);
  });

  container.innerHTML = '';
  container.appendChild(salesList);
}

/**
 * Crear item de venta
 */
function createSaleItem(factura) {
  const item = document.createElement('div');
  item.className = 'sale-item';

  const clienteNombre = factura.clientes?.cli_nombre || 'Cliente';
  const clienteApellido = factura.clientes?.cli_apellido || '';
  const precio = factura.fac_total;

  const fecha = new Date(factura.fac_fechaemision);
  const fechaFormateada = fecha.toLocaleDateString('es-EC', {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: 'short'
  });
  
  const precioFormateado = `$${precio.toLocaleString('es-EC', { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2 
  })}`;

  item.innerHTML = `
    <div class="sale-item-header">
      <h3 class="sale-item-title">Factura #${factura.id_factura}</h3>
      <span class="sale-item-price">${precioFormateado}</span>
    </div>
    <p class="sale-item-details">
      <span class="sale-item-buyer">
        <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"/>
        </svg>
        ${clienteNombre} ${clienteApellido}
      </span>
      <span class="sale-item-date">
        <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"/>
        </svg>
        ${fechaFormateada}
      </span>
    </p>
  `;

  item.addEventListener('click', () => {
    window.location.href = `/pages/facturacion/editar.html?id=${factura.id_factura}`;
  });

  return item;
}

/**
 * Cargar notificaciones
 */
async function loadNotificaciones() {
  const container = document.getElementById('ultimasNotificaciones');
  if (!container) return;

  try {
    showLoadingState(container);

    // CORRECCIÓN: Usar nombres de columnas correctos
    const { data: notificaciones, error } = await supabase
      .from('notificaciones')
      .select(`
        id_notificaciones,
        not_mensaje,
        not_tipo,
        not_fechaenvio,
        not_estado
      `)
      .not('not_fechaenvio', 'is', null)
      .order('not_fechaenvio', { ascending: false })
      .limit(5);

    if (error) {
      console.error('Error fetching notificaciones:', error);
      showErrorState(container, 'Error al cargar notificaciones');
      return;
    }

    if (!notificaciones || notificaciones.length === 0) {
      showEmptyNotificationsState(container);
      return;
    }

    renderNotificaciones(container, notificaciones);

  } catch (error) {
    console.error('Error loading notificaciones:', error);
    showErrorState(container, 'Ocurrió un error al cargar las notificaciones');
  }
}

/**
 * Renderizar lista de notificaciones
 */
function renderNotificaciones(container, notificaciones) {
  const notificationList = document.createElement('div');
  notificationList.className = 'notification-list';

  notificaciones.forEach(notificacion => {
    const notificationItem = createNotificationItem(notificacion);
    notificationList.appendChild(notificationItem);
  });

  container.innerHTML = '';
  container.appendChild(notificationList);
}

/**
 * Crear item de notificación
 */
function createNotificationItem(notificacion) {
  const item = document.createElement('div');
  item.className = `notification-item notification-item-${notificacion.not_estado.toLowerCase()}`;
  item.setAttribute('data-notification-id', notificacion.id_notificaciones);

  const icon = notificacion.not_estado.toLowerCase() === 'enviada' 
    ? '<svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor"><path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707l-.707-.707V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"/></svg>' 
    : '<svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>';

  const fecha = new Date(notificacion.not_fechaenvio);
  const fechaFormateada = fecha.toLocaleTimeString('es-EC', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  item.innerHTML = `
    <div class="notification-icon">${icon}</div>
    <div class="notification-content">
      <p class="notification-message">${notificacion.not_mensaje}</p>
      <span class="notification-meta">${fechaFormateada} - <strong>${notificacion.not_estado}</strong></span>
    </div>
  `;

  item.addEventListener('click', () => {
    window.location.href = `/pages/notificaciones/index.html`;
  });

  return item;
}

/**
 * Estados de carga y vacío
 */
function showLoadingState(container) {
  container.innerHTML = `
    <div class="loading">
      <div class="loading-spinner"></div>
    </div>
  `;
}

function showEmptyEventsState(container) {
  container.innerHTML = `
    <div class="empty-state">
      <p class="empty-text">No hay eventos programados próximamente</p>
    </div>
  `;
}

function showEmptySalesState(container) {
  container.innerHTML = `
    <div class="empty-state">
      <p class="empty-text">No hay ventas registradas recientemente</p>
    </div>
  `;
}

function showEmptyNotificationsState(container) {
  container.innerHTML = `
    <div class="empty-state">
      <p class="empty-text">No hay notificaciones recientes para mostrar</p>
    </div>
  `;
}

function showErrorState(container, message) {
  container.innerHTML = `
    <div class="empty-state">
      <p class="empty-text" style="color: #ef4444;">${message}</p>
    </div>
  `;
}

/**
 * Exportar dashboard a PDF
 */
async function exportDashboardToPDF() {
  try {
    // Mostrar indicador de carga
    const exportBtn = document.getElementById('exportPdfBtn');
    const originalText = exportBtn.innerHTML;
    exportBtn.disabled = true;
    exportBtn.innerHTML = '<span class="loading-spinner-sm"></span> Generando PDF...';

    // Recopilar todos los datos del dashboard
    const [stats, eventos, ventas, notificaciones] = await Promise.all([
      getDashboardStats(),
      getProximosEventosData(),
      getVentasRecientesData(),
      getNotificacionesData()
    ]);

    // Crear el PDF
    const doc = new jsPDF();
    let yPosition = 20;

    // Título del documento
    doc.setFontSize(20);
    doc.setTextColor(30, 58, 138); // Color primario
    doc.text('Dashboard - EventManager', 105, yPosition, { align: 'center' });

    yPosition += 10;
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    const fechaActual = new Date().toLocaleDateString('es-EC', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    doc.text(`Generado: ${fechaActual}`, 105, yPosition, { align: 'center' });

    yPosition += 15;

    // Sección de Estadísticas
    doc.setFontSize(16);
    doc.setTextColor(30, 58, 138);
    doc.text('Estadísticas Generales', 14, yPosition);
    yPosition += 8;

    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.text(`Total Eventos: ${stats.totalEventos}`, 14, yPosition);
    yPosition += 7;
    doc.text(`Clientes Registrados: ${stats.totalClientes}`, 14, yPosition);
    yPosition += 7;
    doc.text(`Boletos Vendidos: ${stats.totalBoletos}`, 14, yPosition);
    yPosition += 7;
    doc.text(`Ingresos: $${stats.totalIngresos.toLocaleString('es-EC', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 14, yPosition);
    yPosition += 15;

    // Sección de Próximos Eventos
    doc.setFontSize(16);
    doc.setTextColor(30, 58, 138);
    doc.text('Próximos Eventos', 14, yPosition);
    yPosition += 8;

    if (eventos && eventos.length > 0) {
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);

      eventos.forEach((evento, index) => {
        if (yPosition > 270) {
          doc.addPage();
          yPosition = 20;
        }

        const fecha = new Date(evento.evt_fechainicio);
        const fechaFormateada = fecha.toLocaleDateString('es-EC', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        });
        const ciudad = evento.ciudades?.ciu_nombre || 'Ecuador';

        doc.setFontSize(11);
        doc.setFont(undefined, 'bold');
        doc.text(`${index + 1}. ${evento.evt_nombre}`, 14, yPosition);
        yPosition += 6;

        doc.setFont(undefined, 'normal');
        doc.setFontSize(10);
        doc.text(`   Fecha: ${fechaFormateada} | Ciudad: ${ciudad}`, 14, yPosition);
        yPosition += 5;
        doc.text(`   Capacidad: ${evento.evt_capacidaddisponible} asistentes`, 14, yPosition);
        yPosition += 8;
      });
    } else {
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text('No hay eventos programados próximamente', 14, yPosition);
      yPosition += 10;
    }

    yPosition += 5;

    // Sección de Ventas Recientes
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
    }

    doc.setFontSize(16);
    doc.setTextColor(30, 58, 138);
    doc.text('Ventas Recientes', 14, yPosition);
    yPosition += 8;

    if (ventas && ventas.length > 0) {
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);

      ventas.forEach((venta, index) => {
        if (yPosition > 270) {
          doc.addPage();
          yPosition = 20;
        }

        const fecha = new Date(venta.fac_fechaemision);
        const fechaFormateada = fecha.toLocaleDateString('es-EC', {
          day: '2-digit',
          month: 'short',
          hour: '2-digit',
          minute: '2-digit'
        });
        const clienteNombre = venta.clientes?.cli_nombre || 'Cliente';
        const clienteApellido = venta.clientes?.cli_apellido || '';
        const precioFormateado = `$${venta.fac_total.toLocaleString('es-EC', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        })}`;

        doc.setFontSize(11);
        doc.setFont(undefined, 'bold');
        doc.text(`${index + 1}. Factura #${venta.id_factura}`, 14, yPosition);
        yPosition += 6;

        doc.setFont(undefined, 'normal');
        doc.setFontSize(10);
        doc.text(`   Cliente: ${clienteNombre} ${clienteApellido}`, 14, yPosition);
        yPosition += 5;
        doc.text(`   Monto: ${precioFormateado} | Fecha: ${fechaFormateada}`, 14, yPosition);
        yPosition += 8;
      });
    } else {
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text('No hay ventas registradas recientemente', 14, yPosition);
      yPosition += 10;
    }

    yPosition += 5;

    // Sección de Notificaciones
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
    }

    doc.setFontSize(16);
    doc.setTextColor(30, 58, 138);
    doc.text('Notificaciones Recientes', 14, yPosition);
    yPosition += 8;

    if (notificaciones && notificaciones.length > 0) {
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);

      notificaciones.forEach((notif, index) => {
        if (yPosition > 270) {
          doc.addPage();
          yPosition = 20;
        }

        const fecha = new Date(notif.not_fechaenvio);
        const horaFormateada = fecha.toLocaleTimeString('es-EC', {
          hour: '2-digit',
          minute: '2-digit'
        });

        doc.setFontSize(11);
        doc.setFont(undefined, 'bold');
        doc.text(`${index + 1}. ${notif.not_tipo}`, 14, yPosition);
        yPosition += 6;

        doc.setFont(undefined, 'normal');
        doc.setFontSize(10);
        doc.text(`   ${notif.not_mensaje}`, 14, yPosition);
        yPosition += 5;
        doc.text(`   Estado: ${notif.not_estado} | Hora: ${horaFormateada}`, 14, yPosition);
        yPosition += 8;
      });
    } else {
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text('No hay notificaciones recientes', 14, yPosition);
    }

    // Guardar el PDF
    const nombreArchivo = `dashboard-eventmanager-${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(nombreArchivo);

    // Restaurar botón
    exportBtn.disabled = false;
    exportBtn.innerHTML = originalText;

    console.log('PDF generado exitosamente');

  } catch (error) {
    console.error('Error al exportar PDF:', error);

    // Restaurar botón en caso de error
    const exportBtn = document.getElementById('exportPdfBtn');
    if (exportBtn) {
      exportBtn.disabled = false;
      exportBtn.innerHTML = originalText || 'Exportar Dashboard a PDF';
    }

    alert('Error al generar el PDF. Por favor, intente nuevamente.');
  }
}

/**
 * Obtener datos de estadísticas para PDF
 */
async function getDashboardStats() {
  const [totalEventos, totalClientes, totalBoletos, totalIngresos] = await Promise.all([
    getTotalEventos(),
    getTotalClientes(),
    getTotalBoletos(),
    getTotalIngresos()
  ]);

  return {
    totalEventos,
    totalClientes,
    totalBoletos,
    totalIngresos
  };
}

/**
 * Obtener datos de próximos eventos para PDF
 */
async function getProximosEventosData() {
  const { data: eventos, error } = await supabase
    .from('eventos')
    .select(`
      id_eventos,
      evt_nombre,
      evt_fechainicio,
      evt_capacidaddisponible,
      ciudades (
        ciu_nombre
      )
    `)
    .eq('evt_estado', 'Programado')
    .gte('evt_fechainicio', new Date().toISOString())
    .order('evt_fechainicio', { ascending: true })
    .limit(5);

  if (error) {
    console.error('Error fetching eventos para PDF:', error);
    return [];
  }

  return eventos || [];
}

/**
 * Obtener datos de ventas recientes para PDF
 */
async function getVentasRecientesData() {
  const { data: facturas, error } = await supabase
    .from('factura')
    .select(`
      id_factura,
      fac_fechaemision,
      fac_total,
      clientes (
        cli_nombre,
        cli_apellido
      )
    `)
    .eq('fac_estado', 'Pagada')
    .order('fac_fechaemision', { ascending: false })
    .limit(5);

  if (error) {
    console.error('Error fetching ventas para PDF:', error);
    return [];
  }

  return facturas || [];
}

/**
 * Obtener datos de notificaciones para PDF
 */
async function getNotificacionesData() {
  const { data: notificaciones, error } = await supabase
    .from('notificaciones')
    .select(`
      id_notificaciones,
      not_mensaje,
      not_tipo,
      not_fechaenvio,
      not_estado
    `)
    .not('not_fechaenvio', 'is', null)
    .order('not_fechaenvio', { ascending: false })
    .limit(5);

  if (error) {
    console.error('Error fetching notificaciones para PDF:', error);
    return [];
  }

  return notificaciones || [];
}

/**
 * Inicializar dashboard
 */
function initializeDashboard() {
  console.log('Inicializando dashboard...');

  const user = stateManager.getCurrentUser();
  if (user) {
    console.log('Usuario autenticado:', user.Usuario_Nombre);
  }

  loadDashboardStats();
  loadProximosEventos();
  loadVentasRecientes();
  loadNotificaciones();

  // Agregar event listener al botón de exportar PDF
  const exportBtn = document.getElementById('exportPdfBtn');
  if (exportBtn) {
    exportBtn.addEventListener('click', exportDashboardToPDF);
  }

  stateManager.addToNavigationHistory('dashboard');

  console.log('Dashboard inicializado correctamente');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeDashboard);
} else {
  initializeDashboard();
}

export {
  loadDashboardStats,
  loadProximosEventos,
  getTotalEventos,
  getTotalClientes,
  getTotalBoletos,
  getTotalIngresos
};