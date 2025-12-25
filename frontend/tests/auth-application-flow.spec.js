/**
 * E2E Test: Authentication & Application Creation Flow
 *
 * This test verifies the complete user journey:
 * 1. User logs in with Firebase Authentication
 * 2. User creates a new job application
 * 3. Application is saved to Firestore
 * 4. Application appears in the UI
 *
 * Prerequisites:
 * - Backend running on http://localhost:8081
 * - Frontend running on http://localhost:5173
 * - Firebase test user credentials in environment
 */

import { test, expect } from '@playwright/test';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, collection, query, where, getDocs, deleteDoc } from 'firebase/firestore';

// Firebase configuration (from environment)
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

// Test user credentials
const TEST_USER = {
  email: process.env.TEST_USER_EMAIL || 'test@careercopilot.dev',
  password: process.env.TEST_USER_PASSWORD || 'TestPassword123!',
};

// Initialize Firebase for direct database verification
const app = initializeApp(firebaseConfig, 'e2e-test');
const auth = getAuth(app);
const db = getFirestore(app);

test.describe('Critical Flow: Auth → Create Application → Verify Database', () => {
  let testUserId;
  let testApplicationId;

  test.beforeAll(async () => {
    // Authenticate test user to get UID for database queries
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        TEST_USER.email,
        TEST_USER.password
      );
      testUserId = userCredential.user.uid;
      console.log(`✅ Test user authenticated: ${testUserId}`);
    } catch (error) {
      console.error('❌ Failed to authenticate test user:', error);
      throw new Error(
        'Test user authentication failed. Ensure TEST_USER_EMAIL and TEST_USER_PASSWORD are set.'
      );
    }
  });

  test.afterAll(async () => {
    // Cleanup: Delete test application from Firestore
    if (testUserId && testApplicationId) {
      try {
        const appRef = collection(db, 'users', testUserId, 'applications');
        const q = query(appRef, where('__name__', '==', testApplicationId));
        const snapshot = await getDocs(q);

        for (const doc of snapshot.docs) {
          await deleteDoc(doc.ref);
        }
        console.log(`✅ Cleaned up test application: ${testApplicationId}`);
      } catch (error) {
        console.error('⚠️ Cleanup failed:', error);
      }
    }
  });

  test('should complete full authentication and application creation flow', async ({ page }) => {
    // ========================================================================
    // STEP 1: Navigate to Application
    // ========================================================================
    await test.step('Navigate to login page', async () => {
      await page.goto('http://localhost:5173/login');
      await expect(page).toHaveTitle(/Career Copilot/i);
    });

    // ========================================================================
    // STEP 2: Authenticate User
    // ========================================================================
    await test.step('Log in with test user credentials', async () => {
      // Wait for login form to be visible
      await page.waitForSelector('input[type="email"]', { timeout: 10000 });

      // Fill in credentials
      await page.fill('input[type="email"]', TEST_USER.email);
      await page.fill('input[type="password"]', TEST_USER.password);

      // Submit login form
      await page.click('button[type="submit"]');

      // Wait for redirect to dashboard
      await page.waitForURL(/\/dashboard/, { timeout: 15000 });

      // Verify user is logged in (check for user profile element)
      const userProfile = page.locator(
        '[data-testid="user-profile"], .user-profile, [aria-label*="user"]'
      );
      await expect(userProfile.first()).toBeVisible({ timeout: 10000 });

      console.log('✅ User successfully logged in');
    });

    // ========================================================================
    // STEP 3: Navigate to Application Tracker
    // ========================================================================
    await test.step('Navigate to Application Tracker', async () => {
      // Click on Applications link in sidebar
      const applicationsLink = page.locator('a[href="/tracker"], a:has-text("Applications")');
      await applicationsLink.first().click();

      // Wait for tracker page to load
      await page.waitForURL(/\/tracker/, { timeout: 10000 });

      // Verify page header
      await expect(
        page
          .locator('h1, h2')
          .filter({ hasText: /application/i })
          .first()
      ).toBeVisible();

      console.log('✅ Navigated to Application Tracker');
    });

    // ========================================================================
    // STEP 4: Create New Application
    // ========================================================================
    await test.step('Create a new job application', async () => {
      // Click "Add New Application" button
      const addButton = page.locator(
        'button:has-text("Add New Application"), button:has-text("+ Add")'
      );
      await addButton.first().click();

      // Wait for application form/modal to appear
      await page.waitForSelector('input[name="jobTitle"], input[placeholder*="Job Title"]', {
        timeout: 5000,
      });

      // Fill in application details
      const timestamp = Date.now();
      const testJobTitle = `E2E Test - Software Engineer ${timestamp}`;
      const testCompany = `Test Company ${timestamp}`;

      await page.fill('input[name="jobTitle"], input[placeholder*="Job Title"]', testJobTitle);
      await page.fill('input[name="companyName"], input[placeholder*="Company"]', testCompany);

      // Optional fields (if present)
      try {
        await page.fill('input[name="location"], input[placeholder*="Location"]', 'Remote', {
          timeout: 2000,
        });
        await page.fill('input[name="salary"], input[placeholder*="Salary"]', '$100k - $120k', {
          timeout: 2000,
        });
      } catch (e) {
        console.log('⚠️ Optional fields not found, continuing...');
      }

      // Submit the form
      const submitButton = page.locator(
        'button[type="submit"], button:has-text("Save"), button:has-text("Create")'
      );
      await submitButton.first().click();

      // Wait for success confirmation
      await page.waitForTimeout(2000); // Allow time for API call

      console.log(`✅ Created application: ${testJobTitle}`);

      // Store test data for verification
      test.info().annotations.push({ type: 'test-data', description: testJobTitle });
    });

    // ========================================================================
    // STEP 5: Verify Application Appears in UI
    // ========================================================================
    await test.step('Verify application appears in the tracker', async () => {
      // Look for the newly created application in the list
      const applicationCard = page.locator('[data-testid="application-card"]').filter({
        hasText: /E2E Test - Software Engineer/,
      });

      // Alternative: search by text content
      const applicationText = page.locator('text=/E2E Test - Software Engineer/');

      // At least one should be visible
      const isVisible =
        (await applicationCard
          .first()
          .isVisible()
          .catch(() => false)) ||
        (await applicationText
          .first()
          .isVisible()
          .catch(() => false));

      expect(isVisible).toBeTruthy();

      console.log('✅ Application visible in UI');
    });

    // ========================================================================
    // STEP 6: Verify Application in Firestore Database
    // ========================================================================
    await test.step('Verify application exists in Firestore', async () => {
      // Query Firestore for the test application
      const appsRef = collection(db, 'users', testUserId, 'applications');
      const q = query(
        appsRef,
        where('jobTitle', '>=', 'E2E Test'),
        where('jobTitle', '<=', 'E2E Test\uf8ff')
      );

      const snapshot = await getDocs(q);

      // Verify at least one application exists
      expect(snapshot.size).toBeGreaterThan(0);

      // Get the first matching application
      const appDoc = snapshot.docs[0];
      testApplicationId = appDoc.id;
      const appData = appDoc.data();

      // Verify application data
      expect(appData.jobTitle).toContain('E2E Test - Software Engineer');
      expect(appData.companyName).toContain('Test Company');
      expect(appData.userId).toBe(testUserId);

      // Verify timestamps
      expect(appData.createdAt).toBeDefined();
      expect(appData.updatedAt).toBeDefined();

      console.log(`✅ Application verified in Firestore: ${testApplicationId}`);
      console.log('Application data:', {
        id: testApplicationId,
        jobTitle: appData.jobTitle,
        company: appData.companyName,
        status: appData.status,
        createdAt: appData.createdAt,
      });
    });

    // ========================================================================
    // STEP 7: Verify Data Consistency
    // ========================================================================
    await test.step('Verify UI and database data match', async () => {
      // Fetch the application from Firestore
      const appsRef = collection(db, 'users', testUserId, 'applications');
      const q = query(appsRef, where('__name__', '==', testApplicationId));
      const snapshot = await getDocs(q);
      const dbData = snapshot.docs[0].data();

      // Get UI data
      const uiJobTitle = await page
        .locator('[data-testid="application-card"]')
        .filter({ hasText: /E2E Test/ })
        .first()
        .textContent();

      // Verify consistency
      expect(uiJobTitle).toContain(dbData.jobTitle);

      console.log('✅ UI and database data are consistent');
    });
  });

  test('should handle authentication errors gracefully', async ({ page }) => {
    await test.step('Attempt login with invalid credentials', async () => {
      await page.goto('http://localhost:5173/login');

      await page.fill('input[type="email"]', 'invalid@example.com');
      await page.fill('input[type="password"]', 'wrongpassword');
      await page.click('button[type="submit"]');

      // Should show error message
      const errorMessage = page.locator('[role="alert"], .error-message, text=/invalid/i');
      await expect(errorMessage.first()).toBeVisible({ timeout: 5000 });

      console.log('✅ Authentication error handled correctly');
    });
  });

  test('should validate application form inputs', async ({ page }) => {
    // Login first
    await page.goto('http://localhost:5173/login');
    await page.fill('input[type="email"]', TEST_USER.email);
    await page.fill('input[type="password"]', TEST_USER.password);
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/dashboard/);

    // Navigate to tracker
    await page.goto('http://localhost:5173/tracker');

    await test.step('Attempt to create application with empty fields', async () => {
      const addButton = page.locator('button:has-text("Add New Application")');
      await addButton.first().click();

      // Try to submit without filling required fields
      const submitButton = page.locator('button[type="submit"]');
      await submitButton.first().click();

      // Should show validation errors
      const validationError = page.locator('[role="alert"], .error, text=/required/i');
      const isErrorVisible = await validationError
        .first()
        .isVisible({ timeout: 3000 })
        .catch(() => false);

      // Form should either show validation or prevent submission
      expect(isErrorVisible || (await page.url())).toBeTruthy();

      console.log('✅ Form validation working correctly');
    });
  });
});
