import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
    dedupe: ['react', 'react-dom'],
  },
  optimizeDeps: {
    // Start's entries are virtual, so the dep scanner misses these. Discovering them at runtime
    // triggers a re-optimisation that can leave two copies of React in the page.
    include: ['react', 'react-dom', 'react-dom/client', 'react/jsx-runtime', 'motion/react', 'lenis', 'three', 'three/examples/jsm/environments/RoomEnvironment.js'],
  },
  plugins: [tailwindcss(), tanstackStart(), viteReact()],
})
