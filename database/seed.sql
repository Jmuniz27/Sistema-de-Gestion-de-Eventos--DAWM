-- ============================================
-- Sistema de Gestión de Eventos - ESPOL
-- Script de Datos Iniciales (SEED DATA)
-- ============================================
-- Base de Datos: PostgreSQL en Supabase
-- Contexto: Ecuador - Eventos, Conciertos, Festivales
-- Fecha: Octubre 2025
-- Versión: 1.0
-- ============================================

-- INSTRUCCIONES:
-- 1. Ejecutar DESPUÉS de schema.sql
-- 2. Ejecutar ANTES de policies.sql
-- 3. Datos realistas del contexto ecuatoriano
-- 4. Incluye eventos de conciertos, festivales y culturales
-- 5. Usar para desarrollo y testing

-- ============================================
-- MÓDULO GENERAL - CATÁLOGOS BASE
-- ============================================

-- Género/Sexo
INSERT INTO GeneroSexo (Gen_Nombre, Gen_Descripcion, Gen_Estado, id_modulo) VALUES
('Masculino', 'Género masculino', 'Activo', 'general'),
('Femenino', 'Género femenino', 'Activo', 'general'),
('Otro', 'Otro género', 'Activo', 'general'),
('Prefiero no decir', 'No especifica género', 'Activo', 'general');

-- Operadoras telefónicas de Ecuador
INSERT INTO Operadora (Ope_Nombre, Ope_Codigo, Ope_Estado, id_modulo) VALUES
('Claro', 'CLR', 'Activo', 'general'),
('Movistar', 'MOV', 'Activo', 'general'),
('CNT', 'CNT', 'Activo', 'general'),
('Tuenti', 'TUE', 'Activo', 'general');

-- Estado Civil
INSERT INTO EstadoCivil (Est_Nombre, Est_Descripcion, Est_Estado, id_modulo) VALUES
('Soltero', 'Estado civil soltero', 'Activo', 'general'),
('Casado', 'Estado civil casado', 'Activo', 'general'),
('Divorciado', 'Estado civil divorciado', 'Activo', 'general'),
('Viudo', 'Estado civil viudo', 'Activo', 'general'),
('Unión Libre', 'Unión de hecho', 'Activo', 'general');

-- Proveedores de servicios para eventos
INSERT INTO Proveedores (Prov_Nombre, Prov_RUC, Prov_Direccion, Prov_Telefono, Prov_Email, Prov_TipoServicio, Prov_Estado, id_modulo) VALUES
('Sonido Total Ecuador S.A.', '0992345678001', 'Av. Francisco de Orellana, Guayaquil', '042380000', 'ventas@sonidototal.ec', 'Audio y Sonido', 'Activo', 'general'),
('Iluminación Pro Quito', '1792456789001', 'Av. 6 de Diciembre N34-120, Quito', '022456789', 'contacto@iluminacionpro.ec', 'Iluminación y Efectos', 'Activo', 'general'),
('Seguridad Eventos GYE', '0991234567001', 'Cdla. Kennedy Norte, Guayaquil', '042345678', 'info@seguridadeventos.ec', 'Seguridad Privada', 'Activo', 'general'),
('Catering Gourmet Ecuador', '1791234567001', 'Av. Naciones Unidas E4-676, Quito', '022334455', 'reservas@cateringgourmet.ec', 'Catering y Alimentación', 'Activo', 'general'),
('Producciones Live Music Ec', '0993456789001', 'Malecón 2000, Guayaquil', '042567890', 'producciones@livemusic.ec', 'Producción Musical', 'Activo', 'general');

-- Tipos de Documento
INSERT INTO TipoDocumento (TDoc_Nombre, TDoc_Codigo, TDoc_Descripcion, TDoc_Estado, id_modulo) VALUES
('Cédula de Ciudadanía', 'CC', 'Documento de identidad ecuatoriano', 'Activo', 'general'),
('Pasaporte', 'PP', 'Documento de viaje internacional', 'Activo', 'general'),
('RUC', 'RUC', 'Registro Único de Contribuyentes', 'Activo', 'general'),
('Cédula Extranjera', 'CE', 'Documento de identidad extranjero', 'Activo', 'general');

-- Unidades de Medida
INSERT INTO UnidadMedida (UMed_Nombre, UMed_Simbolo, UMed_Tipo, UMed_Estado, id_modulo) VALUES
('Unidad', 'und', 'Cantidad', 'Activo', 'general'),
('Kilogramo', 'kg', 'Peso', 'Activo', 'general'),
('Litro', 'lt', 'Volumen', 'Activo', 'general'),
('Metro', 'm', 'Longitud', 'Activo', 'general'),
('Hora', 'hr', 'Tiempo', 'Activo', 'general');

-- Provincias de Ecuador (24 provincias)
INSERT INTO Provincias (Prov_Nombre, Prov_Codigo, Prov_Pais, Prov_Estado, id_modulo) VALUES
('Guayas', '09', 'Ecuador', 'Activo', 'general'),
('Pichincha', '17', 'Ecuador', 'Activo', 'general'),
('Manabí', '13', 'Ecuador', 'Activo', 'general'),
('Azuay', '01', 'Ecuador', 'Activo', 'general'),
('El Oro', '07', 'Ecuador', 'Activo', 'general'),
('Los Ríos', '12', 'Ecuador', 'Activo', 'general'),
('Tungurahua', '18', 'Ecuador', 'Activo', 'general'),
('Esmeraldas', '08', 'Ecuador', 'Activo', 'general'),
('Imbabura', '10', 'Ecuador', 'Activo', 'general'),
('Loja', '11', 'Ecuador', 'Activo', 'general'),
('Chimborazo', '06', 'Ecuador', 'Activo', 'general'),
('Cotopaxi', '05', 'Ecuador', 'Activo', 'general'),
('Santa Elena', '24', 'Ecuador', 'Activo', 'general'),
('Santo Domingo de los Tsáchilas', '23', 'Ecuador', 'Activo', 'general'),
('Cañar', '03', 'Ecuador', 'Activo', 'general'),
('Carchi', '04', 'Ecuador', 'Activo', 'general'),
('Bolívar', '02', 'Ecuador', 'Activo', 'general'),
('Pastaza', '16', 'Ecuador', 'Activo', 'general'),
('Morona Santiago', '14', 'Ecuador', 'Activo', 'general'),
('Napo', '15', 'Ecuador', 'Activo', 'general'),
('Orellana', '22', 'Ecuador', 'Activo', 'general'),
('Sucumbíos', '21', 'Ecuador', 'Activo', 'general'),
('Zamora Chinchipe', '19', 'Ecuador', 'Activo', 'general'),
('Galápagos', '20', 'Ecuador', 'Activo', 'general');

-- Ciudades principales de Ecuador
INSERT INTO Ciudades (Ciu_Nombre, Ciu_Codigo, id_Provincias_Fk, Ciu_Estado, id_modulo) VALUES
-- Guayas
('Guayaquil', '0901', 1, 'Activo', 'general'),
('Durán', '0902', 1, 'Activo', 'general'),
('Daule', '0903', 1, 'Activo', 'general'),
('Samborondón', '0904', 1, 'Activo', 'general'),
-- Pichincha
('Quito', '1701', 2, 'Activo', 'general'),
('Sangolquí', '1702', 2, 'Activo', 'general'),
('Cayambe', '1703', 2, 'Activo', 'general'),
-- Manabí
('Manta', '1301', 3, 'Activo', 'general'),
('Portoviejo', '1302', 3, 'Activo', 'general'),
-- Azuay
('Cuenca', '0101', 4, 'Activo', 'general'),
-- El Oro
('Machala', '0701', 5, 'Activo', 'general'),
-- Los Ríos
('Babahoyo', '1201', 6, 'Activo', 'general'),
-- Tungurahua
('Ambato', '1801', 7, 'Activo', 'general'),
-- Esmeraldas
('Esmeraldas', '0801', 8, 'Activo', 'general'),
-- Imbabura
('Ibarra', '1001', 9, 'Activo', 'general'),
('Otavalo', '1002', 9, 'Activo', 'general'),
-- Loja
('Loja', '1101', 10, 'Activo', 'general'),
-- Chimborazo
('Riobamba', '0601', 11, 'Activo', 'general'),
-- Santa Elena
('Salinas', '2401', 13, 'Activo', 'general'),
('La Libertad', '2402', 13, 'Activo', 'general'),
-- Santo Domingo
('Santo Domingo', '2301', 14, 'Activo', 'general');

-- Estados Generales (Catálogo de estados del sistema)
INSERT INTO EstadosGenerales (EstG_Nombre, EstG_Descripcion, EstG_Tipo, EstG_Color, EstG_Estado, id_modulo) VALUES
('Activo', 'Registro activo en el sistema', 'Estado', '#28a745', 'Activo', 'general'),
('Inactivo', 'Registro inactivo temporalmente', 'Estado', '#6c757d', 'Activo', 'general'),
('Suspendido', 'Registro suspendido por políticas', 'Estado', '#ffc107', 'Activo', 'general'),
('Bloqueado', 'Registro bloqueado permanentemente', 'Estado', '#dc3545', 'Activo', 'general'),
('Pendiente', 'En espera de procesamiento', 'Proceso', '#17a2b8', 'Activo', 'general'),
('Procesando', 'En proceso de ejecución', 'Proceso', '#007bff', 'Activo', 'general'),
('Completado', 'Proceso finalizado exitosamente', 'Proceso', '#28a745', 'Activo', 'general'),
('Error', 'Proceso con errores', 'Proceso', '#dc3545', 'Activo', 'general');

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

-- Tipos de Cliente
INSERT INTO TipoCliente (TCli_Nombre, TCli_Descripcion, TCli_Estado, id_modulo) VALUES
('Persona Natural', 'Cliente individual', 'Activo', 'clientes'),
('Empresa', 'Cliente corporativo', 'Activo', 'clientes'),
('VIP', 'Cliente con beneficios especiales', 'Activo', 'clientes'),
('Estudiante', 'Cliente con descuentos estudiantiles', 'Activo', 'clientes');

-- Clientes de ejemplo (nombres ecuatorianos comunes)
INSERT INTO Clientes (Cli_Nombre, Cli_Apellido, Cli_Email, Cli_Celular, Cli_Telefono, Cli_FechaNacimiento, Cli_Identificacion, id_TipoDocumento_Fk, id_GeneroSexo_Fk, id_EstadoCivil_Fk, id_TipoCliente_Fk, id_Operadora_Fk, Cli_Estado, id_modulo) VALUES
('Carlos', 'Mendoza Vera', 'carlos.mendoza@email.com', '0987654321', '042345678', '1995-03-15', '0923456789', 1, 1, 1, 1, 1, 'Activo', 'clientes'),
('María', 'Ramírez López', 'maria.ramirez@email.com', '0998765432', '022456789', '1992-07-22', '1723456789', 1, 2, 2, 1, 2, 'Activo', 'clientes'),
('José', 'González Castro', 'jose.gonzalez@email.com', '0976543210', '042567890', '1988-11-10', '0912345678', 1, 1, 2, 3, 1, 'Activo', 'clientes'),
('Ana', 'Ortiz Morales', 'ana.ortiz@email.com', '0965432109', '022678901', '1998-05-18', '1712345678', 1, 2, 1, 4, 3, 'Activo', 'clientes'),
('Luis', 'Torres Sánchez', 'luis.torres@email.com', '0954321098', '042789012', '1990-09-25', '0901234567', 1, 1, 1, 1, 1, 'Activo', 'clientes'),
('Carmen', 'Flores Ríos', 'carmen.flores@email.com', '0943210987', '022890123', '1994-02-14', '1701234567', 1, 2, 1, 1, 2, 'Activo', 'clientes'),
('Diego', 'Vásquez Maldonado', 'diego.vasquez@email.com', '0932109876', '042901234', '1996-08-30', '0918273645', 1, 1, 1, 3, 1, 'Activo', 'clientes'),
('Laura', 'Cedeño Bravo', 'laura.cedeno@email.com', '0921098765', '022012345', '1991-12-05', '1718273645', 1, 2, 2, 1, 3, 'Activo', 'clientes'),
('Andrés', 'Salazar Chávez', 'andres.salazar@email.com', '0910987654', '042123456', '1993-04-20', '0927364518', 1, 1, 1, 4, 1, 'Activo', 'clientes'),
('Gabriela', 'Moreno Lara', 'gabriela.moreno@email.com', '0909876543', '022234567', '1997-06-12', '1727364518', 1, 2, 1, 1, 2, 'Activo', 'clientes'),
('Eventos Corporativos Ecuador S.A.', '', 'contacto@eventoscorp.ec', '0987123456', '042345000', NULL, '0992345678001', 3, NULL, NULL, 2, 1, 'Activo', 'clientes'),
('Universidad ESPOL', '', 'eventos@espol.edu.ec', '042269269', '042269269', NULL, '0960004930001', 3, NULL, NULL, 2, NULL, 'Activo', 'clientes');

-- Direcciones de Clientes
INSERT INTO DireccionesCliente (id_Clientes_Fk, DirCli_Calle, DirCli_Numero, DirCli_Referencia, DirCli_CodigoPostal, id_Ciudades_Fk, id_Provincias_Fk, DirCli_TipoDireccion, DirCli_EsPrincipal, DirCli_Estado, id_modulo) VALUES
(1, 'Av. 9 de Octubre', 'Mz. 45 Villa 12', 'Frente al parque', '090150', 1, 1, 'Principal', TRUE, 'Activo', 'clientes'),
(2, 'Av. 6 de Diciembre', 'N34-120', 'Sector La Carolina', '170135', 5, 2, 'Principal', TRUE, 'Activo', 'clientes'),
(3, 'Cdla. Kennedy Norte', 'Mz. 123 Solar 5', 'Cerca del CC San Marino', '090505', 1, 1, 'Principal', TRUE, 'Activo', 'clientes'),
(4, 'Av. Naciones Unidas', 'E4-676', 'Edificio Sigma, piso 8', '170135', 5, 2, 'Principal', TRUE, 'Activo', 'clientes'),
(5, 'Malecón 2000', 'Local 45', 'Al lado de la noria', '090313', 1, 1, 'Principal', TRUE, 'Activo', 'clientes'),
(6, 'Sector El Bosque', 'Calle A Mz. 15 Villa 7', 'Vía a Samborondón', '090652', 4, 1, 'Principal', TRUE, 'Activo', 'clientes'),
(7, 'Urdesa Central', 'Calle Segunda #234', 'Entre Bálsamos y Las Monjas', '090150', 1, 1, 'Principal', TRUE, 'Activo', 'clientes'),
(8, 'Sector González Suárez', 'Calle Toledo N26-45', 'Edificio Torres de Galeón', '170143', 5, 2, 'Principal', TRUE, 'Activo', 'clientes');

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
('Cultural', 'Eventos culturales y exposiciones', '#1abc9c', 'palette', 'Activo', 'eventos'),
('Conferencia', 'Conferencias y charlas educativas', '#34495e', 'presentation', 'Activo', 'eventos'),
('Feria', 'Ferias comerciales y exposiciones', '#16a085', 'shop', 'Activo', 'eventos');

-- Tipos de Ingreso
INSERT INTO TipoIngreso (TIng_Nombre, TIng_Descripcion, TIng_RequiereBoleto, TIng_Estado, id_modulo) VALUES
('Pago General', 'Entrada con pago de boleto', TRUE, 'Activo', 'eventos'),
('Cortesía', 'Entrada gratuita de cortesía', TRUE, 'Activo', 'eventos'),
('Invitación', 'Entrada por invitación', TRUE, 'Activo', 'eventos'),
('Libre', 'Evento de acceso libre sin boleto', FALSE, 'Activo', 'eventos'),
('Early Bird', 'Entrada con descuento anticipado', TRUE, 'Activo', 'eventos'),
('VIP', 'Entrada con accesos exclusivos', TRUE, 'Activo', 'eventos');

-- Eventos (Contexto ecuatoriano - Conciertos reales y ficticios)
INSERT INTO Eventos (Evt_Nombre, Evt_Descripcion, Evt_FechaInicio, Evt_FechaFin, Evt_Lugar, Evt_Direccion, id_Ciudades_Fk, Evt_CapacidadTotal, Evt_CapacidadDisponible, Evt_ImagenURL, Evt_PrecioBaseGeneral, id_CategoriaEvento_Fk, id_TipoIngreso_Fk, id_Proveedores_Fk, Evt_Estado, id_modulo) VALUES
('Feid en Guayaquil - Mor Tour 2025', 'El artista colombiano Feid llega a Guayaquil con su exitosa gira Mor Tour. Prepárate para una noche inolvidable llena de reggaeton y música urbana.', '2025-11-15 21:00:00', '2025-11-16 02:00:00', 'Estadio Modelo', 'Av. de las Américas, Guayaquil', 1, 25000, 22500, 'https://ejemplo.com/feid-guayaquil.jpg', 65.00, 2, 1, 5, 'Programado', 'eventos'),
('Karol G - Mañana Será Bonito Tour Quito', 'La Bichota llega a Ecuador con su tour mundial. Una noche épica de música urbana con los mayores éxitos de Karol G.', '2025-12-20 20:00:00', '2025-12-21 01:00:00', 'Estadio Olímpico Atahualpa', 'Av. 6 de Diciembre y Naciones Unidas, Quito', 5, 35000, 30000, 'https://ejemplo.com/karol-g-quito.jpg', 80.00, 2, 1, 5, 'Programado', 'eventos'),
('Festival Rock al Parque Ecuador', 'El festival de rock más grande de Ecuador regresa con bandas nacionales e internacionales. 3 días de rock, metal y música alternativa.', '2025-10-10 15:00:00', '2025-10-12 23:00:00', 'Parque La Carolina', 'Av. Río Amazonas, Quito', 5, 15000, 12000, 'https://ejemplo.com/rock-parque.jpg', 45.00, 1, 1, 5, 'Programado', 'eventos'),
('Marc Anthony en Guayaquil', 'El rey de la salsa Marc Anthony presenta su tour "Puro Genio". Una noche de salsa, romance y los grandes éxitos del salsero.', '2025-11-28 20:00:00', '2025-11-29 00:30:00', 'Estadio Modelo', 'Av. de las Américas, Guayaquil', 1, 30000, 25000, 'https://ejemplo.com/marc-anthony.jpg', 95.00, 3, 1, 5, 'Programado', 'eventos'),
('Festival de Salsa Cali Pachanguero en Manta', 'El mejor festival de salsa llega a Manta con orquestas de Colombia y Ecuador. Baile, música y sabor caribeño.', '2025-09-05 18:00:00', '2025-09-06 04:00:00', 'Malecón de Manta', 'Av. Malecón, Manta', 8, 8000, 7200, 'https://ejemplo.com/salsa-manta.jpg', 35.00, 3, 1, 5, 'Programado', 'eventos'),
('Soda Stereo por Cerati - Tributo Cuenca', 'Banda tributo a Soda Stereo y Gustavo Cerati. Los mejores hits del rock en español argentino.', '2025-08-22 20:00:00', '2025-08-22 23:30:00', 'Plaza de Toros Cuenca', 'Av. Huayna Cápac, Cuenca', 10, 5000, 4500, 'https://ejemplo.com/soda-stereo-tributo.jpg', 25.00, 1, 1, 1, 'Programado', 'eventos'),
('J Balvin - Rayo Tour Ecuador', 'El reggaetonero colombiano J Balvin trae su espectacular show Rayo Tour a Ecuador. Hits como "Mi Gente", "Ginza", "6 AM" y más.', '2025-11-08 21:00:00', '2025-11-09 01:30:00', 'Estadio Monumental Banco Pichincha', 'Av. Barcelona y Avenida Quito, Guayaquil', 1, 55000, 48000, 'https://ejemplo.com/j-balvin.jpg', 75.00, 2, 1, 5, 'Programado', 'eventos'),
('Festival Viña Rock Ecuador', 'El legendario festival español Viña Rock llega por primera vez a Ecuador con bandas de rock, punk y ska.', '2025-10-25 14:00:00', '2025-10-25 23:59:00', 'Parque Samanes', 'Av. Francisco de Orellana, Guayaquil', 1, 20000, 18500, 'https://ejemplo.com/vina-rock.jpg', 40.00, 4, 1, 5, 'Programado', 'eventos'),
('Bad Bunny - Most Wanted Tour Quito', 'El conejo malo llega a Ecuador con su gira más esperada. Reggaeton, trap y música urbana en su máxima expresión.', '2025-12-05 20:30:00', '2025-12-06 02:00:00', 'Estadio Olímpico Atahualpa', 'Av. 6 de Diciembre y Naciones Unidas, Quito', 5, 40000, 35000, 'https://ejemplo.com/bad-bunny.jpg', 120.00, 2, 1, 5, 'Programado', 'eventos'),
('Festival Ecuatoriano de Teatro - FET', 'El festival más importante de artes escénicas del Ecuador. 10 días de teatro, danza y performance.', '2025-09-15 18:00:00', '2025-09-25 22:00:00', 'Teatro Nacional Sucre', 'Plaza del Teatro, Quito', 5, 800, 600, 'https://ejemplo.com/festival-teatro.jpg', 15.00, 5, 1, 4, 'Programado', 'eventos'),
('Franco Escamilla - Stand Up Guayaquil', 'El comediante mexicano Franco Escamilla presenta su show "En defensa propia". Una noche de risas garantizadas.', '2025-08-30 20:00:00', '2025-08-30 22:30:00', 'Centro de Convenciones', 'Mall del Sol, Guayaquil', 1, 3500, 2800, 'https://ejemplo.com/franco-escamilla.jpg', 45.00, 6, 1, 4, 'Programado', 'eventos'),
('Fiesta de la Fruta y las Flores - Ambato', 'La tradicional fiesta de Ambato con desfiles, comparsas, carros alegóricos y conciertos gratuitos.', '2025-02-14 09:00:00', '2025-02-21 23:00:00', 'Centro de Ambato', 'Parque Cevallos, Ambato', 13, 50000, 50000, 'https://ejemplo.com/fiesta-flores.jpg', 0.00, 8, 4, NULL, 'Programado', 'eventos'),
('Liga de Quito vs Barcelona SC - Clásico del Astillero', 'El clásico del fútbol ecuatoriano. Liga de Quito recibe a Barcelona SC en el Rodrigo Paz Delgado.', '2025-07-20 16:00:00', '2025-07-20 18:00:00', 'Estadio Rodrigo Paz Delgado', 'Casa Blanca, Quito', 5, 41575, 38000, 'https://ejemplo.com/clasico-ecuador.jpg', 25.00, 7, 1, 3, 'Programado', 'eventos'),
('Conferencia TED Ecuador 2025', 'Ideas que vale la pena difundir. Conferencia TED con speakers nacionales e internacionales sobre innovación y tecnología.', '2025-10-18 09:00:00', '2025-10-18 18:00:00', 'Universidad San Francisco de Quito', 'Cumbayá, Quito', 5, 1500, 1200, 'https://ejemplo.com/ted-ecuador.jpg', 80.00, 9, 1, 4, 'Programado', 'eventos'),
('Feria del Libro Guayaquil 2025', 'La feria del libro más importante de la costa ecuatoriana. Presentaciones de autores, talleres literarios y actividades culturales.', '2025-11-01 10:00:00', '2025-11-10 20:00:00', 'Universidad Católica Santiago de Guayaquil', 'Av. Carlos Julio Arosemena, Guayaquil', 1, 10000, 9500, 'https://ejemplo.com/feria-libro.jpg', 5.00, 10, 1, NULL, 'Programado', 'eventos');

-- Detalles de Eventos (Información adicional)
INSERT INTO Detalle_Eventos (id_Eventos_Fk, DetEvt_Clave, DetEvt_Valor, DetEvt_Tipo, id_modulo) VALUES
(1, 'artista_principal', 'Feid', 'info', 'eventos'),
(1, 'artistas_invitados', 'Mañas Ru-Fino, Sky Rompiendo', 'info', 'eventos'),
(1, 'edad_minima', '18', 'restriccion', 'eventos'),
(2, 'artista_principal', 'Karol G', 'info', 'eventos'),
(2, 'duracion_aproximada', '180', 'info', 'eventos'),
(3, 'bandas_confirmadas', 'Bajo Sueños, Pulpo 3, Rocola Bacalao', 'info', 'eventos'),
(3, 'numero_dias', '3', 'info', 'eventos'),
(4, 'artista_principal', 'Marc Anthony', 'info', 'eventos'),
(9, 'artista_principal', 'Bad Bunny', 'info', 'eventos'),
(9, 'venta_prioritaria', 'true', 'comercial', 'eventos');

-- ============================================
-- MÓDULO BOLETOS
-- ============================================

-- Tipos de Boleto
INSERT INTO TiposBoleto (TBol_Nombre, TBol_Descripcion, TBol_Prioridad, TBol_PermisoAcceso, TBol_Estado, id_modulo) VALUES
('General', 'Entrada general sin asiento asignado', 1, 'Zona General', 'Activo', 'boletos'),
('Platea Baja', 'Asientos en platea baja numerados', 2, 'Platea Baja', 'Activo', 'boletos'),
('Platea Alta', 'Asientos en platea alta numerados', 2, 'Platea Alta', 'Activo', 'boletos'),
('VIP', 'Zona VIP con bar y baños exclusivos', 3, 'Zona VIP', 'Activo', 'boletos'),
('Gold', 'Zona preferencial cerca del escenario', 4, 'Zona Gold', 'Activo', 'boletos'),
('Palco', 'Palco privado con 4-6 personas', 5, 'Palcos', 'Activo', 'boletos'),
('Cortesía Prensa', 'Entrada de cortesía para prensa', 3, 'Zona Prensa', 'Activo', 'boletos'),
('Early Bird', 'Entrada con descuento de preventa', 1, 'Zona General', 'Activo', 'boletos');

-- Boletos para evento: Feid en Guayaquil (id_Eventos_Fk = 1)
-- Generamos múltiples boletos por tipo
INSERT INTO Boletos (Bol_Codigo, Bol_CodigoQR, Bol_Precio, Bol_PrecioOriginal, Bol_Descuento, id_Eventos_Fk, id_TiposBoleto_Fk, Bol_NumeroAsiento, Bol_SeccionZona, Bol_FechaVencimiento, Bol_Estado, id_modulo) VALUES
-- General
('FEID-GYE-G-001', 'QR-FEID-GYE-G-001', 55.00, 65.00, 10.00, 1, 8, NULL, 'General', '2025-11-16 02:00:00', 'Vendido', 'boletos'),
('FEID-GYE-G-002', 'QR-FEID-GYE-G-002', 65.00, 65.00, 0.00, 1, 1, NULL, 'General', '2025-11-16 02:00:00', 'Vendido', 'boletos'),
('FEID-GYE-G-003', 'QR-FEID-GYE-G-003', 65.00, 65.00, 0.00, 1, 1, NULL, 'General', '2025-11-16 02:00:00', 'Disponible', 'boletos'),
-- Platea Baja
('FEID-GYE-PB-001', 'QR-FEID-GYE-PB-001', 95.00, 95.00, 0.00, 1, 2, 'A-15', 'Platea Baja', '2025-11-16 02:00:00', 'Vendido', 'boletos'),
('FEID-GYE-PB-002', 'QR-FEID-GYE-PB-002', 95.00, 95.00, 0.00, 1, 2, 'A-16', 'Platea Baja', '2025-11-16 02:00:00', 'Vendido', 'boletos'),
('FEID-GYE-PB-003', 'QR-FEID-GYE-PB-003', 95.00, 95.00, 0.00, 1, 2, 'B-20', 'Platea Baja', '2025-11-16 02:00:00', 'Disponible', 'boletos'),
-- VIP
('FEID-GYE-VIP-001', 'QR-FEID-GYE-VIP-001', 150.00, 150.00, 0.00, 1, 4, 'VIP-10', 'VIP', '2025-11-16 02:00:00', 'Vendido', 'boletos'),
('FEID-GYE-VIP-002', 'QR-FEID-GYE-VIP-002', 150.00, 150.00, 0.00, 1, 4, 'VIP-11', 'VIP', '2025-11-16 02:00:00', 'Reservado', 'boletos'),
-- Gold
('FEID-GYE-GOLD-001', 'QR-FEID-GYE-GOLD-001', 200.00, 200.00, 0.00, 1, 5, 'GOLD-5', 'Gold', '2025-11-16 02:00:00', 'Vendido', 'boletos');

-- Boletos para evento: Karol G en Quito (id_Eventos_Fk = 2)
INSERT INTO Boletos (Bol_Codigo, Bol_CodigoQR, Bol_Precio, Bol_PrecioOriginal, Bol_Descuento, id_Eventos_Fk, id_TiposBoleto_Fk, Bol_NumeroAsiento, Bol_SeccionZona, Bol_FechaVencimiento, Bol_Estado, id_modulo) VALUES
('KAROL-UIO-G-001', 'QR-KAROL-UIO-G-001', 70.00, 80.00, 10.00, 2, 8, NULL, 'General', '2025-12-21 01:00:00', 'Vendido', 'boletos'),
('KAROL-UIO-G-002', 'QR-KAROL-UIO-G-002', 80.00, 80.00, 0.00, 2, 1, NULL, 'General', '2025-12-21 01:00:00', 'Disponible', 'boletos'),
('KAROL-UIO-PB-001', 'QR-KAROL-UIO-PB-001', 120.00, 120.00, 0.00, 2, 2, 'C-45', 'Platea Baja', '2025-12-21 01:00:00', 'Vendido', 'boletos'),
('KAROL-UIO-VIP-001', 'QR-KAROL-UIO-VIP-001', 180.00, 180.00, 0.00, 2, 4, 'VIP-22', 'VIP', '2025-12-21 01:00:00', 'Vendido', 'boletos'),
('KAROL-UIO-GOLD-001', 'QR-KAROL-UIO-GOLD-001', 250.00, 250.00, 0.00, 2, 5, 'GOLD-12', 'Gold', '2025-12-21 01:00:00', 'Reservado', 'boletos');

-- Boletos para evento: Festival Rock al Parque (id_Eventos_Fk = 3)
INSERT INTO Boletos (Bol_Codigo, Bol_CodigoQR, Bol_Precio, Bol_PrecioOriginal, Bol_Descuento, id_Eventos_Fk, id_TiposBoleto_Fk, Bol_NumeroAsiento, Bol_SeccionZona, Bol_FechaVencimiento, Bol_Estado, id_modulo) VALUES
('ROCK-UIO-G-001', 'QR-ROCK-UIO-G-001', 35.00, 45.00, 10.00, 3, 8, NULL, 'General', '2025-10-12 23:00:00', 'Vendido', 'boletos'),
('ROCK-UIO-G-002', 'QR-ROCK-UIO-G-002', 45.00, 45.00, 0.00, 3, 1, NULL, 'General', '2025-10-12 23:00:00', 'Vendido', 'boletos'),
('ROCK-UIO-VIP-001', 'QR-ROCK-UIO-VIP-001', 90.00, 90.00, 0.00, 3, 4, 'VIP-30', 'VIP', '2025-10-12 23:00:00', 'Disponible', 'boletos');

-- Boletos para evento: Marc Anthony (id_Eventos_Fk = 4)
INSERT INTO Boletos (Bol_Codigo, Bol_CodigoQR, Bol_Precio, Bol_PrecioOriginal, Bol_Descuento, id_Eventos_Fk, id_TiposBoleto_Fk, Bol_NumeroAsiento, Bol_SeccionZona, Bol_FechaVencimiento, Bol_Estado, id_modulo) VALUES
('MARC-GYE-G-001', 'QR-MARC-GYE-G-001', 85.00, 95.00, 10.00, 4, 8, NULL, 'General', '2025-11-29 00:30:00', 'Vendido', 'boletos'),
('MARC-GYE-PB-001', 'QR-MARC-GYE-PB-001', 140.00, 140.00, 0.00, 4, 2, 'D-12', 'Platea Baja', '2025-11-29 00:30:00', 'Vendido', 'boletos'),
('MARC-GYE-VIP-001', 'QR-MARC-GYE-VIP-001', 220.00, 220.00, 0.00, 4, 4, 'VIP-8', 'VIP', '2025-11-29 00:30:00', 'Disponible', 'boletos');

-- Entradas Asignadas (relación boleto-cliente)
INSERT INTO EntradasAsignadas (id_Boletos_Fk, id_Clientes_Fk, Ent_FechaAsignacion, Ent_Estado, id_modulo) VALUES
(1, 1, '2025-09-15 14:23:00', 'Asignada', 'boletos'),
(2, 2, '2025-09-16 10:45:00', 'Asignada', 'boletos'),
(4, 3, '2025-09-17 16:30:00', 'Asignada', 'boletos'),
(5, 4, '2025-09-17 16:32:00', 'Asignada', 'boletos'),
(7, 7, '2025-09-18 11:20:00', 'Asignada', 'boletos'),
(9, 10, '2025-09-20 09:15:00', 'Asignada', 'boletos'),
(10, 1, '2025-09-21 15:40:00', 'Asignada', 'boletos'),
(12, 5, '2025-09-22 12:10:00', 'Asignada', 'boletos'),
(13, 6, '2025-09-23 14:55:00', 'Asignada', 'boletos'),
(17, 8, '2025-09-25 10:30:00', 'Asignada', 'boletos'),
(18, 9, '2025-09-26 16:20:00', 'Asignada', 'boletos');

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

-- Detalle de Facturas
INSERT INTO Detalle_factura (id_Factura_Fk, id_Boletos_Fk, DetFac_Descripcion, DetFac_Cantidad, DetFac_PrecioUnitario, DetFac_Descuento, DetFac_Subtotal, id_modulo) VALUES
(1, 1, 'Boleto General Early Bird - Feid en Guayaquil', 1, 55.00, 10.00, 55.00, 'facturacion'),
(2, 2, 'Boleto General - Feid en Guayaquil', 1, 65.00, 0.00, 65.00, 'facturacion'),
(3, 4, 'Boleto Platea Baja - Feid en Guayaquil', 1, 95.00, 0.00, 95.00, 'facturacion'),
(3, 5, 'Boleto Platea Baja - Feid en Guayaquil', 1, 95.00, 0.00, 95.00, 'facturacion'),
(4, 7, 'Boleto VIP - Feid en Guayaquil', 1, 150.00, 0.00, 150.00, 'facturacion'),
(5, 9, 'Boleto Gold - Feid en Guayaquil', 1, 200.00, 0.00, 200.00, 'facturacion'),
(6, 10, 'Boleto General Early Bird - Karol G en Quito', 1, 70.00, 10.00, 70.00, 'facturacion'),
(7, 12, 'Boleto Platea Baja - Karol G en Quito', 1, 120.00, 0.00, 120.00, 'facturacion'),
(8, 13, 'Boleto VIP - Karol G en Quito', 1, 180.00, 0.00, 180.00, 'facturacion'),
(9, 17, 'Boleto General Early Bird - Festival Rock al Parque', 1, 35.00, 10.00, 35.00, 'facturacion'),
(10, 18, 'Boleto General - Festival Rock al Parque', 1, 45.00, 0.00, 45.00, 'facturacion');

-- ============================================
-- MÓDULO NOTIFICACIONES
-- ============================================

-- Plantillas de Notificaciones
INSERT INTO Plantillas (Pla_Nombre, Pla_Asunto, Pla_Contenido, Pla_Tipo, Pla_Variables, Pla_Estado, id_modulo) VALUES
('Confirmación de Compra', 'Tu compra ha sido confirmada - {evento_nombre}',
'Hola {cliente_nombre},

¡Gracias por tu compra! Tu boleto para {evento_nombre} ha sido confirmado.

Detalles del evento:
- Fecha: {evento_fecha}
- Lugar: {evento_lugar}
- Boleto: {boleto_tipo}
- Código: {boleto_codigo}

Tu factura #{factura_numero} ha sido generada.

Total pagado: ${total}

Descarga tu boleto adjunto y preséntalo el día del evento.

¡Te esperamos!',
'Email', 'cliente_nombre, evento_nombre, evento_fecha, evento_lugar, boleto_tipo, boleto_codigo, factura_numero, total', 'Activo', 'notificaciones'),

('Recordatorio de Evento', 'Recordatorio: {evento_nombre} es mañana',
'Hola {cliente_nombre},

Te recordamos que mañana es el gran día. {evento_nombre} te espera.

Fecha: {evento_fecha}
Lugar: {evento_lugar}
Tu boleto: {boleto_codigo}

Recomendaciones:
- Llega con anticipación
- Trae tu cédula de identidad
- Lleva tu boleto impreso o en tu celular

¡Nos vemos!',
'Email', 'cliente_nombre, evento_nombre, evento_fecha, evento_lugar, boleto_codigo', 'Activo', 'notificaciones'),

('Bienvenida Nuevo Cliente', 'Bienvenido a EventosEC',
'Hola {cliente_nombre},

¡Bienvenido a EventosEC, el mejor sistema de gestión de eventos de Ecuador!

Tu cuenta ha sido creada exitosamente. Ahora puedes:
- Comprar boletos para tus eventos favoritos
- Ver tu historial de compras
- Recibir notificaciones de próximos eventos

Gracias por unirte a nuestra comunidad.

EventosEC Team',
'Email', 'cliente_nombre', 'Activo', 'notificaciones'),

('Notificación Push Evento', 'Evento próximo: {evento_nombre}',
'{evento_nombre} es en {dias_restantes} días. ¡No te lo pierdas!',
'Push', 'evento_nombre, dias_restantes', 'Activo', 'notificaciones'),

('SMS Confirmación', 'EventosEC: Compra confirmada',
'Hola {cliente_nombre}. Tu boleto para {evento_nombre} esta confirmado. Codigo: {boleto_codigo}. Fecha: {evento_fecha}',
'SMS', 'cliente_nombre, evento_nombre, boleto_codigo, evento_fecha', 'Activo', 'notificaciones');

-- Notificaciones Enviadas
INSERT INTO Notificaciones (Not_Asunto, Not_Mensaje, Not_Tipo, id_Plantillas_Fk, Not_FechaProgramada, Not_FechaEnvio, Not_IntentosEnvio, Not_Estado, id_modulo) VALUES
('Tu compra ha sido confirmada - Feid en Guayaquil', 'Hola Carlos, tu boleto para Feid en Guayaquil ha sido confirmado...', 'Email', 1, '2025-09-15 14:26:00', '2025-09-15 14:26:30', 1, 'Enviada', 'notificaciones'),
('Tu compra ha sido confirmada - Feid en Guayaquil', 'Hola María, tu boleto para Feid en Guayaquil ha sido confirmado...', 'Email', 1, '2025-09-16 10:48:00', '2025-09-16 10:48:15', 1, 'Enviada', 'notificaciones'),
('Recordatorio: Feid en Guayaquil es mañana', 'Hola Carlos, te recordamos que mañana es el concierto...', 'Email', 2, '2025-11-14 10:00:00', NULL, 0, 'Pendiente', 'notificaciones'),
('Bienvenido a EventosEC', 'Hola Carlos, bienvenido a nuestra plataforma...', 'Email', 3, '2025-09-15 14:25:00', '2025-09-15 14:25:10', 1, 'Enviada', 'notificaciones'),
('Evento próximo: Karol G en Quito', 'Karol G en Quito es en 3 días. ¡No te lo pierdas!', 'Push', 4, '2025-12-17 09:00:00', NULL, 0, 'Pendiente', 'notificaciones');

-- Destinatarios de Notificaciones
INSERT INTO Destinatarios (id_Notificaciones_Fk, id_Clientes_Fk, Dest_Email, Dest_Telefono, Dest_FechaEnvio, Dest_FechaLectura, Dest_Estado, id_modulo) VALUES
(1, 1, 'carlos.mendoza@email.com', '0987654321', '2025-09-15 14:26:30', '2025-09-15 15:10:00', 'Leido', 'notificaciones'),
(2, 2, 'maria.ramirez@email.com', '0998765432', '2025-09-16 10:48:15', '2025-09-16 11:20:00', 'Leido', 'notificaciones'),
(3, 1, 'carlos.mendoza@email.com', '0987654321', NULL, NULL, 'Pendiente', 'notificaciones'),
(4, 1, 'carlos.mendoza@email.com', '0987654321', '2025-09-15 14:25:10', '2025-09-15 14:30:00', 'Leido', 'notificaciones'),
(5, 1, 'carlos.mendoza@email.com', '0987654321', NULL, NULL, 'Pendiente', 'notificaciones');

-- ============================================
-- MÓDULO AUTENTICACIÓN Y ROLES
-- ============================================

-- Roles del Sistema
INSERT INTO ROLES (Rol_Nombre, Rol_Descripcion, Rol_Nivel, Rol_Estado, id_modulo) VALUES
('Administrador', 'Acceso total al sistema', 10, 'Activo', 'autenticacion'),
('Gerente', 'Gestión de eventos y reportes', 8, 'Activo', 'autenticacion'),
('Vendedor', 'Venta de boletos y atención al cliente', 5, 'Activo', 'autenticacion'),
('Operador', 'Operaciones de eventos y validación', 4, 'Activo', 'autenticacion'),
('Contador', 'Gestión de facturación y contabilidad', 6, 'Activo', 'autenticacion'),
('Cliente', 'Usuario cliente con compras', 1, 'Activo', 'autenticacion'),
('Marketing', 'Gestión de notificaciones y campañas', 5, 'Activo', 'autenticacion');

-- Usuarios del Sistema
INSERT INTO USUARIOS (Usr_Email, Usr_Nombre, Usr_Apellido, Usr_Telefono, Usr_Avatar, id_ROLES_Fk, Usr_UltimoAcceso, Usr_Estado, id_modulo) VALUES
('admin@eventosec.com', 'Juan', 'Munizaga', '0987123456', NULL, 1, '2025-10-26 10:30:00', 'Activo', 'autenticacion'),
('gerente@eventosec.com', 'Ana', 'Rodríguez', '0998234567', NULL, 2, '2025-10-26 09:15:00', 'Activo', 'autenticacion'),
('vendedor1@eventosec.com', 'Luis', 'García', '0976345678', NULL, 3, '2025-10-26 11:45:00', 'Activo', 'autenticacion'),
('operador@eventosec.com', 'María', 'López', '0965456789', NULL, 4, '2025-10-25 16:20:00', 'Activo', 'autenticacion'),
('contador@eventosec.com', 'Diego', 'Sánchez', '0954567890', NULL, 5, '2025-10-26 08:00:00', 'Activo', 'autenticacion'),
('marketing@eventosec.com', 'Carmen', 'Torres', '0943678901', NULL, 7, '2025-10-26 10:00:00', 'Activo', 'autenticacion');

-- Login (Credenciales - Contraseñas hasheadas ficticiamente)
INSERT INTO LOGIN (id_USUARIOS_Fk, Log_Username, Log_PasswordHash, Log_Salt, Log_RequiereCambioPassword, Log_IntentosLogin, Log_Estado, id_modulo) VALUES
(1, 'admin', '$2b$10$abcdefghijklmnopqrstuvwxyz1234567890ABCDEFGHIJ', 'salt_admin', FALSE, 0, 'Activo', 'autenticacion'),
(2, 'gerente01', '$2b$10$bcdefghijklmnopqrstuvwxyz1234567890ABCDEFGHIJK', 'salt_gerente', FALSE, 0, 'Activo', 'autenticacion'),
(3, 'vendedor01', '$2b$10$cdefghijklmnopqrstuvwxyz1234567890ABCDEFGHIJKL', 'salt_vendedor', FALSE, 0, 'Activo', 'autenticacion'),
(4, 'operador01', '$2b$10$defghijklmnopqrstuvwxyz1234567890ABCDEFGHIJKLM', 'salt_operador', FALSE, 0, 'Activo', 'autenticacion'),
(5, 'contador01', '$2b$10$efghijklmnopqrstuvwxyz1234567890ABCDEFGHIJKLMN', 'salt_contador', FALSE, 0, 'Activo', 'autenticacion'),
(6, 'marketing01', '$2b$10$fghijklmnopqrstuvwxyz1234567890ABCDEFGHIJKLMNO', 'salt_marketing', FALSE, 0, 'Activo', 'autenticacion');

-- Permisos por Rol
-- Administrador (Full Access)
INSERT INTO Permisos (id_ROLES_Fk, Per_Modulo, Per_Pantalla, Per_Lectura, Per_Escritura, Per_Actualizacion, Per_Eliminacion, Per_Exportacion, Per_Estado, id_modulo) VALUES
(1, 'general', 'todos', TRUE, TRUE, TRUE, TRUE, TRUE, 'Activo', 'autenticacion'),
(1, 'clientes', 'todos', TRUE, TRUE, TRUE, TRUE, TRUE, 'Activo', 'autenticacion'),
(1, 'eventos', 'todos', TRUE, TRUE, TRUE, TRUE, TRUE, 'Activo', 'autenticacion'),
(1, 'boletos', 'todos', TRUE, TRUE, TRUE, TRUE, TRUE, 'Activo', 'autenticacion'),
(1, 'facturacion', 'todos', TRUE, TRUE, TRUE, TRUE, TRUE, 'Activo', 'autenticacion'),
(1, 'notificaciones', 'todos', TRUE, TRUE, TRUE, TRUE, TRUE, 'Activo', 'autenticacion'),
(1, 'autenticacion', 'todos', TRUE, TRUE, TRUE, TRUE, TRUE, 'Activo', 'autenticacion');

-- Gerente (Gestión y Reportes)
INSERT INTO Permisos (id_ROLES_Fk, Per_Modulo, Per_Pantalla, Per_Lectura, Per_Escritura, Per_Actualizacion, Per_Eliminacion, Per_Exportacion, Per_Estado, id_modulo) VALUES
(2, 'clientes', 'todos', TRUE, TRUE, TRUE, FALSE, TRUE, 'Activo', 'autenticacion'),
(2, 'eventos', 'todos', TRUE, TRUE, TRUE, TRUE, TRUE, 'Activo', 'autenticacion'),
(2, 'boletos', 'todos', TRUE, TRUE, TRUE, FALSE, TRUE, 'Activo', 'autenticacion'),
(2, 'facturacion', 'reportes', TRUE, FALSE, FALSE, FALSE, TRUE, 'Activo', 'autenticacion');

-- Vendedor (Ventas y Clientes)
INSERT INTO Permisos (id_ROLES_Fk, Per_Modulo, Per_Pantalla, Per_Lectura, Per_Escritura, Per_Actualizacion, Per_Eliminacion, Per_Exportacion, Per_Estado, id_modulo) VALUES
(3, 'clientes', 'listado', TRUE, TRUE, TRUE, FALSE, FALSE, 'Activo', 'autenticacion'),
(3, 'eventos', 'listado', TRUE, FALSE, FALSE, FALSE, FALSE, 'Activo', 'autenticacion'),
(3, 'boletos', 'venta', TRUE, TRUE, TRUE, FALSE, FALSE, 'Activo', 'autenticacion'),
(3, 'facturacion', 'crear', TRUE, TRUE, FALSE, FALSE, FALSE, 'Activo', 'autenticacion');

-- Contador (Facturación)
INSERT INTO Permisos (id_ROLES_Fk, Per_Modulo, Per_Pantalla, Per_Lectura, Per_Escritura, Per_Actualizacion, Per_Eliminacion, Per_Exportacion, Per_Estado, id_modulo) VALUES
(5, 'facturacion', 'todos', TRUE, TRUE, TRUE, FALSE, TRUE, 'Activo', 'autenticacion'),
(5, 'clientes', 'listado', TRUE, FALSE, FALSE, FALSE, FALSE, 'Activo', 'autenticacion');

-- Marketing (Notificaciones)
INSERT INTO Permisos (id_ROLES_Fk, Per_Modulo, Per_Pantalla, Per_Lectura, Per_Escritura, Per_Actualizacion, Per_Eliminacion, Per_Exportacion, Per_Estado, id_modulo) VALUES
(7, 'notificaciones', 'todos', TRUE, TRUE, TRUE, TRUE, TRUE, 'Activo', 'autenticacion'),
(7, 'clientes', 'listado', TRUE, FALSE, FALSE, FALSE, TRUE, 'Activo', 'autenticacion'),
(7, 'eventos', 'listado', TRUE, FALSE, FALSE, FALSE, FALSE, 'Activo', 'autenticacion');

-- ============================================
-- FIN DEL SCRIPT SEED
-- ============================================

-- RESUMEN DE DATOS INSERTADOS:
-- - Módulo General: 24 provincias, 21 ciudades, catálogos base
-- - Módulo Clientes: 12 clientes con direcciones
-- - Módulo Eventos: 15 eventos (conciertos, festivales, culturales)
-- - Módulo Boletos: 21 boletos con entradas asignadas
-- - Módulo Facturación: 10 facturas con detalles
-- - Módulo Notificaciones: 5 plantillas, notificaciones enviadas
-- - Módulo Autenticación: 7 roles, 6 usuarios con permisos

-- NOTA: Los datos son ficticios pero realistas del contexto ecuatoriano
-- Las contraseñas están hasheadas de forma ficticia (en producción usar bcrypt real)
-- Los códigos QR son simulados (en producción generar QR reales)
