import { defineConfig, devices } from '@playwright/test';
import path from 'path';
import process from 'process';

const isCI = !!process.env.CI;
const baseURL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000';

export default defineConfig({
  // Only look in the tests directory
  testDir: path.join(__dirname, 'tests'),

  // Only match .spec.js files
  // Your original '**/.*spec.js' is also fine if you have nested test folders.
  testMatch: '*.spec.js',

  // Explicitly ignore any files that end with .test.js/ts/tsx
  testIgnore: [
    '**/*.test.ts',
    '**/*.test.tsx',
    '**/*.test.js',
  ],

  // Per-test timeout (60 seconds)
  timeout: 60000,
  // Global timeout for the entire playwright run
  globalTimeout: 600000,
  retries: process.env.CI ? 1 : 0,

  // Run tests in parallel
  fullyParallel: true,
  // Use 50% of available CPUs in CI, default (all) locally
  workers: process.env.CI ? '50%' : undefined,

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
<<<<<<< HEAD
=======
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
        port: 3000,
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
>>>>>>> 5896e600 (chore(ci,e2e): fix CI workflow syntax, readiness checks; Playwright config timeouts; docker compose healthchecks; add E2E handover)
