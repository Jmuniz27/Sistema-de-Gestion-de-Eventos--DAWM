import { supabase } from '../scripts/supabase-client.js';

const form = document.getElementById('eventoForm');
const formMsg = document.getElementById('formMsg');
const eventosCreados = document.getElementById('eventosCreados');
const ciudadesSelect = document.getElementById('id_ciudades_fk');

// Cargar ciudades en el select
async function cargarCiudades() {
  const { data, error } = await supabase.from('ciudades').select('id_ciudades, ciu_nombre');
  if (error) {
    ciudadesSelect.innerHTML = '<option value="">Error al cargar ciudades</option>';
    return;
  }
  ciudadesSelect.innerHTML = data.map(c => `<option value="${c.id_ciudades}">${c.ciu_nombre}</option>`).join('');
}

// Mostrar eventos creados
async function mostrarEventos() {
  const { data, error } = await supabase
    .from('eventos')
    .select('id_eventos, evt_nombre, evt_fechainicio, evt_imagenportada')
    .order('evt_fechainicio', { ascending: false })
    .limit(10);
  if (error) {
    eventosCreados.innerHTML = '<div class="error-msg">Error al cargar eventos</div>';
    return;
  }
  if (!data || data.length === 0) {
    eventosCreados.innerHTML = '<div>No hay eventos creados aún.</div>';
    return;
  }
  eventosCreados.innerHTML = data.map(e => `
    <div class="event-card">
      <img src="${e.evt_imagenportada || 'https://via.placeholder.com/120x80/2E4A8B/FFFFFF?text=Evento'}" alt="${e.evt_nombre}">
      <div class="event-card-content">
        <strong>${e.evt_nombre}</strong><br>
        <span>${new Date(e.evt_fechainicio).toLocaleString('es-EC')}</span>
      </div>
    </div>
  `).join('');
}

// Crear evento
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  formMsg.textContent = '';
  const fd = new FormData(form);
  const evento = {
    evt_nombre: fd.get('evt_nombre'),
    evt_descripcion: fd.get('evt_descripcion'),
    evt_fechainicio: fd.get('evt_fechainicio'),
    evt_fechafin: fd.get('evt_fechafin') || null,
    evt_direccion: fd.get('evt_direccion'),
    id_ciudades_fk: parseInt(fd.get('id_ciudades_fk')),
    evt_capacidadtotal: parseInt(fd.get('evt_capacidadtotal')),
    evt_capacidaddisponible: parseInt(fd.get('evt_capacidaddisponible')),
    evt_preciobasegeneral: parseFloat(fd.get('evt_preciobasegeneral')),
    evt_estado: fd.get('evt_estado'),
    evt_imagenportada: fd.get('evt_imagenportada'),
    id_modulo: 'eventos'
  };
  // Validación básica
  if (!evento.evt_nombre || !evento.evt_fechainicio || !evento.id_ciudades_fk) {
    formMsg.textContent = 'Completa los campos obligatorios.';
    formMsg.className = 'error-msg';
    return;
  }
  // Insertar en Supabase
  const { error } = await supabase.from('eventos').insert([evento]);
  if (error) {
    formMsg.textContent = 'Error al crear evento: ' + error.message;
    formMsg.className = 'error-msg';
    return;
  }
  formMsg.textContent = 'Evento creado exitosamente.';
  formMsg.className = 'success-msg';
  form.reset();
  mostrarEventos();
});

// Inicializar
cargarCiudades();
mostrarEventos();
