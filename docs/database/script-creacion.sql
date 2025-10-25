-- ============================================
-- SISTEMA DE GESTIÓN DE EVENTOS - ESPOL
-- Script de Creación de Base de Datos
-- ============================================
--
-- Materia: SOFG1006 - Desarrollo de Aplicaciones Web y Móviles
-- Institución: Escuela Superior Politécnica del Litoral (ESPOL)
-- Período: II PAO 2025
--
-- Este script crea todas las tablas necesarias para el sistema
-- siguiendo las convenciones de nomenclatura especificadas.
--
-- IMPORTANTE: Ejecutar en Azure SQL Database
-- ============================================

-- ============================================
-- MÓDULO GENERAL - Tablas de Catálogo
-- ============================================

-- Tabla: GeneroSexo
CREATE TABLE GeneroSexo (
    id_GeneroSexo INT IDENTITY(1,1) PRIMARY KEY,
    GenSex_Codigo VARCHAR(1) NOT NULL UNIQUE, -- M, F
    GenSex_Descripcion VARCHAR(20) NOT NULL,
    GenSex_Estado VARCHAR(20) NOT NULL DEFAULT 'Activo',
    GenSex_FechaCreacion DATETIME NOT NULL DEFAULT GETDATE()
);

-- Tabla: EstadoCivil
CREATE TABLE EstadoCivil (
    id_EstadoCivil INT IDENTITY(1,1) PRIMARY KEY,
    EstCiv_Descripcion VARCHAR(50) NOT NULL UNIQUE, -- Soltero, Casado, Divorciado, Viudo
    EstCiv_Estado VARCHAR(20) NOT NULL DEFAULT 'Activo',
    EstCiv_FechaCreacion DATETIME NOT NULL DEFAULT GETDATE()
);

-- Tabla: Operadora
CREATE TABLE Operadora (
    id_Operadora INT IDENTITY(1,1) PRIMARY KEY,
    Ope_Nombre VARCHAR(100) NOT NULL UNIQUE, -- Claro, Movistar, CNT
    Ope_Codigo VARCHAR(10),
    Ope_Estado VARCHAR(20) NOT NULL DEFAULT 'Activo',
    Ope_FechaCreacion DATETIME NOT NULL DEFAULT GETDATE()
);

-- Tabla: Provincias
CREATE TABLE Provincias (
    id_Provincias INT IDENTITY(1,1) PRIMARY KEY,
    Prov_Nombre VARCHAR(100) NOT NULL UNIQUE,
    Prov_Codigo VARCHAR(2) NOT NULL UNIQUE, -- Código provincial (01-24)
    Prov_Estado VARCHAR(20) NOT NULL DEFAULT 'Activo',
    Prov_FechaCreacion DATETIME NOT NULL DEFAULT GETDATE()
);

-- Tabla: Ciudades
CREATE TABLE Ciudades (
    id_Ciudades INT IDENTITY(1,1) PRIMARY KEY,
    Ciu_Nombre VARCHAR(100) NOT NULL,
    id_Provincias_Fk INT NOT NULL,
    Ciu_Estado VARCHAR(20) NOT NULL DEFAULT 'Activo',
    Ciu_FechaCreacion DATETIME NOT NULL DEFAULT GETDATE(),
    FOREIGN KEY (id_Provincias_Fk) REFERENCES Provincias(id_Provincias)
);

-- Tabla: TipoDocumento
CREATE TABLE TipoDocumento (
    id_TipoDocumento INT IDENTITY(1,1) PRIMARY KEY,
    TipDoc_Nombre VARCHAR(50) NOT NULL UNIQUE, -- Cédula, RUC, Pasaporte
    TipDoc_Codigo VARCHAR(10) NOT NULL UNIQUE,
    TipDoc_Longitud INT, -- Longitud del documento (10 para cédula, 13 para RUC)
    TipDoc_Estado VARCHAR(20) NOT NULL DEFAULT 'Activo',
    TipDoc_FechaCreacion DATETIME NOT NULL DEFAULT GETDATE()
);

-- Tabla: EstadosGenerales
CREATE TABLE EstadosGenerales (
    id_EstadosGenerales INT IDENTITY(1,1) PRIMARY KEY,
    EstGen_Descripcion VARCHAR(50) NOT NULL UNIQUE, -- Activo, Inactivo, Pendiente, Cancelado, etc.
    EstGen_Color VARCHAR(20), -- Para UI (success, danger, warning, etc.)
    EstGen_Aplicacion VARCHAR(100), -- A qué módulo aplica
    EstGen_Estado VARCHAR(20) NOT NULL DEFAULT 'Activo',
    EstGen_FechaCreacion DATETIME NOT NULL DEFAULT GETDATE()
);

-- Tabla: MetodoPago
CREATE TABLE MetodoPago (
    id_MetodoPago INT IDENTITY(1,1) PRIMARY KEY,
    MetPag_Nombre VARCHAR(100) NOT NULL UNIQUE, -- Efectivo, Tarjeta, Transferencia
    MetPag_Descripcion VARCHAR(300),
    MetPag_RequiereComprobante BIT NOT NULL DEFAULT 0,
    MetPag_Estado VARCHAR(20) NOT NULL DEFAULT 'Activo',
    MetPag_FechaCreacion DATETIME NOT NULL DEFAULT GETDATE()
);

-- Tabla: IVA
CREATE TABLE IVA (
    id_IVA INT IDENTITY(1,1) PRIMARY KEY,
    IVA_Porcentaje DECIMAL(5,2) NOT NULL, -- Ej: 12.00, 15.00
    IVA_FechaInicio DATE NOT NULL,
    IVA_FechaFin DATE,
    IVA_Estado VARCHAR(20) NOT NULL DEFAULT 'Activo',
    IVA_FechaCreacion DATETIME NOT NULL DEFAULT GETDATE()
);

-- Tabla: Proveedores
CREATE TABLE Proveedores (
    id_Proveedores INT IDENTITY(1,1) PRIMARY KEY,
    Prov_RUC VARCHAR(13) NOT NULL UNIQUE,
    Prov_RazonSocial VARCHAR(200) NOT NULL,
    Prov_NombreComercial VARCHAR(200),
    Prov_Direccion VARCHAR(300),
    Prov_Telefono VARCHAR(20),
    Prov_Email VARCHAR(100),
    Prov_Contacto VARCHAR(100),
    Prov_Estado VARCHAR(20) NOT NULL DEFAULT 'Activo',
    Prov_FechaRegistro DATETIME NOT NULL DEFAULT GETDATE(),
    id_modulo VARCHAR(50) DEFAULT 'ModuloGeneral'
);

-- ============================================
-- MÓDULO CLIENTES
-- ============================================

-- Tabla: TipoCliente
CREATE TABLE TipoCliente (
    id_TipoCliente INT IDENTITY(1,1) PRIMARY KEY,
    TipCli_Nombre VARCHAR(100) NOT NULL UNIQUE, -- Persona Natural, Empresa
    TipCli_Descripcion VARCHAR(300),
    TipCli_Estado VARCHAR(20) NOT NULL DEFAULT 'Activo',
    TipCli_FechaCreacion DATETIME NOT NULL DEFAULT GETDATE()
);

-- Tabla: Clientes
CREATE TABLE Clientes (
    id_Clientes INT IDENTITY(1,1) PRIMARY KEY,
    Cli_Nombre VARCHAR(100) NOT NULL,
    Cli_Apellido VARCHAR(100) NOT NULL,
    Cli_Email VARCHAR(100) NOT NULL UNIQUE,
    Cli_Celular VARCHAR(10) NOT NULL,
    Cli_Telefono VARCHAR(10),
    Cli_FechaNacimiento DATE,
    Cli_Direccion VARCHAR(300),
    id_TipoCliente_Fk INT NOT NULL,
    id_GeneroSexo_Fk INT,
    id_EstadoCivil_Fk INT,
    Cli_FechaRegistro DATETIME NOT NULL DEFAULT GETDATE(),
    Cli_Estado VARCHAR(20) NOT NULL DEFAULT 'Activo',
    id_modulo VARCHAR(50) DEFAULT 'Clientes',
    FOREIGN KEY (id_TipoCliente_Fk) REFERENCES TipoCliente(id_TipoCliente),
    FOREIGN KEY (id_GeneroSexo_Fk) REFERENCES GeneroSexo(id_GeneroSexo),
    FOREIGN KEY (id_EstadoCivil_Fk) REFERENCES EstadoCivil(id_EstadoCivil)
);

-- Tabla: DireccionesCliente
CREATE TABLE DireccionesCliente (
    id_DireccionesCliente INT IDENTITY(1,1) PRIMARY KEY,
    id_Clientes_Fk INT NOT NULL,
    DirCli_Descripcion VARCHAR(300) NOT NULL,
    DirCli_Referencia VARCHAR(300),
    id_Ciudades_Fk INT NOT NULL,
    DirCli_CodigoPostal VARCHAR(10),
    DirCli_EsPrincipal BIT NOT NULL DEFAULT 0,
    DirCli_Estado VARCHAR(20) NOT NULL DEFAULT 'Activo',
    DirCli_FechaCreacion DATETIME NOT NULL DEFAULT GETDATE(),
    FOREIGN KEY (id_Clientes_Fk) REFERENCES Clientes(id_Clientes),
    FOREIGN KEY (id_Ciudades_Fk) REFERENCES Ciudades(id_Ciudades)
);

-- ============================================
-- MÓDULO EVENTOS
-- ============================================

-- Tabla: CategoriasEvento
CREATE TABLE CategoriasEvento (
    id_CategoriasEvento INT IDENTITY(1,1) PRIMARY KEY,
    CatEvt_Nombre VARCHAR(100) NOT NULL UNIQUE, -- Concierto, Conferencia, Taller, Fiesta
    CatEvt_Descripcion VARCHAR(300),
    CatEvt_Color VARCHAR(20), -- Para UI
    CatEvt_Estado VARCHAR(20) NOT NULL DEFAULT 'Activo',
    CatEvt_FechaCreacion DATETIME NOT NULL DEFAULT GETDATE()
);

-- Tabla: TipoIngreso
CREATE TABLE TipoIngreso (
    id_TipoIngreso INT IDENTITY(1,1) PRIMARY KEY,
    TipIng_Nombre VARCHAR(100) NOT NULL UNIQUE, -- Con Boleto, Invitación, Libre
    TipIng_Descripcion VARCHAR(300),
    TipIng_RequiereBoleto BIT NOT NULL DEFAULT 1,
    TipIng_Estado VARCHAR(20) NOT NULL DEFAULT 'Activo',
    TipIng_FechaCreacion DATETIME NOT NULL DEFAULT GETDATE()
);

-- Tabla: Eventos
CREATE TABLE Eventos (
    id_Eventos INT IDENTITY(1,1) PRIMARY KEY,
    Evt_Nombre VARCHAR(200) NOT NULL,
    Evt_Descripcion VARCHAR(1000),
    Evt_FechaInicio DATETIME NOT NULL,
    Evt_FechaFin DATETIME NOT NULL,
    Evt_Lugar VARCHAR(300) NOT NULL,
    Evt_Direccion VARCHAR(300),
    Evt_CapacidadTotal INT NOT NULL,
    Evt_CapacidadDisponible INT NOT NULL,
    id_CategoriasEvento_Fk INT NOT NULL,
    id_TipoIngreso_Fk INT NOT NULL,
    Evt_PrecioBase DECIMAL(10,2),
    Evt_ImagenURL VARCHAR(500),
    Evt_Estado VARCHAR(20) NOT NULL DEFAULT 'Activo', -- Activo, Cancelado, Finalizado
    Evt_FechaCreacion DATETIME NOT NULL DEFAULT GETDATE(),
    id_modulo VARCHAR(50) DEFAULT 'Eventos',
    FOREIGN KEY (id_CategoriasEvento_Fk) REFERENCES CategoriasEvento(id_CategoriasEvento),
    FOREIGN KEY (id_TipoIngreso_Fk) REFERENCES TipoIngreso(id_TipoIngreso),
    CHECK (Evt_FechaFin >= Evt_FechaInicio),
    CHECK (Evt_CapacidadDisponible <= Evt_CapacidadTotal)
);

-- ============================================
-- MÓDULO BOLETOS
-- ============================================

-- Tabla: TiposBoleto
CREATE TABLE TiposBoleto (
    id_TiposBoleto INT IDENTITY(1,1) PRIMARY KEY,
    TipBol_Nombre VARCHAR(100) NOT NULL, -- VIP, General, Estudiante
    TipBol_Descripcion VARCHAR(300),
    TipBol_Estado VARCHAR(20) NOT NULL DEFAULT 'Activo',
    TipBol_FechaCreacion DATETIME NOT NULL DEFAULT GETDATE()
);

-- Tabla: Boletos
CREATE TABLE Boletos (
    id_Boletos INT IDENTITY(1,1) PRIMARY KEY,
    Bol_Codigo VARCHAR(50) NOT NULL UNIQUE, -- Código único del boleto
    id_Eventos_Fk INT NOT NULL,
    id_TiposBoleto_Fk INT NOT NULL,
    id_Clientes_Fk INT,
    Bol_Precio DECIMAL(10,2) NOT NULL,
    Bol_FechaVenta DATETIME,
    Bol_FechaValidacion DATETIME,
    Bol_Estado VARCHAR(20) NOT NULL DEFAULT 'Disponible', -- Disponible, Vendido, Usado, Cancelado
    Bol_FechaCreacion DATETIME NOT NULL DEFAULT GETDATE(),
    id_modulo VARCHAR(50) DEFAULT 'Boletos',
    FOREIGN KEY (id_Eventos_Fk) REFERENCES Eventos(id_Eventos),
    FOREIGN KEY (id_TiposBoleto_Fk) REFERENCES TiposBoleto(id_TiposBoleto),
    FOREIGN KEY (id_Clientes_Fk) REFERENCES Clientes(id_Clientes)
);

-- ============================================
-- MÓDULO FACTURACIÓN
-- ============================================

-- Tabla: Factura
CREATE TABLE Factura (
    id_Factura INT IDENTITY(1,1) PRIMARY KEY,
    Fac_Numero VARCHAR(50) NOT NULL UNIQUE, -- Número secuencial de factura
    id_Clientes_Fk INT NOT NULL,
    Fac_Fecha DATETIME NOT NULL DEFAULT GETDATE(),
    Fac_Subtotal DECIMAL(10,2) NOT NULL,
    id_IVA_Fk INT NOT NULL,
    Fac_ValorIVA DECIMAL(10,2) NOT NULL,
    Fac_Total DECIMAL(10,2) NOT NULL,
    id_MetodoPago_Fk INT NOT NULL,
    Fac_Estado VARCHAR(20) NOT NULL DEFAULT 'Emitida', -- Emitida, Pagada, Anulada
    Fac_FechaCreacion DATETIME NOT NULL DEFAULT GETDATE(),
    id_modulo VARCHAR(50) DEFAULT 'Facturacion',
    FOREIGN KEY (id_Clientes_Fk) REFERENCES Clientes(id_Clientes),
    FOREIGN KEY (id_IVA_Fk) REFERENCES IVA(id_IVA),
    FOREIGN KEY (id_MetodoPago_Fk) REFERENCES MetodoPago(id_MetodoPago)
);

-- Tabla: DetalleFactura
CREATE TABLE DetalleFactura (
    id_DetalleFactura INT IDENTITY(1,1) PRIMARY KEY,
    id_Factura_Fk INT NOT NULL,
    id_Boletos_Fk INT NOT NULL,
    DetFac_Cantidad INT NOT NULL DEFAULT 1,
    DetFac_PrecioUnitario DECIMAL(10,2) NOT NULL,
    DetFac_Subtotal DECIMAL(10,2) NOT NULL,
    DetFac_FechaCreacion DATETIME NOT NULL DEFAULT GETDATE(),
    FOREIGN KEY (id_Factura_Fk) REFERENCES Factura(id_Factura),
    FOREIGN KEY (id_Boletos_Fk) REFERENCES Boletos(id_Boletos)
);

-- ============================================
-- MÓDULO NOTIFICACIONES
-- ============================================

-- Tabla: PlantillasNotificacion
CREATE TABLE PlantillasNotificacion (
    id_PlantillasNotificacion INT IDENTITY(1,1) PRIMARY KEY,
    PlanNot_Nombre VARCHAR(100) NOT NULL UNIQUE,
    PlanNot_Asunto VARCHAR(200) NOT NULL,
    PlanNot_Cuerpo VARCHAR(MAX) NOT NULL,
    PlanNot_Tipo VARCHAR(20) NOT NULL, -- Email, Push
    PlanNot_Estado VARCHAR(20) NOT NULL DEFAULT 'Activo',
    PlanNot_FechaCreacion DATETIME NOT NULL DEFAULT GETDATE()
);

-- Tabla: Notificaciones
CREATE TABLE Notificaciones (
    id_Notificaciones INT IDENTITY(1,1) PRIMARY KEY,
    Not_Asunto VARCHAR(200) NOT NULL,
    Not_Mensaje VARCHAR(MAX) NOT NULL,
    Not_Tipo VARCHAR(20) NOT NULL, -- Email, Push
    Not_FechaEnvio DATETIME,
    Not_Estado VARCHAR(20) NOT NULL DEFAULT 'Pendiente', -- Pendiente, Enviado, Error
    Not_FechaCreacion DATETIME NOT NULL DEFAULT GETDATE(),
    id_modulo VARCHAR(50) DEFAULT 'Notificaciones'
);

-- Tabla: DestinatariosNotificacion
CREATE TABLE DestinatariosNotificacion (
    id_DestinatariosNotificacion INT IDENTITY(1,1) PRIMARY KEY,
    id_Notificaciones_Fk INT NOT NULL,
    id_Clientes_Fk INT NOT NULL,
    DestNot_Leido BIT NOT NULL DEFAULT 0,
    DestNot_FechaLectura DATETIME,
    DestNot_FechaCreacion DATETIME NOT NULL DEFAULT GETDATE(),
    FOREIGN KEY (id_Notificaciones_Fk) REFERENCES Notificaciones(id_Notificaciones),
    FOREIGN KEY (id_Clientes_Fk) REFERENCES Clientes(id_Clientes)
);

-- ============================================
-- MÓDULO AUTENTICACIÓN
-- ============================================

-- Tabla: Roles
CREATE TABLE Roles (
    id_Roles INT IDENTITY(1,1) PRIMARY KEY,
    Rol_Nombre VARCHAR(50) NOT NULL UNIQUE, -- Administrador, Vendedor, Cliente
    Rol_Descripcion VARCHAR(300),
    Rol_Estado VARCHAR(20) NOT NULL DEFAULT 'Activo',
    Rol_FechaCreacion DATETIME NOT NULL DEFAULT GETDATE()
);

-- Tabla: Usuarios
CREATE TABLE Usuarios (
    id_Usuarios INT IDENTITY(1,1) PRIMARY KEY,
    Usu_NombreUsuario VARCHAR(50) NOT NULL UNIQUE,
    Usu_Email VARCHAR(100) NOT NULL UNIQUE,
    Usu_Password VARCHAR(255) NOT NULL, -- Hash de la contraseña
    id_Clientes_Fk INT,
    id_Roles_Fk INT NOT NULL,
    Usu_UltimoAcceso DATETIME,
    Usu_Estado VARCHAR(20) NOT NULL DEFAULT 'Activo',
    Usu_FechaCreacion DATETIME NOT NULL DEFAULT GETDATE(),
    id_modulo VARCHAR(50) DEFAULT 'Autenticacion',
    FOREIGN KEY (id_Clientes_Fk) REFERENCES Clientes(id_Clientes),
    FOREIGN KEY (id_Roles_Fk) REFERENCES Roles(id_Roles)
);

-- Tabla: Permisos
CREATE TABLE Permisos (
    id_Permisos INT IDENTITY(1,1) PRIMARY KEY,
    Per_Nombre VARCHAR(100) NOT NULL UNIQUE,
    Per_Descripcion VARCHAR(300),
    Per_Modulo VARCHAR(50) NOT NULL,
    Per_Estado VARCHAR(20) NOT NULL DEFAULT 'Activo',
    Per_FechaCreacion DATETIME NOT NULL DEFAULT GETDATE()
);

-- Tabla: RolesPermisos (relación muchos a muchos)
CREATE TABLE RolesPermisos (
    id_RolesPermisos INT IDENTITY(1,1) PRIMARY KEY,
    id_Roles_Fk INT NOT NULL,
    id_Permisos_Fk INT NOT NULL,
    RolPer_FechaAsignacion DATETIME NOT NULL DEFAULT GETDATE(),
    FOREIGN KEY (id_Roles_Fk) REFERENCES Roles(id_Roles),
    FOREIGN KEY (id_Permisos_Fk) REFERENCES Permisos(id_Permisos),
    UNIQUE(id_Roles_Fk, id_Permisos_Fk)
);

-- ============================================
-- ÍNDICES PARA OPTIMIZACIÓN
-- ============================================

-- Índices en Clientes
CREATE INDEX IX_Clientes_Email ON Clientes(Cli_Email);
CREATE INDEX IX_Clientes_Estado ON Clientes(Cli_Estado);

-- Índices en Eventos
CREATE INDEX IX_Eventos_FechaInicio ON Eventos(Evt_FechaInicio);
CREATE INDEX IX_Eventos_Estado ON Eventos(Evt_Estado);

-- Índices en Boletos
CREATE INDEX IX_Boletos_Codigo ON Boletos(Bol_Codigo);
CREATE INDEX IX_Boletos_Estado ON Boletos(Bol_Estado);

-- Índices en Factura
CREATE INDEX IX_Factura_Numero ON Factura(Fac_Numero);
CREATE INDEX IX_Factura_Fecha ON Factura(Fac_Fecha);

-- ============================================
-- SCRIPT COMPLETADO
-- ============================================
-- Todas las tablas han sido creadas exitosamente
-- El sistema está listo para insertar datos de prueba
