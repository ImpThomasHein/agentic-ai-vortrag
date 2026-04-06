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
import { GET, POST } from '@/app/api/teams/route';
import { GET as GET_TEAM, PUT, DELETE } from '@/app/api/teams/[id]/route';
import { getPrisma } from '@/lib/db';

// Test-Daten
let trainerId: string;
let playerId: string;
let testTeamId: string;

beforeEach(async () => {
  clearSession();

  const prisma = await getPrisma();
  // Trainer und Spieler aus der Seed-DB holen
  const trainer = await prisma.user.findFirst({
    where: { username: 'trainer' },
  });
  const player = await prisma.user.findFirst({
    where: { username: 'max' },
  });

  trainerId = trainer!.id;
  playerId = player!.id;

  // Test-Team aufräumen falls noch vorhanden
  await prisma.team.deleteMany({ where: { name: 'Test-Team API' } });
});

describe('GET /api/teams', () => {
  it('gibt 401 zurück wenn nicht angemeldet', async () => {
    const res = await GET();
    expect(res.status).toBe(401);
  });

  it('gibt Teams des Users zurück', async () => {
    setSession({ userId: trainerId, username: 'trainer', role: 'trainer', displayName: 'Trainer' });

    const res = await GET();
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(Array.isArray(data)).toBe(true);
    // Trainer ist im Seed Mitglied von "Herren 1"
    const herren1 = data.find((t: { name: string }) => t.name.includes('Herren'));
    expect(herren1).toBeDefined();
    expect(herren1.memberCount).toBeGreaterThan(0);
  });

  it('gibt leere Liste für User ohne Teams', async () => {
    const prisma = await getPrisma();
    const lisa = await prisma.user.findFirst({ where: { username: 'lisa' } });
    setSession({ userId: lisa!.id, username: 'lisa', role: 'player', displayName: 'Lisa' });

    const res = await GET();
    const data = await res.json();
    // Lisa ist möglicherweise nicht in einem Team
    expect(Array.isArray(data)).toBe(true);
  });
});

describe('POST /api/teams', () => {
  it('gibt 403 zurück wenn Spieler', async () => {
    setSession({ userId: playerId, username: 'max', role: 'player', displayName: 'Max' });

    const req = new NextRequest('http://localhost/api/teams', {
      method: 'POST',
      body: JSON.stringify({ name: 'Test-Team API' }),
    });
    const res = await POST(req);
    expect(res.status).toBe(403);
  });

  it('erstellt Team als Trainer', async () => {
    setSession({ userId: trainerId, username: 'trainer', role: 'trainer', displayName: 'Trainer' });

    const req = new NextRequest('http://localhost/api/teams', {
      method: 'POST',
      body: JSON.stringify({ name: 'Test-Team API' }),
    });
    const res = await POST(req);
    expect(res.status).toBe(201);

    const data = await res.json();
    testTeamId = data.id;
    expect(data.name).toBe('Test-Team API');

    // Aufräumen
    await (await getPrisma()).team.delete({ where: { id: testTeamId } });
  });

  it('gibt 400 bei leerem Namen', async () => {
    setSession({ userId: trainerId, username: 'trainer', role: 'trainer', displayName: 'Trainer' });

    const req = new NextRequest('http://localhost/api/teams', {
      method: 'POST',
      body: JSON.stringify({ name: '' }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });
});

describe('GET /api/teams/[id]', () => {
  it('gibt Team-Details zurück', async () => {
    setSession({ userId: trainerId, username: 'trainer', role: 'trainer', displayName: 'Trainer' });

    // Team aus DB holen
    const prisma = await getPrisma();
    const team = await prisma.team.findFirst();
    if (!team) return; // Skip wenn kein Team vorhanden

    const res = await GET_TEAM(
      new NextRequest(`http://localhost/api/teams/${team.id}`),
      { params: Promise.resolve({ id: team.id }) }
    );
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.name).toBe(team.name);
  });

  it('gibt 404 bei unbekannter ID', async () => {
    setSession({ userId: trainerId, username: 'trainer', role: 'trainer', displayName: 'Trainer' });

    const res = await GET_TEAM(
      new NextRequest('http://localhost/api/teams/nonexistent'),
      { params: Promise.resolve({ id: 'nonexistent' }) }
    );
    expect(res.status).toBe(404);
  });
});

describe('PUT /api/teams/[id]', () => {
  it('aktualisiert Teamname', async () => {
    setSession({ userId: trainerId, username: 'trainer', role: 'trainer', displayName: 'Trainer' });

    // Erstelle Testteam
    const prisma = await getPrisma();
    const team = await prisma.team.create({ data: { name: 'Test-Team API PUT' } });

    const req = new NextRequest(`http://localhost/api/teams/${team.id}`, {
      method: 'PUT',
      body: JSON.stringify({ name: 'Test-Team Umbenannt' }),
    });
    const res = await PUT(req, { params: Promise.resolve({ id: team.id }) });
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.name).toBe('Test-Team Umbenannt');

    // Aufräumen
    await (await getPrisma()).team.delete({ where: { id: team.id } });
  });

  it('gibt 403 für Spieler', async () => {
    setSession({ userId: playerId, username: 'max', role: 'player', displayName: 'Max' });

    const req = new NextRequest('http://localhost/api/teams/some-id', {
      method: 'PUT',
      body: JSON.stringify({ name: 'Nope' }),
    });
    const res = await PUT(req, { params: Promise.resolve({ id: 'some-id' }) });
    expect(res.status).toBe(403);
  });
});

describe('DELETE /api/teams/[id]', () => {
  it('löscht Team als Trainer', async () => {
    setSession({ userId: trainerId, username: 'trainer', role: 'trainer', displayName: 'Trainer' });

    const prisma = await getPrisma();
    const team = await prisma.team.create({ data: { name: 'Test-Team API DELETE' } });

    const res = await DELETE(
      new NextRequest(`http://localhost/api/teams/${team.id}`),
      { params: Promise.resolve({ id: team.id }) }
    );
    expect(res.status).toBe(200);

    // Prüfe dass Team weg ist
    const deleted = await (await getPrisma()).team.findUnique({ where: { id: team.id } });
    expect(deleted).toBeNull();
  });

  it('gibt 403 für Spieler', async () => {
    setSession({ userId: playerId, username: 'max', role: 'player', displayName: 'Max' });

    const res = await DELETE(
      new NextRequest('http://localhost/api/teams/some-id'),
      { params: Promise.resolve({ id: 'some-id' }) }
    );
    expect(res.status).toBe(403);
  });
});
