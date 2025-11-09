<!--
  README mejorado y reestructurado
  Objetivo: ofrecer una guía clara y rápida de uso para desarrolladores y evaluadores.
-->

# Sistema de Gestión de Eventos — ESPOL

Proyecto académico para la materia SOFG1006 — "Desarrollo de Aplicaciones Web y Móviles" (ESPOL).
Sistema modular para gestionar eventos: clientes, boletos, facturación y notificaciones.

---

## Contenidos

- [Resumen rápido](#resumen-rápido)
- [Estructura del repositorio](#estructura-del-repositorio)
- [Requisitos](#requisitos)
- [Instalación y ejecución](#instalación-y-ejecución)
- [Configuración de Supabase](#configuración-de-supabase)
- [Despliegue (Vercel)](#despliegue-vercel)
- [Convenciones y buenas prácticas](#convenciones-y-buenas-prácticas)
- [Documentación adicional](#documentación-adicional)
- [Equipo y contacto](#equipo-y-contacto)

---

## Resumen rápido

- Estado: proyecto académico modular listo para desarrollo y despliegue.
- Tech stack principal: HTML/CSS/JS (ES6+), Vite, Supabase (Postgres + Auth), Vercel.
- Objetivo: permitir creación y gestión de eventos, control de asistencia/boletos, facturación y envíos de notificaciones.

Si quieres ejecutar el proyecto localmente, sigue la sección "Instalación y ejecución".

---

## Estructura del repositorio

Resumen de los directorios más relevantes:

```
src/
  ├─ index.html                 # Entrada principal
  ├─ components/                # Componentes HTML reutilizables (navbar, footer, sidebar, modales)
  ├─ js/                        # Lógica JS modular (navbar loader, state manager, módulos por función)
  ├─ css/                       # Estilos separados por módulo y componentes
  └─ pages/                     # Páginas estáticas por módulo (eventos, clientes, facturación...)

lib/                            # Cliente supabase centralizado
database/                       # Scripts SQL (schema, seed, policies)
docs/                           # Documentación y guías
examples/                       # Scripts de ejemplo / uso de la DB
```

Nota: el proyecto ya utiliza un patrón de componentes (cargar `components/*.html` desde `js/*` con `?raw`). Esto facilita consolidar elementos compartidos.

---

## Requisitos

- Node.js 18+ (recomendado)
- npm 9+
- Git
- Navegador moderno
- Cuenta en Supabase (para usar la base de datos y Auth)

---

## Instalación y ejecución

1) Clona el repositorio

```powershell
git clone https://github.com/Jmuniz27/Sistema-de-Gestion-de-Eventos--DAWM.git
cd Sistema-de-Gestion-de-Eventos--DAWM
```

2) Instala dependencias

```powershell
npm install
```

3) Copia el ejemplo de variables de entorno y edítalo

```powershell
copy env .env
# editar .env con tus credenciales de Supabase
```

4) Ejecuta en modo desarrollo

```powershell
npm run dev
```

Abre el navegador en la URL que indique Vite (por defecto http://localhost:3000).

---

## Configuración de Supabase

Pasos mínimos para configurar la base de datos en Supabase:

1. Crea un proyecto en https://supabase.com
2. En el SQL Editor ejecuta, en este orden:
   - `database/schema.sql`
   - `database/seed.sql` (opcional, datos de ejemplo)
   - `database/policies.sql` (RLS y permisos)
3. Copia las credenciales (Project URL y anon key) a `.env` (VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY).

Ficheros útiles:
- `lib/supabase.js` — cliente Supabase centralizado
- `examples/*.js` — ejemplos CRUD (clientes, eventos)

---

## Despliegue (Vercel)

Opción 1 — desde la web:

1. Importa el repositorio en Vercel
2. Configura variables de entorno en el proyecto (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)
3. Deploy

Opción 2 — desde CLI

```powershell
npm install -g vercel
vercel login
vercel
```

Consejo: verifica que las rutas de producción (por ejemplo rutas base o `public` assets) estén correctas antes de desplegar.

---

## Convenciones y buenas prácticas

- JavaScript: camelCase para variables y funciones, PascalCase para clases, kebab-case para archivos cuando aplique.
- HTML/CSS: clases en kebab-case, usar IDs solo cuando sea necesario.
- Base de datos: tablas en PascalCase, claves primarias `id_NombreTabla`, columnas con prefijo de módulo.

---

## Documentación adicional

- `SETUP.md` — guías de instalación extendidas
- `docs/DATABASE_USAGE.md` — uso de la base de datos

---

## Equipo y contacto

Proyecto desarrollado por estudiantes de ESPOL. Para dudas:
- Abrir un issue en GitHub
- Consultar la documentación en `docs/`

Lista de responsables por módulo en `README.md`.

---

Licencia: revisa el archivo `LICENSE` en el repositorio.
