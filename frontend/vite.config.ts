import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isAnalyze = mode === 'analyze'
  
  return {
    plugins: [react()],
    root: '.',
    configFile: false,
    server: {
      fs: {
        strict: true
      },
      proxy: {
        '/api': {
          target: 'http://localhost:8000',
          changeOrigin: true,
          secure: false
        }
      }
    },
    build: {
      // Generate source maps for analyze mode
      sourcemap: isAnalyze,
      // Optimize chunks
      rollupOptions: {
        output: {
          manualChunks: {
            // Separate Firebase into its own chunk
            firebase: ['firebase/app', 'firebase/auth', 'firebase/firestore'],
            // Separate React Router into its own chunk
            router: ['react-router-dom'],
            // Separate React Hot Toast into its own chunk
            toast: ['react-hot-toast']
          }
        }
      },
      // Enable gzip compression in production (but not in analyze mode)
      minify: isAnalyze ? false : 'terser',
      terserOptions: isAnalyze ? {} : {
        compress: {
          drop_console: true,
          drop_debugger: true
        }
      }
    },
    // Asset optimization
    assetsInclude: ['**/*.svg', '**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.gif', '**/*.webp'],
    // Enable CSS code splitting
    css: {
      devSourcemap: isAnalyze
    }
  }
})
