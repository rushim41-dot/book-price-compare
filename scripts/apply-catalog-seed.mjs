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

const seedSqlPath = path.join(rootDir, "db", "seed-catalog.sql");
const seedSql = await readFile(seedSqlPath, "utf8");

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
  await pool.query(seedSql);
  console.log(`Applied catalog seed from ${seedSqlPath}`);
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
