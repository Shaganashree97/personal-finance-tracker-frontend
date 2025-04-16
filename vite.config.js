import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import rollupNodePolyFill from 'rollup-plugin-node-polyfills'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      plugins: [rollupNodePolyFill()]
    }
  },
  resolve: {
    alias: {
      crypto: 'rollup-plugin-node-polyfills/polyfills/crypto-browserify',
      stream: 'rollup-plugin-node-polyfills/polyfills/stream',
    }
  },
  define: {
    'process.env': {}
  }
})
