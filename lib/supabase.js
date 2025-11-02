/**
 * Cliente de Supabase para Sistema de Gestión de Eventos
 *
 * Este módulo inicializa y exporta el cliente de Supabase configurado
 * para conectarse a la base de datos PostgreSQL del proyecto.
 *
 * @module lib/supabase
 * @requires @supabase/supabase-js
 */

import { createClient } from '@supabase/supabase-js';

// Validar que las variables de entorno estén configuradas
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    '❌ Error: Faltan credenciales de Supabase.\n' +
    'Por favor configura VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY en tu archivo .env\n' +
    'Puedes copiar .env.example a .env y completar con tus credenciales.'
  );
}

/**
 * Cliente de Supabase configurado
 *
 * Opciones de configuración:
 * - auth.persistSession: Mantiene la sesión del usuario en localStorage
 * - auth.autoRefreshToken: Refresca automáticamente el token de autenticación
 * - auth.detectSessionInUrl: Detecta tokens en la URL para OAuth
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

/**
 * Verifica la conexión con Supabase
 *
 * @returns {Promise<Object>} Objeto con status y mensaje
 * @example
 * const { success, message } = await testConnection();
 * console.log(message);
 */
export async function testConnection() {
  try {
    const { data, error } = await supabase
      .from('Provincias')
      .select('count')
      .limit(1);

    if (error) {
      return {
        success: false,
        message: `❌ Error de conexión: ${error.message}`
      };
    }

    return {
      success: true,
      message: '✅ Conexión exitosa a Supabase'
    };
  } catch (err) {
    return {
      success: false,
      message: `❌ Error inesperado: ${err.message}`
    };
  }
}

/**
 * Obtiene información del usuario autenticado
 *
 * @returns {Promise<Object|null>} Datos del usuario o null
 * @example
 * const user = await getCurrentUser();
 * if (user) console.log(`Hola ${user.email}`);
 */
export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error) {
    console.error('Error obteniendo usuario:', error.message);
    return null;
  }

  return user;
}

/**
 * Obtiene el rol del usuario autenticado desde la tabla USUARIOS
 *
 * @returns {Promise<string|null>} Nombre del rol o null
 * @example
 * const role = await getUserRole();
 * if (role === 'Administrador') console.log('Tienes acceso completo');
 */
export async function getUserRole() {
  const user = await getCurrentUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from('USUARIOS')
    .select(`
      ROLES (
        Rol_Nombre
      )
    `)
    .eq('Usr_Email', user.email)
    .single();

  if (error) {
    console.error('Error obteniendo rol:', error.message);
    return null;
  }

  return data?.ROLES?.Rol_Nombre || null;
}

export default supabase;
