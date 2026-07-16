import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'url'

export default defineConfig({
  plugins: [react()],
  base: '/portfolio/nfl-medical/',
  build: {
    outDir: fileURLToPath(new URL('../nfl-medical', import.meta.url)),
    emptyOutDir: true,
  },
})
