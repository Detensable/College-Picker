import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/College-Picker/',
  server: {
    proxy: {
      '/api/collegescorecard': {
        target: 'https://api.data.gov',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/collegescorecard/, '/ed/collegescorecard/v1/schools'),
      },
    },
  },
})
