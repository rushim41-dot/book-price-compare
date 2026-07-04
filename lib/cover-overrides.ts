type CoverOverride = {
  slug?: string;
  isbn13?: string;
  thumbnail: string;
  note: string;
};

const COVER_OVERRIDES: CoverOverride[] = [
  {
    slug: "subtle-art",
    isbn13: "9780062457714",
    thumbnail: "/covers/books/subtle-art",
    note: "Local Books2Buy display cover used because the OpenLibrary route depends on an unreliable Archive-backed redirect.",
  },
  {
    slug: "and-then-there-were-none",
    isbn13: "9780008123208",
    thumbnail: "/covers/books/and-then-there-were-none",
    note: "Local Books2Buy display cover used because the OpenLibrary route depends on an unreliable Archive-backed redirect.",
  },
  {
    slug: "none-of-this-is-true",
    isbn13: "9781804940204",
    thumbnail: "/covers/books/none-of-this-is-true",
    note: "Local Books2Buy display cover used because the OpenLibrary ISBN route returned no cover and the cover-id route is Archive-backed.",
  },
  {
    slug: "gone-girl",
    isbn13: "9780385347778",
    thumbnail: "/covers/books/gone-girl",
    note: "Local Books2Buy display cover used because the OpenLibrary route depends on an unreliable Archive-backed redirect.",
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
    thumbnail: "/covers/books/midnights-children",
    note: "Local Books2Buy display cover used because the OpenLibrary route timed out during visible-cover audit.",
  },
  {
    slug: "the-god-of-small-things",
    isbn13: "9780006550686",
    thumbnail: "/covers/books/the-god-of-small-things",
    note: "Local Books2Buy display cover used because the OpenLibrary route timed out during visible-cover audit.",
  },
  {
    slug: "the-white-tiger",
    isbn13: "9781416562603",
    thumbnail: "/covers/books/the-white-tiger",
    note: "Local Books2Buy display cover used because the OpenLibrary route timed out during visible-cover audit.",
  },
  {
    slug: "shame",
    isbn13: "9780099289524",
    thumbnail: "/covers/books/shame",
    note: "Local Books2Buy display cover used because the OpenLibrary route timed out during visible-cover audit.",
  },
  {
    slug: "pride-and-prejudice",
    isbn13: "9780141439518",
    thumbnail: "/covers/books/pride-and-prejudice",
    note: "Local Books2Buy display cover used because the OpenLibrary route depends on an unreliable Archive-backed redirect.",
  },
  {
    slug: "jane-eyre",
    isbn13: "9780141441146",
    thumbnail: "/covers/books/jane-eyre",
    note: "Local Books2Buy display cover used because the OpenLibrary route depends on an unreliable Archive-backed redirect.",
  },
  {
    slug: "wuthering-heights",
    isbn13: "9780141439556",
    thumbnail: "/covers/books/wuthering-heights",
    note: "Local Books2Buy display cover used because the OpenLibrary route depends on an unreliable Archive-backed redirect.",
  },
  {
    slug: "frankenstein",
    isbn13: "9780141439471",
    thumbnail: "/covers/books/frankenstein",
    note: "Local Books2Buy display cover used because the OpenLibrary route depends on an unreliable Archive-backed redirect.",
  },
  {
    slug: "dracula",
    isbn13: "9780141439846",
    thumbnail: "/covers/books/dracula",
    note: "Local Books2Buy display cover used because the OpenLibrary route depends on an unreliable Archive-backed redirect.",
  },
  {
    slug: "the-picture-of-dorian-gray",
    isbn13: "9780141439570",
    thumbnail: "/covers/books/the-picture-of-dorian-gray",
    note: "Local Books2Buy display cover used because the OpenLibrary route depends on an unreliable Archive-backed redirect.",
  },
  {
    slug: "gitanjali",
    isbn13: "9788171676118",
    thumbnail: "/covers/books/gitanjali",
    note: "Local Books2Buy display cover used because the ISBN route resolves to unrelated OpenLibrary metadata and the correct cover-id route timed out during audit.",
  },
  {
    slug: "the-ministry-of-utmost-happiness",
    isbn13: "9780241980767",
    thumbnail: "/covers/books/the-ministry-of-utmost-happiness",
    note: "Local Books2Buy display cover used because the OpenLibrary route timed out during visible-cover audit.",
  },
  {
    slug: "the-satanic-verses",
    isbn13: "9780099578611",
    thumbnail: "/covers/books/the-satanic-verses",
    note: "Local Books2Buy display cover used because the OpenLibrary route timed out during visible-cover audit.",
  },
  {
    slug: "the-moor-s-last-sigh",
    isbn13: "9780099592419",
    thumbnail: "/covers/books/the-moor-s-last-sigh",
    note: "Local Books2Buy display cover used because the OpenLibrary route timed out during visible-cover audit.",
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
