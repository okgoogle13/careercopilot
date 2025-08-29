import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  testMatch: /.*\.spec\.js$/,
  timeout: 30000,
  retries: 0,
  reporter: [['list'], ['html', { outputFolder: 'test-results/e2e-report' }]],
});
