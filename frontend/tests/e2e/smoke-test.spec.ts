import { test, expect } from '@playwright/test';

test.describe('Smoke Test', () => {
    test.use({ storageState: { cookies: [], origins: [] } });

    test('should load landing page and navigate to login', async ({ page }) => {
        // Verify landing page
        await page.goto('/');
        await expect(page).toHaveTitle(/Career Copilot/i);

        // Check for Sign In link and click it
        const signInLink = page.getByRole('link', { name: /sign in/i });
        await expect(signInLink).toBeVisible();
        await signInLink.click();

        // Verify login page loaded
        await expect(page).toHaveURL(/.*login/);
        // Check for Email label which should be stable
        await expect(page.getByText('Email', { exact: true })).toBeVisible();
    });

    // Since we are mocking auth in E2E or hitting dev server, we can verify basic interactions
    test('should show validation error on empty login', async ({ page }) => {
        await page.goto('/login');

        // Wait for inputs to be ready
        const emailInput = page.getByLabel(/email/i);
        await expect(emailInput).toBeVisible();

        const submitButton = page.getByRole('button', { name: /sign in/i });
        await expect(submitButton).toBeVisible();
        await submitButton.click();

        // Expect validation errors from react-hook-form
        // Use more permissive text matchers or look for role="alert"
        await expect(page.getByText(/please enter a valid email/i)).toBeVisible();
        await expect(page.getByText(/password is required/i)).toBeVisible();
    });
});
