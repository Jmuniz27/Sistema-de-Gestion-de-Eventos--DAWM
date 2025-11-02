-- ============================================
-- Sistema de Gestión de Eventos - ESPOL
-- Row Level Security (RLS) Policies
-- ============================================
-- Base de Datos: PostgreSQL en Supabase
-- Fecha: Octubre 2025
-- Versión: 1.0
-- ============================================

-- INSTRUCCIONES:
-- 1. Ejecutar DESPUÉS de schema.sql y seed.sql
-- 2. Las políticas RLS protegen datos a nivel de fila
-- 3. Supabase valida permisos antes de cada query
-- 4. Se basan en auth.uid() (usuario autenticado de Supabase)
-- 5. Revisar roles y permisos del módulo de autenticación

-- ============================================
-- IMPORTANTE: ESTRATEGIA DE SEGURIDAD
-- ============================================
-- Por defecto, todas las tablas tendrán RLS habilitado
-- Las políticas se definen según roles:
-- - Administrador: Acceso total
-- - Gerente: Lectura/escritura sin eliminación
-- - Vendedor: CRUD limitado a su contexto
-- - Operador: Solo operaciones específicas
-- - Cliente: Solo sus propios datos
-- - Público: Solo lectura de catálogos públicos

-- ============================================
-- FUNCIÓN AUXILIAR: Obtener rol del usuario
-- ============================================

-- Función para obtener el rol del usuario autenticado
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS TEXT AS $$
DECLARE
  user_role TEXT;
BEGIN
  SELECT ROLES.Rol_Nombre INTO user_role
  FROM USUARIOS
  JOIN ROLES ON USUARIOS.id_ROLES_Fk = ROLES.id_ROLES
  WHERE USUARIOS.Usr_Email = auth.email();

  RETURN COALESCE(user_role, 'publico');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para verificar si usuario es admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN get_user_role() = 'Administrador';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para verificar si usuario es gerente o superior
CREATE OR REPLACE FUNCTION is_gerente_or_above()
RETURNS BOOLEAN AS $$
DECLARE
  user_role TEXT;
BEGIN
  user_role := get_user_role();
  RETURN user_role IN ('Administrador', 'Gerente');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para obtener id de usuario actual
CREATE OR REPLACE FUNCTION get_current_user_id()
RETURNS INTEGER AS $$
DECLARE
  user_id INTEGER;
BEGIN
  SELECT id_USUARIOS INTO user_id
  FROM USUARIOS
  WHERE Usr_Email = auth.email();

  RETURN user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- HABILITAR RLS EN TODAS LAS TABLAS
-- ============================================

-- Módulo General (Acceso público para catálogos)
ALTER TABLE GeneroSexo ENABLE ROW LEVEL SECURITY;
ALTER TABLE Operadora ENABLE ROW LEVEL SECURITY;
ALTER TABLE EstadoCivil ENABLE ROW LEVEL SECURITY;
ALTER TABLE Proveedores ENABLE ROW LEVEL SECURITY;
ALTER TABLE TipoDocumento ENABLE ROW LEVEL SECURITY;
ALTER TABLE UnidadMedida ENABLE ROW LEVEL SECURITY;
ALTER TABLE Provincias ENABLE ROW LEVEL SECURITY;
ALTER TABLE Ciudades ENABLE ROW LEVEL SECURITY;
ALTER TABLE EstadosGenerales ENABLE ROW LEVEL SECURITY;
ALTER TABLE MetodoPago ENABLE ROW LEVEL SECURITY;
ALTER TABLE IVA ENABLE ROW LEVEL SECURITY;

-- Módulo Clientes
ALTER TABLE TipoCliente ENABLE ROW LEVEL SECURITY;
ALTER TABLE Clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE DireccionesCliente ENABLE ROW LEVEL SECURITY;

-- Módulo Eventos
ALTER TABLE CategoriasEvento ENABLE ROW LEVEL SECURITY;
ALTER TABLE TipoIngreso ENABLE ROW LEVEL SECURITY;
ALTER TABLE Eventos ENABLE ROW LEVEL SECURITY;
ALTER TABLE Detalle_Eventos ENABLE ROW LEVEL SECURITY;

-- Módulo Boletos
ALTER TABLE TiposBoleto ENABLE ROW LEVEL SECURITY;
ALTER TABLE Boletos ENABLE ROW LEVEL SECURITY;
ALTER TABLE EntradasAsignadas ENABLE ROW LEVEL SECURITY;

-- Módulo Facturación
ALTER TABLE Factura ENABLE ROW LEVEL SECURITY;
ALTER TABLE Detalle_factura ENABLE ROW LEVEL SECURITY;

-- Módulo Notificaciones
ALTER TABLE Plantillas ENABLE ROW LEVEL SECURITY;
ALTER TABLE Notificaciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE Destinatarios ENABLE ROW LEVEL SECURITY;

-- Módulo Autenticación
ALTER TABLE ROLES ENABLE ROW LEVEL SECURITY;
ALTER TABLE USUARIOS ENABLE ROW LEVEL SECURITY;
ALTER TABLE LOGIN ENABLE ROW LEVEL SECURITY;
ALTER TABLE Permisos ENABLE ROW LEVEL SECURITY;

-- ============================================
-- POLÍTICAS: MÓDULO GENERAL (Catálogos Públicos)
-- ============================================
-- Los catálogos son de solo lectura para todos

-- GeneroSexo
CREATE POLICY "Permitir lectura pública de géneros"
ON GeneroSexo FOR SELECT
USING (true);

CREATE POLICY "Solo admins pueden modificar géneros"
ON GeneroSexo FOR ALL
USING (is_admin());

-- Operadora
CREATE POLICY "Permitir lectura pública de operadoras"
ON Operadora FOR SELECT
USING (true);

CREATE POLICY "Solo admins pueden modificar operadoras"
ON Operadora FOR ALL
USING (is_admin());

-- EstadoCivil
CREATE POLICY "Permitir lectura pública de estados civiles"
ON EstadoCivil FOR SELECT
USING (true);

CREATE POLICY "Solo admins pueden modificar estados civiles"
ON EstadoCivil FOR ALL
USING (is_admin());

-- Proveedores
CREATE POLICY "Gerentes pueden ver proveedores"
ON Proveedores FOR SELECT
USING (is_gerente_or_above());

CREATE POLICY "Solo admins pueden modificar proveedores"
ON Proveedores FOR ALL
USING (is_admin());

-- TipoDocumento
CREATE POLICY "Permitir lectura pública de tipos de documento"
ON TipoDocumento FOR SELECT
USING (true);

CREATE POLICY "Solo admins pueden modificar tipos de documento"
ON TipoDocumento FOR ALL
USING (is_admin());

-- UnidadMedida
CREATE POLICY "Permitir lectura pública de unidades"
ON UnidadMedida FOR SELECT
USING (true);

CREATE POLICY "Solo admins pueden modificar unidades"
ON UnidadMedida FOR ALL
USING (is_admin());

-- Provincias
CREATE POLICY "Permitir lectura pública de provincias"
ON Provincias FOR SELECT
USING (true);

CREATE POLICY "Solo admins pueden modificar provincias"
ON Provincias FOR ALL
USING (is_admin());

-- Ciudades
CREATE POLICY "Permitir lectura pública de ciudades"
ON Ciudades FOR SELECT
USING (true);

CREATE POLICY "Solo admins pueden modificar ciudades"
ON Ciudades FOR ALL
USING (is_admin());

-- EstadosGenerales
CREATE POLICY "Permitir lectura pública de estados"
ON EstadosGenerales FOR SELECT
USING (true);

CREATE POLICY "Solo admins pueden modificar estados"
ON EstadosGenerales FOR ALL
USING (is_admin());

-- MetodoPago
CREATE POLICY "Permitir lectura pública de métodos de pago"
ON MetodoPago FOR SELECT
USING (true);

CREATE POLICY "Solo admins pueden modificar métodos de pago"
ON MetodoPago FOR ALL
USING (is_admin());

-- IVA
CREATE POLICY "Permitir lectura pública de IVA"
ON IVA FOR SELECT
USING (true);

CREATE POLICY "Solo admins pueden modificar IVA"
ON IVA FOR ALL
USING (is_admin());

-- ============================================
-- POLÍTICAS: MÓDULO CLIENTES
-- ============================================

-- TipoCliente
CREATE POLICY "Permitir lectura de tipos de cliente"
ON TipoCliente FOR SELECT
USING (true);

CREATE POLICY "Solo admins pueden modificar tipos de cliente"
ON TipoCliente FOR ALL
USING (is_admin());

-- Clientes (Sensible: solo ven sus propios datos o staff)
CREATE POLICY "Clientes pueden ver sus propios datos"
ON Clientes FOR SELECT
USING (
  auth.email() = Cli_Email OR
  get_user_role() IN ('Administrador', 'Gerente', 'Vendedor')
);

CREATE POLICY "Staff puede crear clientes"
ON Clientes FOR INSERT
WITH CHECK (
  get_user_role() IN ('Administrador', 'Gerente', 'Vendedor')
);

CREATE POLICY "Staff puede actualizar clientes"
ON Clientes FOR UPDATE
USING (
  get_user_role() IN ('Administrador', 'Gerente', 'Vendedor')
);

CREATE POLICY "Solo admins pueden eliminar clientes"
ON Clientes FOR DELETE
USING (is_admin());

-- DireccionesCliente
CREATE POLICY "Ver direcciones propias o staff"
ON DireccionesCliente FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM Clientes
    WHERE Clientes.id_Clientes = DireccionesCliente.id_Clientes_Fk
    AND (Clientes.Cli_Email = auth.email() OR get_user_role() IN ('Administrador', 'Gerente', 'Vendedor'))
  )
);

CREATE POLICY "Staff puede crear direcciones"
ON DireccionesCliente FOR INSERT
WITH CHECK (
  get_user_role() IN ('Administrador', 'Gerente', 'Vendedor')
);

CREATE POLICY "Staff puede actualizar direcciones"
ON DireccionesCliente FOR UPDATE
USING (
  get_user_role() IN ('Administrador', 'Gerente', 'Vendedor')
);

CREATE POLICY "Staff puede eliminar direcciones"
ON DireccionesCliente FOR DELETE
USING (
  get_user_role() IN ('Administrador', 'Gerente', 'Vendedor')
);

-- ============================================
-- POLÍTICAS: MÓDULO EVENTOS
-- ============================================

-- CategoriasEvento
CREATE POLICY "Permitir lectura pública de categorías"
ON CategoriasEvento FOR SELECT
USING (true);

CREATE POLICY "Gerentes pueden modificar categorías"
ON CategoriasEvento FOR ALL
USING (is_gerente_or_above());

-- TipoIngreso
CREATE POLICY "Permitir lectura pública de tipos de ingreso"
ON TipoIngreso FOR SELECT
USING (true);

CREATE POLICY "Gerentes pueden modificar tipos de ingreso"
ON TipoIngreso FOR ALL
USING (is_gerente_or_above());

-- Eventos (Público puede ver, staff puede modificar)
CREATE POLICY "Permitir lectura pública de eventos activos"
ON Eventos FOR SELECT
USING (Evt_Estado NOT IN ('Cancelado') OR is_gerente_or_above());

CREATE POLICY "Gerentes pueden crear eventos"
ON Eventos FOR INSERT
WITH CHECK (is_gerente_or_above());

CREATE POLICY "Gerentes pueden actualizar eventos"
ON Eventos FOR UPDATE
USING (is_gerente_or_above());

CREATE POLICY "Solo admins pueden eliminar eventos"
ON Eventos FOR DELETE
USING (is_admin());

-- Detalle_Eventos
CREATE POLICY "Ver detalles de eventos públicos"
ON Detalle_Eventos FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM Eventos
    WHERE Eventos.id_Eventos = Detalle_Eventos.id_Eventos_Fk
    AND (Eventos.Evt_Estado NOT IN ('Cancelado') OR is_gerente_or_above())
  )
);

CREATE POLICY "Gerentes pueden modificar detalles"
ON Detalle_Eventos FOR ALL
USING (is_gerente_or_above());

-- ============================================
-- POLÍTICAS: MÓDULO BOLETOS
-- ============================================

-- TiposBoleto
CREATE POLICY "Permitir lectura pública de tipos de boleto"
ON TiposBoleto FOR SELECT
USING (true);

CREATE POLICY "Gerentes pueden modificar tipos de boleto"
ON TiposBoleto FOR ALL
USING (is_gerente_or_above());

-- Boletos (Solo staff y compradores)
CREATE POLICY "Ver boletos disponibles o propios"
ON Boletos FOR SELECT
USING (
  Bol_Estado = 'Disponible' OR
  get_user_role() IN ('Administrador', 'Gerente', 'Vendedor', 'Operador') OR
  EXISTS (
    SELECT 1 FROM EntradasAsignadas
    JOIN Clientes ON EntradasAsignadas.id_Clientes_Fk = Clientes.id_Clientes
    WHERE EntradasAsignadas.id_Boletos_Fk = Boletos.id_Boletos
    AND Clientes.Cli_Email = auth.email()
  )
);

CREATE POLICY "Gerentes pueden crear boletos"
ON Boletos FOR INSERT
WITH CHECK (is_gerente_or_above());

CREATE POLICY "Staff puede actualizar boletos"
ON Boletos FOR UPDATE
USING (
  get_user_role() IN ('Administrador', 'Gerente', 'Vendedor', 'Operador')
);

CREATE POLICY "Solo admins pueden eliminar boletos"
ON Boletos FOR DELETE
USING (is_admin());

-- EntradasAsignadas
CREATE POLICY "Ver entradas propias o staff"
ON EntradasAsignadas FOR SELECT
USING (
  get_user_role() IN ('Administrador', 'Gerente', 'Vendedor', 'Operador') OR
  EXISTS (
    SELECT 1 FROM Clientes
    WHERE Clientes.id_Clientes = EntradasAsignadas.id_Clientes_Fk
    AND Clientes.Cli_Email = auth.email()
  )
);

CREATE POLICY "Staff puede asignar entradas"
ON EntradasAsignadas FOR INSERT
WITH CHECK (
  get_user_role() IN ('Administrador', 'Gerente', 'Vendedor')
);

CREATE POLICY "Staff puede actualizar entradas"
ON EntradasAsignadas FOR UPDATE
USING (
  get_user_role() IN ('Administrador', 'Gerente', 'Vendedor', 'Operador')
);

CREATE POLICY "Staff puede cancelar entradas"
ON EntradasAsignadas FOR DELETE
USING (
  get_user_role() IN ('Administrador', 'Gerente')
);

-- ============================================
-- POLÍTICAS: MÓDULO FACTURACIÓN
-- ============================================

-- Factura (Solo cliente propietario y staff)
CREATE POLICY "Ver facturas propias o staff"
ON Factura FOR SELECT
USING (
  get_user_role() IN ('Administrador', 'Gerente', 'Contador', 'Vendedor') OR
  EXISTS (
    SELECT 1 FROM Clientes
    WHERE Clientes.id_Clientes = Factura.id_Clientes_Fk
    AND Clientes.Cli_Email = auth.email()
  )
);

CREATE POLICY "Staff puede crear facturas"
ON Factura FOR INSERT
WITH CHECK (
  get_user_role() IN ('Administrador', 'Contador', 'Vendedor')
);

CREATE POLICY "Staff puede actualizar facturas"
ON Factura FOR UPDATE
USING (
  get_user_role() IN ('Administrador', 'Contador')
);

CREATE POLICY "Solo admins pueden eliminar facturas"
ON Factura FOR DELETE
USING (is_admin());

-- Detalle_factura
CREATE POLICY "Ver detalles de facturas propias o staff"
ON Detalle_factura FOR SELECT
USING (
  get_user_role() IN ('Administrador', 'Gerente', 'Contador', 'Vendedor') OR
  EXISTS (
    SELECT 1 FROM Factura
    JOIN Clientes ON Factura.id_Clientes_Fk = Clientes.id_Clientes
    WHERE Factura.id_Factura = Detalle_factura.id_Factura_Fk
    AND Clientes.Cli_Email = auth.email()
  )
);

CREATE POLICY "Staff puede crear detalles de factura"
ON Detalle_factura FOR INSERT
WITH CHECK (
  get_user_role() IN ('Administrador', 'Contador', 'Vendedor')
);

CREATE POLICY "Staff puede actualizar detalles"
ON Detalle_factura FOR UPDATE
USING (
  get_user_role() IN ('Administrador', 'Contador')
);

CREATE POLICY "Staff puede eliminar detalles"
ON Detalle_factura FOR DELETE
USING (
  get_user_role() IN ('Administrador', 'Contador')
);

-- ============================================
-- POLÍTICAS: MÓDULO NOTIFICACIONES
-- ============================================

-- Plantillas
CREATE POLICY "Staff puede ver plantillas"
ON Plantillas FOR SELECT
USING (
  get_user_role() IN ('Administrador', 'Marketing', 'Gerente')
);

CREATE POLICY "Marketing puede modificar plantillas"
ON Plantillas FOR ALL
USING (
  get_user_role() IN ('Administrador', 'Marketing')
);

-- Notificaciones
CREATE POLICY "Ver notificaciones propias o staff"
ON Notificaciones FOR SELECT
USING (
  get_user_role() IN ('Administrador', 'Marketing', 'Gerente') OR
  EXISTS (
    SELECT 1 FROM Destinatarios
    JOIN Clientes ON Destinatarios.id_Clientes_Fk = Clientes.id_Clientes
    WHERE Destinatarios.id_Notificaciones_Fk = Notificaciones.id_Notificaciones
    AND Clientes.Cli_Email = auth.email()
  )
);

CREATE POLICY "Marketing puede crear notificaciones"
ON Notificaciones FOR INSERT
WITH CHECK (
  get_user_role() IN ('Administrador', 'Marketing')
);

CREATE POLICY "Marketing puede actualizar notificaciones"
ON Notificaciones FOR UPDATE
USING (
  get_user_role() IN ('Administrador', 'Marketing')
);

CREATE POLICY "Marketing puede eliminar notificaciones"
ON Notificaciones FOR DELETE
USING (
  get_user_role() IN ('Administrador', 'Marketing')
);

-- Destinatarios
CREATE POLICY "Ver destinatarios propios o staff"
ON Destinatarios FOR SELECT
USING (
  get_user_role() IN ('Administrador', 'Marketing', 'Gerente') OR
  EXISTS (
    SELECT 1 FROM Clientes
    WHERE Clientes.id_Clientes = Destinatarios.id_Clientes_Fk
    AND Clientes.Cli_Email = auth.email()
  )
);

CREATE POLICY "Marketing puede crear destinatarios"
ON Destinatarios FOR INSERT
WITH CHECK (
  get_user_role() IN ('Administrador', 'Marketing')
);

CREATE POLICY "Marketing puede actualizar destinatarios"
ON Destinatarios FOR UPDATE
USING (
  get_user_role() IN ('Administrador', 'Marketing')
);

CREATE POLICY "Marketing puede eliminar destinatarios"
ON Destinatarios FOR DELETE
USING (
  get_user_role() IN ('Administrador', 'Marketing')
);

-- ============================================
-- POLÍTICAS: MÓDULO AUTENTICACIÓN
-- ============================================

-- ROLES (Solo admins)
CREATE POLICY "Staff puede ver roles"
ON ROLES FOR SELECT
USING (
  get_user_role() IN ('Administrador', 'Gerente')
);

CREATE POLICY "Solo admins pueden modificar roles"
ON ROLES FOR ALL
USING (is_admin());

-- USUARIOS (Protección estricta)
CREATE POLICY "Ver usuarios autorizados"
ON USUARIOS FOR SELECT
USING (
  get_user_role() IN ('Administrador', 'Gerente') OR
  Usr_Email = auth.email()
);

CREATE POLICY "Solo admins pueden crear usuarios"
ON USUARIOS FOR INSERT
WITH CHECK (is_admin());

CREATE POLICY "Admins y usuarios propios pueden actualizar"
ON USUARIOS FOR UPDATE
USING (
  is_admin() OR Usr_Email = auth.email()
);

CREATE POLICY "Solo admins pueden eliminar usuarios"
ON USUARIOS FOR DELETE
USING (is_admin());

-- LOGIN (Máxima seguridad)
CREATE POLICY "Solo admins pueden ver logins"
ON LOGIN FOR SELECT
USING (is_admin());

CREATE POLICY "Solo admins pueden modificar logins"
ON LOGIN FOR ALL
USING (is_admin());

-- Permisos
CREATE POLICY "Staff puede ver permisos"
ON Permisos FOR SELECT
USING (
  get_user_role() IN ('Administrador', 'Gerente')
);

CREATE POLICY "Solo admins pueden modificar permisos"
ON Permisos FOR ALL
USING (is_admin());

-- ============================================
-- GRANTS: Permisos a nivel de tabla
-- ============================================

-- Dar permisos a usuarios autenticados (anon es para usuarios no autenticados)
GRANT USAGE ON SCHEMA public TO authenticated, anon;

-- Catálogos públicos (lectura para todos)
GRANT SELECT ON GeneroSexo, Operadora, EstadoCivil, TipoDocumento, UnidadMedida,
              Provincias, Ciudades, EstadosGenerales, MetodoPago, IVA,
              TipoCliente, CategoriasEvento, TipoIngreso, TiposBoleto
TO anon, authenticated;

-- Eventos públicos (lectura)
GRANT SELECT ON Eventos TO anon, authenticated;

-- Boletos (lectura para usuarios autenticados)
GRANT SELECT ON Boletos TO authenticated;

-- Resto de tablas solo para authenticated (RLS controla acceso específico)
GRANT ALL ON Clientes, DireccionesCliente, Detalle_Eventos,
             EntradasAsignadas, Factura, Detalle_factura,
             Notificaciones, Plantillas, Destinatarios,
             ROLES, USUARIOS, LOGIN, Permisos, Proveedores
TO authenticated;

-- ============================================
-- FIN DEL SCRIPT RLS
-- ============================================

-- NOTAS IMPORTANTES:
-- 1. auth.email() usa el email del usuario autenticado en Supabase Auth
-- 2. Las políticas se evalúan en orden, la primera que coincide aplica
-- 3. Si no hay política que coincida, se DENIEGA el acceso (secure by default)
-- 4. Las funciones SECURITY DEFINER ejecutan con privilegios del creador
-- 5. Probar las políticas exhaustivamente en desarrollo antes de producción
-- 6. Monitorear logs de Supabase para intentos de acceso denegado

-- TESTING:
-- Para probar las políticas, usar diferentes usuarios con diferentes roles
-- Verificar que no haya data leaks entre clientes
-- Confirmar que staff tiene accesos apropiados
-- Validar que administrador tiene acceso total
