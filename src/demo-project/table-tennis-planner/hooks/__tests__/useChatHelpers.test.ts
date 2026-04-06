/** Unit tests for useChat helper functions */
import { describe, it, expect } from 'vitest';
import { mergeMessages, shouldShowDateSeparator } from '../useChatHelpers';
import type { ChatMessage } from '@/lib/types';

function makeMessage(id: string, createdAt: string): ChatMessage {
  return {
    id,
    teamId: 'team-1',
    userId: 'user-1',
    username: 'max',
    displayName: 'Max',
    content: `Message ${id}`,
    imageId: null,
    createdAt,
    isEdited: false,
  };
}

describe('mergeMessages', () => {
  it('should merge two empty arrays', () => {
    expect(mergeMessages([], [])).toEqual([]);
  });

  it('should return incoming when existing is empty', () => {
    const incoming = [makeMessage('1', '2025-04-03T10:00:00Z')];
    expect(mergeMessages([], incoming)).toEqual(incoming);
  });

  it('should deduplicate messages by id', () => {
    const msg = makeMessage('1', '2025-04-03T10:00:00Z');
    const result = mergeMessages([msg], [msg]);
    expect(result).toHaveLength(1);
  });

  it('should sort by createdAt ascending', () => {
    const older = makeMessage('1', '2025-04-03T09:00:00Z');
    const newer = makeMessage('2', '2025-04-03T11:00:00Z');
    const result = mergeMessages([newer], [older]);
    expect(result[0].id).toBe('1');
    expect(result[1].id).toBe('2');
  });

  it('should merge overlapping sets correctly', () => {
    const msg1 = makeMessage('1', '2025-04-03T09:00:00Z');
    const msg2 = makeMessage('2', '2025-04-03T10:00:00Z');
    const msg3 = makeMessage('3', '2025-04-03T11:00:00Z');

    const result = mergeMessages([msg1, msg2], [msg2, msg3]);
    expect(result).toHaveLength(3);
    expect(result.map((m) => m.id)).toEqual(['1', '2', '3']);
  });
});

describe('shouldShowDateSeparator', () => {
  it('should return true when prev is null (first message)', () => {
    expect(shouldShowDateSeparator(null, '2025-04-03T10:00:00Z')).toBe(true);
  });

  it('should return false for messages on the same day', () => {
    expect(
      shouldShowDateSeparator('2025-04-03T09:00:00Z', '2025-04-03T18:00:00Z')
    ).toBe(false);
  });

  it('should return true for messages on different days', () => {
    expect(
      shouldShowDateSeparator('2025-04-03T23:00:00Z', '2025-04-04T01:00:00Z')
    ).toBe(true);
  });
});
