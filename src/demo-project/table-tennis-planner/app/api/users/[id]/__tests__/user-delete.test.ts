// Unit tests for the DELETE /api/users/[id] endpoint — trainer deletes a player.
import { describe, it, expect, vi, beforeEach } from 'vitest';

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

import { DELETE } from '@/app/api/users/[id]/route';
import { getPrisma } from '@/lib/db';
import { NextRequest } from 'next/server';

function makeRequest() {
  return new NextRequest('http://localhost/api/users/some-id', { method: 'DELETE' });
}

function makeParams(id: string) {
  return { params: Promise.resolve({ id }) };
}

let trainerId: string;

beforeEach(async () => {
  clearSession();
  const prisma = await getPrisma();
  const trainer = await prisma.user.findFirst({ where: { username: 'trainer' } });
  trainerId = trainer!.id;
});

// Helper to create a disposable test player that won't affect other test files
async function createTempPlayer(suffix: string) {
  const prisma = await getPrisma();
  return prisma.user.create({
    data: { username: `temp-del-${suffix}`, passwordHash: 'hash', displayName: `Temp ${suffix}` },
  });
}

describe('DELETE /api/users/[id]', () => {
  it('returns 403 when not a trainer', async () => {
    const tempPlayer = await createTempPlayer('403');
    setSession({ userId: tempPlayer.id, username: tempPlayer.username, role: 'player', displayName: 'Temp' });
    const res = await DELETE(makeRequest(), makeParams(tempPlayer.id));
    expect(res.status).toBe(403);
  });

  it('returns 400 when trainer tries to delete themselves', async () => {
    setSession({ userId: trainerId, username: 'trainer', role: 'trainer', displayName: 'Trainer' });
    const res = await DELETE(makeRequest(), makeParams(trainerId));
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe('Du kannst dich nicht selbst löschen');
  });

  it('returns 404 for non-existent user', async () => {
    setSession({ userId: trainerId, username: 'trainer', role: 'trainer', displayName: 'Trainer' });
    const res = await DELETE(makeRequest(), makeParams('non-existent-id'));
    expect(res.status).toBe(404);
  });

  it('deletes player successfully', async () => {
    const tempPlayer = await createTempPlayer('delete');
    setSession({ userId: trainerId, username: 'trainer', role: 'trainer', displayName: 'Trainer' });
    const res = await DELETE(makeRequest(), makeParams(tempPlayer.id));
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.message).toBe('Benutzer gelöscht');

    // Verify user is gone
    const prisma = await getPrisma();
    const deleted = await prisma.user.findUnique({ where: { id: tempPlayer.id } });
    expect(deleted).toBeNull();
  });

  it('preserves attendance records with null userId after deletion', async () => {
    const prisma = await getPrisma();
    const tempPlayer = await createTempPlayer('attendance');

    // Create a session and attendance record for the temp player
    const group = await prisma.group.findFirst();
    const session = await prisma.trainingSession.create({
      data: { groupId: group!.id, sessionDate: new Date('2026-04-01') },
    });
    await prisma.attendance.create({
      data: { userId: tempPlayer.id, sessionId: session.id, status: 'yes' },
    });

    setSession({ userId: trainerId, username: 'trainer', role: 'trainer', displayName: 'Trainer' });
    const res = await DELETE(makeRequest(), makeParams(tempPlayer.id));
    expect(res.status).toBe(200);

    // Attendance record should still exist with null userId
    const attendance = await prisma.attendance.findMany({
      where: { sessionId: session.id },
    });
    expect(attendance.length).toBeGreaterThanOrEqual(1);
    const orphaned = attendance.find((a) => a.userId === null);
    expect(orphaned).toBeDefined();
    expect(orphaned!.status).toBe('yes');
  });
});
