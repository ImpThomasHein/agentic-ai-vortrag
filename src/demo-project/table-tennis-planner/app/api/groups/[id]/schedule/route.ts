import { NextRequest, NextResponse } from 'next/server';
import { getPrisma } from '@/lib/db';
import { getSession } from '@/lib/session';

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  const prisma = await getPrisma();
  const session = await getSession();
  if (!session.userId) {
    return NextResponse.json({ error: 'Nicht angemeldet' }, { status: 401 });
  }

  const { id: groupId } = await params;
  const schedule = await prisma.trainingSchedule.findUnique({ where: { groupId } });

  if (!schedule) {
    return NextResponse.json({ weekdays: [] });
  }

  return NextResponse.json(schedule);
}

export async function PUT(request: NextRequest, { params }: Params) {
  const prisma = await getPrisma();
  const session = await getSession();
  if (!session.userId || session.role !== 'trainer') {
    return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 403 });
  }

  const { id: groupId } = await params;
  const { weekdays } = await request.json();

  const schedule = await prisma.trainingSchedule.upsert({
    where: { groupId },
    update: { weekdays: [...weekdays].sort((a: number, b: number) => a - b) },
    create: { groupId, weekdays: [...weekdays].sort((a: number, b: number) => a - b) },
  });

  return NextResponse.json(schedule);
}
