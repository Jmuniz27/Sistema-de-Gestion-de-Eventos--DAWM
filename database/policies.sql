-- ============================================
-- Row Level Security (RLS) Policies
-- Sistema de Gestión de Eventos - ESPOL
-- ============================================

-- Supabase usa RLS para controlar el acceso a nivel de fila
-- Esto es MUY importante para seguridad

-- ============================================
-- HABILITAR RLS EN TABLAS
-- ============================================

-- ALTER TABLE Clientes ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE Eventos ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE Boletos ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE Factura ENABLE ROW LEVEL SECURITY;

-- ============================================
-- POLÍTICAS DE EJEMPLO
-- ============================================

-- Política: Los usuarios solo pueden ver sus propios datos
-- CREATE POLICY "Users can view own data" ON Clientes
-- FOR SELECT
-- USING (auth.uid() = user_id);

-- Política: Administradores pueden ver todo
-- CREATE POLICY "Admins can view all" ON Clientes
-- FOR SELECT
-- USING (
--   EXISTS (
--     SELECT 1 FROM USUARIOS
--     WHERE id_USUARIOS = auth.uid()
--     AND Usr_Rol = 'admin'
--   )
-- );

-- TODO: Definir políticas RLS para cada tabla según roles
-- TODO: Consultar documentación de Supabase RLS
