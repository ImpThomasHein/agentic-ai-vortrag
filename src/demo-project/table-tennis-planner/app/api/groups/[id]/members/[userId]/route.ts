import { NextRequest, NextResponse } from 'next/server';
import { getPrisma } from '@/lib/db';
import { getSession } from '@/lib/session';

type Params = { params: Promise<{ id: string; userId: string }> };

export async function DELETE(_request: NextRequest, { params }: Params) {
  const prisma = await getPrisma();
  const session = await getSession();
  if (!session.userId || session.role !== 'trainer') {
    return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 403 });
  }

  const { id: groupId, userId } = await params;

  try {
    await prisma.groupMember.delete({
      where: { groupId_userId: { groupId, userId } },
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Mitglied nicht gefunden' }, { status: 404 });
  }
}
