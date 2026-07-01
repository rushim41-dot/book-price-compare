import { normalizeIncomingQuery, searchBooks } from "@/lib/book-search";
import { recordSearchAnalytics } from "@/lib/search-analytics";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rawQuery = searchParams.get("q")?.trim() ?? "";
  const query = normalizeIncomingQuery(rawQuery);

  if (!query) {
    return Response.json(
      { message: "Please provide a book name in the q parameter." },
      { status: 400 }
    );
  }

  if (query.length < 2) {
    return Response.json(
      { message: "Please enter at least 2 characters to search." },
      { status: 400 }
    );
  }

  const data = await searchBooks(query);
  await recordSearchAnalytics(query, data.books[0] ?? null);
  return Response.json(data);
}
