/**
 * API routes for listing and creating trainer notes.
 * Notes are Exercise records with type="note".
 * GET returns all notes ordered by updatedAt descending (any authenticated user).
 * POST creates a new note (trainer only).
 */
import { NextRequest, NextResponse } from 'next/server';
import { getPrisma } from '@/lib/db';
import { getSession } from '@/lib/session';
import { mapDbExerciseToFrontend } from '@/lib/exercise-mapper';
import { validateNoteInput } from '@/lib/notes-validation';

export async function GET() {
  const session = await getSession();
  if (!session.userId) {
    return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 });
  }

  const prisma = await getPrisma();
  const notes = await prisma.exercise.findMany({
    where: { type: 'note' },
    orderBy: { updatedAt: 'desc' },
  });
  return NextResponse.json(notes.map(mapDbExerciseToFrontend));
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session.userId || session.role !== 'trainer') {
    return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const errors = validateNoteInput(body);
    if (errors.length > 0) {
      return NextResponse.json({ errors }, { status: 400 });
    }

    const prisma = await getPrisma();
    const note = await prisma.exercise.create({
      data: {
        name: body.name,
        description: body.description,
        type: 'note',
        category: 'notiz',
        difficulty: 'beginner',
        ttrMin: 0,
        ttrMax: 2500,
        hints: [],
        diagram: {},
        tags: [],
        createdById: session.userId,
      },
    });
    return NextResponse.json(mapDbExerciseToFrontend(note), { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Serverfehler' }, { status: 500 });
  }
}
