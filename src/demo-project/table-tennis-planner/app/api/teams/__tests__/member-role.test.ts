// Integration tests for the captain role management API endpoint.
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

import { PUT } from '@/app/api/teams/[id]/members/[uid]/role/route';
import { getPrisma } from '@/lib/db';

let trainerId: string;
let playerId: string;
let testTeamId: string;

beforeEach(async () => {
  clearSession();

  const prisma = await getPrisma();
  const trainer = await prisma.user.findFirst({ where: { username: 'trainer' } });
  const max = await prisma.user.findFirst({ where: { username: 'max' } });

  trainerId = trainer!.id;
  playerId = max!.id;

  // Clean up, then create test team with both members
  await prisma.team.deleteMany({ where: { name: 'Test-Team Role' } });
  const team = await prisma.team.create({
    data: {
      name: 'Test-Team Role',
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
  await prisma.team.deleteMany({ where: { name: 'Test-Team Role' } });
});

describe('PUT /api/teams/[id]/members/[uid]/role', () => {
  it('trainer can set captain role (200)', async () => {
    setSession({ userId: trainerId, username: 'trainer', role: 'trainer', displayName: 'Trainer' });

    const req = new NextRequest(
      `http://localhost/api/teams/${testTeamId}/members/${playerId}/role`,
      { method: 'PUT', body: JSON.stringify({ role: 'captain' }) }
    );
    const res = await PUT(req, { params: Promise.resolve({ id: testTeamId, uid: playerId }) });
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.role).toBe('captain');

    // Verify DB update
    const prisma = await getPrisma();
    const member = await prisma.teamMember.findUnique({
      where: { teamId_userId: { teamId: testTeamId, userId: playerId } },
    });
    expect(member?.role).toBe('captain');
  });

  it('trainer can remove captain role (200)', async () => {
    setSession({ userId: trainerId, username: 'trainer', role: 'trainer', displayName: 'Trainer' });

    // First promote to captain
    const prisma = await getPrisma();
    await prisma.teamMember.update({
      where: { teamId_userId: { teamId: testTeamId, userId: playerId } },
      data: { role: 'captain' },
    });

    const req = new NextRequest(
      `http://localhost/api/teams/${testTeamId}/members/${playerId}/role`,
      { method: 'PUT', body: JSON.stringify({ role: 'player' }) }
    );
    const res = await PUT(req, { params: Promise.resolve({ id: testTeamId, uid: playerId }) });
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.role).toBe('player');
  });

  it('player cannot set captain role (403)', async () => {
    setSession({ userId: playerId, username: 'max', role: 'player', displayName: 'Max' });

    const req = new NextRequest(
      `http://localhost/api/teams/${testTeamId}/members/${playerId}/role`,
      { method: 'PUT', body: JSON.stringify({ role: 'captain' }) }
    );
    const res = await PUT(req, { params: Promise.resolve({ id: testTeamId, uid: playerId }) });
    expect(res.status).toBe(403);
  });

  it('returns 404 if member not found', async () => {
    setSession({ userId: trainerId, username: 'trainer', role: 'trainer', displayName: 'Trainer' });

    const nonExistentUid = 'non-existent-user-id';
    const req = new NextRequest(
      `http://localhost/api/teams/${testTeamId}/members/${nonExistentUid}/role`,
      { method: 'PUT', body: JSON.stringify({ role: 'captain' }) }
    );
    const res = await PUT(req, { params: Promise.resolve({ id: testTeamId, uid: nonExistentUid }) });
    expect(res.status).toBe(404);
  });

  it('returns 400 for invalid role', async () => {
    setSession({ userId: trainerId, username: 'trainer', role: 'trainer', displayName: 'Trainer' });

    const req = new NextRequest(
      `http://localhost/api/teams/${testTeamId}/members/${playerId}/role`,
      { method: 'PUT', body: JSON.stringify({ role: 'invalid' }) }
    );
    const res = await PUT(req, { params: Promise.resolve({ id: testTeamId, uid: playerId }) });
    expect(res.status).toBe(400);
  });
});
