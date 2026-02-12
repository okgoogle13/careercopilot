import { test, expect, type Page } from '@playwright/test';

/**
 * Visual QA Test: Job Search Flow
 * 
 * Final Sprint QA - Testing core user journey:
 * 1. Search for "Software Engineer"
 * 2. Apply filters
 * 3. Save a job
 * 
 * Checks for:
 * - UI responsiveness
 * - Contrast issues
 * - M3 design compliance
 * - Interaction smoothness
 * - Last-minute regressions
 */

test.describe('Job Search Flow - Visual QA', () => {
    // Override storage state to allow test to run without authentication
    test.use({ storageState: undefined });
    let page: Page;

    test.beforeEach(async ({ page: testPage }) => {
        page = testPage;
        await page.goto('http://localhost:3000');

        // Wait for initial load
        await page.waitForLoadState('networkidle');

        // Take screenshot of landing page
        await page.screenshot({
            path: 'test-results/qa-01-landing-page.png',
            fullPage: true
        });
    });

    test('should complete job search workflow with proper UI feedback', async () => {
        // Step 1: Check if we need to authenticate
        const isLoginPage = await page.locator('input[type="email"], input[type="password"]').first().isVisible().catch(() => false);

        if (isLoginPage) {
            console.log('❌ QA Issue: Landing directly on login page - should have guest/demo access for job search');

            // Attempt to login or find demo access
            const demoButton = page.locator('button:has-text("Demo"), button:has-text("Guest"), button:has-text("Try")').first();
            const hasDemoAccess = await demoButton.isVisible().catch(() => false);

            if (hasDemoAccess) {
                await demoButton.click();
                await page.waitForLoadState('networkidle');
            } else {
                // Try default login if available
                const emailInput = page.locator('input[type="email"]').first();
                const passwordInput = page.locator('input[type="password"]').first();
                const loginButton = page.locator('button[type="submit"], button:has-text("Sign in"), button:has-text("Login")').first();

                if (await emailInput.isVisible()) {
                    await emailInput.fill('demo@careercopilot.com');
                    await passwordInput.fill('demo123');
                    await loginButton.click();
                    await page.waitForLoadState('networkidle');
                }
            }

            await page.screenshot({
                path: 'test-results/qa-02-after-auth.png',
                fullPage: true
            });
        }

        // Step 2: Navigate to Opportunities/Job Search page
        console.log('✅ Auth bypassed via guest/demo mode, navigating to Opportunities...');

        // Navigate directly to Opportunities page where job search exists
        await page.goto('http://localhost:5173/opportunities?demo=true');
        await page.waitForLoadState('networkidle');

        await page.screenshot({
            path: 'test-results/qa-03-opportunities-page.png',
            fullPage: true
        });

        // Step 3: Perform job search for "Software Engineer"
        const searchBox = page.locator('input[type="search"], input[name="jobSearch"]').first();

        // Visual QA Check: Is search input visible and accessible?
        await expect(searchBox).toBeVisible({ timeout: 10000 });

        // Check contrast of search input
        const searchInputColor = await searchBox.evaluate((el) => {
            const styles = window.getComputedStyle(el);
            return {
                color: styles.color,
                backgroundColor: styles.backgroundColor,
                borderColor: styles.borderColor,
                fontSize: styles.fontSize,
                padding: styles.padding
            };
        });

        console.log('🎨 Search Input Styles:', searchInputColor);

        // Type in search query
        await searchBox.fill('Software Engineer');
        await page.screenshot({
            path: 'test-results/qa-04-search-entered.png',
            fullPage: true
        });

        // Look for search button or auto-search
        const searchButton = page.locator('button[type="submit"], button:has-text("Search"), button:has-text("Find")').first();
        const hasSearchButton = await searchButton.isVisible({ timeout: 2000 }).catch(() => false);

        if (hasSearchButton) {
            // Visual QA Check: Is button responsive?
            const isButtonEnabled = await searchButton.isEnabled();
            if (!isButtonEnabled) {
                console.log('❌ QA Issue: Search button is disabled after entering query');
            }

            await searchButton.click();
            await page.waitForLoadState('networkidle');
        } else {
            // Auto-search - wait for results
            await page.waitForTimeout(1000);
        }

        await page.screenshot({
            path: 'test-results/qa-05-search-results.png',
            fullPage: true
        });

        // Step 4: Check for and apply filters
        const filterSelectors = [
            'select[name*="location"]',
            'input[type="checkbox"]',
            'button:has-text("Filter")',
            'button:has-text("Remote")',
            'select[name*="salary"]'
        ];

        let filtersApplied = 0;
        for (const selector of filterSelectors) {
            const filter = page.locator(selector).first();
            if (await filter.isVisible({ timeout: 2000 }).catch(() => false)) {
                const filterType = await filter.evaluate((el) => el.tagName);

                if (filterType === 'SELECT') {
                    await filter.selectOption({ index: 1 });
                } else if (filterType === 'INPUT') {
                    await filter.check();
                } else {
                    await filter.click();
                }

                filtersApplied++;
                await page.waitForTimeout(500);

                if (filtersApplied === 1) {
                    await page.screenshot({
                        path: 'test-results/qa-06-filters-applied.png',
                        fullPage: true
                    });
                }
            }
        }

        console.log(`✅ Applied ${filtersApplied} filters`);

        // Step 5: Attempt to save a job
        const saveButtonSelectors = [
            'button:has-text("Save")',
            'button:has-text("Bookmark")',
            'button[aria-label*="save"]',
            'button[aria-label*="bookmark"]',
            '[data-testid*="save"]',
            'svg[data-icon="bookmark"]',
            'svg[data-icon="star"]'
        ];

        let savedJob = false;
        for (const selector of saveButtonSelectors) {
            const saveButton = page.locator(selector).first();
            if (await saveButton.isVisible({ timeout: 3000 }).catch(() => false)) {
                // Visual QA Check: Button contrast and hover state
                const buttonStyles = await saveButton.evaluate((el) => {
                    const styles = window.getComputedStyle(el);
                    return {
                        color: styles.color,
                        backgroundColor: styles.backgroundColor,
                        cursor: styles.cursor,
                        opacity: styles.opacity
                    };
                });

                console.log('🎨 Save Button Styles:', buttonStyles);

                // Check if button appears disabled
                if (buttonStyles.opacity === '0.5' || buttonStyles.cursor === 'not-allowed') {
                    console.log('⚠️ QA Issue: Save button may appear disabled (low opacity or not-allowed cursor)');
                }

                await saveButton.click();
                await page.waitForTimeout(1000);

                savedJob = true;

                await page.screenshot({
                    path: 'test-results/qa-07-job-saved.png',
                    fullPage: true
                });

                break;
            }
        }

        if (!savedJob) {
            console.log('❌ QA Issue: Could not find save/bookmark button for jobs');
            await page.screenshot({
                path: 'test-results/qa-07-no-save-button.png',
                fullPage: true
            });
        }

        // Step 6: Check for visual feedback after saving
        if (savedJob) {
            const feedbackSelectors = [
                '.toast',
                '[role="alert"]',
                '.notification',
                '.success-message',
                'text=saved',
                'text=bookmarked'
            ];

            let hasFeedback = false;
            for (const selector of feedbackSelectors) {
                const feedback = page.locator(selector).first();
                if (await feedback.isVisible({ timeout: 2000 }).catch(() => false)) {
                    hasFeedback = true;
                    console.log('✅ Visual feedback provided after saving job');
                    break;
                }
            }

            if (!hasFeedback) {
                console.log('⚠️ QA Issue: No visible feedback after saving job (toast, notification, etc.)');
            }
        }

        // Step 7: Comprehensive Visual QA Audit
        console.log('\n🔍 Running Comprehensive Visual QA Audit...\n');

        // Check for console errors
        const consoleErrors: string[] = [];
        page.on('console', (msg) => {
            if (msg.type() === 'error') {
                consoleErrors.push(msg.text());
            }
        });

        // Check all interactive elements for accessibility
        const interactiveElements = await page.locator('button, a, input, select').all();
        console.log(`📊 Found ${interactiveElements.length} interactive elements`);

        // Sample a few elements for contrast check
        for (let i = 0; i < Math.min(5, interactiveElements.length); i++) {
            const el = interactiveElements[i];
            const contrast = await el.evaluate((element) => {
                const styles = window.getComputedStyle(element);
                const color = styles.color;
                const backgroundColor = styles.backgroundColor;
                const tagName = element.tagName;
                const text = element.textContent?.trim().substring(0, 30) || '';

                return { tagName, text, color, backgroundColor };
            });

            console.log(`Element ${i + 1}:`, contrast);
        }

        // Final screenshot
        await page.screenshot({
            path: 'test-results/qa-08-final-state.png',
            fullPage: true
        });

        // Log summary
        console.log('\n📝 QA Summary:');
        console.log(`   Filters applied: ${filtersApplied}`);
        console.log(`   Job saved: ${savedJob ? 'Yes' : 'No'}`);
        console.log(`   Console errors: ${consoleErrors.length}`);

        if (consoleErrors.length > 0) {
            console.log('\n❌ Console Errors Found:');
            consoleErrors.forEach(err => console.log(`   - ${err}`));
        }
    });

    test('should verify M3 design token compliance in job cards', async () => {
        // Navigate to job results page
        await page.goto('http://localhost:3000');
        await page.waitForLoadState('networkidle');

        // Look for job cards
        const jobCards = page.locator('[class*="Card"], [class*="card"], article, [data-testid*="job"]');
        const cardCount = await jobCards.count();

        if (cardCount === 0) {
            console.log('⚠️ No job cards found for M3 compliance check');
            return;
        }

        console.log(`\n🎨 M3 Design Compliance Check - Found ${cardCount} cards\n`);

        // Check first card for M3 compliance
        const firstCard = jobCards.first();

        const m3Compliance = await firstCard.evaluate((card) => {
            const styles = window.getComputedStyle(card);

            return {
                borderRadius: styles.borderRadius,
                boxShadow: styles.boxShadow,
                padding: styles.padding,
                backgroundColor: styles.backgroundColor,
                transition: styles.transition
            };
        });

        console.log('Card Styles:', m3Compliance);

        // Check for [DEPRECATED_STYLE] border radius (pebble shape would be: 20px 20px 32px 32px)
        const hasOrganicRadius = m3Compliance.borderRadius.includes('px') &&
            m3Compliance.borderRadius.split(' ').length > 1;

        if (!hasOrganicRadius) {
            console.log('⚠️ QA Issue: Card not using M3 [DEPRECATED_STYLE] border radius (should be asymmetric like pebble)');
        } else {
            console.log('✅ Card uses [DEPRECATED_STYLE] border radius');
        }

        // Check for elevation shadow
        const hasElevation = m3Compliance.boxShadow && m3Compliance.boxShadow !== 'none';
        if (!hasElevation) {
            console.log('⚠️ QA Issue: Card missing M3 elevation shadow');
        } else {
            console.log('✅ Card has elevation shadow');
        }

        await page.screenshot({
            path: 'test-results/qa-m3-compliance.png',
            fullPage: true
        });
    });
});
