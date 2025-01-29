import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  // ... existing code ...
  server: {
    headers: {
      'Service-Worker-Allowed': '/'
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  }
}) 