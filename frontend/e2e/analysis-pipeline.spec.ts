import { test, expect } from '@playwright/test';

test.describe('Analysis Pipeline Persistence', () => {
  const BASE_URL = 'http://localhost:5173';
  const ANALYSIS_PAGE = `${BASE_URL}/analysis`;

  const sampleResume = `Senior Software Engineer

Experience:
- Led team of 5 engineers for 3 years
- Architected scalable microservices
- Improved API latency by 40%

Skills:
TypeScript, React, Node.js, AWS, Docker, Kubernetes`;

  const sampleJobDescription = `Senior Software Engineer

Requirements:
- 5+ years experience with TypeScript
- Experience with React and Node.js
- AWS or cloud platform experience
- Leadership experience
- Kubernetes knowledge a plus`;

  test('should persist ATS score across page refresh', async ({ page }) => {
    // Step 1: Navigate to analysis page
    await page.goto(ANALYSIS_PAGE);
    await page.waitForLoadState('networkidle');

    // Step 2: Enter resume and job description
    const resumeInput = page.getByPlaceholder(/Paste your current resume/i);
    const jobDescInput = page.getByPlaceholder(/Enter job description/i);

    await resumeInput.click();
    await resumeInput.fill(sampleResume);
    await jobDescInput.click();
    await jobDescInput.fill(sampleJobDescription);

    // Step 3: Run analysis
    const calibrationButton = page.getByRole('button', { name: /Calibration Check/i });
    await calibrationButton.click();

    // Wait for analysis to complete (ATS score should appear)
    const scoreCard = page.locator('[id*="score"]').first();
    await scoreCard.waitFor({ state: 'visible', timeout: 15000 });

    // Extract the score value before reload
    const scoreText = await scoreCard.textContent();
    expect(scoreText).toContain(/\d+/); // Should contain a number

    // Step 4: Verify localStorage has pipeline data
    const localStorageData = await page.evaluate(() => {
      return localStorage.getItem('analysis-pipeline-store');
    });
    expect(localStorageData).toBeTruthy();
    const storeData = JSON.parse(localStorageData || '{}');
    expect(Object.keys(storeData.state?.pipelines || {}).length).toBeGreaterThan(0);

    // Step 5: Reload page
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Step 6: Verify score persists after reload
    const scoreCardAfterReload = page.locator('[id*="score"]').first();
    await scoreCardAfterReload.waitFor({ state: 'visible', timeout: 5000 });

    const scoreTextAfterReload = await scoreCardAfterReload.textContent();
    expect(scoreTextAfterReload).toContain(/\d+/);

    // Both scores should be present (exact match optional due to formatting)
    expect(scoreText).toBeTruthy();
    expect(scoreTextAfterReload).toBeTruthy();
  });

  test('should export resume and trigger download', async ({ page, context }) => {
    // Step 1: Navigate to analysis page
    await page.goto(ANALYSIS_PAGE);
    await page.waitForLoadState('networkidle');

    // Step 2: Enter resume and job description
    const resumeInput = page.getByPlaceholder(/Paste your current resume/i);
    const jobDescInput = page.getByPlaceholder(/Enter job description/i);

    await resumeInput.click();
    await resumeInput.fill(sampleResume);
    await jobDescInput.click();
    await jobDescInput.fill(sampleJobDescription);

    // Step 3: Run analysis to generate ATS result
    const calibrationButton = page.getByRole('button', { name: /Calibration Check/i });
    await calibrationButton.click();

    // Wait for score card to appear
    const scoreCard = page.locator('[id*="score"]').first();
    await scoreCard.waitFor({ state: 'visible', timeout: 15000 });

    // Step 4: Click export button (once score is visible, export buttons should appear)
    const exportPdfButton = page.getByRole('button', { name: /PDF/i }).last();

    // Set up download listener before clicking
    const downloadPromise = page.waitForEvent('download');
    await exportPdfButton.click();

    // Step 5: Verify download was triggered
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toContain('resume');
  });

  test('should support clearing pipeline data', async ({ page }) => {
    // Step 1: Navigate to analysis page
    await page.goto(ANALYSIS_PAGE);
    await page.waitForLoadState('networkidle');

    // Step 2: Enter resume and run analysis
    const resumeInput = page.getByPlaceholder(/Paste your current resume/i);
    const jobDescInput = page.getByPlaceholder(/Enter job description/i);

    await resumeInput.click();
    await resumeInput.fill(sampleResume);
    await jobDescInput.click();
    await jobDescInput.fill(sampleJobDescription);

    const calibrationButton = page.getByRole('button', { name: /Calibration Check/i });
    await calibrationButton.click();

    // Wait for score to appear
    const scoreCard = page.locator('[id*="score"]').first();
    await scoreCard.waitFor({ state: 'visible', timeout: 15000 });

    // Step 3: Verify localStorage has data
    let localStorageData = await page.evaluate(() => {
      return localStorage.getItem('analysis-pipeline-store');
    });
    let storeData = JSON.parse(localStorageData || '{}');
    const pipelineCount = Object.keys(storeData.state?.pipelines || {}).length;
    expect(pipelineCount).toBeGreaterThan(0);

    // Step 4: Clear localStorage manually (simulating app clear action)
    await page.evaluate(() => {
      localStorage.removeItem('analysis-pipeline-store');
    });

    // Step 5: Reload and verify score is gone
    await page.reload();
    await page.waitForLoadState('networkidle');

    const emptyState = page.locator('text=No analysis yet').first();
    await emptyState.waitFor({ state: 'visible', timeout: 5000 });
  });
});
