import {
  CATALOG_BOOKS,
  getCatalogCategories,
  getCatalogCollections,
  type BookCategory,
  type CatalogBookRecord,
  type StoreName,
} from "./catalog";

export type DataQualityStatus = "curated" | "verified" | "needs_review" | "rejected";

export type ExternalIdentifierSource =
  | "isbn10"
  | "isbn13"
  | "open_library_work"
  | "open_library_edition"
  | "open_library_cover"
  | "google_books_volume"
  | "project_gutenberg"
  | "manual";

export type CoverAssetSource =
  | "curated"
  | "open_library"
  | "google_books"
  | "project_gutenberg"
  | "local_generated"
  | "manual";

export type StoreOfferLinkType = "search" | "verified_product";

export type DatabaseCategorySeed = {
  slug: BookCategory;
  label: string;
  description: string;
};

export type DatabaseCollectionSeed = {
  slug: string;
  label: string;
  description: string;
};

export type DatabaseBookSeed = {
  catalogId: string;
  slug: string;
  title: string;
  description: string;
  categorySlug: BookCategory;
  thumbnailUrl: string | null;
  coverFallbackPath: string | null;
  publisher: string | null;
  publishedDateText: string | null;
  isbn13: string | null;
  isbn10: string | null;
  language: string;
  format: string;
  pages: number | null;
  dataQualityStatus: DataQualityStatus;
};

export type DatabaseAuthorSeed = {
  key: string;
  name: string;
  normalizedName: string;
};

export type DatabaseBookAuthorSeed = {
  bookSlug: string;
  authorKey: string;
  authorOrder: number;
  role: "author";
};

export type DatabaseBookCollectionSeed = {
  bookSlug: string;
  collectionSlug: string;
  position: number;
};

export type DatabaseBookTagSeed = {
  bookSlug: string;
  tag: string;
};

export type DatabaseExternalIdentifierSeed = {
  bookSlug: string;
  source: ExternalIdentifierSource;
  externalId: string;
  externalUrl: string | null;
  confidence: "curated" | "verified" | "candidate" | "needs_review" | "rejected";
};

export type DatabaseCoverAssetSeed = {
  bookSlug: string;
  source: CoverAssetSource;
  imageUrl: string | null;
  storagePath: string | null;
  status: "primary" | "fallback" | "candidate" | "broken" | "rejected";
  isPrimary: boolean;
};

export type DatabaseStoreOfferSeed = {
  bookSlug: string;
  store: StoreName;
  affiliateQuery: string;
  outboundUrl: string | null;
  productId: string | null;
  linkType: StoreOfferLinkType;
  priceAmountInr: number | null;
  priceDisplayAllowed: boolean;
  offerSummary: string | null;
  deliveryText: string | null;
};

export type CatalogDatabaseSeed = {
  categories: DatabaseCategorySeed[];
  collections: DatabaseCollectionSeed[];
  books: DatabaseBookSeed[];
  authors: DatabaseAuthorSeed[];
  bookAuthors: DatabaseBookAuthorSeed[];
  bookCollections: DatabaseBookCollectionSeed[];
  bookTags: DatabaseBookTagSeed[];
  externalIdentifiers: DatabaseExternalIdentifierSeed[];
  coverAssets: DatabaseCoverAssetSeed[];
  storeOffers: DatabaseStoreOfferSeed[];
};

export function buildCatalogDatabaseSeed(
  books: CatalogBookRecord[] = CATALOG_BOOKS
): CatalogDatabaseSeed {
  const authorSeeds = new Map<string, DatabaseAuthorSeed>();
  const collections = getCatalogCollections();
  const collectionPositions = buildCollectionPositions(collections);
  const publishedBookSlugs = new Set(books.map((book) => book.slug));

  return {
    categories: getCatalogCategories().map((category) => ({ ...category })),
    collections: collections.map((collection) => ({
      slug: collection.slug,
      label: collection.label,
      description: collection.description,
    })),
    books: books.map(toBookSeed),
    authors: collectAuthorSeeds(books, authorSeeds),
    bookAuthors: books.flatMap((book) => toBookAuthorSeeds(book, authorSeeds)),
    bookCollections: collections.flatMap((collection) =>
      collection.books
        .filter((book) => publishedBookSlugs.has(book.slug))
        .map((book) => ({
          bookSlug: book.slug,
          collectionSlug: collection.slug,
          position: collectionPositions.get(`${collection.slug}:${book.slug}`) ?? 0,
        }))
    ),
    bookTags: books.flatMap((book) =>
      book.tags.map((tag) => ({
        bookSlug: book.slug,
        tag,
      }))
    ),
    externalIdentifiers: books.flatMap(toExternalIdentifierSeeds),
    coverAssets: books.flatMap(toCoverAssetSeeds),
    storeOffers: books.flatMap(toStoreOfferSeeds),
  };
}

function toBookSeed(book: CatalogBookRecord): DatabaseBookSeed {
  return {
    catalogId: book.id,
    slug: book.slug,
    title: book.title,
    description: book.description,
    categorySlug: book.category,
    thumbnailUrl: book.thumbnail,
    coverFallbackPath: book.coverFallback ?? null,
    publisher: book.publisher,
    publishedDateText: book.publishedDate,
    isbn13: book.isbn13,
    isbn10: book.isbn10,
    language: book.language,
    format: book.format,
    pages: book.pages,
    dataQualityStatus: "curated",
  };
}

function collectAuthorSeeds(
  books: CatalogBookRecord[],
  authorSeeds: Map<string, DatabaseAuthorSeed>
) {
  for (const book of books) {
    for (const author of book.authors) {
      getOrCreateAuthorSeed(author, authorSeeds);
    }
  }

  return Array.from(authorSeeds.values()).sort((left, right) =>
    left.name.localeCompare(right.name)
  );
}

function toBookAuthorSeeds(
  book: CatalogBookRecord,
  authorSeeds: Map<string, DatabaseAuthorSeed>
) {
  return book.authors.map((author, authorOrder) => ({
    bookSlug: book.slug,
    authorKey: getOrCreateAuthorSeed(author, authorSeeds).key,
    authorOrder,
    role: "author" as const,
  }));
}

function toExternalIdentifierSeeds(
  book: CatalogBookRecord
): DatabaseExternalIdentifierSeed[] {
  const identifiers: DatabaseExternalIdentifierSeed[] = [];

  if (book.isbn13) {
    identifiers.push({
      bookSlug: book.slug,
      source: "isbn13",
      externalId: book.isbn13,
      externalUrl: null,
      confidence: "curated",
    });
  }

  if (book.isbn10) {
    identifiers.push({
      bookSlug: book.slug,
      source: "isbn10",
      externalId: book.isbn10,
      externalUrl: null,
      confidence: "curated",
    });
  }

  return identifiers;
}

function toCoverAssetSeeds(book: CatalogBookRecord): DatabaseCoverAssetSeed[] {
  const covers: DatabaseCoverAssetSeed[] = [];

  if (book.thumbnail) {
    covers.push({
      bookSlug: book.slug,
      source: inferCoverSource(book.thumbnail),
      imageUrl: book.thumbnail,
      storagePath: null,
      status: "primary",
      isPrimary: true,
    });
  }

  if (book.coverFallback) {
    covers.push({
      bookSlug: book.slug,
      source: "local_generated",
      imageUrl: null,
      storagePath: book.coverFallback,
      status: "fallback",
      isPrimary: !book.thumbnail,
    });
  }

  return covers;
}

function toStoreOfferSeeds(book: CatalogBookRecord): DatabaseStoreOfferSeed[] {
  return book.offers.map((offer) => ({
    bookSlug: book.slug,
    store: offer.store,
    affiliateQuery: offer.affiliateQuery,
    outboundUrl: null,
    productId: null,
    linkType: "search",
    priceAmountInr: null,
    priceDisplayAllowed: false,
    offerSummary: null,
    deliveryText: null,
  }));
}

function buildCollectionPositions(
  collections: ReturnType<typeof getCatalogCollections>
) {
  const positions = new Map<string, number>();

  for (const collection of collections) {
    collection.books.forEach((book, position) => {
      positions.set(`${collection.slug}:${book.slug}`, position);
    });
  }

  return positions;
}

function getOrCreateAuthorSeed(
  name: string,
  authorSeeds: Map<string, DatabaseAuthorSeed>
) {
  const normalizedName = normalizeText(name);
  const key = slugifySeedValue(normalizedName);
  const existing = authorSeeds.get(key);

  if (existing) {
    return existing;
  }

  const seed = {
    key,
    name,
    normalizedName,
  };
  authorSeeds.set(key, seed);

  return seed;
}

function inferCoverSource(url: string): CoverAssetSource {
  if (url.includes("covers.openlibrary.org")) {
    return "open_library";
  }

  if (url.includes("books.google.") || url.includes("googleusercontent.")) {
    return "google_books";
  }

  return "curated";
}

function normalizeText(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

function slugifySeedValue(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
