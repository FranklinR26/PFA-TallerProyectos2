import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],

  server: {
    // Expone el dev-server en toda la red local (útil para probar desde móvil / otro PC)
    host: true,
    port: 5173,

    proxy: {
      // Todas las llamadas a /api las reenvía al backend
      // Sin importar la red ni la IP: siempre es localhost → localhost
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
