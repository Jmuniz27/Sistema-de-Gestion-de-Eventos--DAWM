# Sistema de Gestión de Estado Global - EventManager

## StateManager

El `StateManager` es un sistema de gestión de estado global que permite compartir datos entre diferentes páginas y componentes de la aplicación.

### Características Principales

1. **Gestión de Usuario Autenticado** - Mantiene información del usuario logueado
2. **Compartir Datos de Eventos** - Permite pasar información completa de eventos entre páginas
3. **Persistencia de Datos** - Usa localStorage y sessionStorage
4. **Sistema de Observadores** - Permite reactividad en componentes

---

## Uso Básico

### Importar el StateManager

```javascript
import stateManager from './state-manager.js';
```

O acceder globalmente (sin módulos ES6):

```javascript
const stateManager = window.StateManager;
```

---

## Gestión de Usuario

### Obtener Usuario Actual

```javascript
const user = stateManager.getCurrentUser();

if (user) {
  console.log('Usuario:', user.Usuario_Nombre);
  console.log('Email:', user.Usuario_Email);
} else {
  console.log('No hay usuario autenticado');
}
```

### Verificar si está Autenticado

```javascript
if (stateManager.isAuthenticated()) {
  // Usuario está logueado
  showDashboard();
} else {
  // Redirigir a login
  window.location.href = '/pages/login.html';
}
```

### Establecer Usuario (Después del Login)

```javascript
// En tu página de login, después de autenticar:
const userData = {
  id_Usuario: 1,
  Usuario_Nombre: 'Juan',
  Usuario_Apellido: 'Pérez',
  Usuario_Email: 'juan@example.com',
  Usuario_Rol: 'cliente'
};

stateManager.setCurrentUser(userData);
```

### Cerrar Sesión

```javascript
stateManager.logout();
// Esto limpia toda la información del usuario y redirige
window.location.href = '/index.html';
```

---

## Compartir Datos de Eventos entre Páginas

### Escenario: Landing → Detalle de Evento

**En la página Landing (index.html):**

```javascript
// Cuando el usuario hace click en un evento
async function handleEventClick(eventId) {
  // 1. Obtener datos completos del evento desde Supabase
  const { data: evento } = await supabase
    .from('Eventos')
    .select('*, Ciudades(*), Detalle_Eventos(*)')
    .eq('id_Eventos', eventId)
    .single();

  // 2. Guardar en el estado global
  stateManager.setSelectedEvent(evento);

  // 3. Redirigir a la página de detalles
  window.location.href = `/pages/evento-detalle.html?id=${eventId}`;
}
```

**En la página de Detalle (evento-detalle.html):**

```javascript
// Obtener el evento seleccionado
const evento = stateManager.getSelectedEvent();

if (evento) {
  // Usar los datos del evento
  document.getElementById('eventTitle').textContent = evento.Evt_Nombre;
  document.getElementById('eventPrice').textContent = `$${evento.Evt_PrecioBaseGeneral}`;
  document.getElementById('eventCapacity').textContent = evento.Evt_CapacidadDisponible;

  // Todos los datos del evento están disponibles
  console.log('Datos completos:', evento);
} else {
  // Si no hay evento en el estado, obtenerlo desde el URL
  const urlParams = new URLSearchParams(window.location.search);
  const eventId = urlParams.get('id');
  // Fetch del evento...
}
```

### Limpiar Evento Seleccionado

```javascript
// Cuando el usuario sale de la página de detalles
stateManager.clearSelectedEvent();
```

---

## Almacenamiento de Datos

### Datos de Sesión (se borran al cerrar el navegador)

```javascript
// Guardar
stateManager.setSessionData('filtrosActuales', {
  categoria: 'Rock',
  ciudad: 'Guayaquil',
  precioMax: 100
});

// Obtener
const filtros = stateManager.getSessionData('filtrosActuales');
console.log(filtros); // { categoria: 'Rock', ciudad: 'Guayaquil', precioMax: 100 }
```

### Datos Persistentes (permanecen después de cerrar el navegador)

```javascript
// Guardar
stateManager.setPersistentData('preferencias', {
  tema: 'oscuro',
  idioma: 'es',
  notificaciones: true
});

// Obtener
const preferencias = stateManager.getPersistentData('preferencias');

// Eliminar
stateManager.removePersistentData('preferencias');
```

---

## Carrito de Compras (para Módulo de Boletos)

### Agregar al Carrito

```javascript
stateManager.addToCart({
  id: 'boleto-123',
  eventoId: 5,
  tipoIngreso: 'VIP',
  cantidad: 2,
  precio: 150.00,
  total: 300.00
});
```

### Obtener Carrito

```javascript
const cart = stateManager.getCart();
console.log('Items en carrito:', cart.length);

cart.forEach(item => {
  console.log(`${item.cantidad}x ${item.tipoIngreso} - $${item.total}`);
});
```

### Eliminar del Carrito

```javascript
stateManager.removeFromCart('boleto-123');
```

### Limpiar Carrito

```javascript
// Después de completar la compra
stateManager.clearCart();
```

---

## Sistema de Observadores (Reactividad)

### Suscribirse a Cambios

```javascript
// Componente que se actualiza cuando cambia el usuario
const unsubscribe = stateManager.subscribe('userChanged', (user) => {
  if (user) {
    document.getElementById('userName').textContent = user.Usuario_Nombre;
    document.getElementById('loginBtn').style.display = 'none';
    document.getElementById('logoutBtn').style.display = 'block';
  } else {
    document.getElementById('userName').textContent = '';
    document.getElementById('loginBtn').style.display = 'block';
    document.getElementById('logoutBtn').style.display = 'none';
  }
});

// Para desuscribirse (importante cuando se destruye el componente)
unsubscribe();
```

### Eventos Disponibles

- `userChanged` - Se dispara cuando el usuario cambia (login/logout)
- `cartChanged` - Se dispara cuando el carrito se modifica

---

## Historial de Navegación

### Registrar Navegación

```javascript
// En cada página, registrar la visita
stateManager.addToNavigationHistory('evento-detalle');
```

### Obtener Historial

```javascript
const history = stateManager.getNavigationHistory();
console.log('Páginas visitadas:', history);
// [
//   { page: 'landing', timestamp: '2025-11-05T...' },
//   { page: 'evento-detalle', timestamp: '2025-11-05T...' }
// ]
```

---

## Debugging

### Exportar Estado Completo

```javascript
const estado = stateManager.exportState();
console.log('Estado completo de la aplicación:', estado);
// {
//   user: { ... },
//   selectedEvent: { ... },
//   cart: [ ... ],
//   navigationHistory: [ ... ]
// }
```

---

## Ejemplo Completo: Flujo de Compra

```javascript
// 1. Usuario selecciona un evento en landing
function selectEvent(eventId) {
  const evento = await fetchEventDetails(eventId);
  stateManager.setSelectedEvent(evento);
  window.location.href = `/pages/evento-detalle.html?id=${eventId}`;
}

// 2. En página de detalles, usuario agrega boletos al carrito
function addTicketsToCart() {
  const evento = stateManager.getSelectedEvent();

  stateManager.addToCart({
    id: `ticket-${Date.now()}`,
    eventoId: evento.id_Eventos,
    eventoNombre: evento.Evt_Nombre,
    tipoIngreso: 'General',
    cantidad: 2,
    precioUnitario: evento.Evt_PrecioBaseGeneral,
    total: evento.Evt_PrecioBaseGeneral * 2
  });

  window.location.href = '/pages/carrito.html';
}

// 3. En página de carrito, mostrar items
function showCart() {
  const cart = stateManager.getCart();
  const total = cart.reduce((sum, item) => sum + item.total, 0);

  renderCartItems(cart);
  document.getElementById('totalPrice').textContent = `$${total.toFixed(2)}`;
}

// 4. Después de pagar, limpiar carrito
function completePurchase() {
  const user = stateManager.getCurrentUser();

  if (!user) {
    alert('Debes iniciar sesión para completar la compra');
    window.location.href = '/pages/login.html';
    return;
  }

  const cart = stateManager.getCart();
  // Procesar pago...

  stateManager.clearCart();
  window.location.href = '/pages/confirmacion.html';
}
```

---

## Mejores Prácticas

1. **Siempre verificar autenticación** antes de mostrar datos sensibles
2. **Limpiar datos** cuando ya no se necesiten (clearSelectedEvent, clearCart)
3. **Usar sessionStorage** para datos temporales (filtros, búsquedas)
4. **Usar localStorage** para datos que deben persistir (preferencias, carrito)
5. **Subscribirse a eventos** para mantener UI actualizada
6. **Desuscribirse** cuando se destruye un componente para evitar memory leaks

---

## Seguridad

⚠️ **IMPORTANTE**: El StateManager usa localStorage y sessionStorage, que son accesibles desde JavaScript.

- ❌ NO guardes contraseñas en texto plano
- ❌ NO guardes tokens de sesión sensibles
- ✅ Usa solo para datos de UI y estado de la aplicación
- ✅ Valida siempre en el servidor, no confíes solo en el estado del cliente
