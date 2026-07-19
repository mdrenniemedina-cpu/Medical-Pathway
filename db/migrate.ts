/**
 * Runner de migraciones SQL versionadas (ver `decisions/ADR-017`: SQL crudo
 * en lugar de migraciones generadas por un ORM, para tener control total
 * sobre schemas de Postgres, RLS y vistas materializadas). Uso:
 *   ts-node db/migrate.ts up       — aplica migraciones pendientes
 *   ts-node db/migrate.ts status   — lista aplicadas/pendientes
 */
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { Client } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

const MIGRATIONS_DIR = join(__dirname, 'migrations');

async function ensureMigrationsTable(client: Client): Promise<void> {
  await client.query('CREATE SCHEMA IF NOT EXISTS shared');
  await client.query(`
    CREATE TABLE IF NOT EXISTS shared.schema_migrations (
      filename TEXT PRIMARY KEY,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `);
}

function listMigrationFiles(): string[] {
  return readdirSync(MIGRATIONS_DIR)
    .filter((f) => f.endsWith('.sql'))
    .sort();
}

async function appliedMigrations(client: Client): Promise<Set<string>> {
  const { rows } = await client.query<{ filename: string }>('SELECT filename FROM shared.schema_migrations');
  return new Set(rows.map((r) => r.filename));
}

async function up(): Promise<void> {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  try {
    await ensureMigrationsTable(client);
    const applied = await appliedMigrations(client);
    const files = listMigrationFiles();
    for (const file of files) {
      if (applied.has(file)) continue;
      const sql = readFileSync(join(MIGRATIONS_DIR, file), 'utf-8');
      console.log(`Aplicando ${file}...`);
      await client.query('BEGIN');
      try {
        await client.query(sql);
        await client.query('INSERT INTO shared.schema_migrations (filename) VALUES ($1)', [file]);
        await client.query('COMMIT');
      } catch (err) {
        await client.query('ROLLBACK');
        throw new Error(`Fallo aplicando ${file}: ${(err as Error).message}`);
      }
    }
    console.log('Migraciones al día.');
  } finally {
    await client.end();
  }
}

async function status(): Promise<void> {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  try {
    await ensureMigrationsTable(client);
    const applied = await appliedMigrations(client);
    for (const file of listMigrationFiles()) {
      console.log(`${applied.has(file) ? '[aplicada]  ' : '[pendiente] '} ${file}`);
    }
  } finally {
    await client.end();
  }
}

const command = process.argv[2];
if (command === 'up') void up();
else if (command === 'status') void status();
else {
  console.error('Uso: ts-node db/migrate.ts <up|status>');
  process.exit(1);
}
