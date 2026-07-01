import type { BookCategory, StoreName } from "@/lib/catalog";

export type BookSource = "google-books" | "open-library" | "catalog" | "cache";

export type BookResult = {
  id: string;
  title: string;
  price: number | null;
  priceText: string;
  deliveryText: string;
  offerText: string;
  lastUpdated: string | null;
  link: string;
  store: StoreName;
  isFallback: boolean;
};

export type SearchableBook = {
  id: string;
  title: string;
  authors: string[];
  thumbnail: string | null;
  infoLink: string;
  publishedDate: string | null;
  publisher: string | null;
  isbn13: string | null;
  isbn10: string | null;
  description: string | null;
  language: string | null;
  pageCount: number | null;
  format: string | null;
  averageRating: number | null;
  ratingsCount: number | null;
  source: BookSource;
};

export type CatalogBook = SearchableBook & {
  offers: BookResult[];
  category: BookCategory | null;
  tags: string[];
  hasTrustedPricing: boolean;
};

export type SearchResponse = {
  query: string;
  books: CatalogBook[];
  googleBook: SearchableBook | null;
  amazon: BookResult[];
  flipkart: BookResult[];
  bookswagon: BookResult[];
  cheapestId: string | null;
  notes: string[];
  matchedCategory: BookCategory | null;
  collections: Array<{
    slug: string;
    label: string;
    description: string;
  }>;
};

export type DiscoveredBookCacheRecord = SearchableBook & {
  cachedAt: string;
  queries: string[];
};
