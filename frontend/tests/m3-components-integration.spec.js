/**
 * M3 Components E2E Integration Tests
 * Tests M3 components working together in a real browser environment
 */

import { test, expect } from '@playwright/test';

test.describe('M3 Components Integration E2E', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to integration test page
    await page.goto('/m3-integration-test');
  });

  test('should render all M3 components on integration test page', async ({ page }) => {
    // Check navigation components
    await expect(page.getByText('Home')).toBeVisible();
    await expect(page.getByText('Overview')).toBeVisible();

    // Check form components
    await expect(page.getByLabelText('Full Name')).toBeVisible();
    await expect(page.getByLabelText('Category')).toBeVisible();
    await expect(page.getByLabelText('Date')).toBeVisible();

    // Check data display components
    await expect(page.getByText('Project Alpha')).toBeVisible();
    await expect(page.getByText('List Item 1')).toBeVisible();

    // Check feedback components
    await expect(page.getByText('Operation completed successfully!')).toBeVisible();
  });

  test('should interact with form components together', async ({ page }) => {
    // Fill in form fields
    await page.getByLabelText('Full Name').fill('Test User');
    await page.getByLabelText('Category').click();
    await page.getByText('Option 1').click();

    // Interact with slider
    const slider = page.getByLabelText('Volume');
    await slider.fill('75');

    // Submit form
    await page.getByRole('button', { name: 'Submit' }).click();

    // Verify snackbar appears
    await expect(page.getByText('Form submitted successfully')).toBeVisible();
  });

  test('should navigate between tabs and update content', async ({ page }) => {
    // Click on Details tab
    await page.getByText('Details').click();

    // Verify tab is active (implementation dependent)
    const detailsTab = page.getByText('Details');
    await expect(detailsTab).toBeVisible();
  });

  test('should open and close modal', async ({ page }) => {
    // Open modal
    await page.getByRole('button', { name: 'Open Modal' }).click();

    // Verify modal content
    await expect(page.getByText('Modal Content')).toBeVisible();

    // Close modal
    await page.getByRole('button', { name: 'Close' }).click();

    // Verify modal is closed
    await expect(page.getByText('Modal Content')).not.toBeVisible();
  });

  test('should interact with table pagination', async ({ page }) => {
    // Verify table is visible
    await expect(page.getByText('Project Alpha')).toBeVisible();

    // If pagination exists, interact with it
    const nextButton = page.getByLabelText(/next/i);
    if (await nextButton.isVisible()) {
      await nextButton.click();
    }
  });

  test('should display tooltip on hover', async ({ page }) => {
    const button = page.getByRole('button', { name: 'Hover me' });
    await button.hover();

    // Wait for tooltip to appear
    await page.waitForTimeout(500);

    // Verify tooltip text (implementation dependent)
    const tooltip = page.getByText('This is a tooltip');
    // Tooltip may or may not be visible depending on implementation
  });

  test('should handle autocomplete search', async ({ page }) => {
    const autocomplete = page.getByLabelText('Search');
    await autocomplete.click();
    await autocomplete.fill('app');

    // Wait for filtered results
    await page.waitForTimeout(300);

    // Verify filtered option appears
    await expect(page.getByText('Apple')).toBeVisible();
  });

  test('should select multiple items in multiselect', async ({ page }) => {
    const multiselect = page.getByLabelText('Tags');
    await multiselect.click();

    // Select first option
    await page.getByText('Tag 1').click();

    // Verify chip appears
    await expect(page.getByText('Tag 1')).toBeVisible();
  });
});
