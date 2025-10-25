# Sistema de Gestión de Eventos - ESPOL

Sistema web integral para la gestión de eventos desarrollado como proyecto académico para la materia **SOFG1006 - Desarrollo de Aplicaciones Web y Móviles** de la Escuela Superior Politécnica del Litoral (ESPOL).

## Información del Proyecto

- **Materia**: SOFG1006 - Desarrollo de Aplicaciones Web y Móviles
- **Período**: II PAO 2025
- **Fecha de Entrega**: 10 de noviembre de 2025 - 08:00 a.m.
- **Institución**: Escuela Superior Politécnica del Litoral (ESPOL)

## Descripción

Sistema modular que permite gestionar integralmente eventos, desde la creación y categorización hasta la venta de boletos, facturación y notificaciones. El sistema está diseñado para ser escalable, seguro y fácil de usar.

## Tecnologías Utilizadas

### Frontend
- **HTML5**: Estructura semántica
- **CSS3**: Estilos y diseño responsivo
- **JavaScript ES6+**: Lógica del cliente
- **Bootstrap 5**: Framework CSS para diseño responsivo

### Backend
- **Node.js**: Entorno de ejecución
- **Express.js**: Framework web para API REST
- **mssql**: Conector para Azure SQL Database
- **cors**: Manejo de CORS
- **dotenv**: Gestión de variables de entorno
- **express-validator**: Validación de datos

### Base de Datos
- **Azure SQL Database**: Base de datos relacional en la nube

### Hosting y Despliegue
- **Azure App Service**: Hosting de backend y frontend
- **Git/GitHub**: Control de versiones

### Utilidades de Exportación
- **PDFKit**: Generación de reportes en PDF
- **ExcelJS**: Exportación a Excel
- **json2csv**: Exportación a CSV

## Estructura del Proyecto

```
sistema-gestion-eventos/
│
├── .gitignore                     # Archivos ignorados por Git
├── README.md                      # Este archivo
├── package.json                   # Dependencias del proyecto
├── .env.example                   # Ejemplo de variables de entorno
│
├── docs/                          # Documentación del proyecto
│   ├── database/                  # Scripts y documentación de BD
│   │   ├── diagrama-er.png
│   │   ├── script-creacion.sql
│   │   ├── script-datos-ejemplo.sql
│   │   └── justificaciones.md
│   ├── reuniones/                 # Actas de reuniones
│   ├── capturas/                  # Capturas de pantalla
│   └── videos/                    # Enlaces a videos demostrativos
│
├── frontend/                      # Código del Frontend
│   ├── index.html                 # Página principal
│   ├── assets/
│   │   ├── css/                   # Estilos CSS
│   │   ├── js/                    # JavaScript del cliente
│   │   └── img/                   # Imágenes y recursos
│   ├── pages/                     # Páginas HTML por módulo
│   │   ├── modulo-general/
│   │   ├── clientes/
│   │   ├── eventos/
│   │   ├── boletos/
│   │   ├── facturacion/
│   │   ├── notificaciones/
│   │   └── autenticacion/
│   └── components/                # Componentes reutilizables
│
├── backend/                       # Código del Backend (API REST)
│   ├── server.js                  # Punto de entrada del servidor
│   ├── config/
│   │   └── database.js            # Configuración de conexión a BD
│   ├── routes/                    # Definición de rutas
│   ├── controllers/               # Lógica de negocio
│   ├── models/                    # Modelos de datos
│   ├── middleware/                # Middleware personalizado
│   └── utils/                     # Utilidades y helpers
│
└── tests/                         # Pruebas (opcional)
```

## Módulos del Sistema

El sistema está dividido en los siguientes módulos funcionales:

1. **Módulo General**: Datos generales del sistema (operadoras, proveedores, documentos, provincias, ciudades, estados, métodos de pago, IVA)
2. **Clientes**: Gestión de clientes y sus direcciones
3. **Eventos**: Gestión de eventos, categorías y tipos de ingreso
4. **Boletos y Entradas**: Gestión de boletos, tipos y entradas asignadas
5. **Facturación**: Generación y gestión de facturas
6. **Notificaciones**: Envío de notificaciones por email y push
7. **Autenticación y Roles**: Control de acceso, usuarios, roles y permisos

## Requisitos Previos

Antes de instalar y ejecutar el proyecto, asegúrate de tener:

- **Node.js** v18 o superior
- **npm** v9 o superior
- **Azure SQL Database** configurado
- **Git** instalado
- **Navegador web** moderno (Chrome, Firefox, Edge)

## Instalación

### 1. Clonar el Repositorio

```bash
git clone <url-del-repositorio>
cd Sistema-de-Gestion-de-Eventos--DAWM
```

### 2. Instalar Dependencias

```bash
npm install
```

### 3. Configurar Variables de Entorno

Copia el archivo `.env.example` a `.env` y configura las variables:

```bash
cp .env.example .env
```

Edita el archivo `.env` con tus credenciales de Azure SQL Database:

```env
DB_SERVER=tu-servidor.database.windows.net
DB_DATABASE=eventos_db
DB_USER=tu_usuario
DB_PASSWORD=tu_password
DB_PORT=1433

PORT=3000
NODE_ENV=development
```

### 4. Configurar la Base de Datos

Ejecuta los scripts SQL en Azure SQL Database:

1. Abre **Azure Portal** y accede a tu base de datos
2. Ve a **Query editor**
3. Ejecuta el script `docs/database/script-creacion.sql`
4. (Opcional) Ejecuta el script `docs/database/script-datos-ejemplo.sql` para datos de prueba

### 5. Ejecutar el Proyecto

#### Modo Desarrollo (con reinicio automático)

```bash
npm run dev
```

#### Modo Producción

```bash
npm start
```

El servidor estará disponible en: `http://localhost:3000`

## Uso de la API

La API REST está disponible en la ruta base `/api/v1/`

### Endpoints Principales

#### Clientes

```
GET    /api/v1/clientes           - Listar todos los clientes
GET    /api/v1/clientes/:id       - Obtener un cliente específico
POST   /api/v1/clientes           - Crear un nuevo cliente
PUT    /api/v1/clientes/:id       - Actualizar un cliente
DELETE /api/v1/clientes/:id       - Eliminar un cliente
GET    /api/v1/clientes/export/:format - Exportar datos (pdf, excel, csv, json, txt)
```

#### Eventos

```
GET    /api/v1/eventos            - Listar todos los eventos
GET    /api/v1/eventos/:id        - Obtener un evento específico
POST   /api/v1/eventos            - Crear un nuevo evento
PUT    /api/v1/eventos/:id        - Actualizar un evento
DELETE /api/v1/eventos/:id        - Eliminar un evento
```

#### Boletos

```
GET    /api/v1/boletos            - Listar todos los boletos
GET    /api/v1/boletos/:id        - Obtener un boleto específico
POST   /api/v1/boletos            - Crear un nuevo boleto
PUT    /api/v1/boletos/:id        - Actualizar un boleto
DELETE /api/v1/boletos/:id        - Eliminar un boleto
```

### Ejemplo de Petición

```javascript
// Crear un nuevo cliente
const response = await fetch('http://localhost:3000/api/v1/clientes', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    Cli_Nombre: 'Juan',
    Cli_Apellido: 'Pérez',
    Cli_Email: 'juan.perez@ejemplo.com',
    Cli_Celular: '0987654321',
    id_TipoCliente_Fk: 1
  })
});

const data = await response.json();
console.log(data);
```

## Convenciones de Código

### Nomenclatura de Base de Datos

- **Tablas**: PascalCase (ej: `Clientes`, `Eventos`)
- **Claves Primarias**: `id_NombreTabla` (ej: `id_Clientes`)
- **Claves Foráneas**: `id_NombreTabla_Fk` (ej: `id_Clientes_Fk`)
- **Columnas**: Prefijo del módulo + PascalCase (ej: `Cli_Nombre`, `Evt_Fecha`)

### JavaScript

- Variables y funciones: **camelCase**
- Clases: **PascalCase**
- Constantes: **UPPER_SNAKE_CASE**
- Archivos: **kebab-case**

### HTML/CSS

- Clases CSS: **kebab-case**
- IDs: solo cuando sea absolutamente necesario
- HTML5 semántico

## Funcionalidades Implementadas

- ✅ CRUD completo para cada módulo
- ✅ Validaciones en frontend y backend
- ✅ Exportación de datos (PDF, Excel, CSV, JSON, TXT)
- ✅ Diseño responsivo
- ✅ API REST bien estructurada
- ✅ Manejo de errores robusto
- ✅ Conexión segura a Azure SQL Database
- ✅ Reportes integrados entre módulos

## Despliegue en Azure

### Azure SQL Database

1. Crea una base de datos en Azure Portal
2. Configura las reglas de firewall
3. Ejecuta los scripts SQL
4. Guarda las credenciales de conexión

### Azure App Service

1. Crea un App Service en Azure Portal
2. Configura las variables de entorno en **Configuration** > **Application settings**
3. Despliega el código:

```bash
# Usando Git
git remote add azure <url-de-azure>
git push azure main
```

O usa GitHub Actions para despliegue automático.

## Testing

Para ejecutar las pruebas (cuando estén implementadas):

```bash
npm test
```

## Equipo de Desarrollo

- **[Nombre 1]** - Módulo General y Clientes
- **[Nombre 2]** - Módulo de Eventos y Boletos
- **[Nombre 3]** - Facturación y Notificaciones
- **[Nombre 4]** - Autenticación y Roles

## Documentación Adicional

- **Diagrama Entidad-Relación**: [docs/database/diagrama-er.png](docs/database/diagrama-er.png)
- **Scripts SQL**: [docs/database/](docs/database/)
- **Actas de Reuniones**: [docs/reuniones/](docs/reuniones/)
- **Capturas de Pantalla**: [docs/capturas/](docs/capturas/)
- **Videos Demostrativos**: [docs/videos/enlaces-youtube.md](docs/videos/enlaces-youtube.md)

## Licencia

Este proyecto es un trabajo académico desarrollado para ESPOL. Ver el archivo [LICENSE](LICENSE) para más detalles.

## Contacto y Soporte

Para dudas o problemas, contactar a través de:
- Issues en GitHub
- Correo institucional ESPOL

---

**Desarrollado con ❤️ por estudiantes de ESPOL - SOFG1006**
