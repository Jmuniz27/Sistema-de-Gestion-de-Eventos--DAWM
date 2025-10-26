# Guía de Contribución

## Flujo de Trabajo con Git

### Ramas (Branches)

- \`main\`: Rama principal (código en producción)
- \`develop\`: Rama de desarrollo
- \`feature/nombre-feature\`: Para nuevas funcionalidades
- \`fix/nombre-fix\`: Para correcciones de bugs
- \`module/nombre-modulo\`: Para trabajar en módulos específicos

### Conventional Commits

Usar mensajes de commit descriptivos:

\`\`\`
feat(clientes): agregar formulario de creación de clientes
fix(eventos): corregir validación de fecha
docs(readme): actualizar instrucciones de instalación
style(css): mejorar estilos de tabla
refactor(utils): optimizar función de validación
\`\`\`

### Pull Requests

1. Crear branch desde \`develop\`
2. Hacer cambios y commits
3. Push a GitHub
4. Crear PR a \`develop\`
5. Code review por compañeros
6. Merge después de aprobación

## Estándares de Código

### JavaScript
- Usar ES6+ features
- Funciones async/await
- Comentar funciones complejas
- Evitar console.log en producción

### HTML
- HTML5 semántico
- Accesibilidad (aria-labels)
- SEO básico (meta tags)

### CSS
- Mobile-first
- Variables CSS
- BEM naming: \`.block__element--modifier\`

## Convenciones del Proyecto

Ver: [docs/guides/nomenclatura.md](docs/guides/nomenclatura.md)
