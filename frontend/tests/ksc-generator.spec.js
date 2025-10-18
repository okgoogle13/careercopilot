const { test, expect } = require('@playwright/test');

test.describe('KSC Generator Page E2E Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Mock the API endpoint before navigating
    await page.route('/api/generate-ksc', async (route) => {
      const json = {
        kscResponses: [
          {
            criterion: 'Experience with Playwright.',
            response: 'This is an E2E mock response for the Playwright criterion.',
          },
        ],
      };
      await route.fulfill({ json });
    });

    await page.goto('/ksc-generator');
  });

  test('should allow a user to fill the form, generate, and see results', async ({ page }) => {
    // Wait for the main heading to be visible
    await expect(page.getByRole('heading', { name: 'KSC Generator' })).toBeVisible();

    const generateButton = page.getByRole('button', { name: 'Generate KSC Responses' });
    await expect(generateButton).toBeDisabled();

    // 1. Fill in the job description
    await page.getByLabel('Paste Job Description').fill('Test Job Description for Playwright.');

    // 2. Mock resume selection (assuming a button click loads the resume)
    // In a real test, this might involve file upload. Here we simplify.
    await page.getByLabel('Select Resume').selectOption({ label: 'My Main Resume.pdf' });

    // 3. Add a selection criterion
    await page.getByLabel('Enter a key selection criterion').fill('Experience with Playwright.');
    await page.getByRole('button', { name: 'Add Criterion' }).click();
    await expect(page.getByText('Experience with Playwright.')).toBeVisible();

    // 4. Check if the button is now enabled and click it
    await expect(generateButton).toBeEnabled();
    await generateButton.click();

    // 5. Assert that the results are displayed
    await expect(page.getByRole('heading', { name: 'Generated Responses' })).toBeVisible();
    await expect(page.getByText('This is an E2E mock response for the Playwright criterion.')).toBeVisible();
  });

  test('should show a validation error if a field is missing', async ({ page }) => {
    // Only fill one field
    await page.getByLabel('Paste Job Description').fill('Test Job Description.');

    // Try to add an empty criterion
    await page.getByRole('button', { name: 'Add Criterion' }).click();

    // Assert that no criterion was added and the generate button is still disabled
    await expect(page.locator('.criterion-list-item')).toHaveCount(0);
    await expect(page.getByRole('button', { name: 'Generate KSC Responses' })).toBeDisabled();
  });
});
