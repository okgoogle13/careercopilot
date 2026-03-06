import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

/**
 * Headless Visual Audit Spec
 * Captures screenshots of key pages to verify design compliance.
 * Writes results to docs/design/generated/previews/
 */

const PREVIEW_DIR = path.resolve(process.cwd(), 'docs/design/generated/previews');

// Ensure directory exists
if (!fs.existsSync(PREVIEW_DIR)) {
  fs.mkdirSync(PREVIEW_DIR, { recursive: true });
}

test.describe('Visual Audit (Headless)', () => {
  // Use baseURL from playwright.config.ts or env
  const baseURL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:5173';

  const TARGETS = [
    // Public Routes
    { name: 'landing-page', path: '/' },
    { name: 'login', path: '/login' },
    { name: 'register', path: '/register' },
    { name: 'design-sidekick', path: '/design-sidekick' },
    { name: 'not-found', path: '/404' },

    // Protected Routes (Demo Mode)
    { name: 'dashboard', path: '/dashboard?demo=true' },
    { name: 'onboarding', path: '/onboarding?demo=true' },
    { name: 'tracker', path: '/tracker?demo=true' },
    { name: 'documents', path: '/documents?demo=true' },
    { name: 'analysis', path: '/analysis?demo=true' },
    { name: 'opportunities', path: '/opportunities?demo=true' },
    { name: 'ksc-generator', path: '/ksc-generator?demo=true' },
    { name: 'cover-letter-generator', path: '/cover-letter-generator?demo=true' },
    { name: 'settings', path: '/settings?demo=true' },
    { name: 'profile', path: '/profile?demo=true' },
    { name: 'asset-library', path: '/asset-library?demo=true' },
    { name: 'ingestion', path: '/career/ingest?demo=true' },
    { name: 'job-queue', path: '/job-queue?demo=true' },
    { name: 'style-guide', path: '/style-guide?demo=true' },
    { name: 'test-tokens', path: '/test-tokens?demo=true' },
  ];

  for (const target of TARGETS) {
    test(`Capture ${target.name} visual snapshot`, async ({ page }) => {
      console.log(`Auditing headlessly: ${baseURL}${target.path}`);

      // Navigate to page
      await page.goto(`${baseURL}${target.path}`, { waitUntil: 'networkidle' });

      const title = await page.title();
      console.log(`Page title: ${title}`);

      const screenshotPath = path.join(PREVIEW_DIR, `${target.name}.png`);

      await page.screenshot({
        path: screenshotPath,
        fullPage: true,
      });

      console.log(`Saved screenshot to: ${screenshotPath}`);

      // Verification (optional status check)
      const status = await page.evaluate(() => document.readyState);
      expect(status).toBe('complete');
    });
  }
});
