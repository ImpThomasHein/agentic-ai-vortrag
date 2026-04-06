/** POST /api/chat-images — Upload and compress a chat image to WebP */
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { getPrisma } from '@/lib/db';
import { validateImageFile, compressImage } from './upload-helpers';

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session.userId) {
    return NextResponse.json({ error: 'Nicht angemeldet' }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get('file') as File | null;
  if (!file) {
    return NextResponse.json({ error: 'Keine Datei hochgeladen' }, { status: 400 });
  }

  const validation = validateImageFile(file.type, file.size);
  if (!validation.valid) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const { data, width, height } = await compressImage(buffer, file.type);

  const prisma = await getPrisma();
  const image = await prisma.chatImage.create({
    data: {
      data: new Uint8Array(data),
      mimeType: 'image/webp',
      fileName: file.name,
      width,
      height,
    },
  });

  return NextResponse.json(
    { id: image.id, mimeType: image.mimeType, width: image.width, height: image.height },
    { status: 201 }
  );
}
