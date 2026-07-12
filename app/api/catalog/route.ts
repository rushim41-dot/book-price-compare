import {
  getCatalogCollectionsFromSource,
  getFeaturedCatalogBooksFromSource,
} from "@/lib/catalog-source";
import { getTopSearchAnalytics } from "@/lib/search-analytics";

export const runtime = "nodejs";

export async function GET() {
  const [topSearches, books, collections] = await Promise.all([
    getTopSearchAnalytics(6),
    getFeaturedCatalogBooksFromSource(12),
    getCatalogCollectionsFromSource(),
  ]);

  return Response.json({
    books,
    topSearches,
    collections: collections.map((collection) => ({
      slug: collection.slug,
      label: collection.label,
      description: collection.description,
      books: collection.books,
    })),
  });
}
