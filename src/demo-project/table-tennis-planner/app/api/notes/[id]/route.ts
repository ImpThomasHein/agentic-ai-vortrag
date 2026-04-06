/**
 * API routes for updating and deleting a single trainer note by ID.
 * Notes are Exercise records with type="note".
 * PUT updates name and description (trainer only).
 * DELETE removes the note and its assignments via cascade (trainer only).
 */
import { NextRequest, NextResponse } from 'next/server';
import { getPrisma } from '@/lib/db';
import { getSession } from '@/lib/session';
import { mapDbExerciseToFrontend } from '@/lib/exercise-mapper';
import { validateNoteInput } from '@/lib/notes-validation';

type Params = { params: Promise<{ id: string }> };

export async function PUT(request: NextRequest, { params }: Params) {
  const session = await getSession();
  if (!session.userId || session.role !== 'trainer') {
    return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 403 });
  }

  const { id } = await params;
  try {
    const body = await request.json();
    const errors = validateNoteInput(body);
    if (errors.length > 0) {
      return NextResponse.json({ errors }, { status: 400 });
    }

    const prisma = await getPrisma();

    const existing = await prisma.exercise.findUnique({ where: { id } });
    if (!existing || existing.type !== 'note') {
      return NextResponse.json({ error: 'Notiz nicht gefunden' }, { status: 404 });
    }

    const updated = await prisma.exercise.update({
      where: { id },
      data: {
        name: body.name,
        description: body.description,
      },
    });
    return NextResponse.json(mapDbExerciseToFrontend(updated));
  } catch {
    return NextResponse.json({ error: 'Serverfehler' }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const session = await getSession();
  if (!session.userId || session.role !== 'trainer') {
    return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 403 });
  }

  const { id } = await params;
  try {
    const prisma = await getPrisma();

    const existing = await prisma.exercise.findUnique({ where: { id } });
    if (!existing || existing.type !== 'note') {
      return NextResponse.json({ error: 'Notiz nicht gefunden' }, { status: 404 });
    }

    await prisma.exercise.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Serverfehler' }, { status: 500 });
  }
}
