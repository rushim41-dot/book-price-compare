import { searchBooks } from "@/lib/book-search";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim() ?? "";

  if (!query) {
    return Response.json(
      { message: "Please provide a book name in the q parameter." },
      { status: 400 }
    );
  }

  const data = await searchBooks(query);
  return Response.json(data);
}
