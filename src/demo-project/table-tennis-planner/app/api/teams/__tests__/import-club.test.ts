import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock click-tt module
vi.mock('@/import/click-tt', () => ({
  scrapeClubTeams: vi.fn(),
  scrapeClickTT: vi.fn(),
}));

// Mock session
vi.mock('@/lib/session', () => ({
  getSession: vi.fn(),
}));

// Mock prisma
const mockPrisma = vi.hoisted(() => ({
  team: {
    upsert: vi.fn(),
    update: vi.fn(),
  },
}));
vi.mock('@/lib/db', () => ({
  getPrisma: vi.fn().mockResolvedValue(mockPrisma),
}));

import { POST } from '../import-club/route';
import { scrapeClubTeams, scrapeClickTT } from '@/import/click-tt';
import { getSession } from '@/lib/session';
import { NextRequest } from 'next/server';

describe('POST /api/teams/import-club', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('lehnt nicht-authentifizierte Anfragen ab', async () => {
    vi.mocked(getSession).mockResolvedValue({ userId: undefined } as never);

    const req = new NextRequest('http://localhost/api/teams/import-club', {
      method: 'POST',
      body: JSON.stringify({ clubUrl: 'https://example.com' }),
    });
    const res = await POST(req);
    expect(res.status).toBe(403);
  });

  it('lehnt Spieler ab', async () => {
    vi.mocked(getSession).mockResolvedValue({ userId: 'u1', role: 'player' } as never);

    const req = new NextRequest('http://localhost/api/teams/import-club', {
      method: 'POST',
      body: JSON.stringify({ clubUrl: 'https://example.com' }),
    });
    const res = await POST(req);
    expect(res.status).toBe(403);
  });

  it('importiert Teams und synct Ligadaten', async () => {
    vi.mocked(getSession).mockResolvedValue({ userId: 'trainer-1', role: 'trainer' } as never);

    vi.mocked(scrapeClubTeams).mockResolvedValue([
      {
        teamName: 'Erwachsene',
        leagueName: 'Landesliga',
        leagueUrl: 'https://www.mytischtennis.de/click-tt/TTVB/25--26/ligen/Landesliga/gruppe/100/tabelle/gesamt',
        rank: 2,
        points: '20:4',
      },
      {
        teamName: 'Damen',
        leagueName: 'Verbandsliga Damen',
        leagueUrl: 'https://www.mytischtennis.de/click-tt/TTVB/25--26/ligen/Verbandsliga_Damen/gruppe/200/tabelle/gesamt',
        rank: 1,
        points: '24:0',
      },
    ]);

    vi.mocked(scrapeClickTT).mockResolvedValue({
      standings: [{ rank: 1, teamName: 'Test', matchesPlayed: 10, wins: 8, draws: 1, losses: 1, games: '50:30', difference: 20, points: '17:3' }],
      matches: [],
    });

    let upsertCallCount = 0;
    vi.mocked(mockPrisma.team.upsert).mockImplementation(async () => {
      upsertCallCount++;
      return {
        id: `team-${upsertCallCount}`, name: upsertCallCount === 1 ? 'Erwachsene' : 'Damen',
        clickTtUrl: 'url', leagueData: null, lastSync: null, createdAt: new Date(), updatedAt: new Date(),
      } as never;
    });

    vi.mocked(mockPrisma.team.update).mockResolvedValue({} as never);

    const req = new NextRequest('http://localhost/api/teams/import-club', {
      method: 'POST',
      body: JSON.stringify({ clubUrl: 'https://www.mytischtennis.de/click-tt/TTVB/25--26/verein/1025/mannschaften' }),
    });
    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.imported).toBe(2);
    expect(scrapeClubTeams).toHaveBeenCalledWith(expect.stringContaining('mannschaften'));
    expect(mockPrisma.team.upsert).toHaveBeenCalledTimes(2);
  });

  it('gibt Fehler bei fehlender clubUrl', async () => {
    vi.mocked(getSession).mockResolvedValue({ userId: 'trainer-1', role: 'trainer' } as never);

    const req = new NextRequest('http://localhost/api/teams/import-club', {
      method: 'POST',
      body: JSON.stringify({}),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it('lehnt nicht-mytischtennis.de URLs ab', async () => {
    vi.mocked(getSession).mockResolvedValue({ userId: 'trainer-1', role: 'trainer' } as never);

    const req = new NextRequest('http://localhost/api/teams/import-club', {
      method: 'POST',
      body: JSON.stringify({ clubUrl: 'http://localhost:3000/api/auth/me' }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toContain('mytischtennis.de');
  });

  it('erstellt Team auch wenn Sync fehlschlägt', async () => {
    vi.mocked(getSession).mockResolvedValue({ userId: 'trainer-1', role: 'trainer' } as never);

    vi.mocked(scrapeClubTeams).mockResolvedValue([
      {
        teamName: 'Erwachsene',
        leagueName: 'Landesliga',
        leagueUrl: 'https://www.mytischtennis.de/click-tt/TTVB/25--26/ligen/Landesliga/gruppe/100/tabelle/gesamt',
        rank: 2,
        points: '20:4',
      },
    ]);

    // Sync schlägt fehl
    vi.mocked(scrapeClickTT).mockRejectedValue(new Error('Network error'));

    vi.mocked(mockPrisma.team.upsert).mockResolvedValue({
      id: 'team-1', name: 'Erwachsene', clickTtUrl: 'url', leagueData: null, lastSync: null, createdAt: new Date(), updatedAt: new Date(),
    } as never);

    const req = new NextRequest('http://localhost/api/teams/import-club', {
      method: 'POST',
      body: JSON.stringify({ clubUrl: 'https://www.mytischtennis.de/click-tt/TTVB/25--26/verein/1025/mannschaften' }),
    });
    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.imported).toBe(1);
    expect(data.teams[0].name).toBe('Erwachsene');
    expect(data.teams[0].synced).toBe(false);
    // prisma.team.update sollte NICHT aufgerufen worden sein (Sync ist fehlgeschlagen)
    expect(mockPrisma.team.update).not.toHaveBeenCalled();
  });
});
