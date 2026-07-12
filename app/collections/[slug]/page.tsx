import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BookCoverImage } from "@/app/components/BookCoverImage";
import { CatalogPagination } from "@/app/components/CatalogPagination";
import { StorefrontHeader } from "@/app/components/StorefrontHeader";
import { getCatalogCategories, getCatalogCollections } from "@/lib/catalog";
import {
  getCatalogCollectionFromSourceBySlug,
} from "@/lib/catalog-source";
import {
  CATALOG_PAGE_SIZE,
  getCurrentPage,
  getPageCount,
  paginateItems,
} from "@/lib/pagination";
import { PRIZE_WINNER_SHELVES } from "@/lib/prize-winners";
import { buildApprovedStoreLink } from "@/lib/store-links";

type CollectionPageProps = {
  params: Promise<{
    slug: string;
  }>;
  searchParams?: Promise<{
    page?: string | string[];
  }>;
};

export async function generateStaticParams() {
  return getCatalogCollections().map((collection) => ({
    slug: collection.slug,
  }));
}

export async function generateMetadata(
  props: CollectionPageProps
): Promise<Metadata> {
  const { slug } = await props.params;
  const collection = await getCatalogCollectionFromSourceBySlug(slug);

  if (!collection) {
    return {
      title: "Collection Not Found | Books2Buy",
    };
  }

  return {
    title: `${collection.label} | Books2Buy`,
    description: `${collection.description} Browse the Books2Buy collection and compare safe outbound links across Amazon, Flipkart, and Bookswagon.`,
  };
}

export default async function CollectionPage(props: CollectionPageProps) {
  const { slug } = await props.params;
  const searchParams = props.searchParams ? await props.searchParams : {};
  const collection = await getCatalogCollectionFromSourceBySlug(slug);

  if (!collection) {
    notFound();
  }

  const relatedCategories = getCatalogCategories().filter((category) =>
    collection.books.some((book) => book.category === category.slug)
  );
  const categoryLabels = new Map(
    relatedCategories.map((category) => [category.slug, category.label])
  );
  const heroBooks = collection.books.slice(0, 5);
  const pageCount = getPageCount(collection.books.length);
  const currentPage = getCurrentPage(searchParams.page, collection.books.length);
  const visibleBooks = paginateItems(collection.books, currentPage);
  const resultStart = collection.books.length
    ? (currentPage - 1) * CATALOG_PAGE_SIZE + 1
    : 0;
  const resultEnd = Math.min(currentPage * CATALOG_PAGE_SIZE, collection.books.length);
  const isPrizeCollection = isPrizeWinnerCollection(collection.slug);

  return (
    <main className="catalog-page-shell">
      <StorefrontHeader />

      <section className="catalog-page-hero">
        <div className="catalog-breadcrumbs">
          <Link href="/">Home</Link>
          <span>/</span>
          <span>Collections</span>
          <span>/</span>
          <strong>{collection.label}</strong>
        </div>

        <div className="catalog-hero-copy catalog-hero-showcase">
          <div>
            <p className="catalog-kicker">Collection</p>
            <h1>{collection.label}</h1>
            <p>{collection.description}</p>
          </div>

          <div className="catalog-hero-covers" aria-hidden="true">
            {heroBooks.map((book) => (
              <div key={book.id} className="catalog-hero-cover-card">
                <BookCoverImage
                  src={book.thumbnail}
                  fallbackSrc={book.coverFallback}
                  alt=""
                  width={86}
                  height={128}
                  className="catalog-hero-cover"
                  fallbackClassName="catalog-hero-cover fallback-mini-cover"
                  fallbackText={book.title}
                  loading="eager"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="catalog-summary">
          <div>
            <span>Books</span>
            <strong>{collection.books.length}</strong>
          </div>
          <div>
            <span>Categories</span>
            <strong>{relatedCategories.length}</strong>
          </div>
          <div>
            <span>Links</span>
            <strong>Amazon, Flipkart, Bookswagon</strong>
          </div>
        </div>
      </section>

      <section
        className={
          isPrizeCollection
            ? "category-layout prize-category-layout"
            : "category-layout"
        }
      >
        {isPrizeCollection ? (
          <aside className="prize-sidebar" aria-label="Prize winner categories">
            <Link
              href="/collections/prize-winners"
              className={
                collection.slug === "prize-winners"
                  ? "prize-sidebar-back prize-sidebar-active"
                  : "prize-sidebar-back"
              }
            >
              Prize Winners
            </Link>
            <h2>Award Tracks</h2>
            <nav className="prize-sidebar-links">
              {PRIZE_WINNER_SHELVES.map((shelf) =>
                shelf.href ? (
                  <Link
                    key={shelf.label}
                    href={shelf.href}
                    className={
                      shelf.href === `/collections/${collection.slug}`
                        ? "prize-sidebar-active"
                        : undefined
                    }
                  >
                    {shelf.label}
                  </Link>
                ) : (
                  <span key={shelf.label}>{shelf.label}</span>
                )
              )}
            </nav>
          </aside>
        ) : null}

        <section className="category-results">
          <div className="category-results-head">
            <div>
              <p className="catalog-kicker">Curated shelf</p>
              <h2>{collection.label} picks</h2>
            </div>
            <p>
              Showing {resultStart}-{resultEnd} of {collection.books.length} books. Store links remain safe and prices stay hidden unless verified.
            </p>
          </div>

          <div className="category-book-grid">
            {visibleBooks.map((book) => (
              <article key={book.id} className="category-book-card">
                <div className="category-book-cover-wrap">
                  <Link href={`/books/${book.slug}`} className="category-book-cover-link">
                    <BookCoverImage
                      src={book.thumbnail}
                      fallbackSrc={book.coverFallback}
                      alt={book.title}
                      width={120}
                      height={176}
                      className="category-book-cover"
                      fallbackClassName="category-book-cover fallback-mini-cover"
                      fallbackText={book.title}
                    />
                  </Link>
                </div>

                <div className="category-book-copy">
                  <h3>
                    <Link href={`/books/${book.slug}`}>{book.title}</Link>
                  </h3>
                  <p>{book.authors.join(", ")}</p>

                  <dl className="category-book-meta">
                    <div>
                      <dt>Category</dt>
                      <dd>{categoryLabels.get(book.category) ?? "General"}</dd>
                    </div>
                    <div>
                      <dt>Published</dt>
                      <dd>{book.publishedDate ?? "Coming soon"}</dd>
                    </div>
                    <div>
                      <dt>Format</dt>
                      <dd>{book.format}</dd>
                    </div>
                  </dl>

                  <p className="category-book-description">{book.description}</p>

                  <div className="category-store-links">
                    {book.offers.map((offer) => (
                      <a
                        key={`${book.id}-${offer.store}`}
                        href={buildApprovedStoreLink(
                          offer.store,
                          offer.affiliateQuery
                        )}
                        target="_blank"
                        rel="noreferrer"
                        className="category-store-link"
                      >
                        <span>{formatStoreName(offer.store)}</span>
                        <small>{offer.price.label}</small>
                        <small>{offer.deliveryText ?? "Visit store for ETA"}</small>
                        <small>{offer.offerSummary ?? "Safe outbound link"}</small>
                      </a>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>

          <CatalogPagination
            basePath={`/collections/${collection.slug}`}
            currentPage={currentPage}
            pageCount={pageCount}
          />
        </section>
      </section>
    </main>
  );
}

function isPrizeWinnerCollection(slug: string) {
  return (
    slug === "prize-winners" ||
    PRIZE_WINNER_SHELVES.some((shelf) => shelf.href === `/collections/${slug}`)
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
