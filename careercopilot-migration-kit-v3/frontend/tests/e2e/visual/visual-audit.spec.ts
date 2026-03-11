/**
 * Visual evidence capture for careercopilot-migration-kit-v3 migration audit.
 *
 * Purpose:
 *   Automate screenshot acquisition for migrated routes that require
 *   runtime flag overrides to render the screen implementation:
 *   /login, /register, /dashboard, /profile, /onboarding, /welcome
 *
 * Output directory (benchmark evidence path):
 *   frontend/docs/design/generated/previews/<run-timestamp>/
 *
 * Referenced by:
 *   careercopilot-migration-kit-v3/docs/migration/AUDIT_ORCHESTRATOR.md
 *   careercopilot-migration-kit-v3/docs/design-system/benchmarks/auth-benchmark-v1/benchmark.json
 *   careercopilot-migration-kit-v3/docs/design-system/benchmarks/dashboard-benchmark-v1/benchmark.json
 */

import { test, expect, Page } from '@playwright/test';
import path from 'path';
import fs from 'fs';

const RUN_TIMESTAMP = new Date()
  .toISOString()
  .replace(/[:.]/g, '-')
  .replace('T', '_')
  .replace('Z', '');

const PREVIEW_BASE = path.resolve(
  __dirname,
  '../../../docs/design/generated/previews',
);

function screenshotPath(name: string): string {
  return path.join(PREVIEW_BASE, `run-${RUN_TIMESTAMP}`, `${name}.png`);
}

async function captureEvidence(page: Page, name: string) {
  const outPath = screenshotPath(name);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  await page.screenshot({ path: outPath, fullPage: true });
  return outPath;
}

function routeWithFlags(route: string, ...flags: string[]) {
  if (flags.length === 0) {
    return route;
  }

  return `${route}?ff=${flags.join(',')}`;
}

// ──────────────────────────────────────────────────────────────────────────────
// /login  [benchmark: auth-benchmark-v1]
// ──────────────────────────────────────────────────────────────────────────────
test.describe('/login – auth-benchmark-v1 evidence', () => {
  test('captures default state screenshot', async ({ page }) => {
    await page.goto(routeWithFlags('/login', 'login'));
    await expect(page.getByTestId('login-screen')).toBeVisible();
    const out = await captureEvidence(page, 'login');
    console.log(`📸 login default → ${out}`);
  });

  test('captures validation error state screenshot', async ({ page }) => {
    await page.goto(routeWithFlags('/login', 'login'));
    // Trigger the validation error by submitting empty
    await page.getByRole('button', { name: /Login/i }).click();
    await expect(page.getByRole('status')).toContainText(
      'Add your email and password',
    );
    const out = await captureEvidence(page, 'login-error');
    console.log(`📸 login error → ${out}`);
  });

  test('captures filled/active state screenshot', async ({ page }) => {
    await page.goto(routeWithFlags('/login', 'login'));
    await page.getByLabel('Email').fill('solidarity@collective.app');
    await page.getByLabel('Password').fill('correct-horse-battery-staple');
    const out = await captureEvidence(page, 'login-filled');
    console.log(`📸 login filled → ${out}`);
  });
});

// ──────────────────────────────────────────────────────────────────────────────
// /register  [benchmark: auth-benchmark-v1]
// ──────────────────────────────────────────────────────────────────────────────
test.describe('/register – auth-benchmark-v1 evidence', () => {
  test('captures default state screenshot', async ({ page }) => {
    await page.goto(routeWithFlags('/register', 'register'));
    await expect(page.getByTestId('register-screen')).toBeVisible();
    const out = await captureEvidence(page, 'register');
    console.log(`📸 register default → ${out}`);
  });

  test('captures validation error state screenshot', async ({ page }) => {
    await page.goto(routeWithFlags('/register', 'register'));
    await page.getByRole('button', { name: /Create Account/i }).click();
    await expect(page.getByRole('status')).toContainText(
      'Complete every field',
    );
    const out = await captureEvidence(page, 'register-error');
    console.log(`📸 register error → ${out}`);
  });

  test('captures filled/active state screenshot', async ({ page }) => {
    await page.goto(routeWithFlags('/register', 'register'));
    await page.getByLabel('Full Name').fill('Alex Solidarity');
    await page.getByLabel('Email').fill('solidarity@collective.app');
    await page.getByLabel('Password').fill('correct-horse-battery-staple');
    const out = await captureEvidence(page, 'register-filled');
    console.log(`📸 register filled → ${out}`);
  });
});

// ──────────────────────────────────────────────────────────────────────────────
// /dashboard  [benchmark: dashboard-benchmark-v1]
// ──────────────────────────────────────────────────────────────────────────────
test.describe('/dashboard – dashboard-benchmark-v1 evidence', () => {
  test('captures default state screenshot', async ({ page }) => {
    await page.goto(routeWithFlags('/dashboard', 'dashboard'));
    await expect(page.getByTestId('dashboard-screen')).toBeVisible();
    const out = await captureEvidence(page, 'dashboard');
    console.log(`📸 dashboard default → ${out}`);
  });

  test('captures "Review Active Roles" action state screenshot', async ({ page }) => {
    await page.goto(routeWithFlags('/dashboard', 'dashboard'));
    await page.getByRole('button', { name: /Review Active Roles/i }).click();
    await expect(page.getByRole('status')).toContainText('Active roles opened');
    const out = await captureEvidence(page, 'dashboard-active-roles');
    console.log(`📸 dashboard active-roles → ${out}`);
  });

  test('captures "Open Draft Queue" action state screenshot', async ({ page }) => {
    await page.goto(routeWithFlags('/dashboard', 'dashboard'));
    await page.getByRole('button', { name: /Open Draft Queue/i }).click();
    await expect(page.getByRole('status')).toContainText('Draft queue opened');
    const out = await captureEvidence(page, 'dashboard-draft-queue');
    console.log(`📸 dashboard draft-queue → ${out}`);
  });

  test('validates all dashboard metric cards are visible', async ({ page }) => {
    await page.goto(routeWithFlags('/dashboard', 'dashboard'));
    await expect(page.getByText('Applications In Motion')).toBeVisible();
    await expect(page.getByText('Drafts Ready To Push')).toBeVisible();
    await expect(page.getByText('Signals To Review')).toBeVisible();
  });
});

// ──────────────────────────────────────────────────────────────────────────────
// /profile  [benchmark: profile-benchmark-v1]
// ──────────────────────────────────────────────────────────────────────────────
test.describe('/profile – profile-benchmark-v1 evidence', () => {
  test('captures default state screenshot', async ({ page }) => {
    await page.goto(routeWithFlags('/profile', 'profile'));
    await expect(page.getByTestId('profile-screen')).toBeVisible();
    const out = await captureEvidence(page, 'profile');
    console.log(`📸 profile default → ${out}`);
  });

  test('captures validation error state screenshot', async ({ page }) => {
    await page.goto(routeWithFlags('/profile', 'profile'));
    await page.getByRole('button', { name: /Save Profile Foundation/i }).click();
    await expect(page.getByRole('status')).toContainText(
      'Add your role focus and community strengths before saving.',
    );
    const out = await captureEvidence(page, 'profile-error');
    console.log(`📸 profile error → ${out}`);
  });
});

// ──────────────────────────────────────────────────────────────────────────────
// /onboarding  [benchmark: onboarding-benchmark-v1]
// ──────────────────────────────────────────────────────────────────────────────
test.describe('/onboarding – onboarding-benchmark-v1 evidence', () => {
  test('captures default state screenshot', async ({ page }) => {
    await page.goto(routeWithFlags('/onboarding', 'onboarding'));
    await expect(page.getByTestId('onboarding-screen')).toBeVisible();
    const out = await captureEvidence(page, 'onboarding');
    console.log(`📸 onboarding default → ${out}`);
  });

  test('captures selected pathway state screenshot', async ({ page }) => {
    await page.goto(routeWithFlags('/onboarding', 'onboarding'));
    await page.getByRole('button', { name: /community services/i }).click();
    await expect(page.getByRole('status')).toContainText(
      'Pathway ready: Community Services. Open the welcome briefing when the route feels correct.',
    );
    const out = await captureEvidence(page, 'onboarding-selected');
    console.log(`📸 onboarding selected → ${out}`);
  });
});

// ──────────────────────────────────────────────────────────────────────────────
// /welcome  [benchmark: welcome-benchmark-v1]
// ──────────────────────────────────────────────────────────────────────────────
test.describe('/welcome – welcome-benchmark-v1 evidence', () => {
  test('captures default state screenshot', async ({ page }) => {
    await page.goto(routeWithFlags('/welcome', 'welcome'));
    await expect(page.getByTestId('welcome-screen')).toBeVisible();
    const out = await captureEvidence(page, 'welcome');
    console.log(`📸 welcome default → ${out}`);
  });

  test('captures action state screenshot', async ({ page }) => {
    await page.goto(routeWithFlags('/welcome', 'welcome'));
    await page.getByRole('button', { name: /start onboarding pass/i }).click();
    await expect(page.getByRole('status')).toContainText(
      'Welcome briefing cleared. Onboarding route is next.',
    );
    const out = await captureEvidence(page, 'welcome-action');
    console.log(`📸 welcome action → ${out}`);
  });
});

// ──────────────────────────────────────────────────────────────────────────────
// Benchmark evidence path report — printed after all captures
// ──────────────────────────────────────────────────────────────────────────────
test.afterAll(() => {
  const runDir = path.join(PREVIEW_BASE, `run-${RUN_TIMESTAMP}`);
  console.log('\n───────────────────────────────────────────────────────────────');
  console.log(`📂 Screenshot evidence captured to:`);
  console.log(`   ${runDir}`);
  console.log(`\n   Update benchmark.json screenshots[] with the run directory:`);
  console.log(`   frontend/docs/design/generated/previews/run-${RUN_TIMESTAMP}/`);
  console.log('───────────────────────────────────────────────────────────────\n');
});
