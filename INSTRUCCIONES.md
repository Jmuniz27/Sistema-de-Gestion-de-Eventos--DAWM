# Instrucciones de Instalación y Configuración

## Sistema de Gestión de Eventos - ESPOL

---

## Estado Actual del Proyecto

### ✅ Lo que ya está completo

1. **Estructura completa de carpetas** con todos los directorios necesarios
2. **Archivos de configuración** (package.json, .env.example, .gitignore)
3. **Backend completo**:
   - Servidor Express configurado
   - Conexión a Azure SQL Database
   - Middleware de validación y manejo de errores
   - Módulo de Clientes completamente implementado (model, controller, routes)
   - Utilidades para exportación y validación
4. **Frontend base**:
   - HTML principal con diseño responsivo
   - CSS personalizado con Bootstrap 5
   - JavaScript para API client y utilidades
   - Página de listado de clientes funcional
5. **Base de Datos**:
   - Script SQL completo con todas las tablas del sistema
   - Script de datos de ejemplo para testing
   - Documentación de justificaciones
6. **Documentación**:
   - README completo
   - Templates para actas de reunión
   - Template para enlaces de videos

---

## Pasos para Configurar el Proyecto

### 1. Instalar Dependencias

```bash
npm install
```

Este comando instalará todas las dependencias listadas en [package.json](package.json):
- Express.js (framework web)
- mssql (conector Azure SQL Database)
- cors (manejo de CORS)
- dotenv (variables de entorno)
- express-validator (validaciones)
- pdfkit, exceljs, json2csv (exportación)

### 2. Configurar Azure SQL Database

#### 2.1 Crear la Base de Datos en Azure Portal

1. Ir a [portal.azure.com](https://portal.azure.com)
2. Crear un nuevo SQL Database
3. Configurar el servidor y credenciales
4. Anotar la cadena de conexión

#### 2.2 Configurar Firewall

1. En Azure Portal, ir a tu SQL Server
2. En "Security" → "Networking"
3. Agregar tu IP actual
4. Marcar "Allow Azure services and resources to access this server"

#### 2.3 Ejecutar Scripts SQL

1. Abrir **Query Editor** en Azure Portal
2. Ejecutar [docs/database/script-creacion.sql](docs/database/script-creacion.sql)
3. (Opcional) Ejecutar [docs/database/script-datos-ejemplo.sql](docs/database/script-datos-ejemplo.sql)

### 3. Configurar Variables de Entorno

1. Copiar `.env.example` a `.env`:
   ```bash
   cp .env.example .env
   ```

2. Editar `.env` con tus credenciales reales:
   ```env
   DB_SERVER=tu-servidor.database.windows.net
   DB_DATABASE=eventos_db
   DB_USER=tu_usuario
   DB_PASSWORD=tu_password_seguro
   DB_PORT=1433

   PORT=3000
   NODE_ENV=development
   ```

### 4. Ejecutar el Proyecto Localmente

#### Modo Desarrollo (con auto-restart):
```bash
npm run dev
```

#### Modo Producción:
```bash
npm start
```

El servidor estará disponible en: `http://localhost:3000`

### 5. Verificar Funcionamiento

1. Abrir navegador en `http://localhost:3000`
2. Navegar a "Clientes" en el menú
3. Verificar que carguen los datos de ejemplo
4. Probar crear, editar y eliminar clientes
5. Probar exportación de datos

---

## Próximos Pasos - Tareas Pendientes

### Alta Prioridad

#### 1. Completar Páginas Frontend del Módulo Clientes
- [ ] Crear [frontend/pages/clientes/crear.html](frontend/pages/clientes/crear.html)
  - Formulario para crear nuevos clientes
  - Validaciones en tiempo real
  - Integración con API

- [ ] Crear [frontend/pages/clientes/editar.html](frontend/pages/clientes/editar.html)
  - Formulario para editar clientes existentes
  - Carga de datos del cliente
  - Modo vista (readonly) y modo edición

#### 2. Implementar Módulos Restantes

Para cada módulo (Eventos, Boletos, Facturación, etc.), seguir esta estructura:

**Backend** (siguiendo el ejemplo de Clientes):
- [ ] `backend/models/[modulo].model.js`
- [ ] `backend/controllers/[modulo].controller.js`
- [ ] `backend/routes/[modulo].routes.js`
- [ ] Importar y montar en `backend/routes/index.js`

**Frontend**:
- [ ] `frontend/pages/[modulo]/index.html` (listado)
- [ ] `frontend/pages/[modulo]/crear.html` (formulario crear)
- [ ] `frontend/pages/[modulo]/editar.html` (formulario editar)

#### 3. Implementar Reportes Integrados

Cada módulo debe tener al menos:
- [ ] 1 reporte que cruce datos entre módulos
- [ ] 1 reporte general del mismo módulo

Ejemplos:
- Reporte de ventas por evento (cruza Eventos, Boletos, Facturación)
- Reporte de clientes por tipo (módulo Clientes)

### Media Prioridad

#### 4. Autenticación y Autorización
- [ ] Implementar sistema de login
- [ ] Middleware de autenticación JWT
- [ ] Control de acceso por roles
- [ ] Página de login/registro

#### 5. Mejoras de UX/UI
- [ ] Agregar spinner de carga en todas las operaciones
- [ ] Mensajes de confirmación más descriptivos
- [ ] Validaciones en tiempo real en formularios
- [ ] Mejoras visuales del dashboard

#### 6. Testing
- [ ] Crear tests para API (archivo `tests/api.test.js` ya existe vacío)
- [ ] Probar todas las funcionalidades
- [ ] Verificar manejo de errores

### Baja Prioridad (Opcional)

#### 7. Features Adicionales
- [ ] Sistema de búsqueda avanzada
- [ ] Gráficos y estadísticas en el dashboard
- [ ] Importación de datos desde Excel/CSV
- [ ] Sistema de notificaciones en tiempo real
- [ ] Modo oscuro

---

## Estructura de Archivos para Referencia

### Backend
```
backend/
├── server.js              # ✅ Punto de entrada
├── config/
│   └── database.js        # ✅ Configuración BD
├── routes/
│   ├── index.js           # ✅ Centralizador de rutas
│   └── clientes.routes.js # ✅ Rutas de Clientes
├── controllers/
│   └── clientes.controller.js # ✅ Lógica de negocio
├── models/
│   └── clientes.model.js  # ✅ Acceso a datos
├── middleware/
│   ├── errorHandler.js    # ✅ Manejo de errores
│   └── validateRequest.js # ✅ Validaciones
└── utils/
    ├── exporters.js       # ✅ Exportación de datos
    └── validators.js      # ✅ Validadores
```

### Frontend
```
frontend/
├── index.html             # ✅ Página principal
├── assets/
│   ├── css/
│   │   ├── styles.css     # ✅ Estilos principales
│   │   └── responsive.css # ✅ Media queries
│   └── js/
│       ├── api-client.js  # ✅ Cliente HTTP
│       ├── utils.js       # ✅ Utilidades
│       └── main.js        # ✅ Inicialización
└── pages/
    └── clientes/
        └── index.html     # ✅ Listado de clientes
```

---

## Convenciones de Código a Seguir

### JavaScript
- Variables y funciones: `camelCase`
- Clases: `PascalCase`
- Constantes: `UPPER_SNAKE_CASE`
- Archivos: `kebab-case`

### SQL
- Tablas: `PascalCase`
- Columnas: `Prefijo_PascalCase` (ej: `Cli_Nombre`)
- Claves Primarias: `id_NombreTabla`
- Claves Foráneas: `id_NombreTabla_Fk`

### HTML/CSS
- Clases CSS: `kebab-case`
- IDs: solo cuando sea necesario
- Usar HTML5 semántico

---

## Recursos y Referencias

### Documentación del Proyecto
- [README.md](README.md) - Documentación general
- [docs/database/justificaciones.md](docs/database/justificaciones.md) - Justificaciones de BD
- [docs/database/script-creacion.sql](docs/database/script-creacion.sql) - Script de tablas

### Tecnologías Utilizadas
- [Express.js](https://expressjs.com/)
- [Bootstrap 5](https://getbootstrap.com/)
- [Azure SQL Database](https://azure.microsoft.com/en-us/products/azure-sql/database/)
- [mssql (node package)](https://www.npmjs.com/package/mssql)

### Herramientas Recomendadas
- **IDE**: Visual Studio Code
- **Database Tool**: Azure Data Studio o SQL Server Management Studio
- **API Testing**: Postman o Thunder Client (extensión de VS Code)
- **Git GUI**: GitHub Desktop o integrado en VS Code

---

## Troubleshooting

### Problema: No se puede conectar a Azure SQL Database

**Solución**:
1. Verificar credenciales en `.env`
2. Asegurarse de que tu IP esté en el firewall de Azure
3. Verificar que "Allow Azure services" esté habilitado
4. Revisar que el usuario tenga permisos en la base de datos

### Problema: Error "Module not found"

**Solución**:
```bash
rm -rf node_modules
npm install
```

### Problema: Puerto 3000 ya en uso

**Solución**:
1. Cambiar el puerto en `.env`:
   ```
   PORT=3001
   ```
2. O cerrar la aplicación que usa el puerto 3000

### Problema: CORS errors en el frontend

**Solución**:
- Verificar que `ALLOWED_ORIGINS` en `.env` incluya tu URL
- Si estás en desarrollo, asegúrate de incluir `http://localhost:3000`

---

## Despliegue en Azure App Service

### Pasos para Desplegar

1. **Crear App Service en Azure Portal**
2. **Configurar GitHub Actions** (archivo `.github/workflows` ya existe)
3. **Configurar Variables de Entorno** en Azure App Service:
   - Configuration → Application settings
   - Agregar todas las variables del `.env`
4. **Push a GitHub** y el deployment será automático

---

## Contacto y Soporte

Para cualquier duda o problema:
- Revisar la documentación en [README.md](README.md)
- Consultar con compañeros del equipo
- Revisar Issues en GitHub (si aplica)

---

## Checklist Final para Entrega

### Código
- [ ] Todos los módulos funcionando
- [ ] Validaciones en frontend y backend
- [ ] Exportación de datos implementada
- [ ] Diseño responsivo verificado
- [ ] Código bien comentado
- [ ] Sin console.log innecesarios

### Base de Datos
- [ ] Todas las tablas creadas
- [ ] Datos de ejemplo cargados
- [ ] Relaciones correctamente definidas
- [ ] Índices creados

### Documentación
- [ ] README actualizado
- [ ] Justificaciones completas
- [ ] Actas de reuniones (mínimo 2)
- [ ] Capturas de pantalla

### Videos
- [ ] Todos los videos grabados
- [ ] Videos subidos a YouTube
- [ ] Enlaces registrados en [docs/videos/enlaces-youtube.md](docs/videos/enlaces-youtube.md)

### Despliegue
- [ ] Sistema desplegado en Azure
- [ ] Base de datos en Azure SQL Database
- [ ] Variables de entorno configuradas
- [ ] Sistema funcional en producción

---

**Fecha de Entrega**: 10 de noviembre de 2025 - 08:00 a.m.

**¡Éxito con el proyecto!**
