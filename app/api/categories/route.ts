import { getCatalogBooksByCategory, getCatalogCategories } from "@/lib/catalog";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category")?.trim();

  if (category) {
    const matchedCategory = getCatalogCategories().find((item) => item.slug === category);

    if (!matchedCategory) {
      return Response.json({ message: "Unknown category." }, { status: 404 });
    }

    return Response.json({
      category: matchedCategory,
      books: getCatalogBooksByCategory(matchedCategory.slug),
    });
  }

  return Response.json({
    categories: getCatalogCategories().map((item) => ({
      ...item,
      bookCount: getCatalogBooksByCategory(item.slug).length,
    })),
  });
}
