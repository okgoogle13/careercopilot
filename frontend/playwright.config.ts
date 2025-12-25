import { defineConfig, devices } from '@playwright/test';

const isCI = !!process.env.CI;
const baseURL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3001';

export default defineConfig({
  // Only look in the tests directory
  testDir: './tests',

  // Only match .spec.js files
  testMatch: '**/*.spec.{js,ts}',

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

  // Per-test timeout
  timeout: 120000,
  // Global timeout for the entire playwright run
  globalTimeout: 600000,
  retries: process.env.CI ? 1 : 0,

  // Run tests in parallel
  fullyParallel: false,
  workers: 1,

  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    // Lower timeouts to surface issues faster in CI
    navigationTimeout: 15000,
    actionTimeout: 10000,
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

  // When running in CI, services are started via docker-compose. Avoid starting a Vite preview server to prevent port conflicts.
  webServer: isCI
    ? undefined
    : {
      command: 'npm run preview',
      port: 3001,
      reuseExistingServer: !isCI,
      timeout: 120000,
      stdout: 'pipe',
      stderr: 'pipe',
    },

  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['json', { outputFile: 'test-results/results.json' }],
  ],

  expect: {
    timeout: 10000,
  },
});
