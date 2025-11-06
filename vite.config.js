import { defineConfig } from 'vite'

export default defineConfig({
  root: './src',
  // Cargar variables de entorno desde la raíz del repositorio (donde está .env)
  // Vite, al cambiar root a './src', por defecto busca .env dentro de ./src.
  // Con envDir, indicamos que lo busque un nivel arriba (../) para usar el .env del proyecto.
  envDir: '../',
  build: {
    outDir: '../dist',
    emptyOutDir: true
  },
  server: {
    port: 3000,
    open: true
  }
})
