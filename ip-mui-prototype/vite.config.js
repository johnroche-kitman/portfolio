import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Served from https://johnroche-kitman.github.io/portfolio/ip-prototype/
export default defineConfig({
  plugins: [react()],
  base: '/portfolio/ip-prototype/',
})
