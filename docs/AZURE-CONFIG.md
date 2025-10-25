# Configuración de Variables de Entorno en Azure App Service

## Sistema de Gestión de Eventos - ESPOL

---

## 🔐 Configurar Variables de Entorno en Azure

Ya que tu repositorio está sincronizado con Azure App Service, el deployment se hará automáticamente. Sin embargo, necesitas configurar las variables de entorno manualmente en Azure.

---

## Método 1: Desde Azure Portal (Interfaz Web) - RECOMENDADO

### Paso 1: Acceder al Azure Portal

1. Ve a [portal.azure.com](https://portal.azure.com)
2. Inicia sesión con tu cuenta de Azure

### Paso 2: Navegar a tu App Service

1. En el menú lateral, busca "App Services"
2. Haz clic en tu App Service (el nombre de tu aplicación)

### Paso 3: Configurar Application Settings

1. En el menú lateral de tu App Service, busca **"Configuration"** (Configuración)
2. Haz clic en la pestaña **"Application settings"**
3. Haz clic en **"+ New application setting"**

### Paso 4: Agregar cada Variable de Entorno

Agrega las siguientes variables una por una:

#### Variables de Base de Datos

1. **DB_SERVER**
   - Name: `DB_SERVER`
   - Value: `tu-servidor.database.windows.net`
   - Ejemplo: `eventos-db-server.database.windows.net`

2. **DB_DATABASE**
   - Name: `DB_DATABASE`
   - Value: `eventos_db` (o el nombre de tu base de datos)

3. **DB_USER**
   - Name: `DB_USER`
   - Value: `tu_usuario_admin`

4. **DB_PASSWORD**
   - Name: `DB_PASSWORD`
   - Value: `tu_password_seguro`
   - ⚠️ IMPORTANTE: Marca esta como **Deployment slot setting** si quieres que sea específica del entorno

5. **DB_PORT**
   - Name: `DB_PORT`
   - Value: `1433`

#### Variables del Servidor

6. **NODE_ENV**
   - Name: `NODE_ENV`
   - Value: `production`

7. **ALLOWED_ORIGINS**
   - Name: `ALLOWED_ORIGINS`
   - Value: `https://tu-app.azurewebsites.net,https://www.tu-dominio.com`
   - Nota: Separa múltiples URLs con comas, sin espacios

#### Variables Opcionales (Autenticación)

8. **JWT_SECRET** (si implementas autenticación)
   - Name: `JWT_SECRET`
   - Value: `una_clave_secreta_muy_larga_y_segura_123456`

9. **JWT_EXPIRATION**
   - Name: `JWT_EXPIRATION`
   - Value: `24h`

### Paso 5: Guardar Configuración

1. Haz clic en **"Save"** (Guardar) en la parte superior
2. Confirma cuando te pregunte si quieres reiniciar la aplicación
3. Espera a que la aplicación se reinicie (esto puede tomar 1-2 minutos)

---

## Método 2: Usando Azure CLI

Si prefieres la línea de comandos, puedes usar Azure CLI:

```bash
# Iniciar sesión en Azure
az login

# Configurar las variables (reemplaza con tus valores)
az webapp config appsettings set \
  --name tu-app-service-name \
  --resource-group tu-resource-group \
  --settings \
    DB_SERVER="tu-servidor.database.windows.net" \
    DB_DATABASE="eventos_db" \
    DB_USER="tu_usuario" \
    DB_PASSWORD="tu_password" \
    DB_PORT="1433" \
    NODE_ENV="production" \
    ALLOWED_ORIGINS="https://tu-app.azurewebsites.net"
```

---

## Método 3: Usando Visual Studio Code con Azure Extension

### Paso 1: Instalar la Extensión

1. En VS Code, ve a Extensions
2. Busca "Azure App Service"
3. Instala la extensión oficial de Microsoft

### Paso 2: Configurar Variables

1. En la barra lateral, haz clic en el ícono de Azure
2. Inicia sesión en tu cuenta de Azure
3. Expande tu suscripción → App Services → tu aplicación
4. Haz clic derecho en "Application Settings"
5. Selecciona "Add New Setting"
6. Ingresa nombre y valor de cada variable

---

## 📋 Lista Completa de Variables a Configurar

Copia y pega esta tabla con tus valores reales:

| Variable | Valor de Ejemplo | Tu Valor Real |
|----------|------------------|---------------|
| `DB_SERVER` | `eventos-db.database.windows.net` | _____________ |
| `DB_DATABASE` | `eventos_db` | _____________ |
| `DB_USER` | `admin_eventos` | _____________ |
| `DB_PASSWORD` | `P@ssw0rd123!` | _____________ |
| `DB_PORT` | `1433` | `1433` |
| `NODE_ENV` | `production` | `production` |
| `ALLOWED_ORIGINS` | `https://mi-app.azurewebsites.net` | _____________ |
| `JWT_SECRET` | `mi_secreto_super_seguro_2025` | _____________ |
| `JWT_EXPIRATION` | `24h` | `24h` |

---

## 🔍 Verificar que las Variables se Configuraron Correctamente

### Desde Azure Portal

1. Ve a Configuration → Application settings
2. Deberías ver todas las variables listadas
3. Verifica que no haya errores de tipeo

### Desde los Logs de la Aplicación

1. En tu App Service, ve a **"Log stream"** (en el menú lateral)
2. Reinicia tu aplicación
3. Observa los logs para ver si la conexión a la base de datos es exitosa
4. Deberías ver: `✅ Conexión a la base de datos establecida correctamente`

### Haciendo una Petición de Prueba

```bash
# Prueba que el servidor esté funcionando
curl https://tu-app.azurewebsites.net/health

# Deberías recibir:
# {"status":"OK","timestamp":"...","uptime":123}
```

---

## ⚠️ Problemas Comunes y Soluciones

### Problema 1: "Cannot connect to database"

**Causas posibles**:
- Variables de entorno mal configuradas
- IP de Azure App Service no está en el firewall de Azure SQL Database

**Solución**:
1. Ve a tu Azure SQL Database
2. En "Security" → "Networking"
3. Asegúrate de que esté marcado: **"Allow Azure services and resources to access this server"**
4. Si no funciona, agrega la IP de salida de tu App Service:
   - Ve a tu App Service → Properties
   - Copia las "Outbound IP Addresses"
   - Agrégalas al firewall de SQL Database

### Problema 2: "CORS Error"

**Solución**:
- Verifica que `ALLOWED_ORIGINS` incluya la URL correcta de tu aplicación
- Formato correcto: `https://tu-app.azurewebsites.net` (sin / al final)

### Problema 3: Las variables no se reflejan

**Solución**:
1. Después de guardar, **siempre reinicia la aplicación**:
   - En Azure Portal → Overview → clic en "Restart"
2. Espera 2-3 minutos para que tome efecto

### Problema 4: "Application Error"

**Solución**:
1. Ve a "Log stream" para ver el error exacto
2. Verifica que todas las variables estén sin espacios extra
3. Verifica que el archivo `package.json` tenga el script `start` correcto

---

## 🚀 Después de Configurar las Variables

### 1. Verificar el Deployment

El código ya se subió a GitHub, así que:
1. Azure App Service debería detectar automáticamente el push
2. Iniciará un deployment automático (si tienes GitHub Actions configurado)
3. Puedes ver el progreso en: App Service → Deployment Center

### 2. Probar la Aplicación

1. Ve a: `https://tu-app.azurewebsites.net`
2. Deberías ver la página principal del sistema
3. Navega a "Clientes" para probar el módulo
4. Si hay datos de ejemplo en la BD, deberían aparecer

### 3. Monitorear Logs

```bash
# Ver logs en tiempo real
az webapp log tail --name tu-app-service-name --resource-group tu-resource-group
```

O desde Azure Portal:
- App Service → Log stream

---

## 📝 Notas Importantes

### Seguridad

- ❌ **NUNCA** subas el archivo `.env` a GitHub (ya está en `.gitignore`)
- ✅ Las variables en Azure App Service están encriptadas
- ✅ Usa contraseñas fuertes para `DB_PASSWORD`
- ✅ Cambia `JWT_SECRET` regularmente si lo usas

### Variables Específicas de Azure

Azure App Service automáticamente proporciona:
- `PORT` - No necesitas configurarlo, Azure lo asigna automáticamente
- `WEBSITE_HOSTNAME` - El hostname de tu app

Tu código ya está preparado para esto:
```javascript
const PORT = process.env.PORT || 3000;
```

### Conexión String Alternativa (Opcional)

En lugar de variables separadas, también puedes usar una connection string completa:

```
DB_CONNECTION_STRING="Server=tcp:tu-servidor.database.windows.net,1433;Database=eventos_db;User ID=tu_usuario;Password=tu_password;Encrypt=true;TrustServerCertificate=false;"
```

Pero el método de variables separadas es más flexible y seguro.

---

## ✅ Checklist de Configuración

- [ ] Todas las variables de base de datos configuradas
- [ ] `NODE_ENV` configurado como `production`
- [ ] `ALLOWED_ORIGINS` configurado con URL de Azure
- [ ] Variables guardadas en Azure Portal
- [ ] Aplicación reiniciada
- [ ] Firewall de SQL Database permite Azure services
- [ ] IP de App Service agregada al firewall (si es necesario)
- [ ] Logs verificados (no hay errores de conexión)
- [ ] Aplicación accesible desde el navegador
- [ ] Módulo de Clientes funciona correctamente

---

## 🔗 URLs Útiles

- **Azure Portal**: https://portal.azure.com
- **Tu App Service**: https://portal.azure.com/#@/resource/subscriptions/.../providers/Microsoft.Web/sites/tu-app
- **Tu Aplicación**: https://tu-app.azurewebsites.net
- **Deployment Center**: https://tu-app.azurewebsites.net/.scm/

---

## 🆘 Soporte

Si algo no funciona:
1. Revisa los logs en "Log stream"
2. Verifica el "Deployment Center" para ver si el deployment fue exitoso
3. Usa "Diagnose and solve problems" en Azure Portal
4. Revisa la documentación de Azure: https://docs.microsoft.com/azure/app-service/

---

**Última actualización**: 2025
**Proyecto**: Sistema de Gestión de Eventos - ESPOL
