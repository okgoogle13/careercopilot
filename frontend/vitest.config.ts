import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.ts'],
    // Add specific coverage and other test options here
    coverage: {
      reporter: ['text', 'json', 'html'],
    },
    // Ensure DOM APIs are available and properly mocked
    environmentOptions: {
      jsdom: {
        resources: 'usable',
      },
    },
  },
});
