# Sistema de Gestión de Eventos - ESPOL

Sistema web integral para la gestión de eventos desarrollado como proyecto académico para la materia **SOFG1006 - Desarrollo de Aplicaciones Web y Móviles** de la Escuela Superior Politécnica del Litoral (ESPOL).

---

## Información del Proyecto

- **Materia**: SOFG1006 - Desarrollo de Aplicaciones Web y Móviles
- **Período**: II PAO 2025
- **Fecha de Entrega**: 10 de noviembre de 2025 - 08:00 a.m.
- **Institución**: Escuela Superior Politécnica del Litoral (ESPOL)

---

## Descripción

Sistema modular que permite gestionar integralmente eventos, desde la creación y categorización hasta la venta de boletos, facturación y notificaciones. El sistema está diseñado para ser escalable, seguro y fácil de usar.

---

## Tecnologías Utilizadas

### Frontend
- **HTML5**: Estructura semántica
- **CSS3**: Estilos y diseño responsivo
- **JavaScript ES6+**: Lógica del cliente
- **Vite**: Build tool y dev server

### Backend
- **Supabase**: Backend as a Service (BaaS)
  - PostgreSQL database
  - Authentication
  - Row Level Security (RLS)
  - Real-time subscriptions
  - Storage

### Hosting y Despliegue
- **Vercel**: Hosting del frontend
- **Supabase Cloud**: Hosting de backend y BD
- **Git/GitHub**: Control de versiones

---

## Estructura del Proyecto

\`\`\`
Sistema-de-Gestion-de-Eventos--DAWM/
│
├── .gitignore                      # Archivos ignorados por Git
├── .env.example                    # Template de variables de entorno
├── package.json                    # Dependencias del proyecto
├── vite.config.js                  # Configuración de Vite
├── vercel.json                     # Configuración de Vercel
│
├── README.md                       # Este archivo
├── CONTRIBUTING.md                 # Guía de contribución
├── SETUP.md                        # Guía de configuración
├── CHANGELOG.md                    # Registro de cambios
│
├── src/                            # Código fuente del frontend
│   ├── index.html                  # Landing page principal
│   ├── styles/                     # Estilos CSS
│   │   ├── main.css
│   │   ├── variables.css
│   │   ├── components.css
│   │   └── responsive.css
│   ├── scripts/                    # JavaScript del cliente
│   │   ├── supabase-client.js      # ← CLIENTE SUPABASE (AQUÍ SE USAN LAS KEYS)
│   │   ├── auth.js
│   │   ├── utils.js
│   │   └── modules/                # JS por módulo
│   │       ├── general.js
│   │       ├── clientes.js
│   │       ├── eventos.js
│   │       ├── boletos.js
│   │       ├── facturacion.js
│   │       ├── notificaciones.js
│   │       └── autenticacion.js
│   ├── pages/                      # Páginas HTML por módulo
│   │   ├── modulo-general/
│   │   ├── clientes/
│   │   ├── eventos/
│   │   ├── boletos/
│   │   ├── facturacion/
│   │   ├── notificaciones/
│   │   └── autenticacion/
│   └── components/                 # Componentes reutilizables
│
├── assets/                         # Recursos estáticos
│   ├── images/
│   ├── fonts/
│   └── exports/
│
├── lib/                            # 📦 Librerías y utilidades
│   └── supabase.js                 # ← Cliente de Supabase configurado
│
├── examples/                       # 📚 Ejemplos de código
│   ├── clientes-crud.js            # Ejemplos CRUD de Clientes
│   └── eventos-crud.js             # Ejemplos CRUD de Eventos
│
├── database/                       # Scripts y documentación de BD
│   ├── schema.sql                  # ← EJECUTAR PRIMERO EN SUPABASE
│   ├── seed.sql                    # ← EJECUTAR SEGUNDO (datos de prueba)
│   ├── policies.sql                # ← EJECUTAR TERCERO (seguridad RLS)
│   └── EXECUTION_ORDER.md          # Guía de ejecución de scripts SQL
│
└── docs/                           # Documentación del proyecto
    ├── DATABASE_USAGE.md           # 📖 Guía completa de uso de la BD
    ├── api/
    ├── reuniones/
    ├── capturas/
    ├── videos/
    └── guides/
\`\`\`

---

## Módulos del Sistema

El sistema está dividido en **7 módulos funcionales**:

| Módulo | Responsable(s) | Tablas Principales |
|--------|---------------|-------------------|
| **Módulo General** | MUNIZAGA, DIAZ, FIERRO | GeneroSexo, Operadora, Provincias, Ciudades, MetodoPago, IVA |
| **Clientes** | SORIANO LEON | Clientes, DireccionesCliente, TipoCliente |
| **Eventos** | BARZOLA DE LA O | Eventos, CategoriasEvento, TipoIngreso |
| **Boletos y Entradas** | BARRENO HERRERA | Boletos, TiposBoleto, EntradasAsignadas |
| **Facturación** | MAZA PUNNE | Factura, Detalle_factura |
| **Notificaciones** | ARMIJOS ROMERO | Notificaciones, Destinatarios, Plantillas |
| **Autenticación y Roles** | TUMBACO SANTANA | USUARIOS, ROLES, LOGIN, Permisos |

---

## Requisitos Previos

Antes de instalar y ejecutar el proyecto, asegúrate de tener:

- **Node.js** v18 o superior
- **npm** v9 o superior
- **Git** instalado
- **Navegador web** moderno (Chrome, Firefox, Edge)
- **Cuenta en Supabase** (gratuita)
- **Cuenta en Vercel** (gratuita, opcional para deploy)

---

## 🚀 Inicio Rápido

### Paso 1: Configurar el proyecto

```bash
# Clonar repositorio
git clone <url-del-repositorio>
cd Sistema-de-Gestion-de-Eventos--DAWM

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Edita .env con tus credenciales de Supabase
```

### Paso 2: Configurar Supabase

1. Crea un proyecto en [Supabase](https://supabase.com)
2. En **SQL Editor**, ejecuta en orden:
   - `database/schema.sql`
   - `database/seed.sql`
   - `database/policies.sql`
3. Copia tus credenciales desde **Settings → API** al archivo `.env`

### Paso 3: Ejecutar el proyecto

```bash
npm run dev
```

Abre [http://localhost:5173](http://localhost:5173) en tu navegador.

### 📚 Usando la Base de Datos

Revisa los archivos de ejemplo:
- [`lib/supabase.js`](lib/supabase.js) - Cliente configurado de Supabase
- [`examples/clientes-crud.js`](examples/clientes-crud.js) - Operaciones CRUD de clientes
- [`examples/eventos-crud.js`](examples/eventos-crud.js) - Operaciones CRUD de eventos
- [`docs/DATABASE_USAGE.md`](docs/DATABASE_USAGE.md) - Guía completa de la BD

**Ejemplo básico:**

```javascript
import { supabase } from './lib/supabase.js';

// Obtener todos los eventos próximos
const { data, error } = await supabase
  .from('Eventos')
  .select('*')
  .eq('Evt_Estado', 'Programado')
  .order('Evt_FechaInicio', { ascending: true });

console.log(data);
```

Para más información, consulta la [Guía de Uso de Base de Datos](docs/DATABASE_USAGE.md).

---

## Instalación

### 1. Clonar el Repositorio

\`\`\`bash
git clone <url-del-repositorio>
cd Sistema-de-Gestion-de-Eventos--DAWM
\`\`\`

### 2. Instalar Dependencias

\`\`\`bash
npm install
\`\`\`

### 3. Configurar Supabase

#### 3.1 Crear Proyecto en Supabase

1. Ve a [https://supabase.com](https://supabase.com)
2. Crea una cuenta (si no tienes)
3. Clic en "New Project"
4. Completa los datos:
   - **Name**: sistema-gestion-eventos
   - **Database Password**: (guarda esta contraseña)
   - **Region**: Selecciona la más cercana
5. Espera a que se cree el proyecto (~2 minutos)

#### 3.2 Ejecutar Scripts SQL

1. En Supabase Dashboard → **SQL Editor**
2. Clic en "New Query"
3. Copia y pega el contenido de \`database/schema.sql\`
4. Clic en "Run"
5. (Opcional) Ejecuta \`database/seed.sql\` para datos de ejemplo
6. (Opcional) Ejecuta \`database/functions.sql\` y \`database/policies.sql\`

#### 3.3 Obtener Credenciales

1. En Supabase Dashboard → **Settings** → **API**
2. Busca y copia:
   - **Project URL**: \`https://tu-proyecto.supabase.co\`
   - **anon public key**: \`eyJhbGc...\` (key larga)

### 4. Configurar Variables de Entorno

#### 4.1 Crear archivo .env

\`\`\`bash
cp .env.example .env
\`\`\`

#### 4.2 Editar .env con tus credenciales

Abre \`.env\` y pega tus credenciales de Supabase:

\`\`\`env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-clave-anonima-aqui
\`\`\`

### 5. Ejecutar el Proyecto

#### Modo Desarrollo

\`\`\`bash
npm run dev
\`\`\`

El servidor estará disponible en: \`http://localhost:3000\`

#### Modo Producción (Build)

\`\`\`bash
npm run build
npm run preview
\`\`\`

---

## Despliegue en Vercel

### Opción 1: Desde la Web

1. Ve a [https://vercel.com](https://vercel.com)
2. Clic en "Import Project"
3. Conecta tu repositorio de GitHub
4. Configura las variables de entorno:
   - \`VITE_SUPABASE_URL\`
   - \`VITE_SUPABASE_ANON_KEY\`
5. Clic en "Deploy"

### Opción 2: Desde CLI

\`\`\`bash
npm install -g vercel
vercel login
vercel
\`\`\`

**Importante**: Configura las variables de entorno en Vercel Dashboard → Project → Settings → Environment Variables

---

## Convenciones de Código

### Nomenclatura de Base de Datos

- **Tablas**: PascalCase (ej: \`Clientes\`, \`Eventos\`)
- **Claves Primarias**: \`id_NombreTabla\` (ej: \`id_Clientes\`)
- **Claves Foráneas**: \`id_NombreTabla_Fk\` (ej: \`id_Clientes_Fk\`)
- **Columnas**: Prefijo del módulo + PascalCase (ej: \`Cli_Nombre\`, \`Evt_Fecha\`)

**Ver más**: [database/DATABASE.md](database/DATABASE.md)

### JavaScript

- Variables y funciones: **camelCase**
- Clases: **PascalCase**
- Constantes: **UPPER_SNAKE_CASE**
- Archivos: **kebab-case**

### HTML/CSS

- Clases CSS: **kebab-case**
- IDs: solo cuando sea absolutamente necesario
- HTML5 semántico

**Ver más**: [CONTRIBUTING.md](CONTRIBUTING.md)

---

## Funcionalidades Implementadas

- ⬜ CRUD completo para cada módulo
- ⬜ Validaciones en frontend y backend
- ⬜ Exportación de datos (PDF, Excel, CSV, JSON, TXT)
- ⬜ Diseño responsivo
- ⬜ Autenticación con Supabase Auth
- ⬜ Control de acceso por roles (RLS)
- ⬜ Reportes integrados entre módulos

---

## Documentación Adicional

- **Configuración Completa**: [SETUP.md](SETUP.md)
- **Guía de Contribución**: [CONTRIBUTING.md](CONTRIBUTING.md)
- **Base de Datos**: [database/DATABASE.md](database/DATABASE.md)
- **Historial de Cambios**: [CHANGELOG.md](CHANGELOG.md)

---

## Equipo de Desarrollo

- **MUNIZAGA TORRES JUAN ANDRES** - Módulo General
- **DIAZ LOOR GEOVANNY JAHIR** - Módulo General
- **ADRIAN FIERRO JOSE ANDRES** - Módulo General
- **SORIANO LEON ALEXANDER XAVIER** - Clientes
- **BARZOLA DE LA O STEVEN ARIEL** - Eventos
- **BARRENO HERRERA ANDIE MATTHIUS** - Boletos y Entradas
- **MAZA PUNNE ISSAC ALEXANDER** - Facturación
- **ARMIJOS ROMERO ERICK DANILO** - Notificaciones
- **TUMBACO SANTANA GABRIEL ALEJANDRO** - Autenticación y Roles

---

## Licencia

Este proyecto es un trabajo académico desarrollado para ESPOL. Ver el archivo [LICENSE](LICENSE) para más detalles.

---

## Contacto y Soporte

Para dudas o problemas:
- Issues en GitHub
- Correo institucional ESPOL
- Revisar documentación en [docs/](docs/)

---

**Desarrollado por estudiantes de ESPOL - SOFG1006**
