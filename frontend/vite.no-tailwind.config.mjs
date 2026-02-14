import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@careercopilot/ui': path.resolve(__dirname, './packages/ui/src'),
    },
  },
  build: {
    minify: false,
    sourcemap: false,
    rollupOptions: {
      onwarn(warning, warn) {
        if (warning.code === 'MODULE_LEVEL_DIRECTIVE') return;
        warn(warning);
      },
      output: { manualChunks: undefined },
    },
  },
  clearScreen: false,
  logLevel: 'info',
});
