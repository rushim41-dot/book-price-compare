import "server-only";

import { queryDatabase } from "@/lib/db";
import type {
  BookCategory,
  CatalogBookRecord,
  CatalogStoreOffer,
  StoreName,
} from "@/lib/catalog";

type DatabaseBookRow = {
  catalog_id: string;
  slug: string;
  title: string;
  description: string;
  category_slug: BookCategory;
  thumbnail_url: string | null;
  cover_fallback_path: string | null;
  publisher: string | null;
  published_date_text: string | null;
  isbn13: string | null;
  isbn10: string | null;
  language: string;
  format: string;
  pages: number | null;
  authors: unknown;
  tags: unknown;
  featured_collection_slugs: unknown;
  offers: unknown;
};

type DatabaseOffer = {
  store: StoreName;
  affiliateQuery: string;
  priceAmountInr: number | null;
  priceDisplayAllowed: boolean;
  priceLastCheckedAt: string | null;
  offerSummary: string | null;
  deliveryText: string | null;
};

const DATABASE_CATALOG_BOOKS_QUERY = `
  select
    b.catalog_id,
    b.slug,
    b.title,
    b.description,
    b.category_slug,
    b.thumbnail_url,
    b.cover_fallback_path,
    b.publisher,
    b.published_date_text,
    b.isbn13,
    b.isbn10,
    b.language,
    b.format,
    b.pages,
    coalesce(authors.authors, '[]'::jsonb) as authors,
    coalesce(tags.tags, '[]'::jsonb) as tags,
    coalesce(collections.featured_collection_slugs, '[]'::jsonb) as featured_collection_slugs,
    coalesce(offers.offers, '[]'::jsonb) as offers
  from books b
  left join lateral (
    select jsonb_agg(a.name order by ba.author_order) as authors
    from book_authors ba
    join authors a on a.id = ba.author_id
    where ba.book_id = b.id
  ) authors on true
  left join lateral (
    select jsonb_agg(bt.tag order by bt.tag) as tags
    from book_tags bt
    where bt.book_id = b.id
  ) tags on true
  left join lateral (
    select jsonb_agg(bc.collection_slug order by bc.position, bc.collection_slug) as featured_collection_slugs
    from book_collections bc
    where bc.book_id = b.id
  ) collections on true
  left join lateral (
    select jsonb_agg(
      jsonb_build_object(
        'store', so.store,
        'affiliateQuery', so.affiliate_query,
        'priceAmountInr', so.price_amount_inr,
        'priceDisplayAllowed', so.price_display_allowed,
        'priceLastCheckedAt', so.price_last_checked_at,
        'offerSummary', so.offer_summary,
        'deliveryText', so.delivery_text
      )
      order by case so.store
        when 'amazon' then 1
        when 'flipkart' then 2
        when 'bookswagon' then 3
        else 4
      end
    ) as offers
    from store_offers so
    where so.book_id = b.id
  ) offers on true
`;

export async function getDatabaseCatalogBooks(): Promise<CatalogBookRecord[]> {
  const result = await queryDatabase<DatabaseBookRow>(
    `${DATABASE_CATALOG_BOOKS_QUERY} order by b.slug`
  );

  return result.rows.map(mapDatabaseBookRow);
}

export async function getDatabaseCatalogBookBySlug(
  slug: string
): Promise<CatalogBookRecord | null> {
  const result = await queryDatabase<DatabaseBookRow>(
    `${DATABASE_CATALOG_BOOKS_QUERY} where b.slug = $1 limit 1`,
    [slug]
  );

  return result.rows[0] ? mapDatabaseBookRow(result.rows[0]) : null;
}

function mapDatabaseBookRow(row: DatabaseBookRow): CatalogBookRecord {
  return {
    id: row.catalog_id,
    slug: row.slug,
    title: row.title,
    authors: asStringArray(row.authors),
    description: row.description,
    category: row.category_slug,
    thumbnail: row.thumbnail_url,
    coverFallback: row.cover_fallback_path,
    publisher: row.publisher,
    publishedDate: row.published_date_text,
    isbn13: row.isbn13,
    isbn10: row.isbn10,
    language: row.language,
    format: row.format,
    pages: row.pages,
    tags: asStringArray(row.tags),
    featuredCollectionSlugs: asStringArray(row.featured_collection_slugs),
    offers: asOfferArray(row.offers),
  };
}

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is string => typeof item === "string");
}

function asOfferArray(value: unknown): CatalogStoreOffer[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap((item) => {
    if (!isDatabaseOffer(item)) {
      return [];
    }

    return {
      store: item.store,
      affiliateQuery: item.affiliateQuery,
      price: {
        amountInr: item.priceDisplayAllowed ? item.priceAmountInr : null,
        label:
          item.priceDisplayAllowed && item.priceAmountInr
            ? formatPriceLabel(item.priceAmountInr)
            : "Check latest price",
        lastUpdated: item.priceDisplayAllowed ? item.priceLastCheckedAt : null,
      },
      deliveryText: item.priceDisplayAllowed ? item.deliveryText : null,
      offerSummary: item.priceDisplayAllowed ? item.offerSummary : null,
    };
  });
}

function isDatabaseOffer(value: unknown): value is DatabaseOffer {
  if (!value || typeof value !== "object") {
    return false;
  }

  const offer = value as Partial<DatabaseOffer>;

  return (
    isStoreName(offer.store) &&
    typeof offer.affiliateQuery === "string" &&
    (offer.priceAmountInr === null || typeof offer.priceAmountInr === "number") &&
    typeof offer.priceDisplayAllowed === "boolean"
  );
}

function isStoreName(value: unknown): value is StoreName {
  return value === "amazon" || value === "flipkart" || value === "bookswagon";
}

function formatPriceLabel(amountInr: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amountInr);
}

