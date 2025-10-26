-- ============================================
-- Script de Datos de Ejemplo
-- Sistema de Gestión de Eventos - ESPOL
-- ============================================

-- INSTRUCCIONES:
-- 1. Ejecutar DESPUÉS de schema.sql
-- 2. Estos son datos de prueba para desarrollo/testing
-- 3. NO usar en producción

-- ============================================
-- DATOS DE MÓDULO GENERAL
-- ============================================

-- INSERT INTO GeneroSexo (Gen_Nombre, Gen_Estado, id_modulo) VALUES
-- ('Masculino', 'Activo', 'general'),
-- ('Femenino', 'Activo', 'general');

-- INSERT INTO EstadosGenerales (...) VALUES (...);

-- INSERT INTO Provincias (...) VALUES
-- ('Guayas'), ('Pichincha'), ('Manabí'), ...;

-- ============================================
-- DATOS DE CLIENTES
-- ============================================

-- INSERT INTO TipoCliente (...) VALUES
-- ('Persona Natural'), ('Empresa');

-- INSERT INTO Clientes (Cli_Nombre, Cli_Apellido, Cli_Email, Cli_Celular, id_TipoCliente_Fk, id_modulo) VALUES
-- ('Juan', 'Pérez', 'juan.perez@ejemplo.com', '0987654321', 1, 'clientes'),
-- ('María', 'García', 'maria.garcia@ejemplo.com', '0998765432', 1, 'clientes');

-- ============================================
-- DATOS DE EVENTOS
-- ============================================

-- INSERT INTO CategoriasEvento (...) VALUES
-- ('Concierto'), ('Conferencia'), ('Taller'), ('Fiesta');

-- INSERT INTO Eventos (Evt_Nombre, Evt_Fecha, Evt_Lugar, Evt_Capacidad, id_modulo) VALUES
-- ('Concierto de Rock', '2025-12-01 20:00:00', 'Estadio Modelo', 5000, 'eventos');

-- TODO: Agregar más datos de ejemplo para todos los módulos
