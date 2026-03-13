import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@spec': resolve(__dirname, '../../spec'),
    },
  },
  test: {
    environment: 'happy-dom',
    globals: true,
  },
})
