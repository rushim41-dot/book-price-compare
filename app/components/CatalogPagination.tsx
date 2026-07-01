import Link from "next/link";
import { getPaginationWindow } from "@/lib/pagination";

export function CatalogPagination({
  basePath,
  currentPage,
  pageCount,
}: {
  basePath: string;
  currentPage: number;
  pageCount: number;
}) {
  if (pageCount <= 1) {
    return null;
  }

  const pages = getPaginationWindow(currentPage, pageCount);

  return (
    <nav className="catalog-pagination" aria-label="Pagination">
      <Link
        href={buildPageHref(basePath, Math.max(1, currentPage - 1))}
        aria-disabled={currentPage === 1}
        className={currentPage === 1 ? "pagination-link pagination-link-disabled" : "pagination-link"}
      >
        Previous
      </Link>
      {pages.map((page, index) => (
        <span key={page} className="pagination-window-item">
          {index > 0 && page - pages[index - 1] > 1 ? (
            <span className="pagination-ellipsis">...</span>
          ) : null}
          <Link
            href={buildPageHref(basePath, page)}
            aria-current={page === currentPage ? "page" : undefined}
            className={
              page === currentPage
                ? "pagination-link pagination-link-active"
                : "pagination-link"
            }
          >
            {page}
          </Link>
        </span>
      ))}
      <Link
        href={buildPageHref(basePath, Math.min(pageCount, currentPage + 1))}
        aria-disabled={currentPage === pageCount}
        className={
          currentPage === pageCount
            ? "pagination-link pagination-link-disabled"
            : "pagination-link"
        }
      >
        Next
      </Link>
    </nav>
  );
}

function buildPageHref(basePath: string, page: number) {
  return page <= 1 ? basePath : `${basePath}?page=${page}`;
}
