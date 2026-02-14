import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 5173,
    strictPort: true,
    open: true,
    cors: true,
    host: '0.0.0.0',
    hmr: {
      overlay: true,
    },
  },
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@careercopilot/ui': path.resolve(__dirname, './packages/ui/src'),
    },
  },
  build: {
    minify: 'esbuild',
    sourcemap: true,
    rollupOptions: {
      onwarn(warning, warn) {
        if (warning.code === 'MODULE_LEVEL_DIRECTIVE') {
          return;
        }
        warn(warning);
      },
      output: {
        manualChunks: undefined,
      },
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
  },
  preview: {
    port: 5173,
    strictPort: true,
    host: '0.0.0.0',
  },
  clearScreen: false,
  logLevel: 'info',
});
