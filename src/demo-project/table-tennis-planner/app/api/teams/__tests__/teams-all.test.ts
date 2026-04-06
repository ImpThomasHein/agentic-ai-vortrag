import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock session – muss vor Route-Imports stehen
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

import { GET } from '@/app/api/teams/all/route';
import { getPrisma } from '@/lib/db';

let trainerId: string;
let playerId: string;

beforeEach(async () => {
  clearSession();

  const prisma = await getPrisma();
  const trainer = await prisma.user.findFirst({ where: { username: 'trainer' } });
  const player = await prisma.user.findFirst({ where: { username: 'max' } });

  trainerId = trainer!.id;
  playerId = player!.id;

  // Aufräumen von vorherigen Test-Läufen
  await prisma.team.deleteMany({ where: { name: 'Fremd-Team Test' } });
});

describe('GET /api/teams/all', () => {
  it('gibt 403 zurück wenn nicht angemeldet', async () => {
    const res = await GET();
    expect(res.status).toBe(403);
  });

  it('gibt 403 zurück für Spieler', async () => {
    setSession({ userId: playerId, username: 'max', role: 'player', displayName: 'Max' });

    const res = await GET();
    expect(res.status).toBe(403);
  });

  it('gibt alle Teams zurück für Trainer', async () => {
    setSession({ userId: trainerId, username: 'trainer', role: 'trainer', displayName: 'Trainer' });

    const res = await GET();
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(Array.isArray(data)).toBe(true);

    // Mindestens das Seed-Team "Herren 1" sollte vorhanden sein
    const prisma = await getPrisma();
    const allTeamsInDb = await prisma.team.findMany();
    expect(data.length).toBe(allTeamsInDb.length);
  });

  it('gibt auch Teams zurück in denen Trainer nicht Mitglied ist', async () => {
    setSession({ userId: trainerId, username: 'trainer', role: 'trainer', displayName: 'Trainer' });

    // Team erstellen ohne Trainer als Mitglied
    const prisma = await getPrisma();
    const extraTeam = await prisma.team.create({ data: { name: 'Fremd-Team Test' } });

    try {
      const res = await GET();
      const data = await res.json();

      const found = data.find((t: { name: string }) => t.name === 'Fremd-Team Test');
      expect(found).toBeDefined();
      expect(found.memberCount).toBe(0);
    } finally {
      await (await getPrisma()).team.delete({ where: { id: extraTeam.id } });
    }
  });

  it('gibt Teams alphabetisch sortiert zurück', async () => {
    setSession({ userId: trainerId, username: 'trainer', role: 'trainer', displayName: 'Trainer' });

    const res = await GET();
    const data = await res.json();

    if (data.length >= 2) {
      for (let i = 1; i < data.length; i++) {
        expect(data[i].name.localeCompare(data[i - 1].name)).toBeGreaterThanOrEqual(0);
      }
    }
  });
});
