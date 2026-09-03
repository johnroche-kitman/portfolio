import fs from 'node:fs'
import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const CLIPS_DIR = path.resolve(import.meta.dirname, '../clips')
const TYPES = {
  '.mp4': 'video/mp4', '.webm': 'video/webm', '.m4v': 'video/mp4',
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png',
}

/**
 * Dev only. The clips live once at the repo root and are published from the
 * site root, so they belong to neither app's public folder — a symlink there
 * would get copied into dist and ship the whole library twice. This serves them
 * at /clips/ while developing, with byte ranges so the player can seek.
 */
const sharedClips = () => ({
  name: 'shared-clips',
  apply: 'serve',
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      if (!req.url?.startsWith('/clips/')) return next()
      const rel = decodeURIComponent(req.url.split('?')[0].slice('/clips/'.length))
      const file = path.join(CLIPS_DIR, rel)
      // path.join collapses "..", so this also rejects anything outside the folder.
      if (!file.startsWith(CLIPS_DIR + path.sep) || !fs.existsSync(file) || !fs.statSync(file).isFile()) {
        res.statusCode = 404
        return res.end('Not found')
      }
      const { size } = fs.statSync(file)
      res.setHeader('Content-Type', TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream')
      res.setHeader('Accept-Ranges', 'bytes')
      const range = req.headers.range
      if (range) {
        const [from, to] = range.replace('bytes=', '').split('-')
        const start = Number(from) || 0
        const end = to ? Number(to) : size - 1
        res.statusCode = 206
        res.setHeader('Content-Range', `bytes ${start}-${end}/${size}`)
        res.setHeader('Content-Length', end - start + 1)
        return fs.createReadStream(file, { start, end }).pipe(res)
      }
      res.setHeader('Content-Length', size)
      return fs.createReadStream(file).pipe(res)
    })
  },
})

// Served from https://johnroche-kitman.github.io/portfolio/sessions-video/
export default defineConfig({
  plugins: [react(), sharedClips()],
  base: '/portfolio/sessions-video/',
  server: { port: 5220 },
})
