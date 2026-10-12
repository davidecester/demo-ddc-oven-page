import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Cloudflare Pages serves from the domain root. Set BASE_PATH (e.g. /<repo>/)
// only when hosting under a sub-path such as GitHub Pages.
const base = process.env.BASE_PATH ?? '/'

export default defineConfig({
  base,
  plugins: [react(), tailwindcss()],
  build: {
    // Recharts (+ its d3 deps) is ~170 kB gzipped; acceptable for a prototype
    chunkSizeWarningLimit: 700,
    rolldownOptions: {
      output: {
        // Keep React and Recharts in their own cacheable chunk
        codeSplitting: {
          groups: [{ name: 'vendor', test: /node_modules/ }],
        },
      },
    },
  },
})
