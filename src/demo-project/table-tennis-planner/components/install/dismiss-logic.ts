// Dismiss logic for the install banner.
// Handles localStorage-based dismiss with 7-day reappearance.

const STORAGE_KEY = 'install-banner-dismissed';
const REAPPEAR_DAYS = 7;

export function isDismissed(): boolean {
  if (typeof window === 'undefined') return true;
  const dismissedAt = localStorage.getItem(STORAGE_KEY);
  if (!dismissedAt) return false;

  const dismissedTime = parseInt(dismissedAt, 10);
  if (isNaN(dismissedTime)) return false;

  const daysSince = (Date.now() - dismissedTime) / (1000 * 60 * 60 * 24);
  return daysSince < REAPPEAR_DAYS;
}

export function dismiss(): void {
  localStorage.setItem(STORAGE_KEY, Date.now().toString());
}
