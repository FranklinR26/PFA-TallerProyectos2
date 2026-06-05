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
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },

  build: {
    // Code splitting manual: separa vendors pesados en chunks independientes
    // → el navegador cachea vendors por separado, solo recarga el chunk de app
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) return 'vendor-react';
          if (id.includes('@dnd-kit'))  return 'vendor-dnd';
          if (id.includes('jspdf'))     return 'vendor-pdf';
          if (id.includes('zustand'))   return 'vendor-zustand';
        },
      },
    },
    // Reporta advertencia si un chunk supera 500 kB
    chunkSizeWarningLimit: 500,
  },
})
