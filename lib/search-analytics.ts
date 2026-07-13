import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { normalizeSearchText } from "@/lib/book-matching";
import type { CatalogBook } from "@/lib/book-types";
import { canPersistRuntimeFiles } from "@/lib/runtime-file-persistence";

type SearchAnalyticsRecord = {
  normalizedQuery: string;
  query: string;
  count: number;
  lastSearchedAt: string;
  book: {
    id: string;
    title: string;
    authors: string[];
    thumbnail: string | null;
    publishedDate: string | null;
    publisher: string | null;
  } | null;
};

const DATA_DIRECTORY = path.join(process.cwd(), "data");
const SEARCH_ANALYTICS_FILE = path.join(DATA_DIRECTORY, "search-analytics.json");
const MAX_SEARCH_ANALYTICS_RECORDS = 1000;

export async function recordSearchAnalytics(
  query: string,
  primaryBook: CatalogBook | null
) {
  const normalizedQuery = normalizeSearchText(query);
  if (
    !normalizedQuery ||
    !isTrackableSearchBook(primaryBook) ||
    !canPersistRuntimeFiles()
  ) {
    return;
  }

  const records = await readSearchAnalyticsRecords();
  const now = new Date().toISOString();
  const existingRecord = records.find((record) => record.normalizedQuery === normalizedQuery);

  if (existingRecord) {
    existingRecord.query = query;
    existingRecord.count += 1;
    existingRecord.lastSearchedAt = now;
    existingRecord.book = buildTrackedBookSummary(primaryBook);
  } else {
    records.push({
      normalizedQuery,
      query,
      count: 1,
      lastSearchedAt: now,
      book: buildTrackedBookSummary(primaryBook),
    });
  }

  const trimmedRecords = records
    .sort((left, right) => right.lastSearchedAt.localeCompare(left.lastSearchedAt))
    .slice(0, MAX_SEARCH_ANALYTICS_RECORDS);

  try {
    await mkdir(DATA_DIRECTORY, { recursive: true });
    await writeFile(
      SEARCH_ANALYTICS_FILE,
      `${JSON.stringify(trimmedRecords, null, 2)}\n`,
      "utf8"
    );
  } catch (error) {
    console.warn(`Search analytics write skipped: ${getErrorSummary(error)}`);
  }
}

export async function getTopSearchAnalytics(limit = 8) {
  const records = await readSearchAnalyticsRecords();

  return records
    .filter(isPublicSearchAnalyticsRecord)
    .sort((left, right) => {
      if (right.count !== left.count) {
        return right.count - left.count;
      }

      return right.lastSearchedAt.localeCompare(left.lastSearchedAt);
    })
    .slice(0, limit);
}

async function readSearchAnalyticsRecords(): Promise<SearchAnalyticsRecord[]> {
  try {
    const file = await readFile(SEARCH_ANALYTICS_FILE, "utf8");
    const parsed = JSON.parse(file) as unknown;
    return Array.isArray(parsed)
      ? parsed.filter(isSearchAnalyticsRecord)
      : [];
  } catch {
    return [];
  }
}

function buildTrackedBookSummary(primaryBook: CatalogBook | null) {
  if (!isTrackableSearchBook(primaryBook)) {
    return null;
  }

  return {
    id: primaryBook.id,
    title: primaryBook.title,
    authors: primaryBook.authors,
    thumbnail: primaryBook.thumbnail,
    publishedDate: primaryBook.publishedDate,
    publisher: primaryBook.publisher,
  };
}

function isPublicSearchAnalyticsRecord(record: SearchAnalyticsRecord) {
  const book = record.book;
  if (!book?.title || !book.id) {
    return false;
  }

  return !book.id.startsWith("search-");
}

function isTrackableSearchBook(
  primaryBook: CatalogBook | null
): primaryBook is CatalogBook {
  if (!primaryBook?.title || !primaryBook.id) {
    return false;
  }

  return !primaryBook.id.startsWith("search-");
}

function isSearchAnalyticsRecord(value: unknown): value is SearchAnalyticsRecord {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<SearchAnalyticsRecord>;
  return (
    typeof candidate.normalizedQuery === "string" &&
    typeof candidate.query === "string" &&
    typeof candidate.count === "number" &&
    typeof candidate.lastSearchedAt === "string"
  );
}

function getErrorSummary(error: unknown) {
  return error instanceof Error ? error.message : "unexpected file write error";
}
