import "server-only";

import { queryDatabase } from "@/lib/db";

export type CatalogTableCounts = {
  books: number;
  storeOffers: number;
  coverAssets: number;
  externalBookIdentifiers: number;
};

type CountRow = {
  table_name: "books" | "store_offers" | "cover_assets" | "external_book_identifiers";
  count: string;
};

const COUNT_QUERY = `
  select 'books' as table_name, count(*)::text as count from books
  union all
  select 'store_offers', count(*)::text from store_offers
  union all
  select 'cover_assets', count(*)::text from cover_assets
  union all
  select 'external_book_identifiers', count(*)::text from external_book_identifiers
`;

export async function getCatalogTableCounts(): Promise<CatalogTableCounts> {
  const result = await queryDatabase<CountRow>(COUNT_QUERY);
  const counts = Object.fromEntries(
    result.rows.map((row) => [row.table_name, Number(row.count)])
  );

  return {
    books: counts.books ?? 0,
    storeOffers: counts.store_offers ?? 0,
    coverAssets: counts.cover_assets ?? 0,
    externalBookIdentifiers: counts.external_book_identifiers ?? 0,
  };
}

