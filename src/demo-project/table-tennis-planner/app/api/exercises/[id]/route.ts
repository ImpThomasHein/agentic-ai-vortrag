/**
 * API routes for single exercise operations: GET, PUT, DELETE by ID.
 * GET returns a single exercise mapped to the frontend Exercise type.
 * PUT updates an exercise (trainer only). DELETE removes it (trainer only).
 */
import { NextRequest, NextResponse } from 'next/server';
import { getPrisma } from '@/lib/db';
import { getSession } from '@/lib/session';
import { mapDbExerciseToFrontend } from '@/lib/exercise-mapper';

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  const prisma = await getPrisma();
  const { id } = await params;
  try {
    const exercise = await prisma.exercise.findUnique({ where: { id } });
    if (!exercise) {
      return NextResponse.json({ error: 'Nicht gefunden' }, { status: 404 });
    }
    return NextResponse.json(mapDbExerciseToFrontend(exercise));
  } catch {
    return NextResponse.json({ error: 'Serverfehler' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: Params) {
  const prisma = await getPrisma();
  const session = await getSession();
  if (!session.userId || session.role !== 'trainer') {
    return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 403 });
  }

  const { id } = await params;
  try {
    const body = await request.json();
    const exercise = await prisma.exercise.update({
      where: { id },
      data: {
        name: body.name,
        description: body.description,
        hints: body.hints,
        category: body.category,
        difficulty: body.difficulty,
        ttrMin: body.ttrMin,
        ttrMax: body.ttrMax,
        durationMinutes: body.durationMinutes ?? null,
        diagram: body.diagram,
        tags: body.tags,
      },
    });
    return NextResponse.json(exercise);
  } catch {
    return NextResponse.json({ error: 'Nicht gefunden oder Serverfehler' }, { status: 404 });
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const prisma = await getPrisma();
  const session = await getSession();
  if (!session.userId || session.role !== 'trainer') {
    return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 403 });
  }

  const { id } = await params;
  try {
    await prisma.exercise.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Nicht gefunden' }, { status: 404 });
  }
}
