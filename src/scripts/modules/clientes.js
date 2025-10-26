/**
 * Módulo: Clientes
 * Archivo: src/scripts/modules/clientes.js
 * Responsable: SORIANO LEON ALEXANDER XAVIER
 *
 * Tablas: Clientes, DireccionesCliente, TipoCliente
 * Nomenclatura columnas: Cli_Nombre, Cli_Apellido, Cli_Email, Cli_Celular
 * PK: id_Clientes | FK: id_TipoCliente_Fk
 *
 * Funciones CRUD:
 * - listarClientes(filtros, pagina, limite)
 * - obtenerClientePorId(id)
 * - crearCliente(datosCliente, direcciones)
 * - actualizarCliente(id, datos)
 * - eliminarCliente(id)
 * - buscarClientes(termino)
 * - obtenerDireccionesCliente(idCliente)
 *
 * Reportes:
 * - reporteClientesPorTipo()
 * - reporteClientesActivos()
 * - reporteIntegrado(): Clientes con compras (cruza con Facturación)
 */

import { supabase } from '../supabase-client.js'

// TODO: Implementar funciones
