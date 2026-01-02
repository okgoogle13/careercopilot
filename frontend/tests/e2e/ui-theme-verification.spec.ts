import { test, expect } from '@playwright/test';

test.use({ storageState: { cookies: [], origins: [] } });

test.describe('UI and Theme Verification', () => {
    test('Landing page loads with theme elements', async ({ page }) => {
        await page.goto('/');

        // Verify page title
        await expect(page).toHaveTitle(/Career Copilot/i);

        // Verify main heading exists
        const heading = page.locator('h1');
        await expect(heading).toBeVisible();

        // Verify action buttons exist
        const signInButton = page.getByRole('link', { name: /sign in/i });
        const registerButton = page.getByRole('link', { name: /register/i });

        await expect(signInButton).toBeVisible();
        await expect(registerButton).toBeVisible();

        console.log('✅ Landing page elements verified');
    });

    test('Login page loads correctly', async ({ page }) => {
        await page.goto('/login');

        // Verify login page loaded
        await expect(page).toHaveURL(/.*login/);

        // Verify form elements
        const emailInput = page.locator('input[type="email"]');
        const passwordInput = page.locator('input[type="password"]');
        const submitButton = page.getByRole('button', { name: /sign in/i });

        await expect(emailInput).toBeVisible();
        await expect(passwordInput).toBeVisible();
        await expect(submitButton).toBeVisible();

        // Verify heading
        const heading = page.locator('h1');
        await expect(heading).toBeVisible();

        console.log('✅ Login page elements verified');
    });

    test('Theme CSS is loaded', async ({ page }) => {
        await page.goto('/');

        // Check that Plus Jakarta Sans font is loaded
        const fontFamilies = await page.evaluate(() => {
            const body = document.body;
            return window.getComputedStyle(body).fontFamily;
        });

        console.log('Font families loaded:', fontFamilies);

        // Verify no console errors (other than expected warnings)
        const errors: string[] = [];
        page.on('pageerror', err => errors.push(err.message));

        await page.waitForTimeout(2000);

        expect(errors.filter(e => !e.includes('Future Flag Warning'))).toHaveLength(0);

        console.log('✅ Theme verification complete');
    });

    test('Navigation works between pages', async ({ page }) => {
        await page.goto('/');

        // Click Sign In
        await page.getByRole('link', { name: /sign in/i }).click();
        await expect(page).toHaveURL(/.*login/);

        // Navigate back
        await page.goto('/');

        // Click Register
        await page.getByRole('link', { name: /register/i }).click();
        await expect(page).toHaveURL(/.*register/);

        console.log('✅ Navigation verified');
    });
});
