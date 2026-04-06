/** Playwright E2E tests for trainer group management feature. */
import { test, expect } from '@playwright/test';

test.describe('Group Management', () => {
  test.beforeEach(async ({ page }) => {
    // Login as trainer
    await page.goto('/login');
    await page.fill('#username', 'trainer');
    await page.fill('#password', 'trainer123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/trainer');
  });

  test('trainer can view groups in Gruppen tab', async ({ page }) => {
    await page.click('text=Gruppen');
    await expect(page.locator('text=Erwachsene')).toBeVisible();
    await expect(page.locator('text=Schüler')).toBeVisible();
  });

  test('trainer can create a new group', async ({ page }) => {
    await page.click('text=Gruppen');
    await page.click('text=Neue Gruppe erstellen');
    await page.fill('input[placeholder="z.B. Jugend"]', 'Senioren');
    await page.fill('input[placeholder="Kurze Beschreibung der Gruppe"]', 'Ü60 Spieler');
    await page.click('button:has-text("Erstellen")');
    await expect(page.locator('text=Senioren')).toBeVisible();
  });

  test('trainer can edit a group name', async ({ page }) => {
    await page.click('text=Gruppen');
    // Click edit on the first group
    const firstGroup = page.locator('.glass.rounded-2xl').filter({ hasText: 'Erwachsene' });
    await firstGroup.locator('button[aria-label="Gruppe bearbeiten"]').click();
    await page.fill('input[value="Erwachsene"]', 'Erwachsene Montag');
    await page.click('button:has-text("Speichern")');
    await expect(page.locator('text=Erwachsene Montag')).toBeVisible();
  });
});
