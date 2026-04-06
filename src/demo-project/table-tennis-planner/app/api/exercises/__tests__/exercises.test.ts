/**
 * Integration tests for exercise API endpoints.
 * Verifies that exercises are returned in the frontend Exercise format
 * with ttrRange object and duration field (not raw DB fields).
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';

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

import { NextRequest } from 'next/server';
import { GET, POST } from '@/app/api/exercises/route';
import { GET as GET_BY_ID } from '@/app/api/exercises/[id]/route';
import { getPrisma } from '@/lib/db';

let trainerId: string;
let firstExerciseId: string;

beforeEach(async () => {
  clearSession();
  const prisma = await getPrisma();
  const trainer = await prisma.user.findFirst({ where: { username: 'trainer' } });
  trainerId = trainer!.id;
  const firstExercise = await prisma.exercise.findFirst({ orderBy: { name: 'asc' } });
  firstExerciseId = firstExercise!.id;
});

describe('GET /api/exercises', () => {
  it('returns exercises with frontend-compatible shape (ttrRange, duration)', async () => {
    setSession({ userId: trainerId, username: 'trainer', role: 'trainer', displayName: 'Trainer' });
    const res = await GET();
    expect(res.status).toBe(200);
    const data = await res.json();

    // Should be an array
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThan(0);

    const exercise = data[0];

    // Must have ttrRange object (not raw ttrMin/ttrMax)
    expect(exercise.ttrRange).toBeDefined();
    expect(typeof exercise.ttrRange.min).toBe('number');
    expect(typeof exercise.ttrRange.max).toBe('number');

    // Must NOT have raw DB fields
    expect(exercise.ttrMin).toBeUndefined();
    expect(exercise.ttrMax).toBeUndefined();
    expect(exercise.durationMinutes).toBeUndefined();

    // duration should be mapped (number or undefined/null)
    expect(exercise).toHaveProperty('duration');
  });
});

describe('GET /api/exercises/[id]', () => {
  it('returns a single exercise with frontend-compatible shape', async () => {
    setSession({ userId: trainerId, username: 'trainer', role: 'trainer', displayName: 'Trainer' });
    const res = await GET_BY_ID(
      new NextRequest('http://localhost/api/exercises/' + firstExerciseId),
      { params: Promise.resolve({ id: firstExerciseId }) }
    );
    expect(res.status).toBe(200);
    const exercise = await res.json();

    expect(exercise.id).toBe(firstExerciseId);
    expect(exercise.ttrRange).toBeDefined();
    expect(typeof exercise.ttrRange.min).toBe('number');
    expect(typeof exercise.ttrRange.max).toBe('number');
    expect(exercise.ttrMin).toBeUndefined();
    expect(exercise.ttrMax).toBeUndefined();
    expect(exercise.durationMinutes).toBeUndefined();
  });

  it('returns 404 for non-existent exercise', async () => {
    setSession({ userId: trainerId, username: 'trainer', role: 'trainer', displayName: 'Trainer' });
    const res = await GET_BY_ID(
      new NextRequest('http://localhost/api/exercises/non-existent-id'),
      { params: Promise.resolve({ id: 'non-existent-id' }) }
    );
    expect(res.status).toBe(404);
  });
});

describe('POST /api/exercises', () => {
  beforeEach(() => {
    setSession({ userId: trainerId, username: 'trainer', role: 'trainer', displayName: 'Trainer' });
  });

  it('creates exercise with valid data and returns frontend-compatible shape', async () => {
    const res = await POST(
      new NextRequest('http://localhost/api/exercises', {
        method: 'POST',
        body: JSON.stringify({
          name: 'Test-Übung',
          description: 'Testbeschreibung',
          category: 'topspin',
          difficulty: 'beginner',
          ttrMin: 700,
          ttrMax: 1100,
          durationMinutes: 10,
          hints: ['Tipp 1'],
          tags: ['test'],
          diagram: { trajectories: [] },
        }),
      })
    );
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.name).toBe('Test-Übung');
    expect(data.ttrRange).toBeDefined();
    expect(data.ttrRange.min).toBe(700);
    expect(data.ttrRange.max).toBe(1100);
    expect(data.ttrMin).toBeUndefined();
    expect(data.ttrMax).toBeUndefined();
    expect(data.duration).toBe(10);
    expect(data.durationMinutes).toBeUndefined();
  });

  it('rejects when name is missing', async () => {
    const res = await POST(
      new NextRequest('http://localhost/api/exercises', {
        method: 'POST',
        body: JSON.stringify({
          description: 'Testbeschreibung',
          category: 'topspin',
          difficulty: 'beginner',
          ttrMin: 700,
          ttrMax: 1100,
        }),
      })
    );
    expect(res.status).toBe(400);
  });

  it('rejects when ttrMin > ttrMax', async () => {
    const res = await POST(
      new NextRequest('http://localhost/api/exercises', {
        method: 'POST',
        body: JSON.stringify({
          name: 'Test',
          description: 'Test',
          category: 'topspin',
          difficulty: 'beginner',
          ttrMin: 1500,
          ttrMax: 1000,
        }),
      })
    );
    expect(res.status).toBe(400);
  });

  it('rejects when not trainer', async () => {
    setSession({ userId: 'player-id', username: 'max', role: 'player', displayName: 'Max' });
    const res = await POST(
      new NextRequest('http://localhost/api/exercises', {
        method: 'POST',
        body: JSON.stringify({
          name: 'Test',
          description: 'Test',
          category: 'topspin',
          difficulty: 'beginner',
          ttrMin: 700,
          ttrMax: 1100,
        }),
      })
    );
    expect(res.status).toBe(403);
  });
});
