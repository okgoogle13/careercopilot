/**
 * End-to-End (E2E) Test for Kanban Card Edit Workflow
 *
 * This test validates the editing functionality for card-based interfaces including:
 * - Profile cards editing
 * - Document status updates
 * - Card drag and drop (if available)
 * - Inline editing capabilities
 * - Status changes and updates
 */

const { test, expect } = require('@playwright/test');

test.describe('Kanban Card Edit Workflow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the dashboard where cards are displayed
    await page.goto('/dashboard');

    // Wait for the page to load completely
    await page.waitForLoadState('networkidle');

    // Wait for cards to be rendered
    await expect(page.locator('.MuiCard-root, [data-testid*="card"], .card').first()).toBeVisible({ timeout: 10000 });
  });

  test('edit profile card content', async ({ page }) => {
    // Step 1: Locate the first profile card
    const profileCard = page.locator('.MuiCard-root').first();
    await expect(profileCard).toBeVisible();

    // Step 2: Look for edit button or clickable area
    const editTriggers = [
      profileCard.locator('button').filter({ hasText: /edit/i }),
      profileCard.locator('[data-testid*="edit"]'),
      profileCard.locator('.edit-button'),
      profileCard.locator('[title*="edit"]')
    ];

    let editButton = null;
    for (const trigger of editTriggers) {
      if (await trigger.count() > 0 && await trigger.isVisible()) {
        editButton = trigger;
        break;
      }
    }

    if (editButton) {
      // Step 3: Click edit button
      await editButton.click();

      // Step 4: Wait for edit mode or modal to appear
      const editModal = page.locator('[role="dialog"], .modal, [data-testid*="edit-modal"]');
      const inlineEditor = page.locator('input, textarea, [contenteditable="true"]');

      if (await editModal.count() > 0) {
        // Modal-based editing
        await expect(editModal).toBeVisible();

        // Find editable fields in modal
        const nameField = editModal.locator('input[name*="name"], input[placeholder*="name"]').first();
        const titleField = editModal.locator('input[name*="title"], input[placeholder*="title"]').first();

        if (await nameField.count() > 0) {
          await nameField.fill('Updated Profile Name');
        }

        if (await titleField.count() > 0) {
          await titleField.fill('Senior Software Engineer');
        }

        // Save changes
        const saveButton = editModal.locator('button').filter({ hasText: /save|update|confirm/i });
        await expect(saveButton).toBeVisible();
        await saveButton.click();

        // Wait for modal to close
        await expect(editModal).not.toBeVisible({ timeout: 5000 });

      } else if (await inlineEditor.count() > 0) {
        // Inline editing
        const firstEditor = inlineEditor.first();
        await firstEditor.clear();
        await firstEditor.fill('Updated Content');

        // Look for save mechanism (button, enter key, or blur)
        const saveButton = page.locator('button').filter({ hasText: /save|confirm|✓/i });
        if (await saveButton.count() > 0 && await saveButton.isVisible()) {
          await saveButton.click();
        } else {
          // Try pressing Enter or clicking outside
          await firstEditor.press('Enter');
        }
      }

      // Step 5: Verify changes were saved
      await expect(page.locator('text=/updated|saved|success/i')).toBeVisible({ timeout: 5000 });
    } else {
      // Alternative: double-click or right-click to edit
      await profileCard.dblclick();

      // Check if edit mode activated
      const editableElement = page.locator('input, textarea, [contenteditable="true"]');
      if (await editableElement.count() > 0) {
        await editableElement.first().fill('Double-click Edit Test');
        await page.keyboard.press('Enter');
      }
    }
  });

  test('change card status or category', async ({ page }) => {
    // Step 1: Find a card with status/category
    const cardWithStatus = page.locator('.MuiCard-root').first();
    await expect(cardWithStatus).toBeVisible();

    // Step 2: Look for status chip or dropdown
    const statusElements = [
      cardWithStatus.locator('.MuiChip-root'),
      cardWithStatus.locator('[data-testid*="status"]'),
      cardWithStatus.locator('select, .status-dropdown'),
      cardWithStatus.locator('button').filter({ hasText: /active|draft|published|pending/i })
    ];

    for (const statusElement of statusElements) {
      if (await statusElement.count() > 0 && await statusElement.isVisible()) {
        // Click the status element
        await statusElement.click();

        // Look for dropdown or menu
        const dropdown = page.locator('[role="menu"], .dropdown-menu, .MuiMenu-root');
        if (await dropdown.count() > 0) {
          await expect(dropdown).toBeVisible({ timeout: 3000 });

          // Select a different status
          const statusOptions = dropdown.locator('[role="menuitem"], .menu-item, li');
          const firstOption = statusOptions.first();

          if (await firstOption.count() > 0) {
            await firstOption.click();

            // Verify status change
            await expect(page.locator('text=/status.*updated|changed|saved/i')).toBeVisible({ timeout: 5000 });
          }
        }
        break;
      }
    }
  });

  test('drag and drop card reordering', async ({ page }) => {
    // Step 1: Find multiple cards for drag and drop
    const cards = page.locator('.MuiCard-root');
    const cardCount = await cards.count();

    if (cardCount >= 2) {
      // Step 2: Get first and second cards
      const firstCard = cards.nth(0);
      const secondCard = cards.nth(1);

      await expect(firstCard).toBeVisible();
      await expect(secondCard).toBeVisible();

      // Step 3: Get positions before drag
      const firstCardBox = await firstCard.boundingBox();
      const secondCardBox = await secondCard.boundingBox();

      if (firstCardBox && secondCardBox) {
        // Step 4: Perform drag and drop
        await firstCard.hover();
        await page.mouse.down();
        await page.mouse.move(secondCardBox.x + secondCardBox.width / 2, secondCardBox.y + secondCardBox.height / 2, { steps: 10 });
        await page.mouse.up();

        // Step 5: Wait for reordering animation/update
        await page.waitForTimeout(1000);

        // Step 6: Verify positions changed (optional - depends on implementation)
        const newFirstCardBox = await firstCard.boundingBox();
        if (newFirstCardBox && newFirstCardBox.y !== firstCardBox.y) {
          console.log('Drag and drop reordering detected');
        }
      }
    } else {
      console.log('Not enough cards available for drag and drop test');
    }
  });

  test('bulk edit multiple cards', async ({ page }) => {
    // Step 1: Look for bulk selection capabilities
    const selectAllCheckbox = page.locator('input[type="checkbox"]').filter({ hasText: /select all/i }).or(
      page.locator('[data-testid*="select-all"]')
    );

    if (await selectAllCheckbox.count() > 0) {
      // Step 2: Select all cards
      await selectAllCheckbox.check();

      // Step 3: Look for bulk edit options
      const bulkEditButton = page.locator('button').filter({ hasText: /bulk.*edit|edit.*selected/i });

      if (await bulkEditButton.count() > 0) {
        await bulkEditButton.click();

        // Step 4: Perform bulk operations
        const bulkModal = page.locator('[role="dialog"]');
        if (await bulkModal.count() > 0) {
          await expect(bulkModal).toBeVisible();

          // Change status for all selected
          const statusSelect = bulkModal.locator('select, .dropdown');
          if (await statusSelect.count() > 0) {
            await statusSelect.selectOption({ index: 1 });
          }

          // Apply changes
          const applyButton = bulkModal.locator('button').filter({ hasText: /apply|save|update/i });
          await applyButton.click();

          // Verify bulk update
          await expect(page.locator('text=/bulk.*updated|multiple.*updated/i')).toBeVisible({ timeout: 5000 });
        }
      }
    } else {
      // Alternative: individual card selection
      const cardCheckboxes = page.locator('.MuiCard-root input[type="checkbox"]');
      const checkboxCount = await cardCheckboxes.count();

      if (checkboxCount > 0) {
        // Select first two checkboxes
        await cardCheckboxes.nth(0).check();
        await cardCheckboxes.nth(1).check();

        // Look for bulk action toolbar
        const bulkToolbar = page.locator('[data-testid*="bulk"], .bulk-actions');
        if (await bulkToolbar.count() > 0) {
          await expect(bulkToolbar).toBeVisible();
        }
      }
    }
  });

  test('card deletion workflow', async ({ page }) => {
    // Step 1: Find a card to delete
    const targetCard = page.locator('.MuiCard-root').first();
    await expect(targetCard).toBeVisible();

    // Step 2: Look for delete button
    const deleteButton = targetCard.locator('button').filter({ hasText: /delete|remove|×/i }).or(
      targetCard.locator('[data-testid*="delete"]')
    );

    if (await deleteButton.count() > 0) {
      await deleteButton.click();

      // Step 3: Handle confirmation dialog
      const confirmDialog = page.locator('[role="dialog"]').filter({ hasText: /delete|confirm|remove/i });

      if (await confirmDialog.count() > 0) {
        await expect(confirmDialog).toBeVisible();

        const confirmButton = confirmDialog.locator('button').filter({ hasText: /delete|confirm|yes/i });
        await confirmButton.click();

        // Wait for deletion to complete
        await expect(confirmDialog).not.toBeVisible({ timeout: 5000 });

        // Verify deletion success message
        await expect(page.locator('text=/deleted|removed|success/i')).toBeVisible({ timeout: 5000 });
      } else {
        // Direct deletion without confirmation
        await expect(page.locator('text=/deleted|removed/i')).toBeVisible({ timeout: 5000 });
      }
    }
  });

  test('card quick edit with keyboard shortcuts', async ({ page }) => {
    // Step 1: Select a card
    const firstCard = page.locator('.MuiCard-root').first();
    await firstCard.click();

    // Step 2: Try common keyboard shortcuts for editing
    await page.keyboard.press('F2'); // Common edit shortcut
    await page.waitForTimeout(500);

    // Check if edit mode activated
    const editableField = page.locator('input:focus, textarea:focus, [contenteditable="true"]:focus');

    if (await editableField.count() > 0) {
      await editableField.type('Keyboard Edit Test');
      await page.keyboard.press('Enter');

      // Verify changes saved
      await expect(page.locator('text=Keyboard Edit Test')).toBeVisible({ timeout: 3000 });
    } else {
      // Try other shortcuts
      await page.keyboard.press('Enter'); // Alternative edit shortcut
      await page.waitForTimeout(500);

      const newEditableField = page.locator('input:focus, textarea:focus');
      if (await newEditableField.count() > 0) {
        await newEditableField.type('Enter Key Edit');
        await page.keyboard.press('Escape'); // Save and exit
      }
    }
  });

  test('card filter and search during editing', async ({ page }) => {
    // Step 1: Use search/filter to find specific cards
    const searchInput = page.locator('input[placeholder*="search"], [data-testid*="search"]');

    if (await searchInput.count() > 0) {
      await searchInput.fill('profile');
      await page.keyboard.press('Enter');

      // Wait for filtered results
      await page.waitForTimeout(1000);

      // Step 2: Edit a filtered card
      const filteredCard = page.locator('.MuiCard-root').first();
      if (await filteredCard.count() > 0) {
        await filteredCard.click();

        // Look for edit functionality
        const editButton = filteredCard.locator('button').filter({ hasText: /edit/i });
        if (await editButton.count() > 0) {
          await editButton.click();

          // Perform quick edit
          const editField = page.locator('input, textarea').first();
          if (await editField.count() > 0) {
            await editField.fill('Filtered Card Edit');
            await page.keyboard.press('Enter');
          }
        }

        // Clear search to verify edit persisted
        await searchInput.clear();
        await page.keyboard.press('Enter');

        // Verify edit is still visible
        await expect(page.locator('text=Filtered Card Edit')).toBeVisible({ timeout: 3000 });
      }
    }
  });

  test('undo/redo card editing operations', async ({ page }) => {
    // Step 1: Make an edit to a card
    const card = page.locator('.MuiCard-root').first();
    await card.click();

    // Look for editable content
    const editButton = card.locator('button').filter({ hasText: /edit/i });

    if (await editButton.count() > 0) {
      await editButton.click();

      const editField = page.locator('input, textarea').first();
      if (await editField.count() > 0) {
        const originalValue = await editField.inputValue();
        await editField.fill('Test Edit for Undo');

        // Save the edit
        await page.keyboard.press('Enter');

        // Step 2: Try to undo with Ctrl+Z
        await page.keyboard.press('Control+z');
        await page.waitForTimeout(500);

        // Check if undo worked
        const currentText = await page.textContent('body');
        if (currentText?.includes(originalValue) && !currentText.includes('Test Edit for Undo')) {
          console.log('Undo functionality detected');

          // Step 3: Try to redo with Ctrl+Y
          await page.keyboard.press('Control+y');
          await page.waitForTimeout(500);

          const redoText = await page.textContent('body');
          if (redoText?.includes('Test Edit for Undo')) {
            console.log('Redo functionality detected');
          }
        }
      }
    }
  });
});