# Justificaciones de Diseño de Base de Datos

## Sistema de Gestión de Eventos - ESPOL

**Materia**: SOFG1006 - Desarrollo de Aplicaciones Web y Móviles
**Período**: II PAO 2025

---

## 1. Convenciones de Nomenclatura

### 1.1 Nomenclatura de Tablas
- **Formato**: PascalCase
- **Ejemplos**: `Clientes`, `Eventos`, `TiposBoleto`
- **Justificación**: Facilita la lectura y es el estándar en SQL Server/Azure SQL Database

### 1.2 Nomenclatura de Claves Primarias
- **Formato**: `id_NombreTabla`
- **Ejemplos**: `id_Clientes`, `id_Eventos`, `id_Boletos`
- **Justificación**: Permite identificar rápidamente que es la clave primaria de la tabla

### 1.3 Nomenclatura de Claves Foráneas
- **Formato**: `id_NombreTabla_Fk`
- **Ejemplos**: `id_Clientes_Fk`, `id_Eventos_Fk`
- **Justificación**: El sufijo `_Fk` indica claramente que es una clave foránea

### 1.4 Nomenclatura de Columnas
- **Formato**: Prefijo del módulo + PascalCase
- **Ejemplos**:
  - `Cli_Nombre`, `Cli_Email` (Clientes)
  - `Evt_Fecha`, `Evt_Lugar` (Eventos)
  - `Bol_Precio`, `Bol_Estado` (Boletos)
- **Justificación**: Permite identificar a qué módulo pertenece cada columna

---

## 2. Campo de Trazabilidad

### 2.1 Campo `id_modulo`
- **Descripción**: Campo VARCHAR(50) presente en las tablas principales de cada módulo
- **Valor por defecto**: Nombre del módulo (ej: 'Clientes', 'Eventos', 'Boletos')
- **Justificación**:
  - Permite identificar el origen de los datos
  - Facilita la integración entre módulos desarrollados por diferentes equipos
  - Útil para auditoría y trazabilidad de datos

### 2.2 Tablas que incluyen `id_modulo`
- `Clientes` → 'Clientes'
- `Eventos` → 'Eventos'
- `Boletos` → 'Boletos'
- `Factura` → 'Facturacion'
- `Notificaciones` → 'Notificaciones'
- `Usuarios` → 'Autenticacion'
- `Proveedores` → 'ModuloGeneral'

---

## 3. Tablas Adicionales Agregadas

### 3.1 Tabla: `DireccionesCliente`
**Justificación**:
- Un cliente puede tener múltiples direcciones de entrega
- Permite gestionar direcciones de facturación vs entrega
- Facilita la logística de envío de boletos físicos

**Relaciones**:
- `id_Clientes_Fk` → Clientes (N:1)
- `id_Ciudades_Fk` → Ciudades (N:1)

### 3.2 Tabla: `RolesPermisos`
**Justificación**:
- Tabla intermedia para relación muchos a muchos
- Un rol puede tener múltiples permisos
- Un permiso puede ser asignado a múltiples roles
- Permite flexibilidad en la gestión de accesos

**Relaciones**:
- `id_Roles_Fk` → Roles (N:1)
- `id_Permisos_Fk` → Permisos (N:1)

### 3.3 Tabla: `DetalleFactura`
**Justificación**:
- Separa la información de la factura (encabezado) de los items (detalle)
- Permite múltiples boletos por factura
- Facilita el cálculo de subtotales y totales

**Relaciones**:
- `id_Factura_Fk` → Factura (N:1)
- `id_Boletos_Fk` → Boletos (N:1)

### 3.4 Tabla: `DestinatariosNotificacion`
**Justificación**:
- Permite enviar una notificación a múltiples destinatarios
- Rastrea si cada destinatario ha leído la notificación
- Optimiza el envío masivo de notificaciones

**Relaciones**:
- `id_Notificaciones_Fk` → Notificaciones (N:1)
- `id_Clientes_Fk` → Clientes (N:1)

### 3.5 Tabla: `PlantillasNotificacion`
**Justificación**:
- Permite reutilizar plantillas de mensajes
- Facilita la personalización de notificaciones
- Mejora la consistencia en las comunicaciones

---

## 4. Relaciones Entre Módulos

### 4.1 Módulo General → Otros Módulos
**Tablas compartidas**:
- `GeneroSexo`, `EstadoCivil`, `Provincias`, `Ciudades`
- Estas son tablas de catálogo usadas por múltiples módulos
- **Justificación**: Evita duplicación de datos y mantiene consistencia

### 4.2 Clientes → Eventos (vía Boletos)
**Relación**:
- Un cliente puede comprar múltiples boletos
- Un boleto pertenece a un evento y un cliente
- **Justificación**: Permite rastrear qué clientes asisten a qué eventos

### 4.3 Eventos → Boletos → Facturación
**Flujo**:
1. Se crea un evento
2. Se generan boletos para el evento
3. El cliente compra boletos
4. Se genera una factura por la compra
- **Justificación**: Refleja el flujo real del negocio

### 4.4 Clientes → Notificaciones
**Relación**:
- Las notificaciones se envían a los clientes
- Un cliente puede recibir múltiples notificaciones
- **Justificación**: Facilita la comunicación con los clientes

### 4.5 Clientes → Usuarios (Autenticación)
**Relación**:
- Un cliente puede tener una cuenta de usuario (opcional)
- Un usuario está asociado a un cliente
- **Justificación**: Permite que los clientes accedan al sistema

---

## 5. Decisiones de Diseño Importantes

### 5.1 Soft Delete
**Implementación**:
- Columna `Estado` en lugar de DELETE físico
- Valores: 'Activo', 'Inactivo', 'Eliminado'
- **Justificación**:
  - Permite recuperar datos eliminados accidentalmente
  - Mantiene integridad referencial
  - Facilita auditorías

### 5.2 Campos de Auditoría
**Campos incluidos**:
- `FechaCreacion` (DATETIME DEFAULT GETDATE())
- `FechaRegistro` en algunas tablas
- **Justificación**:
  - Permite rastrear cuándo se crearon los registros
  - Útil para reportes y análisis temporal

### 5.3 Normalización
**Nivel**: Tercera Forma Normal (3NF)
- **Justificación**:
  - Elimina redundancia de datos
  - Mejora la integridad de datos
  - Facilita el mantenimiento

### 5.4 Índices
**Campos indexados**:
- Claves primarias (automático)
- Claves foráneas (para joins)
- Campos de búsqueda frecuente (email, código, fecha)
- **Justificación**: Mejora el rendimiento de consultas

### 5.5 Constraints
**Implementados**:
- `CHECK` para validar rangos y lógica de negocio
- `UNIQUE` para campos que deben ser únicos
- `NOT NULL` para campos obligatorios
- **Justificación**: Garantiza integridad de datos a nivel de base de datos

---

## 6. Consideraciones de Escalabilidad

### 6.1 Capacidad de Eventos
- Campo `Evt_CapacidadTotal` y `Evt_CapacidadDisponible`
- Permite controlar aforo del evento
- **Justificación**: Evita sobreventa de boletos

### 6.2 Estados de Boletos
- Estados: 'Disponible', 'Vendido', 'Usado', 'Cancelado'
- Permite rastrear el ciclo de vida del boleto
- **Justificación**: Control de inventario y validación en el evento

### 6.3 Versionado de IVA
- Tabla `IVA` con fechas de vigencia
- Permite múltiples tarifas de IVA en el tiempo
- **Justificación**: Cumplimiento legal y contable

---

## 7. Integraciones Futuras Consideradas

### 7.1 Pasarelas de Pago
- Tabla `MetodoPago` preparada para integración
- Campo `RequiereComprobante` para validaciones
- **Justificación**: Facilita integración con sistemas de pago

### 7.2 Sistemas de Notificación
- Tablas separadas para Email y Push
- Plantillas reutilizables
- **Justificación**: Permite escalamiento del sistema de comunicaciones

### 7.3 Reportería
- Campos de auditoría en todas las tablas
- Relaciones bien definidas
- **Justificación**: Facilita la generación de reportes complejos

---

## 8. Conclusiones

El diseño de la base de datos se ha realizado considerando:
- ✅ Nomenclatura consistente y clara
- ✅ Trazabilidad de datos entre módulos
- ✅ Integridad referencial
- ✅ Escalabilidad futura
- ✅ Facilidad de mantenimiento
- ✅ Performance mediante índices estratégicos
- ✅ Cumplimiento de requerimientos académicos

---

**Desarrollado por**: Equipo ESPOL - SOFG1006
**Fecha**: 2025
