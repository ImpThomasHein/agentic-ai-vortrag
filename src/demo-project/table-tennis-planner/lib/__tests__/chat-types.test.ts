/** Tests for ChatMessage type shape */
import { describe, it, expect } from 'vitest';
import type { ChatMessage } from '../types';

describe('ChatMessage type', () => {
  it('should have all required fields with correct types', () => {
    const message: ChatMessage = {
      id: 'msg-1',
      teamId: 'team-1',
      userId: 'user-1',
      username: 'johndoe',
      displayName: 'John Doe',
      content: 'Hello team!',
      imageId: null,
      createdAt: '2025-04-03T10:30:00.000Z',
      isEdited: false,
    };

    expect(message.id).toBe('msg-1');
    expect(message.teamId).toBe('team-1');
    expect(message.userId).toBe('user-1');
    expect(message.username).toBe('johndoe');
    expect(message.displayName).toBe('John Doe');
    expect(message.content).toBe('Hello team!');
    expect(message.imageId).toBeNull();
    expect(message.createdAt).toBe('2025-04-03T10:30:00.000Z');
  });

  it('should allow null content for image-only messages', () => {
    const imageMessage: ChatMessage = {
      id: 'msg-2',
      teamId: 'team-1',
      userId: 'user-1',
      username: 'johndoe',
      displayName: 'John Doe',
      content: null,
      imageId: 'img-1',
      createdAt: '2025-04-03T10:31:00.000Z',
      isEdited: false,
    };

    expect(imageMessage.content).toBeNull();
    expect(imageMessage.imageId).toBe('img-1');
  });

  it('should allow both content and imageId', () => {
    const mixedMessage: ChatMessage = {
      id: 'msg-3',
      teamId: 'team-1',
      userId: 'user-1',
      username: 'johndoe',
      displayName: 'John Doe',
      content: 'Check this out!',
      imageId: 'img-2',
      createdAt: '2025-04-03T10:32:00.000Z',
      isEdited: false,
    };

    expect(mixedMessage.content).toBe('Check this out!');
    expect(mixedMessage.imageId).toBe('img-2');
  });
});
