import { defineConfig } from 'vite';
import path from 'path';

// Vite config for Chrome Extension scripts (background & content)
export default defineConfig({
  build: {
    outDir: 'dist-extension',
    emptyOutDir: true,
    lib: {
      entry: {
        background: path.resolve(__dirname, 'src/extension/background.ts'),
        content: path.resolve(__dirname, 'src/extension/content.ts'),
      },
      formats: ['es'], // ES modules are supported in modern Chrome extensions (MV3)
      fileName: (format, entryName) => `${entryName}.js`,
    },
    rollupOptions: {
      output: {
        // Ensure scripts are flat in the output directory
        entryFileNames: '[name].js',
        chunkFileNames: 'chunks/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
    minify: false, // Useful for debugging the spike
    sourcemap: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
