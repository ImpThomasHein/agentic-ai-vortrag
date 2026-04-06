/**
 * API routes for listing and creating exercises.
 * GET returns all exercises mapped to the frontend Exercise type.
 * POST creates a new exercise (trainer only) with input validation.
 */
import { NextRequest, NextResponse } from 'next/server';
import { getPrisma } from '@/lib/db';
import { getSession } from '@/lib/session';
import { mapDbExerciseToFrontend } from '@/lib/exercise-mapper';

export async function GET() {
  const prisma = await getPrisma();
  const exercises = await prisma.exercise.findMany({
    orderBy: { name: 'asc' },
  });
  return NextResponse.json(exercises.map(mapDbExerciseToFrontend));
}

export async function POST(request: NextRequest) {
  const prisma = await getPrisma();
  const session = await getSession();
  if (!session.userId || session.role !== 'trainer') {
    return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 403 });
  }

  try {
    const body = await request.json();

    if (!body.name?.trim() || !body.description?.trim()) {
      return NextResponse.json({ error: 'Name und Beschreibung sind erforderlich' }, { status: 400 });
    }
    if (!body.category || !body.difficulty) {
      return NextResponse.json({ error: 'Kategorie und Schwierigkeit sind erforderlich' }, { status: 400 });
    }
    if (typeof body.ttrMin !== 'number' || typeof body.ttrMax !== 'number' || body.ttrMin > body.ttrMax) {
      return NextResponse.json({ error: 'TTR-Bereich ungültig' }, { status: 400 });
    }

    const exercise = await prisma.exercise.create({
      data: {
        name: body.name.trim(),
        description: body.description.trim(),
        hints: body.hints ?? [],
        category: body.category,
        difficulty: body.difficulty,
        ttrMin: body.ttrMin,
        ttrMax: body.ttrMax,
        durationMinutes: body.durationMinutes ?? null,
        diagram: body.diagram ?? { trajectories: [] },
        tags: body.tags ?? [],
        createdById: session.userId,
      },
    });
    return NextResponse.json(mapDbExerciseToFrontend(exercise), { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Serverfehler' }, { status: 500 });
  }
}
