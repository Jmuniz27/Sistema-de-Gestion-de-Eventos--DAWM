import { defineConfig } from 'vite';
import { glob } from 'glob';

// Obtener todas las páginas HTML automáticamente
const htmlFiles = glob.sync('src/**/*.html', {
  ignore: ['**/node_modules/**', '**/dist/**'],
  absolute: true
});

// Crear objeto de entrada para rollup
const input = {};
htmlFiles.forEach(file => {
  // Convertir ruta absoluta a relativa desde src/
  const relativePath = file.replace(/\\/g, '/').split('/src/')[1];
  // Crear nombre de entrada basado en la ruta del archivo
  const name = relativePath.replace(/\//g, '_').replace('.html', '');
  input[name] = file;
});

export default defineConfig({
  // La raíz del proyecto es la carpeta src
  root: './src',

  // Permitir que Vite lea las variables .env que están en la raíz del proyecto
  envDir: '../',

  // Configuración del servidor de desarrollo
  server: {
    port: 3000,   // localhost:3000
    open: true,   // se abre automáticamente en el navegador
  },

  // Configuración de compilación (build)
  build: {
    outDir: '../dist',     // salida final en la raíz del proyecto
    emptyOutDir: true,     // limpia la carpeta dist antes de construir
    rollupOptions: {
      input
    }
  },
});