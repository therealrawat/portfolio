import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
             if (id.includes('framer-motion')) return 'vendor-framer';
             if (id.includes('@google/genai')) return 'vendor-genai';
             return 'vendor';
          }
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
})
