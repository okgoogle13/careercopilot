import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    testTimeout: 10000,

    // Use single-threaded mode to avoid worker pool issues
    pool: 'forks',
    poolOptions: {
      forks: {
        singleFork: true,
        isolate: true,
      },
    },

    // Limit file operations to prevent EMFILE errors
    maxConcurrency: 1,
    fileParallelism: false,
    
    // Test coverage
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      reportsDirectory: './coverage',
      exclude: [
        '**/node_modules/**',
        '**/dist/**',
        '**/coverage/**',
        '**/__mocks__/**',
        '**/*.d.ts',
        '**/*.config.*',
        '**/test/**',
        '**/tests/**',
        '**/stories/**',
        '**/.storybook/**',
        '**/.next/**',
      ],
    },
    
    // Exclude patterns
    exclude: [
      '**/node_modules/**',
      '**/Figma UI Files/**',
      '**/dist/**',
      '**/cypress/**',
      '**/e2e/**',
      '**/playwright/**',
      '**/__mocks__/**',
      '**/tests/*.spec.{js,ts}',  // Playwright test files
      '**/*.spec.{js,ts}',  // All .spec files (Playwright convention)
      '**/example.test.js',  // Example files
      '**/simple.test.js',  // Simple test files
    ],
    
    // Environment setup
    environmentOptions: {
      jsdom: {
        url: 'http://localhost:3000',
      },
    },
  },
  
  // Resolve configuration
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  
  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      '@testing-library/react',
      '@testing-library/jest-dom',
      '@testing-library/user-event',
    ],
  },
});
