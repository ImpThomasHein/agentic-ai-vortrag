// Unit tests for push notification toggle business logic
import { describe, it, expect } from 'vitest';
import { getPushSupportStatus } from '../notification-toggle-logic';

describe('getPushSupportStatus', () => {
  it('returns "unsupported" when serviceWorker is not available', () => {
    const result = getPushSupportStatus(false, false);
    expect(result).toBe('unsupported');
  });

  it('returns "unsupported" when PushManager is not available', () => {
    const result = getPushSupportStatus(true, false);
    expect(result).toBe('unsupported');
  });

  it('returns "supported" when both serviceWorker and PushManager are available', () => {
    const result = getPushSupportStatus(true, true);
    expect(result).toBe('supported');
  });
});
