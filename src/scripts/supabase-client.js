/**
 * Archivo: src/scripts/supabase-client.js
 * Propósito: Inicializar y exportar el cliente de Supabase para toda la aplicación
 *
 * Este archivo es el punto central de conexión con Supabase.
 * Todas las operaciones de BD deben usar este cliente.
 *
 * Configuración:
 * 1. Las credenciales se obtienen de las variables de entorno (.env)
 * 2. VITE_SUPABASE_URL: URL de tu proyecto en Supabase
 * 3. VITE_SUPABASE_ANON_KEY: Clave anónima pública de Supabase
 *
 * Cómo obtener las credenciales:
 * - Ve a https://supabase.com/dashboard
 * - Selecciona tu proyecto
 * - Settings → API
 * - Copia "Project URL" y "anon public" key
 * - Pégalas en tu archivo .env
 *
 * Uso en otros archivos:
 * import { supabase } from './supabase-client.js'
 * const { data, error } = await supabase.from('Clientes').select('*')
 *
 * Dependencias:
 * - @supabase/supabase-js (instalado via npm)
 * - Variables de entorno (.env)
 *
 * Usado por:
 * - Todos los módulos en scripts/modules/
 * - auth.js para autenticación
 */

import { createClient } from '@supabase/supabase-js'

// Obtener credenciales de las variables de entorno
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Validar que las credenciales existan
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Error: Faltan las credenciales de Supabase')
  console.error('Asegúrate de tener un archivo .env con:')
  console.error('VITE_SUPABASE_URL=tu-url')
  console.error('VITE_SUPABASE_ANON_KEY=tu-key')
}

// Crear y exportar el cliente de Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Verificar conexión (opcional, para debugging)
console.log('Cliente de Supabase inicializado correctamente')
