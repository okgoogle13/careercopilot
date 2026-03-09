import { test } from '@playwright/test';
import fs from 'fs';
import path from 'path';

/**
 * Headless Visual Audit Spec
 * Captures screenshots of key pages to verify design compliance.
 * Writes results to docs/design/generated/previews/run-YYYY-MM-DD_HH-mm-ss
 */

function getLocalRunId(): string {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `run-${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}_${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}`;
}

const PREVIEW_ROOT = path.resolve(process.cwd(), 'docs/design/generated/previews');

test.describe('Visual Audit (Headless)', () => {
  // Force a single worker for this spec so one run produces one timestamped folder.
  test.describe.configure({ mode: 'serial' });

  let runDir = '';

  test.beforeAll(() => {
    runDir = path.join(PREVIEW_ROOT, getLocalRunId());
    if (!fs.existsSync(runDir)) {
      fs.mkdirSync(runDir, { recursive: true });
    }
    console.log(`Visual audit output directory: ${runDir}`);
  });

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

      const screenshotPath = path.join(runDir, `${target.name}.png`);

      await page.screenshot({
        path: screenshotPath,
        fullPage: true,
      });

      console.log(`Saved screenshot to: ${screenshotPath}`);
    });
  }
});
