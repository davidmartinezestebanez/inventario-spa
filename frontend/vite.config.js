import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // Redirigir peticiones a la API para evitar problemas de CORS si se prefiere,
    // aunque habilitamos CORS directamente en Express.
  }
})
