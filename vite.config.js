import { defineConfig } from 'vite';

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
  },
});