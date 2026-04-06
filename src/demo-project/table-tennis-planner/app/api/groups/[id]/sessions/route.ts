/** API route for listing and creating training sessions within a group. */
import { NextRequest, NextResponse } from 'next/server';
import { getPrisma } from '@/lib/db';
import { getSession } from '@/lib/session';
import { buildSessionDateFilter } from './session-date-filter';

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  const prisma = await getPrisma();
  const session = await getSession();
  if (!session.userId) {
    return NextResponse.json({ error: 'Nicht angemeldet' }, { status: 401 });
  }

  const { id: groupId } = await params;
  const sessions = await prisma.trainingSession.findMany({
    where: { groupId, sessionDate: buildSessionDateFilter() },
    orderBy: { sessionDate: 'asc' },
    include: {
      _count: { select: { assignments: true, votes: true, attendance: true } },
    },
  });

  return NextResponse.json(sessions);
}

export async function POST(request: NextRequest, { params }: Params) {
  const prisma = await getPrisma();
  const session = await getSession();
  if (!session.userId || session.role !== 'trainer') {
    return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 403 });
  }

  const { id: groupId } = await params;
  try {
    const { sessionDate, notes } = await request.json();
    const trainingSession = await prisma.trainingSession.create({
      data: { groupId, sessionDate: new Date(sessionDate), notes },
    });
    return NextResponse.json(trainingSession, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Session bereits vorhanden oder Serverfehler' }, { status: 400 });
  }
}
