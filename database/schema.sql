-- ============================================
-- Sistema de Gestión de Eventos - ESPOL
-- Script de Creación de Base de Datos
-- ============================================
-- Base de Datos: PostgreSQL en Supabase
-- Fecha: Octubre 2025
-- Versión: 1.0 (Preliminar - Sujeto a revisión del equipo)
-- ============================================

-- INSTRUCCIONES:
-- 1. Ejecutar este script en Supabase SQL Editor
-- 2. Respetar nomenclatura definida:
--    - PK: id_NombreTabla (ej: id_Clientes)
--    - FK: id_NombreTabla_Fk (ej: id_Clientes_Fk)
--    - Columnas: Prefijo_Nombre (ej: Cli_Nombre, Evt_Fecha)
-- 3. Cada tabla principal incluye campo id_modulo para trazabilidad
-- 4. SERIAL para IDs autoincrementales
-- 5. Constraints definidos (NOT NULL, UNIQUE, CHECK, FK ON DELETE/UPDATE)

-- ============================================
-- EXTENSIONES NECESARIAS
-- ============================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- MÓDULO GENERAL
-- Responsables: MUNIZAGA, DIAZ, FIERRO
-- ============================================

-- Tabla: GeneroSexo
CREATE TABLE IF NOT EXISTS GeneroSexo (
    id_GeneroSexo INT PRIMARY KEY AUTO_INCREMENT,
    Gen_Nombre ENUM('M', 'F') NOT NULL
);

-- Tabla: Operadora
CREATE TABLE IF NOT EXISTS Operadora (
    id_Operadora INT PRIMARY KEY AUTO_INCREMENT,
    Ope_Nombre VARCHAR(50) NOT NULL
);

-- Tabla: EstadoCivil
CREATE TABLE IF NOT EXISTS EstadoCivil (
    id_EstadoCivil INT PRIMARY KEY AUTO_INCREMENT,
    EstCiv_Nombre ENUM('Soltero', 'Casado', 'Divorciado', 'Viudo') NOT NULL
);

-- Tabla: Proveedores
CREATE TABLE IF NOT EXISTS Proveedores (
    id_Proveedores SERIAL PRIMARY KEY,
    Prov_Nombre VARCHAR(150) NOT NULL,
    Prov_RUC VARCHAR(13) UNIQUE,
    Prov_Direccion VARCHAR(250),
    Prov_Telefono VARCHAR(15),
    Prov_Email VARCHAR(100),
    Prov_TipoServicio VARCHAR(100),
    Prov_Estado VARCHAR(20) DEFAULT 'Activo' CHECK (Prov_Estado IN ('Activo', 'Inactivo')),
    id_modulo VARCHAR(50) DEFAULT 'general',
    Prov_FechaRegistro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: TipoDocumento
CREATE TABLE IF NOT EXISTS TipoDocumento (
    id_TipoDocumento INT PRIMARY KEY AUTO_INCREMENT,
    TipDoc_Nombre ENUM('Cédula', 'RUC', 'Pasaporte') NOT NULL
);


-- Tabla: UnidadMedida
CREATE TABLE IF NOT EXISTS UnidadMedida (
    id_UnidadMedida SERIAL PRIMARY KEY,
    UMed_Nombre VARCHAR(50) NOT NULL,
    UMed_Simbolo VARCHAR(10) NOT NULL UNIQUE,
    UMed_Tipo VARCHAR(50),
    UMed_Estado VARCHAR(20) DEFAULT 'Activo' CHECK (UMed_Estado IN ('Activo', 'Inactivo')),
    id_modulo VARCHAR(50) DEFAULT 'general',
    UMed_FechaCreacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: Provincias
CREATE TABLE IF NOT EXISTS Provincias (
    id_Provincias INT PRIMARY KEY AUTO_INCREMENT,
    Prov_Nombre VARCHAR(100) NOT NULL
);

-- Tabla: Ciudades
CREATE TABLE IF NOT EXISTS Ciudades (
    id_Ciudades INT PRIMARY KEY AUTO_INCREMENT,
    id_Provincias_Fk INT NOT NULL,
    Ciu_Nombre VARCHAR(100) NOT NULL,
    FOREIGN KEY (id_Provincias_Fk) REFERENCES Provincias(id_Provincias)ON DELETE CASCADE ON UPDATE CASCADE
);

-- Tabla: EstadosGenerales
CREATE TABLE IF NOT EXISTS EstadosGenerales (
    id_EstadosGenerales SERIAL PRIMARY KEY,
    EstG_Nombre VARCHAR(50) NOT NULL UNIQUE,
    EstG_Descripcion VARCHAR(150),
    EstG_Tipo VARCHAR(50),
    EstG_Color VARCHAR(20),
    EstG_Estado VARCHAR(20) DEFAULT 'Activo' CHECK (EstG_Estado IN ('Activo', 'Inactivo')),
    id_modulo VARCHAR(50) DEFAULT 'general',
    EstG_FechaCreacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: MetodoPago
CREATE TABLE IF NOT EXISTS MetodoPago (
    id_MetodoPago SERIAL PRIMARY KEY,
    MPago_Nombre VARCHAR(50) NOT NULL UNIQUE,
    MPago_Descripcion VARCHAR(150),
    MPago_RequiereReferencia BOOLEAN DEFAULT FALSE,
    MPago_Estado VARCHAR(20) DEFAULT 'Activo' CHECK (MPago_Estado IN ('Activo', 'Inactivo')),
    id_modulo VARCHAR(50) DEFAULT 'general',
    MPago_FechaCreacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: IVA
CREATE TABLE IF NOT EXISTS IVA (
    id_IVA SERIAL PRIMARY KEY,
    IVA_Porcentaje DECIMAL(5,2) NOT NULL CHECK (IVA_Porcentaje >= 0 AND IVA_Porcentaje <= 100),
    IVA_FechaAplicacion DATE NOT NULL,
    IVA_FechaFin DATE,
    IVA_Estado VARCHAR(20) DEFAULT 'Activo' CHECK (IVA_Estado IN ('Activo', 'Inactivo')),
    id_modulo VARCHAR(50) DEFAULT 'general',
    IVA_FechaCreacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(IVA_FechaAplicacion)
);

-- ============================================
-- MÓDULO CLIENTES
-- Responsable: SORIANO LEON ALEXANDER XAVIER
-- ============================================

-- Tabla: TipoCliente
CREATE TABLE IF NOT EXISTS TipoCliente (
    id_TipoCliente INT PRIMARY KEY AUTO_INCREMENT,
    TipCli_Nombre ENUM('Persona Natural', 'Empresa') NOT NULL,
);


-- Tabla: Clientes
CREATE TABLE IF NOT EXISTS Clientes (
    id_Clientes INT PRIMARY KEY AUTO_INCREMENT,
    id_TipoCliente_Fk INT NOT NULL,       -- Persona Natural / Empresa
    id_TipoDocumento_Fk INT NOT NULL,     -- Cédula / RUC / Pasaporte
    id_GeneroSexo_Fk INT,                 -- M / F
    id_EstadoCivil_Fk INT,                -- Soltero / Casado / etc.
    id_Operadora_Fk INT,                  -- Claro / Movistar / etc.
    Cli_Nombre VARCHAR(100) NOT NULL,
    Cli_Apellido VARCHAR(100) NOT NULL,
    Cli_Identificacion VARCHAR(20) NOT NULL,
    Cli_Email VARCHAR(100) UNIQUE NOT NULL,
    Cli_Celular VARCHAR(15),
    FOREIGN KEY (id_TipoCliente_Fk) REFERENCES TipoCliente(id_TipoCliente) ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (id_TipoDocumento_Fk) REFERENCES TipoDocumento(id_TipoDocumento) ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (id_GeneroSexo_Fk) REFERENCES GeneroSexo(id_GeneroSexo) ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (id_EstadoCivil_Fk) REFERENCES EstadoCivil(id_EstadoCivil) ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (id_Operadora_Fk) REFERENCES Operadora(id_Operadora) ON DELETE SET NULL ON UPDATE CASCADE
);

-- Tabla: DireccionesCliente
CREATE TABLE IF NOT EXISTS DireccionesCliente (
    id_DireccionesCliente INT PRIMARY KEY AUTO_INCREMENT,
    id_Clientes_Fk INT NOT NULL,
    id_Ciudades_Fk INT NOT NULL,
    DirCli_Direccion VARCHAR(150) NOT NULL,
    DirCli_Referencia VARCHAR(100),
    DirCli_CodigoPostal VARCHAR(10),
    FOREIGN KEY (id_Clientes_Fk) REFERENCES Clientes(id_Clientes) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (id_Ciudades_Fk) REFERENCES Ciudades(id_Ciudades) ON DELETE RESTRICT ON UPDATE CASCADE
);

-- ============================================
-- MÓDULO EVENTOS
-- Responsable: BARZOLA DE LA O STEVEN ARIEL
-- ============================================

-- Tabla: CategoriasEvento
CREATE TABLE IF NOT EXISTS CategoriasEvento (
    id_CategoriaEvento SERIAL PRIMARY KEY,
    CatEvt_Nombre VARCHAR(100) NOT NULL UNIQUE,
    CatEvt_Descripcion TEXT,
    CatEvt_Color VARCHAR(20),
    CatEvt_Icono VARCHAR(50),
    CatEvt_Estado VARCHAR(20) DEFAULT 'Activo' CHECK (CatEvt_Estado IN ('Activo', 'Inactivo')),
    id_modulo VARCHAR(50) DEFAULT 'eventos',
    CatEvt_FechaCreacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: TipoIngreso
CREATE TABLE IF NOT EXISTS TipoIngreso (
    id_TipoIngreso SERIAL PRIMARY KEY,
    TIng_Nombre VARCHAR(50) NOT NULL UNIQUE,
    TIng_Descripcion VARCHAR(150),
    TIng_RequiereBoleto BOOLEAN DEFAULT TRUE,
    TIng_Estado VARCHAR(20) DEFAULT 'Activo' CHECK (TIng_Estado IN ('Activo', 'Inactivo')),
    id_modulo VARCHAR(50) DEFAULT 'eventos',
    TIng_FechaCreacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: Eventos
CREATE TABLE IF NOT EXISTS Eventos (
    id_Eventos SERIAL PRIMARY KEY,
    Evt_Nombre VARCHAR(200) NOT NULL,
    Evt_Descripcion TEXT,
    Evt_FechaInicio TIMESTAMP NOT NULL,
    Evt_FechaFin TIMESTAMP,
    Evt_Lugar VARCHAR(250),
    Evt_Direccion VARCHAR(300),
    id_Ciudades_Fk INT REFERENCES Ciudades(id_Ciudades) ON DELETE SET NULL ON UPDATE CASCADE,
    Evt_CapacidadTotal INT CHECK (Evt_CapacidadTotal > 0),
    Evt_CapacidadDisponible INT,
    Evt_ImagenURL VARCHAR(500),
    Evt_PrecioBaseGeneral DECIMAL(10,2),
    id_CategoriaEvento_Fk INT REFERENCES CategoriasEvento(id_CategoriaEvento) ON DELETE SET NULL ON UPDATE CASCADE,
    id_TipoIngreso_Fk INT REFERENCES TipoIngreso(id_TipoIngreso) ON DELETE SET NULL ON UPDATE CASCADE,
    id_Proveedores_Fk INT REFERENCES Proveedores(id_Proveedores) ON DELETE SET NULL ON UPDATE CASCADE,
    Evt_Estado VARCHAR(50) DEFAULT 'Programado' CHECK (Evt_Estado IN ('Programado', 'EnCurso', 'Finalizado', 'Cancelado', 'Pospuesto')),
    id_modulo VARCHAR(50) DEFAULT 'eventos',
    Evt_FechaCreacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Evt_FechaUltimaModificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CHECK (Evt_FechaFin IS NULL OR Evt_FechaFin >= Evt_FechaInicio)
);

-- Tabla: Detalle_Eventos (Opcional según necesidad)
CREATE TABLE IF NOT EXISTS Detalle_Eventos (
    id_DetalleEvento SERIAL PRIMARY KEY,
    id_Eventos_Fk INT NOT NULL REFERENCES Eventos(id_Eventos) ON DELETE CASCADE ON UPDATE CASCADE,
    DetEvt_Clave VARCHAR(50) NOT NULL,
    DetEvt_Valor TEXT,
    DetEvt_Tipo VARCHAR(50),
    id_modulo VARCHAR(50) DEFAULT 'eventos',
    DetEvt_FechaCreacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(id_Eventos_Fk, DetEvt_Clave)
);

-- ============================================
-- MÓDULO BOLETOS Y ENTRADAS
-- Responsable: BARRENO HERRERA ANDIE MATTHIUS
-- ============================================

-- Tabla: TiposBoleto
CREATE TABLE IF NOT EXISTS TiposBoleto (
    id_TiposBoleto SERIAL PRIMARY KEY,
    TBol_Nombre VARCHAR(50) NOT NULL UNIQUE,
    TBol_Descripcion VARCHAR(150),
    TBol_Prioridad INT DEFAULT 0,
    TBol_PermisoAcceso VARCHAR(100),
    TBol_Estado VARCHAR(20) DEFAULT 'Activo' CHECK (TBol_Estado IN ('Activo', 'Inactivo')),
    id_modulo VARCHAR(50) DEFAULT 'boletos',
    TBol_FechaCreacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: Boletos
CREATE TABLE IF NOT EXISTS Boletos (
    id_Boletos SERIAL PRIMARY KEY,
    Bol_Codigo VARCHAR(50) UNIQUE NOT NULL,
    Bol_CodigoQR TEXT,
    Bol_Precio DECIMAL(10,2) NOT NULL CHECK (Bol_Precio >= 0),
    Bol_PrecioOriginal DECIMAL(10,2),
    Bol_Descuento DECIMAL(10,2) DEFAULT 0,
    id_Eventos_Fk INT NOT NULL REFERENCES Eventos(id_Eventos) ON DELETE RESTRICT ON UPDATE CASCADE,
    id_TiposBoleto_Fk INT NOT NULL REFERENCES TiposBoleto(id_TiposBoleto) ON DELETE RESTRICT ON UPDATE CASCADE,
    Bol_NumeroAsiento VARCHAR(20),
    Bol_SeccionZona VARCHAR(50),
    Bol_FechaVencimiento TIMESTAMP,
    Bol_Estado VARCHAR(50) DEFAULT 'Disponible' CHECK (Bol_Estado IN ('Disponible', 'Vendido', 'Reservado', 'Cancelado', 'Usado')),
    id_modulo VARCHAR(50) DEFAULT 'boletos',
    Bol_FechaCreacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Bol_FechaVenta TIMESTAMP,
    Bol_FechaUso TIMESTAMP
);

-- Tabla: EntradasAsignadas (Relación boleto-cliente)
CREATE TABLE IF NOT EXISTS EntradasAsignadas (
    id_EntradasAsignadas SERIAL PRIMARY KEY,
    id_Boletos_Fk INT NOT NULL REFERENCES Boletos(id_Boletos) ON DELETE CASCADE ON UPDATE CASCADE,
    id_Clientes_Fk INT NOT NULL REFERENCES Clientes(id_Clientes) ON DELETE CASCADE ON UPDATE CASCADE,
    Ent_FechaAsignacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Ent_FechaValidacion TIMESTAMP,
    Ent_ValidadoPor VARCHAR(100),
    Ent_Estado VARCHAR(50) DEFAULT 'Asignada' CHECK (Ent_Estado IN ('Asignada', 'Validada', 'Cancelada')),
    id_modulo VARCHAR(50) DEFAULT 'boletos',
    UNIQUE(id_Boletos_Fk)
);

-- ============================================
-- MÓDULO FACTURACIÓN
-- Responsable: MAZA PUNNE ISSAC ALEXANDER
-- ============================================

-- Tabla: Factura
CREATE TABLE IF NOT EXISTS Factura (
    id_Factura SERIAL PRIMARY KEY,
    Fac_Numero VARCHAR(50) UNIQUE NOT NULL,
    Fac_Serie VARCHAR(20),
    Fac_FechaEmision TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    id_Clientes_Fk INT NOT NULL REFERENCES Clientes(id_Clientes) ON DELETE RESTRICT ON UPDATE CASCADE,
    Fac_Subtotal DECIMAL(10,2) NOT NULL DEFAULT 0,
    Fac_PorcentajeIVA DECIMAL(5,2),
    Fac_ValorIVA DECIMAL(10,2) DEFAULT 0,
    Fac_Descuento DECIMAL(10,2) DEFAULT 0,
    Fac_Total DECIMAL(10,2) NOT NULL DEFAULT 0,
    id_MetodoPago_Fk INT REFERENCES MetodoPago(id_MetodoPago) ON DELETE SET NULL ON UPDATE CASCADE,
    Fac_ReferenciaPago VARCHAR(100),
    Fac_Observaciones TEXT,
    Fac_Estado VARCHAR(50) DEFAULT 'Emitida' CHECK (Fac_Estado IN ('Emitida', 'Pagada', 'Anulada', 'Pendiente')),
    id_modulo VARCHAR(50) DEFAULT 'facturacion',
    Fac_FechaCreacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Fac_FechaPago TIMESTAMP,
    CHECK (Fac_Total >= 0)
);

-- Tabla: Detalle_factura
CREATE TABLE IF NOT EXISTS Detalle_factura (
    id_Detalle_factura SERIAL PRIMARY KEY,
    id_Factura_Fk INT NOT NULL REFERENCES Factura(id_Factura) ON DELETE CASCADE ON UPDATE CASCADE,
    id_Boletos_Fk INT REFERENCES Boletos(id_Boletos) ON DELETE SET NULL ON UPDATE CASCADE,
    DetFac_Descripcion VARCHAR(250) NOT NULL,
    DetFac_Cantidad INT NOT NULL DEFAULT 1 CHECK (DetFac_Cantidad > 0),
    DetFac_PrecioUnitario DECIMAL(10,2) NOT NULL CHECK (DetFac_PrecioUnitario >= 0),
    DetFac_Descuento DECIMAL(10,2) DEFAULT 0,
    DetFac_Subtotal DECIMAL(10,2) NOT NULL,
    id_modulo VARCHAR(50) DEFAULT 'facturacion',
    DetFac_FechaCreacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CHECK (DetFac_Subtotal >= 0)
);

-- ============================================
-- MÓDULO NOTIFICACIONES
-- Responsable: ARMIJOS ROMERO ERICK DANILO
-- ============================================

-- Tabla: Plantillas
CREATE TABLE IF NOT EXISTS Plantillas (
    id_Plantillas SERIAL PRIMARY KEY,
    Pla_Nombre VARCHAR(100) NOT NULL UNIQUE,
    Pla_Asunto VARCHAR(250),
    Pla_Contenido TEXT NOT NULL,
    Pla_Tipo VARCHAR(20) CHECK (Pla_Tipo IN ('Email', 'Push', 'SMS')),
    Pla_Variables TEXT,
    Pla_Estado VARCHAR(20) DEFAULT 'Activo' CHECK (Pla_Estado IN ('Activo', 'Inactivo')),
    id_modulo VARCHAR(50) DEFAULT 'notificaciones',
    Pla_FechaCreacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Pla_FechaUltimaModificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: Notificaciones
CREATE TABLE IF NOT EXISTS Notificaciones (
    id_Notificaciones SERIAL PRIMARY KEY,
    Not_Asunto VARCHAR(250),
    Not_Mensaje TEXT NOT NULL,
    Not_Tipo VARCHAR(20) NOT NULL CHECK (Not_Tipo IN ('Email', 'Push', 'SMS')),
    id_Plantillas_Fk INT REFERENCES Plantillas(id_Plantillas) ON DELETE SET NULL ON UPDATE CASCADE,
    Not_FechaProgramada TIMESTAMP,
    Not_FechaEnvio TIMESTAMP,
    Not_IntentosEnvio INT DEFAULT 0,
    Not_Estado VARCHAR(50) DEFAULT 'Pendiente' CHECK (Not_Estado IN ('Pendiente', 'Enviada', 'Fallida', 'Cancelada')),
    Not_ErrorMensaje TEXT,
    id_modulo VARCHAR(50) DEFAULT 'notificaciones',
    Not_FechaCreacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: Destinatarios
CREATE TABLE IF NOT EXISTS Destinatarios (
    id_Destinatarios SERIAL PRIMARY KEY,
    id_Notificaciones_Fk INT NOT NULL REFERENCES Notificaciones(id_Notificaciones) ON DELETE CASCADE ON UPDATE CASCADE,
    id_Clientes_Fk INT REFERENCES Clientes(id_Clientes) ON DELETE CASCADE ON UPDATE CASCADE,
    Dest_Email VARCHAR(150),
    Dest_Telefono VARCHAR(15),
    Dest_DeviceToken VARCHAR(500),
    Dest_FechaEnvio TIMESTAMP,
    Dest_FechaLectura TIMESTAMP,
    Dest_Estado VARCHAR(50) DEFAULT 'Pendiente' CHECK (Dest_Estado IN ('Pendiente', 'Enviado', 'Leido', 'Fallido')),
    id_modulo VARCHAR(50) DEFAULT 'notificaciones',
    Dest_FechaCreacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- MÓDULO AUTENTICACIÓN Y ROLES
-- Responsable: TUMBACO SANTANA GABRIEL ALEJANDRO
-- ============================================

-- Tabla: ROLES
CREATE TABLE IF NOT EXISTS ROLES (
    id_ROLES SERIAL PRIMARY KEY,
    Rol_Nombre VARCHAR(50) UNIQUE NOT NULL,
    Rol_Descripcion TEXT,
    Rol_Nivel INT DEFAULT 0,
    Rol_Estado VARCHAR(20) DEFAULT 'Activo' CHECK (Rol_Estado IN ('Activo', 'Inactivo')),
    id_modulo VARCHAR(50) DEFAULT 'autenticacion',
    Rol_FechaCreacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: USUARIOS
CREATE TABLE IF NOT EXISTS USUARIOS (
    id_USUARIOS SERIAL PRIMARY KEY,
    Usr_Email VARCHAR(150) UNIQUE NOT NULL,
    Usr_Nombre VARCHAR(100) NOT NULL,
    Usr_Apellido VARCHAR(100),
    Usr_Telefono VARCHAR(15),
    Usr_Avatar VARCHAR(500),
    id_ROLES_Fk INT REFERENCES ROLES(id_ROLES) ON DELETE SET NULL ON UPDATE CASCADE,
    Usr_UltimoAcceso TIMESTAMP,
    Usr_Estado VARCHAR(20) DEFAULT 'Activo' CHECK (Usr_Estado IN ('Activo', 'Inactivo', 'Bloqueado')),
    id_modulo VARCHAR(50) DEFAULT 'autenticacion',
    Usr_FechaRegistro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Usr_FechaUltimaModificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: LOGIN
CREATE TABLE IF NOT EXISTS LOGIN (
    id_LOGIN SERIAL PRIMARY KEY,
    id_USUARIOS_Fk INT UNIQUE NOT NULL REFERENCES USUARIOS(id_USUARIOS) ON DELETE CASCADE ON UPDATE CASCADE,
    Log_Username VARCHAR(50) UNIQUE NOT NULL,
    Log_PasswordHash VARCHAR(255) NOT NULL,
    Log_Salt VARCHAR(100),
    Log_RequiereCambioPassword BOOLEAN DEFAULT FALSE,
    Log_IntentosLogin INT DEFAULT 0,
    Log_FechaUltimoIntento TIMESTAMP,
    Log_FechaUltimoCambioPassword TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Log_TokenRecuperacion VARCHAR(255),
    Log_FechaExpiracionToken TIMESTAMP,
    Log_Estado VARCHAR(20) DEFAULT 'Activo' CHECK (Log_Estado IN ('Activo', 'Bloqueado', 'Suspendido')),
    id_modulo VARCHAR(50) DEFAULT 'autenticacion',
    Log_FechaCreacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: Permisos (Pantallas/Vistas/Formularios por Rol)
CREATE TABLE IF NOT EXISTS Permisos (
    id_Permisos SERIAL PRIMARY KEY,
    id_ROLES_Fk INT NOT NULL REFERENCES ROLES(id_ROLES) ON DELETE CASCADE ON UPDATE CASCADE,
    Per_Modulo VARCHAR(50) NOT NULL,
    Per_Pantalla VARCHAR(100) NOT NULL,
    Per_Lectura BOOLEAN DEFAULT FALSE,
    Per_Escritura BOOLEAN DEFAULT FALSE,
    Per_Actualizacion BOOLEAN DEFAULT FALSE,
    Per_Eliminacion BOOLEAN DEFAULT FALSE,
    Per_Exportacion BOOLEAN DEFAULT FALSE,
    Per_Estado VARCHAR(20) DEFAULT 'Activo' CHECK (Per_Estado IN ('Activo', 'Inactivo')),
    id_modulo VARCHAR(50) DEFAULT 'autenticacion',
    Per_FechaCreacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(id_ROLES_Fk, Per_Modulo, Per_Pantalla)
);

-- ============================================
-- ÍNDICES PARA OPTIMIZACIÓN
-- ============================================

-- Índices para búsquedas frecuentes
CREATE INDEX IF NOT EXISTS idx_clientes_email ON Clientes(Cli_Email);
CREATE INDEX IF NOT EXISTS idx_clientes_celular ON Clientes(Cli_Celular);
CREATE INDEX IF NOT EXISTS idx_clientes_estado ON Clientes(Cli_Estado);
CREATE INDEX IF NOT EXISTS idx_clientes_tipo ON Clientes(id_TipoCliente_Fk);

CREATE INDEX IF NOT EXISTS idx_eventos_fecha_inicio ON Eventos(Evt_FechaInicio);
CREATE INDEX IF NOT EXISTS idx_eventos_categoria ON Eventos(id_CategoriaEvento_Fk);
CREATE INDEX IF NOT EXISTS idx_eventos_estado ON Eventos(Evt_Estado);
CREATE INDEX IF NOT EXISTS idx_eventos_ciudad ON Eventos(id_Ciudades_Fk);

CREATE INDEX IF NOT EXISTS idx_boletos_codigo ON Boletos(Bol_Codigo);
CREATE INDEX IF NOT EXISTS idx_boletos_estado ON Boletos(Bol_Estado);
CREATE INDEX IF NOT EXISTS idx_boletos_evento ON Boletos(id_Eventos_Fk);

CREATE INDEX IF NOT EXISTS idx_factura_numero ON Factura(Fac_Numero);
CREATE INDEX IF NOT EXISTS idx_factura_cliente ON Factura(id_Clientes_Fk);
CREATE INDEX IF NOT EXISTS idx_factura_fecha ON Factura(Fac_FechaEmision);
CREATE INDEX IF NOT EXISTS idx_factura_estado ON Factura(Fac_Estado);

CREATE INDEX IF NOT EXISTS idx_notificaciones_tipo ON Notificaciones(Not_Tipo);
CREATE INDEX IF NOT EXISTS idx_notificaciones_estado ON Notificaciones(Not_Estado);
CREATE INDEX IF NOT EXISTS idx_notificaciones_fecha ON Notificaciones(Not_FechaProgramada);

CREATE INDEX IF NOT EXISTS idx_usuarios_email ON USUARIOS(Usr_Email);
CREATE INDEX IF NOT EXISTS idx_usuarios_rol ON USUARIOS(id_ROLES_Fk);
CREATE INDEX IF NOT EXISTS idx_login_username ON LOGIN(Log_Username);

-- ============================================
-- COMENTARIOS EN TABLAS (Documentación)
-- ============================================

COMMENT ON TABLE Clientes IS 'Tabla principal de clientes con información personal y de contacto';
COMMENT ON TABLE Eventos IS 'Registro de eventos con fechas, capacidad y ubicación';
COMMENT ON TABLE Boletos IS 'Boletos generados para eventos con precios y estados';
COMMENT ON TABLE Factura IS 'Facturas emitidas con detalles de pago e IVA';
COMMENT ON TABLE Notificaciones IS 'Registro de notificaciones enviadas (Email/Push/SMS)';
COMMENT ON TABLE USUARIOS IS 'Usuarios del sistema con roles asignados';
COMMENT ON TABLE Permisos IS 'Permisos de acceso por rol a pantallas/funcionalidades';

-- ============================================
-- FIN DEL SCRIPT
-- ============================================

-- NOTA: Este es un schema preliminar sujeto a revisión por el equipo.
-- Cada módulo puede ajustar sus tablas según necesidades específicas.
-- Respetar siempre la nomenclatura definida y el campo id_modulo.
