/** Integration tests for chat image upload and retrieval API */
import { describe, it, expect, vi, beforeEach, afterAll } from 'vitest';
import { NextRequest } from 'next/server';
import sharp from 'sharp';

// Mock session before route imports
const mockSession: Record<string, unknown> = {};
vi.mock('@/lib/session', () => ({
  getSession: vi.fn(() => Promise.resolve(mockSession)),
}));

function setSession(data: { userId: string; username: string; role: string; displayName: string }) {
  Object.assign(mockSession, data);
}

function clearSession() {
  for (const key of Object.keys(mockSession)) delete mockSession[key];
}

import { POST } from '@/app/api/chat-images/route';
import { GET } from '@/app/api/chat-images/[id]/route';
import { getPrisma } from '@/lib/db';

let trainerId: string;
const createdImageIds: string[] = [];

/** Creates a minimal test PNG buffer */
async function createTestImage(width = 100, height = 100): Promise<Buffer> {
  return sharp({ create: { width, height, channels: 3, background: { r: 255, g: 0, b: 0 } } })
    .png()
    .toBuffer();
}

beforeEach(async () => {
  clearSession();
  const prisma = await getPrisma();
  const trainer = await prisma.user.findFirst({ where: { username: 'trainer' } });
  trainerId = trainer!.id;
});

afterAll(async () => {
  const prisma = await getPrisma();
  if (createdImageIds.length > 0) {
    await prisma.chatImage.deleteMany({ where: { id: { in: createdImageIds } } });
  }
});

describe('POST /api/chat-images', () => {
  it('returns 401 when not logged in', async () => {
    const formData = new FormData();
    formData.append('file', new Blob(['fake']), 'test.jpg');

    const req = new NextRequest('http://localhost/api/chat-images', {
      method: 'POST',
      body: formData,
    });
    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  it('returns 400 when no file provided', async () => {
    setSession({ userId: trainerId, username: 'trainer', role: 'trainer', displayName: 'Trainer' });

    const formData = new FormData();
    const req = new NextRequest('http://localhost/api/chat-images', {
      method: 'POST',
      body: formData,
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it('uploads and compresses an image to WebP', async () => {
    setSession({ userId: trainerId, username: 'trainer', role: 'trainer', displayName: 'Trainer' });

    const imageBuffer = await createTestImage(200, 150);
    const file = new File([imageBuffer], 'test.png', { type: 'image/png' });

    const formData = new FormData();
    formData.append('file', file);

    const req = new NextRequest('http://localhost/api/chat-images', {
      method: 'POST',
      body: formData,
    });
    const res = await POST(req);
    expect(res.status).toBe(201);

    const data = await res.json();
    expect(data.id).toBeDefined();
    expect(data.mimeType).toBe('image/webp');
    expect(data.width).toBeGreaterThan(0);
    expect(data.height).toBeGreaterThan(0);
    createdImageIds.push(data.id);
  });
});

describe('GET /api/chat-images/[id]', () => {
  it('returns 401 when not logged in', async () => {
    const req = new NextRequest('http://localhost/api/chat-images/nonexistent');
    const res = await GET(req, { params: Promise.resolve({ id: 'nonexistent' }) });
    expect(res.status).toBe(401);
  });

  it('returns 404 for nonexistent image', async () => {
    setSession({ userId: trainerId, username: 'trainer', role: 'trainer', displayName: 'Trainer' });

    const req = new NextRequest('http://localhost/api/chat-images/nonexistent');
    const res = await GET(req, { params: Promise.resolve({ id: 'nonexistent' }) });
    expect(res.status).toBe(404);
  });

  it('serves uploaded image with correct headers', async () => {
    setSession({ userId: trainerId, username: 'trainer', role: 'trainer', displayName: 'Trainer' });

    // Upload first
    const imageBuffer = await createTestImage(100, 80);
    const file = new File([imageBuffer], 'serve-test.png', { type: 'image/png' });
    const formData = new FormData();
    formData.append('file', file);

    const uploadReq = new NextRequest('http://localhost/api/chat-images', {
      method: 'POST',
      body: formData,
    });
    const uploadRes = await POST(uploadReq);
    const uploaded = await uploadRes.json();
    createdImageIds.push(uploaded.id);

    // Retrieve
    const getReq = new NextRequest(`http://localhost/api/chat-images/${uploaded.id}`);
    const getRes = await GET(getReq, { params: Promise.resolve({ id: uploaded.id }) });
    expect(getRes.status).toBe(200);
    expect(getRes.headers.get('Content-Type')).toBe('image/webp');
    expect(getRes.headers.get('Cache-Control')).toContain('max-age=86400');
    expect(getRes.headers.get('ETag')).toBeDefined();
  });

  it('returns 304 for matching ETag', async () => {
    setSession({ userId: trainerId, username: 'trainer', role: 'trainer', displayName: 'Trainer' });

    // Use the last uploaded image
    const imageId = createdImageIds[createdImageIds.length - 1];
    const etag = `"${imageId}"`;

    const req = new NextRequest(`http://localhost/api/chat-images/${imageId}`, {
      headers: { 'if-none-match': etag },
    });
    const res = await GET(req, { params: Promise.resolve({ id: imageId }) });
    expect(res.status).toBe(304);
  });
});
