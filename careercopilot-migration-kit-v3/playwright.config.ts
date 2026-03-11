import { defineConfig, devices } from '@playwright/test';
import path from 'path';

/**
 * Playwright configuration for careercopilot-migration-kit-v3.
 * Captures visual evidence for migration audit evidence chain.
 * Screenshots land in: frontend/docs/design/generated/previews/
 *
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './frontend/tests/e2e',
  outputDir: './frontend/docs/design/generated/playwright-output',
  snapshotDir: './frontend/docs/design/generated/previews',

  /* Run in parallel by default */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 1 : 0,
  /* Use a single worker for screenshot stability */
  workers: 1,

  reporter: [
    ['html', { outputFolder: './frontend/docs/design/generated/playwright-report' }],
    ['json', { outputFile: './frontend/docs/design/generated/playwright-results.json' }],
    ['list'],
  ],

  use: {
    /* The dev server for the migration-kit web app */
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:5173',
    /* Keep screenshots of failures for evidence */
    screenshot: 'on',
    /* Record traces on first retry */
    trace: 'on-first-retry',
    /* Force light-off / dark mode: KR Solidarity is dark-only */
    colorScheme: 'dark',
    /* Viewport that matches benchmark capture conditions */
    viewport: { width: 1280, height: 800 },
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  /* Start the Vite dev server automatically if not CI */
  webServer: process.env.CI
    ? undefined
    : {
        command: 'yarn dev',
        cwd: path.resolve(__dirname, 'apps/web'),
        url: 'http://localhost:5173',
        reuseExistingServer: true,
        timeout: 30_000,
      },
});
