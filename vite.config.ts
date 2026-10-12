import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// GitHub Pages serves the site from /<repo-name>/. The deploy workflow sets
// BASE_PATH from the repository name, so renaming the repo needs no code change.
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
