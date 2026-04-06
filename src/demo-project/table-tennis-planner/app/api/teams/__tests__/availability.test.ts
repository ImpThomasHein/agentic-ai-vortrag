/**
 * Integration tests for the match availability API endpoints.
 * Tests GET and PUT handlers for /api/teams/[id]/matches/[matchId]/availability.
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

import { GET, PUT } from '@/app/api/teams/[id]/matches/[matchId]/availability/route';
import { getPrisma } from '@/lib/db';

let trainerId: string;
let playerId: string;
let lisaId: string;
let testTeamId: string;

// A match ID for an active (non-completed) match
const activeMatchId = '2026-04-12-tsv-oranienburg-ttf-boetzow';
// A match ID for a completed match
const completedMatchId = '2026-01-10-ttf-boetzow-tsv-oranienburg';
// A match ID that does not exist in leagueData
const unknownMatchId = 'unknown-match-id';

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
  await prisma.team.deleteMany({ where: { name: 'Test-Team Availability' } });
  const team = await prisma.team.create({
    data: {
      name: 'Test-Team Availability',
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
          { userId: trainerId },
          { userId: playerId },
        ],
      },
    },
  });
  testTeamId = team.id;
});

afterEach(async () => {
  const prisma = await getPrisma();
  await prisma.team.deleteMany({ where: { name: 'Test-Team Availability' } });
});

describe('Match Availability API', () => {
  describe('GET /api/teams/[id]/matches/[matchId]/availability', () => {
    it('returns empty list when no reports exist (200)', async () => {
      setSession({ userId: trainerId, username: 'trainer', role: 'trainer', displayName: 'Trainer' });

      const res = await GET(
        new NextRequest(`http://localhost/api/teams/${testTeamId}/matches/${activeMatchId}/availability`),
        { params: Promise.resolve({ id: testTeamId, matchId: activeMatchId }) }
      );

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBe(0);
    });

    it('returns all availability reports for a match (200)', async () => {
      setSession({ userId: trainerId, username: 'trainer', role: 'trainer', displayName: 'Trainer' });

      const prisma = await getPrisma();
      // Create two availability entries
      await prisma.matchAvailability.create({
        data: { teamId: testTeamId, matchId: activeMatchId, userId: trainerId, status: 'yes', canDrive: true },
      });
      await prisma.matchAvailability.create({
        data: { teamId: testTeamId, matchId: activeMatchId, userId: playerId, status: 'maybe', canDrive: false },
      });

      const res = await GET(
        new NextRequest(`http://localhost/api/teams/${testTeamId}/matches/${activeMatchId}/availability`),
        { params: Promise.resolve({ id: testTeamId, matchId: activeMatchId }) }
      );

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBe(2);
      expect(data.some((e: { userId: string }) => e.userId === trainerId)).toBe(true);
      expect(data.some((e: { userId: string }) => e.userId === playerId)).toBe(true);
      // Check shape of returned entries
      const entry = data.find((e: { userId: string }) => e.userId === trainerId);
      expect(entry).toMatchObject({ userId: trainerId, status: 'yes', canDrive: true });
      expect(typeof entry.displayName).toBe('string');
    });

    it('returns 401 if not authenticated', async () => {
      const res = await GET(
        new NextRequest(`http://localhost/api/teams/${testTeamId}/matches/${activeMatchId}/availability`),
        { params: Promise.resolve({ id: testTeamId, matchId: activeMatchId }) }
      );

      expect(res.status).toBe(401);
    });

    it('returns 403 if not a team member', async () => {
      setSession({ userId: lisaId, username: 'lisa', role: 'player', displayName: 'Lisa' });

      const res = await GET(
        new NextRequest(`http://localhost/api/teams/${testTeamId}/matches/${activeMatchId}/availability`),
        { params: Promise.resolve({ id: testTeamId, matchId: activeMatchId }) }
      );

      expect(res.status).toBe(403);
    });

    it('returns 200 for trainer who is not a team member', async () => {
      setSession({ userId: lisaId, username: 'lisa', role: 'trainer', displayName: 'Lisa Trainer' });

      const res = await GET(
        new NextRequest(`http://localhost/api/teams/${testTeamId}/matches/${activeMatchId}/availability`),
        { params: Promise.resolve({ id: testTeamId, matchId: activeMatchId }) }
      );

      expect(res.status).toBe(200);
    });
  });

  describe('PUT /api/teams/[id]/matches/[matchId]/availability', () => {
    it('creates availability report (200)', async () => {
      setSession({ userId: playerId, username: 'max', role: 'player', displayName: 'Max Schneider' });

      const req = new NextRequest(
        `http://localhost/api/teams/${testTeamId}/matches/${activeMatchId}/availability`,
        { method: 'PUT', body: JSON.stringify({ status: 'yes', canDrive: false }) }
      );
      const res = await PUT(req, { params: Promise.resolve({ id: testTeamId, matchId: activeMatchId }) });

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.userId).toBe(playerId);
      expect(data.status).toBe('yes');
      expect(data.canDrive).toBe(false);
    });

    it('updates existing availability report (200)', async () => {
      setSession({ userId: playerId, username: 'max', role: 'player', displayName: 'Max Schneider' });

      const prisma = await getPrisma();
      // Pre-create an entry
      await prisma.matchAvailability.create({
        data: { teamId: testTeamId, matchId: activeMatchId, userId: playerId, status: 'yes', canDrive: false },
      });

      const req = new NextRequest(
        `http://localhost/api/teams/${testTeamId}/matches/${activeMatchId}/availability`,
        { method: 'PUT', body: JSON.stringify({ status: 'no', canDrive: false }) }
      );
      const res = await PUT(req, { params: Promise.resolve({ id: testTeamId, matchId: activeMatchId }) });

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.status).toBe('no');
    });

    it('sets canDrive flag (200)', async () => {
      setSession({ userId: trainerId, username: 'trainer', role: 'trainer', displayName: 'Trainer' });

      const req = new NextRequest(
        `http://localhost/api/teams/${testTeamId}/matches/${activeMatchId}/availability`,
        { method: 'PUT', body: JSON.stringify({ status: 'yes', canDrive: true }) }
      );
      const res = await PUT(req, { params: Promise.resolve({ id: testTeamId, matchId: activeMatchId }) });

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.canDrive).toBe(true);
    });

    it('returns 400 for invalid status', async () => {
      setSession({ userId: playerId, username: 'max', role: 'player', displayName: 'Max Schneider' });

      const req = new NextRequest(
        `http://localhost/api/teams/${testTeamId}/matches/${activeMatchId}/availability`,
        { method: 'PUT', body: JSON.stringify({ status: 'invalid', canDrive: false }) }
      );
      const res = await PUT(req, { params: Promise.resolve({ id: testTeamId, matchId: activeMatchId }) });

      expect(res.status).toBe(400);
    });

    it('returns 400 for completed match', async () => {
      setSession({ userId: playerId, username: 'max', role: 'player', displayName: 'Max Schneider' });

      const req = new NextRequest(
        `http://localhost/api/teams/${testTeamId}/matches/${completedMatchId}/availability`,
        { method: 'PUT', body: JSON.stringify({ status: 'yes', canDrive: false }) }
      );
      const res = await PUT(req, { params: Promise.resolve({ id: testTeamId, matchId: completedMatchId }) });

      expect(res.status).toBe(400);
    });

    it('returns 403 if not a team member', async () => {
      setSession({ userId: lisaId, username: 'lisa', role: 'player', displayName: 'Lisa' });

      const req = new NextRequest(
        `http://localhost/api/teams/${testTeamId}/matches/${activeMatchId}/availability`,
        { method: 'PUT', body: JSON.stringify({ status: 'yes', canDrive: false }) }
      );
      const res = await PUT(req, { params: Promise.resolve({ id: testTeamId, matchId: activeMatchId }) });

      expect(res.status).toBe(403);
    });
  });
});
