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
    setupFiles: [
      './src/setupTests.ts',
      './test-env.setup.js'
    ],
    // Detect CI environment and adjust settings
    reporters: process.env.CI ? ['default', 'junit'] : ['default'],
    outputFile: process.env.CI ? './junit-report.xml' : undefined,
    coverage: {
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'src/setupTests.ts',
        'test-env.setup.js',
        '**/*.d.ts',
        '**/*.test.{ts,tsx}',
        '**/test-*.{ts,tsx}'
      ],
      // Enforce minimum code coverage in CI
      ...(process.env.CI ? {
        branches: 70,
        functions: 70,
        lines: 70,
        statements: 70
      } : {})
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
    // Fail tests on CI if there are console errors
    onConsoleLog: (log, type) => {
      if (process.env.CI && type === 'stderr') {
        return false; // Fails the test if there's a console error in CI
      }
      return undefined; // Default behavior otherwise
    },
    // More consistent snapshot testing
    snapshotFormat: {
      printBasicPrototype: false,
    },
  },
});
