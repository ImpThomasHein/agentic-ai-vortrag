import { NextRequest, NextResponse } from 'next/server';
import { getPrisma } from '@/lib/db';
import { getSession } from '@/lib/session';
import { notifyPlayersAboutPlanChange } from '@/lib/push';

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  const prisma = await getPrisma();
  const session = await getSession();
  if (!session.userId) {
    return NextResponse.json({ error: 'Nicht angemeldet' }, { status: 401 });
  }

  const { id: sessionId } = await params;
  const assignments = await prisma.trainingAssignment.findMany({
    where: { sessionId },
    include: { exercise: true },
    orderBy: { sortOrder: 'asc' },
  });

  return NextResponse.json(assignments);
}

export async function POST(request: NextRequest, { params }: Params) {
  const prisma = await getPrisma();
  const session = await getSession();
  if (!session.userId || session.role !== 'trainer') {
    return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 403 });
  }

  const { id: sessionId } = await params;
  try {
    const { exerciseId, sortOrder } = await request.json();

    const lastAssignment = await prisma.trainingAssignment.findFirst({
      where: { sessionId },
      orderBy: { sortOrder: 'desc' },
    });

    const assignment = await prisma.trainingAssignment.create({
      data: {
        sessionId,
        exerciseId,
        sortOrder: sortOrder ?? (lastAssignment ? lastAssignment.sortOrder + 1 : 0),
      },
      include: { exercise: true },
    });

    notifyPlayersAboutPlanChange(sessionId);

    return NextResponse.json(assignment, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Übung bereits zugeordnet oder Serverfehler' }, { status: 400 });
  }
}
