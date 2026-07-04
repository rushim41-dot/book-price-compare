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

const seed = JSON.parse(
  await readFile(path.join(rootDir, "data", "catalog-database-seed.json"), "utf8")
);

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
  const [countResult, bookResult, storeResult] = await Promise.all([
    pool.query(`
      select 'books' as table_name, count(*)::int as count from books
      union all
      select 'store_offers', count(*)::int from store_offers
      union all
      select 'cover_assets', count(*)::int from cover_assets
      union all
      select 'external_book_identifiers', count(*)::int from external_book_identifiers
      order by table_name
    `),
    pool.query(`
      select slug, title, isbn13, thumbnail_url, cover_fallback_path
      from books
      order by slug
    `),
    pool.query(`
      select b.slug, so.store, so.affiliate_query, so.link_type, so.price_display_allowed
      from store_offers so
      join books b on b.id = so.book_id
      order by b.slug, so.store
    `),
  ]);

  const mismatches = [
    ...compareCounts(countResult.rows),
    ...compareBooks(bookResult.rows),
    ...compareStoreOffers(storeResult.rows),
  ];

  console.table(countResult.rows);

  if (mismatches.length > 0) {
    console.error(`Catalog database comparison failed with ${mismatches.length} mismatch(es):`);
    for (const mismatch of mismatches.slice(0, 25)) {
      console.error(`- ${mismatch}`);
    }
    process.exitCode = 1;
  } else {
    console.log("Database catalog matches the generated local seed for counts, books, and safe store offer metadata.");
  }
} finally {
  await pool.end();
}

function compareCounts(rows) {
  const counts = Object.fromEntries(rows.map((row) => [row.table_name, row.count]));
  const expected = {
    books: seed.books.length,
    store_offers: seed.storeOffers.length,
    cover_assets: seed.coverAssets.length,
    external_book_identifiers: seed.externalIdentifiers.length,
  };

  return Object.entries(expected).flatMap(([tableName, expectedCount]) =>
    counts[tableName] === expectedCount
      ? []
      : [`${tableName} expected ${expectedCount}, got ${counts[tableName] ?? "missing"}`]
  );
}

function compareBooks(rows) {
  const actual = new Map(rows.map((row) => [row.slug, row]));
  const mismatches = [];

  for (const book of seed.books) {
    const row = actual.get(book.slug);

    if (!row) {
      mismatches.push(`missing book ${book.slug}`);
      continue;
    }

    for (const [actualKey, expectedKey] of [
      ["title", "title"],
      ["isbn13", "isbn13"],
      ["thumbnail_url", "thumbnailUrl"],
      ["cover_fallback_path", "coverFallbackPath"],
    ]) {
      if ((row[actualKey] ?? null) !== (book[expectedKey] ?? null)) {
        mismatches.push(`book ${book.slug} ${actualKey} mismatch`);
      }
    }
  }

  return mismatches;
}

function compareStoreOffers(rows) {
  const actual = new Map(
    rows.map((row) => [`${row.slug}:${row.store}`, row])
  );
  const mismatches = [];

  for (const offer of seed.storeOffers) {
    const row = actual.get(`${offer.bookSlug}:${offer.store}`);

    if (!row) {
      mismatches.push(`missing store offer ${offer.bookSlug}:${offer.store}`);
      continue;
    }

    if (row.affiliate_query !== offer.affiliateQuery) {
      mismatches.push(`store offer ${offer.bookSlug}:${offer.store} affiliate query mismatch`);
    }

    if (row.link_type !== "search") {
      mismatches.push(`store offer ${offer.bookSlug}:${offer.store} should still be search`);
    }

    if (row.price_display_allowed !== false) {
      mismatches.push(`store offer ${offer.bookSlug}:${offer.store} should not display prices yet`);
    }
  }

  return mismatches;
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
