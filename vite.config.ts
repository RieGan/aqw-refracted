import { resolve } from 'path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  root: resolve('src/renderer'),
  base: './',
  build: {
    outDir: resolve('out/renderer'),
    rollupOptions: {
      input: resolve('src/renderer/index.html'),
    },
  },
  resolve: {
    alias: {
      '@': resolve('src/renderer/src'),
    },
  },
  plugins: [react()],
  css: {
    postcss: resolve('postcss.config.js'),
  },
})
