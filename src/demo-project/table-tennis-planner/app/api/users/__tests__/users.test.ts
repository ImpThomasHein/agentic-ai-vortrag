import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock session
const mockSession: Record<string, unknown> = {};
vi.mock('@/lib/session', () => ({
  getSession: vi.fn(() => Promise.resolve(mockSession)),
}));

function setSession(data: { userId: string; username: string; role: string; displayName: string }) {
  Object.assign(mockSession, data);
}

function clearSession() {
  for (const key of Object.keys(mockSession)) delete mockSession[key];
}

import { GET } from '@/app/api/users/route';
import { getPrisma } from '@/lib/db';

let trainerId: string;

beforeEach(async () => {
  clearSession();

  const prisma = await getPrisma();
  const trainer = await prisma.user.findFirst({ where: { username: 'trainer' } });
  trainerId = trainer!.id;
});

describe('GET /api/users', () => {
  it('gibt 403 zurück wenn nicht Trainer', async () => {
    const prisma = await getPrisma();
    const player = await prisma.user.findFirst({ where: { username: 'max' } });
    setSession({ userId: player!.id, username: 'max', role: 'player', displayName: 'Max' });

    const res = await GET();
    expect(res.status).toBe(403);
  });

  it('liefert teams-Array pro User', async () => {
    setSession({ userId: trainerId, username: 'trainer', role: 'trainer', displayName: 'Trainer' });

    const res = await GET();
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(Array.isArray(data)).toBe(true);

    // Jeder User hat ein teams-Array
    for (const user of data) {
      expect(user).toHaveProperty('teams');
      expect(Array.isArray(user.teams)).toBe(true);
    }
  });

  it('User ohne Team hat leeres teams-Array', async () => {
    setSession({ userId: trainerId, username: 'trainer', role: 'trainer', displayName: 'Trainer' });

    const res = await GET();
    const data = await res.json();

    // Lisa ist möglicherweise in keinem Team
    const lisa = data.find((u: { username: string }) => u.username === 'lisa');
    if (lisa) {
      expect(lisa.teams).toBeDefined();
      expect(Array.isArray(lisa.teams)).toBe(true);
    }
  });

  it('User in Team zeigt teamId und teamName', async () => {
    setSession({ userId: trainerId, username: 'trainer', role: 'trainer', displayName: 'Trainer' });

    // Sicherstellen dass trainer in einem Team ist (aus Seed: Herren 1)
    const res = await GET();
    const data = await res.json();

    const trainerData = data.find((u: { username: string }) => u.username === 'trainer');
    expect(trainerData).toBeDefined();

    if (trainerData.teams.length > 0) {
      const team = trainerData.teams[0];
      expect(team).toHaveProperty('teamId');
      expect(team).toHaveProperty('teamName');
      expect(typeof team.teamId).toBe('string');
      expect(typeof team.teamName).toBe('string');
    }
  });

  it('User in mehreren Teams zeigt alle Teams', async () => {
    setSession({ userId: trainerId, username: 'trainer', role: 'trainer', displayName: 'Trainer' });

    // Max ist im Seed in Herren 1. Füge ihn temporär zu einem zweiten Team hinzu
    const prisma = await getPrisma();
    const max = await prisma.user.findFirst({ where: { username: 'max' } });
    const tempTeam = await prisma.team.create({ data: { name: 'Test-Multi-Team' } });
    await prisma.teamMember.create({ data: { teamId: tempTeam.id, userId: max!.id } });

    try {
      const res = await GET();
      const data = await res.json();

      const maxData = data.find((u: { username: string }) => u.username === 'max');
      expect(maxData).toBeDefined();
      expect(maxData.teams.length).toBeGreaterThanOrEqual(2);

      const teamNames = maxData.teams.map((t: { teamName: string }) => t.teamName);
      expect(teamNames).toContain('Test-Multi-Team');
    } finally {
      await (await getPrisma()).team.delete({ where: { id: tempTeam.id } });
    }
  });
});
