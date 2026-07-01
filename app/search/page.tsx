/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { StorefrontHeader } from "@/app/components/StorefrontHeader";
import { normalizeIncomingQuery, searchBooks } from "@/lib/book-search";
import { recordSearchAnalytics } from "@/lib/search-analytics";
import type { CatalogBook } from "@/lib/book-types";

export const runtime = "nodejs";

export const metadata = {
  title: "Search Books | Books2Buy",
  description:
    "Search Books2Buy for safe outbound store links. Prices only appear when verified.",
};

export default async function SearchPage(props: PageProps<"/search">) {
  const searchParams = await props.searchParams;
  const rawQuery = Array.isArray(searchParams.q)
    ? searchParams.q[0] ?? ""
    : searchParams.q ?? "";
  const query = normalizeIncomingQuery(rawQuery);
  const hasValidQuery = query.length >= 2;
  const data = hasValidQuery ? await searchBooks(query) : null;

  if (data) {
    await recordSearchAnalytics(query, data.books[0] ?? null);
  }

  const activeBook = data?.books[0] ?? null;
  const relatedBooks = data?.books.slice(1, 6) ?? [];

  return (
    <main className="book-detail-shell">
      <StorefrontHeader defaultQuery={query} />

      {!query ? (
        <section className="search-empty-card">
          <h2>Start with a book title or author</h2>
          <p>
            Try searches like <strong>Atomic Habits</strong>,{" "}
            <strong>Dungeon Crawler Carl</strong>, or{" "}
            <strong>James Clear</strong>.
          </p>
        </section>
      ) : null}

      {query && !hasValidQuery ? (
        <section className="search-empty-card" role="alert">
          <h2>Enter at least 2 characters</h2>
          <p>Your search needs to be a little longer before we can find a book.</p>
        </section>
      ) : null}

      {activeBook ? (
        <>
          <section className="book-detail-hero">
            <div className="catalog-breadcrumbs">
              <Link href="/">Home</Link>
              <span>/</span>
              <span>Search</span>
              <span>/</span>
              <strong>{activeBook.title}</strong>
            </div>

            <div className="book-detail-grid">
              <aside className="book-cover-panel">
                <div className="book-detail-cover-frame">
                  {activeBook.thumbnail ? (
                    <img
                      src={activeBook.thumbnail}
                      alt={activeBook.title}
                      width={260}
                      height={390}
                      className="book-detail-cover"
                    />
                  ) : (
                    <div className="book-detail-cover book-detail-cover-fallback">
                      {activeBook.title}
                    </div>
                  )}
                </div>
                <button type="button" className="book-secondary-action">
                  Add to wishlist
                </button>
              </aside>

              <section className="book-main-panel">
                <p className="catalog-kicker">Book details</p>
                <h1>{activeBook.title}</h1>
                <p className="book-detail-author">by {formatAuthors(activeBook.authors)}</p>

                <div className="book-rating-row" aria-label="Search result metadata">
                  <span>Catalog preview</span>
                  <span>No user reviews yet</span>
                </div>

                <p className="book-detail-description">
                  {activeBook.description ??
                    "Metadata is still improving for this title, but this is the strongest current match for your search."}
                </p>

                <dl className="book-detail-specs">
                  <div>
                    <dt>Publisher</dt>
                    <dd>{activeBook.publisher ?? "Coming soon"}</dd>
                  </div>
                  <div>
                    <dt>Published</dt>
                    <dd>{activeBook.publishedDate ?? "Coming soon"}</dd>
                  </div>
                  <div>
                    <dt>Format</dt>
                    <dd>{activeBook.format ?? "Coming soon"}</dd>
                  </div>
                  <div>
                    <dt>Pages</dt>
                    <dd>{activeBook.pageCount ? `${activeBook.pageCount} pages` : "Coming soon"}</dd>
                  </div>
                  <div>
                    <dt>Language</dt>
                    <dd>{activeBook.language ?? "Coming soon"}</dd>
                  </div>
                  <div>
                    <dt>ISBN</dt>
                    <dd>{activeBook.isbn13 ?? activeBook.isbn10 ?? "Coming soon"}</dd>
                  </div>
                </dl>

                {activeBook.tags.length ? (
                  <div className="book-tag-row">
                    {activeBook.tags.slice(0, 5).map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                ) : null}
              </section>

              <aside className="book-buy-panel">
                <p className="catalog-kicker">Compare safely</p>
                <h2>Store links</h2>
                <p>We open trusted stores directly. Prices stay hidden until verified.</p>

                <div className="book-store-list">
                  {activeBook.offers.map((offer) => (
                    <a
                      key={offer.store}
                      href={offer.link}
                      target="_blank"
                      rel="noreferrer"
                      className="book-store-card"
                    >
                      <span>
                        <strong>{formatStoreName(offer.store)}</strong>
                        <small>{offer.deliveryText === "Visit store for ETA" ? "Check delivery on store" : offer.deliveryText}</small>
                      </span>
                      <span>
                        <strong>{offer.priceText}</strong>
                        <small>{offer.price === null ? "Safe outbound link" : offer.offerText}</small>
                      </span>
                    </a>
                  ))}
                </div>

                <button type="button" className="book-track-button">
                  Notify me when price tracking is ready
                </button>
              </aside>
            </div>
          </section>

          <section className="book-detail-lower-grid">
            <article className="book-info-card">
              <p className="catalog-kicker">Book overview</p>
              <h2>About this book</h2>
              <p>
                {activeBook.description ??
                  "We are still improving metadata for this title. Store links use the book title only so buyers are not sent through fragile ISBN-only searches."}
              </p>
            </article>

            <article className="book-info-card">
              <p className="catalog-kicker">Price tracking</p>
              <h2>Price history</h2>
              <div className="book-price-chart" aria-hidden="true">
                <span />
                <span />
                <span />
              </div>
              <p>Tracking will start after verified price sources are connected. No fake price graph is shown.</p>
            </article>

            <article className="book-info-card">
              <p className="catalog-kicker">Reviews</p>
              <h2>Reader notes</h2>
              <p>User reviews and saved-search signals will appear here once accounts are connected.</p>
            </article>
          </section>

          {relatedBooks.length ? (
            <section className="book-related-section">
              <div className="shelf-head">
                <div>
                  <h2>Related books</h2>
                  <p>Nearby matches from this search.</p>
                </div>
              </div>

              <div className="book-detail-related-grid">
                {relatedBooks.map((book) => (
                  <Link
                    key={book.id}
                    href={`/search?q=${encodeURIComponent(buildBookQuery(book))}`}
                    className="book-related-card"
                  >
                    {book.thumbnail ? (
                      <img
                        src={book.thumbnail}
                        alt={book.title}
                        width={110}
                        height={164}
                        className="category-book-cover"
                      />
                    ) : (
                      <div className="category-book-cover fallback-mini-cover">{book.title}</div>
                    )}
                    <strong>{book.title}</strong>
                    <span>{formatAuthors(book.authors)}</span>
                  </Link>
                ))}
              </div>
            </section>
          ) : null}
        </>
      ) : null}
    </main>
  );
}

function buildBookQuery(book: CatalogBook) {
  return [book.title, book.authors[0]].filter(Boolean).join(" ");
}

function formatAuthors(authors: string[]) {
  return authors.length > 0 ? authors.join(", ") : "Unknown author";
}

function formatStoreName(store: "amazon" | "flipkart" | "bookswagon") {
  if (store === "amazon") {
    return "Amazon";
  }

  if (store === "flipkart") {
    return "Flipkart";
  }

  return "Bookswagon";
}
