// e2e/notes.spec.ts
/**
 * Integration tests for the Trainer Notes (Notizen) CRUD flow.
 * Covers create, read, edit, and delete of notes via the Notizen tab.
 */
import { test, expect } from '@playwright/test';

test.describe('Trainer Notes', () => {
  test.beforeEach(async ({ page }) => {
    // Login as trainer
    await page.goto('/login');
    await page.fill('#username', 'trainer');
    await page.fill('#password', 'trainer123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/trainer');
  });

  test('trainer can create, edit, and delete a note', async ({ page }) => {
    // Navigate to Notizen tab
    await page.click('text=Notizen');
    await expect(page.getByText('Trainer-Notizen')).toBeVisible();

    // --- Create ---
    await page.getByRole('button', { name: '+ Neue Notiz' }).click();

    // Fill in the create form
    await page.fill('input[placeholder="z.B. Erwärmung, Abschlussspiel..."]', 'Test-Erwärmung');
    await page.fill('textarea[placeholder="Beschreibe die Notiz..."]', 'Laufen und Dehnen für 10 Minuten');

    await page.getByRole('button', { name: 'Erstellen' }).click();

    // Note should appear in the list
    await expect(page.getByText('Test-Erwärmung')).toBeVisible();
    await expect(page.getByText('Laufen und Dehnen für 10 Minuten')).toBeVisible();

    // --- Edit ---
    await page.getByRole('button', { name: 'Notiz bearbeiten' }).click();

    // Clear title and type new value
    const titleInput = page.locator('input[placeholder="z.B. Erwärmung, Abschlussspiel..."]');
    await titleInput.fill('Erwärmung: Rundlauf');

    await page.getByRole('button', { name: 'Speichern' }).click();

    // Updated note should appear
    await expect(page.getByText('Erwärmung: Rundlauf')).toBeVisible();

    // --- Delete ---
    await page.getByRole('button', { name: 'Notiz löschen' }).click();

    // Confirm dialog should appear — click the red "Löschen" button
    await page.getByRole('button', { name: 'Löschen' }).last().click();

    // Note should no longer be visible
    await expect(page.getByText('Erwärmung: Rundlauf')).not.toBeVisible();
  });
});
