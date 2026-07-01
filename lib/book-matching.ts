type MatchCandidate = {
  title: string;
  authors: string[];
  isbn13?: string | null;
  isbn10?: string | null;
  tags?: string[];
};

export type MatchConfidence =
  | "exact-isbn"
  | "exact-title-author"
  | "strong-title-author"
  | "related";

export type MatchScore = {
  score: number;
  confidence: MatchConfidence | null;
};

export function normalizeSearchText(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

export function tokenizeSearchText(value: string) {
  const normalized = normalizeSearchText(value);
  return normalized ? normalized.split(" ") : [];
}

export function normalizeIsbn(value: string | null | undefined) {
  return (value ?? "").replace(/[^0-9xX]/g, "").toUpperCase();
}

const TITLE_VARIANT_SUFFIX_PATTERN =
  /(?:^|[\s,:-])(vol(?:ume)?\.?\s*\d+|graphic novel|deluxe edition|special edition|collector'?s edition|anniversary edition|illustrated edition|hardcover|paperback|mass market paperback|audio(?:book)?|audio cd|boxed set|omnibus|large print)\b/i;

const NON_PRIMARY_BOOK_PATTERN =
  /\b(summary|workbook|journal|tracker|study guide|discussion(?:s)?|analysis|companion|review|notebook|planner)\b/i;

export function normalizeBookTitle(value: string) {
  let normalized = value
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .trim()
    .replace(/\s+/g, " ");

  normalized = stripTrailingVariantSegment(normalized, /\(([^)]*)\)$/);
  normalized = stripTrailingVariantSegment(normalized, /\[([^\]]*)\]$/);
  normalized = stripTrailingDelimiterSuffix(normalized, ":");
  normalized = stripTrailingDelimiterSuffix(normalized, ",");
  normalized = stripTrailingDelimiterSuffix(normalized, "-");

  return normalized.trim().replace(/\s+/g, " ");
}

export function hasTitleVariantMarker(value: string) {
  return TITLE_VARIANT_SUFFIX_PATTERN.test(value);
}

export function hasNonPrimaryBookMarker(value: string) {
  return NON_PRIMARY_BOOK_PATTERN.test(value);
}

export function scoreQueryAgainstBook(
  query: string,
  candidate: MatchCandidate
): MatchScore {
  const normalizedQuery = normalizeSearchText(query);
  if (!normalizedQuery) {
    return { score: 0, confidence: null };
  }

  const queryTokens = tokenizeSearchText(query);
  const title = normalizeSearchText(candidate.title);
  const canonicalQueryTitle = normalizeSearchText(normalizeBookTitle(query));
  const canonicalTitle = normalizeSearchText(normalizeBookTitle(candidate.title));
  const titleTokens = new Set(tokenizeSearchText(candidate.title));
  const authorTokens = new Set(tokenizeSearchText(candidate.authors.join(" ")));
  const tagTokens = new Set(tokenizeSearchText((candidate.tags ?? []).join(" ")));
  const queryIsbn = normalizeIsbn(query);

  const exactIsbn =
    Boolean(queryIsbn) &&
    queryIsbn.length >= 10 &&
    [normalizeIsbn(candidate.isbn13), normalizeIsbn(candidate.isbn10)].includes(queryIsbn);

  const exactTitle = normalizedQuery === title;
  const exactCanonicalTitle =
    Boolean(canonicalQueryTitle) && canonicalQueryTitle === canonicalTitle;
  const titleContains = title.includes(normalizedQuery) || normalizedQuery.includes(title);
  const canonicalTitleContains =
    canonicalTitle.includes(canonicalQueryTitle) || canonicalQueryTitle.includes(canonicalTitle);
  const queryLooksVariantSpecific = hasTitleVariantMarker(query);
  const candidateLooksVariantSpecific = hasTitleVariantMarker(candidate.title);
  const queryLooksNonPrimary = hasNonPrimaryBookMarker(query);
  const candidateLooksNonPrimary = hasNonPrimaryBookMarker(candidate.title);

  let matchedQueryTokens = 0;
  let authorMatches = 0;
  let tagMatches = 0;

  for (const token of queryTokens) {
    if (titleTokens.has(token) || authorTokens.has(token) || tagTokens.has(token)) {
      matchedQueryTokens += 1;
    }

    if (authorTokens.has(token)) {
      authorMatches += 1;
    }

    if (tagTokens.has(token)) {
      tagMatches += 1;
    }
  }

  const tokenOverlap = queryTokens.length > 0 ? matchedQueryTokens / queryTokens.length : 0;
  const authorOverlap = authorMatches > 0;
  const titleStartsWithQuery = title.startsWith(normalizedQuery);

  let score = 0;

  if (exactIsbn) {
    score += 200;
  }

  if (exactTitle) {
    score += 140;
  } else if (exactCanonicalTitle) {
    score += 110;
  } else if (titleContains) {
    score += 55;
  } else if (canonicalTitleContains) {
    score += 42;
  } else if (titleStartsWithQuery) {
    score += 40;
  }

  score += Math.round(tokenOverlap * 60);

  if (authorOverlap) {
    score += 20;
  }

  if (tagMatches > 0) {
    score += Math.min(tagMatches * 4, 12);
  }

  if (queryTokens.length === 1 && titleTokens.has(queryTokens[0])) {
    score += 8;
  }

  if (queryTokens.length >= 2 && matchedQueryTokens === queryTokens.length) {
    score += 15;
  }

  if (!queryLooksVariantSpecific && candidateLooksVariantSpecific) {
    score -= 28;
  }

  if (!queryLooksNonPrimary && candidateLooksNonPrimary) {
    score -= 85;
  }

  let confidence: MatchConfidence | null = null;

  if (exactIsbn) {
    confidence = "exact-isbn";
  } else if (exactTitle && (authorOverlap || candidate.authors.length === 0)) {
    confidence = "exact-title-author";
  } else if (
    exactCanonicalTitle &&
    !candidateLooksVariantSpecific &&
    (authorOverlap || candidate.authors.length === 0)
  ) {
    confidence = "strong-title-author";
  } else if (exactTitle) {
    confidence = "strong-title-author";
  } else if (
    queryTokens.length >= 2 &&
    tokenOverlap >= 0.8 &&
    (authorOverlap || titleContains) &&
    !candidateLooksNonPrimary
  ) {
    confidence = "strong-title-author";
  } else if (tokenOverlap >= 0.6 && titleContains && !candidateLooksNonPrimary) {
    confidence = "related";
  }

  return { score, confidence };
}

export function isTrustedBookMatch(confidence: MatchConfidence | null) {
  return (
    confidence === "exact-isbn" ||
    confidence === "exact-title-author" ||
    confidence === "strong-title-author"
  );
}

export function buildBookIdentityKey(candidate: MatchCandidate) {
  const isbn13 = normalizeIsbn(candidate.isbn13);
  if (isbn13) {
    return `isbn13:${isbn13}`;
  }

  const isbn10 = normalizeIsbn(candidate.isbn10);
  if (isbn10) {
    return `isbn10:${isbn10}`;
  }

  return `title:${normalizeSearchText(normalizeBookTitle(candidate.title))}|author:${normalizeSearchText(
    candidate.authors[0] ?? ""
  )}`;
}

function stripTrailingVariantSegment(value: string, pattern: RegExp) {
  const match = value.match(pattern);
  if (!match) {
    return value;
  }

  return TITLE_VARIANT_SUFFIX_PATTERN.test(match[1] ?? "")
    ? value.slice(0, match.index).trim()
    : value;
}

function stripTrailingDelimiterSuffix(value: string, delimiter: ":" | "," | "-") {
  const index = value.lastIndexOf(delimiter);
  if (index === -1) {
    return value;
  }

  const suffix = value.slice(index + 1).trim();
  if (!TITLE_VARIANT_SUFFIX_PATTERN.test(suffix)) {
    return value;
  }

  return value.slice(0, index).trim();
}
