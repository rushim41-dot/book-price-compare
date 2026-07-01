import type { StoreName } from "@/lib/catalog";

const STORE_CONFIG: Record<
  StoreName,
  {
    baseUrl: string;
    allowedHosts: string[];
  }
> = {
  amazon: {
    baseUrl: "https://www.amazon.in",
    allowedHosts: ["www.amazon.in", "amazon.in"],
  },
  flipkart: {
    baseUrl: "https://www.flipkart.com",
    allowedHosts: ["www.flipkart.com", "flipkart.com"],
  },
  bookswagon: {
    baseUrl: "https://www.bookswagon.com",
    allowedHosts: ["www.bookswagon.com", "bookswagon.com"],
  },
};

export function buildApprovedStoreLink(store: StoreName, query: string) {
  const normalizedQuery = normalizeAffiliateQuery(query);

  if (store === "amazon") {
    const url = new URL("/s", STORE_CONFIG.amazon.baseUrl);
    url.searchParams.set("k", normalizedQuery);
    url.searchParams.set("i", "stripbooks");
    addOptionalParam(url, "tag", process.env.AMAZON_AFFILIATE_TAG);
    return validateApprovedStoreUrl("amazon", url.toString());
  }

  if (store === "flipkart") {
    const url = new URL("/search", STORE_CONFIG.flipkart.baseUrl);
    url.searchParams.set("q", normalizedQuery);
    return applyAffiliateTemplate(
      "flipkart",
      url.toString(),
      process.env.FLIPKART_AFFILIATE_URL_TEMPLATE,
      normalizedQuery
    );
  }

  const url = new URL(`/search-books/${encodeURIComponent(normalizedQuery)}`, STORE_CONFIG.bookswagon.baseUrl);
  return applyAffiliateTemplate(
    "bookswagon",
    url.toString(),
    process.env.BOOKSWAGON_AFFILIATE_URL_TEMPLATE,
    normalizedQuery
  );
}

export function normalizeAffiliateQuery(query: string) {
  return query.trim().replace(/\s+/g, " ").slice(0, 180);
}

function addOptionalParam(url: URL, key: string, value: string | undefined) {
  const trimmedValue = value?.trim();
  if (trimmedValue) {
    url.searchParams.set(key, trimmedValue);
  }
}

function applyAffiliateTemplate(
  store: StoreName,
  storeUrl: string,
  template: string | undefined,
  query: string
) {
  const trimmedTemplate = template?.trim();

  if (!trimmedTemplate) {
    return validateApprovedStoreUrl(store, storeUrl);
  }

  const rendered = trimmedTemplate
    .replaceAll("{url}", encodeURIComponent(storeUrl))
    .replaceAll("{query}", encodeURIComponent(query));

  return validateApprovedStoreUrl(store, rendered, storeUrl);
}

function validateApprovedStoreUrl(
  store: StoreName,
  outboundUrl: string,
  fallbackUrl?: string
) {
  try {
    const parsed = new URL(outboundUrl);
    const allowedHosts = new Set([
      ...STORE_CONFIG[store].allowedHosts,
      ...readAffiliateRedirectHosts(store),
    ]);

    if (allowedHosts.has(parsed.hostname.toLowerCase())) {
      return parsed.toString();
    }
  } catch {
    return fallbackUrl ?? STORE_CONFIG[store].baseUrl;
  }

  return fallbackUrl ?? STORE_CONFIG[store].baseUrl;
}

function readAffiliateRedirectHosts(store: StoreName) {
  const envValue =
    store === "flipkart"
      ? process.env.FLIPKART_AFFILIATE_ALLOWED_HOSTS
      : process.env.BOOKSWAGON_AFFILIATE_ALLOWED_HOSTS;

  return (envValue ?? "")
    .split(",")
    .map((host) => host.trim().toLowerCase())
    .filter(Boolean);
}
