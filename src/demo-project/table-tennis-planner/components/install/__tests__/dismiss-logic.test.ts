// @vitest-environment jsdom
// Unit tests for install banner dismiss logic.
import { describe, it, expect, beforeEach } from 'vitest';
import { isDismissed, dismiss } from '../dismiss-logic';

describe('dismiss-logic', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns false when nothing is stored', () => {
    expect(isDismissed()).toBe(false);
  });

  it('returns true right after dismissing', () => {
    dismiss();
    expect(isDismissed()).toBe(true);
  });

  it('returns false after 7 days have passed', () => {
    const eightDaysAgo = Date.now() - 8 * 24 * 60 * 60 * 1000;
    localStorage.setItem('install-banner-dismissed', eightDaysAgo.toString());
    expect(isDismissed()).toBe(false);
  });

  it('returns true within 7 days', () => {
    const sixDaysAgo = Date.now() - 6 * 24 * 60 * 60 * 1000;
    localStorage.setItem('install-banner-dismissed', sixDaysAgo.toString());
    expect(isDismissed()).toBe(true);
  });

  it('returns false for invalid stored value', () => {
    localStorage.setItem('install-banner-dismissed', 'not-a-number');
    expect(isDismissed()).toBe(false);
  });

  it('dismiss() stores current timestamp', () => {
    const before = Date.now();
    dismiss();
    const stored = parseInt(localStorage.getItem('install-banner-dismissed')!, 10);
    expect(stored).toBeGreaterThanOrEqual(before);
    expect(stored).toBeLessThanOrEqual(Date.now());
  });
});
