export const CATALOG_PAGE_SIZE = 24;

export function getPageCount(totalItems: number, pageSize = CATALOG_PAGE_SIZE) {
  return Math.max(1, Math.ceil(totalItems / pageSize));
}

export function getCurrentPage(
  rawPage: string | string[] | undefined,
  totalItems: number,
  pageSize = CATALOG_PAGE_SIZE
) {
  const value = Array.isArray(rawPage) ? rawPage[0] : rawPage;
  const parsed = Number.parseInt(value ?? "1", 10);
  const pageCount = getPageCount(totalItems, pageSize);

  if (!Number.isFinite(parsed) || parsed < 1) {
    return 1;
  }

  return Math.min(parsed, pageCount);
}

export function paginateItems<T>(
  items: T[],
  currentPage: number,
  pageSize = CATALOG_PAGE_SIZE
) {
  const start = (currentPage - 1) * pageSize;
  return items.slice(start, start + pageSize);
}

export function getPaginationWindow(currentPage: number, pageCount: number) {
  const pages = new Set([1, pageCount, currentPage]);

  for (const page of [currentPage - 2, currentPage - 1, currentPage + 1, currentPage + 2]) {
    if (page >= 1 && page <= pageCount) {
      pages.add(page);
    }
  }

  return [...pages].sort((left, right) => left - right);
}
