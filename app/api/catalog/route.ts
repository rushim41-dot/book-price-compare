import { getCatalogCollections, getFeaturedCatalogBooks } from "@/lib/catalog";
import { getTopSearchAnalytics } from "@/lib/search-analytics";

export const runtime = "nodejs";

export async function GET() {
  const topSearches = await getTopSearchAnalytics(6);

  return Response.json({
    books: getFeaturedCatalogBooks(12),
    topSearches,
    collections: getCatalogCollections().map((collection) => ({
      slug: collection.slug,
      label: collection.label,
      description: collection.description,
      books: collection.books,
    })),
  });
}
