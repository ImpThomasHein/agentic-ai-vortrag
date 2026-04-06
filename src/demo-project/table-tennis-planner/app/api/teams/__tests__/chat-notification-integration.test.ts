/** Integration test for getTeamMemberIdsExcept */
import { describe, it, expect, vi } from 'vitest';

// Mock web-push to avoid VAPID config errors
vi.mock('web-push', () => ({
  default: { setVapidDetails: vi.fn(), sendNotification: vi.fn() },
}));

import { getTeamMemberIdsExcept } from '@/lib/push';
import { getPrisma } from '@/lib/db';

describe('getTeamMemberIdsExcept', () => {
  it('should return team member IDs excluding the sender', async () => {
    const prisma = await getPrisma();
    const team = await prisma.team.findFirst({
      where: { name: { contains: 'Herren' } },
      include: { members: true },
    });

    if (!team || team.members.length < 2) {
      // Skip if seed data doesn't have enough members
      return;
    }

    const senderId = team.members[0].userId;
    const result = await getTeamMemberIdsExcept(team.id, senderId);

    expect(result).not.toContain(senderId);
    expect(result.length).toBe(team.members.length - 1);
  });

  it('should return empty array for nonexistent team', async () => {
    const result = await getTeamMemberIdsExcept('nonexistent-team', 'some-user');
    expect(result).toEqual([]);
  });
});
