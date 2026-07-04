import "server-only";

import { Pool, type QueryResultRow } from "pg";

let pool: Pool | null = null;

export function getDatabasePool() {
  if (pool) {
    return pool;
  }

  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL is not configured.");
  }

  pool = new Pool({
    connectionString,
    max: 5,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 10_000,
    ssl: connectionString.includes("sslmode=disable")
      ? false
      : { rejectUnauthorized: false },
  });

  return pool;
}

export async function queryDatabase<Row extends QueryResultRow>(
  text: string,
  values: unknown[] = []
) {
  return getDatabasePool().query<Row>(text, values);
}
