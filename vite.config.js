import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: process.env.VERCEL === '1' ? '/' : '/ATSROBASE/',
  server: {
    port:       5173,   // always use this port for local dev
    strictPort: true,   // fail loudly instead of silently bumping to 5174, 5175…
  },
})
