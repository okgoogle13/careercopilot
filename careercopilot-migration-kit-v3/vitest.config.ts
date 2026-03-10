import { defineConfig } from 'vitest/config';
import path from 'node:path';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'apps/web/src'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['apps/web/src/tests/setup.ts'],
    include: ['apps/web/src/tests/**/*.spec.ts?(x)'],
  },
});
