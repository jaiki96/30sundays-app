import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Force a clean full page reload on every file change instead of hot-module
// replacement. HMR was repeatedly wedging mid-edit (especially on root files),
// leaving the open tab stuck on stale/broken JS, which read as "not responsive".
// A full reload always boots a clean bundle, so the app can never get wedged.
const fullReloadOnChange = {
  name: 'force-full-reload',
  enforce: 'post',
  handleHotUpdate({ server }) {
    server.ws.send({ type: 'full-reload' })
    return []
  },
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), fullReloadOnChange],
  server: {
    // Listen on the port assigned by the harness (via PORT), falling back to
    // Vite's default when run manually.
    port: process.env.PORT ? Number(process.env.PORT) : undefined,
  },
})
