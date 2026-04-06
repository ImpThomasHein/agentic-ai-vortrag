import { NextRequest, NextResponse } from 'next/server';
import { getPrisma } from '@/lib/db';
import { getSession } from '@/lib/session';

export async function GET() {
  const prisma = await getPrisma();
  const session = await getSession();
  if (!session.userId) {
    return NextResponse.json({ error: 'Nicht angemeldet' }, { status: 401 });
  }

  const memberships = await prisma.groupMember.findMany({
    where: { userId: session.userId },
    include: { group: true },
  });

  return NextResponse.json(memberships.map((m) => ({ ...m.group, myRole: m.role })));
}

export async function POST(request: NextRequest) {
  const prisma = await getPrisma();
  const session = await getSession();
  if (!session.userId || session.role !== 'trainer') {
    return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 403 });
  }

  try {
    const { name, description } = await request.json();
    const group = await prisma.group.create({
      data: {
        name,
        description,
        members: {
          create: { userId: session.userId, role: 'trainer' },
        },
      },
    });
    return NextResponse.json(group, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Gruppe existiert bereits oder Serverfehler' }, { status: 400 });
  }
}
