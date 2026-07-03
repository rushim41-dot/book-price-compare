type CoverOverride = {
  slug?: string;
  isbn13?: string;
  thumbnail: string;
  note: string;
};

const COVER_OVERRIDES: CoverOverride[] = [
  {
    slug: "life-of-pi",
    isbn13: "9781786891686",
    thumbnail: "https://covers.openlibrary.org/b/id/7537383-L.jpg",
    note: "Curated display cover from an English OpenLibrary edition of the same base work.",
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
