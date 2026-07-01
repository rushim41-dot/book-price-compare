import {
  isTrustedBookMatch,
  normalizeSearchText,
  scoreQueryAgainstBook,
} from "@/lib/book-matching";
import type { SearchableBook } from "@/lib/book-types";

type BookMetadataCorrection = Partial<
  Pick<
    SearchableBook,
    | "title"
    | "authors"
    | "thumbnail"
    | "publishedDate"
    | "publisher"
    | "isbn13"
    | "isbn10"
    | "description"
    | "language"
    | "pageCount"
    | "format"
  >
>;

const BOOK_METADATA_CORRECTIONS: Array<{
  title: string;
  author: string;
  correction: BookMetadataCorrection;
}> = [
  {
    title: "Dungeon Crawler Carl",
    author: "Matt Dinniman",
    correction: {
      title: "Dungeon Crawler Carl",
      authors: ["Matt Dinniman"],
      thumbnail: null,
      publisher: "Ace",
      publishedDate: "2020",
      isbn13: "9780593820254",
      isbn10: "0593820258",
      language: "ENG",
      format: "Paperback",
    },
  },
  {
    title: "Think Again",
    author: "Adam Grant",
    correction: {
      title: "Think Again",
      authors: ["Adam Grant"],
      thumbnail: null,
      publisher: "Penguin Publishing Group",
      publishedDate: "2021",
      isbn13: "9780593395783",
      isbn10: "1984878107",
      language: "ENG",
      format: "Paperback",
    },
  },
];

export function findCanonicalSearchBook(query: string): SearchableBook | null {
  const match = BOOK_METADATA_CORRECTIONS
    .map((item) => ({
      item,
      match: scoreQueryAgainstBook(query, {
        title: item.title,
        authors: [item.author],
        isbn13: item.correction.isbn13,
        isbn10: item.correction.isbn10,
      }),
    }))
    .filter(({ match }) => isTrustedBookMatch(match.confidence))
    .sort((left, right) => right.match.score - left.match.score)[0];

  if (!match) {
    return null;
  }

  return buildCorrectedBook(match.item.title, match.item.author, match.item.correction);
}

export function applyBookMetadataCorrection(book: SearchableBook): SearchableBook {
  const normalizedTitle = normalizeSearchText(book.title);
  const normalizedAuthors = new Set(book.authors.map((author) => normalizeSearchText(author)));
  const match = BOOK_METADATA_CORRECTIONS.find(
    (item) =>
      normalizedTitle === normalizeSearchText(item.title) &&
      normalizedAuthors.has(normalizeSearchText(item.author))
  );

  if (!match) {
    return book;
  }

  return {
    ...book,
    ...match.correction,
  };
}

function buildCorrectedBook(
  title: string,
  author: string,
  correction: BookMetadataCorrection
): SearchableBook {
  return {
    id: `canonical-${normalizeSearchText(title).replace(/\s+/g, "-")}`,
    title: correction.title ?? title,
    authors: correction.authors ?? [author],
    thumbnail: correction.thumbnail ?? null,
    infoLink: correction.isbn13
      ? `https://openlibrary.org/isbn/${correction.isbn13}`
      : "https://openlibrary.org/",
    publishedDate: correction.publishedDate ?? null,
    publisher: correction.publisher ?? null,
    isbn13: correction.isbn13 ?? null,
    isbn10: correction.isbn10 ?? null,
    description: correction.description ?? null,
    language: correction.language ?? null,
    pageCount: correction.pageCount ?? null,
    format: correction.format ?? null,
    averageRating: null,
    ratingsCount: null,
    source: "catalog",
  };
}
