import { NextRequest, NextResponse } from 'next/server';
import { getPrisma } from '@/lib/db';
import { getSession } from '@/lib/session';

type Params = { params: Promise<{ id: string }> };

export async function PUT(request: NextRequest, { params }: Params) {
  const prisma = await getPrisma();
  const session = await getSession();
  if (!session.userId || session.role !== 'trainer') {
    return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 403 });
  }

  const { id } = await params;

  try {
    const { email } = await request.json();

    if (email !== null && email !== '') {
      if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return NextResponse.json({ error: 'Ungültiges E-Mail-Format' }, { status: 400 });
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { email: email?.trim() || null },
    });

    return NextResponse.json({ email: updatedUser.email ?? null });
  } catch {
    return NextResponse.json({ error: 'Serverfehler' }, { status: 500 });
  }
}
