/**
 * End-to-End (E2E) Test for KSC Generation Workflow
 *
 * This test implements a "happy path" user journey for the Key Selection Criteria
 * generation workflow using Playwright. It covers the complete user interaction
 * from navigation to result verification.
 */

const { test, expect } = require('@playwright/test');

test.describe('KSC Generation Workflow', () => {
  test.beforeEach(async ({ page }) => {
    // Set up any necessary authentication or initial state
    // For now, we'll assume no authentication is required
  });

  test('happy path - complete KSC generation workflow', async ({ page }) => {
    // Step 1: Navigate to the KSC Generator page
    await page.goto('/ksc-generator');

    // Verify we're on the correct page
    await expect(page).toHaveTitle(/.*KSC.*|.*Key Selection Criteria.*/i);

    // Step 2: Verify the main heading is present
    const mainHeading = page.locator('h1').filter({ hasText: /Key Selection Criteria Generator/i });
    await expect(mainHeading).toBeVisible();

    // Step 3: Locate the job description textarea
    const jobDescriptionTextarea = page.locator('textarea').first();
    await expect(jobDescriptionTextarea).toBeVisible();
    await expect(jobDescriptionTextarea).toBeEditable();

    // Step 4: Fill in the job description textarea with sample content
    const sampleJobDescription = `
Senior Software Engineer - Full Stack Development

We are seeking a Senior Software Engineer to join our dynamic development team.

Key Requirements:
• 5+ years of full-stack development experience
• Proficiency in React, Node.js, and Python
• Experience with cloud platforms (AWS/Azure)
• Strong problem-solving and analytical skills
• Leadership experience and mentoring abilities
• Excellent communication and collaboration skills
• Database design and optimization experience
• Agile/Scrum methodology experience

Responsibilities:
• Lead development of scalable web applications
• Mentor junior developers and conduct code reviews
• Collaborate with product managers and designers
• Implement best practices and architectural decisions
• Participate in technical planning and strategy sessions

What we offer:
• Competitive salary and benefits
• Professional development opportunities
• Flexible work arrangements
• Collaborative and innovative work environment
    `;

    await jobDescriptionTextarea.fill(sampleJobDescription);

    // Verify the text was entered correctly
    await expect(jobDescriptionTextarea).toHaveValue(sampleJobDescription);

    // Step 5: Locate and click the Generate button
    const generateButton = page.locator('button').filter({
      hasText: /Generate|Analyze|Create KSC/i,
    });
    await expect(generateButton).toBeVisible();
    await expect(generateButton).toBeEnabled();

    // Click the generate button
    await generateButton.click();

    // Step 6: Wait for loading state and API response
    // First, verify the button shows loading state
    await expect(generateButton).toHaveText(/Generating|Processing|Loading/i);
    await expect(generateButton).toBeDisabled();

    // Wait for the API response (with reasonable timeout)
    // The API has a 2-second mock delay, so we wait up to 10 seconds
    await page.waitForTimeout(500); // Brief pause to see loading state

    // Step 7: Wait for and verify the generated KSC content appears
    // Look for generated KSC responses in the UI
    const kscResultsContainer = page
      .locator('[data-testid="ksc-results"], .ksc-results, .generated-responses')
      .first();

    // If no specific container is found, look for any content that appears after generation
    // This might be cards, list items, or text blocks containing the KSC responses
    await expect(async () => {
      const generatedContent = await page
        .locator('text=/Demonstrated|Applied|Managed|Led|Implemented|Achieved/i')
        .first();
      await expect(generatedContent).toBeVisible({ timeout: 8000 });
    }).toPass({ timeout: 10000 });

    // Step 8: Verify multiple KSC statements are generated
    // Look for multiple KSC statements (the mock returns 3)
    const kscStatements = page.locator('.ksc-response, .generated-statement, [data-testid*="ksc"]');

    // Alternative approach: look for any text that matches KSC patterns
    const kscPatterns = page.locator(
      'text=/Demonstrated.*|Applied.*|Implemented.*|Managed.*|Led.*/'
    );

    await expect(async () => {
      const statementCount = await kscPatterns.count();
      expect(statementCount).toBeGreaterThan(0);
    }).toPass({ timeout: 5000 });

    // Step 9: Verify the content quality of generated KSC statements
    // Check that generated statements contain relevant keywords from the job description
    const pageContent = await page.textContent('body');

    // Verify that some key terms from the job description appear in the generated content
    const keyTermsPresent = [
      /leadership|lead/i,
      /software|development/i,
      /experience|skilled/i,
      /team|collaboration/i,
    ];

    let termsFound = 0;
    for (const term of keyTermsPresent) {
      if (term.test(pageContent)) {
        termsFound++;
      }
    }

    expect(termsFound).toBeGreaterThan(0); // At least some relevant terms should be present

    // Step 10: Verify the Generate button is re-enabled after completion
    await expect(generateButton).toBeEnabled();
    await expect(generateButton).toHaveText(/Generate|Analyze|Create KSC/i);
  });

  test('KSC generation with minimal job description', async ({ page }) => {
    /**
     * Test KSC generation with a shorter, minimal job description
     * to ensure the workflow works with various input lengths.
     */

    await page.goto('/ksc-generator');

    const jobDescriptionTextarea = page.locator('textarea').first();
    await jobDescriptionTextarea.fill(
      'Python developer position requiring 3+ years experience and strong problem-solving skills.'
    );

    const generateButton = page.locator('button').filter({ hasText: /Generate/i });
    await generateButton.click();

    // Wait for generation to complete
    await expect(generateButton).toBeEnabled({ timeout: 10000 });

    // Verify some KSC content was generated
    const pageText = await page.textContent('body');
    expect(pageText).toMatch(/Demonstrated|Applied|Managed|Led|Implemented|Achieved/i);
  });

  test('error handling - empty job description', async ({ page }) => {
    /**
     * Test that the system handles empty or invalid input appropriately.
     */

    await page.goto('/ksc-generator');

    const generateButton = page.locator('button').filter({ hasText: /Generate/i });

    // Initially, the button should be disabled when no input is provided
    await expect(generateButton).toBeDisabled();

    // Try entering just whitespace
    const jobDescriptionTextarea = page.locator('textarea').first();
    await jobDescriptionTextarea.fill('   ');

    // Button should still be disabled or show validation message
    await expect(generateButton).toBeDisabled();
  });

  test('responsive design - mobile viewport', async ({ page }) => {
    /**
     * Test the KSC generation workflow on mobile viewport
     * to ensure responsive design works correctly.
     */

    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    await page.goto('/ksc-generator');

    // Verify elements are still accessible on mobile
    const mainHeading = page.locator('h1').filter({ hasText: /Key Selection Criteria/i });
    await expect(mainHeading).toBeVisible();

    const jobDescriptionTextarea = page.locator('textarea').first();
    await expect(jobDescriptionTextarea).toBeVisible();

    // Fill and generate on mobile
    await jobDescriptionTextarea.fill(
      'Mobile test: Software engineer position with React experience.'
    );

    const generateButton = page.locator('button').filter({ hasText: /Generate/i });
    await expect(generateButton).toBeVisible();
    await generateButton.click();

    // Verify generation works on mobile
    await expect(generateButton).toBeEnabled({ timeout: 10000 });
  });

  test('accessibility - keyboard navigation', async ({ page }) => {
    /**
     * Test keyboard navigation and accessibility features
     * for the KSC generation workflow.
     */

    await page.goto('/ksc-generator');

    // Navigate using keyboard
    await page.keyboard.press('Tab'); // Should focus on textarea

    const jobDescriptionTextarea = page.locator('textarea').first();
    await expect(jobDescriptionTextarea).toBeFocused();

    // Type using keyboard
    await page.keyboard.type('Software engineer with Python and React experience needed.');

    // Tab to the generate button
    await page.keyboard.press('Tab');

    const generateButton = page.locator('button').filter({ hasText: /Generate/i });
    await expect(generateButton).toBeFocused();

    // Press Enter to generate
    await page.keyboard.press('Enter');

    // Verify generation works via keyboard
    await expect(generateButton).toBeEnabled({ timeout: 10000 });
  });

  test('page reload persistence', async ({ page }) => {
    /**
     * Test that the page handles refresh/reload scenarios gracefully.
     */

    await page.goto('/ksc-generator');

    const jobDescriptionTextarea = page.locator('textarea').first();
    await jobDescriptionTextarea.fill('Test content for reload scenario.');

    // Reload the page
    await page.reload();

    // Verify page loads correctly after reload
    const mainHeading = page.locator('h1').filter({ hasText: /Key Selection Criteria/i });
    await expect(mainHeading).toBeVisible();

    const reloadedTextarea = page.locator('textarea').first();
    await expect(reloadedTextarea).toBeVisible();
    await expect(reloadedTextarea).toBeEditable();
  });
});
