type StoreName = "amazon" | "flipkart";

export type BookResult = {
  id: string;
  title: string;
  price: number | null;
  priceText: string;
  link: string;
  store: StoreName;
  isFallback: boolean;
};

export type GoogleBook = {
  id: string;
  title: string;
  authors: string[];
  thumbnail: string | null;
  infoLink: string;
  publishedDate: string | null;
  publisher: string | null;
};

export type SearchResponse = {
  query: string;
  googleBook: GoogleBook | null;
  amazon: BookResult[];
  flipkart: BookResult[];
  cheapestId: string | null;
  notes: string[];
};

const AMAZON_BASE_URL = "https://www.amazon.in";
const FLIPKART_BASE_URL = "https://www.flipkart.com";

export async function searchBooks(query: string): Promise<SearchResponse> {
  const trimmedQuery = query.trim();

  const googleBooksResult = await Promise.allSettled([
    searchGoogleBooks(trimmedQuery),
  ]);

  const googleBook =
    googleBooksResult[0].status === "fulfilled" ? googleBooksResult[0].value : null;
  const notes: string[] = [
    "Fast MVP mode: prices open on Amazon and Flipkart. Live price scraping is switched off because it is slow and often blocked.",
  ];

  if (googleBooksResult[0].status === "rejected") {
    notes.push(
      "Google Books data could not be loaded for this search, so only store search links are shown."
    );
  }

  const amazon = buildFallbackResults(trimmedQuery, "amazon");
  const flipkart = buildFallbackResults(trimmedQuery, "flipkart");

  return {
    query: trimmedQuery,
    googleBook,
    amazon,
    flipkart,
    cheapestId: findCheapestId([...amazon, ...flipkart]),
    notes,
  };
}

async function searchGoogleBooks(query: string): Promise<GoogleBook | null> {
  const apiKey = process.env.GOOGLE_BOOKS_API_KEY?.trim();
  const params = new URLSearchParams({
    q: query,
    maxResults: "1",
    country: "IN",
    printType: "books",
    orderBy: "relevance",
  });

  if (apiKey) {
    params.set("key", apiKey);
  }

  const response = await fetch(
    `https://www.googleapis.com/books/v1/volumes?${params.toString()}`,
    { cache: "no-store" }
  );

  if (!response.ok) {
    throw new Error(`Google Books failed: ${response.status}`);
  }

  const data = (await response.json()) as {
    items?: Array<{
      id: string;
      volumeInfo?: {
        title?: string;
        authors?: string[];
        infoLink?: string;
        publishedDate?: string;
        publisher?: string;
        imageLinks?: {
          thumbnail?: string;
          smallThumbnail?: string;
        };
      };
    }>;
  };

  const firstBook = data.items?.[0];

  if (!firstBook?.volumeInfo?.title) {
    return null;
  }

  return {
    id: firstBook.id,
    title: firstBook.volumeInfo.title,
    authors: firstBook.volumeInfo.authors ?? [],
    thumbnail:
      firstBook.volumeInfo.imageLinks?.thumbnail?.replace("http://", "https://") ??
      firstBook.volumeInfo.imageLinks?.smallThumbnail?.replace("http://", "https://") ??
      null,
    infoLink: firstBook.volumeInfo.infoLink ?? "https://books.google.com/",
    publishedDate: firstBook.volumeInfo.publishedDate ?? null,
    publisher: firstBook.volumeInfo.publisher ?? null,
  };
}

function buildFallbackResults(query: string, store: StoreName): BookResult[] {
  return Array.from({ length: 3 }, (_, index) => {
    const suffix = index === 0 ? query : `${query} book ${index + 1}`;
    const link =
      store === "amazon"
        ? `${AMAZON_BASE_URL}/s?k=${encodeURIComponent(suffix)}&i=stripbooks${buildAmazonAffiliateTag()}`
        : `${FLIPKART_BASE_URL}/search?q=${encodeURIComponent(suffix)}`;

    return {
      id: `${store}-fallback-${index}`,
      title: `Search ${store === "amazon" ? "Amazon" : "Flipkart"} for "${suffix}"`,
      price: null,
      priceText: "View current price on store",
      link,
      store,
      isFallback: true,
    };
  });
}

function buildAmazonAffiliateTag() {
  const tag = process.env.AMAZON_AFFILIATE_TAG?.trim();
  return tag ? `&tag=${encodeURIComponent(tag)}` : "";
}

function findCheapestId(results: BookResult[]) {
  const pricedResults = results.filter((item) => item.price !== null);

  if (pricedResults.length === 0) {
    return null;
  }

  let cheapest = pricedResults[0];

  for (const item of pricedResults) {
    if ((item.price ?? Number.POSITIVE_INFINITY) < (cheapest.price ?? Number.POSITIVE_INFINITY)) {
      cheapest = item;
    }
  }

  return cheapest.id;
}
