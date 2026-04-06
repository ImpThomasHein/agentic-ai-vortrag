/** Unit tests for chat helper functions */
import { describe, it, expect } from 'vitest';
import { buildChatResponse, canDeleteMessage } from '../chat-helpers';

describe('buildChatResponse', () => {
  it('should map a DB record to ChatMessage', () => {
    const dbRecord = {
      id: 'msg-1',
      teamId: 'team-1',
      userId: 'user-1',
      content: 'Hello!',
      imageId: null,
      createdAt: new Date('2025-04-03T10:30:00.000Z'),
      updatedAt: new Date('2025-04-03T10:30:00.000Z'),
      user: {
        username: 'johndoe',
        displayName: 'John Doe',
      },
    };

    const result = buildChatResponse(dbRecord);

    expect(result).toEqual({
      id: 'msg-1',
      teamId: 'team-1',
      userId: 'user-1',
      username: 'johndoe',
      displayName: 'John Doe',
      content: 'Hello!',
      imageId: null,
      createdAt: '2025-04-03T10:30:00.000Z',
      isEdited: false,
    });
  });

  it('should handle image-only messages with null content', () => {
    const dbRecord = {
      id: 'msg-2',
      teamId: 'team-1',
      userId: 'user-1',
      content: null,
      imageId: 'img-1',
      createdAt: new Date('2025-04-03T10:31:00.000Z'),
      updatedAt: new Date('2025-04-03T10:31:00.000Z'),
      user: {
        username: 'janedoe',
        displayName: 'Jane Doe',
      },
    };

    const result = buildChatResponse(dbRecord);

    expect(result.content).toBeNull();
    expect(result.imageId).toBe('img-1');
    expect(result.isEdited).toBe(false);
  });

  it('should set isEdited true when updatedAt differs from createdAt', () => {
    const dbRecord = {
      id: 'msg-3',
      teamId: 'team-1',
      userId: 'user-1',
      content: 'Edited message',
      imageId: null,
      createdAt: new Date('2025-04-03T10:30:00.000Z'),
      updatedAt: new Date('2025-04-03T10:35:00.000Z'),
      user: {
        username: 'johndoe',
        displayName: 'John Doe',
      },
    };

    const result = buildChatResponse(dbRecord);
    expect(result.isEdited).toBe(true);
  });
});

describe('canDeleteMessage', () => {
  it('should allow sender to delete own message', () => {
    expect(canDeleteMessage('user-1', 'user-1', false)).toBe(true);
  });

  it('should allow trainer to delete any message', () => {
    expect(canDeleteMessage('trainer-1', 'user-1', true)).toBe(true);
  });

  it('should not allow non-sender non-trainer to delete', () => {
    expect(canDeleteMessage('user-2', 'user-1', false)).toBe(false);
  });

  it('should allow trainer to delete own message', () => {
    expect(canDeleteMessage('trainer-1', 'trainer-1', true)).toBe(true);
  });
});
