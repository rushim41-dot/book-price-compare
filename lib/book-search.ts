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

const REQUEST_HEADERS = {
  "accept-language": "en-IN,en;q=0.9",
  "user-agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36",
};

export async function searchBooks(query: string): Promise<SearchResponse> {
  const trimmedQuery = query.trim();

  const [googleBooksResult, amazonResult, flipkartResult] = await Promise.allSettled([
    searchGoogleBooks(trimmedQuery),
    searchAmazon(trimmedQuery),
    searchFlipkart(trimmedQuery),
  ]);

  const notes: string[] = [];
  const googleBook =
    googleBooksResult.status === "fulfilled" ? googleBooksResult.value : null;

  const amazon =
    amazonResult.status === "fulfilled"
      ? amazonResult.value
      : buildFallbackResults(trimmedQuery, "amazon");
  const flipkart =
    flipkartResult.status === "fulfilled"
      ? flipkartResult.value
      : buildFallbackResults(trimmedQuery, "flipkart");

  if (amazonResult.status === "rejected") {
    notes.push(
      "Amazon blocked the live scrape, so the app is showing search redirect links instead."
    );
  }

  if (flipkartResult.status === "rejected") {
    notes.push(
      "Flipkart blocked the live scrape, so the app is showing search redirect links instead."
    );
  }

  if (googleBooksResult.status === "rejected") {
    notes.push(
      "Google Books data could not be loaded for this search, so only store results are shown."
    );
  }

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

async function searchAmazon(query: string): Promise<BookResult[]> {
  const url = `${AMAZON_BASE_URL}/s?k=${encodeURIComponent(query)}&i=stripbooks`;
  const html = await fetchHtml(url);

  const blocks = Array.from(
    html.matchAll(/<div[^>]+data-component-type="s-search-result"[\s\S]*?<\/div>\s*<\/div>/g)
  );

  const results = blocks
    .map((match, index) => parseAmazonBlock(match[0], index))
    .filter((item): item is BookResult => item !== null)
    .slice(0, 3);

  if (results.length === 0) {
    throw new Error("No Amazon results parsed");
  }

  return results;
}

async function searchFlipkart(query: string): Promise<BookResult[]> {
  const url = `${FLIPKART_BASE_URL}/search?q=${encodeURIComponent(query)}`;
  const html = await fetchHtml(url);

  const blocks = Array.from(
    html.matchAll(/<a[^>]+href="\/[^"]*pid=[^"]+"[\s\S]*?<\/a>/g)
  );

  const results = blocks
    .map((match, index) => parseFlipkartBlock(match[0], index))
    .filter((item): item is BookResult => item !== null)
    .slice(0, 3);

  if (results.length === 0) {
    throw new Error("No Flipkart results parsed");
  }

  return results;
}

async function fetchHtml(url: string) {
  const response = await fetch(url, {
    headers: REQUEST_HEADERS,
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.text();
}

function parseAmazonBlock(block: string, index: number): BookResult | null {
  const title =
    capture(block, /<h2[\s\S]*?<span[^>]*>(.*?)<\/span>/) ??
    capture(block, /aria-label="([^"]+)"/);
  const href = capture(block, /href="(\/[^"]+)"/);
  const whole = capture(block, /a-price-whole">([^<]+)/);
  const fraction = capture(block, /a-price-fraction">([^<]+)/) ?? "00";

  if (!title || !href) {
    return null;
  }

  const priceText = whole
    ? `Rs. ${whole}${fraction ? `.${fraction}` : ""}`
    : "Price unavailable";

  return {
    id: `amazon-${index}`,
    title: decodeText(title),
    price: whole ? parseIndianPrice(`${whole}.${fraction}`) : null,
    priceText,
    link: `${AMAZON_BASE_URL}${decodeUrl(href)}`,
    store: "amazon",
    isFallback: false,
  };
}

function parseFlipkartBlock(block: string, index: number): BookResult | null {
  const href = capture(block, /href="([^"]+)"/);
  const title =
    capture(block, /title="([^"]+)"/) ??
    capture(block, /class="[^"]*wjcEIp[^"]*"[^>]*>(.*?)</) ??
    capture(block, /class="[^"]*KzDlHZ[^"]*"[^>]*>(.*?)</);
  const priceMatch = capture(block, /(?:₹|Rs\.?)\s?([\d,]+)/);

  if (!title || !href) {
    return null;
  }

  return {
    id: `flipkart-${index}`,
    title: decodeText(title),
    price: priceMatch ? parseIndianPrice(priceMatch) : null,
    priceText: priceMatch ? `Rs. ${priceMatch}` : "Price unavailable",
    link: `${FLIPKART_BASE_URL}${decodeUrl(href)}`,
    store: "flipkart",
    isFallback: false,
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
      priceText: "Open store to view price",
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

function parseIndianPrice(value: string) {
  const normalized = value.replace(/,/g, "").trim();
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

function capture(text: string, pattern: RegExp) {
  const match = text.match(pattern);
  return match?.[1] ?? null;
}

function decodeUrl(value: string) {
  return value.replace(/&amp;/g, "&");
}

function decodeText(value: string) {
  return value
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
