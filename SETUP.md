# Guía de Configuración Completa

## 1. Configurar Supabase

### Crear Proyecto
1. https://supabase.com → Sign up
2. New Project
3. Guardar contraseña de BD

### Ejecutar Scripts SQL
1. SQL Editor → New Query
2. Ejecutar \`database/schema.sql\`
3. Ejecutar \`database/functions.sql\`
4. Ejecutar \`database/policies.sql\`
5. (Opcional) \`database/seed.sql\`

### Obtener Credenciales
Settings → API → Copiar:
- Project URL
- anon public key

## 2. Configurar Proyecto Local

### Instalar Dependencias
\`\`\`bash
npm install
\`\`\`

### Configurar .env
\`\`\`bash
cp .env.example .env
# Editar .env con tus credenciales
\`\`\`

### Ejecutar
\`\`\`bash
npm run dev
\`\`\`

## 3. Desplegar en Vercel

### Variables de Entorno en Vercel
Dashboard → Settings → Environment Variables:
- \`VITE_SUPABASE_URL\`
- \`VITE_SUPABASE_ANON_KEY\`

### Deploy
\`\`\`bash
vercel
\`\`\`

## 4. Configurar Row Level Security (RLS)

Ver: \`database/policies.sql\`

Importante para seguridad!
