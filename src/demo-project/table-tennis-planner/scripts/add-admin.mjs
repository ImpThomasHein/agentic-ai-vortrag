// Adds the admin user thomas.hein to the production database.
// Usage: DATABASE_URL="postgresql://..." node scripts/add-admin.mjs

import bcrypt from 'bcryptjs';
import pg from 'pg';

const url = process.env.DATABASE_URL;
if (!url) {
  console.error('DATABASE_URL is not set');
  process.exit(1);
}

const client = new pg.Client({ connectionString: url });
await client.connect();

const username = 'thomas.hein';
const password = 'thomas.hein';
const displayName = 'Thomas Hein';
const passwordHash = await bcrypt.hash(password, 10);

// Ensure trainer role exists
await client.query(
  `INSERT INTO user_roles (id, name, description) VALUES (gen_random_uuid(), 'trainer', 'Trainingsleiter') ON CONFLICT (name) DO NOTHING`
);

const roleResult = await client.query(`SELECT id FROM user_roles WHERE name = 'trainer'`);
const trainerRoleId = roleResult.rows[0].id;

// Upsert user
const userResult = await client.query(
  `INSERT INTO users (id, username, password_hash, display_name, updated_at)
   VALUES (gen_random_uuid(), $1, $2, $3, NOW())
   ON CONFLICT (username) DO UPDATE SET password_hash = $2, display_name = $3, updated_at = NOW()
   RETURNING id`,
  [username, passwordHash, displayName]
);
const userId = userResult.rows[0].id;

// Assign trainer role
await client.query(
  `INSERT INTO roles (id, user_id, user_role_id) VALUES (gen_random_uuid(), $1, $2) ON CONFLICT DO NOTHING`,
  [userId, trainerRoleId]
);

console.log(`Admin user "${username}" created/updated with trainer role.`);

await client.end();
