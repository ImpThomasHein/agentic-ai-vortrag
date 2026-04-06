import { execSync } from 'child_process';
import { existsSync, rmSync } from 'fs';

const dbPath = './prisma/dev.db';

if (existsSync(dbPath)) {
  rmSync(dbPath);
  console.log('dev.db gelöscht');
}

console.log('Prisma Client generieren...');
execSync('npx prisma generate', { stdio: 'inherit' });

console.log('Schema in SQLite-DB pushen...');
execSync('npx prisma db push', { stdio: 'inherit' });

console.log('Testdaten einspielen...');
execSync('npx prisma db seed', { stdio: 'inherit' });

console.log('Dev-Datenbank bereit.');
