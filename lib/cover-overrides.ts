type CoverOverride = {
  slug?: string;
  isbn13?: string;
  thumbnail?: string;
  fallbackThumbnail?: string;
  note: string;
};

const COVER_OVERRIDES: CoverOverride[] = [
  {
    slug: "subtle-art",
    isbn13: "9780062457714",
    thumbnail: "https://covers.openlibrary.org/b/isbn/9780062457714-L.jpg",
    fallbackThumbnail: "/covers/books/subtle-art",
    note: "Use the real OpenLibrary cover first; fall back to a local Books2Buy display cover if the Archive-backed route fails.",
  },
  {
    slug: "and-then-there-were-none",
    isbn13: "9780008123208",
    thumbnail: "https://covers.openlibrary.org/b/isbn/9780008123208-L.jpg",
    fallbackThumbnail: "/covers/books/and-then-there-were-none",
    note: "Use the real OpenLibrary cover first; fall back to a local Books2Buy display cover if the Archive-backed route fails.",
  },
  {
    slug: "none-of-this-is-true",
    isbn13: "9781804940204",
    thumbnail: "https://covers.openlibrary.org/b/id/14424771-L.jpg",
    fallbackThumbnail: "/covers/books/none-of-this-is-true",
    note: "Use the real OpenLibrary work cover first; fall back to a local Books2Buy display cover if the Archive-backed route fails.",
  },
  {
    slug: "gone-girl",
    isbn13: "9780385347778",
    thumbnail: "https://covers.openlibrary.org/b/isbn/9780385347778-L.jpg",
    fallbackThumbnail: "/covers/books/gone-girl",
    note: "Use the real OpenLibrary cover first; fall back to a local Books2Buy display cover if the Archive-backed route fails.",
  },
  {
    slug: "life-of-pi",
    isbn13: "9781786891686",
    thumbnail: "https://covers.openlibrary.org/b/id/7537383-L.jpg",
    note: "Curated display cover from an English OpenLibrary edition of the same base work.",
  },
  {
    slug: "midnights-children",
    isbn13: "9780099578512",
    thumbnail: "https://covers.openlibrary.org/b/isbn/9780099578512-L.jpg",
    fallbackThumbnail: "/covers/books/midnights-children",
    note: "Use the real OpenLibrary cover first; fall back to a local Books2Buy display cover if the route fails.",
  },
  {
    slug: "the-god-of-small-things",
    isbn13: "9780006550686",
    thumbnail: "https://covers.openlibrary.org/b/isbn/9780006550686-L.jpg",
    fallbackThumbnail: "/covers/books/the-god-of-small-things",
    note: "Use the real OpenLibrary cover first; fall back to a local Books2Buy display cover if the route fails.",
  },
  {
    slug: "the-white-tiger",
    isbn13: "9781416562603",
    thumbnail: "https://covers.openlibrary.org/b/isbn/9781416562603-L.jpg",
    fallbackThumbnail: "/covers/books/the-white-tiger",
    note: "Use the real OpenLibrary cover first; fall back to a local Books2Buy display cover if the route fails.",
  },
  {
    slug: "shame",
    isbn13: "9780099289524",
    thumbnail: "https://covers.openlibrary.org/b/isbn/9780099289524-L.jpg",
    fallbackThumbnail: "/covers/books/shame",
    note: "Use the real OpenLibrary cover first; fall back to a local Books2Buy display cover if the route fails.",
  },
  {
    slug: "pride-and-prejudice",
    isbn13: "9780141439518",
    thumbnail: "https://covers.openlibrary.org/b/isbn/9780141439518-L.jpg",
    fallbackThumbnail: "/covers/books/pride-and-prejudice",
    note: "Use the real OpenLibrary cover first; fall back to a local Books2Buy display cover if the Archive-backed route fails.",
  },
  {
    slug: "jane-eyre",
    isbn13: "9780141441146",
    thumbnail: "https://covers.openlibrary.org/b/isbn/9780141441146-L.jpg",
    fallbackThumbnail: "/covers/books/jane-eyre",
    note: "Use the real OpenLibrary cover first; fall back to a local Books2Buy display cover if the Archive-backed route fails.",
  },
  {
    slug: "wuthering-heights",
    isbn13: "9780141439556",
    thumbnail: "https://covers.openlibrary.org/b/isbn/9780141439556-L.jpg",
    fallbackThumbnail: "/covers/books/wuthering-heights",
    note: "Use the real OpenLibrary cover first; fall back to a local Books2Buy display cover if the Archive-backed route fails.",
  },
  {
    slug: "frankenstein",
    isbn13: "9780141439471",
    thumbnail: "https://covers.openlibrary.org/b/isbn/9780141439471-L.jpg",
    fallbackThumbnail: "/covers/books/frankenstein",
    note: "Use the real OpenLibrary cover first; fall back to a local Books2Buy display cover if the Archive-backed route fails.",
  },
  {
    slug: "dracula",
    isbn13: "9780141439846",
    thumbnail: "https://covers.openlibrary.org/b/isbn/9780141439846-L.jpg",
    fallbackThumbnail: "/covers/books/dracula",
    note: "Use the real OpenLibrary cover first; fall back to a local Books2Buy display cover if the Archive-backed route fails.",
  },
  {
    slug: "the-picture-of-dorian-gray",
    isbn13: "9780141439570",
    thumbnail: "https://covers.openlibrary.org/b/isbn/9780141439570-L.jpg",
    fallbackThumbnail: "/covers/books/the-picture-of-dorian-gray",
    note: "Use the real OpenLibrary cover first; fall back to a local Books2Buy display cover if the Archive-backed route fails.",
  },
  {
    slug: "gitanjali",
    isbn13: "9788171676118",
    thumbnail: "https://covers.openlibrary.org/b/id/8246100-L.jpg",
    fallbackThumbnail: "/covers/books/gitanjali",
    note: "Use the correct Rabindranath Tagore OpenLibrary work cover first; fall back locally if the route fails.",
  },
  {
    slug: "the-ministry-of-utmost-happiness",
    isbn13: "9780241980767",
    thumbnail: "https://covers.openlibrary.org/b/isbn/9780241980767-L.jpg",
    fallbackThumbnail: "/covers/books/the-ministry-of-utmost-happiness",
    note: "Use the real OpenLibrary cover first; fall back to a local Books2Buy display cover if the route fails.",
  },
  {
    slug: "the-satanic-verses",
    isbn13: "9780099578611",
    thumbnail: "https://covers.openlibrary.org/b/isbn/9780099578611-L.jpg",
    fallbackThumbnail: "/covers/books/the-satanic-verses",
    note: "Use the real OpenLibrary cover first; fall back to a local Books2Buy display cover if the route fails.",
  },
  {
    slug: "the-moor-s-last-sigh",
    isbn13: "9780099592419",
    thumbnail: "https://covers.openlibrary.org/b/isbn/9780099592419-L.jpg",
    fallbackThumbnail: "/covers/books/the-moor-s-last-sigh",
    note: "Use the real OpenLibrary cover first; fall back to a local Books2Buy display cover if the route fails.",
  },
];

const COVER_OVERRIDES_BY_SLUG = new Map(
  COVER_OVERRIDES.flatMap((override) =>
    override.slug ? [[override.slug, override]] : []
  )
);

const COVER_OVERRIDES_BY_ISBN13 = new Map(
  COVER_OVERRIDES.flatMap((override) =>
    override.isbn13 ? [[override.isbn13, override]] : []
  )
);

export function resolveVerifiedCover({
  slug,
  isbn13,
  thumbnail,
}: {
  slug?: string | null;
  isbn13?: string | null;
  thumbnail: string | null;
}) {
  return (
    (slug ? COVER_OVERRIDES_BY_SLUG.get(slug)?.thumbnail : null) ??
    (isbn13 ? COVER_OVERRIDES_BY_ISBN13.get(isbn13)?.thumbnail : null) ??
    thumbnail
  );
}

export function resolveCoverFallback({
  slug,
  isbn13,
}: {
  slug?: string | null;
  isbn13?: string | null;
}) {
  return (
    (slug ? COVER_OVERRIDES_BY_SLUG.get(slug)?.fallbackThumbnail : null) ??
    (isbn13 ? COVER_OVERRIDES_BY_ISBN13.get(isbn13)?.fallbackThumbnail : null) ??
    null
  );
}
