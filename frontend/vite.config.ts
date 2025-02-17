import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  // ... existing code ...
  server: {
    headers: {
      'Service-Worker-Allowed': '/'
    },
  },
  preview: {
    allowedHosts: ['localhost', '127.0.0.1', '0.0.0.0', 'holaworld.ggff.net', 'haloworld.ggff.net'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  }
}) 