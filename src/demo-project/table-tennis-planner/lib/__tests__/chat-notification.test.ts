/** Unit tests for chat notification payload builder */
import { describe, it, expect, vi } from 'vitest';

// Mock dependencies before importing module under test
vi.mock('web-push', () => ({
  default: { setVapidDetails: vi.fn(), sendNotification: vi.fn() },
}));
vi.mock('@/lib/db', () => ({
  getPrisma: vi.fn().mockResolvedValue({}),
}));

import { buildChatNotificationPayload } from '../push';

describe('buildChatNotificationPayload', () => {
  it('should build payload with team name as title', () => {
    const payload = buildChatNotificationPayload('Herren 1', 'Max', 'Hallo zusammen!');
    expect(payload.title).toBe('Herren 1');
  });

  it('should include sender name and message content in body', () => {
    const payload = buildChatNotificationPayload('Herren 1', 'Max', 'Hallo zusammen!');
    expect(payload.body).toContain('Max');
    expect(payload.body).toContain('Hallo zusammen!');
  });

  it('should truncate long messages to 80 characters', () => {
    const longMessage = 'A'.repeat(100);
    const payload = buildChatNotificationPayload('Herren 1', 'Max', longMessage);
    // Body = "Max: " + truncated message
    expect(payload.body).toContain('…');
    // The message part should be at most 80 chars (79 + ellipsis)
    const messagePartLength = payload.body.length - 'Max: '.length;
    expect(messagePartLength).toBeLessThanOrEqual(80);
  });

  it('should show image placeholder for null content', () => {
    const payload = buildChatNotificationPayload('Herren 1', 'Max', null);
    expect(payload.body).toContain('Max');
    expect(payload.body).toContain('Bild');
  });

  it('should not truncate messages at exactly 80 characters', () => {
    const exactMessage = 'B'.repeat(80);
    const payload = buildChatNotificationPayload('Herren 1', 'Max', exactMessage);
    expect(payload.body).not.toContain('…');
  });
});
