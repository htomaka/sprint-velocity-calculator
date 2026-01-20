import { defineConfig } from 'vite'

export default defineConfig({
  root: '.',
  base: '/tools/velocity-calculator/',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: './src/index.html'
      }
    }
  },
  server: {
    port: 3000,
    open: true
  }
})
