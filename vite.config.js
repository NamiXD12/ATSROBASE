import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/ASTROBASE/',   // GitHub Pages base path — repo name with trailing slash
  server: {
    port:       5173,   // always use this port for local dev
    strictPort: true,   // fail loudly instead of silently bumping to 5174, 5175…
  },
})
