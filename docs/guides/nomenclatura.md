# Guía de Nomenclatura del Proyecto

## Base de Datos

### Tablas
- **Formato**: PascalCase
- **Ejemplos**: \`Clientes\`, \`Eventos\`, \`GeneroSexo\`

### Claves Primarias
- **Formato**: \`id_NombreTabla\`
- **Ejemplos**: \`id_Clientes\`, \`id_Eventos\`

### Claves Foráneas
- **Formato**: \`id_NombreTabla_Fk\`
- **Ejemplos**: \`id_Clientes_Fk\`, \`id_TipoCliente_Fk\`

### Columnas
- **Formato**: \`Prefijo_Nombre\`
- **Prefijos**:
  - \`Gen_\`: Módulo General
  - \`Cli_\`: Clientes
  - \`Evt_\`: Eventos
  - \`Bol_\`: Boletos
  - \`Fac_\`: Facturación
  - \`Not_\`: Notificaciones
  - \`Usr_\`: Usuarios

### Campo de Trazabilidad
- \`id_modulo VARCHAR(50)\`
- Valores: \`'general'\`, \`'clientes'\`, \`'eventos'\`, etc.

## Código JavaScript

- **Variables**: camelCase (\`userName\`)
- **Funciones**: camelCase (\`getUserData()\`)
- **Clases**: PascalCase (\`UserManager\`)
- **Constantes**: UPPER_SNAKE_CASE (\`API_URL\`)
- **Archivos**: kebab-case (\`user-manager.js\`)

## HTML/CSS

- **Clases CSS**: kebab-case (\`.user-card\`)
- **IDs**: camelCase (\`#userName\`)
- **BEM**: \`.block__element--modifier\`
