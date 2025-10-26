# Guía de Despliegue

## Despliegue en Vercel

### Desde la Web

1. Ve a https://vercel.com
2. Sign up / Log in
3. "Import Project"
4. Conecta GitHub
5. Selecciona el repositorio
6. Configura variables de entorno:
   - \`VITE_SUPABASE_URL\`
   - \`VITE_SUPABASE_ANON_KEY\`
7. Deploy

### Desde CLI

\`\`\`bash
npm install -g vercel
vercel login
vercel
\`\`\`

## Variables de Entorno en Vercel

Dashboard → Project → Settings → Environment Variables

Agregar:
- \`VITE_SUPABASE_URL\` = tu URL de Supabase
- \`VITE_SUPABASE_ANON_KEY\` = tu clave anónima

**Importante**: Aplicar a todos los entornos (Production, Preview, Development)

## Despliegue Automático

Vercel detecta automáticamente pushes a \`main\` y crea deployments.

## Dominios Personalizados

Settings → Domains → Add Domain
