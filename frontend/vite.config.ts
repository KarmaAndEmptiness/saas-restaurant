import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  server: {
    headers: {
      'Service-Worker-Allowed': '/'
    },
    allowedHosts: ['localhost', '127.0.0.1', '0.0.0.0', 'homeless.run.place'],
    proxy: {
      '/api': {
        target: 'http://localhost:8080/api',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  base: '/',
  preview: {
    allowedHosts: ['localhost', '127.0.0.1', '0.0.0.0', 'homeless.run.place'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  }
}) 