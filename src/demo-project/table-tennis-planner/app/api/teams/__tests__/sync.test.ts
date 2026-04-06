import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { NextRequest } from 'next/server';

// Mock session
const mockSession: Record<string, unknown> = {};
vi.mock('@/lib/session', () => ({
  getSession: vi.fn(() => Promise.resolve(mockSession)),
}));

// Mock click-TT scraper
vi.mock('@/import/click-tt', () => ({
  scrapeClickTT: vi.fn(() =>
    Promise.resolve({
      standings: [
        { rank: 1, teamName: 'TT-Freunde Bötzow', matchesPlayed: 10, wins: 8, draws: 1, losses: 1, games: '70:30', difference: 40, points: '17:3' },
        { rank: 2, teamName: 'Gegner FC', matchesPlayed: 10, wins: 5, draws: 2, losses: 3, games: '50:50', difference: 0, points: '12:8' },
      ],
      matches: [
        { date: '2026-03-15', time: '18:00', homeTeam: 'TT-Freunde Bötzow', awayTeam: 'Gegner FC', score: null, isHome: false, isCompleted: false, clickTtTeamName: null },
      ],
    })
  ),
}));

function setSession(data: { userId: string; username: string; role: string; displayName: string }) {
  Object.assign(mockSession, data);
}

function clearSession() {
  for (const key of Object.keys(mockSession)) delete mockSession[key];
}

import { POST } from '@/app/api/teams/[id]/sync/route';
import { getPrisma } from '@/lib/db';

let trainerId: string;
let playerId: string;
let testTeamId: string;

beforeEach(async () => {
  clearSession();

  const prisma = await getPrisma();
  const trainer = await prisma.user.findFirst({ where: { username: 'trainer' } });
  const player = await prisma.user.findFirst({ where: { username: 'max' } });
  trainerId = trainer!.id;
  playerId = player!.id;

  // Aufräumen, dann Testteam erstellen
  await prisma.team.deleteMany({ where: { name: { in: ['Test-Team Sync', 'Test-Team Keine URL'] } } });
  const team = await prisma.team.create({
    data: {
      name: 'Test-Team Sync',
      clickTtUrl: 'https://www.mytischtennis.de/click-tt/test',
    },
  });
  testTeamId = team.id;
});

afterEach(async () => {
  const prisma = await getPrisma();
  await prisma.team.deleteMany({ where: { name: { in: ['Test-Team Sync', 'Test-Team Keine URL'] } } });
});

describe('POST /api/teams/[id]/sync', () => {
  it('synchronisiert click-TT Daten und liefert leagueTeamNames', async () => {
    setSession({ userId: trainerId, username: 'trainer', role: 'trainer', displayName: 'Trainer' });

    const res = await POST(
      new NextRequest(`http://localhost/api/teams/${testTeamId}/sync`, { method: 'POST' }),
      { params: Promise.resolve({ id: testTeamId }) }
    );
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.matchesCount).toBe(1);
    expect(data.lastSync).toBeDefined();
    expect(data.leagueTeamNames).toEqual(['TT-Freunde Bötzow', 'Gegner FC']);
    // No clickTtTeamName sent → null returned
    expect(data.clickTtTeamName).toBeNull();

    // Prüfe dass leagueData in DB gespeichert wurde
    const prisma = await getPrisma();
    const team = await prisma.team.findUnique({ where: { id: testTeamId } });
    expect(team!.leagueData).toBeTruthy();

    const leagueData = JSON.parse(team!.leagueData!);
    expect(leagueData.standings).toHaveLength(2);
    // Without clickTtTeamName, isHome is false
    expect(leagueData.matches[0].isHome).toBe(false);
    expect(leagueData.clickTtTeamName).toBeNull();
  });

  it('gibt 403 für Spieler', async () => {
    setSession({ userId: playerId, username: 'max', role: 'player', displayName: 'Max' });

    const res = await POST(
      new NextRequest(`http://localhost/api/teams/${testTeamId}/sync`, { method: 'POST' }),
      { params: Promise.resolve({ id: testTeamId }) }
    );
    expect(res.status).toBe(403);
  });

  it('gibt 400 ohne click-TT URL', async () => {
    setSession({ userId: trainerId, username: 'trainer', role: 'trainer', displayName: 'Trainer' });

    // Team ohne URL erstellen
    const prisma = await getPrisma();
    const teamNoUrl = await prisma.team.create({ data: { name: 'Test-Team Keine URL' } });

    const res = await POST(
      new NextRequest(`http://localhost/api/teams/${teamNoUrl.id}/sync`, { method: 'POST' }),
      { params: Promise.resolve({ id: teamNoUrl.id }) }
    );
    expect(res.status).toBe(400);

    await (await getPrisma()).team.delete({ where: { id: teamNoUrl.id } });
  });

  it('speichert clickTtTeamName wenn im Body gesendet', async () => {
    setSession({ userId: trainerId, username: 'trainer', role: 'trainer', displayName: 'Trainer' });

    const res = await POST(
      new NextRequest(`http://localhost/api/teams/${testTeamId}/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clickTtTeamName: 'TT-Freunde Bötzow' }),
      }),
      { params: Promise.resolve({ id: testTeamId }) }
    );
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.clickTtTeamName).toBe('TT-Freunde Bötzow');

    // Verify stored in DB
    const prisma = await getPrisma();
    const team = await prisma.team.findUnique({ where: { id: testTeamId } });
    const leagueData = JSON.parse(team!.leagueData!);
    expect(leagueData.clickTtTeamName).toBe('TT-Freunde Bötzow');
  });

  it('bewahrt existierenden clickTtTeamName bei Re-Sync ohne Body', async () => {
    setSession({ userId: trainerId, username: 'trainer', role: 'trainer', displayName: 'Trainer' });

    // First sync with explicit name
    await POST(
      new NextRequest(`http://localhost/api/teams/${testTeamId}/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clickTtTeamName: 'TT-Freunde Bötzow' }),
      }),
      { params: Promise.resolve({ id: testTeamId }) }
    );

    // Re-sync without body → should preserve existing name
    const res = await POST(
      new NextRequest(`http://localhost/api/teams/${testTeamId}/sync`, { method: 'POST' }),
      { params: Promise.resolve({ id: testTeamId }) }
    );
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.clickTtTeamName).toBe('TT-Freunde Bötzow');
  });

  it('setzt isHome korrekt basierend auf clickTtTeamName', async () => {
    setSession({ userId: trainerId, username: 'trainer', role: 'trainer', displayName: 'Trainer' });

    const res = await POST(
      new NextRequest(`http://localhost/api/teams/${testTeamId}/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clickTtTeamName: 'TT-Freunde Bötzow' }),
      }),
      { params: Promise.resolve({ id: testTeamId }) }
    );
    expect(res.status).toBe(200);

    const prisma = await getPrisma();
    const team = await prisma.team.findUnique({ where: { id: testTeamId } });
    const leagueData = JSON.parse(team!.leagueData!);
    // homeTeam is 'TT-Freunde Bötzow' → isHome should be true
    expect(leagueData.matches[0].isHome).toBe(true);
  });

  it('ignoriert ungültigen clickTtTeamName der nicht in Standings vorkommt', async () => {
    setSession({ userId: trainerId, username: 'trainer', role: 'trainer', displayName: 'Trainer' });

    const res = await POST(
      new NextRequest(`http://localhost/api/teams/${testTeamId}/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clickTtTeamName: 'Unbekanntes Team' }),
      }),
      { params: Promise.resolve({ id: testTeamId }) }
    );
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.clickTtTeamName).toBeNull();
  });

  it('gibt 404 bei unbekanntem Team', async () => {
    setSession({ userId: trainerId, username: 'trainer', role: 'trainer', displayName: 'Trainer' });

    const res = await POST(
      new NextRequest('http://localhost/api/teams/nonexistent/sync', { method: 'POST' }),
      { params: Promise.resolve({ id: 'nonexistent' }) }
    );
    expect(res.status).toBe(404);
  });
});
