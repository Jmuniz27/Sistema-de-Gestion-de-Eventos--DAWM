-- ============================================
-- Sistema de Gestión de Eventos - ESPOL
-- Script de Datos Iniciales (SEED DATA)
-- ============================================
-- Base de Datos: PostgreSQL en Supabase
-- Contexto: Ecuador - Eventos, Conciertos, Festivales
-- Fecha: 04-11-2025
-- Versión: 2.0 - Alineado con schema.sql
-- ============================================

-- INSTRUCCIONES:
-- 1. Ejecutar DESPUÉS de schema.sql
-- 2. Datos realistas del contexto ecuatoriano
-- 3. Incluye eventos de conciertos, festivales y culturales
-- 4. Usar para desarrollo y testing

-- ============================================
-- MÓDULO GENERAL - CATÁLOGOS BASE
-- ============================================

-- Género/Sexo (solo 2 opciones según schema)
INSERT INTO GeneroSexo (Gen_Nombre) VALUES
('M'),
('F');

-- Operadoras telefónicas de Ecuador
INSERT INTO Operadora (Ope_Nombre) VALUES
('Claro'),
('Movistar'),
('CNT'),
('Tuenti');

-- Estado Civil (solo 4 opciones según schema)
INSERT INTO EstadoCivil (EstCiv_Nombre) VALUES
('Soltero'),
('Casado'),
('Divorciado'),
('Viudo');

-- Proveedores de servicios para eventos
INSERT INTO Proveedores (Prov_Nombre, Prov_RUC, Prov_Direccion, Prov_Telefono, Prov_Email, Prov_TipoServicio, Prov_Estado, id_modulo) VALUES
('Sonido Total Ecuador S.A.', '0992345678001', 'Av. Francisco de Orellana, Guayaquil', '042380000', 'ventas@sonidototal.ec', 'Audio y Sonido', 'Activo', 'general'),
('Iluminación Pro Quito', '1792456789001', 'Av. 6 de Diciembre N34-120, Quito', '022456789', 'contacto@iluminacionpro.ec', 'Iluminación y Efectos', 'Activo', 'general'),
('Seguridad Eventos GYE', '0991234567001', 'Cdla. Kennedy Norte, Guayaquil', '042345678', 'info@seguridadeventos.ec', 'Seguridad Privada', 'Activo', 'general'),
('Catering Gourmet Ecuador', '1791234567001', 'Av. Naciones Unidas E4-676, Quito', '022334455', 'reservas@cateringgourmet.ec', 'Catering y Alimentación', 'Activo', 'general'),
('Producciones Live Music Ec', '0993456789001', 'Malecón 2000, Guayaquil', '042567890', 'producciones@livemusic.ec', 'Producción Musical', 'Activo', 'general');

-- Tipos de Documento (solo 3 opciones según schema)
INSERT INTO TipoDocumento (TipDoc_Nombre) VALUES
('Cédula'),
('RUC'),
('Pasaporte');

-- Unidades de Medida
INSERT INTO UnidadMedida (UMed_Nombre, UMed_Simbolo, UMed_Tipo, UMed_Estado, id_modulo) VALUES
('Unidad', 'und', 'Cantidad', 'Activo', 'general'),
('Kilogramo', 'kg', 'Peso', 'Activo', 'general'),
('Litro', 'lt', 'Volumen', 'Activo', 'general'),
('Metro', 'm', 'Longitud', 'Activo', 'general'),
('Hora', 'hr', 'Tiempo', 'Activo', 'general');

-- Provincias de Ecuador
INSERT INTO Provincias (Prov_Nombre) VALUES
('Guayas'),
('Pichincha'),
('Manabí'),
('Azuay'),
('El Oro'),
('Los Ríos'),
('Tungurahua'),
('Esmeraldas'),
('Imbabura'),
('Loja'),
('Chimborazo'),
('Cotopaxi'),
('Santa Elena'),
('Santo Domingo de los Tsáchilas');

-- Ciudades principales de Ecuador
INSERT INTO Ciudades (id_Provincias_Fk, Ciu_Nombre) VALUES
-- Guayas (id=1)
(1, 'Guayaquil'),
(1, 'Durán'),
(1, 'Daule'),
(1, 'Samborondón'),
-- Pichincha (id=2)
(2, 'Quito'),
(2, 'Sangolquí'),
(2, 'Cayambe'),
-- Manabí (id=3)
(3, 'Manta'),
(3, 'Portoviejo'),
-- Azuay (id=4)
(4, 'Cuenca'),
-- El Oro (id=5)
(5, 'Machala'),
-- Los Ríos (id=6)
(6, 'Babahoyo'),
-- Tungurahua (id=7)
(7, 'Ambato'),
-- Esmeraldas (id=8)
(8, 'Esmeraldas'),
-- Imbabura (id=9)
(9, 'Ibarra'),
(9, 'Otavalo'),
-- Loja (id=10)
(10, 'Loja'),
-- Chimborazo (id=11)
(11, 'Riobamba'),
-- Santa Elena (id=13)
(13, 'Salinas'),
(13, 'La Libertad'),
-- Santo Domingo (id=14)
(14, 'Santo Domingo');

-- Estados Generales (Catálogo de estados del sistema)
INSERT INTO Estados_Generales (EstG_Nombre, EstG_Descripcion) VALUES
('Activo', 'Registro activo en el sistema'),
('Inactivo', 'Registro inactivo temporalmente'),
('Suspendido', 'Registro suspendido por políticas'),
('Bloqueado', 'Registro bloqueado permanentemente'),
('Pendiente', 'En espera de procesamiento'),
('Procesando', 'En proceso de ejecución'),
('Completado', 'Proceso finalizado exitosamente'),
('Error', 'Proceso con errores');

-- Métodos de Pago
INSERT INTO MetodoPago (MPago_Nombre, MPago_Descripcion, MPago_RequiereReferencia, MPago_Estado, id_modulo) VALUES
('Efectivo', 'Pago en efectivo', FALSE, 'Activo', 'general'),
('Tarjeta de Crédito', 'Pago con tarjeta de crédito', TRUE, 'Activo', 'general'),
('Tarjeta de Débito', 'Pago con tarjeta de débito', TRUE, 'Activo', 'general'),
('Transferencia Bancaria', 'Transferencia entre cuentas', TRUE, 'Activo', 'general'),
('PayPhone', 'Pago mediante PayPhone', TRUE, 'Activo', 'general'),
('Datafast', 'Pago mediante Datafast', TRUE, 'Activo', 'general'),
('PayPal', 'Pago mediante PayPal', TRUE, 'Activo', 'general');

-- IVA Ecuador
INSERT INTO IVA (IVA_Porcentaje, IVA_FechaAplicacion, IVA_FechaFin, IVA_Estado, id_modulo) VALUES
(12.00, '2020-01-01', '2024-03-31', 'Inactivo', 'general'),
(15.00, '2024-04-01', NULL, 'Activo', 'general');

-- ============================================
-- MÓDULO CLIENTES
-- ============================================

-- Tipos de Cliente (solo 2 opciones según schema)
INSERT INTO TipoCliente (TipCli_Nombre, TipCli_Descripcion) VALUES
('Persona Natural', 'Cliente individual'),
('Empresa', 'Cliente corporativo');

-- Clientes de ejemplo
INSERT INTO Clientes (Cli_Nombre, Cli_Apellido, Cli_Identificacion, Cli_Email, Cli_Celular, id_TipoCliente_Fk, id_TipoDocumento_Fk, id_GeneroSexo_Fk, id_EstadoCivil_Fk, id_Operadora_Fk) VALUES
('Carlos', 'Mendoza Vera', '0923456789', 'carlos.mendoza@email.com', '0987654321', 1, 1, 1, 1, 1),
('María', 'Ramírez López', '1723456789', 'maria.ramirez@email.com', '0998765432', 1, 1, 2, 2, 2),
('José', 'González Castro', '0912345678', 'jose.gonzalez@email.com', '0976543210', 1, 1, 1, 2, 1),
('Ana', 'Ortiz Morales', '1712345678', 'ana.ortiz@email.com', '0965432109', 1, 1, 2, 1, 3),
('Luis', 'Torres Sánchez', '0901234567', 'luis.torres@email.com', '0954321098', 1, 1, 1, 1, 1),
('Carmen', 'Flores Ríos', '1701234567', 'carmen.flores@email.com', '0943210987', 1, 1, 2, 1, 2),
('Diego', 'Vásquez Maldonado', '0918273645', 'diego.vasquez@email.com', '0932109876', 1, 1, 1, 1, 1),
('Laura', 'Cedeño Bravo', '1718273645', 'laura.cedeno@email.com', '0921098765', 1, 1, 2, 2, 3),
('Andrés', 'Salazar Chávez', '0927364518', 'andres.salazar@email.com', '0910987654', 1, 1, 1, 1, 1),
('Gabriela', 'Moreno Lara', '1727364518', 'gabriela.moreno@email.com', '0909876543', 1, 1, 2, 1, 2),
('Eventos Corporativos', 'Ecuador S.A.', '0992345678001', 'contacto@eventoscorp.ec', '0987123456', 2, 2, NULL, NULL, 1),
('Universidad', 'ESPOL', '0960004930001', 'eventos@espol.edu.ec', '042269269', 2, 2, NULL, NULL, NULL);

-- Direcciones de Clientes
INSERT INTO DireccionesCliente (id_Clientes_Fk, id_Ciudades_Fk, DirCli_Direccion, DirCli_Referencia, DirCli_CodigoPostal) VALUES
(1, 1, 'Av. 9 de Octubre Mz. 45 Villa 12', 'Frente al parque', '090150'),
(2, 5, 'Av. 6 de Diciembre N34-120', 'Sector La Carolina', '170135'),
(3, 1, 'Cdla. Kennedy Norte Mz. 123 Solar 5', 'Cerca del CC San Marino', '090505'),
(4, 5, 'Av. Naciones Unidas E4-676', 'Edificio Sigma, piso 8', '170135'),
(5, 1, 'Malecón 2000 Local 45', 'Al lado de la noria', '090313'),
(6, 4, 'Sector El Bosque Calle A Mz. 15 Villa 7', 'Vía a Samborondón', '090652'),
(7, 1, 'Urdesa Central Calle Segunda #234', 'Entre Bálsamos y Las Monjas', '090150'),
(8, 5, 'Sector González Suárez Calle Toledo N26-45', 'Edificio Torres de Galeón', '170143');

-- ============================================
-- MÓDULO EVENTOS
-- ============================================

-- Categorías de Eventos
INSERT INTO CategoriasEvento (CatEvt_Nombre, CatEvt_Descripcion, CatEvt_Color, CatEvt_Icono, CatEvt_Estado, id_modulo) VALUES
('Concierto de Rock', 'Eventos de rock, metal y alternativo', '#e74c3c', 'guitar', 'Activo', 'eventos'),
('Concierto de Reggaeton', 'Eventos de música urbana y reggaeton', '#9b59b6', 'music', 'Activo', 'eventos'),
('Concierto de Salsa', 'Eventos de salsa y música tropical', '#f39c12', 'drum', 'Activo', 'eventos'),
('Festival', 'Festivales musicales de varios géneros', '#3498db', 'star', 'Activo', 'eventos'),
('Teatro', 'Obras de teatro y espectáculos dramáticos', '#e67e22', 'theater', 'Activo', 'eventos'),
('Stand Up Comedy', 'Shows de comedia en vivo', '#f1c40f', 'laugh', 'Activo', 'eventos'),
('Deportivo', 'Eventos deportivos en vivo', '#2ecc71', 'football', 'Activo', 'eventos'),
('Cultural', 'Eventos culturales y exposiciones', '#1abc9c', 'palette', 'Activo', 'eventos');

-- Tipos de Ingreso
INSERT INTO TipoIngreso (TIng_Nombre, TIng_Descripcion, TIng_RequiereBoleto, TIng_Estado, id_modulo) VALUES
('Pago General', 'Entrada con pago de boleto', TRUE, 'Activo', 'eventos'),
('Cortesía', 'Entrada gratuita de cortesía', TRUE, 'Activo', 'eventos'),
('Invitación', 'Entrada por invitación', TRUE, 'Activo', 'eventos'),
('Libre', 'Evento de acceso libre sin boleto', FALSE, 'Activo', 'eventos'),
('Early Bird', 'Entrada con descuento anticipado', TRUE, 'Activo', 'eventos'),
('VIP', 'Entrada con accesos exclusivos', TRUE, 'Activo', 'eventos');

-- Eventos (Contexto ecuatoriano)
INSERT INTO Eventos (Evt_Nombre, Evt_Descripcion, Evt_FechaInicio, Evt_FechaFin, Evt_Lugar, Evt_Direccion, id_Ciudades_Fk, Evt_CapacidadTotal, Evt_CapacidadDisponible, Evt_ImagenURL, Evt_PrecioBaseGeneral, id_CategoriaEvento_Fk, id_TipoIngreso_Fk, id_Proveedores_Fk, Evt_Estado, id_modulo) VALUES
('Feid en Guayaquil - Mor Tour 2025', 'El artista colombiano Feid llega a Guayaquil con su exitosa gira Mor Tour.', '2025-11-15 21:00:00', '2025-11-16 02:00:00', 'Estadio Modelo', 'Av. de las Américas, Guayaquil', 1, 25000, 22500, 'https://ejemplo.com/feid-guayaquil.jpg', 65.00, 2, 1, 5, 'Programado', 'eventos'),
('Karol G - Mañana Será Bonito Tour Quito', 'La Bichota llega a Ecuador con su tour mundial.', '2025-12-20 20:00:00', '2025-12-21 01:00:00', 'Estadio Olímpico Atahualpa', 'Av. 6 de Diciembre y Naciones Unidas, Quito', 5, 35000, 30000, 'https://ejemplo.com/karol-g-quito.jpg', 80.00, 2, 1, 5, 'Programado', 'eventos'),
('Festival Rock al Parque Ecuador', 'El festival de rock más grande de Ecuador regresa con bandas nacionales e internacionales.', '2025-10-10 15:00:00', '2025-10-12 23:00:00', 'Parque La Carolina', 'Av. Río Amazonas, Quito', 5, 15000, 12000, 'https://ejemplo.com/rock-parque.jpg', 45.00, 1, 1, 5, 'Programado', 'eventos'),
('Marc Anthony en Guayaquil', 'El rey de la salsa Marc Anthony presenta su tour Puro Genio.', '2025-11-28 20:00:00', '2025-11-29 00:30:00', 'Estadio Modelo', 'Av. de las Américas, Guayaquil', 1, 30000, 25000, 'https://ejemplo.com/marc-anthony.jpg', 95.00, 3, 1, 5, 'Programado', 'eventos'),
('Festival de Salsa Cali Pachanguero en Manta', 'El mejor festival de salsa llega a Manta con orquestas de Colombia y Ecuador.', '2025-09-05 18:00:00', '2025-09-06 04:00:00', 'Malecón de Manta', 'Av. Malecón, Manta', 8, 8000, 7200, 'https://ejemplo.com/salsa-manta.jpg', 35.00, 3, 1, 5, 'Programado', 'eventos'),
('Liga de Quito vs Barcelona SC - Clásico del Astillero', 'El clásico del fútbol ecuatoriano.', '2025-07-20 16:00:00', '2025-07-20 18:00:00', 'Estadio Rodrigo Paz Delgado', 'Casa Blanca, Quito', 5, 41575, 38000, 'https://ejemplo.com/clasico-ecuador.jpg', 25.00, 7, 1, 3, 'Programado', 'eventos');

-- Detalles de Eventos
INSERT INTO Detalle_Eventos (id_Eventos_Fk, DetEvt_Clave, DetEvt_Valor, DetEvt_Tipo, id_modulo) VALUES
(1, 'artista_principal', 'Feid', 'info', 'eventos'),
(1, 'artistas_invitados', 'Mañas Ru-Fino, Sky Rompiendo', 'info', 'eventos'),
(1, 'edad_minima', '18', 'restriccion', 'eventos'),
(2, 'artista_principal', 'Karol G', 'info', 'eventos'),
(2, 'duracion_aproximada', '180', 'info', 'eventos'),
(3, 'bandas_confirmadas', 'Bajo Sueños, Pulpo 3, Rocola Bacalao', 'info', 'eventos'),
(3, 'numero_dias', '3', 'info', 'eventos'),
(4, 'artista_principal', 'Marc Anthony', 'info', 'eventos');

-- ============================================
-- MÓDULO AUTENTICACIÓN Y ROLES (Creado antes por dependencias)
-- ============================================

-- Usuarios del Sistema
INSERT INTO Usuarios (Usuario_Nombre, Usuario_Apellido, Usuario_Email, Usuario_Password, Usuario_Token, Usuario_Token_Exp, id_Estado_Fk) VALUES
('Juan', 'Munizaga', 'admin@eventosec.com', '$2b$10$abcdefghijklmnopqrstuvwxyz1234567890ABCDEFGHIJ', NULL, NULL, 1),
('Ana', 'Rodríguez', 'gerente@eventosec.com', '$2b$10$bcdefghijklmnopqrstuvwxyz1234567890ABCDEFGHIJK', NULL, NULL, 1),
('Luis', 'García', 'vendedor1@eventosec.com', '$2b$10$cdefghijklmnopqrstuvwxyz1234567890ABCDEFGHIJKL', NULL, NULL, 1),
('María', 'López', 'operador@eventosec.com', '$2b$10$defghijklmnopqrstuvwxyz1234567890ABCDEFGHIJKLM', NULL, NULL, 1),
('Diego', 'Sánchez', 'contador@eventosec.com', '$2b$10$efghijklmnopqrstuvwxyz1234567890ABCDEFGHIJKLMN', NULL, NULL, 1),
('Carmen', 'Torres', 'marketing@eventosec.com', '$2b$10$fghijklmnopqrstuvwxyz1234567890ABCDEFGHIJKLMNO', NULL, NULL, 1);

-- ============================================
-- MÓDULO BOLETOS (Depende de Usuarios)
-- ============================================

-- Tipos de Boleto (solo id_TiposBoleto y TipB_nombre según schema)
INSERT INTO TiposBoleto (id_TiposBoleto, TipB_nombre) VALUES
('GENERAL', 'General'),
('PLATEA_BAJA', 'Platea Baja'),
('PLATEA_ALTA', 'Platea Alta'),
('VIP', 'VIP'),
('GOLD', 'Gold'),
('PALCO', 'Palco'),
('CORTESIA', 'Cortesía Prensa'),
('EARLY_BIRD', 'Early Bird');

-- Estados de Boleto
INSERT INTO EstadoBoleto (EstB_nombre) VALUES
('Disponible'),
('Reservado'),
('Vendido'),
('Usado'),
('Cancelado'),
('Expirado');

-- Boletos para eventos
INSERT INTO Boleto (id_Evento_Fk, id_TipoBoleto_Fk, id_EstadoBoleto_Fk, id_Proveedor_Fk, bol_precio, bol_fila, bol_asiento, bol_seccion) VALUES
-- Feid en Guayaquil (Evento 1)
(1, 'EARLY_BIRD', 3, 5, 55, NULL, NULL, 1),
(1, 'GENERAL', 3, 5, 65, NULL, NULL, 1),
(1, 'GENERAL', 1, 5, 65, NULL, NULL, 1),
(1, 'PLATEA_BAJA', 3, 5, 95, 1, 15, 2),
(1, 'PLATEA_BAJA', 3, 5, 95, 1, 16, 2),
(1, 'PLATEA_BAJA', 1, 5, 95, 2, 20, 2),
(1, 'VIP', 3, 5, 150, 1, 10, 3),
(1, 'VIP', 2, 5, 150, 1, 11, 3),
(1, 'GOLD', 3, 5, 200, 1, 5, 4),
-- Karol G en Quito (Evento 2)
(2, 'EARLY_BIRD', 3, 5, 70, NULL, NULL, 1),
(2, 'GENERAL', 1, 5, 80, NULL, NULL, 1),
(2, 'PLATEA_BAJA', 3, 5, 120, 3, 45, 2),
(2, 'VIP', 3, 5, 180, 1, 22, 3),
(2, 'GOLD', 2, 5, 250, 1, 12, 4),
-- Festival Rock (Evento 3)
(3, 'EARLY_BIRD', 3, 5, 35, NULL, NULL, 1),
(3, 'GENERAL', 3, 5, 45, NULL, NULL, 1),
(3, 'VIP', 1, 5, 90, 1, 30, 3),
-- Marc Anthony (Evento 4)
(4, 'EARLY_BIRD', 3, 5, 85, NULL, NULL, 1),
(4, 'PLATEA_BAJA', 3, 5, 140, 4, 12, 2),
(4, 'VIP', 1, 5, 220, 1, 8, 3);

-- Entradas Asignadas (relación boleto-cliente-usuario)
INSERT INTO EntradasAsignadas (id_Boleto_Fk, id_Cliente_Fk, id_Usuario_Fk, entA_Cantidad, entA_fechaValida) VALUES
(1, 1, 3, 1, '2025-11-16 02:00:00'),
(2, 2, 3, 1, '2025-11-16 02:00:00'),
(4, 3, 3, 1, '2025-11-16 02:00:00'),
(5, 4, 3, 1, '2025-11-16 02:00:00'),
(7, 7, 3, 1, '2025-11-16 02:00:00'),
(9, 10, 3, 1, '2025-11-16 02:00:00'),
(10, 1, 3, 1, '2025-12-21 01:00:00'),
(12, 5, 3, 1, '2025-12-21 01:00:00'),
(13, 6, 3, 1, '2025-12-21 01:00:00'),
(15, 8, 3, 1, '2025-10-12 23:00:00'),
(16, 9, 3, 1, '2025-10-12 23:00:00');

-- ============================================
-- MÓDULO FACTURACIÓN
-- ============================================

-- Facturas
INSERT INTO Factura (Fac_Numero, Fac_Serie, Fac_FechaEmision, id_Clientes_Fk, Fac_Subtotal, Fac_PorcentajeIVA, Fac_ValorIVA, Fac_Descuento, Fac_Total, id_MetodoPago_Fk, Fac_ReferenciaPago, Fac_Observaciones, Fac_Estado, id_modulo, Fac_FechaPago) VALUES
('FAC-2025-001', '001-001', '2025-09-15 14:25:00', 1, 55.00, 15.00, 8.25, 10.00, 53.25, 2, 'VISA-****4532', 'Pago con tarjeta aprobado', 'Pagada', 'facturacion', '2025-09-15 14:25:00'),
('FAC-2025-002', '001-001', '2025-09-16 10:47:00', 2, 65.00, 15.00, 9.75, 0.00, 74.75, 5, 'PYP-987654321', 'Pago mediante PayPhone', 'Pagada', 'facturacion', '2025-09-16 10:47:00'),
('FAC-2025-003', '001-001', '2025-09-17 16:35:00', 3, 190.00, 15.00, 28.50, 0.00, 218.50, 2, 'MC-****8765', 'Compra de 2 boletos platea baja', 'Pagada', 'facturacion', '2025-09-17 16:35:00'),
('FAC-2025-004', '001-001', '2025-09-18 11:22:00', 7, 150.00, 15.00, 22.50, 0.00, 172.50, 3, 'DB-****1234', 'Boleto VIP pagado con débito', 'Pagada', 'facturacion', '2025-09-18 11:22:00'),
('FAC-2025-005', '001-001', '2025-09-20 09:17:00', 10, 200.00, 15.00, 30.00, 0.00, 230.00, 2, 'VISA-****6789', 'Boleto Gold', 'Pagada', 'facturacion', '2025-09-20 09:17:00'),
('FAC-2025-006', '001-001', '2025-09-21 15:42:00', 1, 70.00, 15.00, 10.50, 10.00, 70.50, 5, 'PYP-123456789', 'Early Bird Karol G', 'Pagada', 'facturacion', '2025-09-21 15:42:00'),
('FAC-2025-007', '001-001', '2025-09-22 12:12:00', 5, 120.00, 15.00, 18.00, 0.00, 138.00, 2, 'AMEX-****4321', 'Platea baja Karol G', 'Pagada', 'facturacion', '2025-09-22 12:12:00'),
('FAC-2025-008', '001-001', '2025-09-23 14:57:00', 6, 180.00, 15.00, 27.00, 0.00, 207.00, 4, 'TRANSF-20250923001', 'VIP Karol G por transferencia', 'Pagada', 'facturacion', '2025-09-23 14:57:00'),
('FAC-2025-009', '001-001', '2025-09-25 10:32:00', 8, 35.00, 15.00, 5.25, 10.00, 30.25, 2, 'VISA-****9999', 'Early Bird Festival Rock', 'Pagada', 'facturacion', '2025-09-25 10:32:00'),
('FAC-2025-010', '001-001', '2025-09-26 16:22:00', 9, 45.00, 15.00, 6.75, 0.00, 51.75, 1, 'EFECTIVO', 'Pago en efectivo Festival Rock', 'Pagada', 'facturacion', '2025-09-26 16:22:00');

-- Detalle de Facturas (con FK a EntradasAsignadas)
INSERT INTO Detalle_factura (id_Factura_Fk, id_EntradaAsignada_Fk, DetFac_Descripcion, DetFac_Cantidad, DetFac_PrecioUnitario, DetFac_Descuento, DetFac_Subtotal, id_modulo) VALUES
(1, 1, 'Boleto General Early Bird - Feid en Guayaquil', 1, 55.00, 10.00, 55.00, 'facturacion'),
(2, 2, 'Boleto General - Feid en Guayaquil', 1, 65.00, 0.00, 65.00, 'facturacion'),
(3, 3, 'Boleto Platea Baja - Feid en Guayaquil', 1, 95.00, 0.00, 95.00, 'facturacion'),
(3, 4, 'Boleto Platea Baja - Feid en Guayaquil', 1, 95.00, 0.00, 95.00, 'facturacion'),
(4, 5, 'Boleto VIP - Feid en Guayaquil', 1, 150.00, 0.00, 150.00, 'facturacion'),
(5, 6, 'Boleto Gold - Feid en Guayaquil', 1, 200.00, 0.00, 200.00, 'facturacion'),
(6, 7, 'Boleto General Early Bird - Karol G en Quito', 1, 70.00, 10.00, 70.00, 'facturacion'),
(7, 8, 'Boleto Platea Baja - Karol G en Quito', 1, 120.00, 0.00, 120.00, 'facturacion'),
(8, 9, 'Boleto VIP - Karol G en Quito', 1, 180.00, 0.00, 180.00, 'facturacion'),
(9, 10, 'Boleto General Early Bird - Festival Rock al Parque', 1, 35.00, 10.00, 35.00, 'facturacion'),
(10, 11, 'Boleto General - Festival Rock al Parque', 1, 45.00, 0.00, 45.00, 'facturacion');

-- ============================================
-- MÓDULO NOTIFICACIONES
-- ============================================

-- Plantillas de Notificaciones (sin columnas extras)
INSERT INTO Plantillas (Pla_Nombre, Pla_Asunto, Pla_Contenido, Pla_Tipo, Pla_Estado) VALUES
('Confirmación de Compra', 'Tu compra ha sido confirmada',
'Hola,

¡Gracias por tu compra! Tu boleto ha sido confirmado.

Detalles del evento incluidos en el archivo adjunto.

¡Te esperamos!', 'Email', 'Activo'),

('Recordatorio de Evento', 'Recordatorio: Tu evento es mañana',
'Hola,

Te recordamos que mañana es el gran día de tu evento.

Recomendaciones:
- Llega con anticipación
- Trae tu cédula de identidad
- Lleva tu boleto impreso o en tu celular

¡Nos vemos!', 'Email', 'Activo'),

('Bienvenida Nuevo Cliente', 'Bienvenido a EventosEC',
'Hola,

¡Bienvenido a EventosEC, el mejor sistema de gestión de eventos de Ecuador!

Tu cuenta ha sido creada exitosamente.

Gracias por unirte a nuestra comunidad.

EventosEC Team', 'Email', 'Activo'),

('Notificación Push Evento', 'Evento próximo',
'Tu evento es próximamente. ¡No te lo pierdas!', 'Push', 'Activo');

-- Notificaciones Enviadas (con FKs a Cliente, Boleto, Factura)
INSERT INTO Notificaciones (Not_Asunto, Not_Mensaje, Not_Tipo, Not_Estado, Not_FechaProgramada, Not_FechaEnvio, Not_IntentosEnvio, id_Cliente_Fk, id_Boleto_Fk, id_Plantillas_Fk, id_Factura_Fk) VALUES
('Tu compra ha sido confirmada - Feid en Guayaquil', 'Hola Carlos, tu boleto para Feid en Guayaquil ha sido confirmado...', 'Email', 'Enviada', '2025-09-15 14:26:00', '2025-09-15 14:26:30', 1, 1, 1, 1, 1),
('Tu compra ha sido confirmada - Feid en Guayaquil', 'Hola María, tu boleto para Feid en Guayaquil ha sido confirmado...', 'Email', 'Enviada', '2025-09-16 10:48:00', '2025-09-16 10:48:15', 1, 2, 2, 1, 2),
('Recordatorio: Feid en Guayaquil es mañana', 'Hola Carlos, te recordamos que mañana es el concierto...', 'Email', 'Pendiente', '2025-11-14 10:00:00', NULL, 0, 1, 1, 2, NULL),
('Bienvenido a EventosEC', 'Hola Carlos, bienvenido a nuestra plataforma...', 'Email', 'Enviada', '2025-09-15 14:25:00', '2025-09-15 14:25:10', 1, 1, NULL, 3, NULL),
('Evento próximo: Karol G en Quito', 'Karol G en Quito es en 3 días. ¡No te lo pierdas!', 'Push', 'Pendiente', '2025-12-17 09:00:00', NULL, 0, 1, 10, 4, NULL);

-- Destinatarios de Notificaciones
INSERT INTO Destinatarios (id_Notificaciones_Fk, id_Clientes_Fk, Dest_Email, Dest_Telefono, Dest_FechaEnvio, Dest_FechaLectura, Dest_Estado) VALUES
(1, 1, 'carlos.mendoza@email.com', '0987654321', '2025-09-15 14:26:30', '2025-09-15 15:10:00', 'Leido'),
(2, 2, 'maria.ramirez@email.com', '0998765432', '2025-09-16 10:48:15', '2025-09-16 11:20:00', 'Leido'),
(3, 1, 'carlos.mendoza@email.com', '0987654321', NULL, NULL, 'Pendiente'),
(4, 1, 'carlos.mendoza@email.com', '0987654321', '2025-09-15 14:25:10', '2025-09-15 14:30:00', 'Leido'),
(5, 1, 'carlos.mendoza@email.com', '0987654321', NULL, NULL, 'Pendiente');

-- ============================================
-- CONTINUACIÓN MÓDULO AUTENTICACIÓN Y ROLES
-- ============================================

-- Roles del Sistema
INSERT INTO Roles (Rol_Nombre, Rol_Descripcion) VALUES
('Administrador', 'Acceso total al sistema'),
('Gerente', 'Gestión de eventos y reportes'),
('Vendedor', 'Venta de boletos y atención al cliente'),
('Operador', 'Operaciones de eventos y validación'),
('Contador', 'Gestión de facturación y contabilidad'),
('Cliente', 'Usuario cliente con compras'),
('Marketing', 'Gestión de notificaciones y campañas');

-- Permisos
INSERT INTO Permisos (Permiso_Nombre, Permiso_Descripcion) VALUES
('clientes.crear', 'Crear nuevos clientes'),
('clientes.leer', 'Ver información de clientes'),
('clientes.actualizar', 'Actualizar datos de clientes'),
('clientes.eliminar', 'Eliminar clientes'),
('eventos.crear', 'Crear nuevos eventos'),
('eventos.leer', 'Ver información de eventos'),
('eventos.actualizar', 'Actualizar eventos'),
('eventos.eliminar', 'Eliminar eventos'),
('boletos.crear', 'Crear boletos'),
('boletos.leer', 'Ver boletos'),
('boletos.actualizar', 'Actualizar boletos'),
('facturas.crear', 'Crear facturas'),
('facturas.leer', 'Ver facturas'),
('notificaciones.enviar', 'Enviar notificaciones'),
('reportes.generar', 'Generar reportes');

-- Usuarios_Roles (Asignar roles a usuarios)
INSERT INTO Usuarios_Roles (id_Usuario_Fk, id_Rol_Fk) VALUES
(1, 1), -- Admin
(2, 2), -- Gerente
(3, 3), -- Vendedor
(4, 4), -- Operador
(5, 5), -- Contador
(6, 7); -- Marketing

-- Roles_Permisos (Asignar permisos a roles)
-- Administrador - Todos los permisos
INSERT INTO Roles_Permisos (id_Rol_Fk, id_Permiso_Fk) VALUES
(1, 1), (1, 2), (1, 3), (1, 4), (1, 5), (1, 6), (1, 7), (1, 8),
(1, 9), (1, 10), (1, 11), (1, 12), (1, 13), (1, 14), (1, 15);

-- Gerente - Gestión completa excepto eliminación
INSERT INTO Roles_Permisos (id_Rol_Fk, id_Permiso_Fk) VALUES
(2, 2), (2, 3), (2, 5), (2, 6), (2, 7), (2, 10), (2, 13), (2, 15);

-- Vendedor - Ventas y lectura
INSERT INTO Roles_Permisos (id_Rol_Fk, id_Permiso_Fk) VALUES
(3, 1), (3, 2), (3, 6), (3, 9), (3, 10), (3, 12);

-- Contador - Facturación
INSERT INTO Roles_Permisos (id_Rol_Fk, id_Permiso_Fk) VALUES
(5, 12), (5, 13), (5, 15);

-- Marketing - Notificaciones
INSERT INTO Roles_Permisos (id_Rol_Fk, id_Permiso_Fk) VALUES
(7, 2), (7, 6), (7, 14);

-- ============================================
-- FIN DEL SCRIPT SEED
-- ============================================

-- RESUMEN DE DATOS INSERTADOS:
-- - Módulo General: 14 provincias, 22 ciudades, catálogos base
-- - Módulo Clientes: 12 clientes con 8 direcciones
-- - Módulo Eventos: 6 eventos con detalles
-- - Módulo Boletos: 20 boletos con 11 entradas asignadas
-- - Módulo Facturación: 10 facturas con 11 detalles
-- - Módulo Notificaciones: 4 plantillas, 5 notificaciones, 5 destinatarios
-- - Módulo Autenticación: 7 roles, 6 usuarios, 15 permisos

-- NOTA: Todos los datos están alineados con el schema.sql v2.0
-- Las contraseñas están hasheadas de forma ficticia
-- Los IDs de TiposBoleto son VARCHAR según el schema
