// API route for managing push notification subscriptions.
// POST: Save a new push subscription for the authenticated user.
// DELETE: Remove a push subscription for the authenticated user.
import { NextRequest, NextResponse } from 'next/server';
import { getPrisma } from '@/lib/db';
import { getSession } from '@/lib/session';

export async function POST(request: NextRequest) {
  const prisma = await getPrisma();
  const session = await getSession();
  if (!session.userId) {
    return NextResponse.json({ error: 'Nicht angemeldet' }, { status: 401 });
  }

  const { endpoint, keys } = await request.json();

  // Validate endpoint is an HTTPS URL
  if (!endpoint || typeof endpoint !== 'string' || !endpoint.startsWith('https://')) {
    return NextResponse.json({ error: 'Ungültiger Endpunkt' }, { status: 400 });
  }

  if (!keys?.p256dh || !keys?.auth) {
    return NextResponse.json({ error: 'Ungültige Schlüssel' }, { status: 400 });
  }

  const subscription = await prisma.pushSubscription.upsert({
    where: { endpoint },
    update: { userId: session.userId, p256dh: keys.p256dh, auth: keys.auth },
    create: { userId: session.userId, endpoint, p256dh: keys.p256dh, auth: keys.auth },
  });

  return NextResponse.json(subscription, { status: 201 });
}

export async function DELETE(request: NextRequest) {
  const prisma = await getPrisma();
  const session = await getSession();
  if (!session.userId) {
    return NextResponse.json({ error: 'Nicht angemeldet' }, { status: 401 });
  }

  const { endpoint } = await request.json();

  if (!endpoint) {
    return NextResponse.json({ error: 'Endpunkt fehlt' }, { status: 400 });
  }

  try {
    await prisma.pushSubscription.deleteMany({
      where: { endpoint, userId: session.userId },
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Nicht gefunden' }, { status: 404 });
  }
}
