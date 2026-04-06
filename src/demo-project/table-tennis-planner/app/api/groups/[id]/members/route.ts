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
  const members = await prisma.groupMember.findMany({
    where: { groupId },
    include: { user: { select: { id: true, username: true, displayName: true } } },
  });

  return NextResponse.json(members);
}

export async function POST(request: NextRequest, { params }: Params) {
  const prisma = await getPrisma();
  const session = await getSession();
  if (!session.userId || session.role !== 'trainer') {
    return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 403 });
  }

  const { id: groupId } = await params;
  try {
    const { userId, role } = await request.json();
    const member = await prisma.groupMember.create({
      data: { groupId, userId, role },
    });
    return NextResponse.json(member, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Mitglied bereits vorhanden oder Serverfehler' }, { status: 400 });
  }
}
