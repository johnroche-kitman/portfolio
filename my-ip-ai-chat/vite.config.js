import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'url'

export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: command === 'build' ? '/portfolio/my-ip-chat/' : '/',
  build: {
    outDir: fileURLToPath(new URL('../my-ip-chat', import.meta.url)),
    emptyOutDir: true,
  },
}))
