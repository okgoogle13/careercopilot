import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  root: '.',
  configFile: false,
  server: {
    fs: {
      strict: true
    }
  }
})
