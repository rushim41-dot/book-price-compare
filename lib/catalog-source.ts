import "server-only";

import { cache } from "react";
import { scoreQueryAgainstBook } from "@/lib/book-matching";
import {
  CATALOG_BOOKS,
  getCatalogCollections,
  type BookCategory,
  type CatalogBookRecord,
  type CatalogCollectionRecord,
  type CatalogMatch,
} from "@/lib/catalog";
import { getDatabaseCatalogBooks } from "@/lib/db-catalog-records";

type CatalogSnapshot = {
  books: CatalogBookRecord[];
  collections: CatalogCollectionRecord[];
};

const DATABASE_CATALOG_READS_FLAG = "DATABASE_CATALOG_READS";

export async function getCatalogBooks() {
  return (await getCatalogSnapshot()).books;
}

export async function getCatalogCollectionsFromSource() {
  return (await getCatalogSnapshot()).collections;
}

export async function getCatalogCollectionFromSourceBySlug(slug: string) {
  return (
    (await getCatalogCollectionsFromSource()).find(
      (collection) => collection.slug === slug
    ) ?? null
  );
}

export async function getFeaturedCatalogBooksFromSource(limit = 8) {
  return (await getCatalogBooks()).slice(0, limit);
}

export async function getCatalogBooksFromSourceByCategory(category: BookCategory) {
  return (await getCatalogBooks()).filter((book) => book.category === category);
}

export async function getCatalogBookFromSourceBySlug(slug: string) {
  return (await getCatalogBooks()).find((book) => book.slug === slug) ?? null;
}

export async function resolveCatalogMatchFromSourceByQuery(query: string) {
  return resolveCatalogMatchInBooks(query, await getCatalogBooks());
}

export async function resolveCatalogMatchFromSourceForBook(book: {
  title: string;
  authors: string[];
  isbn13?: string | null;
  isbn10?: string | null;
}) {
  const books = await getCatalogBooks();

  if (book.isbn13 || book.isbn10) {
    const isbnQuery = book.isbn13 ?? book.isbn10 ?? "";
    const isbnMatch = resolveCatalogMatchInBooks(isbnQuery, books);
    if (isbnMatch?.confidence === "exact-isbn") {
      return isbnMatch;
    }
  }

  return resolveCatalogMatchInBooks([book.title, ...book.authors].join(" "), books);
}

export { getCatalogCategories, getCatalogCategoryBySlug } from "@/lib/catalog";
export type {
  BookCategory,
  CatalogBookRecord,
  CatalogCollectionRecord,
  CatalogMatch,
  StoreName,
} from "@/lib/catalog";

const getCatalogSnapshot = cache(async (): Promise<CatalogSnapshot> => {
  if (!isDatabaseCatalogReadEnabled()) {
    return buildCatalogSnapshot(CATALOG_BOOKS);
  }

  try {
    const databaseBooks = await getDatabaseCatalogBooks();
    const mismatch = getCatalogMismatchReason(databaseBooks);

    if (mismatch) {
      console.warn(`DATABASE_CATALOG_READS fallback to local catalog: ${mismatch}`);
      return buildCatalogSnapshot(CATALOG_BOOKS);
    }

    return buildCatalogSnapshot(orderBooksLikeLocalCatalog(databaseBooks));
  } catch (error) {
    console.warn(
      `DATABASE_CATALOG_READS fallback to local catalog: ${getErrorSummary(error)}`
    );
    return buildCatalogSnapshot(CATALOG_BOOKS);
  }
});

function isDatabaseCatalogReadEnabled() {
  return process.env[DATABASE_CATALOG_READS_FLAG]?.trim().toLowerCase() === "true";
}

function buildCatalogSnapshot(books: CatalogBookRecord[]): CatalogSnapshot {
  const booksBySlug = new Map(books.map((book) => [book.slug, book]));

  return {
    books,
    collections: getCatalogCollections().map((collection) => ({
      ...collection,
      books: collection.bookSlugs
        .map((slug) => booksBySlug.get(slug))
        .filter((book): book is CatalogBookRecord => Boolean(book)),
    })),
  };
}

function getCatalogMismatchReason(databaseBooks: CatalogBookRecord[]) {
  if (databaseBooks.length !== CATALOG_BOOKS.length) {
    return `expected ${CATALOG_BOOKS.length} books, received ${databaseBooks.length}`;
  }

  const databaseBySlug = new Map(databaseBooks.map((book) => [book.slug, book]));

  for (const localBook of CATALOG_BOOKS) {
    const databaseBook = databaseBySlug.get(localBook.slug);

    if (!databaseBook) {
      return `missing book ${localBook.slug}`;
    }

    const mismatch = compareCatalogBookIdentity(localBook, databaseBook);
    if (mismatch) {
      return `book ${localBook.slug} ${mismatch}`;
    }
  }

  return null;
}

function orderBooksLikeLocalCatalog(databaseBooks: CatalogBookRecord[]) {
  const databaseBySlug = new Map(databaseBooks.map((book) => [book.slug, book]));

  return CATALOG_BOOKS.map((book) => databaseBySlug.get(book.slug)).filter(
    (book): book is CatalogBookRecord => Boolean(book)
  );
}

function compareCatalogBookIdentity(
  localBook: CatalogBookRecord,
  databaseBook: CatalogBookRecord
) {
  for (const key of [
    "id",
    "title",
    "description",
    "category",
    "thumbnail",
    "coverFallback",
    "publisher",
    "publishedDate",
    "isbn13",
    "isbn10",
    "language",
    "format",
    "pages",
  ] as const) {
    if ((localBook[key] ?? null) !== (databaseBook[key] ?? null)) {
      return `${key} mismatch`;
    }
  }

  if (!areStringArraysEqual(localBook.authors, databaseBook.authors)) {
    return "authors mismatch";
  }

  if (
    !areStringSetsEqual(
      localBook.featuredCollectionSlugs,
      databaseBook.featuredCollectionSlugs
    )
  ) {
    return "featuredCollectionSlugs mismatch";
  }

  if (!areStringSetsEqual(localBook.tags, databaseBook.tags)) {
    return "tags mismatch";
  }

  if (localBook.offers.length !== databaseBook.offers.length) {
    return "offer count mismatch";
  }

  for (const localOffer of localBook.offers) {
    const databaseOffer = databaseBook.offers.find(
      (offer) => offer.store === localOffer.store
    );

    if (!databaseOffer) {
      return `missing ${localOffer.store} offer`;
    }

    if (databaseOffer.affiliateQuery !== localOffer.affiliateQuery) {
      return `${localOffer.store} affiliate query mismatch`;
    }

    if (databaseOffer.price.amountInr !== null) {
      return `${localOffer.store} price should be hidden`;
    }
  }

  return null;
}

function areStringArraysEqual(left: string[], right: string[]) {
  return left.length === right.length && left.every((value, index) => value === right[index]);
}

function areStringSetsEqual(left: string[], right: string[]) {
  if (left.length !== right.length) {
    return false;
  }

  const rightValues = new Set(right);
  return left.every((value) => rightValues.has(value));
}

function resolveCatalogMatchInBooks(
  query: string,
  books: CatalogBookRecord[]
): CatalogMatch | null {
  return (
    books
      .map((book) => ({
        book,
        ...scoreQueryAgainstBook(query, {
          title: book.title,
          authors: book.authors,
          isbn13: book.isbn13,
          isbn10: book.isbn10,
          tags: book.tags,
        }),
      }))
      .filter(
        (candidate): candidate is CatalogMatch =>
          candidate.confidence !== null && candidate.score >= 55
      )
      .sort((left, right) => right.score - left.score)[0] ?? null
  );
}

function getErrorSummary(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return "unexpected database read error";
}
