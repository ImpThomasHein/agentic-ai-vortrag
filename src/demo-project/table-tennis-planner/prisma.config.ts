import dotenv from "dotenv";
import { defineConfig } from "prisma/config";

// PRISMA_ENV_FILE erlaubt Überschreiben der Standard-Env-Datei (z.B. .env.prod)
const envFile = process.env["PRISMA_ENV_FILE"];
if (envFile) {
  dotenv.config({ path: envFile, override: true });
} else {
  // .env.local hat Vorrang (lokale Entwicklung), danach .env (Fallback)
  dotenv.config({ path: ".env.local", override: true });
  dotenv.config();
}

const isSQLite = process.env["DATABASE_URL"]?.startsWith("file:") ?? false;

export default defineConfig({
  schema: isSQLite ? "prisma/schema.dev.prisma" : "prisma/schema.prisma",
  migrations: {
    path: isSQLite ? "prisma/migrations-dev" : "prisma/migrations",
    seed: "tsx --env-file-if-exists=.env.local prisma/seed.ts",
  },
  datasource: {
    url: process.env["DATABASE_URL"]!,
    // directUrl für Prisma Migrate (Supabase benötigt direkte Verbindung ohne pgBouncer)
    // directUrl: process.env["DIRECT_URL"]!,
  },
});
