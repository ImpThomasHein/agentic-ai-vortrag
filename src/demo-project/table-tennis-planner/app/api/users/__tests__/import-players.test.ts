import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock dependencies before importing route
vi.mock('@/lib/session', () => ({
  getSession: vi.fn(),
}));

const mockPrisma = vi.hoisted(() => ({
  user: {
    findMany: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
  },
  userRole: {
    findUnique: vi.fn(),
    upsert: vi.fn(),
  },
  team: {
    findMany: vi.fn(),
  },
  teamMember: {
    upsert: vi.fn(),
  },
}));
vi.mock('@/lib/db', () => ({
  getPrisma: vi.fn().mockResolvedValue(mockPrisma),
}));

vi.mock('@/import/click-tt', () => ({
  scrapeClubPlayers: vi.fn(),
}));

vi.mock('bcryptjs', () => ({
  default: { hash: vi.fn().mockResolvedValue('hashed-password') },
}));

import { POST } from '../import-players/route';
import { getSession } from '@/lib/session';
import { scrapeClubPlayers } from '@/import/click-tt';
import { NextRequest } from 'next/server';

function makeRequest(body: Record<string, unknown>) {
  return new NextRequest('http://localhost/api/users/import-players', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

describe('POST /api/users/import-players', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getSession).mockResolvedValue({ userId: 'trainer-1', username: 'trainer', role: 'trainer', displayName: 'Trainer' } as never);

    vi.mocked(mockPrisma.userRole.upsert).mockResolvedValue({
      id: 'role-player-id',
      name: 'player',
      description: 'Spieler',
    });
  });

  it('rejects unauthenticated requests', async () => {
    vi.mocked(getSession).mockResolvedValue({ userId: undefined } as never);

    const res = await POST(makeRequest({ url: 'https://www.mytischtennis.de/click-tt/TTVB/25--26/verein/1025/test/bilanzen/gesamt' }));
    expect(res.status).toBe(403);
  });

  it('rejects non-trainer users', async () => {
    vi.mocked(getSession).mockResolvedValue({ userId: 'u1', username: 'max', role: 'player', displayName: 'Max' } as never);

    const res = await POST(makeRequest({ url: 'https://www.mytischtennis.de/click-tt/TTVB/25--26/verein/1025/test/bilanzen/gesamt' }));
    expect(res.status).toBe(403);
  });

  it('rejects non-mytischtennis URLs', async () => {
    const res = await POST(makeRequest({ url: 'https://evil.com/steal-data' }));
    expect(res.status).toBe(400);
  });

  it('rejects subdomain spoofing URLs', async () => {
    const res = await POST(makeRequest({ url: 'https://evil-mytischtennis.de/data' }));
    expect(res.status).toBe(400);
  });

  it('creates new players and returns results', async () => {
    vi.mocked(scrapeClubPlayers).mockResolvedValue([
      { firstName: 'Max', lastName: 'Mustermann', teamName: 'Erwachsene I' },
      { firstName: 'Lisa', lastName: 'Schmidt', teamName: 'Erwachsene I' },
    ]);

    vi.mocked(mockPrisma.user.findMany).mockResolvedValue([]);
    vi.mocked(mockPrisma.user.create)
      .mockResolvedValueOnce({ id: 'u1', username: 'max.mustermann', displayName: 'Max Mustermann' } as any)
      .mockResolvedValueOnce({ id: 'u2', username: 'lisa.schmidt', displayName: 'Lisa Schmidt' } as any);

    const res = await POST(makeRequest({
      url: 'https://www.mytischtennis.de/click-tt/TTVB/25--26/verein/1025/test/bilanzen/gesamt',
    }));

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.created).toBe(2);
    expect(data.skipped).toBe(0);
    expect(data.players).toHaveLength(2);
  });

  it('skips existing players by displayName match', async () => {
    vi.mocked(scrapeClubPlayers).mockResolvedValue([
      { firstName: 'Max', lastName: 'Mustermann', teamName: 'Erwachsene I' },
    ]);

    vi.mocked(mockPrisma.user.findMany).mockResolvedValue([
      { id: 'existing-id', displayName: 'Max Mustermann' } as any,
    ]);

    const res = await POST(makeRequest({
      url: 'https://www.mytischtennis.de/click-tt/TTVB/25--26/verein/1025/test/bilanzen/gesamt',
    }));

    const data = await res.json();
    expect(data.created).toBe(0);
    expect(data.skipped).toBe(1);
    expect(mockPrisma.user.create).not.toHaveBeenCalled();
  });

  it('assigns players to teams when assignToTeams is true', async () => {
    vi.mocked(scrapeClubPlayers).mockResolvedValue([
      { firstName: 'Max', lastName: 'Mustermann', teamName: 'Erwachsene I' },
    ]);

    vi.mocked(mockPrisma.user.findMany).mockResolvedValue([
      { id: 'existing-id', displayName: 'Max Mustermann' } as any,
    ]);

    vi.mocked(mockPrisma.team.findMany).mockResolvedValue([
      { id: 'team-1', name: 'Erwachsene I' } as any,
    ]);

    const res = await POST(makeRequest({
      url: 'https://www.mytischtennis.de/click-tt/TTVB/25--26/verein/1025/test/bilanzen/gesamt',
      assignToTeams: true,
    }));

    expect(res.status).toBe(200);
    expect(mockPrisma.teamMember.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { teamId_userId: { teamId: 'team-1', userId: 'existing-id' } },
      })
    );
  });

  it('never modifies existing player data', async () => {
    vi.mocked(scrapeClubPlayers).mockResolvedValue([
      { firstName: 'Max', lastName: 'Mustermann', teamName: 'Erwachsene I' },
    ]);

    vi.mocked(mockPrisma.user.findMany).mockResolvedValue([
      { id: 'existing-id', displayName: 'Max Mustermann' } as any,
    ]);

    await POST(makeRequest({
      url: 'https://www.mytischtennis.de/click-tt/TTVB/25--26/verein/1025/test/bilanzen/gesamt',
    }));

    // Existing users must never be updated or overwritten
    expect(mockPrisma.user.create).not.toHaveBeenCalled();
    expect(mockPrisma.user.update).not.toHaveBeenCalled();
  });
});
