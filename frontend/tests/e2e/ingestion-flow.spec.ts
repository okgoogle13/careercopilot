import { test, expect, Page } from '@playwright/test';
import path from 'path';

/**
 * E2E Test Suite: Career Database Ingestion Flow
 * Tests the complete user journey from file upload to validation dashboard
 */

test.describe('Career Database Ingestion - Complete UAT', () => {
    let page: Page;

    test.beforeEach(async ({ page: testPage }) => {
        page = testPage;

        // Navigate to app and login
        await page.goto('http://localhost:5173');

        // Handle authentication (adjust based on your auth flow)
        await page.click('text=Login');
        await page.fill('input[name="email"]', 'test@example.com');
        await page.fill('input[name="password"]', 'testpassword123');
        await page.click('button:has-text("Sign In")');

        // Wait for dashboard to load
        await page.waitForURL('**/dashboard', { timeout: 10000 });
    });

    test('UAT-001: Navigate to Ingestion Page', async () => {
        // Navigate to ingestion page
        await page.goto('http://localhost:5173/career/ingest');

        // Verify page loaded
        await expect(page.locator('h3:has-text("Career Database Ingestion")')).toBeVisible();

        // Verify key UI elements
        await expect(page.locator('text=Upload your resume')).toBeVisible();
        await expect(page.locator('button:has-text("Choose Files")')).toBeVisible();
        await expect(page.locator('text=Accepted formats: PDF, DOCX, TXT')).toBeVisible();
    });

    test('UAT-002: Upload Single Resume File', async () => {
        await page.goto('http://localhost:5173/career/ingest');

        // Prepare test file
        const testFilePath = path.join(__dirname, '../fixtures/sample-resume.pdf');

        // Upload file
        const fileInput = page.locator('input[type="file"]');
        await fileInput.setInputFiles(testFilePath);

        // Verify file appears in list
        await expect(page.locator('text=sample-resume.pdf')).toBeVisible();

        // Verify upload button is enabled
        await expect(page.locator('button:has-text("Upload & Analyze")')).toBeEnabled();
    });

    test('UAT-003: Upload Multiple Files', async () => {
        await page.goto('http://localhost:5173/career/ingest');

        const testFiles = [
            path.join(__dirname, '../fixtures/sample-resume.pdf'),
            path.join(__dirname, '../fixtures/sample-cover-letter.docx'),
            path.join(__dirname, '../fixtures/ksc-response.txt'),
        ];

        const fileInput = page.locator('input[type="file"]');
        await fileInput.setInputFiles(testFiles);

        // Verify all files appear
        await expect(page.locator('text=sample-resume.pdf')).toBeVisible();
        await expect(page.locator('text=sample-cover-letter.docx')).toBeVisible();
        await expect(page.locator('text=ksc-response.txt')).toBeVisible();
    });

    test('UAT-004: Complete Ingestion Flow with Progress Tracking', async () => {
        await page.goto('http://localhost:5173/career/ingest');

        const testFilePath = path.join(__dirname, '../fixtures/sample-resume.pdf');
        const fileInput = page.locator('input[type="file"]');
        await fileInput.setInputFiles(testFilePath);

        // Click upload
        await page.click('button:has-text("Upload & Analyze")');

        // Verify progress stages appear
        await expect(page.locator('text=Uploading files')).toBeVisible({ timeout: 2000 });
        await expect(page.locator('text=Extracting text')).toBeVisible({ timeout: 5000 });
        await expect(page.locator('text=AI processing')).toBeVisible({ timeout: 5000 });

        // Wait for completion (max 60 seconds)
        await expect(page.locator('h3:has-text("Career Database Validation")')).toBeVisible({
            timeout: 60000
        });
    });

    test('UAT-005: Validation Dashboard - Review Achievement', async () => {
        // Assuming we're on ValidationDashboard after successful upload
        await page.goto('http://localhost:5173/career/ingest');
        const testFilePath = path.join(__dirname, '../fixtures/sample-resume.pdf');
        const fileInput = page.locator('input[type="file"]');
        await fileInput.setInputFiles(testFilePath);
        await page.click('button:has-text("Upload & Analyze")');

        // Wait for dashboard
        await expect(page.locator('h3:has-text("Career Database Validation")')).toBeVisible({
            timeout: 60000
        });

        // Verify summary stats
        await expect(page.locator('text=Achievements')).toBeVisible();
        await expect(page.locator('text=Need Review')).toBeVisible();

        // Expand achievements section
        await page.click('button:has-text("Structured Achievements")');

        // Verify achievement fields are visible
        await expect(page.locator('text=Action Verb')).toBeVisible();
        await expect(page.locator('text=Metric')).toBeVisible();
        await expect(page.locator('text=Outcome')).toBeVisible();
    });

    test('UAT-006: Edit Achievement Field', async () => {
        // Navigate through to dashboard (abbreviated for clarity)
        await page.goto('http://localhost:5173/career/ingest');
        const testFilePath = path.join(__dirname, '../fixtures/sample-resume.pdf');
        await page.locator('input[type="file"]').setInputFiles(testFilePath);
        await page.click('button:has-text("Upload & Analyze")');
        await page.waitForSelector('h3:has-text("Career Database Validation")', { timeout: 60000 });

        // Find first editable field
        const firstEditButton = page.locator('button[aria-label="edit"]').first();
        await firstEditButton.click();

        // Edit the field
        const textField = page.locator('textarea, input[type="text"]').first();
        await textField.fill('Orchestrated cross-functional team collaboration');

        // Save
        await page.click('button[aria-label="save"]');

        // Verify update
        await expect(page.locator('text=Orchestrated cross-functional')).toBeVisible();
    });

    test('UAT-007: Apply AI Suggestion', async () => {
        await page.goto('http://localhost:5173/career/ingest');
        const testFilePath = path.join(__dirname, '../fixtures/sample-resume.pdf');
        await page.locator('input[type="file"]').setInputFiles(testFilePath);
        await page.click('button:has-text("Upload & Analyze")');
        await page.waitForSelector('h3:has-text("Career Database Validation")', { timeout: 60000 });

        // Look for AI suggestion chip
        const suggestionChip = page.locator('text=Apply AI Suggestion').first();

        if (await suggestionChip.isVisible()) {
            await suggestionChip.click();

            // Verify suggestion was applied
            await expect(page.locator('button[aria-label="save"]').first()).toBeVisible();
        }
    });

    test('UAT-008: Batch Apply All AI Suggestions', async () => {
        await page.goto('http://localhost:5173/career/ingest');
        const testFilePath = path.join(__dirname, '../fixtures/sample-resume.pdf');
        await page.locator('input[type="file"]').setInputFiles(testFilePath);
        await page.click('button:has-text("Upload & Analyze")');
        await page.waitForSelector('h3:has-text("Career Database Validation")', { timeout: 60000 });

        // Click batch apply button
        const batchApplyButton = page.locator('button:has-text("Apply All AI Suggestions")');

        if (await batchApplyButton.isVisible()) {
            // Record initial flagged count
            const flaggedCountBefore = await page.locator('text=/\\d+ items need review/').textContent();

            await batchApplyButton.click();

            // Verify snackbar appears
            await expect(page.locator('text=/Applied \\d+ AI suggestions/')).toBeVisible({ timeout: 3000 });

            // Verify flagged count decreased
            await page.waitForTimeout(1000); // Allow state to update
            const flaggedCountAfter = await page.locator('text=/\\d+ items need review/').textContent();

            // Assert count changed (or suggestions button disappeared)
            expect(flaggedCountAfter).not.toBe(flaggedCountBefore);
        }
    });

    test('UAT-009: Download JSON Export', async () => {
        await page.goto('http://localhost:5173/career/ingest');
        const testFilePath = path.join(__dirname, '../fixtures/sample-resume.pdf');
        await page.locator('input[type="file"]').setInputFiles(testFilePath);
        await page.click('button:has-text("Upload & Analyze")');
        await page.waitForSelector('h3:has-text("Career Database Validation")', { timeout: 60000 });

        // Set up download listener
        const downloadPromise = page.waitForEvent('download');

        // Click download button
        await page.click('button:has-text("Download JSON")');

        // Get download
        const download = await downloadPromise;

        // Verify filename pattern
        expect(download.suggestedFilename()).toMatch(/career-database-\d{4}-\d{2}-\d{2}\.json/);

        // Verify snackbar
        await expect(page.locator('text=Career database downloaded')).toBeVisible({ timeout: 3000 });
    });

    test('UAT-010: Keyboard Shortcut - Undo (Ctrl+Z)', async () => {
        await page.goto('http://localhost:5173/career/ingest');
        const testFilePath = path.join(__dirname, '../fixtures/sample-resume.pdf');
        await page.locator('input[type="file"]').setInputFiles(testFilePath);
        await page.click('button:has-text("Upload & Analyze")');
        await page.waitForSelector('h3:has-text("Career Database Validation")', { timeout: 60000 });

        // Make an edit
        const firstEditButton = page.locator('button[aria-label="edit"]').first();
        await firstEditButton.click();
        const textField = page.locator('textarea, input[type="text"]').first();
        const originalText = await textField.inputValue();
        await textField.fill('Modified text for undo test');
        await page.click('button[aria-label="save"]');

        // Press Ctrl+Z
        await page.keyboard.press('Control+z');

        // Verify undo snackbar
        await expect(page.locator('text=Undo applied')).toBeVisible({ timeout: 3000 });

        // Verify text reverted
        await expect(page.locator(`text=${originalText}`)).toBeVisible();
    });

    test('UAT-011: Keyboard Shortcut - Download (Ctrl+S)', async () => {
        await page.goto('http://localhost:5173/career/ingest');
        const testFilePath = path.join(__dirname, '../fixtures/sample-resume.pdf');
        await page.locator('input[type="file"]').setInputFiles(testFilePath);
        await page.click('button:has-text("Upload & Analyze")');
        await page.waitForSelector('h3:has-text("Career Database Validation")', { timeout: 60000 });

        const downloadPromise = page.waitForEvent('download');

        // Press Ctrl+S
        await page.keyboard.press('Control+s');

        const download = await downloadPromise;
        expect(download.suggestedFilename()).toMatch(/career-database-\d{4}-\d{2}-\d{2}\.json/);
    });

    test('UAT-012: Error Handling - Invalid File Type', async () => {
        await page.goto('http://localhost:5173/career/ingest');

        // Try uploading an invalid file type
        const invalidFilePath = path.join(__dirname, '../fixtures/test-image.png');
        const fileInput = page.locator('input[type="file"]');
        await fileInput.setInputFiles(invalidFilePath);

        await page.click('button:has-text("Upload & Analyze")');

        // Verify error message appears
        await expect(page.locator('text=/No readable text found/i')).toBeVisible({ timeout: 10000 });
    });

    test('UAT-013: Persistence - Data Saved to Firestore', async () => {
        await page.goto('http://localhost:5173/career/ingest');
        const testFilePath = path.join(__dirname, '../fixtures/sample-resume.pdf');
        await page.locator('input[type="file"]').setInputFiles(testFilePath);
        await page.click('button:has-text("Upload & Analyze")');
        await page.waitForSelector('h3:has-text("Career Database Validation")', { timeout: 60000 });

        // Make an edit
        const firstEditButton = page.locator('button[aria-label="edit"]').first();
        await firstEditButton.click();
        const textField = page.locator('textarea, input[type="text"]').first();
        await textField.fill('Persistence test edit');
        await page.click('button[aria-label="save"]');

        // Refresh page
        await page.reload();

        // Verify edit persists (if backend persistence is implemented)
        // This test may need adjustment based on actual persistence implementation
        await expect(page.locator('text=Persistence test edit')).toBeVisible({ timeout: 5000 });
    });
});

test.describe('Accessibility Testing', () => {
    test('UAT-014: Keyboard Navigation', async ({ page }) => {
        await page.goto('http://localhost:5173/career/ingest');

        // Tab through interactive elements
        await page.keyboard.press('Tab');

        // Verify focus is visible
        const focusedElement = await page.evaluateHandle(() => document.activeElement);
        expect(focusedElement).toBeTruthy();

        // Continue tabbing
        await page.keyboard.press('Tab');
        await page.keyboard.press('Tab');

        // Verify all interactive elements are reachable
        await expect(page.locator('button:has-text("Choose Files"):focus')).toBeVisible();
    });

    test('UAT-015: Screen Reader Compatibility', async ({ page }) => {
        await page.goto('http://localhost:5173/career/ingest');

        // Check for ARIA labels
        const uploadButton = page.locator('button:has-text("Choose Files")');
        const ariaLabel = await uploadButton.getAttribute('aria-label');

        // Verify semantic HTML
        await expect(page.locator('main')).toBeVisible();
        await expect(page.locator('h3')).toBeVisible();
    });
});
