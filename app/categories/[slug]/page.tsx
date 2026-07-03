import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BookCoverImage } from "@/app/components/BookCoverImage";
import { CatalogPagination } from "@/app/components/CatalogPagination";
import { StorefrontHeader } from "@/app/components/StorefrontHeader";
import {
  getCatalogBooksByCategory,
  getCatalogCategories,
  getCatalogCategoryBySlug,
  getCatalogCollections,
} from "@/lib/catalog";
import {
  CATALOG_PAGE_SIZE,
  getCurrentPage,
  getPageCount,
  paginateItems,
} from "@/lib/pagination";
import { buildApprovedStoreLink } from "@/lib/store-links";

type CategoryPageProps = {
  params: Promise<{
    slug: string;
  }>;
  searchParams?: Promise<{
    page?: string | string[];
  }>;
};

export async function generateStaticParams() {
  return getCatalogCategories().map((category) => ({
    slug: category.slug,
  }));
}

export async function generateMetadata(
  props: CategoryPageProps
): Promise<Metadata> {
  const { slug } = await props.params;
  const category = getCatalogCategoryBySlug(slug);

  if (!category) {
    return {
      title: "Category Not Found | Books2Buy",
    };
  }

  return {
    title: `${category.label} Books | Books2Buy`,
    description: `${category.description} Browse Books2Buy's internal catalog for ${category.label.toLowerCase()} books and compare safe store links.`,
  };
}

export default async function CategoryPage(props: CategoryPageProps) {
  const { slug } = await props.params;
  const searchParams = props.searchParams ? await props.searchParams : {};
  const category = getCatalogCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const books = getCatalogBooksByCategory(category.slug);
  const relatedCollections = getCatalogCollections().filter((collection) =>
    collection.books.some((book) => book.category === category.slug)
  );
  const heroBooks = books.slice(0, 5);
  const pageCount = getPageCount(books.length);
  const currentPage = getCurrentPage(searchParams.page, books.length);
  const visibleBooks = paginateItems(books, currentPage);
  const resultStart = books.length
    ? (currentPage - 1) * CATALOG_PAGE_SIZE + 1
    : 0;
  const resultEnd = Math.min(currentPage * CATALOG_PAGE_SIZE, books.length);

  return (
    <main className="catalog-page-shell">
      <StorefrontHeader />

      <section className="catalog-page-hero">
        <div className="catalog-breadcrumbs">
          <Link href="/">Home</Link>
          <span>/</span>
          <span>Categories</span>
          <span>/</span>
          <strong>{category.label}</strong>
        </div>

        <div className="catalog-hero-copy catalog-hero-showcase">
          <div>
            <p className="catalog-kicker">Category</p>
            <h1>{category.label}</h1>
            <p>{category.description}</p>
          </div>

          <div className="catalog-hero-covers" aria-hidden="true">
            {heroBooks.map((book) => (
              <div key={book.id} className="catalog-hero-cover-card">
                <BookCoverImage
                  src={book.thumbnail}
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
            <strong>{books.length}</strong>
          </div>
          <div>
            <span>Collections</span>
            <strong>{relatedCollections.length}</strong>
          </div>
          <div>
            <span>Links</span>
            <strong>Amazon, Flipkart, Bookswagon</strong>
          </div>
        </div>
      </section>

      <section className="category-layout">
        <section className="category-results">
          <div className="category-results-head">
            <div>
              <p className="catalog-kicker">Browse shelf</p>
              <h2>{category.label} picks</h2>
            </div>
            <p>
              Showing {resultStart}-{resultEnd} of {books.length} books. Safe outbound links first and prices appear only when verified.
            </p>
          </div>

          <div className="category-book-grid">
            {visibleBooks.map((book) => (
              <article key={book.id} className="category-book-card">
                <div className="category-book-cover-wrap">
                  <Link href={`/books/${book.slug}`} className="category-book-cover-link">
                    <BookCoverImage
                      src={book.thumbnail}
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
            basePath={`/categories/${category.slug}`}
            currentPage={currentPage}
            pageCount={pageCount}
          />
        </section>
      </section>
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
