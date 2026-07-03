"use client";

import {
  getCatalogCollections,
  getFeaturedCatalogBooks,
} from "@/lib/catalog";
import { BookCoverImage } from "@/app/components/BookCoverImage";
import { StorefrontHeader } from "@/app/components/StorefrontHeader";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

const homepageCollections = getCatalogCollections();
const homepageFeaturedBooks = getFeaturedCatalogBooks(12);

const shelfSlugs = [
  "world-classics",
  "prize-winners",
  "indian-authors",
];

const homepageShelves = shelfSlugs
  .map((slug) => homepageCollections.find((collection) => collection.slug === slug))
  .filter((collection): collection is NonNullable<(typeof homepageCollections)[number]> => Boolean(collection));

type TopSearchEntry = {
  normalizedQuery: string;
  query: string;
  count: number;
  lastSearchedAt: string;
  book: {
    id: string;
    title: string;
    authors: string[];
    thumbnail: string | null;
    publishedDate: string | null;
    publisher: string | null;
  } | null;
};

function formatAuthors(authors: string[]) {
  return authors.length > 0 ? authors.join(", ") : "Unknown author";
}

function HeartIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="inline-icon">
      <path
        d="M12 20.25 4.9 13.3a4.61 4.61 0 0 1 6.52-6.52L12 7.36l.58-.58A4.61 4.61 0 0 1 19.1 13.3L12 20.25Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="inline-icon small">
      <path d="M6 12h12M13 7l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="feature-icon">
      <path
        d="M12 3.5 5.5 6v5.55c0 4.1 2.8 7.88 6.5 8.95 3.7-1.07 6.5-4.85 6.5-8.95V6L12 3.5Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path d="m9.5 11.8 1.7 1.7 3.3-3.7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function TagIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="feature-icon">
      <path
        d="M20 10.2 12.2 18a2.1 2.1 0 0 1-3 0l-5.2-5.2a2.1 2.1 0 0 1 0-3L11.8 2H18a2 2 0 0 1 2 2v6.2Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <circle cx="15.5" cy="6.5" r="1.2" fill="currentColor" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="feature-icon">
      <path
        d="M7 10a5 5 0 0 1 10 0v4l1.5 2H5.5L7 14v-4Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path d="M10 18a2 2 0 0 0 4 0" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export default function Home() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [topSearches, setTopSearches] = useState<TopSearchEntry[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadCatalogInsights() {
      try {
        const response = await fetch("/api/catalog", { cache: "no-store" });
        if (!response.ok) {
          return;
        }

        const payload = (await response.json()) as { topSearches?: TopSearchEntry[] };
        setTopSearches(payload.topSearches ?? []);
      } catch {
        // Keep homepage browse mode available if analytics fail.
      }
    }

    void loadCatalogInsights();
  }, []);

  function submitSearch(nextQuery: string) {
    setError("");
    router.push(`/search?q=${encodeURIComponent(nextQuery)}`);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedQuery = query.trim();
    if (!trimmedQuery) {
      setError("Please enter a book name, author, or ISBN.");
      return;
    }

    submitSearch(trimmedQuery);
  }

  const mostSearchedBooks = topSearches.length
    ? topSearches
        .filter((entry) => entry.book)
        .slice(0, 6)
        .map((entry) => ({
          id: entry.normalizedQuery,
          title: entry.book?.title ?? entry.query,
          author: formatAuthors(entry.book?.authors ?? []),
          cover: entry.book?.thumbnail ?? null,
          count: entry.count,
          query: entry.query,
        }))
    : homepageFeaturedBooks.slice(0, 6).map((book) => ({
        id: book.id,
        title: book.title,
        author: formatAuthors(book.authors),
        cover: book.thumbnail,
        count: 0,
        query: book.title,
      }));
  const shelfPairs = [
    {
      left: homepageShelves[0] ?? null,
      right: homepageShelves[1] ?? null,
    },
    {
      left: homepageShelves[2] ?? null,
      right: null,
    },
  ];
  const promoBestsellers =
    homepageCollections.find((collection) => collection.slug === "bestsellers")?.books.slice(0, 4) ??
    homepageFeaturedBooks.slice(0, 4);
  const promoStarterCollection = homepageCollections.find(
    (collection) => collection.slug === "first-book-start-here"
  );
  const promoStarterBooks =
    promoStarterCollection?.books.slice(0, 4) ?? homepageFeaturedBooks.slice(6, 10);
  const heroDiscoveryBooks =
    homepageCollections
      .find((collection) => collection.slug === "prize-winners")
      ?.books.filter((book) => book.thumbnail)
      .slice(0, 5) ??
    homepageShelves[1]?.books.filter((book) => book.thumbnail).slice(0, 5) ??
    homepageFeaturedBooks.filter((book) => book.thumbnail).slice(0, 5);

  return (
    <main className="landing-shell bookstore-home">
      <StorefrontHeader
        query={query}
        onQueryChange={setQuery}
        onSubmit={handleSubmit}
      />

      <section className="home-hero-grid">
        <article className="hero-panel hero-panel-main">
          <div className="hero-side-books hero-side-books-left" aria-hidden="true">
            {homepageShelves[0]?.books.slice(0, 4).map((book) => (
              <div key={book.id} className="hero-lean-book">
                <BookCoverImage
                  src={book.thumbnail}
                  alt=""
                  width={64}
                  height={128}
                  className="hero-lean-book-cover"
                  fallbackClassName="hero-lean-book-cover"
                />
              </div>
            ))}
          </div>
          <div className="hero-panel-copy">
            <h1>
              <span>Find the right book.</span>
              <span>At the best price.</span>
            </h1>
            <p>
              Compare prices across trusted stores and save on every book you love.
            </p>
          </div>
          <div className="hero-book-stack hero-book-stack-right hero-book-stack-discovery" aria-hidden="true">
            {heroDiscoveryBooks.map((book) => (
              <div key={book.id} className="hero-book-card">
                <BookCoverImage
                  src={book.thumbnail}
                  alt=""
                  width={86}
                  height={126}
                  className="hero-book-cover"
                  fallbackClassName="hero-book-fallback"
                  fallbackText={book.title}
                />
              </div>
            ))}
          </div>
          <div className="hero-cup" aria-hidden="true" />
        </article>

        <div className="hero-side-column">
        <Link
          href="/collections/bestsellers"
          className="hero-panel hero-panel-side hero-panel-track promo-card-link"
        >
          <div className="promo-card-copy promo-card-copy-narrow">
            <h2>Bestsellers This Week</h2>
            <p>Reader favorites, habit books, money picks, and more.</p>
          </div>
          <div className="promo-mini-books promo-bestseller-books" aria-hidden="true">
            {promoBestsellers.map((book) => (
              <div key={book.id} className="promo-mini-book">
                <BookCoverImage
                  src={book.thumbnail}
                  alt=""
                  width={52}
                  height={90}
                  className="promo-mini-book-cover"
                  fallbackClassName="promo-mini-book-cover promo-mini-book-fallback"
                  fallbackText={book.title}
                />
              </div>
            ))}
          </div>
        </Link>

        <Link
          href="/collections/first-book-start-here"
          className="hero-panel hero-panel-side hero-panel-arrivals promo-card-link"
        >
          <div className="promo-card-copy">
            <h2>First Book? Start Here</h2>
            <p>Easy, loved reads to begin your reading habit with confidence.</p>
          </div>
          <div className="promo-mini-books" aria-hidden="true">
            {promoStarterBooks.map((book) => (
              <div key={book.id} className="promo-mini-book">
                <BookCoverImage
                  src={book.thumbnail}
                  alt=""
                  width={52}
                  height={90}
                  className="promo-mini-book-cover"
                  fallbackClassName="promo-mini-book-cover promo-mini-book-fallback"
                  fallbackText={book.title}
                />
              </div>
            ))}
          </div>
        </Link>
        </div>
      </section>

      <section className="homepage-shelf-grid">
        {shelfPairs.map((pair, index) => (
          <div key={index} className="homepage-shelf-row">
            {pair.left ? (
              <section className="shelf-section shelf-card">
                <div className="shelf-head">
                  <div>
                    <h2>{pair.left.label}</h2>
                    <p>{pair.left.description}</p>
                  </div>
                  <Link href={`/collections/${pair.left.slug}`} className="view-more">
                    View all
                    <ArrowRightIcon />
                  </Link>
                </div>

                <div className="book-shelf-grid compact-shelf-grid">
                  {pair.left.books.slice(0, 6).map((book) => (
                    <article key={book.id} className="shelf-book-card compact-book-card">
                      <Link href={`/collections/${pair.left!.slug}`} className="shelf-book-cover-link">
                        <BookCoverImage
                          src={book.thumbnail}
                          alt={book.title}
                          width={104}
                          height={156}
                          className="shelf-book-cover compact-cover"
                          fallbackClassName="shelf-book-cover shelf-book-fallback compact-cover"
                          fallbackText={book.title}
                        />
                      </Link>
                      <div className="shelf-book-copy compact-book-copy">
                        <h3>{book.title}</h3>
                        <p>{formatAuthors(book.authors)}</p>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            ) : null}

            {pair.right ? (
              <section className="shelf-section shelf-card">
                <div className="shelf-head">
                  <div>
                    <h2>{pair.right.label}</h2>
                    <p>{pair.right.description}</p>
                  </div>
                  <Link href={`/collections/${pair.right.slug}`} className="view-more">
                    View all
                    <ArrowRightIcon />
                  </Link>
                </div>

                <div className="book-shelf-grid compact-shelf-grid">
                  {pair.right.books.slice(0, 6).map((book) => (
                    <article key={book.id} className="shelf-book-card compact-book-card">
                      <Link href={`/collections/${pair.right!.slug}`} className="shelf-book-cover-link">
                        <BookCoverImage
                          src={book.thumbnail}
                          alt={book.title}
                          width={104}
                          height={156}
                          className="shelf-book-cover compact-cover"
                          fallbackClassName="shelf-book-cover shelf-book-fallback compact-cover"
                          fallbackText={book.title}
                        />
                      </Link>
                      <div className="shelf-book-copy compact-book-copy">
                        <h3>{book.title}</h3>
                        <p>{formatAuthors(book.authors)}</p>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            ) : (
              <section className="shelf-section shelf-card">
                <div className="shelf-head">
                  <div>
                    <h2>Most Searched Books</h2>
                    <p>Saved from real reader intent so popular searches stay one click away.</p>
                  </div>
                  <span className="view-more">View all <ArrowRightIcon /></span>
                </div>

                <div className="book-shelf-grid compact-shelf-grid">
                  {mostSearchedBooks.slice(0, 6).map((book) => (
                    <article key={book.id} className="shelf-book-card compact-book-card">
                      <button
                        type="button"
                        className="searchable-shelf-card"
                        onClick={() => {
                          setQuery(book.query);
                          submitSearch(book.query);
                        }}
                      >
                        <BookCoverImage
                          src={book.cover}
                          alt={book.title}
                          width={104}
                          height={156}
                          className="shelf-book-cover compact-cover"
                          fallbackClassName="shelf-book-cover shelf-book-fallback compact-cover"
                          fallbackText={book.title}
                        />
                        <div className="shelf-book-copy compact-book-copy">
                          <h3>{book.title}</h3>
                          <p>{book.author}</p>
                        </div>
                      </button>
                    </article>
                  ))}
                </div>
              </section>
            )}
          </div>
        ))}
      </section>

      <section className="trust-band storefront-trust-band">
        <article className="trust-item">
          <ShieldIcon />
          <div>
            <h3>Safe Store Links</h3>
            <p>All outbound clicks go to approved stores only.</p>
          </div>
        </article>
        <article className="trust-item">
          <TagIcon />
          <div>
            <h3>No False Prices</h3>
            <p>We only show prices when a trusted catalog match exists.</p>
          </div>
        </article>
        <article className="trust-item">
          <BellIcon />
          <div>
            <h3>Saved Searches Stay</h3>
            <p>Most Searched Books continue to build from reader activity.</p>
          </div>
        </article>
        <article className="trust-item">
          <HeartIcon />
          <div>
            <h3>Discovery First</h3>
            <p>Browse shelves before searching individual titles.</p>
          </div>
        </article>
      </section>

      {error ? (
        <div className="error-box" role="alert">
          {error}
        </div>
      ) : null}
    </main>
  );
}
