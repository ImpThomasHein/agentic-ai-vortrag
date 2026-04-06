/**
 * Single group API route.
 * PUT: Update group name/description (trainer only).
 * DELETE: Delete group and all related data via cascade (trainer only).
 */
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
    const { name, description } = await request.json();
    const group = await prisma.group.update({
      where: { id },
      data: { name, description: description ?? null },
    });
    return NextResponse.json(group);
  } catch {
    return NextResponse.json({ error: 'Gruppe nicht gefunden oder Name bereits vergeben' }, { status: 400 });
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const prisma = await getPrisma();
  const session = await getSession();
  if (!session.userId || session.role !== 'trainer') {
    return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 403 });
  }

  const { id } = await params;
  try {
    await prisma.group.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Gruppe nicht gefunden' }, { status: 404 });
  }
}
