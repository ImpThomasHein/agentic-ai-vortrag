// Tests for POST /api/users – creating a new player
import { describe, it, expect, vi, beforeEach } from 'vitest';
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

import { POST } from '@/app/api/users/route';
import { getPrisma } from '@/lib/db';

let trainerId: string;

beforeEach(async () => {
  clearSession();
  const prisma = await getPrisma();
  const trainer = await prisma.user.findFirst({ where: { username: 'trainer' } });
  trainerId = trainer!.id;
});

describe('POST /api/users', () => {
  it('erstellt einen neuen Spieler erfolgreich', async () => {
    setSession({ userId: trainerId, username: 'trainer', role: 'trainer', displayName: 'Trainer' });

    const req = new NextRequest('http://localhost/api/users', {
      method: 'POST',
      body: JSON.stringify({
        username: 'neuer.spieler',
        displayName: 'Neuer Spieler',
        password: 'test123',
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(201);

    const data = await res.json();
    expect(data.username).toBe('neuer.spieler');
    expect(data.displayName).toBe('Neuer Spieler');
    expect(data.roles).toContain('player');

    // Cleanup
    const prisma = await getPrisma();
    await prisma.user.delete({ where: { username: 'neuer.spieler' } });
  });

  it('erstellt Spieler auch wenn player-Rolle vorher nicht existiert', async () => {
    setSession({ userId: trainerId, username: 'trainer', role: 'trainer', displayName: 'Trainer' });

    const prisma = await getPrisma();

    // Delete the 'player' UserRole to simulate missing seed data
    await prisma.role.deleteMany({ where: { userRole: { name: 'player' } } });
    await prisma.userRole.delete({ where: { name: 'player' } });

    try {
      const req = new NextRequest('http://localhost/api/users', {
        method: 'POST',
        body: JSON.stringify({
          username: 'test.ohne.rolle',
          displayName: 'Test Ohne Rolle',
          password: 'test123',
        }),
      });

      const res = await POST(req);
      // This should succeed, not return 500 "Spieler-Rolle nicht gefunden"
      expect(res.status).toBe(201);

      const data = await res.json();
      expect(data.username).toBe('test.ohne.rolle');
      expect(data.roles).toContain('player');

      // Cleanup created user
      await prisma.user.delete({ where: { username: 'test.ohne.rolle' } });
    } finally {
      // Restore the player role and re-assign to existing players
      const playerRole = await prisma.userRole.upsert({
        where: { name: 'player' },
        update: {},
        create: { name: 'player', description: 'Spieler' },
      });

      // Re-assign player role to max and lisa
      const max = await prisma.user.findFirst({ where: { username: 'max' } });
      const lisa = await prisma.user.findFirst({ where: { username: 'lisa' } });

      if (max) {
        const existing = await prisma.role.findFirst({ where: { userId: max.id, userRoleId: playerRole.id } });
        if (!existing) {
          await prisma.role.create({ data: { userId: max.id, userRoleId: playerRole.id } });
        }
      }
      if (lisa) {
        const existing = await prisma.role.findFirst({ where: { userId: lisa.id, userRoleId: playerRole.id } });
        if (!existing) {
          await prisma.role.create({ data: { userId: lisa.id, userRoleId: playerRole.id } });
        }
      }
    }
  });

  it('gibt 403 zurück wenn nicht Trainer', async () => {
    const prisma = await getPrisma();
    const player = await prisma.user.findFirst({ where: { username: 'max' } });
    setSession({ userId: player!.id, username: 'max', role: 'player', displayName: 'Max' });

    const req = new NextRequest('http://localhost/api/users', {
      method: 'POST',
      body: JSON.stringify({
        username: 'hacker',
        displayName: 'Hacker',
        password: 'test123',
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(403);
  });

  it('gibt 400 zurück bei fehlendem Passwort', async () => {
    setSession({ userId: trainerId, username: 'trainer', role: 'trainer', displayName: 'Trainer' });

    const req = new NextRequest('http://localhost/api/users', {
      method: 'POST',
      body: JSON.stringify({
        username: 'test',
        displayName: 'Test',
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it('gibt 400 zurück bei doppeltem Loginnamen', async () => {
    setSession({ userId: trainerId, username: 'trainer', role: 'trainer', displayName: 'Trainer' });

    const req = new NextRequest('http://localhost/api/users', {
      method: 'POST',
      body: JSON.stringify({
        username: 'max',
        displayName: 'Anderer Max',
        password: 'test123',
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe('Loginname bereits vergeben');
  });
});
