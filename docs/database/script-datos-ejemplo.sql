-- ============================================
-- SISTEMA DE GESTIÓN DE EVENTOS - ESPOL
-- Script de Datos de Ejemplo
-- ============================================
--
-- Este script inserta datos de prueba en todas las tablas
-- para facilitar el testing del sistema.
-- ============================================

-- ============================================
-- MÓDULO GENERAL
-- ============================================

-- GeneroSexo
INSERT INTO GeneroSexo (GenSex_Codigo, GenSex_Descripcion) VALUES
('M', 'Masculino'),
('F', 'Femenino');

-- EstadoCivil
INSERT INTO EstadoCivil (EstCiv_Descripcion) VALUES
('Soltero/a'),
('Casado/a'),
('Divorciado/a'),
('Viudo/a'),
('Unión Libre');

-- Operadora
INSERT INTO Operadora (Ope_Nombre, Ope_Codigo) VALUES
('Claro', 'CLR'),
('Movistar', 'MOV'),
('CNT', 'CNT'),
('Tuenti', 'TUE');

-- Provincias
INSERT INTO Provincias (Prov_Nombre, Prov_Codigo) VALUES
('Guayas', '09'),
('Pichincha', '17'),
('Azuay', '01'),
('Manabí', '13'),
('El Oro', '07');

-- Ciudades
INSERT INTO Ciudades (Ciu_Nombre, id_Provincias_Fk) VALUES
('Guayaquil', 1),
('Durán', 1),
('Samborondón', 1),
('Quito', 2),
('Cuenca', 3),
('Machala', 5),
('Manta', 4);

-- TipoDocumento
INSERT INTO TipoDocumento (TipDoc_Nombre, TipDoc_Codigo, TipDoc_Longitud) VALUES
('Cédula', 'CED', 10),
('RUC', 'RUC', 13),
('Pasaporte', 'PAS', 20);

-- EstadosGenerales
INSERT INTO EstadosGenerales (EstGen_Descripcion, EstGen_Color, EstGen_Aplicacion) VALUES
('Activo', 'success', 'General'),
('Inactivo', 'secondary', 'General'),
('Pendiente', 'warning', 'General'),
('Cancelado', 'danger', 'General'),
('Finalizado', 'info', 'Eventos');

-- MetodoPago
INSERT INTO MetodoPago (MetPag_Nombre, MetPag_Descripcion, MetPag_RequiereComprobante) VALUES
('Efectivo', 'Pago en efectivo', 0),
('Tarjeta de Crédito', 'Pago con tarjeta de crédito', 1),
('Tarjeta de Débito', 'Pago con tarjeta de débito', 1),
('Transferencia Bancaria', 'Transferencia bancaria', 1),
('PayPal', 'Pago por PayPal', 1);

-- IVA
INSERT INTO IVA (IVA_Porcentaje, IVA_FechaInicio, IVA_FechaFin) VALUES
(12.00, '2020-01-01', '2023-12-31'),
(15.00, '2024-01-01', NULL);

-- Proveedores
INSERT INTO Proveedores (Prov_RUC, Prov_RazonSocial, Prov_NombreComercial, Prov_Telefono, Prov_Email) VALUES
('0992345678001', 'Servicios Eventos S.A.', 'EventPro', '042345678', 'contacto@eventpro.com'),
('0991234567001', 'Catering Deluxe', 'Catering Deluxe', '042123456', 'info@cateringdeluxe.com');

-- ============================================
-- MÓDULO CLIENTES
-- ============================================

-- TipoCliente
INSERT INTO TipoCliente (TipCli_Nombre, TipCli_Descripcion) VALUES
('Persona Natural', 'Cliente individual'),
('Empresa', 'Cliente corporativo');

-- Clientes
INSERT INTO Clientes (Cli_Nombre, Cli_Apellido, Cli_Email, Cli_Celular, Cli_Telefono, Cli_FechaNacimiento, Cli_Direccion, id_TipoCliente_Fk, id_GeneroSexo_Fk, id_EstadoCivil_Fk) VALUES
('Juan', 'Pérez', 'juan.perez@email.com', '0987654321', '042345678', '1990-05-15', 'Av. Principal 123', 1, 1, 1),
('María', 'González', 'maria.gonzalez@email.com', '0987654322', '042345679', '1985-08-20', 'Calle Secundaria 456', 1, 2, 2),
('Carlos', 'Rodríguez', 'carlos.rodriguez@email.com', '0987654323', NULL, '1992-03-10', 'Av. Kennedy 789', 1, 1, 1),
('Ana', 'Martínez', 'ana.martinez@email.com', '0987654324', '042345680', '1988-11-25', 'Urbanización Los Ceibos', 1, 2, 1),
('Pedro', 'López', 'pedro.lopez@email.com', '0987654325', NULL, '1995-07-30', 'Vía a la Costa Km 5', 1, 1, 3);

-- DireccionesCliente
INSERT INTO DireccionesCliente (id_Clientes_Fk, DirCli_Descripcion, DirCli_Referencia, id_Ciudades_Fk, DirCli_EsPrincipal) VALUES
(1, 'Av. Principal 123', 'Frente al parque central', 1, 1),
(2, 'Calle Secundaria 456', 'Junto al banco', 1, 1),
(3, 'Av. Kennedy 789, Edificio Torres del Norte', 'Piso 5, Oficina 502', 1, 1);

-- ============================================
-- MÓDULO EVENTOS
-- ============================================

-- CategoriasEvento
INSERT INTO CategoriasEvento (CatEvt_Nombre, CatEvt_Descripcion, CatEvt_Color) VALUES
('Concierto', 'Eventos musicales y artísticos', 'primary'),
('Conferencia', 'Charlas y presentaciones académicas', 'info'),
('Taller', 'Actividades prácticas y capacitaciones', 'success'),
('Fiesta', 'Celebraciones y eventos sociales', 'warning'),
('Deportivo', 'Eventos deportivos y competencias', 'danger');

-- TipoIngreso
INSERT INTO TipoIngreso (TipIng_Nombre, TipIng_Descripcion, TipIng_RequiereBoleto) VALUES
('Con Boleto', 'Requiere compra de boleto', 1),
('Invitación', 'Ingreso por invitación', 0),
('Libre', 'Ingreso libre sin boleto', 0);

-- Eventos
INSERT INTO Eventos (Evt_Nombre, Evt_Descripcion, Evt_FechaInicio, Evt_FechaFin, Evt_Lugar, Evt_Direccion, Evt_CapacidadTotal, Evt_CapacidadDisponible, id_CategoriasEvento_Fk, id_TipoIngreso_Fk, Evt_PrecioBase) VALUES
('Concierto Rock 2025', 'Gran concierto de rock con bandas internacionales', '2025-12-15 20:00:00', '2025-12-15 23:00:00', 'Estadio Monumental', 'Av. Barcelona', 50000, 50000, 1, 1, 50.00),
('Conferencia de Tecnología', 'Últimas tendencias en desarrollo de software', '2025-11-20 09:00:00', '2025-11-20 18:00:00', 'Centro de Convenciones', 'Av. de las Américas', 500, 500, 2, 1, 30.00),
('Taller de Programación Web', 'Aprende desarrollo web moderno', '2025-11-10 14:00:00', '2025-11-10 18:00:00', 'ESPOL Campus', 'Km 30.5 Vía Perimetral', 100, 100, 3, 1, 25.00);

-- ============================================
-- MÓDULO BOLETOS
-- ============================================

-- TiposBoleto
INSERT INTO TiposBoleto (TipBol_Nombre, TipBol_Descripcion) VALUES
('VIP', 'Acceso a zona VIP con servicios exclusivos'),
('General', 'Entrada general al evento'),
('Estudiante', 'Entrada con descuento para estudiantes'),
('Niños', 'Entrada para menores de 12 años');

-- Boletos (generar algunos boletos de ejemplo)
INSERT INTO Boletos (Bol_Codigo, id_Eventos_Fk, id_TiposBoleto_Fk, id_Clientes_Fk, Bol_Precio, Bol_FechaVenta, Bol_Estado) VALUES
('BOL-2025-001', 1, 2, 1, 50.00, GETDATE(), 'Vendido'),
('BOL-2025-002', 1, 2, 2, 50.00, GETDATE(), 'Vendido'),
('BOL-2025-003', 1, 1, 3, 100.00, GETDATE(), 'Vendido'),
('BOL-2025-004', 2, 2, 4, 30.00, GETDATE(), 'Vendido'),
('BOL-2025-005', 3, 3, 5, 20.00, GETDATE(), 'Vendido'),
('BOL-2025-006', 1, 2, NULL, 50.00, NULL, 'Disponible');

-- ============================================
-- MÓDULO FACTURACIÓN
-- ============================================

-- Facturas
INSERT INTO Factura (Fac_Numero, id_Clientes_Fk, Fac_Fecha, Fac_Subtotal, id_IVA_Fk, Fac_ValorIVA, Fac_Total, id_MetodoPago_Fk, Fac_Estado) VALUES
('FAC-2025-001', 1, GETDATE(), 50.00, 2, 7.50, 57.50, 2, 'Pagada'),
('FAC-2025-002', 2, GETDATE(), 50.00, 2, 7.50, 57.50, 1, 'Pagada'),
('FAC-2025-003', 3, GETDATE(), 100.00, 2, 15.00, 115.00, 2, 'Pagada');

-- Detalle de Facturas
INSERT INTO DetalleFactura (id_Factura_Fk, id_Boletos_Fk, DetFac_Cantidad, DetFac_PrecioUnitario, DetFac_Subtotal) VALUES
(1, 1, 1, 50.00, 50.00),
(2, 2, 1, 50.00, 50.00),
(3, 3, 1, 100.00, 100.00);

-- ============================================
-- MÓDULO NOTIFICACIONES
-- ============================================

-- PlantillasNotificacion
INSERT INTO PlantillasNotificacion (PlanNot_Nombre, PlanNot_Asunto, PlanNot_Cuerpo, PlanNot_Tipo) VALUES
('Confirmación de Compra', 'Confirmación de compra de boleto', 'Estimado {nombre}, su compra ha sido confirmada. Boleto: {codigo}', 'Email'),
('Recordatorio de Evento', 'Recordatorio: Evento próximo', 'Le recordamos que el evento {evento} será el {fecha}', 'Email'),
('Bienvenida', 'Bienvenido al Sistema', 'Gracias por registrarse en nuestro sistema', 'Email');

-- Notificaciones
INSERT INTO Notificaciones (Not_Asunto, Not_Mensaje, Not_Tipo, Not_FechaEnvio, Not_Estado) VALUES
('Confirmación de Compra', 'Su compra ha sido confirmada', 'Email', GETDATE(), 'Enviado'),
('Recordatorio de Evento', 'Su evento es mañana', 'Email', GETDATE(), 'Enviado');

-- DestinatariosNotificacion
INSERT INTO DestinatariosNotificacion (id_Notificaciones_Fk, id_Clientes_Fk, DestNot_Leido) VALUES
(1, 1, 1),
(2, 1, 0);

-- ============================================
-- MÓDULO AUTENTICACIÓN
-- ============================================

-- Roles
INSERT INTO Roles (Rol_Nombre, Rol_Descripcion) VALUES
('Administrador', 'Acceso completo al sistema'),
('Vendedor', 'Puede vender boletos y gestionar eventos'),
('Cliente', 'Usuario final del sistema');

-- Permisos
INSERT INTO Permisos (Per_Nombre, Per_Descripcion, Per_Modulo) VALUES
('Ver Clientes', 'Visualizar listado de clientes', 'Clientes'),
('Crear Clientes', 'Crear nuevos clientes', 'Clientes'),
('Editar Clientes', 'Modificar datos de clientes', 'Clientes'),
('Eliminar Clientes', 'Eliminar clientes', 'Clientes'),
('Ver Eventos', 'Visualizar eventos', 'Eventos'),
('Crear Eventos', 'Crear nuevos eventos', 'Eventos'),
('Vender Boletos', 'Vender boletos de eventos', 'Boletos'),
('Generar Facturas', 'Generar facturas', 'Facturacion');

-- RolesPermisos (Asignar todos los permisos al Administrador)
INSERT INTO RolesPermisos (id_Roles_Fk, id_Permisos_Fk) VALUES
(1, 1), (1, 2), (1, 3), (1, 4), (1, 5), (1, 6), (1, 7), (1, 8);

-- Usuarios (Password: 'admin123' - en producción debe estar hasheado)
INSERT INTO Usuarios (Usu_NombreUsuario, Usu_Email, Usu_Password, id_Roles_Fk) VALUES
('admin', 'admin@espol.edu.ec', 'admin123', 1),
('vendedor1', 'vendedor@espol.edu.ec', 'vendedor123', 2);

-- ============================================
-- DATOS DE EJEMPLO INSERTADOS CORRECTAMENTE
-- ============================================
SELECT 'Datos de ejemplo insertados correctamente' AS Resultado;
