import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  server: {
    headers: {
      'Service-Worker-Allowed': '/'
    },
    allowedHosts: ['localhost', '127.0.0.1', '0.0.0.0', 'holaworld.ggff.net', 'haloworld.ggff.net'],
    proxy: {
      '/api': {
        target: 'http://localhost:8080/api',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  base: '/restaurant/',
  preview: {
    allowedHosts: ['localhost', '127.0.0.1', '0.0.0.0', 'holaworld.ggff.net', 'haloworld.ggff.net'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  }
}) 