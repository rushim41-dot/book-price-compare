import {
  getCatalogBooks,
  getCatalogCategories,
  getCatalogCollectionsFromSource,
  type BookCategory,
  type CatalogBookRecord,
  type CatalogMatch,
  type StoreName,
} from "@/lib/catalog-source";
import {
  buildBookIdentityKey,
  hasNonPrimaryBookMarker,
  hasTitleVariantMarker,
  normalizeBookTitle,
  isTrustedBookMatch,
  normalizeSearchText,
  scoreQueryAgainstBook,
} from "@/lib/book-matching";
import {
  findCachedDiscoveredBooks,
  persistDiscoveredBooks,
} from "@/lib/discovered-books-cache";
import {
  applyBookMetadataCorrection,
  findCanonicalSearchBook,
} from "@/lib/book-corrections";
import {
  type BookResult,
  type CatalogBook,
  type SearchResponse,
  type SearchableBook,
} from "@/lib/book-types";
import { buildApprovedStoreLink, normalizeAffiliateQuery } from "@/lib/store-links";

const DEFAULT_SEARCH_LIMIT = 12;
const CATALOG_FETCH_TIMEOUT_MS = 8_000;
const MAX_SEARCH_QUERY_LENGTH = 180;

export async function searchBooks(query: string): Promise<SearchResponse> {
  const trimmedQuery = normalizeIncomingQuery(query);
  const notes: string[] = [
    "Marketplace MVP mode: store buttons use approved outbound search or affiliate links. Live price scraping is intentionally off because it is fragile and can violate store terms.",
    "Prices are only shown when we have a trusted internal catalog match. Otherwise we keep the link safe and leave the price blank.",
  ];
  const catalogBooksPromise = getCatalogBooks();
  const catalogCollectionsPromise = getCatalogCollectionsFromSource();

  const cachedBooks = await findCachedDiscoveredBooks(trimmedQuery, DEFAULT_SEARCH_LIMIT);

  let sourceBooks: SearchableBook[] = [];

  try {
    sourceBooks = await searchGoogleBooks(trimmedQuery, DEFAULT_SEARCH_LIMIT);
  } catch (googleError) {
    try {
      sourceBooks = await searchOpenLibrary(trimmedQuery, DEFAULT_SEARCH_LIMIT);
      notes.push(
        `Google Books could not be loaded (${getErrorSummary(googleError)}), so Open Library results are shown instead.`
      );
    } catch (openLibraryError) {
      notes.push(
        `Book catalog data could not be loaded (${getErrorSummary(openLibraryError)}), so cached matches and safe store search links are shown instead.`
      );
    }
  }

  if (sourceBooks.length > 0) {
    await persistDiscoveredBooks(trimmedQuery, sourceBooks);
  } else if (cachedBooks.length > 0) {
    notes.push("Using previously discovered book data because live sources did not return a reliable result.");
  }

  const correctedSourceBooks = sourceBooks.map(applyBookMetadataCorrection);
  const correctedCachedBooks = cachedBooks.map(applyBookMetadataCorrection);
  const canonicalBook = findCanonicalSearchBook(trimmedQuery);
  const mergedBooks = dedupeBooks([
    ...(canonicalBook ? [canonicalBook] : []),
    ...correctedSourceBooks,
    ...correctedCachedBooks.filter((book) =>
      !correctedSourceBooks.some((item) => isSameBook(item, book))
    ),
  ]);

  const [catalogBooks, catalogCollections] = await Promise.all([
    catalogBooksPromise,
    catalogCollectionsPromise,
  ]);
  const catalogMatch = resolveCatalogMatchByQueryInBooks(trimmedQuery, catalogBooks);
  const categoryRecords = getCatalogCategories();
  const collectionMatches = catalogCollections
    .filter((collection) =>
      collection.books.some((book) => {
        const match = scoreQueryAgainstBook(trimmedQuery, {
          title: book.title,
          authors: book.authors,
          isbn13: book.isbn13,
          isbn10: book.isbn10,
          tags: book.tags,
        });

        return match.score >= 55;
      })
    )
    .map((collection) => ({
      slug: collection.slug,
      label: collection.label,
      description: collection.description,
    }));

  let books = mergedBooks
    .map((book) => enrichBookWithCatalog(book, catalogBooks))
    .sort((left, right) => rankBook(right, trimmedQuery) - rankBook(left, trimmedQuery));

  if (books.length === 0 && catalogMatch && isTrustedBookMatch(catalogMatch.confidence)) {
    books = [buildBookFromCatalogRecord(catalogMatch.book)];
    notes.push(
      `Internal catalog match found in ${formatCategoryLabel(catalogMatch.book.category)}.`
    );
  } else if (catalogMatch && isTrustedBookMatch(catalogMatch.confidence)) {
    const directCatalogBook = buildBookFromCatalogRecord(catalogMatch.book);
    if (!books.some((book) => isSameBook(book, directCatalogBook))) {
      books = [directCatalogBook, ...books].slice(0, DEFAULT_SEARCH_LIMIT);
    }
  }

  if (catalogMatch && isTrustedBookMatch(catalogMatch.confidence)) {
    notes.push(
      `Internal catalog match found in ${formatCategoryLabel(catalogMatch.book.category)}.`
    );
  }

  const fallbackOffers = buildMarketplaceResults(
    {
      id: "fallback",
      title: trimmedQuery,
      authors: [],
      thumbnail: null,
      infoLink: "https://books.google.com/",
      publishedDate: null,
      publisher: null,
      isbn13: null,
      isbn10: null,
      description: null,
      language: null,
      pageCount: null,
      format: null,
      averageRating: null,
      ratingsCount: null,
      source: "google-books",
    },
    null
  );
  const responseBooks =
    books.length > 0
      ? books.slice(0, DEFAULT_SEARCH_LIMIT)
      : [buildFallbackCatalogBook(trimmedQuery, fallbackOffers)];
  const firstOffers = responseBooks[0]?.offers ?? fallbackOffers;
  const matchedCategory =
    responseBooks[0]?.category ??
    catalogMatch?.book.category ??
    categoryRecords.find((category) => matchesSearchQuery(category.label, trimmedQuery))?.slug ??
    null;

  if (books.length === 0) {
    notes.push("We could not verify a live book match for this search yet, so showing safe store links for your exact query.");
  }

  return {
    query: trimmedQuery,
    books: responseBooks,
    googleBook: responseBooks[0] ?? null,
    amazon: firstOffers.filter((offer) => offer.store === "amazon"),
    flipkart: firstOffers.filter((offer) => offer.store === "flipkart"),
    bookswagon: firstOffers.filter((offer) => offer.store === "bookswagon"),
    cheapestId: findCheapestId(firstOffers),
    notes,
    matchedCategory,
    collections: collectionMatches,
  };
}

export function normalizeIncomingQuery(query: string) {
  return normalizeAffiliateQuery(query).slice(0, MAX_SEARCH_QUERY_LENGTH);
}

async function searchGoogleBooks(query: string, limit: number): Promise<SearchableBook[]> {
  const apiKey = process.env.GOOGLE_BOOKS_API_KEY?.trim();
  const params = new URLSearchParams({
    q: query,
    maxResults: String(limit),
    country: "IN",
    printType: "books",
    orderBy: "relevance",
  });

  if (apiKey) {
    params.set("key", apiKey);
  }

  const response = await fetch(
    `https://www.googleapis.com/books/v1/volumes?${params.toString()}`,
    {
      cache: "no-store",
      signal: AbortSignal.timeout(CATALOG_FETCH_TIMEOUT_MS),
    }
  );

  if (!response.ok) {
    throw new Error(`Google Books failed: ${response.status}`);
  }

  const data = (await response.json()) as {
    items?: Array<{
      id: string;
      volumeInfo?: {
        title?: string;
        authors?: string[];
        infoLink?: string;
        publishedDate?: string;
        publisher?: string;
        description?: string;
        pageCount?: number;
        language?: string;
        averageRating?: number;
        ratingsCount?: number;
        industryIdentifiers?: Array<{
          type?: string;
          identifier?: string;
        }>;
        imageLinks?: {
          thumbnail?: string;
          smallThumbnail?: string;
        };
      };
    }>;
  };

  return (data.items ?? []).flatMap((item) => {
    const volumeInfo = item.volumeInfo;
    if (!volumeInfo?.title) {
      return [];
    }

    const identifiers = volumeInfo.industryIdentifiers ?? [];
    const isbn13 =
      identifiers.find((identifier) => identifier.type === "ISBN_13")?.identifier ?? null;
    const isbn10 =
      identifiers.find((identifier) => identifier.type === "ISBN_10")?.identifier ?? null;

    return [
      sanitizeSearchableBook({
        id: item.id,
        title: volumeInfo.title,
        authors: volumeInfo.authors ?? [],
        thumbnail:
          volumeInfo.imageLinks?.thumbnail?.replace("http://", "https://") ??
          volumeInfo.imageLinks?.smallThumbnail?.replace("http://", "https://") ??
          null,
        infoLink: volumeInfo.infoLink ?? "https://books.google.com/",
        publishedDate: volumeInfo.publishedDate ?? null,
        publisher: volumeInfo.publisher ?? null,
        isbn13,
        isbn10,
        description: volumeInfo.description ?? null,
        language: volumeInfo.language ? volumeInfo.language.toUpperCase() : null,
        pageCount: volumeInfo.pageCount ?? null,
        format: null,
        averageRating: volumeInfo.averageRating ?? null,
        ratingsCount: volumeInfo.ratingsCount ?? null,
        source: "google-books",
      }),
    ];
  });
}

async function searchOpenLibrary(query: string, limit: number): Promise<SearchableBook[]> {
  const params = new URLSearchParams({
    q: query,
    limit: String(limit),
    fields: "key,title,author_name,cover_i,first_publish_year,publisher,isbn,language",
  });

  const response = await fetch(`https://openlibrary.org/search.json?${params.toString()}`, {
    cache: "no-store",
    signal: AbortSignal.timeout(CATALOG_FETCH_TIMEOUT_MS),
  });

  if (!response.ok) {
    throw new Error(`Open Library failed: ${response.status}`);
  }

  const data = (await response.json()) as {
    docs?: Array<{
      key?: string;
      title?: string;
      author_name?: string[];
      cover_i?: number;
      first_publish_year?: number;
      publisher?: string[];
      isbn?: string[];
      language?: string[];
    }>;
  };

  return (data.docs ?? []).flatMap((book, index) => {
    if (!book.title) {
      return [];
    }

    const isbn13 = book.isbn?.find((isbn) => isbn.length === 13) ?? null;
    const isbn10 = book.isbn?.find((isbn) => isbn.length === 10) ?? null;
    const openLibraryPath = book.key ?? `/search?q=${encodeURIComponent(query)}`;

    return [
      sanitizeSearchableBook({
        id: book.key ?? `open-library-${index}`,
        title: book.title,
        authors: book.author_name ?? [],
        thumbnail: book.cover_i
          ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
          : null,
        infoLink: `https://openlibrary.org${openLibraryPath}`,
        publishedDate: book.first_publish_year ? String(book.first_publish_year) : null,
        publisher: book.publisher?.[0] ?? null,
        isbn13,
        isbn10,
        description: null,
        language: book.language?.[0]?.toUpperCase() ?? null,
        pageCount: null,
        format: null,
        averageRating: null,
        ratingsCount: null,
        source: "open-library",
      }),
    ];
  });
}

function enrichBookWithCatalog(
  book: SearchableBook,
  catalogBooks: CatalogBookRecord[]
): CatalogBook {
  const catalogMatch = resolveCatalogMatchForBookInBooks(book, catalogBooks);
  const trustedMatch = catalogMatch && isTrustedBookMatch(catalogMatch.confidence)
    ? catalogMatch
    : null;

  return {
    ...book,
    thumbnail: trustedMatch?.book.thumbnail ?? book.thumbnail ?? null,
    description: trustedMatch?.book.description ?? book.description,
    language: trustedMatch?.book.language ?? book.language,
    pageCount: trustedMatch?.book.pages ?? book.pageCount,
    format: trustedMatch?.book.format ?? book.format,
    category: trustedMatch?.book.category ?? null,
    tags: trustedMatch?.book.tags ?? [],
    offers: buildMarketplaceResults(book, trustedMatch),
    hasTrustedPricing: Boolean(trustedMatch),
  };
}

function buildMarketplaceResults(
  book: SearchableBook,
  catalogMatch: CatalogMatch | null
): BookResult[] {
  const searchText = buildStoreSearchText(book, catalogMatch?.book ?? null);

  return [
    buildStoreResult(book, "amazon", searchText, catalogMatch?.book ?? null),
    buildStoreResult(book, "flipkart", searchText, catalogMatch?.book ?? null),
    buildStoreResult(book, "bookswagon", searchText, catalogMatch?.book ?? null),
  ];
}

function buildStoreResult(
  book: SearchableBook,
  store: StoreName,
  searchText: string,
  catalogMatch?: CatalogBookRecord | null
): BookResult {
  const matchedOffer = catalogMatch?.offers.find((offer) => offer.store === store);
  const outboundQuery =
    matchedOffer && !isLikelyIdentifierQuery(matchedOffer.affiliateQuery)
      ? matchedOffer.affiliateQuery
      : searchText;

  return {
    id: `${book.id}-${store}`,
    title: `Search ${formatStoreName(store)} for "${book.title}"`,
    price: matchedOffer?.price.amountInr ?? null,
    priceText: matchedOffer?.price.label ?? "Check latest price",
    deliveryText: matchedOffer?.deliveryText ?? "Visit store for ETA",
    offerText: matchedOffer?.offerSummary ?? "No trusted price yet",
    lastUpdated: matchedOffer?.price.lastUpdated ?? null,
    link: buildApprovedStoreLink(store, outboundQuery),
    store,
    isFallback: matchedOffer ? matchedOffer.price.amountInr === null : true,
  };
}

function buildBookFromCatalogRecord(book: CatalogBookRecord): CatalogBook {
  return {
    id: book.id,
    title: book.title,
    authors: book.authors,
    thumbnail: book.thumbnail,
    infoLink: "https://openlibrary.org/",
    publishedDate: book.publishedDate,
    publisher: book.publisher,
    isbn13: book.isbn13,
    isbn10: book.isbn10,
    description: book.description,
    language: book.language,
    pageCount: book.pages,
    format: book.format,
    averageRating: null,
    ratingsCount: null,
    source: "catalog",
    category: book.category,
    tags: book.tags,
    offers: buildMarketplaceResults(
      {
        id: book.id,
        title: book.title,
        authors: book.authors,
        thumbnail: book.thumbnail,
        infoLink: "https://openlibrary.org/",
        publishedDate: book.publishedDate,
        publisher: book.publisher,
        isbn13: book.isbn13,
        isbn10: book.isbn10,
        description: book.description,
        language: book.language,
        pageCount: book.pages,
        format: book.format,
        averageRating: null,
        ratingsCount: null,
        source: "catalog",
      },
      {
        book,
        score: 999,
        confidence: "exact-title-author",
      }
    ),
    hasTrustedPricing: true,
  };
}

function buildFallbackCatalogBook(
  query: string,
  offers: BookResult[]
): CatalogBook {
  const emptyBook = buildEmptySearchResult(query);

  return {
    ...emptyBook,
    title: query,
    description: null,
    offers,
    category: null,
    tags: [],
    hasTrustedPricing: false,
  };
}

function buildStoreSearchText(book: SearchableBook, catalogMatch?: CatalogBookRecord | null) {
  return catalogMatch?.title ?? book.title;
}

function resolveCatalogMatchForBookInBooks(
  book: {
    title: string;
    authors: string[];
    isbn13?: string | null;
    isbn10?: string | null;
  },
  catalogBooks: CatalogBookRecord[]
) {
  if (book.isbn13 || book.isbn10) {
    const isbnQuery = book.isbn13 ?? book.isbn10 ?? "";
    const isbnMatch = resolveCatalogMatchByQueryInBooks(isbnQuery, catalogBooks);
    if (isbnMatch?.confidence === "exact-isbn") {
      return isbnMatch;
    }
  }

  return resolveCatalogMatchByQueryInBooks(
    [book.title, ...book.authors].join(" "),
    catalogBooks
  );
}

function resolveCatalogMatchByQueryInBooks(
  query: string,
  catalogBooks: CatalogBookRecord[]
): CatalogMatch | null {
  return (
    catalogBooks
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

function isLikelyIdentifierQuery(value: string) {
  const normalized = value.replace(/[\s-]/g, "");
  return /^[0-9Xx]{10,}$/.test(normalized);
}

function formatStoreName(store: StoreName) {
  if (store === "amazon") {
    return "Amazon";
  }

  if (store === "flipkart") {
    return "Flipkart";
  }

  return "Bookswagon";
}

function formatCategoryLabel(category: BookCategory) {
  return category.replaceAll("-", " ");
}

function matchesSearchQuery(value: string, query: string) {
  return value.trim().toLowerCase().includes(query.trim().toLowerCase());
}

function getErrorSummary(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return "unexpected error";
}

function findCheapestId(results: BookResult[]) {
  const pricedResults = results.filter((item) => item.price !== null);

  if (pricedResults.length === 0) {
    return null;
  }

  let cheapest = pricedResults[0];

  for (const item of pricedResults) {
    if ((item.price ?? Number.POSITIVE_INFINITY) < (cheapest.price ?? Number.POSITIVE_INFINITY)) {
      cheapest = item;
    }
  }

  return cheapest.id;
}

function rankBook(book: SearchableBook | CatalogBook, query: string) {
  const match = scoreQueryAgainstBook(query, book);
  let score = match.score;
  const normalizedQuery = normalizeSearchText(query);
  const normalizedTitle = normalizeSearchText(book.title);
  const canonicalQuery = normalizeSearchText(normalizeBookTitle(query));
  const canonicalTitle = normalizeSearchText(normalizeBookTitle(book.title));

  if ("hasTrustedPricing" in book && book.hasTrustedPricing) {
    score += 25;
  }

  if (book.source === "catalog") {
    score += 45;
  }

  if (book.averageRating !== null) {
    score += Math.min(Math.round(book.averageRating * 2), 10);
  }

  if (canonicalQuery && canonicalQuery === canonicalTitle && normalizedTitle !== normalizedQuery) {
    score += 10;
  }

  if (hasTitleVariantMarker(book.title) && canonicalQuery === canonicalTitle) {
    score -= 18;
  }

  if (hasNonPrimaryBookMarker(book.title)) {
    score -= 60;
  }

  if (book.publisher && /independently published|audible studios/i.test(book.publisher)) {
    score -= 18;
  }

  return score;
}

function dedupeBooks(books: SearchableBook[]) {
  const byId = new Map<string, SearchableBook>();

  for (const book of books) {
    const key = buildBookIdentityKey(book);
    const existing = byId.get(key);
    byId.set(key, mergeBooks(existing, book));
  }

  return [...byId.values()];
}

function mergeBooks(
  existing: SearchableBook | undefined,
  incoming: SearchableBook
): SearchableBook {
  if (!existing) {
    return incoming;
  }

  if (existing.source === "catalog") {
    return {
      ...incoming,
      ...existing,
      averageRating: incoming.averageRating ?? existing.averageRating,
      ratingsCount: incoming.ratingsCount ?? existing.ratingsCount,
      source: "catalog",
    };
  }

  return {
    ...existing,
    ...incoming,
    authors: incoming.authors.length > 0 ? incoming.authors : existing.authors,
    thumbnail: incoming.thumbnail ?? existing.thumbnail,
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
    source: incoming.source === "cache" ? existing.source : incoming.source,
  };
}

function isSameBook(left: SearchableBook, right: SearchableBook) {
  return buildBookIdentityKey(left) === buildBookIdentityKey(right);
}

export function buildEmptySearchResult(query: string): SearchableBook {
  return {
    id: `search-${normalizeSearchText(query)}`,
    title: query,
    authors: [],
    thumbnail: null,
    infoLink: "https://books.google.com/",
    publishedDate: null,
    publisher: null,
    isbn13: null,
    isbn10: null,
    description: null,
    language: null,
    pageCount: null,
    format: null,
    averageRating: null,
    ratingsCount: null,
    source: "google-books",
  };
}

function sanitizeSearchableBook(book: SearchableBook): SearchableBook {
  return {
    ...book,
    title: sanitizeTitle(book.title),
    authors: sanitizeAuthors(book.authors),
    publisher: sanitizePublisher(book.publisher),
    isbn13: sanitizeIsbn(book.isbn13),
    isbn10: sanitizeIsbn(book.isbn10),
    description: sanitizeDescription(book.description),
    language: sanitizeLanguage(book.language),
  };
}

function sanitizeTitle(value: string) {
  return value.trim().replace(/\s+/g, " ");
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
