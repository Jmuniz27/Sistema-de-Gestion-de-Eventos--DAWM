import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

const probar = async () => {
  console.log('=== TIPOS DE BOLETO ===');
  const { data: tipos, error: errorTipos } = await supabase
    .from('tiposboleto')
    .select('*');
  
  if (errorTipos) {
    console.log('Error:', errorTipos);
  } else {
    console.log('Datos:', tipos);
  }

  console.log('\n=== BOLETOS ===');
  const { data: boletos, error: errorBoletos } = await supabase
    .from('boleto')
    .select('*')
    .limit(5);
  
  if (errorBoletos) {
    console.log('Error:', errorBoletos);
  } else {
    console.log('Datos:', boletos);
  }

  console.log('\n=== ENTRADAS ASIGNADAS ===');
  const { data: entradas, error: errorEntradas } = await supabase
    .from('entradasasignadas')
    .select('*')
    .limit(5);
  
  if (errorEntradas) {
    console.log('Error:', errorEntradas);
  } else {
    console.log('Datos:', entradas);
  }
};

probar();
