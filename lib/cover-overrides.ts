type CoverOverride = {
  slug?: string;
  isbn13?: string;
  thumbnail: string;
  note: string;
};

const COVER_OVERRIDES: CoverOverride[] = [
  {
    slug: "none-of-this-is-true",
    isbn13: "9781804940204",
    thumbnail: "https://covers.openlibrary.org/b/id/14424771-L.jpg",
    note: "Exact OpenLibrary work cover for the curated UK paperback ISBN, replacing the no-cover ISBN response.",
  },
  {
    slug: "life-of-pi",
    isbn13: "9781786891686",
    thumbnail: "https://covers.openlibrary.org/b/id/7537383-L.jpg",
    note: "Curated display cover from an English OpenLibrary edition of the same base work.",
  },
  {
    slug: "gitanjali",
    isbn13: "9788171676118",
    thumbnail: "https://covers.openlibrary.org/b/id/8246100-L.jpg",
    note: "Correct Rabindranath Tagore Gitanjali work cover; the ISBN route resolves to unrelated OpenLibrary metadata.",
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
