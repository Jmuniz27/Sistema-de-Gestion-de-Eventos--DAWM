# Documentación de Base de Datos

## Sistema de Gestión de Eventos - ESPOL

---

## Información General

- **Motor**: PostgreSQL 15+
- **Plataforma**: Supabase
- **Esquema**: public (default)
- **Encoding**: UTF-8

---

## Nomenclatura y Convenciones

### Reglas de Nomenclatura (según PDF de instrucciones)

#### Tablas
- **Formato**: PascalCase
- **Ejemplos**: `Clientes`, `Eventos`, `GeneroSexo`

#### Claves Primarias (PK)
- **Formato**: `id_NombreTabla`
- **Ejemplos**:
  - `id_Clientes` (tabla Clientes)
  - `id_Eventos` (tabla Eventos)
  - `id_GeneroSexo` (tabla GeneroSexo)

#### Claves Foráneas (FK)
- **Formato**: `id_NombreTabla_Fk`
- **Ejemplos**:
  - `id_Clientes_Fk` (referencia a Clientes)
  - `id_Eventos_Fk` (referencia a Eventos)
  - `id_TipoCliente_Fk` (referencia a TipoCliente)

#### Columnas
- **Formato**: `Prefijo_Nombre`
- **Prefijos por módulo**:
  - **Gen_**: Módulo General (Gen_Nombre, Gen_Estado)
  - **Cli_**: Clientes (Cli_Nombre, Cli_Apellido, Cli_Email, Cli_Celular)
  - **Evt_**: Eventos (Evt_Nombre, Evt_Fecha, Evt_Lugar, Evt_Capacidad)
  - **Bol_**: Boletos (Bol_Codigo, Bol_Precio, Bol_Estado)
  - **Fac_**: Facturación (Fac_Numero, Fac_Fecha, Fac_Total)
  - **Not_**: Notificaciones (Not_Mensaje, Not_Tipo, Not_Estado)
  - **Usr_**: Usuarios (Usr_Email, Usr_Nombre)

#### Campo de Trazabilidad
- **Campo**: `id_modulo`
- **Tipo**: `VARCHAR(50)`
- **Propósito**: Identificar de qué módulo proviene el registro
- **Valores**: `'general'`, `'clientes'`, `'eventos'`, `'boletos'`, `'facturacion'`, `'notificaciones'`, `'autenticacion'`

---

## Módulos y Tablas

### 1. Módulo General
**Responsables**: MUNIZAGA TORRES JUAN ANDRES, DIAZ LOOR GEOVANNY JAHIR, ADRIAN FIERRO JOSE ANDRES

**Tablas**:
- `GeneroSexo`: Catálogo de géneros
- `Operadora`: Operadoras telefónicas
- `EstadoCivil`: Estados civiles
- `Proveedores`: Proveedores de servicios
- `TipoDocumento`: Tipos de documento de identidad
- `UnidadMedida`: Unidades de medida
- `Provincias`: Provincias del Ecuador
- `Ciudades`: Ciudades (relacionada con Provincias)
- `EstadosGenerales`: Estados genéricos (Activo, Inactivo, Eliminado)
- `MetodoPago`: Métodos de pago (Efectivo, Tarjeta, Transferencia)
- `IVA`: Porcentajes de IVA según fecha

### 2. Módulo Clientes
**Responsable**: SORIANO LEON ALEXANDER XAVIER

**Tablas**:
- `TipoCliente`: Tipos de cliente (Persona Natural, Empresa)
- `Clientes`: Datos principales de clientes
- `DireccionesCliente`: Direcciones de entrega (1 cliente - N direcciones)

**Relaciones**:
- Clientes → TipoCliente (N:1)
- Clientes → DireccionesCliente (1:N)

### 3. Módulo Eventos
**Responsable**: BARZOLA DE LA O STEVEN ARIEL

**Tablas**:
- `CategoriasEvento`: Categorías (Concierto, Conferencia, Taller, Fiesta)
- `TipoIngreso`: Tipos de ingreso (con boleto, invitación, etc.)
- `Eventos`: Datos principales de eventos
- `Detalle_Eventos`: Detalles adicionales (opcional según relación)

**Relaciones**:
- Eventos → CategoriasEvento (N:1)
- Eventos → TipoIngreso (N:1)

### 4. Módulo Boletos y Entradas
**Responsable**: BARRENO HERRERA ANDIE MATTHIUS

**Tablas**:
- `TiposBoleto`: Tipos de boleto (VIP, General, Estudiante)
- `Boletos`: Boletos generados
- `EntradasAsignadas`: Entradas asignadas a clientes (opcional)

**Relaciones**:
- Boletos → Eventos (N:1)
- Boletos → TiposBoleto (N:1)
- EntradasAsignadas → Boletos (N:1)
- EntradasAsignadas → Clientes (N:1)

### 5. Módulo Facturación
**Responsable**: MAZA PUNNE ISSAC ALEXANDER

**Tablas**:
- `Factura`: Facturas generadas
- `Detalle_factura`: Líneas de detalle de factura

**Relaciones**:
- Factura → Clientes (N:1)
- Factura → MetodoPago (N:1)
- Detalle_factura → Factura (N:1)
- Detalle_factura → Boletos (N:1)

### 6. Módulo Notificaciones
**Responsable**: ARMIJOS ROMERO ERICK DANILO

**Tablas**:
- `Notificaciones`: Registro de notificaciones enviadas
- `Destinatarios`: Relaciona notificaciones con clientes
- `Plantillas`: Plantillas prediseñadas

**Relaciones**:
- Destinatarios → Notificaciones (N:1)
- Destinatarios → Clientes (N:1)

### 7. Módulo Autenticación y Roles
**Responsable**: TUMBACO SANTANA GABRIEL ALEJANDRO

**Tablas**:
- `USUARIOS`: Usuarios del sistema
- `ROLES`: Roles disponibles (Admin, Vendedor, Cliente)
- `LOGIN`: Credenciales de acceso
- `Permisos`: Pantallas/vistas a las que cada rol tiene acceso

**Relaciones**:
- LOGIN → USUARIOS (1:1)
- USUARIOS → ROLES (N:1)
- Permisos → ROLES (N:1)

---

## Diagrama Entidad-Relación

**Ver**: `database/diagrams/er-diagram.png` (pendiente de crear)

---

## Índices Recomendados

```sql
-- Optimización de consultas frecuentes
CREATE INDEX idx_clientes_email ON Clientes(Cli_Email);
CREATE INDEX idx_clientes_celular ON Clientes(Cli_Celular);
CREATE INDEX idx_eventos_fecha ON Eventos(Evt_Fecha);
CREATE INDEX idx_boletos_codigo ON Boletos(Bol_Codigo);
CREATE INDEX idx_boletos_estado ON Boletos(Bol_Estado);
CREATE INDEX idx_factura_numero ON Factura(Fac_Numero);
CREATE INDEX idx_factura_fecha ON Factura(Fac_Fecha);
```

---

## Constraints Importantes

### Validaciones

```sql
-- Email válido
ALTER TABLE Clientes ADD CONSTRAINT check_email
  CHECK (Cli_Email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$');

-- Teléfono válido (10 dígitos)
ALTER TABLE Clientes ADD CONSTRAINT check_celular
  CHECK (Cli_Celular ~ '^\d{10}$');

-- Capacidad positiva
ALTER TABLE Eventos ADD CONSTRAINT check_capacidad
  CHECK (Evt_Capacidad > 0);

-- Precio positivo
ALTER TABLE Boletos ADD CONSTRAINT check_precio
  CHECK (Bol_Precio >= 0);
```

---

## Seguridad: Row Level Security (RLS)

Supabase usa Row Level Security para controlar el acceso a nivel de fila.

**Ver**: `database/policies.sql` para políticas completas

**Ejemplo de política**:
```sql
-- Los usuarios solo pueden ver sus propios datos
CREATE POLICY "Users view own data" ON Clientes
FOR SELECT
USING (auth.uid() = user_id);
```

---

## Triggers y Funciones

**Ver**: `database/functions.sql`

**Funciones útiles**:
- `calcular_total_factura(subtotal)`: Calcula total con IVA actual
- `boletos_disponibles(evento_id)`: Verifica disponibilidad de boletos

---

## Migración desde Azure SQL

Si estás migrando desde Azure SQL a Supabase:

1. **Tipos de datos**:
   - `NVARCHAR` → `VARCHAR`
   - `DATETIME` → `TIMESTAMP`
   - `BIT` → `BOOLEAN`

2. **Identity columns**:
   - `IDENTITY(1,1)` → `SERIAL`

3. **Schemas**:
   - `dbo.Tabla` → `public.Tabla`

---

## Scripts de Ejecución

### Orden de ejecución:

1. `schema.sql` - Crear todas las tablas
2. `functions.sql` - Crear funciones
3. `policies.sql` - Configurar RLS
4. `seed.sql` - Insertar datos de ejemplo (opcional)

---

## Backup y Mantenimiento

### Backup en Supabase:
- Backups automáticos diarios (Plan Pro)
- Exportar manualmente: Dashboard → Database → Backups

### Mantenimiento:
```sql
-- Vacuum y analyze periódico
VACUUM ANALYZE;

-- Estadísticas de tablas
SELECT schemaname, tablename, n_live_tup
FROM pg_stat_user_tables
ORDER BY n_live_tup DESC;
```

---

## Contacto y Soporte

Para dudas sobre la base de datos:
- Revisar `schema.sql` para estructura completa
- Consultar docs de Supabase: https://supabase.com/docs
- Issues en GitHub del proyecto
