import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

// Mock session – muss vor Route-Imports stehen
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

// Route-Handler importieren
import { PUT as PUT_ME } from '@/app/api/users/me/email/route';
import { PUT as PUT_TRAINER } from '@/app/api/users/[id]/email/route';
import { getPrisma } from '@/lib/db';

let trainerId: string;
let playerId: string;

beforeEach(async () => {
  clearSession();

  const prisma = await getPrisma();
  const trainer = await prisma.user.findFirst({ where: { username: 'trainer' } });
  const player = await prisma.user.findFirst({ where: { username: 'max' } });

  trainerId = trainer!.id;
  playerId = player!.id;

  // E-Mail zurücksetzen
  await prisma.user.updateMany({ data: { email: null } });
});

describe('PUT /api/users/me/email', () => {
  it('gibt 401 zurück wenn nicht angemeldet', async () => {
    const req = new NextRequest('http://localhost/api/users/me/email', {
      method: 'PUT',
      body: JSON.stringify({ email: 'test@example.com' }),
    });
    const res = await PUT_ME(req);
    expect(res.status).toBe(401);
  });

  it('setzt E-Mail für eingeloggten Spieler', async () => {
    setSession({ userId: playerId, username: 'max', role: 'player', displayName: 'Max' });

    const req = new NextRequest('http://localhost/api/users/me/email', {
      method: 'PUT',
      body: JSON.stringify({ email: 'max@example.com' }),
    });
    const res = await PUT_ME(req);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.email).toBe('max@example.com');

    // DB prüfen
    const prisma = await getPrisma();
    const user = await prisma.user.findUnique({ where: { id: playerId } });
    expect(user!.email).toBe('max@example.com');
  });

  it('entfernt E-Mail wenn null übergeben', async () => {
    const prisma = await getPrisma();
    await prisma.user.update({ where: { id: playerId }, data: { email: 'old@example.com' } });
    setSession({ userId: playerId, username: 'max', role: 'player', displayName: 'Max' });

    const req = new NextRequest('http://localhost/api/users/me/email', {
      method: 'PUT',
      body: JSON.stringify({ email: null }),
    });
    const res = await PUT_ME(req);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.email).toBeNull();
  });

  it('gibt 400 bei ungültigem Format', async () => {
    setSession({ userId: playerId, username: 'max', role: 'player', displayName: 'Max' });

    const req = new NextRequest('http://localhost/api/users/me/email', {
      method: 'PUT',
      body: JSON.stringify({ email: 'not-an-email' }),
    });
    const res = await PUT_ME(req);
    expect(res.status).toBe(400);
  });
});

describe('PUT /api/users/[id]/email', () => {
  it('gibt 403 zurück wenn Spieler', async () => {
    setSession({ userId: playerId, username: 'max', role: 'player', displayName: 'Max' });

    const req = new NextRequest(`http://localhost/api/users/${playerId}/email`, {
      method: 'PUT',
      body: JSON.stringify({ email: 'test@example.com' }),
    });
    const res = await PUT_TRAINER(req, { params: Promise.resolve({ id: playerId }) });
    expect(res.status).toBe(403);
  });

  it('Trainer kann E-Mail eines Spielers setzen', async () => {
    setSession({ userId: trainerId, username: 'trainer', role: 'trainer', displayName: 'Trainer' });

    const req = new NextRequest(`http://localhost/api/users/${playerId}/email`, {
      method: 'PUT',
      body: JSON.stringify({ email: 'max@example.com' }),
    });
    const res = await PUT_TRAINER(req, { params: Promise.resolve({ id: playerId }) });
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.email).toBe('max@example.com');
  });

  it('gibt 400 bei ungültigem Format', async () => {
    setSession({ userId: trainerId, username: 'trainer', role: 'trainer', displayName: 'Trainer' });

    const req = new NextRequest(`http://localhost/api/users/${playerId}/email`, {
      method: 'PUT',
      body: JSON.stringify({ email: 'bad-email' }),
    });
    const res = await PUT_TRAINER(req, { params: Promise.resolve({ id: playerId }) });
    expect(res.status).toBe(400);
  });
});
