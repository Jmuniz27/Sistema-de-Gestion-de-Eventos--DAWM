-- ============================================
-- Sistema de Gestión de Eventos - ESPOL
-- Script de Creación de Base de Datos
-- ============================================
-- Base de Datos: PostgreSQL en Supabase
-- Fecha: 2025
-- ============================================

-- INSTRUCCIONES:
-- 1. Ejecutar este script en Supabase SQL Editor
-- 2. Respetar nomenclatura definida:
--    - PK: id_NombreTabla (ej: id_Clientes)
--    - FK: id_NombreTabla_Fk (ej: id_Clientes_Fk)
--    - Columnas: Prefijo_Nombre (ej: Cli_Nombre, Evt_Fecha)
-- 3. Cada tabla principal incluye campo id_modulo para trazabilidad
-- 4. Usar SERIAL para IDs autoincrementales
-- 5. Definir constraints (NOT NULL, UNIQUE, CHECK)

-- ============================================
-- EXTENSIONES NECESARIAS
-- ============================================
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- MÓDULO GENERAL
-- Responsables: MUNIZAGA, DIAZ, FIERRO
-- ============================================

-- Tabla: GeneroSexo
-- Propósito: Catálogo de géneros (M, F)
-- Columnas: id_GeneroSexo (PK), Gen_Nombre, Gen_Estado, id_modulo
-- CREATE TABLE GeneroSexo (...);

-- Tabla: Operadora
-- Propósito: Catálogo de operadoras telefónicas (Claro, Movistar, etc.)
-- CREATE TABLE Operadora (...);

-- Tabla: EstadoCivil
-- Propósito: Catálogo de estados civiles (Soltero, Casado, etc.)
-- CREATE TABLE EstadoCivil (...);

-- Tabla: Proveedores
-- Propósito: Proveedores de servicios para eventos
-- CREATE TABLE Proveedores (...);

-- Tabla: TipoDocumento
-- Propósito: Tipos de documento (Cédula, RUC, Pasaporte)
-- CREATE TABLE TipoDocumento (...);

-- Tabla: UnidadMedida
-- Propósito: Unidades de medida (ml, gr, tabletas)
-- CREATE TABLE UnidadMedida (...);

-- Tabla: Provincias
-- Propósito: Provincias del Ecuador
-- CREATE TABLE Provincias (...);

-- Tabla: Ciudades
-- Propósito: Ciudades (relacionada con Provincias)
-- CREATE TABLE Ciudades (
--   id_Ciudades SERIAL PRIMARY KEY,
--   id_Provincias_Fk INT REFERENCES Provincias(id_Provincias),
--   ...
-- );

-- Tabla: EstadosGenerales
-- Propósito: Estados genéricos (Activo, Inactivo, Eliminado)
-- CREATE TABLE EstadosGenerales (...);

-- Tabla: MetodoPago
-- Propósito: Métodos de pago (Efectivo, Tarjeta, Transferencia)
-- CREATE TABLE MetodoPago (...);

-- Tabla: IVA
-- Propósito: Porcentajes de IVA según fecha de aplicación
-- CREATE TABLE IVA (
--   id_IVA SERIAL PRIMARY KEY,
--   IVA_Porcentaje DECIMAL(5,2) NOT NULL,
--   IVA_FechaAplicacion DATE NOT NULL,
--   id_modulo VARCHAR(50) DEFAULT 'general'
-- );

-- ============================================
-- MÓDULO CLIENTES
-- Responsable: SORIANO LEON ALEXANDER XAVIER
-- ============================================

-- Tabla: TipoCliente
-- Propósito: Tipos de cliente (Persona natural, Empresa)
-- CREATE TABLE TipoCliente (...);

-- Tabla: Clientes
-- Propósito: Datos principales de clientes
-- Columnas: Cli_Nombre, Cli_Apellido, Cli_Email, Cli_Celular
-- CREATE TABLE Clientes (
--   id_Clientes SERIAL PRIMARY KEY,
--   Cli_Nombre VARCHAR(100) NOT NULL,
--   Cli_Apellido VARCHAR(100) NOT NULL,
--   Cli_Email VARCHAR(150) UNIQUE NOT NULL,
--   Cli_Celular VARCHAR(15) NOT NULL,
--   id_TipoCliente_Fk INT REFERENCES TipoCliente(id_TipoCliente),
--   id_modulo VARCHAR(50) DEFAULT 'clientes',
--   Cli_FechaRegistro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

-- Tabla: DireccionesCliente
-- Propósito: Direcciones de entrega de clientes (un cliente puede tener varias)
-- CREATE TABLE DireccionesCliente (
--   id_DireccionesCliente SERIAL PRIMARY KEY,
--   id_Clientes_Fk INT REFERENCES Clientes(id_Clientes) ON DELETE CASCADE,
--   Dir_Calle VARCHAR(200),
--   Dir_Ciudad VARCHAR(100),
--   id_Provincias_Fk INT REFERENCES Provincias(id_Provincias),
--   ...
-- );

-- ============================================
-- MÓDULO EVENTOS
-- Responsable: BARZOLA DE LA O STEVEN ARIEL
-- ============================================

-- Tabla: CategoriasEvento
-- Propósito: Categorías de eventos (Concierto, Conferencia, Taller, Fiesta)
-- CREATE TABLE CategoriasEvento (...);

-- Tabla: TipoIngreso
-- Propósito: Tipo de ingreso (se ingresa o no con boleto, invitación, etc.)
-- CREATE TABLE TipoIngreso (...);

-- Tabla: Eventos
-- Propósito: Datos principales de eventos
-- Columnas: Evt_Nombre, Evt_Descripcion, Evt_Fecha, Evt_Lugar, Evt_Capacidad, Evt_Estado
-- CREATE TABLE Eventos (
--   id_Eventos SERIAL PRIMARY KEY,
--   Evt_Nombre VARCHAR(200) NOT NULL,
--   Evt_Descripcion TEXT,
--   Evt_Fecha TIMESTAMP NOT NULL,
--   Evt_Lugar VARCHAR(200),
--   Evt_Capacidad INT,
--   Evt_Estado VARCHAR(50),
--   id_CategoriaEvento_Fk INT REFERENCES CategoriasEvento(id_CategoriaEvento),
--   id_TipoIngreso_Fk INT REFERENCES TipoIngreso(id_TipoIngreso),
--   id_modulo VARCHAR(50) DEFAULT 'eventos'
-- );

-- Tabla: Detalle_Eventos
-- Propósito: Detalles adicionales de eventos (se puede eliminar según relación)
-- CREATE TABLE Detalle_Eventos (...);

-- ============================================
-- MÓDULO BOLETOS Y ENTRADAS
-- Responsable: BARRENO HERRERA ANDIE MATTHIUS
-- ============================================

-- Tabla: TiposBoleto
-- Propósito: Tipos de boleto (VIP, General, Estudiante, etc.)
-- CREATE TABLE TiposBoleto (...);

-- Tabla: Boletos
-- Propósito: Boletos generados para eventos
-- Columnas: Bol_Codigo, Bol_Tipo, Bol_Precio, Bol_Estado
-- CREATE TABLE Boletos (
--   id_Boletos SERIAL PRIMARY KEY,
--   Bol_Codigo VARCHAR(50) UNIQUE NOT NULL,
--   Bol_Precio DECIMAL(10,2) NOT NULL,
--   Bol_Estado VARCHAR(50), -- vendido, disponible, cancelado
--   id_Eventos_Fk INT REFERENCES Eventos(id_Eventos),
--   id_TiposBoleto_Fk INT REFERENCES TiposBoleto(id_TiposBoleto),
--   id_modulo VARCHAR(50) DEFAULT 'boletos'
-- );

-- Tabla: EntradasAsignadas
-- Propósito: Entradas asignadas a clientes (según la relación, se puede eliminar)
-- CREATE TABLE EntradasAsignadas (
--   id_EntradasAsignadas SERIAL PRIMARY KEY,
--   id_Boletos_Fk INT REFERENCES Boletos(id_Boletos),
--   id_Clientes_Fk INT REFERENCES Clientes(id_Clientes),
--   Ent_FechaAsignacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

-- ============================================
-- MÓDULO FACTURACIÓN
-- Responsable: MAZA PUNNE ISSAC ALEXANDER
-- ============================================

-- Tabla: Factura
-- Propósito: Facturas generadas
-- CREATE TABLE Factura (
--   id_Factura SERIAL PRIMARY KEY,
--   Fac_Numero VARCHAR(50) UNIQUE NOT NULL,
--   Fac_Fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--   Fac_Subtotal DECIMAL(10,2),
--   Fac_IVA DECIMAL(10,2),
--   Fac_Total DECIMAL(10,2),
--   id_Clientes_Fk INT REFERENCES Clientes(id_Clientes),
--   id_MetodoPago_Fk INT REFERENCES MetodoPago(id_MetodoPago),
--   id_modulo VARCHAR(50) DEFAULT 'facturacion'
-- );

-- Tabla: Detalle_factura
-- Propósito: Detalles de cada factura (líneas de productos/boletos)
-- CREATE TABLE Detalle_factura (
--   id_Detalle_factura SERIAL PRIMARY KEY,
--   id_Factura_Fk INT REFERENCES Factura(id_Factura) ON DELETE CASCADE,
--   id_Boletos_Fk INT REFERENCES Boletos(id_Boletos),
--   DetFac_Cantidad INT,
--   DetFac_PrecioUnitario DECIMAL(10,2),
--   DetFac_Subtotal DECIMAL(10,2)
-- );

-- ============================================
-- MÓDULO NOTIFICACIONES
-- Responsable: ARMIJOS ROMERO ERICK DANILO
-- ============================================

-- Tabla: Notificaciones
-- Propósito: Registro de notificaciones enviadas (email/push)
-- CREATE TABLE Notificaciones (
--   id_Notificaciones SERIAL PRIMARY KEY,
--   Not_Mensaje TEXT,
--   Not_Tipo VARCHAR(20), -- email, push
--   Not_FechaEnvio TIMESTAMP,
--   Not_Estado VARCHAR(50), -- enviado, pendiente
--   id_modulo VARCHAR(50) DEFAULT 'notificaciones'
-- );

-- Tabla: Destinatarios
-- Propósito: Relaciona notificaciones con clientes o personal
-- CREATE TABLE Destinatarios (
--   id_Destinatarios SERIAL PRIMARY KEY,
--   id_Notificaciones_Fk INT REFERENCES Notificaciones(id_Notificaciones),
--   id_Clientes_Fk INT REFERENCES Clientes(id_Clientes),
--   ...
-- );

-- Tabla: Plantillas
-- Propósito: Plantillas prediseñadas para notificaciones
-- CREATE TABLE Plantillas (
--   id_Plantillas SERIAL PRIMARY KEY,
--   Pla_Nombre VARCHAR(100),
--   Pla_Contenido TEXT
-- );

-- ============================================
-- MÓDULO AUTENTICACIÓN Y ROLES
-- Responsable: TUMBACO SANTANA GABRIEL ALEJANDRO
-- ============================================

-- Tabla: USUARIOS
-- Propósito: Usuarios del sistema
-- CREATE TABLE USUARIOS (
--   id_USUARIOS SERIAL PRIMARY KEY,
--   Usr_Email VARCHAR(150) UNIQUE NOT NULL,
--   Usr_Nombre VARCHAR(100),
--   Usr_FechaRegistro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--   id_modulo VARCHAR(50) DEFAULT 'autenticacion'
-- );

-- Tabla: ROLES
-- Propósito: Roles de usuario (Admin, Vendedor, Cliente, etc.)
-- CREATE TABLE ROLES (
--   id_ROLES SERIAL PRIMARY KEY,
--   Rol_Nombre VARCHAR(50) UNIQUE NOT NULL,
--   Rol_Descripcion TEXT
-- );

-- Tabla: LOGIN
-- Propósito: Credenciales de acceso
-- CREATE TABLE LOGIN (...);

-- Tabla: Permisos
-- Propósito: Pantallas/vistas/formularios a los que cada rol tiene acceso
-- CREATE TABLE Permisos (
--   id_Permisos SERIAL PRIMARY KEY,
--   id_ROLES_Fk INT REFERENCES ROLES(id_ROLES),
--   Per_Pantalla VARCHAR(100), -- ej: 'clientes', 'eventos'
--   Per_Lectura BOOLEAN,
--   Per_Escritura BOOLEAN,
--   Per_Eliminacion BOOLEAN
-- );

-- ============================================
-- ÍNDICES PARA OPTIMIZACIÓN
-- ============================================
-- CREATE INDEX idx_clientes_email ON Clientes(Cli_Email);
-- CREATE INDEX idx_eventos_fecha ON Eventos(Evt_Fecha);
-- CREATE INDEX idx_boletos_codigo ON Boletos(Bol_Codigo);

-- ============================================
-- FIN DEL SCRIPT
-- ============================================
