import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    // Lets us write `import x from '@/lib/x'` instead of '../../../lib/x'
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
