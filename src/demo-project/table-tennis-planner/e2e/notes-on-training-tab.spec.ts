import { test, expect } from '@playwright/test';

test.describe('Notes on Training Tab', () => {
  test.beforeEach(async ({ page }) => {
    // Login as trainer (dev seed credentials)
    await page.goto('/login');
    await page.fill('input[name="username"]', 'trainer');
    await page.fill('input[name="password"]', 'trainer123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/trainer');
  });

  test('no separate Notizen tab exists', async ({ page }) => {
    const tabs = page.locator('button').filter({ hasText: 'Notizen' });
    await expect(tabs).toHaveCount(0);
  });

  test('Neue Notiz button is visible on Training tab', async ({ page }) => {
    await expect(page.getByText('Neue Notiz')).toBeVisible();
  });

  test('can create a note from the Training tab', async ({ page }) => {
    await page.click('text=Neue Notiz');
    await page.fill('input[placeholder*="Erwärmung"]', 'Testnotiz');
    await page.fill('textarea[placeholder*="Beschreibe"]', 'Testbeschreibung');
    await page.click('text=Erstellen');

    // Note should appear in the exercise list
    await expect(page.getByText('Testnotiz')).toBeVisible();
  });
});
