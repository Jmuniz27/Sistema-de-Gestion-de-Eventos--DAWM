# Guía de Uso de la Base de Datos Supabase

Esta guía explica cómo conectarte y trabajar con la base de datos PostgreSQL de Supabase en el Sistema de Gestión de Eventos.

## 📋 Tabla de Contenidos

1. [Configuración Inicial](#configuración-inicial)
2. [Conexión a la Base de Datos](#conexión-a-la-base-de-datos)
3. [Operaciones CRUD Básicas](#operaciones-crud-básicas)
4. [Consultas Avanzadas](#consultas-avanzadas)
5. [Row Level Security (RLS)](#row-level-security-rls)
6. [Autenticación](#autenticación)
7. [Buenas Prácticas](#buenas-prácticas)
8. [Solución de Problemas](#solución-de-problemas)

---

## 🚀 Configuración Inicial

### 1. Obtener Credenciales de Supabase

1. Ve a [Supabase Dashboard](https://supabase.com/dashboard)
2. Selecciona tu proyecto
3. Ve a **Settings → API**
4. Copia:
   - **Project URL** (ejemplo: `https://tuproyecto.supabase.co`)
   - **anon public** key (clave pública segura para el frontend)

### 2. Configurar Variables de Entorno

```bash
# Copia el archivo de ejemplo
cp .env.example .env

# Edita .env con tus credenciales
VITE_SUPABASE_URL=https://tuproyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu_clave_anonima_aqui
```

### 3. Instalar Dependencias

```bash
npm install
```

---

## 🔌 Conexión a la Base de Datos

### Usando el Cliente de Supabase

El archivo `lib/supabase.js` ya tiene configurado el cliente:

```javascript
import { supabase } from './lib/supabase.js';

// Probar la conexión
import { testConnection } from './lib/supabase.js';

const resultado = await testConnection();
console.log(resultado.message);
// ✅ Conexión exitosa a Supabase
```

### Verificar Autenticación

```javascript
import { getCurrentUser, getUserRole } from './lib/supabase.js';

// Obtener usuario actual
const usuario = await getCurrentUser();
console.log(usuario?.email);

// Obtener rol del usuario
const rol = await getUserRole();
console.log(rol); // "Administrador", "Vendedor", etc.
```

---

## 📝 Operaciones CRUD Básicas

### CREATE - Crear Registros

```javascript
import { crearCliente } from './examples/clientes-crud.js';

const nuevoCliente = await crearCliente({
  nombre: 'María',
  apellido: 'González',
  email: 'maria.gonzalez@example.com',
  celular: '0987654321',
  tipoCliente: 1  // ID del tipo de cliente
});

if (nuevoCliente.success) {
  console.log('Cliente creado:', nuevoCliente.data);
}
```

**Sintaxis directa con Supabase:**

```javascript
import { supabase } from './lib/supabase.js';

const { data, error } = await supabase
  .from('Clientes')
  .insert([
    {
      Cli_Nombre: 'Juan',
      Cli_Apellido: 'Pérez',
      Cli_Email: 'juan.perez@example.com',
      Cli_Celular: '0999888777',
      id_TipoCliente_Fk: 1
    }
  ])
  .select();

if (error) {
  console.error('Error:', error.message);
} else {
  console.log('Creado:', data[0]);
}
```

### READ - Leer Registros

**Obtener todos los registros:**

```javascript
const { data, error } = await supabase
  .from('Eventos')
  .select('*');
```

**Obtener con filtros:**

```javascript
// Eventos activos
const { data, error } = await supabase
  .from('Eventos')
  .select('*')
  .eq('Evt_Estado', 'Programado');

// Búsqueda por texto (like)
const { data, error } = await supabase
  .from('Eventos')
  .select('*')
  .ilike('Evt_Nombre', '%concierto%');
```

**Obtener con relaciones (JOIN):**

```javascript
const { data, error } = await supabase
  .from('Eventos')
  .select(`
    id_Eventos,
    Evt_Nombre,
    Evt_FechaInicio,
    Ciudades (
      Ciu_Nombre,
      Provincias (Prov_Nombre)
    ),
    CategoriaEvento (CatEvt_Nombre)
  `);

// Resultado incluirá datos relacionados de otras tablas
```

**Obtener un solo registro:**

```javascript
const { data, error } = await supabase
  .from('Clientes')
  .select('*')
  .eq('id_Clientes', 5)
  .single();  // Retorna un objeto, no un array
```

### UPDATE - Actualizar Registros

```javascript
const { data, error } = await supabase
  .from('Clientes')
  .update({
    Cli_Celular: '0998765432',
    Cli_FechaUltimaModificacion: new Date().toISOString()
  })
  .eq('id_Clientes', 5)
  .select();

if (!error) {
  console.log('Cliente actualizado:', data[0]);
}
```

**Actualizar múltiples registros:**

```javascript
// Cambiar estado de todos los eventos pasados
const { data, error } = await supabase
  .from('Eventos')
  .update({ Evt_Estado: 'Finalizado' })
  .lt('Evt_FechaFin', new Date().toISOString())
  .select();
```

### DELETE - Eliminar Registros

**Soft Delete (Recomendado):**

```javascript
// Cambiar estado en lugar de eliminar
const { data, error } = await supabase
  .from('Clientes')
  .update({ Cli_Estado: 'Inactivo' })
  .eq('id_Clientes', 5)
  .select();
```

**Hard Delete (Permanente):**

```javascript
// ⚠️ Esta operación es irreversible
const { error } = await supabase
  .from('Clientes')
  .delete()
  .eq('id_Clientes', 5);
```

---

## 🔍 Consultas Avanzadas

### Paginación

```javascript
const pagina = 1;
const porPagina = 10;
const inicio = (pagina - 1) * porPagina;
const fin = inicio + porPagina - 1;

const { data, error, count } = await supabase
  .from('Eventos')
  .select('*', { count: 'exact' })
  .range(inicio, fin)
  .order('Evt_FechaInicio', { ascending: true });

const totalPaginas = Math.ceil(count / porPagina);
console.log(`Página ${pagina} de ${totalPaginas}`);
```

### Ordenamiento

```javascript
// Orden ascendente
const { data } = await supabase
  .from('Eventos')
  .select('*')
  .order('Evt_FechaInicio', { ascending: true });

// Orden descendente (más recientes primero)
const { data } = await supabase
  .from('Clientes')
  .select('*')
  .order('Cli_FechaRegistro', { ascending: false });

// Ordenar por múltiples campos
const { data } = await supabase
  .from('Boletos')
  .select('*')
  .order('id_Eventos_Fk', { ascending: true })
  .order('Bol_FechaCompra', { ascending: false });
```

### Filtros Múltiples

```javascript
// AND - Todas las condiciones deben cumplirse
const { data } = await supabase
  .from('Eventos')
  .select('*')
  .eq('Evt_Estado', 'Programado')
  .gte('Evt_FechaInicio', '2025-01-01')
  .lte('Evt_PrecioBaseGeneral', 100);

// OR - Al menos una condición debe cumplirse
const { data } = await supabase
  .from('Clientes')
  .select('*')
  .or('Cli_Estado.eq.Activo,Cli_Estado.eq.Suspendido');
```

### Operadores de Comparación

```javascript
// Igual a
.eq('Cli_Estado', 'Activo')

// No igual a
.neq('Evt_Estado', 'Cancelado')

// Mayor que
.gt('Evt_CapacidadDisponible', 100)

// Mayor o igual que
.gte('Evt_FechaInicio', '2025-01-01')

// Menor que
.lt('Evt_PrecioBaseGeneral', 50)

// Menor o igual que
.lte('Evt_FechaFin', '2025-12-31')

// En una lista de valores
.in('Evt_Estado', ['Programado', 'EnCurso'])

// Búsqueda de texto (case insensitive)
.ilike('Cli_Email', '%gmail.com%')

// Búsqueda de texto (case sensitive)
.like('Evt_Nombre', 'Concierto%')

// IS NULL
.is('Cli_Telefono', null)

// NOT NULL
.not('Cli_Email', 'is', null)
```

### Contar Registros

```javascript
// Contar sin obtener datos
const { count, error } = await supabase
  .from('Clientes')
  .select('*', { count: 'exact', head: true })
  .eq('Cli_Estado', 'Activo');

console.log(`Total de clientes activos: ${count}`);
```

### Agregaciones

```javascript
// Sumar valores
const { data } = await supabase
  .from('Boletos')
  .select('Bol_Precio')
  .eq('id_Eventos_Fk', 1);

const totalIngresos = data.reduce((sum, b) => sum + parseFloat(b.Bol_Precio), 0);
console.log(`Ingresos totales: $${totalIngresos.toFixed(2)}`);
```

---

## 🔒 Row Level Security (RLS)

La base de datos tiene políticas de seguridad a nivel de fila configuradas.

### Políticas Implementadas

#### Tablas Públicas (Sin autenticación)
- `Provincias`, `Ciudades`
- `CategoriaEvento`, `TipoIngreso`
- `EstadoGestion`, `TipoCliente`

Cualquier usuario puede leer estos datos:

```javascript
// No requiere autenticación
const { data } = await supabase
  .from('Provincias')
  .select('*');
```

#### Tablas Protegidas (Requieren autenticación)

**Clientes:**
- Los clientes solo ven sus propios datos
- Staff (Administrador, Gerente, Vendedor) ve todos los clientes

```javascript
// Un cliente solo verá su propio registro
const { data } = await supabase
  .from('Clientes')
  .select('*')
  .eq('Cli_Email', user.email);
```

**Eventos:**
- Todos pueden ver eventos programados
- Solo staff puede crear/modificar eventos

**Usuarios:**
- Solo administradores pueden gestionar usuarios

### Verificar Rol del Usuario

```javascript
import { getUserRole } from './lib/supabase.js';

const rol = await getUserRole();

if (rol === 'Administrador') {
  // Acceso completo
} else if (rol === 'Vendedor') {
  // Acceso limitado
} else {
  // Usuario normal
}
```

---

## 🔐 Autenticación

### Registrar Usuario

```javascript
const { data, error } = await supabase.auth.signUp({
  email: 'usuario@example.com',
  password: 'contraseña_segura'
});

if (!error) {
  console.log('Usuario creado:', data.user);
}
```

### Iniciar Sesión

```javascript
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'usuario@example.com',
  password: 'contraseña_segura'
});

if (!error) {
  console.log('Sesión iniciada:', data.user);
}
```

### Cerrar Sesión

```javascript
const { error } = await supabase.auth.signOut();
```

### Obtener Usuario Actual

```javascript
const { data: { user } } = await supabase.auth.getUser();
console.log(user?.email);
```

### Escuchar Cambios de Autenticación

```javascript
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Evento:', event);
  console.log('Usuario:', session?.user);
});
```

---

## ✅ Buenas Prácticas

### 1. Manejo de Errores

```javascript
const { data, error } = await supabase
  .from('Clientes')
  .select('*');

if (error) {
  console.error('Error al obtener clientes:', error.message);
  // Mostrar mensaje al usuario
  return { success: false, message: 'No se pudieron cargar los clientes' };
}

// Continuar con los datos
return { success: true, data };
```

### 2. Validación de Datos

```javascript
function validarCliente(cliente) {
  if (!cliente.nombre || !cliente.apellido) {
    return { valido: false, error: 'Nombre y apellido son requeridos' };
  }

  if (!cliente.email || !cliente.email.includes('@')) {
    return { valido: false, error: 'Email inválido' };
  }

  return { valido: true };
}

// Usar antes de insertar
const validacion = validarCliente(nuevoCliente);
if (!validacion.valido) {
  console.error(validacion.error);
  return;
}
```

### 3. Transacciones y Consistencia

```javascript
// Al vender un boleto, actualizar capacidad del evento
async function venderBoleto(eventoId, clienteId) {
  try {
    // 1. Verificar capacidad disponible
    const { data: evento } = await supabase
      .from('Eventos')
      .select('Evt_CapacidadDisponible')
      .eq('id_Eventos', eventoId)
      .single();

    if (evento.Evt_CapacidadDisponible <= 0) {
      return { success: false, error: 'Sin capacidad disponible' };
    }

    // 2. Crear boleto
    const { data: boleto, error: errorBoleto } = await supabase
      .from('Boletos')
      .insert([{ id_Eventos_Fk: eventoId, id_Clientes_Fk: clienteId }])
      .select();

    if (errorBoleto) throw errorBoleto;

    // 3. Reducir capacidad
    const { error: errorCapacidad } = await supabase
      .from('Eventos')
      .update({ Evt_CapacidadDisponible: evento.Evt_CapacidadDisponible - 1 })
      .eq('id_Eventos', eventoId);

    if (errorCapacidad) throw errorCapacidad;

    return { success: true, data: boleto[0] };

  } catch (error) {
    console.error('Error en transacción:', error);
    return { success: false, error };
  }
}
```

### 4. Usar Select Específico

```javascript
// ❌ Malo: Traer todos los campos cuando no se necesitan
const { data } = await supabase
  .from('Eventos')
  .select('*');

// ✅ Bueno: Solo traer los campos necesarios
const { data } = await supabase
  .from('Eventos')
  .select('id_Eventos, Evt_Nombre, Evt_FechaInicio');
```

### 5. Limitar Resultados

```javascript
// Siempre limitar resultados en búsquedas
const { data } = await supabase
  .from('Clientes')
  .select('*')
  .limit(100);
```

---

## 🔧 Solución de Problemas

### Error: "Invalid API Key"

**Causa:** Las credenciales en `.env` son incorrectas.

**Solución:**
1. Verifica que copiaste correctamente las credenciales desde Supabase Dashboard
2. Asegúrate de que el archivo `.env` existe y está en la raíz del proyecto
3. Reinicia el servidor de desarrollo después de modificar `.env`

### Error: "Row Level Security policy violation"

**Causa:** El usuario no tiene permisos para acceder a esos datos.

**Solución:**
1. Verifica que el usuario esté autenticado
2. Comprueba que el rol del usuario tiene permisos para esa operación
3. Revisa las políticas RLS en Supabase Dashboard → Authentication → Policies

### Error: "relation does not exist"

**Causa:** La tabla no existe en la base de datos.

**Solución:**
1. Verifica que ejecutaste los scripts SQL en orden:
   - `database/schema.sql`
   - `database/seed.sql`
   - `database/policies.sql`
2. Comprueba el nombre de la tabla (case-sensitive en PostgreSQL)

### No se pueden crear registros

**Solución:**
1. Verifica que todos los campos requeridos (`NOT NULL`) estén presentes
2. Comprueba que las foreign keys referencian registros existentes
3. Revisa que el usuario tenga permisos de INSERT en esa tabla

### Las relaciones no retornan datos

**Solución:**
```javascript
// ❌ Malo: Sintaxis incorrecta
.select('*, Ciudades')

// ✅ Bueno: Sintaxis correcta
.select('*, Ciudades(*)')

// ✅ Mejor: Especificar campos
.select(`
  *,
  Ciudades (
    Ciu_Nombre,
    Provincias (Prov_Nombre)
  )
`)
```

---

## 📚 Recursos Adicionales

- [Documentación oficial de Supabase](https://supabase.com/docs)
- [Supabase JS Client Reference](https://supabase.com/docs/reference/javascript/introduction)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)

---

## 🆘 Soporte

Si tienes problemas:

1. Revisa esta guía primero
2. Consulta los ejemplos en `/examples`
3. Revisa la documentación de Supabase
4. Contacta al equipo de desarrollo

---

**Última actualización:** Octubre 2025
