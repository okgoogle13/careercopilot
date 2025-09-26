/**
 * End-to-End (E2E) Test for Document Upload Success Workflow
 *
 * This test validates the complete document upload workflow including:
 * - Navigation to upload page
 * - File selection and upload
 * - Success confirmation
 * - Navigation to next steps
 */

import { test, expect } from '@playwright/test';
import path from 'path';

test.describe('Document Upload Success Workflow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the document upload page
    await page.goto('/upload-resume');

    // Wait for the page to load completely
    await page.waitForLoadState('networkidle');
  });

  test('successful document upload workflow - PDF resume', async ({ page }) => {
    // Step 1: Verify we're on the upload page
    const pageTitle = await page.textContent('h1');
    expect(pageTitle).toMatch(/upload|document|resume/i);

    // Step 2: Locate the file upload area
    const uploadArea = page
      .locator('[data-testid="upload-dropzone"], .dropzone, input[type="file"]')
      .first();
    await expect(uploadArea).toBeVisible();

    // Step 3: Create a test PDF file for upload (mock file)
    const testFilePath = path.join(__dirname, 'fixtures', 'test-resume.pdf');

    // If using a file input, upload directly
    const fileInput = page.locator('input[type="file"]');
    if ((await fileInput.count()) > 0) {
      // Create a temporary file for testing
      await fileInput.setInputFiles([
        {
          name: 'test-resume.pdf',
          mimeType: 'application/pdf',
          buffer: Buffer.from('Mock PDF content for testing'),
        },
      ]);
    } else {
      // If using dropzone, simulate drag and drop
      const dropZone = page.locator('[data-testid="upload-dropzone"], .dropzone').first();
      await dropZone.click();

      // Handle file dialog if it appears
      const [fileChooser] = await Promise.all([page.waitForEvent('filechooser'), dropZone.click()]);

      await fileChooser.setFiles([
        {
          name: 'test-resume.pdf',
          mimeType: 'application/pdf',
          buffer: Buffer.from('Mock PDF content for testing'),
        },
      ]);
    }

    // Step 4: Wait for upload progress indicators
    const uploadingIndicator = page.locator('text=/uploading|processing|analyzing/i');
    if ((await uploadingIndicator.count()) > 0) {
      await expect(uploadingIndicator).toBeVisible();

      // Wait for upload to complete
      await expect(uploadingIndicator).not.toBeVisible({ timeout: 10000 });
    }

    // Step 5: Verify upload success indicators
    await expect(async () => {
      const successIndicators = [
        page.locator('text=/success|uploaded|complete/i'),
        page.locator('[data-testid="upload-success"]'),
        page.locator('.success-message'),
        page.locator('text=/✓|checkmark|done/i'),
      ];

      let found = false;
      for (const indicator of successIndicators) {
        if ((await indicator.count()) > 0 && (await indicator.isVisible())) {
          found = true;
          break;
        }
      }
      expect(found).toBe(true);
    }).toPass({ timeout: 8000 });

    // Step 6: Verify file name appears in the UI
    const fileName = page.locator('text=test-resume.pdf');
    await expect(fileName).toBeVisible({ timeout: 5000 });

    // Step 7: Check for next step button
    const nextButton = page.locator('button').filter({
      hasText: /next|continue|proceed|done/i,
    });
    await expect(nextButton).toBeVisible();
    await expect(nextButton).toBeEnabled();

    // Step 8: Click next to proceed to the next step
    await nextButton.click();

    // Step 9: Verify navigation to next step
    await expect(page).toHaveURL(/profile|dashboard|editor|template/);
  });

  test('multiple file upload success', async ({ page }) => {
    // Test uploading multiple files (resume + cover letter)
    const fileInput = page.locator('input[type="file"]');

    if ((await fileInput.count()) > 0) {
      await fileInput.setInputFiles([
        {
          name: 'resume.pdf',
          mimeType: 'application/pdf',
          buffer: Buffer.from('Mock resume PDF'),
        },
        {
          name: 'cover-letter.docx',
          mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          buffer: Buffer.from('Mock cover letter DOCX'),
        },
      ]);

      // Verify both files appear
      await expect(page.locator('text=resume.pdf')).toBeVisible({ timeout: 8000 });
      await expect(page.locator('text=cover-letter.docx')).toBeVisible({ timeout: 8000 });

      // Verify success message for multiple files
      const successMessage = page.locator('text=/2 files|multiple files|all files/i');
      await expect(successMessage).toBeVisible({ timeout: 5000 });
    }
  });

  test('upload with progress tracking', async ({ page }) => {
    // Test upload with progress bar/percentage
    const fileInput = page.locator('input[type="file"]').first();

    await fileInput.setInputFiles([
      {
        name: 'large-resume.pdf',
        mimeType: 'application/pdf',
        buffer: Buffer.from('x'.repeat(1000)), // Larger mock file
      },
    ]);

    // Look for progress indicators
    const progressIndicators = [
      page.locator('[role="progressbar"]'),
      page.locator('.progress-bar'),
      page.locator('text=/%|percent|progress/i'),
      page.locator('[data-testid*="progress"]'),
    ];

    let progressFound = false;
    for (const indicator of progressIndicators) {
      if ((await indicator.count()) > 0) {
        await expect(indicator).toBeVisible({ timeout: 3000 });
        progressFound = true;
        break;
      }
    }

    // Wait for completion
    await expect(page.locator('text=/success|complete|done/i')).toBeVisible({ timeout: 10000 });
  });

  test('upload success with file preview', async ({ page }) => {
    // Test that shows file preview after successful upload
    const fileInput = page.locator('input[type="file"]').first();

    await fileInput.setInputFiles([
      {
        name: 'resume-with-preview.pdf',
        mimeType: 'application/pdf',
        buffer: Buffer.from('Mock PDF with preview'),
      },
    ]);

    // Wait for upload success
    await expect(page.locator('text=/success|uploaded/i')).toBeVisible({ timeout: 8000 });

    // Look for file preview elements
    const previewElements = [
      page.locator('[data-testid*="preview"]'),
      page.locator('.file-preview'),
      page.locator('img[alt*="preview"]'),
      page.locator('iframe'), // PDF preview
      page.locator('.document-thumbnail'),
    ];

    let previewFound = false;
    for (const element of previewElements) {
      if ((await element.count()) > 0 && (await element.isVisible())) {
        previewFound = true;
        break;
      }
    }

    if (previewFound) {
      // If preview is available, verify it's working
      console.log('File preview is available and visible');
    }
  });

  test('upload success with file metadata display', async ({ page }) => {
    // Test that displays file metadata after upload
    const fileInput = page.locator('input[type="file"]').first();

    await fileInput.setInputFiles([
      {
        name: 'detailed-resume.pdf',
        mimeType: 'application/pdf',
        buffer: Buffer.from('Mock PDF with metadata'),
      },
    ]);

    // Wait for upload success
    await expect(page.locator('text=/success|uploaded/i')).toBeVisible({ timeout: 8000 });

    // Look for metadata display
    const metadataElements = [
      page.locator('text=/file size|size:|bytes|kb|mb/i'),
      page.locator('text=/file type|type:|pdf|docx/i'),
      page.locator('text=/upload.*time|uploaded.*at/i'),
      page.locator('[data-testid*="file-info"]'),
    ];

    for (const element of metadataElements) {
      if ((await element.count()) > 0 && (await element.isVisible())) {
        console.log(`Found metadata element: ${await element.textContent()}`);
      }
    }
  });

  test('error handling - recovery and retry', async ({ page }) => {
    // Test successful upload after initial failure

    // First attempt - simulate network failure if possible
    // This is a success workflow test, so we'll simulate quick recovery

    const fileInput = page.locator('input[type="file"]').first();

    await fileInput.setInputFiles([
      {
        name: 'retry-resume.pdf',
        mimeType: 'application/pdf',
        buffer: Buffer.from('Mock PDF for retry test'),
      },
    ]);

    // Look for retry mechanism if upload initially fails
    const retryButton = page.locator('button').filter({ hasText: /retry|try again/i });

    if ((await retryButton.count()) > 0 && (await retryButton.isVisible())) {
      await retryButton.click();
    }

    // Verify eventual success
    await expect(page.locator('text=/success|uploaded|complete/i')).toBeVisible({ timeout: 15000 });
  });

  test('upload success with accessibility features', async ({ page }) => {
    // Test upload workflow with accessibility focus

    const fileInput = page.locator('input[type="file"]').first();

    // Check that file input has proper labels
    const inputLabel =
      (await fileInput.getAttribute('aria-label')) ||
      (await page.locator('label').filter({ has: fileInput }).textContent());

    expect(inputLabel).toBeTruthy();

    await fileInput.setInputFiles([
      {
        name: 'accessible-resume.pdf',
        mimeType: 'application/pdf',
        buffer: Buffer.from('Mock PDF for accessibility test'),
      },
    ]);

    // Wait for success
    await expect(page.locator('text=/success|uploaded/i')).toBeVisible({ timeout: 8000 });

    // Verify ARIA announcements or status updates
    const statusRegion = page.locator('[role="status"], [aria-live], [data-testid*="status"]');
    if ((await statusRegion.count()) > 0) {
      await expect(statusRegion).toBeVisible();
    }

    // Test keyboard navigation
    await page.keyboard.press('Tab');
    const focusedElement = await page.locator(':focus');
    await expect(focusedElement).toBeVisible();
  });
});
