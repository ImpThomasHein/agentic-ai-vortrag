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

import { GET, POST } from '@/app/api/teams/[id]/members/route';
import { DELETE } from '@/app/api/teams/[id]/members/[uid]/route';
import { getPrisma } from '@/lib/db';

let trainerId: string;
let playerId: string;
let lisaId: string;
let testTeamId: string;
let captainId: string;

beforeEach(async () => {
  clearSession();

  const prisma = await getPrisma();
  const trainer = await prisma.user.findFirst({ where: { username: 'trainer' } });
  const max = await prisma.user.findFirst({ where: { username: 'max' } });
  const lisa = await prisma.user.findFirst({ where: { username: 'lisa' } });

  trainerId = trainer!.id;
  playerId = max!.id;
  lisaId = lisa!.id;

  // Use max as captain for test team
  captainId = playerId;

  // Aufräumen, dann Testteam erstellen
  await prisma.team.deleteMany({ where: { name: 'Test-Team Members' } });
  const team = await prisma.team.create({
    data: {
      name: 'Test-Team Members',
      members: { create: { userId: trainerId } },
    },
  });
  testTeamId = team.id;

  // Add max as captain of the test team
  await prisma.teamMember.create({
    data: { teamId: testTeamId, userId: captainId, role: 'captain' },
  });
});

afterEach(async () => {
  const prisma = await getPrisma();
  await prisma.team.deleteMany({ where: { name: 'Test-Team Members' } });
});

describe('GET /api/teams/[id]/members', () => {
  it('listet Mitglieder des Teams', async () => {
    setSession({ userId: trainerId, username: 'trainer', role: 'trainer', displayName: 'Trainer' });

    const res = await GET(
      new NextRequest(`http://localhost/api/teams/${testTeamId}/members`),
      { params: Promise.resolve({ id: testTeamId }) }
    );
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBe(2);
    expect(data.some((m: { username: string }) => m.username === 'trainer')).toBe(true);
  });

  it('GET returns member role field', async () => {
    setSession({ userId: trainerId, username: 'trainer', role: 'trainer', displayName: 'Trainer' });

    const res = await GET(
      new NextRequest(`http://localhost/api/teams/${testTeamId}/members`),
      { params: Promise.resolve({ id: testTeamId }) }
    );
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(Array.isArray(data)).toBe(true);
    // Verify each member has a role field with valid value
    data.forEach((m: { role: string }) => {
      expect(['player', 'captain']).toContain(m.role);
    });
    // Verify trainer member has default 'player' role
    const trainer = data.find((m: { username: string }) => m.username === 'trainer');
    expect(trainer?.role).toBe('player');
    // Verify max (captain) has 'captain' role
    const max = data.find((m: { username: string }) => m.username === 'max');
    expect(max?.role).toBe('captain');
  });

  it('gibt 401 wenn nicht angemeldet', async () => {
    const res = await GET(
      new NextRequest(`http://localhost/api/teams/${testTeamId}/members`),
      { params: Promise.resolve({ id: testTeamId }) }
    );
    expect(res.status).toBe(401);
  });
});

describe('POST /api/teams/[id]/members', () => {
  it('Trainer kann beliebige User hinzufügen', async () => {
    setSession({ userId: trainerId, username: 'trainer', role: 'trainer', displayName: 'Trainer' });

    // Add lisa (not yet in the team)
    const req = new NextRequest(`http://localhost/api/teams/${testTeamId}/members`, {
      method: 'POST',
      body: JSON.stringify({ userId: lisaId }),
    });
    const res = await POST(req, { params: Promise.resolve({ id: testTeamId }) });
    expect(res.status).toBe(201);

    const data = await res.json();
    expect(data.username).toBe('lisa');
  });

  it('Spieler kann sich selbst zuordnen', async () => {
    setSession({ userId: lisaId, username: 'lisa', role: 'player', displayName: 'Lisa' });

    const req = new NextRequest(`http://localhost/api/teams/${testTeamId}/members`, {
      method: 'POST',
      body: JSON.stringify({ userId: lisaId }),
    });
    const res = await POST(req, { params: Promise.resolve({ id: testTeamId }) });
    expect(res.status).toBe(201);

    const data = await res.json();
    expect(data.username).toBe('lisa');
  });

  it('Spieler kann andere nicht zuordnen', async () => {
    setSession({ userId: lisaId, username: 'lisa', role: 'player', displayName: 'Lisa' });

    const req = new NextRequest(`http://localhost/api/teams/${testTeamId}/members`, {
      method: 'POST',
      body: JSON.stringify({ userId: playerId }),
    });
    const res = await POST(req, { params: Promise.resolve({ id: testTeamId }) });
    expect(res.status).toBe(403);
  });

  it('doppelte Zuordnung gibt 400', async () => {
    setSession({ userId: trainerId, username: 'trainer', role: 'trainer', displayName: 'Trainer' });

    // Trainer ist schon Mitglied
    const req = new NextRequest(`http://localhost/api/teams/${testTeamId}/members`, {
      method: 'POST',
      body: JSON.stringify({ userId: trainerId }),
    });
    const res = await POST(req, { params: Promise.resolve({ id: testTeamId }) });
    expect(res.status).toBe(400);
  });

  it('captain can add members to their team (201)', async () => {
    // captainId (max) is already a captain of testTeamId (added in beforeEach)
    setSession({ userId: captainId, username: 'max', role: 'player', displayName: 'Max Schneider' });

    const req = new NextRequest(`http://localhost/api/teams/${testTeamId}/members`, {
      method: 'POST',
      body: JSON.stringify({ userId: lisaId }),
    });
    const res = await POST(req, { params: Promise.resolve({ id: testTeamId }) });
    expect(res.status).toBe(201);

    const data = await res.json();
    expect(data.username).toBe('lisa');
  });
});

describe('DELETE /api/teams/[id]/members/[uid]', () => {
  it('Trainer kann Mitglied entfernen', async () => {
    setSession({ userId: trainerId, username: 'trainer', role: 'trainer', displayName: 'Trainer' });

    // Max is already in the team as captain (added in beforeEach)
    const res = await DELETE(
      new NextRequest(`http://localhost/api/teams/${testTeamId}/members/${playerId}`),
      { params: Promise.resolve({ id: testTeamId, uid: playerId }) }
    );
    expect(res.status).toBe(200);

    // Prüfe dass Max entfernt wurde
    const prisma2 = await getPrisma();
    const member = await prisma2.teamMember.findUnique({
      where: { teamId_userId: { teamId: testTeamId, userId: playerId } },
    });
    expect(member).toBeNull();
  });

  it('Spieler kann sich selbst entfernen', async () => {
    // Lisa hinzufügen
    const prisma = await getPrisma();
    await prisma.teamMember.create({ data: { teamId: testTeamId, userId: lisaId } });

    setSession({ userId: lisaId, username: 'lisa', role: 'player', displayName: 'Lisa' });

    const res = await DELETE(
      new NextRequest(`http://localhost/api/teams/${testTeamId}/members/${lisaId}`),
      { params: Promise.resolve({ id: testTeamId, uid: lisaId }) }
    );
    expect(res.status).toBe(200);
  });

  it('Spieler kann andere nicht entfernen', async () => {
    setSession({ userId: lisaId, username: 'lisa', role: 'player', displayName: 'Lisa' });

    const res = await DELETE(
      new NextRequest(`http://localhost/api/teams/${testTeamId}/members/${playerId}`),
      { params: Promise.resolve({ id: testTeamId, uid: playerId }) }
    );
    expect(res.status).toBe(403);
  });

  it('captain can remove members from their team (200)', async () => {
    // Add lisa to the team first
    const prisma = await getPrisma();
    await prisma.teamMember.create({ data: { teamId: testTeamId, userId: lisaId } });

    // captainId (max) is already a captain of testTeamId (added in beforeEach)
    setSession({ userId: captainId, username: 'max', role: 'player', displayName: 'Max Schneider' });

    const res = await DELETE(
      new NextRequest(`http://localhost/api/teams/${testTeamId}/members/${lisaId}`),
      { params: Promise.resolve({ id: testTeamId, uid: lisaId }) }
    );
    expect(res.status).toBe(200);
  });
});
