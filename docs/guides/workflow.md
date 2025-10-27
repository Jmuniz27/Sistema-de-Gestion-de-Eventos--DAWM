# Workflow de Git - Sistema de Gestión de Eventos

## 🌳 Estructura de Ramas

```
main (protegida) ← Solo producción estable
  ↑
  PR con review obligatorio
  ↑
develop (default) ← Desarrollo activo
  ↑
  PRs desde features
  ↑
feature/nombre-modulo ← Trabajo individual
```

---

## 🚀 Flujo de Trabajo

### 1. Clonar el Proyecto (Primera vez)

```bash
git clone git@github.com:Jmuniz27/Sistema-de-Gestion-de-Eventos--DAWM.git
cd Sistema-de-Gestion-de-Eventos--DAWM
git checkout develop  # Cambiar a rama develop
```

### 2. Crear Feature Branch para tu Módulo

```bash
# Asegurarte de estar en develop actualizado
git checkout develop
git pull origin develop

# Crear tu feature branch
git checkout -b feature/nombre-modulo
```

**Nomenclatura de feature branches:**
- `feature/clientes` - Módulo de Clientes
- `feature/eventos` - Módulo de Eventos
- `feature/boletos` - Módulo de Boletos
- `feature/facturacion` - Módulo de Facturación
- `feature/notificaciones` - Módulo de Notificaciones
- `feature/autenticacion` - Módulo de Autenticación
- `feature/general` - Módulo General
- `fix/bug-description` - Para correcciones de bugs

### 3. Desarrollar en tu Feature Branch

```bash
# Hacer cambios en tu código
# Agregar archivos al staging
git add .

# Commit con mensaje descriptivo
git commit -m "feat(clientes): agregar formulario de creación"

# Push a GitHub
git push origin feature/nombre-modulo
```

### 4. Crear Pull Request

1. Ve a GitHub: https://github.com/Jmuniz27/Sistema-de-Gestion-de-Eventos--DAWM
2. GitHub te sugerirá crear un PR automáticamente
3. O clic en "Pull requests" → "New pull request"
4. **Base**: `develop` ← **Compare**: `feature/nombre-modulo`
5. Título descriptivo: "feat(clientes): Implementar CRUD completo"
6. Descripción con:
   - ✅ Qué se implementó
   - ✅ Cómo probarlo
   - ✅ Capturas de pantalla (si aplica)
7. Asignar reviewer (compañero del equipo)
8. Clic en "Create pull request"

### 5. Code Review

**Si eres el autor:**
- Responder comentarios
- Hacer cambios solicitados
- Push de nuevos commits (se agregan al PR automáticamente)

**Si eres el reviewer:**
- Revisar código línea por línea
- Dejar comentarios constructivos
- Aprobar o solicitar cambios
- Clic en "Approve" cuando esté listo

### 6. Merge del Pull Request

Una vez aprobado:
1. Resolver conflictos si los hay
2. Clic en "Merge pull request"
3. Confirmar merge
4. Eliminar la feature branch (GitHub lo sugiere)

### 7. Actualizar tu Rama Local

```bash
# Volver a develop
git checkout develop

# Traer cambios del remoto
git pull origin develop

# Eliminar feature branch local (ya mergeada)
git branch -d feature/nombre-modulo
```

---

## 📝 Convenciones de Commits

### Formato:
```
tipo(alcance): descripción corta

Descripción larga opcional
```

### Tipos:
- `feat`: Nueva funcionalidad
- `fix`: Corrección de bug
- `docs`: Cambios en documentación
- `style`: Cambios de formato (no afectan funcionalidad)
- `refactor`: Refactorización de código
- `test`: Agregar o modificar tests
- `chore`: Tareas de mantenimiento

### Ejemplos:
```bash
git commit -m "feat(clientes): agregar validación de email"
git commit -m "fix(eventos): corregir formato de fecha"
git commit -m "docs(readme): actualizar instrucciones de instalación"
git commit -m "style(css): mejorar responsive de tabla"
git commit -m "refactor(utils): optimizar función de validación"
```

---

## 🔒 Reglas de Protección de Ramas

### Rama `main` (PROTEGIDA)
- ❌ **No push directo**
- ✅ Solo via Pull Request desde `develop`
- ✅ Requiere 1 aprobación mínima
- ✅ Todas las conversaciones resueltas
- ✅ Historial lineal (no merge commits)

### Rama `develop` (DEFAULT)
- ✅ Recibe PRs de feature branches
- ✅ Rama de trabajo principal
- ⚠️ Mantener estable (código que funciona)

### Feature Branches
- ✅ Libertad total para experimentar
- ✅ Push directo permitido
- ✅ Se eliminan después del merge

---

## 🛠️ Comandos Útiles

### Ver estado actual
```bash
git status
git branch -a  # Ver todas las ramas
```

### Cambiar de rama
```bash
git checkout develop
git checkout feature/clientes
```

### Actualizar desde remoto
```bash
git fetch origin
git pull origin develop
```

### Ver historial
```bash
git log --oneline -10
git log --graph --oneline --all
```

### Deshacer cambios
```bash
git restore archivo.js  # Deshacer cambios no commiteados
git reset HEAD~1  # Deshacer último commit (mantiene cambios)
```

### Resolver conflictos
```bash
# 1. Pull de develop
git checkout develop
git pull origin develop

# 2. Mergear develop en tu feature
git checkout feature/tu-modulo
git merge develop

# 3. Resolver conflictos manualmente
# 4. Agregar archivos resueltos
git add .
git commit -m "merge: resolver conflictos con develop"
git push origin feature/tu-modulo
```

---

## 🚨 Situaciones Comunes

### "Olvidé crear feature branch y trabajé en develop"
```bash
# Guardar cambios en stash
git stash

# Crear feature branch
git checkout -b feature/mi-modulo

# Recuperar cambios
git stash pop

# Commit normal
git add .
git commit -m "feat(modulo): descripción"
git push origin feature/mi-modulo
```

### "Mi feature branch está desactualizada con develop"
```bash
git checkout feature/mi-modulo
git pull origin develop
# Resolver conflictos si los hay
git push origin feature/mi-modulo
```

### "Quiero cambiar el último commit message"
```bash
git commit --amend -m "nuevo mensaje"
git push --force origin feature/mi-modulo
```

---

## 📋 Checklist Antes de Crear PR

- [ ] Mi código compila sin errores (`npm run build`)
- [ ] Probé todas las funcionalidades nuevas
- [ ] No hay console.logs innecesarios
- [ ] Seguí la nomenclatura del proyecto (Cli_, Evt_, etc.)
- [ ] Actualicé documentación si es necesario
- [ ] Mi rama está actualizada con `develop`
- [ ] Commits tienen mensajes descriptivos
- [ ] Agregué capturas de pantalla (si aplica)

---

## 📞 Contacto

Para dudas sobre el workflow:
- Revisar este documento
- Consultar con el equipo
- GitHub Discussions (si está habilitado)

---

**Última actualización**: 26 de octubre de 2025
