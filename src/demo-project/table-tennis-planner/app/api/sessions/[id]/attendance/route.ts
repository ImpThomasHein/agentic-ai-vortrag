import { NextRequest, NextResponse } from 'next/server';
import { getPrisma } from '@/lib/db';
import { getSession } from '@/lib/session';
import { notifyTrainersAboutAttendanceChange } from '@/lib/push';

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  const prisma = await getPrisma();
  const session = await getSession();
  if (!session.userId) {
    return NextResponse.json({ error: 'Nicht angemeldet' }, { status: 401 });
  }

  const { id: sessionId } = await params;

  // Fetch the session to know which group it belongs to
  const trainingSession = await prisma.trainingSession.findUnique({
    where: { id: sessionId },
    select: { groupId: true },
  });

  const attendance = await prisma.attendance.findMany({
    where: { sessionId },
    include: {
      user: {
        select: {
          username: true,
          displayName: true,
          groupMembers: {
            where: trainingSession ? { groupId: trainingSession.groupId } : undefined,
            select: { role: true },
          },
        },
      },
    },
  });

  // Filter out orphaned records (user deleted) and flatten groupMembers role
  const result = attendance
    .filter((a) => a.user !== null)
    .map((a) => ({
      ...a,
      user: {
        username: a.user!.username,
        displayName: a.user!.displayName,
        groupRole: a.user!.groupMembers[0]?.role ?? 'player',
      },
    }));

  return NextResponse.json(result);
}

export async function PUT(request: NextRequest, { params }: Params) {
  const prisma = await getPrisma();
  const session = await getSession();
  if (!session.userId) {
    return NextResponse.json({ error: 'Nicht angemeldet' }, { status: 401 });
  }

  const { id: sessionId } = await params;
  const { status } = await request.json();

  const attendance = await prisma.attendance.upsert({
    where: { userId_sessionId: { userId: session.userId, sessionId } },
    update: { status },
    create: { userId: session.userId, sessionId, status },
  });

  notifyTrainersAboutAttendanceChange(sessionId, session.displayName ?? '');

  return NextResponse.json(attendance);
}
