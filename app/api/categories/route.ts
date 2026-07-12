import { getCatalogCategories } from "@/lib/catalog";
import { getCatalogBooksFromSourceByCategory } from "@/lib/catalog-source";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category")?.trim();
  const categories = getCatalogCategories();

  if (category) {
    const matchedCategory = categories.find((item) => item.slug === category);

    if (!matchedCategory) {
      return Response.json({ message: "Unknown category." }, { status: 404 });
    }

    return Response.json({
      category: matchedCategory,
      books: await getCatalogBooksFromSourceByCategory(matchedCategory.slug),
    });
  }

  const categoriesWithCounts = await Promise.all(
    categories.map(async (item) => ({
      ...item,
      bookCount: (await getCatalogBooksFromSourceByCategory(item.slug)).length,
    }))
  );

  return Response.json({
    categories: categoriesWithCounts,
  });
}
