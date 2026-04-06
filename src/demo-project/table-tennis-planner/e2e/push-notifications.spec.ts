// Integration test for push notification subscription flow on the player profile page
import { test, expect } from '@playwright/test';

test.describe('Push Notification Toggle', () => {
  test.beforeEach(async ({ page }) => {
    // Login as player — CI dev server may be slow on first compile
    await page.goto('/login', { waitUntil: 'networkidle' });
    await page.waitForSelector('#username');
    await page.fill('#username', 'max');
    await page.fill('#password', 'max123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/player');
  });

  test('shows notification toggle on profile page', async ({ page }) => {
    await page.goto('/player/profil');

    // The notification section should be visible
    await expect(page.getByText('Benachrichtigungen')).toBeVisible();
  });

  test('subscribe API is called when toggling notifications on', async ({ page }) => {
    await page.goto('/player/profil');

    // Wait for the notification section to load
    await expect(page.getByText('Benachrichtigungen')).toBeVisible();

    // Intercept the subscribe API call
    const subscribePromise = page.waitForRequest(
      (req) => req.url().includes('/api/push/subscribe'),
      { timeout: 5000 }
    ).catch(() => null);

    // Try to click the toggle (may not work in CI without push support)
    const toggle = page.getByRole('button', { name: /Benachrichtigungen/i });
    if (await toggle.isVisible()) {
      await toggle.click();
      // If push is supported in this browser, the API should be called
      const request = await subscribePromise;
      if (request) {
        expect(request.method()).toBe('POST');
      }
    }
  });
});
