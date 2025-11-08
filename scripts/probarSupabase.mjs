import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);
console.log('Supabase client creado con éxito');

const probar = async () => {
  const { data, error } = await supabase.from('boletos').select('*').limit(5);
  if (error) {
    console.error('Error:', error);
    return;
  }
  console.log('Datos:', data);
};

probar();