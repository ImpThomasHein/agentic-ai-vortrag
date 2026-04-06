// Unit tests for the push notification server utility
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock web-push before importing the module under test
vi.mock('web-push', () => ({
  default: {
    setVapidDetails: vi.fn(),
    sendNotification: vi.fn(),
  },
  setVapidDetails: vi.fn(),
  sendNotification: vi.fn(),
}));

// Mock prisma
const mockPrisma = vi.hoisted(() => ({
  pushSubscription: {
    findMany: vi.fn(),
    delete: vi.fn(),
  },
}));
vi.mock('@/lib/db', () => ({
  getPrisma: vi.fn().mockResolvedValue(mockPrisma),
}));

import webpush from 'web-push';
import { sendPushNotification } from '../push';

describe('sendPushNotification', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('sends notifications to all subscriptions for given userIds', async () => {
    const mockSubscriptions = [
      { id: 'sub1', userId: 'user1', endpoint: 'https://push.example.com/1', p256dh: 'key1', auth: 'auth1' },
      { id: 'sub2', userId: 'user2', endpoint: 'https://push.example.com/2', p256dh: 'key2', auth: 'auth2' },
    ];

    vi.mocked(mockPrisma.pushSubscription.findMany).mockResolvedValue(mockSubscriptions as never);
    vi.mocked(webpush.sendNotification).mockResolvedValue({} as never);

    await sendPushNotification(['user1', 'user2'], 'Test Title', 'Test Body', '/trainingsplan');

    expect(mockPrisma.pushSubscription.findMany).toHaveBeenCalledWith({
      where: { userId: { in: ['user1', 'user2'] } },
    });
    expect(webpush.sendNotification).toHaveBeenCalledTimes(2);
  });

  it('deletes subscription on 410 Gone response', async () => {
    const mockSubscriptions = [
      { id: 'sub1', userId: 'user1', endpoint: 'https://push.example.com/1', p256dh: 'key1', auth: 'auth1' },
    ];

    vi.mocked(mockPrisma.pushSubscription.findMany).mockResolvedValue(mockSubscriptions as never);
    const error = new Error('Gone') as Error & { statusCode: number };
    error.statusCode = 410;
    vi.mocked(webpush.sendNotification).mockRejectedValue(error);

    await sendPushNotification(['user1'], 'Title', 'Body');

    expect(mockPrisma.pushSubscription.delete).toHaveBeenCalledWith({ where: { id: 'sub1' } });
  });

  it('does nothing when no subscriptions found', async () => {
    vi.mocked(mockPrisma.pushSubscription.findMany).mockResolvedValue([]);

    await sendPushNotification(['user1'], 'Title', 'Body');

    expect(webpush.sendNotification).not.toHaveBeenCalled();
  });

  it('logs errors but does not throw on non-410 failures', async () => {
    const mockSubscriptions = [
      { id: 'sub1', userId: 'user1', endpoint: 'https://push.example.com/1', p256dh: 'key1', auth: 'auth1' },
    ];

    vi.mocked(mockPrisma.pushSubscription.findMany).mockResolvedValue(mockSubscriptions as never);
    vi.mocked(webpush.sendNotification).mockRejectedValue(new Error('Network error'));

    // Should not throw
    await expect(sendPushNotification(['user1'], 'Title', 'Body')).resolves.toBeUndefined();
    expect(mockPrisma.pushSubscription.delete).not.toHaveBeenCalled();
  });
});
