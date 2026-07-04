import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import pg from "pg";

const { Pool } = pg;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");

await loadDotEnvLocal();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error("DATABASE_URL is missing. Add your Supabase pooled connection string to .env.local.");
  process.exit(1);
}

const pool = new Pool({
  connectionString,
  max: 1,
  idleTimeoutMillis: 5_000,
  connectionTimeoutMillis: 10_000,
  ssl: connectionString.includes("sslmode=disable")
    ? false
    : { rejectUnauthorized: false },
});

try {
  const result = await pool.query(`
    select 'books' as table_name, count(*)::int as count from books
    union all
    select 'store_offers', count(*)::int from store_offers
    union all
    select 'cover_assets', count(*)::int from cover_assets
    union all
    select 'external_book_identifiers', count(*)::int from external_book_identifiers
    order by table_name
  `);

  console.table(result.rows);
} finally {
  await pool.end();
}

async function loadDotEnvLocal() {
  const envPath = path.join(rootDir, ".env.local");
  let content;

  try {
    content = await readFile(envPath, "utf8");
  } catch {
    return;
  }

  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const separatorIndex = trimmed.indexOf("=");

    if (separatorIndex === -1) {
      continue;
    }

    const key = trimmed.slice(0, separatorIndex).trim();
    const value = trimmed
      .slice(separatorIndex + 1)
      .trim()
      .replace(/^"|"$/g, "");

    if (key && !(key in process.env)) {
      process.env[key] = value;
    }
  }
}

