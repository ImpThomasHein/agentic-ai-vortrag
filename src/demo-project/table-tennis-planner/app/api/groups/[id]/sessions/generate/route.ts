import { NextRequest, NextResponse } from 'next/server';
import { getPrisma } from '@/lib/db';
import { getSession } from '@/lib/session';

type Params = { params: Promise<{ id: string }> };

/**
 * POST /api/groups/[id]/sessions/generate
 * Generates missing TrainingSessions for the next 4 weeks based on the group's schedule.
 * Idempotent: existing sessions are not overwritten.
 */
export async function POST(_request: NextRequest, { params }: Params) {
  const prisma = await getPrisma();
  const session = await getSession();
  if (!session.userId) {
    return NextResponse.json({ error: 'Nicht angemeldet' }, { status: 401 });
  }

  const { id: groupId } = await params;

  const schedule = await prisma.trainingSchedule.findUnique({ where: { groupId } });
  if (!schedule) {
    return NextResponse.json({ sessions: [] });
  }

  const weekdays = schedule.weekdays as number[];
  if (weekdays.length === 0) {
    return NextResponse.json({ sessions: [] });
  }

  // Generate all training dates for the next 4 weeks (28 days from today)
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const endDate = new Date(today);
  endDate.setDate(today.getDate() + 28);

  const dates: Date[] = [];
  for (let d = new Date(today); d <= endDate; d.setDate(d.getDate() + 1)) {
    if (weekdays.includes(d.getDay())) {
      dates.push(new Date(d));
    }
  }

  // Upsert sessions for each date (idempotent – existing sessions are untouched)
  await Promise.all(
    dates.map((date) =>
      prisma.trainingSession.upsert({
        where: { groupId_sessionDate: { groupId, sessionDate: date } },
        update: {},
        create: { groupId, sessionDate: date },
      })
    )
  );

  // Return all upcoming sessions for the group (from today onward)
  const sessions = await prisma.trainingSession.findMany({
    where: { groupId, sessionDate: { gte: today } },
    orderBy: { sessionDate: 'asc' },
    include: {
      _count: { select: { assignments: true, votes: true, attendance: true } },
    },
  });

  return NextResponse.json({ sessions });
}
