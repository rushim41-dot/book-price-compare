import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  buildBookIdentityKey,
  scoreQueryAgainstBook,
} from "@/lib/book-matching";
import type {
  DiscoveredBookCacheRecord,
  SearchableBook,
} from "@/lib/book-types";
import { canPersistRuntimeFiles } from "@/lib/runtime-file-persistence";

const CACHE_DIRECTORY = path.join(process.cwd(), "data");
const CACHE_FILE = path.join(CACHE_DIRECTORY, "discovered-books-cache.json");
const MAX_CACHE_RECORDS = 500;

export async function findCachedDiscoveredBooks(
  query: string,
  limit: number
): Promise<SearchableBook[]> {
  const records = await readCacheRecords();

  return records
    .map((record) => ({
      record,
      match: scoreQueryAgainstBook(query, record),
    }))
    .filter(({ match }) => match.score >= 45)
    .sort((left, right) => {
      if (right.match.score !== left.match.score) {
        return right.match.score - left.match.score;
      }

      return right.record.cachedAt.localeCompare(left.record.cachedAt);
    })
    .slice(0, limit)
    .map(({ record }) => ({
      ...sanitizeCacheRecord(record),
      source: "cache",
    }));
}

export async function persistDiscoveredBooks(
  query: string,
  books: SearchableBook[]
): Promise<void> {
  if (books.length === 0 || !canPersistRuntimeFiles()) {
    return;
  }

  const existingRecords = await readCacheRecords();
  const mergedByKey = new Map(
    existingRecords.map((record) => [buildBookIdentityKey(record), record])
  );

  for (const book of books) {
    const key = buildBookIdentityKey(book);
    const existing = mergedByKey.get(key);
    mergedByKey.set(
      key,
      mergeCacheRecord(existing, sanitizeCacheRecord({
        ...book,
        cachedAt: new Date().toISOString(),
        queries: [query],
      }))
    );
  }

  const records = [...mergedByKey.values()]
    .sort((left, right) => right.cachedAt.localeCompare(left.cachedAt))
    .slice(0, MAX_CACHE_RECORDS);

  try {
    await mkdir(CACHE_DIRECTORY, { recursive: true });
    await writeFile(CACHE_FILE, `${JSON.stringify(records, null, 2)}\n`, "utf8");
  } catch (error) {
    console.warn(`Discovered-book cache write skipped: ${getErrorSummary(error)}`);
  }
}

async function readCacheRecords(): Promise<DiscoveredBookCacheRecord[]> {
  try {
    const file = await readFile(CACHE_FILE, "utf8");
    const parsed = JSON.parse(file) as unknown;
    return Array.isArray(parsed)
      ? parsed.filter(isCacheRecord).map(sanitizeCacheRecord)
      : [];
  } catch {
    return [];
  }
}

function mergeCacheRecord(
  existing: DiscoveredBookCacheRecord | undefined,
  incoming: DiscoveredBookCacheRecord
): DiscoveredBookCacheRecord {
  if (!existing) {
    return incoming;
  }

  return {
    ...existing,
    ...incoming,
    authors: incoming.authors.length > 0 ? incoming.authors : existing.authors,
    thumbnail: incoming.thumbnail ?? existing.thumbnail,
    infoLink: incoming.infoLink || existing.infoLink,
    publishedDate: incoming.publishedDate ?? existing.publishedDate,
    publisher: incoming.publisher ?? existing.publisher,
    isbn13: incoming.isbn13 ?? existing.isbn13,
    isbn10: incoming.isbn10 ?? existing.isbn10,
    description: incoming.description ?? existing.description,
    language: incoming.language ?? existing.language,
    pageCount: incoming.pageCount ?? existing.pageCount,
    format: incoming.format ?? existing.format,
    averageRating: incoming.averageRating ?? existing.averageRating,
    ratingsCount: incoming.ratingsCount ?? existing.ratingsCount,
    source: incoming.source,
    cachedAt: incoming.cachedAt,
    queries: [...new Set([...existing.queries, ...incoming.queries])].slice(-25),
  };
}

function isCacheRecord(value: unknown): value is DiscoveredBookCacheRecord {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<DiscoveredBookCacheRecord>;
  return typeof candidate.id === "string" && typeof candidate.title === "string";
}

function sanitizeCacheRecord(record: DiscoveredBookCacheRecord): DiscoveredBookCacheRecord {
  return {
    ...record,
    title: record.title.trim().replace(/\s+/g, " "),
    authors: sanitizeAuthors(record.authors),
    publisher: sanitizePublisher(record.publisher),
    isbn13: sanitizeIsbn(record.isbn13),
    isbn10: sanitizeIsbn(record.isbn10),
    description: sanitizeDescription(record.description),
    language: sanitizeLanguage(record.language),
    queries: record.queries
      .map((query) => query.trim().replace(/\s+/g, " "))
      .filter(Boolean)
      .slice(-25),
  };
}

function sanitizeAuthors(authors: string[]) {
  const deduped = new Set<string>();

  for (const author of authors) {
    const normalized = author.trim().replace(/\s+/g, " ");
    if (normalized) {
      deduped.add(normalized);
    }
  }

  return [...deduped];
}

function sanitizePublisher(value: string | null) {
  const normalized = value?.trim().replace(/\s+/g, " ") ?? null;

  if (!normalized) {
    return null;
  }

  return /^(unknown|n\/a)$/i.test(normalized) ? null : normalized;
}

function sanitizeDescription(value: string | null) {
  const normalized = value?.trim() ?? null;
  return normalized || null;
}

function sanitizeLanguage(value: string | null) {
  const normalized = value?.trim().toUpperCase() ?? null;
  return normalized || null;
}

function sanitizeIsbn(value: string | null) {
  const normalized = value?.replace(/[^0-9xX]/g, "").toUpperCase() ?? null;
  return normalized || null;
}

function getErrorSummary(error: unknown) {
  return error instanceof Error ? error.message : "unexpected file write error";
}
