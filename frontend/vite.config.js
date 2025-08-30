// frontend/vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true, // if 5173 is busy, Vite will NOT switch to 5175
    host: 'localhost'
  }
})
