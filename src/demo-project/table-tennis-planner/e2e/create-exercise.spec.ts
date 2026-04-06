// e2e/create-exercise.spec.ts
/**
 * E2E test for trainers creating a new exercise via the modal form.
 */
import { test, expect } from '@playwright/test';

test.describe('Create Exercise', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('#username', 'trainer');
    await page.fill('#password', 'trainer123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/trainer');
  });

  test('trainer can create a new exercise', async ({ page }) => {
    // Click "Neue Übung erstellen" button
    await page.getByRole('button', { name: 'Neue Übung erstellen' }).click();

    // Modal should be visible
    await expect(page.locator('#ex-name')).toBeVisible();

    // Fill form
    await page.fill('#ex-name', 'E2E Test-Übung');
    await page.fill('#ex-desc', 'Diese Übung wurde per E2E-Test erstellt');

    // Select category (click on "Ballwechsel" badge inside the modal)
    await page.locator('.fixed').getByText('Ballwechsel').click();

    // Select difficulty (click on "Fortgeschritten" badge inside the modal)
    await page.locator('.fixed').getByText('Fortgeschritten').click();

    // Fill optional fields
    await page.fill('#ex-duration', '15');
    await page.fill('#ex-hints', 'Hinweis 1\nHinweis 2');
    await page.fill('#ex-tags', 'test, e2e');

    // Submit via the submit button in the modal
    await page.getByRole('button', { name: 'Übung erstellen' }).click();

    // Modal should close (the form input should no longer be visible)
    await expect(page.locator('#ex-name')).not.toBeVisible();

    // New exercise should appear in the list
    await expect(page.getByText('E2E Test-Übung')).toBeVisible();
  });

  test('validation prevents empty submission', async ({ page }) => {
    await page.getByRole('button', { name: 'Neue Übung erstellen' }).click();

    // Try to submit empty form – HTML required attribute should prevent submission
    await page.getByRole('button', { name: 'Übung erstellen' }).click();

    // The modal should still be visible (form was not submitted)
    await expect(page.locator('#ex-name')).toBeVisible();
  });
});
