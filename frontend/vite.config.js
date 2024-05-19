import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api': 'https://pearlcrest.onrender.com',
    },
  },
  plugins: [react()],
  publicDir: 'public'
})
