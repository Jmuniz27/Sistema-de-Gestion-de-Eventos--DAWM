import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

// Usa las variables del .env
const supabase = createClient(
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_KEY || process.env.VITE_SUPABASE_ANON_KEY
);

const deleteUser = async (userId) => {
  const { data, error } = await supabase
    .from('usuarios')
    .delete()
    .eq('id_usuario', userId)
  if (error) {
    console.error('Error:', error);
  } else {
    console.log('Datos:', data);
  }
}

const main = async () => {
  // Cambia 'boletos' por el nombre de tu tabla
  /*
    const { data, error } = await supabase
      .from('usuarios')
      .select(`
        *,
        usuarios_roles (
          roles (
            *,
            roles_permisos (
              permisos (*)
            )
          )
        ),
        estados_generales (*)
      `)
      .order('id_usuario', { ascending: true })
  */
  const { data, error } = await supabase
    .from('usuarios_roles')
    .select('*')
  if (error) {
    console.error('Error:', error);
  } else {
    console.log('Datos:', data);
  }
};

main();
//deleteUser(12)
