import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    }
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.ts'],
    // Add specific coverage and other test options here
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'src/setupTests.ts']
    },
    // Ensure DOM APIs are available and properly mocked
    environmentOptions: {
      jsdom: {
        resources: 'usable',
      },
    },
    deps: {
      inline: [
        '@testing-library/react',
        'vitest-dom',
      ],
    },
  },
});
