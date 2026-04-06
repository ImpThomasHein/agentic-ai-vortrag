// Unit tests for the PUT /api/users/[id] endpoint — trainer edits player profile.
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

import { PUT } from '@/app/api/users/[id]/route';
import { getPrisma } from '@/lib/db';
import { NextRequest } from 'next/server';

function makeRequest(body: Record<string, unknown>) {
  return new NextRequest('http://localhost/api/users/some-id', {
    method: 'PUT',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  });
}

function makeParams(id: string) {
  return { params: Promise.resolve({ id }) };
}

let trainerId: string;
let playerId: string;

beforeEach(async () => {
  clearSession();
  const prisma = await getPrisma();
  const trainer = await prisma.user.findFirst({ where: { username: 'trainer' } });
  trainerId = trainer!.id;

  // On first run, find by username; afterwards find by stored id and reset to original values
  if (!playerId) {
    const player = await prisma.user.findFirst({ where: { username: 'max' } });
    playerId = player!.id;
  } else {
    await prisma.user.update({
      where: { id: playerId },
      data: { username: 'max', displayName: 'Max Mustermann', email: null },
    });
  }
});

describe('PUT /api/users/[id]', () => {
  it('returns 403 when not a trainer', async () => {
    setSession({ userId: playerId, username: 'max', role: 'player', displayName: 'Max' });
    const res = await PUT(makeRequest({ displayName: 'New Name' }), makeParams(playerId));
    expect(res.status).toBe(403);
  });

  it('returns 404 for non-existent user', async () => {
    setSession({ userId: trainerId, username: 'trainer', role: 'trainer', displayName: 'Trainer' });
    const res = await PUT(makeRequest({ displayName: 'New' }), makeParams('non-existent-id'));
    expect(res.status).toBe(404);
  });

  it('updates displayName successfully', async () => {
    setSession({ userId: trainerId, username: 'trainer', role: 'trainer', displayName: 'Trainer' });
    const res = await PUT(makeRequest({ displayName: 'Max Neuer Name' }), makeParams(playerId));
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.displayName).toBe('Max Neuer Name');
  });

  it('updates username with lowercase normalization', async () => {
    setSession({ userId: trainerId, username: 'trainer', role: 'trainer', displayName: 'Trainer' });
    const res = await PUT(makeRequest({ username: 'Max.Neu' }), makeParams(playerId));
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.username).toBe('max.neu');
  });

  it('returns 409 for duplicate username', async () => {
    setSession({ userId: trainerId, username: 'trainer', role: 'trainer', displayName: 'Trainer' });
    const res = await PUT(makeRequest({ username: 'lisa' }), makeParams(playerId));
    expect(res.status).toBe(409);
  });

  it('updates email successfully', async () => {
    setSession({ userId: trainerId, username: 'trainer', role: 'trainer', displayName: 'Trainer' });
    const res = await PUT(makeRequest({ email: 'max@neu.de' }), makeParams(playerId));
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.email).toBe('max@neu.de');
  });

  it('clears email when empty string provided', async () => {
    setSession({ userId: trainerId, username: 'trainer', role: 'trainer', displayName: 'Trainer' });
    const res = await PUT(makeRequest({ email: '' }), makeParams(playerId));
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.email).toBeNull();
  });

  it('returns 400 for invalid email', async () => {
    setSession({ userId: trainerId, username: 'trainer', role: 'trainer', displayName: 'Trainer' });
    const res = await PUT(makeRequest({ email: 'ungueltig' }), makeParams(playerId));
    expect(res.status).toBe(400);
  });

  it('returns 400 for empty displayName', async () => {
    setSession({ userId: trainerId, username: 'trainer', role: 'trainer', displayName: 'Trainer' });
    const res = await PUT(makeRequest({ displayName: '' }), makeParams(playerId));
    expect(res.status).toBe(400);
  });

  it('returns 400 for empty username', async () => {
    setSession({ userId: trainerId, username: 'trainer', role: 'trainer', displayName: 'Trainer' });
    const res = await PUT(makeRequest({ username: '' }), makeParams(playerId));
    expect(res.status).toBe(400);
  });

  it('updates all fields simultaneously', async () => {
    setSession({ userId: trainerId, username: 'trainer', role: 'trainer', displayName: 'Trainer' });
    const res = await PUT(makeRequest({ displayName: 'Neuer Max', username: 'neuer.max', email: 'neuer@max.de' }), makeParams(playerId));
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.displayName).toBe('Neuer Max');
    expect(data.username).toBe('neuer.max');
    expect(data.email).toBe('neuer@max.de');
  });

  it('returns 200 with no-op for empty body', async () => {
    setSession({ userId: trainerId, username: 'trainer', role: 'trainer', displayName: 'Trainer' });
    const res = await PUT(makeRequest({}), makeParams(playerId));
    expect(res.status).toBe(200);
  });
});
