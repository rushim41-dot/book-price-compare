import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { StorefrontHeader } from "@/app/components/StorefrontHeader";
import {
  CATALOG_BOOKS,
  getCatalogBookBySlug,
  getCatalogBooksByCategory,
  getCatalogCategoryBySlug,
} from "@/lib/catalog";
import { buildApprovedStoreLink } from "@/lib/store-links";

type BookPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  return CATALOG_BOOKS.map((book) => ({
    slug: book.slug,
  }));
}

export async function generateMetadata(props: BookPageProps): Promise<Metadata> {
  const { slug } = await props.params;
  const book = getCatalogBookBySlug(slug);

  if (!book) {
    return {
      title: "Book Not Found | Books2Buy",
    };
  }

  return {
    title: `${book.title} by ${book.authors.join(", ")} | Books2Buy`,
    description: `Compare safe store links for ${book.title}. Prices appear only when verified.`,
  };
}

export default async function BookPage(props: BookPageProps) {
  const { slug } = await props.params;
  const book = getCatalogBookBySlug(slug);

  if (!book) {
    notFound();
  }

  const category = getCatalogCategoryBySlug(book.category);
  const relatedBooks = getCatalogBooksByCategory(book.category)
    .filter((item) => item.slug !== book.slug)
    .slice(0, 5);

  return (
    <main className="book-detail-shell">
      <StorefrontHeader />

      <section className="book-detail-hero">
        <div className="catalog-breadcrumbs">
          <Link href="/">Home</Link>
          <span>/</span>
          {category ? <Link href={`/categories/${category.slug}`}>{category.label}</Link> : <span>Books</span>}
          <span>/</span>
          <strong>{book.title}</strong>
        </div>

        <div className="book-detail-grid">
          <aside className="book-cover-panel">
            <div className="book-detail-cover-frame">
              {book.thumbnail ? (
                <Image
                  src={book.thumbnail}
                  alt={book.title}
                  width={260}
                  height={390}
                  className="book-detail-cover"
                  unoptimized
                />
              ) : (
                <div className="book-detail-cover book-detail-cover-fallback">
                  {book.title}
                </div>
              )}
            </div>
            <a href="#store-links" className="book-secondary-action">Check stores</a>
          </aside>

          <section className="book-main-panel">
            <p className="catalog-kicker">Book details</p>
            <h1>{book.title}</h1>
            <p className="book-detail-author">by {book.authors.join(", ")}</p>

            <div className="book-rating-row" aria-label="Book metadata">
              <span>Catalog preview</span>
              <span>No user reviews yet</span>
            </div>

            <p className="book-detail-description">{book.description}</p>

            <dl className="book-detail-specs">
              <div>
                <dt>Publisher</dt>
                <dd>{book.publisher ?? "Coming soon"}</dd>
              </div>
              <div>
                <dt>Published</dt>
                <dd>{book.publishedDate ?? "Coming soon"}</dd>
              </div>
              <div>
                <dt>Format</dt>
                <dd>{book.format}</dd>
              </div>
              <div>
                <dt>Pages</dt>
                <dd>{book.pages ? `${book.pages} pages` : "Coming soon"}</dd>
              </div>
              <div>
                <dt>Language</dt>
                <dd>{book.language}</dd>
              </div>
              <div>
                <dt>ISBN</dt>
                <dd>{book.isbn13 ?? book.isbn10 ?? "Coming soon"}</dd>
              </div>
            </dl>

            <div className="book-tag-row">
              {book.tags.slice(0, 5).map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          </section>

          <aside id="store-links" className="book-buy-panel">
            <p className="catalog-kicker">Compare safely</p>
            <h2>Store links</h2>
            <p>We open trusted stores directly. Prices stay hidden until verified.</p>

            <div className="book-store-list">
              {book.offers.map((offer) => (
                <a
                  key={offer.store}
                  href={buildApprovedStoreLink(offer.store, offer.affiliateQuery)}
                  target="_blank"
                  rel="noreferrer"
                  className="book-store-card"
                >
                  <span>
                    <strong>{formatStoreName(offer.store)}</strong>
                    <small>{offer.deliveryText ?? "Check delivery on store"}</small>
                  </span>
                  <span>
                    <strong>{offer.price.label}</strong>
                    <small>{offer.offerSummary ?? "Safe outbound link"}</small>
                  </span>
                </a>
              ))}
            </div>
          </aside>
        </div>
      </section>

      <section className="book-detail-lower-grid">
        <article className="book-info-card">
          <p className="catalog-kicker">Book overview</p>
          <h2>About this book</h2>
          <p>{book.description}</p>
        </article>

        <article className="book-info-card">
          <p className="catalog-kicker">Buying checks</p>
          <h2>Before you buy</h2>
          <p>
            Confirm the final price, delivery estimate, seller, and edition on the
            store website before placing an order.
          </p>
        </article>

        <article className="book-info-card">
          <p className="catalog-kicker">Catalog quality</p>
          <h2>Edition notes</h2>
          <p>
            We keep author, ISBN, publisher, pages, and cover data for matching quality,
            but store links use the book title unless an exact product URL is verified.
          </p>
        </article>
      </section>

      {relatedBooks.length ? (
        <section className="book-related-section">
          <div className="shelf-head">
            <div>
              <h2>Related books</h2>
              <p>More picks from {category?.label ?? "this shelf"}.</p>
            </div>
            {category ? (
              <Link href={`/categories/${category.slug}`} className="view-more">
                View shelf
              </Link>
            ) : null}
          </div>

          <div className="book-detail-related-grid">
            {relatedBooks.map((related) => (
              <Link key={related.id} href={`/books/${related.slug}`} className="book-related-card">
                {related.thumbnail ? (
                  <Image
                    src={related.thumbnail}
                    alt={related.title}
                    width={110}
                    height={164}
                    className="category-book-cover"
                    unoptimized
                  />
                ) : (
                  <div className="category-book-cover fallback-mini-cover">{related.title}</div>
                )}
                <strong>{related.title}</strong>
                <span>{related.authors.join(", ")}</span>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
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
