/** Integration tests for team chat API routes (GET/POST/DELETE) */
import { describe, it, expect, vi, beforeEach, afterAll } from 'vitest';
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

import { GET, POST } from '@/app/api/teams/[id]/chat/route';
import { DELETE, PUT } from '@/app/api/teams/[id]/chat/[messageId]/route';
import { getPrisma } from '@/lib/db';

let trainerId: string;
let playerId: string;
let teamId: string;
const createdMessageIds: string[] = [];

beforeEach(async () => {
  clearSession();

  const prisma = await getPrisma();
  const trainer = await prisma.user.findFirst({ where: { username: 'trainer' } });
  const player = await prisma.user.findFirst({ where: { username: 'max' } });
  const team = await prisma.team.findFirst({ where: { name: { contains: 'Herren' } } });

  trainerId = trainer!.id;
  playerId = player!.id;
  teamId = team!.id;
});

afterAll(async () => {
  const prisma = await getPrisma();
  // Clean up all created messages
  if (createdMessageIds.length > 0) {
    await prisma.chatMessage.deleteMany({ where: { id: { in: createdMessageIds } } });
  }
});

function makeParams(id: string) {
  return { params: Promise.resolve({ id }) };
}

function makeDeleteParams(id: string, messageId: string) {
  return { params: Promise.resolve({ id, messageId }) };
}

describe('GET /api/teams/[id]/chat', () => {
  it('returns 401 when not logged in', async () => {
    const req = new NextRequest('http://localhost/api/teams/x/chat');
    const res = await GET(req, makeParams(teamId));
    expect(res.status).toBe(401);
  });

  it('returns 403 for non-member non-trainer', async () => {
    const prisma = await getPrisma();
    const lisa = await prisma.user.findFirst({ where: { username: 'lisa' } });
    setSession({ userId: lisa!.id, username: 'lisa', role: 'player', displayName: 'Lisa' });

    const req = new NextRequest('http://localhost/api/teams/x/chat');
    const res = await GET(req, makeParams(teamId));
    expect(res.status).toBe(403);
  });

  it('returns messages for team member', async () => {
    setSession({ userId: playerId, username: 'max', role: 'player', displayName: 'Max' });

    const req = new NextRequest('http://localhost/api/teams/x/chat');
    const res = await GET(req, makeParams(teamId));
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(Array.isArray(data)).toBe(true);
  });

  it('allows trainer to see chat even without membership', async () => {
    setSession({ userId: trainerId, username: 'trainer', role: 'trainer', displayName: 'Trainer' });

    const req = new NextRequest('http://localhost/api/teams/x/chat');
    const res = await GET(req, makeParams(teamId));
    expect(res.status).toBe(200);
  });
});

describe('POST /api/teams/[id]/chat', () => {
  it('returns 401 when not logged in', async () => {
    const req = new NextRequest('http://localhost/api/teams/x/chat', {
      method: 'POST',
      body: JSON.stringify({ content: 'Hello' }),
    });
    const res = await POST(req, makeParams(teamId));
    expect(res.status).toBe(401);
  });

  it('returns 400 when no content or imageId', async () => {
    setSession({ userId: playerId, username: 'max', role: 'player', displayName: 'Max' });

    const req = new NextRequest('http://localhost/api/teams/x/chat', {
      method: 'POST',
      body: JSON.stringify({}),
    });
    const res = await POST(req, makeParams(teamId));
    expect(res.status).toBe(400);
  });

  it('creates a text message for team member', async () => {
    setSession({ userId: playerId, username: 'max', role: 'player', displayName: 'Max' });

    const req = new NextRequest('http://localhost/api/teams/x/chat', {
      method: 'POST',
      body: JSON.stringify({ content: 'Hallo Team!' }),
    });
    const res = await POST(req, makeParams(teamId));
    expect(res.status).toBe(201);

    const data = await res.json();
    expect(data.content).toBe('Hallo Team!');
    expect(data.userId).toBe(playerId);
    expect(data.username).toBe('max');
    expect(data.imageId).toBeNull();
    expect(data.createdAt).toBeDefined();
    createdMessageIds.push(data.id);
  });

  it('creates a message as trainer without membership', async () => {
    setSession({ userId: trainerId, username: 'trainer', role: 'trainer', displayName: 'Trainer' });

    const req = new NextRequest('http://localhost/api/teams/x/chat', {
      method: 'POST',
      body: JSON.stringify({ content: 'Trainer-Nachricht' }),
    });
    const res = await POST(req, makeParams(teamId));
    expect(res.status).toBe(201);

    const data = await res.json();
    createdMessageIds.push(data.id);
  });
});

describe('DELETE /api/teams/[id]/chat/[messageId]', () => {
  it('returns 401 when not logged in', async () => {
    const req = new NextRequest('http://localhost/api/teams/x/chat/y', { method: 'DELETE' });
    const res = await DELETE(req, makeDeleteParams(teamId, 'nonexistent'));
    expect(res.status).toBe(401);
  });

  it('returns 404 for nonexistent message', async () => {
    setSession({ userId: playerId, username: 'max', role: 'player', displayName: 'Max' });

    const req = new NextRequest('http://localhost/api/teams/x/chat/y', { method: 'DELETE' });
    const res = await DELETE(req, makeDeleteParams(teamId, 'nonexistent-id'));
    expect(res.status).toBe(404);
  });

  it('allows sender to delete own message', async () => {
    setSession({ userId: playerId, username: 'max', role: 'player', displayName: 'Max' });

    // Create a message first
    const createReq = new NextRequest('http://localhost/api/teams/x/chat', {
      method: 'POST',
      body: JSON.stringify({ content: 'Wird gelöscht' }),
    });
    const createRes = await POST(createReq, makeParams(teamId));
    const created = await createRes.json();

    // Delete it
    const deleteReq = new NextRequest('http://localhost/api/teams/x/chat/y', { method: 'DELETE' });
    const deleteRes = await DELETE(deleteReq, makeDeleteParams(teamId, created.id));
    expect(deleteRes.status).toBe(204);
  });

  it('forbids non-sender non-trainer from deleting', async () => {
    // Trainer creates a message
    setSession({ userId: trainerId, username: 'trainer', role: 'trainer', displayName: 'Trainer' });
    const createReq = new NextRequest('http://localhost/api/teams/x/chat', {
      method: 'POST',
      body: JSON.stringify({ content: 'Trainer-Nachricht' }),
    });
    const createRes = await POST(createReq, makeParams(teamId));
    const created = await createRes.json();
    createdMessageIds.push(created.id);

    // Player tries to delete it
    setSession({ userId: playerId, username: 'max', role: 'player', displayName: 'Max' });
    const deleteReq = new NextRequest('http://localhost/api/teams/x/chat/y', { method: 'DELETE' });
    const deleteRes = await DELETE(deleteReq, makeDeleteParams(teamId, created.id));
    expect(deleteRes.status).toBe(403);
  });

  it('allows trainer to delete any message', async () => {
    // Player creates a message
    setSession({ userId: playerId, username: 'max', role: 'player', displayName: 'Max' });
    const createReq = new NextRequest('http://localhost/api/teams/x/chat', {
      method: 'POST',
      body: JSON.stringify({ content: 'Player-Nachricht' }),
    });
    const createRes = await POST(createReq, makeParams(teamId));
    const created = await createRes.json();

    // Trainer deletes it
    setSession({ userId: trainerId, username: 'trainer', role: 'trainer', displayName: 'Trainer' });
    const deleteReq = new NextRequest('http://localhost/api/teams/x/chat/y', { method: 'DELETE' });
    const deleteRes = await DELETE(deleteReq, makeDeleteParams(teamId, created.id));
    expect(deleteRes.status).toBe(204);
  });
});

describe('GET /api/teams/[id]/chat pagination', () => {
  it('supports before parameter for pagination', async () => {
    setSession({ userId: playerId, username: 'max', role: 'player', displayName: 'Max' });

    // Create two messages
    const req1 = new NextRequest('http://localhost/api/teams/x/chat', {
      method: 'POST',
      body: JSON.stringify({ content: 'Erste Nachricht' }),
    });
    const res1 = await POST(req1, makeParams(teamId));
    const msg1 = await res1.json();
    createdMessageIds.push(msg1.id);

    const req2 = new NextRequest('http://localhost/api/teams/x/chat', {
      method: 'POST',
      body: JSON.stringify({ content: 'Zweite Nachricht' }),
    });
    const res2 = await POST(req2, makeParams(teamId));
    const msg2 = await res2.json();
    createdMessageIds.push(msg2.id);

    // Get messages before the second one
    const getReq = new NextRequest(
      `http://localhost/api/teams/x/chat?before=${msg2.createdAt}&limit=10`
    );
    const getRes = await GET(getReq, makeParams(teamId));
    expect(getRes.status).toBe(200);

    const data = await getRes.json();
    const ids = data.map((m: { id: string }) => m.id);
    expect(ids).not.toContain(msg2.id);
  });
});

describe('PUT /api/teams/[id]/chat/[messageId]', () => {
  it('returns 401 when not logged in', async () => {
    const req = new NextRequest('http://localhost/api/teams/x/chat/y', {
      method: 'PUT',
      body: JSON.stringify({ content: 'edited' }),
    });
    const res = await PUT(req, makeDeleteParams(teamId, 'nonexistent'));
    expect(res.status).toBe(401);
  });

  it('allows sender to edit own message', async () => {
    setSession({ userId: playerId, username: 'max', role: 'player', displayName: 'Max' });

    // Create a message
    const createReq = new NextRequest('http://localhost/api/teams/x/chat', {
      method: 'POST',
      body: JSON.stringify({ content: 'Original' }),
    });
    const createRes = await POST(createReq, makeParams(teamId));
    const created = await createRes.json();
    createdMessageIds.push(created.id);

    // Edit it
    const editReq = new NextRequest('http://localhost/api/teams/x/chat/y', {
      method: 'PUT',
      body: JSON.stringify({ content: 'Bearbeitet' }),
    });
    const editRes = await PUT(editReq, makeDeleteParams(teamId, created.id));
    expect(editRes.status).toBe(200);

    const edited = await editRes.json();
    expect(edited.content).toBe('Bearbeitet');
    expect(edited.isEdited).toBe(true);
  });

  it('forbids other player from editing', async () => {
    // Trainer creates a message
    setSession({ userId: trainerId, username: 'trainer', role: 'trainer', displayName: 'Trainer' });
    const createReq = new NextRequest('http://localhost/api/teams/x/chat', {
      method: 'POST',
      body: JSON.stringify({ content: 'Trainer-Text' }),
    });
    const createRes = await POST(createReq, makeParams(teamId));
    const created = await createRes.json();
    createdMessageIds.push(created.id);

    // Player tries to edit it
    setSession({ userId: playerId, username: 'max', role: 'player', displayName: 'Max' });
    const editReq = new NextRequest('http://localhost/api/teams/x/chat/y', {
      method: 'PUT',
      body: JSON.stringify({ content: 'Hacked' }),
    });
    const editRes = await PUT(editReq, makeDeleteParams(teamId, created.id));
    expect(editRes.status).toBe(403);
  });

  it('forbids trainer from editing other users message', async () => {
    // Player creates a message
    setSession({ userId: playerId, username: 'max', role: 'player', displayName: 'Max' });
    const createReq = new NextRequest('http://localhost/api/teams/x/chat', {
      method: 'POST',
      body: JSON.stringify({ content: 'Player-Text' }),
    });
    const createRes = await POST(createReq, makeParams(teamId));
    const created = await createRes.json();
    createdMessageIds.push(created.id);

    // Trainer tries to edit it
    setSession({ userId: trainerId, username: 'trainer', role: 'trainer', displayName: 'Trainer' });
    const editReq = new NextRequest('http://localhost/api/teams/x/chat/y', {
      method: 'PUT',
      body: JSON.stringify({ content: 'Trainer-Edit' }),
    });
    const editRes = await PUT(editReq, makeDeleteParams(teamId, created.id));
    expect(editRes.status).toBe(403);
  });

  it('returns 400 for empty content', async () => {
    setSession({ userId: playerId, username: 'max', role: 'player', displayName: 'Max' });

    const createReq = new NextRequest('http://localhost/api/teams/x/chat', {
      method: 'POST',
      body: JSON.stringify({ content: 'Will be edited' }),
    });
    const createRes = await POST(createReq, makeParams(teamId));
    const created = await createRes.json();
    createdMessageIds.push(created.id);

    const editReq = new NextRequest('http://localhost/api/teams/x/chat/y', {
      method: 'PUT',
      body: JSON.stringify({ content: '' }),
    });
    const editRes = await PUT(editReq, makeDeleteParams(teamId, created.id));
    expect(editRes.status).toBe(400);
  });
});
