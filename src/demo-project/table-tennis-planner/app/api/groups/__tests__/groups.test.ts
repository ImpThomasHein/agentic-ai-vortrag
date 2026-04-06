/**
 * Integration tests for group CRUD API endpoints (GET, POST, PUT, DELETE).
 * Tests authorization, group creation, update, and deletion.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

// Mock session before route imports
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

import { GET, POST } from '@/app/api/groups/route';
import { PUT, DELETE } from '@/app/api/groups/[id]/route';
import { getPrisma } from '@/lib/db';

let trainerId: string;
let playerId: string;
let erwachseneId: string;

beforeEach(async () => {
  clearSession();
  const prisma = await getPrisma();
  const trainer = await prisma.user.findFirst({ where: { username: 'trainer' } });
  const player = await prisma.user.findFirst({ where: { username: 'max' } });
  const erwachsene = await prisma.group.findFirst({ where: { name: { startsWith: 'Erwachsene' } } });
  trainerId = trainer!.id;
  playerId = player!.id;
  erwachseneId = erwachsene!.id;
});

describe('GET /api/groups', () => {
  it('returns 401 when not logged in', async () => {
    const res = await GET();
    expect(res.status).toBe(401);
  });

  it('returns groups for logged-in user', async () => {
    setSession({ userId: trainerId, username: 'trainer', role: 'trainer', displayName: 'Trainer' });
    const res = await GET();
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThanOrEqual(2);
  });
});

describe('POST /api/groups', () => {
  it('returns 403 for non-trainer', async () => {
    setSession({ userId: playerId, username: 'max', role: 'player', displayName: 'Max' });
    const req = new NextRequest('http://localhost/api/groups', {
      method: 'POST',
      body: JSON.stringify({ name: 'Test-Gruppe', description: 'Eine Testgruppe' }),
    });
    const res = await POST(req);
    expect(res.status).toBe(403);
  });

  it('creates group as trainer', async () => {
    setSession({ userId: trainerId, username: 'trainer', role: 'trainer', displayName: 'Trainer' });
    const req = new NextRequest('http://localhost/api/groups', {
      method: 'POST',
      body: JSON.stringify({ name: 'Senioren', description: 'Seniorengruppe' }),
    });
    const res = await POST(req);
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.name).toBe('Senioren');
  });
});

describe('PUT /api/groups/[id]', () => {
  it('returns 403 for non-trainer', async () => {
    setSession({ userId: playerId, username: 'max', role: 'player', displayName: 'Max' });
    const req = new NextRequest('http://localhost/api/groups/' + erwachseneId, {
      method: 'PUT',
      body: JSON.stringify({ name: 'Erwachsene Neu', description: 'Updated' }),
    });
    const res = await PUT(req, { params: Promise.resolve({ id: erwachseneId }) });
    expect(res.status).toBe(403);
  });

  it('updates group name and description', async () => {
    setSession({ userId: trainerId, username: 'trainer', role: 'trainer', displayName: 'Trainer' });
    const req = new NextRequest('http://localhost/api/groups/' + erwachseneId, {
      method: 'PUT',
      body: JSON.stringify({ name: 'Erwachsene Updated', description: 'Neue Beschreibung' }),
    });
    const res = await PUT(req, { params: Promise.resolve({ id: erwachseneId }) });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.name).toBe('Erwachsene Updated');
    expect(data.description).toBe('Neue Beschreibung');
  });
});

describe('DELETE /api/groups/[id]', () => {
  it('returns 403 for non-trainer', async () => {
    setSession({ userId: playerId, username: 'max', role: 'player', displayName: 'Max' });
    const res = await DELETE(
      new NextRequest('http://localhost/api/groups/' + erwachseneId, { method: 'DELETE' }),
      { params: Promise.resolve({ id: erwachseneId }) }
    );
    expect(res.status).toBe(403);
  });

  it('deletes group as trainer', async () => {
    setSession({ userId: trainerId, username: 'trainer', role: 'trainer', displayName: 'Trainer' });
    // Create a temp group to delete
    const createReq = new NextRequest('http://localhost/api/groups', {
      method: 'POST',
      body: JSON.stringify({ name: 'Zum-Löschen' }),
    });
    const createRes = await POST(createReq);
    const created = await createRes.json();

    const res = await DELETE(
      new NextRequest('http://localhost/api/groups/' + created.id, { method: 'DELETE' }),
      { params: Promise.resolve({ id: created.id }) }
    );
    expect(res.status).toBe(200);

    // Verify deleted
    const prisma = await getPrisma();
    const found = await prisma.group.findUnique({ where: { id: created.id } });
    expect(found).toBeNull();
  });
});
