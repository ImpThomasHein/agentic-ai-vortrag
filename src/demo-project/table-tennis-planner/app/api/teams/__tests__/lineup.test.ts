/**
 * Integration tests for the match lineup API endpoints.
 * Tests GET and PUT handlers for /api/teams/[id]/matches/[matchId]/lineup.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { NextRequest } from 'next/server';

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

import { GET, PUT } from '@/app/api/teams/[id]/matches/[matchId]/lineup/route';
import { getPrisma } from '@/lib/db';

let trainerId: string;
let captainId: string;
let playerId: string;
let lisaId: string;
let testTeamId: string;

// A match ID for an active (non-completed) match
const activeMatchId = '2026-04-12-tsv-oranienburg-ttf-boetzow';
// A match ID for a completed match
const completedMatchId = '2026-01-10-ttf-boetzow-tsv-oranienburg';

beforeEach(async () => {
  clearSession();

  const prisma = await getPrisma();
  const trainer = await prisma.user.findFirst({ where: { username: 'trainer' } });
  const max = await prisma.user.findFirst({ where: { username: 'max' } });
  const lisa = await prisma.user.findFirst({ where: { username: 'lisa' } });

  trainerId = trainer!.id;
  playerId = max!.id;
  lisaId = lisa!.id;

  // Clean up and create test team with leagueData containing both active and completed matches
  await prisma.team.deleteMany({ where: { name: 'Test-Team Lineup' } });
  const team = await prisma.team.create({
    data: {
      name: 'Test-Team Lineup',
      leagueData: JSON.stringify({
        standings: [],
        matches: [
          {
            matchId: activeMatchId,
            date: '2026-04-12',
            time: '14:00',
            homeTeam: 'TSV Oranienburg',
            awayTeam: 'TTF Bötzow',
            score: null,
            isHome: false,
            isCompleted: false,
          },
          {
            matchId: completedMatchId,
            date: '2026-01-10',
            time: '14:00',
            homeTeam: 'TTF Bötzow',
            awayTeam: 'TSV Oranienburg',
            score: '9:1',
            isHome: true,
            isCompleted: true,
          },
        ],
      }),
      members: {
        create: [
          { userId: trainerId, role: 'player' },
          { userId: playerId, role: 'captain' },
        ],
      },
    },
  });
  testTeamId = team.id;
  captainId = playerId; // max is the captain in this team
});

afterEach(async () => {
  const prisma = await getPrisma();
  await prisma.team.deleteMany({ where: { name: 'Test-Team Lineup' } });
});

describe('Match Lineup API', () => {
  describe('GET /api/teams/[id]/matches/[matchId]/lineup', () => {
    it('returns empty lineup when not set (200)', async () => {
      setSession({ userId: trainerId, username: 'trainer', role: 'trainer', displayName: 'Trainer' });

      const res = await GET(
        new NextRequest(`http://localhost/api/teams/${testTeamId}/matches/${activeMatchId}/lineup`),
        { params: Promise.resolve({ id: testTeamId, matchId: activeMatchId }) }
      );

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data).toHaveProperty('lineup');
      expect(Array.isArray(data.lineup)).toBe(true);
      expect(data.lineup.length).toBe(0);
    });

    it('returns lineup with driver marked (200)', async () => {
      setSession({ userId: captainId, username: 'max', role: 'player', displayName: 'Max Schneider' });

      const prisma = await getPrisma();
      // Create two lineup entries, one as driver
      await prisma.matchLineup.create({
        data: { teamId: testTeamId, matchId: activeMatchId, userId: captainId, isDriver: true },
      });
      await prisma.matchLineup.create({
        data: { teamId: testTeamId, matchId: activeMatchId, userId: trainerId, isDriver: false },
      });

      const res = await GET(
        new NextRequest(`http://localhost/api/teams/${testTeamId}/matches/${activeMatchId}/lineup`),
        { params: Promise.resolve({ id: testTeamId, matchId: activeMatchId }) }
      );

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.lineup.length).toBe(2);
      const driver = data.lineup.find((e: { userId: string }) => e.userId === captainId);
      expect(driver).toMatchObject({ userId: captainId, isDriver: true });
      expect(typeof driver.displayName).toBe('string');
      const nonDriver = data.lineup.find((e: { userId: string }) => e.userId === trainerId);
      expect(nonDriver).toMatchObject({ userId: trainerId, isDriver: false });
    });

    it('returns 403 if not a team member', async () => {
      setSession({ userId: lisaId, username: 'lisa', role: 'player', displayName: 'Lisa' });

      const res = await GET(
        new NextRequest(`http://localhost/api/teams/${testTeamId}/matches/${activeMatchId}/lineup`),
        { params: Promise.resolve({ id: testTeamId, matchId: activeMatchId }) }
      );

      expect(res.status).toBe(403);
    });

    it('returns 200 for trainer who is not a team member', async () => {
      setSession({ userId: lisaId, username: 'lisa', role: 'trainer', displayName: 'Lisa Trainer' });

      const res = await GET(
        new NextRequest(`http://localhost/api/teams/${testTeamId}/matches/${activeMatchId}/lineup`),
        { params: Promise.resolve({ id: testTeamId, matchId: activeMatchId }) }
      );

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data).toHaveProperty('lineup');
    });
  });

  describe('PUT /api/teams/[id]/matches/[matchId]/lineup', () => {
    it('trainer (not a team member) can set lineup (200)', async () => {
      setSession({ userId: lisaId, username: 'lisa', role: 'trainer', displayName: 'Lisa Trainer' });

      const req = new NextRequest(
        `http://localhost/api/teams/${testTeamId}/matches/${activeMatchId}/lineup`,
        {
          method: 'PUT',
          body: JSON.stringify({ players: [captainId], driverUserId: null }),
        }
      );
      const res = await PUT(req, { params: Promise.resolve({ id: testTeamId, matchId: activeMatchId }) });

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.lineup.length).toBe(1);
    });

    it('captain can set lineup (200)', async () => {
      setSession({ userId: captainId, username: 'max', role: 'player', displayName: 'Max Schneider' });

      const req = new NextRequest(
        `http://localhost/api/teams/${testTeamId}/matches/${activeMatchId}/lineup`,
        {
          method: 'PUT',
          body: JSON.stringify({ players: [captainId, trainerId], driverUserId: captainId }),
        }
      );
      const res = await PUT(req, { params: Promise.resolve({ id: testTeamId, matchId: activeMatchId }) });

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data).toHaveProperty('lineup');
      expect(data.lineup.length).toBe(2);
      const driver = data.lineup.find((e: { userId: string }) => e.userId === captainId);
      expect(driver.isDriver).toBe(true);
    });

    it('trainer can set lineup (200)', async () => {
      setSession({ userId: trainerId, username: 'trainer', role: 'trainer', displayName: 'Trainer' });

      const req = new NextRequest(
        `http://localhost/api/teams/${testTeamId}/matches/${activeMatchId}/lineup`,
        {
          method: 'PUT',
          body: JSON.stringify({ players: [captainId], driverUserId: null }),
        }
      );
      const res = await PUT(req, { params: Promise.resolve({ id: testTeamId, matchId: activeMatchId }) });

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.lineup.length).toBe(1);
    });

    it('player cannot set lineup (403)', async () => {
      // Make trainerId act as a regular player (not captain) — trainerId has role 'player' in the team
      setSession({ userId: trainerId, username: 'trainer', role: 'player', displayName: 'Trainer' });

      const req = new NextRequest(
        `http://localhost/api/teams/${testTeamId}/matches/${activeMatchId}/lineup`,
        {
          method: 'PUT',
          body: JSON.stringify({ players: [captainId], driverUserId: null }),
        }
      );
      const res = await PUT(req, { params: Promise.resolve({ id: testTeamId, matchId: activeMatchId }) });

      expect(res.status).toBe(403);
    });

    it('returns 400 if player not a team member', async () => {
      setSession({ userId: captainId, username: 'max', role: 'player', displayName: 'Max Schneider' });

      const req = new NextRequest(
        `http://localhost/api/teams/${testTeamId}/matches/${activeMatchId}/lineup`,
        {
          method: 'PUT',
          body: JSON.stringify({ players: [lisaId], driverUserId: null }),
        }
      );
      const res = await PUT(req, { params: Promise.resolve({ id: testTeamId, matchId: activeMatchId }) });

      expect(res.status).toBe(400);
    });

    it('returns 400 for completed match', async () => {
      setSession({ userId: captainId, username: 'max', role: 'player', displayName: 'Max Schneider' });

      const req = new NextRequest(
        `http://localhost/api/teams/${testTeamId}/matches/${completedMatchId}/lineup`,
        {
          method: 'PUT',
          body: JSON.stringify({ players: [captainId], driverUserId: null }),
        }
      );
      const res = await PUT(req, { params: Promise.resolve({ id: testTeamId, matchId: completedMatchId }) });

      expect(res.status).toBe(400);
    });

    it('replaces entire lineup on update (200)', async () => {
      setSession({ userId: captainId, username: 'max', role: 'player', displayName: 'Max Schneider' });

      const prisma = await getPrisma();
      // Pre-create a lineup entry
      await prisma.matchLineup.create({
        data: { teamId: testTeamId, matchId: activeMatchId, userId: captainId, isDriver: false },
      });

      // Now replace with just trainerId
      const req = new NextRequest(
        `http://localhost/api/teams/${testTeamId}/matches/${activeMatchId}/lineup`,
        {
          method: 'PUT',
          body: JSON.stringify({ players: [trainerId], driverUserId: trainerId }),
        }
      );
      const res = await PUT(req, { params: Promise.resolve({ id: testTeamId, matchId: activeMatchId }) });

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.lineup.length).toBe(1);
      expect(data.lineup[0].userId).toBe(trainerId);
      expect(data.lineup[0].isDriver).toBe(true);

      // Verify old entry is gone
      const entries = await prisma.matchLineup.findMany({
        where: { teamId: testTeamId, matchId: activeMatchId },
      });
      expect(entries.length).toBe(1);
      expect(entries[0].userId).toBe(trainerId);
    });
  });
});
