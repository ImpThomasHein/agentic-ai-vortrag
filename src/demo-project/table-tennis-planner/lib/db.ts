// Creates the Prisma client for either SQLite (local dev) or PostgreSQL (Supabase production).
// Adapters are dynamically imported to avoid bundling native libsql binaries in production Docker images.
import { PrismaClient } from './generated/prisma/client';

async function createPrismaClient(): Promise<PrismaClient> {
  const url = process.env.DATABASE_URL;

  if (!url) {
    console.error('[db] DATABASE_URL is not set');
    throw new Error('DATABASE_URL Umgebungsvariable ist nicht gesetzt.');
  }

  const dbType = url.startsWith('file:') ? 'SQLite' : 'PostgreSQL';
  console.log(`[db] Initializing Prisma client with ${dbType} adapter`);

  try {
    if (url.startsWith('file:')) {
      // Lokale SQLite-Entwicklung via libSQL-Adapter
      const { PrismaLibSql } = await import('@prisma/adapter-libsql');
      const adapter = new PrismaLibSql({ url });
      console.log('[db] SQLite adapter created successfully');
      return new PrismaClient({ adapter }) as unknown as PrismaClient;
    }

    // Produktion: PostgreSQL (Supabase) via pg-Adapter
    const { PrismaPg } = await import('@prisma/adapter-pg');
    const adapter = new PrismaPg({ connectionString: url });
    console.log('[db] PostgreSQL adapter created successfully');
    return new PrismaClient({ adapter }) as unknown as PrismaClient;
  } catch (error) {
    console.error(`[db] Failed to create ${dbType} Prisma client:`, error);
    throw error;
  }
}

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient; prismaPromise: Promise<PrismaClient> };

/**
 * Returns the Prisma client instance, creating it on first call.
 * Cached globally so the adapter is only resolved once.
 */
export async function getPrisma(): Promise<PrismaClient> {
  if (globalForPrisma.prisma) return globalForPrisma.prisma;
  if (!globalForPrisma.prismaPromise) {
    globalForPrisma.prismaPromise = createPrismaClient().then((client) => {
      globalForPrisma.prisma = client;
      return client;
    });
  }
  return globalForPrisma.prismaPromise;
}
