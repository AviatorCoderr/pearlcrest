import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api': 'https://pearlcrest1-o5me79i7v-kushagra-sahays-projects.vercel.app'
    }
  },
  plugins: [react()],
})
