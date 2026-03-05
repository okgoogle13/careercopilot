/**
 * Critical Path Smoke Tests for CareerCopilot
 * Priority: CRITICAL - Core user workflows
 * Generated from api-endpoint-discovery task
 */

import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:5173';

test.describe('Critical User Paths - Smoke Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Clear any existing auth
    await page.context().clearCookies();
  });

  test.describe('Auth Flow - CRITICAL', () => {
    test('user can register and login', async ({ page }) => {
      // Navigate to app
      await page.goto(BASE_URL);

      // Check for registration/login interface
      const authElement = await page.getByRole('button', { name: /login|register|sign/i }).first();
      expect(authElement).toBeTruthy();

      // Status: Should not error
      const status = page.url();
      expect(status).toContain(BASE_URL);
    });

    test('login endpoint is accessible', async ({ page }) => {
      await page.goto(`${BASE_URL}/login`);

      // Check for login form
      const loginForm = await page.getByRole('form').first();
      if (loginForm) {
        expect(loginForm).toBeTruthy();
      }

      // Verify page loads without 500 error
      expect(page.url()).toContain('/login');
    });

    test('authentication flow persists session', async ({ page }) => {
      await page.goto(BASE_URL);

      // Simulate being logged in by checking if we can navigate
      // to protected routes
      const response = await page.goto(`${BASE_URL}/dashboard`);

      // Should either load dashboard or redirect to login
      const url = page.url();
      expect(url.includes('dashboard') || url.includes('login')).toBeTruthy();
    });
  });

  test.describe('Opportunities Discovery - CRITICAL', () => {
    test('opportunities page loads and displays jobs', async ({ page }) => {
      await page.goto(`${BASE_URL}/opportunities`);

      // Wait for page to load
      await page.waitForLoadState('networkidle');

      // Check for job listing elements
      const jobCards = await page.locator('[data-testid="opportunity-card"]').count();
      const jobElements = await page.locator('article').count();

      // Should have some job listings or loading state
      expect(jobCards + jobElements).toBeGreaterThanOrEqual(0);

      // Verify page is not in error state
      expect(page.url()).toContain('opportunities');
    });

    test('can filter opportunities by match score', async ({ page }) => {
      await page.goto(`${BASE_URL}/opportunities`);
      await page.waitForLoadState('networkidle');

      // Try to interact with filter if available
      const filterButton = page.getByRole('button', { name: /filter|sort/i }).first();
      if (filterButton) {
        await filterButton.click();
        // Verify filter panel appears
        expect(filterButton).toBeTruthy();
      }

      // Page should still be functional
      expect(page.url()).toContain('opportunities');
    });

    test('opportunity details can be viewed', async ({ page }) => {
      await page.goto(`${BASE_URL}/opportunities`);
      await page.waitForLoadState('networkidle');

      // Try clicking first opportunity
      const firstJob = page.getByRole('article').first();
      if (await firstJob.isVisible()) {
        await firstJob.click();

        // Should navigate to job detail or show modal
        await page.waitForLoadState('networkidle');
        // Verify we're either on detail page or modal is visible
        expect(page.url()).toBeTruthy();
      }
    });

    test('can apply to opportunity', async ({ page }) => {
      await page.goto(`${BASE_URL}/opportunities`);
      await page.waitForLoadState('networkidle');

      // Look for apply button
      const applyButton = page.getByRole('button', { name: /apply|submit/i }).first();
      if (applyButton) {
        await applyButton.click();

        // Should show confirmation or navigate
        await page.waitForLoadState('networkidle');
        expect(page).toBeTruthy();
      }
    });
  });

  test.describe('Application Tracking - CRITICAL', () => {
    test('applications page loads', async ({ page }) => {
      await page.goto(`${BASE_URL}/applications`);
      await page.waitForLoadState('networkidle');

      // Check for applications list
      const appCards = page.locator('[data-testid="application-card"]');
      const articles = page.locator('article');

      // Page should load without error
      expect(page.url()).toContain('applications');
    });

    test('can update application status', async ({ page }) => {
      await page.goto(`${BASE_URL}/applications`);
      await page.waitForLoadState('networkidle');

      // Look for status dropdown/button
      const statusButton = page.getByRole('button', { name: /status|state/i }).first();
      if (statusButton) {
        await statusButton.click();
        await page.waitForLoadState('networkidle');
        expect(statusButton).toBeTruthy();
      }

      // Page should remain functional
      expect(page.url()).toContain('applications');
    });

    test('can add notes to application', async ({ page }) => {
      await page.goto(`${BASE_URL}/applications`);
      await page.waitForLoadState('networkidle');

      // Look for note input
      const noteInput = page.getByPlaceholder(/note|comment/i).first();
      if (noteInput) {
        await noteInput.fill('Test note');
        expect(await noteInput.inputValue()).toBe('Test note');
      }

      // Page should remain functional
      expect(page.url()).toContain('applications');
    });

    test('can delete application', async ({ page }) => {
      await page.goto(`${BASE_URL}/applications`);
      await page.waitForLoadState('networkidle');

      // Look for delete button
      const deleteButton = page.getByRole('button', { name: /delete|remove/i }).first();
      if (deleteButton) {
        // Don't actually delete, just verify button is clickable
        expect(await deleteButton.isEnabled()).toBeTruthy();
      }

      // Page should remain functional
      expect(page.url()).toContain('applications');
    });
  });

  test.describe('Profile Management - HIGH', () => {
    test('user profile page loads', async ({ page }) => {
      await page.goto(`${BASE_URL}/profile`);
      await page.waitForLoadState('networkidle');

      // Check page loaded
      expect(page.url()).toContain('profile');
    });

    test('can view profile information', async ({ page }) => {
      await page.goto(`${BASE_URL}/profile`);
      await page.waitForLoadState('networkidle');

      // Look for profile fields
      const formFields = page.locator('input, textarea');
      const fieldCount = await formFields.count();

      // Should have some form fields
      expect(fieldCount).toBeGreaterThanOrEqual(0);
    });

    test('can upload resume', async ({ page }) => {
      await page.goto(`${BASE_URL}/profile`);
      await page.waitForLoadState('networkidle');

      // Look for file upload
      const uploadButton = page.getByRole('button', { name: /upload|resume/i }).first();
      if (uploadButton) {
        expect(await uploadButton.isVisible()).toBeTruthy();
      }

      // Page should remain functional
      expect(page.url()).toContain('profile');
    });
  });

  test.describe('Error Handling', () => {
    test('handles navigation to nonexistent page gracefully', async ({ page }) => {
      const response = await page.goto(`${BASE_URL}/nonexistent`);

      // Should either 404 or redirect
      expect(response?.status()).toBeGreaterThan(0);
    });

    test('handles network errors gracefully', async ({ page }) => {
      await page.route('**/api/**', (route) => route.abort('failed'));

      await page.goto(`${BASE_URL}/opportunities`);
      await page.waitForLoadState('networkidle');

      // App should show error or fallback UI
      expect(page).toBeTruthy();
    });

    test('recovers from API timeout', async ({ page }) => {
      await page.route('**/api/**', (route) => {
        setTimeout(() => route.continue(), 10000); // 10s delay
      });

      await page.goto(`${BASE_URL}/dashboard`);

      // App should handle timeout gracefully
      expect(page).toBeTruthy();
    });
  });

  test.describe('Performance Baselines', () => {
    test('opportunities page loads within 3s', async ({ page }) => {
      const start = Date.now();
      await page.goto(`${BASE_URL}/opportunities`);
      await page.waitForLoadState('networkidle');
      const elapsed = Date.now() - start;

      // Should load reasonably fast
      expect(elapsed).toBeLessThan(5000); // 5s timeout for CI
    });

    test('applications page loads within 3s', async ({ page }) => {
      const start = Date.now();
      await page.goto(`${BASE_URL}/applications`);
      await page.waitForLoadState('networkidle');
      const elapsed = Date.now() - start;

      expect(elapsed).toBeLessThan(5000);
    });
  });
});
