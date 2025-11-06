/**
 * Módulo: Autenticación y Roles
 * Responsable: TUMBACO SANTANA GABRIEL ALEJANDRO
 *
 * Tablas: LOGIN, USUARIOS, ROLES, Permisos (pantallas/vistas/formularios)
 * Gestión de permisos por rol
 */

import { supabase } from '../supabase-client.js'

// TODO: Implementar gestión de usuarios y roles
// TODO: Implementar control de permisos

import { getData } from '../auth.js'

const { data, error } = await getData()
if (error) console.error(error)
else console.log(data)