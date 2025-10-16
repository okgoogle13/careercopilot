import { defineConfig, devices } from '@playwright/test';
import path from 'path';

export default defineConfig({
  // Only look in the tests directory, nowhere else
  testDir: path.join(__dirname, 'tests'),

  // Only match .spec.js files
  testMatch: '**/*.spec.js',

  // Explicitly ignore everything outside tests directory
  testIgnore: [
    '**/node_modules/**',
    '**/src/**',
    '**/dist/**',
    '**/__tests__/**',
    '**/*.test.ts',
    '**/*.test.tsx',
    '**/*.test.js',
  ],

  timeout: 120000,
  retries: process.env.CI ? 1 : 0,

  // Run tests in parallel
  fullyParallel: false,
  workers: 1,

  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        // Use headless mode
        launchOptions: {
          args: ['--no-sandbox', '--disable-setuid-sandbox'],
        },
      },
    },
  ],

  webServer: {
    command: 'npm run preview',
    port: 3000,
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
    stdout: 'pipe',
    stderr: 'pipe',
  },

  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['json', { outputFile: 'test-results/results.json' }],
  ],
});
