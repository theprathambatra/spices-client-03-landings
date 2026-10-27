import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'node:path'

// PAGE=v3 limits the build to one variation so builders don't block each other
// kit-lab = gallery that proves every component in kit/ builds and renders (docs/playbook/COMPONENTS.md)
const pages = process.env.PAGE ? [process.env.PAGE] : ['v1', 'v2', 'v3', 'v4', 'v5', 'kit-lab']

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: process.env.BASE_PATH || "/",
  // 517x and 5180 are taken by the user's other client projects
  server: { port: 5300, strictPort: true },
  resolve: { alias: { '@shared': resolve(__dirname, 'shared'), '@kit': resolve(__dirname, 'kit') } },
  build: {
    rollupOptions: {
      input: {
        ...(process.env.PAGE ? {} : { main: resolve(__dirname, 'index.html'), variations: resolve(__dirname, 'variations/index.html') }),
        ...Object.fromEntries(pages.map((p) => [p, resolve(__dirname, p, 'index.html')])),
      },
    },
  },
})
