import { defineConfig } from 'vite'

export default defineConfig({
  // ... existing code ...
  server: {
    headers: {
      'Service-Worker-Allowed': '/'
    }
  }
}) 