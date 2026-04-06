/**
 * Global setup for API tests: ensures the SQLite database exists with schema and seed data.
 * Runs before any API test via vitest globalSetup.
 */
import { execSync } from 'child_process';
import { existsSync, rmSync } from 'fs';

export default function setup() {
  const dbPath = './prisma/dev.db';

  // Ensure DATABASE_URL is set for prisma commands (CI may not have .env.local)
  const env = { ...process.env, DATABASE_URL: 'file:./prisma/dev.db' };

  if (existsSync(dbPath)) {
    rmSync(dbPath);
  }

  console.log('[api-test-setup] Generating Prisma client for dev schema...');
  execSync('npx prisma generate --schema prisma/schema.dev.prisma', { stdio: 'inherit', env });

  console.log('[api-test-setup] Pushing schema to SQLite...');
  execSync('npx prisma db push --schema prisma/schema.dev.prisma', { stdio: 'inherit', env });

  console.log('[api-test-setup] Seeding test data...');
  execSync('npx prisma db seed', { stdio: 'inherit', env });

  console.log('[api-test-setup] Database ready.');
}
