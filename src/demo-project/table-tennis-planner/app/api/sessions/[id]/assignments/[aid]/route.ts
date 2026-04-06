import { NextRequest, NextResponse } from 'next/server';
import { getPrisma } from '@/lib/db';
import { getSession } from '@/lib/session';
import { notifyPlayersAboutPlanChange } from '@/lib/push';

type Params = { params: Promise<{ id: string; aid: string }> };

export async function PATCH(request: NextRequest, { params }: Params) {
  const prisma = await getPrisma();
  const session = await getSession();
  if (!session.userId || session.role !== 'trainer') {
    return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 403 });
  }

  const { aid } = await params;
  const { sortOrder } = await request.json();

  const assignment = await prisma.trainingAssignment.update({
    where: { id: aid },
    data: { sortOrder },
  });

  return NextResponse.json(assignment);
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const prisma = await getPrisma();
  const session = await getSession();
  if (!session.userId || session.role !== 'trainer') {
    return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 403 });
  }

  const { id: sessionId, aid } = await params;
  try {
    await prisma.trainingAssignment.delete({ where: { id: aid } });

    notifyPlayersAboutPlanChange(sessionId);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Nicht gefunden' }, { status: 404 });
  }
}
