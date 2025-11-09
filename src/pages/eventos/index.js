import * as evt from '../../scripts/modules/eventos.js';

async function cargarEventos() {
	const contenedor = document.getElementById('eventos-container');

	// Mostrar loading
	contenedor.innerHTML = `
		<div class="loading">
		  <div class="loading-spinner"></div>
		  <p>Cargando los eventos...</p>
		</div>
	`;
	
	//Cargar los eventos que existen
	const detalleEventoLista = evt.obtenerDetalleEvento();
	for(let i=0; i<detalleEventoLista.length; i++){
		const idEvento = detalleEventoLista[i].id_eventos_fk;
		const idTipoIngreso = detalleEventoLista[i].id_tipoingreso_fk;
		const idCategoriaEvento = detalleEventoLista[i].id_categoriaevento_fk;
		
		const evento = evt.obtenerEventoPorId(idEvento);
		const tipoIngreso = evt.obtenerTipoIngresoPorId(idTipoIngreso);
		const categoriaEvento = evt.obtenerCategoriaEventoPorId(idCategoriaEvento);
		
		//Datos a mostrar por cada tarjeta de evento
		const nombre = evento.evt_nombre;
		const fechaIn = evento.evt_fechainicio;
		const fechaFn = evento.evt_fechafin;
		const capacidadTot = evento.evt_capacidadtotal;
		const estado = evento.evt_estado;
		const imagenPortada = evento.evt_imagenportada;
		const ingreso = tipoIngreso.ting_nombre;
		const categoria = categoriaEvento.catevt_nombre;
		
		//Prueba
		var contenido = `
			<div class="event-card">
				<img src="${imagenPortada || 'https://via.placeholder.com/120x80/2E4A8B/FFFFFF?text=Evento'}" alt="${nombre}">
				<div class="event-card-content">
					<strong>${nombre}</strong><br>
					<span>${new Date(fechaIn).toLocaleString('es-EC')}</span>
				</div>
			</div>
		`;
		
		contenedor.innerHTML = contenedor;
	}
	
}

document.addEventListener('DOMContentLoaded', function(){
	cargarEventos();
});