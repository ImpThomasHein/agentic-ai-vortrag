// Imports exercises from data/exercises.json into the production database.
// Usage: DOTENV_CONFIG_PATH=.env.prod node -r dotenv/config scripts/import-exercises.mjs
import { readFileSync } from 'fs';
import pg from 'pg';

const url = process.env.DATABASE_URL;
if (!url) {
  console.error('DATABASE_URL is not set');
  process.exit(1);
}

const exercisesData = JSON.parse(readFileSync('./data/exercises.json', 'utf-8'));
const exercises = exercisesData.exercises;

const client = new pg.Client({ connectionString: url });
await client.connect();

let imported = 0;
let updated = 0;

for (const ex of exercises) {
  const result = await client.query(
    `INSERT INTO exercises (id, name, description, hints, category, difficulty, ttr_min, ttr_max, duration_minutes, diagram, tags, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW())
     ON CONFLICT (id) DO UPDATE SET
       name = $2, description = $3, hints = $4, category = $5, difficulty = $6,
       ttr_min = $7, ttr_max = $8, duration_minutes = $9, diagram = $10, tags = $11, updated_at = NOW()
     RETURNING (xmax = 0) AS inserted`,
    [
      ex.id,
      ex.name,
      ex.description,
      ex.hints ?? [],
      ex.category,
      ex.difficulty,
      ex.ttrRange.min,
      ex.ttrRange.max,
      ex.duration ?? null,
      JSON.stringify(ex.diagram),
      ex.tags ?? [],
    ]
  );

  if (result.rows[0].inserted) {
    imported++;
  } else {
    updated++;
  }
}

console.log(`Fertig: ${imported} neu importiert, ${updated} aktualisiert (${exercises.length} gesamt).`);
await client.end();
