import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

// Usa las variables del .env
const supabase = createClient(
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_KEY || process.env.VITE_SUPABASE_ANON_KEY
);

const main = async () => {
  // Cambia 'boletos' por el nombre de tu tabla
  const { data, error } = await supabase.from('eventos').select('*').limit(5);
  if (error) {
    console.error('Error:', error);
  } else {
    console.log('Datos:', data);
  }
};

main();