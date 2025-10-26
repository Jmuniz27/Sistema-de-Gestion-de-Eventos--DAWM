# Documentación de API de Supabase

## Cliente Supabase

El cliente está inicializado en: \`src/scripts/supabase-client.js\`

## Operaciones CRUD

### Select (Leer)
\`\`\`javascript
const { data, error } = await supabase
  .from('Clientes')
  .select('*')
\`\`\`

### Insert (Crear)
\`\`\`javascript
const { data, error } = await supabase
  .from('Clientes')
  .insert({ Cli_Nombre: 'Juan', Cli_Email: 'juan@example.com' })
\`\`\`

### Update (Actualizar)
\`\`\`javascript
const { data, error } = await supabase
  .from('Clientes')
  .update({ Cli_Nombre: 'Juan Actualizado' })
  .eq('id_Clientes', 1)
\`\`\`

### Delete (Eliminar)
\`\`\`javascript
const { data, error } = await supabase
  .from('Clientes')
  .delete()
  .eq('id_Clientes', 1)
\`\`\`

## Filtros y Joins

Ver: https://supabase.com/docs/reference/javascript/select

## Autenticación

Ver: https://supabase.com/docs/guides/auth
