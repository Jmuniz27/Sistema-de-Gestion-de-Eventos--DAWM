# Orden de Ejecución de Scripts SQL en Supabase

Esta guía detalla el orden correcto para ejecutar los scripts SQL en el SQL Editor de Supabase.

## 📋 Pre-requisitos

1. ✅ Tener una cuenta en [Supabase](https://supabase.com)
2. ✅ Haber creado un proyecto en Supabase
3. ✅ Tener acceso al **SQL Editor** del proyecto
4. ✅ Tener las credenciales de Supabase (URL y ANON KEY) copiadas

## 🚀 Orden de Ejecución

### Paso 1: Schema (Estructura de la Base de Datos)

**Archivo:** `database/schema.sql`

**Qué hace:**
- Crea extensiones necesarias (uuid-ossp)
- Crea las 30 tablas del sistema
- Define claves primarias (PKs) y foráneas (FKs)
- Establece constraints (NOT NULL, UNIQUE, CHECK)
- Crea índices para optimización
- Agrega comentarios a las tablas

**Cómo ejecutar:**

1. Abre Supabase Dashboard → Tu Proyecto
2. Ve a **SQL Editor** en el menú lateral
3. Click en **"New Query"**
4. Copia y pega todo el contenido de `database/schema.sql`
5. Click en **"Run"** (o presiona `Ctrl+Enter`)
6. ✅ Verifica que aparezca "Success. No rows returned"

**Tiempo estimado:** 5-10 segundos

**⚠️ Importante:**
- Si ves errores de "relation already exists", significa que las tablas ya existen
- Puedes eliminarlas con `DROP TABLE nombre_tabla CASCADE;` o crear un nuevo proyecto
- Asegúrate de que **NO** haya errores antes de continuar

---

### Paso 2: Seed Data (Datos Iniciales)

**Archivo:** `database/seed.sql`

**Qué hace:**
- Inserta datos de catálogos (provincias, ciudades, géneros, etc.)
- Crea 12 clientes de ejemplo
- Registra 15 eventos (conciertos ecuatorianos)
- Genera 21 boletos con diferentes precios
- Crea 10 facturas con IVA 15%
- Inserta plantillas de notificaciones
- Configura 7 roles y 6 usuarios del sistema

**Cómo ejecutar:**

1. En SQL Editor, click en **"New Query"**
2. Copia y pega todo el contenido de `database/seed.sql`
3. Click en **"Run"**
4. ✅ Verifica que aparezca "Success. No rows returned"

**Tiempo estimado:** 10-15 segundos

**⚠️ Importante:**
- Este archivo inserta **MUCHOS** datos (500+ registros)
- Si ves error de "duplicate key value", significa que algunos datos ya existen
- Para reiniciar desde cero: elimina todas las filas con `DELETE FROM nombre_tabla;`
- Los datos son ficticios pero realistas para desarrollo/testing
- **NO usar en producción** sin revisar/adaptar

**💡 Tip:** Después de ejecutar, verifica los datos:
```sql
-- Ver provincias insertadas
SELECT * FROM Provincias;

-- Ver eventos
SELECT Evt_Nombre, Evt_Lugar, Evt_FechaInicio FROM Eventos;

-- Contar clientes
SELECT COUNT(*) FROM Clientes;
```

---

### Paso 3: Policies (Seguridad Row Level Security)

**Archivo:** `database/policies.sql`

**Qué hace:**
- Crea 4 funciones auxiliares para gestión de roles
- Habilita Row Level Security (RLS) en las 30 tablas
- Define políticas de acceso por rol:
  - **Administrador**: Acceso total
  - **Gerente**: Lectura/escritura sin eliminación
  - **Vendedor**: CRUD limitado
  - **Operador**: Operaciones específicas
  - **Cliente**: Solo sus propios datos
  - **Público (anon)**: Solo catálogos
- Establece permisos GRANT a nivel de tabla

**Cómo ejecutar:**

1. En SQL Editor, click en **"New Query"**
2. Copia y pega todo el contenido de `database/policies.sql`
3. Click en **"Run"**
4. ✅ Verifica que aparezca "Success. No rows returned"

**Tiempo estimado:** 15-20 segundos

**⚠️ Importante:**
- Las políticas RLS son **CRÍTICAS** para la seguridad
- Sin RLS, cualquier usuario podría acceder a todos los datos
- Las políticas se basan en `auth.email()` (usuario autenticado de Supabase Auth)
- Probar exhaustivamente con diferentes roles antes de producción

**💡 Tip:** Verifica que RLS esté habilitado:
```sql
-- Ver tablas con RLS habilitado
SELECT schemaname, tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public';
```

**🔒 Seguridad:** Las políticas protegen:
- Datos de clientes (solo ven sus propias facturas)
- Información de LOGIN (solo admins)
- Proveedores (solo gerentes y admins)
- Notificaciones personales

---

### Paso 4: Functions (Opcional - Funciones Adicionales)

**Archivo:** `database/functions.sql`

**Qué hace:**
- Define funciones personalizadas (triggers, validaciones, cálculos)
- Automatiza operaciones comunes

**Cómo ejecutar:**

1. En SQL Editor, click en **"New Query"**
2. Copia y pega todo el contenido de `database/functions.sql`
3. Click en **"Run"**

**⚠️ Nota:** Este archivo actualmente tiene solo ejemplos comentados. Se completará según necesidades del proyecto.

---

## 🔄 Resumen del Orden

```
1. schema.sql      →  Estructura (tablas, FKs, constraints)
                      ↓
2. seed.sql        →  Datos iniciales (catálogos, ejemplos)
                      ↓
3. policies.sql    →  Seguridad (RLS, permisos)
                      ↓
4. functions.sql   →  Funciones personalizadas (opcional)
```

## ✅ Verificación Post-Instalación

Después de ejecutar todos los scripts, verifica que todo esté correcto:

### 1. Contar tablas creadas
```sql
SELECT COUNT(*)
FROM information_schema.tables
WHERE table_schema = 'public';
-- Debe retornar: 30 tablas
```

### 2. Verificar datos insertados
```sql
-- Módulo General
SELECT COUNT(*) FROM Provincias;        -- 24 provincias
SELECT COUNT(*) FROM Ciudades;          -- 21 ciudades

-- Módulo Clientes
SELECT COUNT(*) FROM Clientes;          -- 12 clientes

-- Módulo Eventos
SELECT COUNT(*) FROM Eventos;           -- 15 eventos

-- Módulo Boletos
SELECT COUNT(*) FROM Boletos;           -- 21 boletos

-- Módulo Facturación
SELECT COUNT(*) FROM Factura;           -- 10 facturas

-- Módulo Autenticación
SELECT COUNT(*) FROM ROLES;             -- 7 roles
SELECT COUNT(*) FROM USUARIOS;          -- 6 usuarios
```

### 3. Verificar RLS habilitado
```sql
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
  AND rowsecurity = true;
-- Debe retornar: 30 tablas con rowsecurity = true
```

### 4. Verificar políticas creadas
```sql
SELECT schemaname, tablename, policyname
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename;
-- Debe retornar múltiples políticas por tabla
```

### 5. Probar consulta básica
```sql
SELECT
  Evt_Nombre,
  Evt_Lugar,
  Evt_FechaInicio,
  Evt_PrecioBaseGeneral
FROM Eventos
WHERE Evt_Estado = 'Programado'
ORDER BY Evt_FechaInicio
LIMIT 5;
```

## ❌ Solución de Problemas

### Problema: "relation already exists"
**Causa:** Las tablas ya fueron creadas previamente
**Solución:**
```sql
-- Opción 1: Eliminar todas las tablas (CUIDADO: Borra TODO)
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;

-- Opción 2: Eliminar tablas individuales
DROP TABLE nombre_tabla CASCADE;
```

### Problema: "duplicate key value violates unique constraint"
**Causa:** Los datos ya fueron insertados
**Solución:**
```sql
-- Limpiar datos de todas las tablas (mantiene estructura)
TRUNCATE TABLE Clientes, Eventos, Boletos, Factura
RESTART IDENTITY CASCADE;
```

### Problema: "permission denied for schema public"
**Causa:** Permisos insuficientes
**Solución:** Verificar que estás usando el usuario correcto (postgres o service_role)

### Problema: Las políticas RLS bloquean todo
**Causa:** Usuario no tiene rol asignado
**Solución:**
```sql
-- Ver usuarios y roles
SELECT Usr_Email, Rol_Nombre
FROM USUARIOS
JOIN ROLES ON USUARIOS.id_ROLES_Fk = ROLES.id_ROLES;

-- Asignar rol a usuario
UPDATE USUARIOS
SET id_ROLES_Fk = 1  -- 1 = Administrador
WHERE Usr_Email = 'tu-email@ejemplo.com';
```

## 🔗 Conectar con la Aplicación

Después de ejecutar todos los scripts:

1. **Obtener credenciales:**
   - Ve a Settings → API
   - Copia `Project URL` → Variable: `VITE_SUPABASE_URL`
   - Copia `anon public` key → Variable: `VITE_SUPABASE_ANON_KEY`

2. **Configurar variables de entorno:**
   ```bash
   # En la raíz del proyecto, crea .env
   VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
   VITE_SUPABASE_ANON_KEY=tu-clave-anonima-aqui
   ```

3. **Probar conexión:**
   ```bash
   npm run dev
   ```

## 📚 Referencias

- [Supabase SQL Editor](https://supabase.com/docs/guides/database/overview#the-sql-editor)
- [Row Level Security (RLS)](https://supabase.com/docs/guides/auth/row-level-security)
- [PostgreSQL Data Types](https://www.postgresql.org/docs/current/datatype.html)
- [Supabase Auth](https://supabase.com/docs/guides/auth)

## 👥 Soporte

Si tienes problemas durante la ejecución:

1. Revisa los mensajes de error en el SQL Editor
2. Consulta la sección "Solución de Problemas" arriba
3. Revisa la documentación de Supabase
4. Contacta al equipo de desarrollo del proyecto

---

**Última actualización:** Octubre 2025
**Versión:** 1.0
**Proyecto:** Sistema de Gestión de Eventos - ESPOL
