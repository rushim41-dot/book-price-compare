import http from "node:http";
import https from "node:https";

const DEFAULT_BASE_URL = "http://127.0.0.1:3000";
const baseUrl = process.env.COVER_AUDIT_BASE_URL ?? DEFAULT_BASE_URL;
const insecureTls = process.env.COVER_AUDIT_INSECURE_TLS === "1";
const failOnBad = process.env.COVER_AUDIT_FAIL_ON_BAD === "1";

const visibleCollectionLimits = new Map([
  ["bestsellers", 5],
  ["first-book-start-here", 4],
  ["world-classics", 6],
  ["prize-winners", 6],
  ["indian-authors", 6],
]);

async function main() {
  const catalog = await fetchJson(new URL("/api/catalog", baseUrl));
  const books = collectVisibleBooks(catalog);
  const rows = [];

  rows.push(...(await Promise.all(books.map((book) => auditBookCover(book)))));

  printRows(rows);

  const problemCount = rows.filter((row) => row.status !== "ok").length;
  console.log(
    `\nAudited ${rows.length} visible covers. ${problemCount} need attention.`
  );

  if (failOnBad && problemCount > 0) {
    process.exitCode = 1;
  }
}

async function fetchJson(url) {
  const response = await fetch(url, { cache: "no-store" });

  if (!response.ok) {
    throw new Error(
      `Could not load ${url.href}. Start the local site first with npm run dev.`
    );
  }

  return response.json();
}

function collectVisibleBooks(catalog) {
  const visibleBooksBySlug = new Map();

  for (const [collectionSlug, limit] of visibleCollectionLimits) {
    const collection = catalog.collections?.find(
      (item) => item.slug === collectionSlug
    );

    for (const book of collection?.books?.slice(0, limit) ?? []) {
      if (!visibleBooksBySlug.has(book.slug)) {
        visibleBooksBySlug.set(book.slug, book);
      }
    }
  }

  return [...visibleBooksBySlug.values()];
}

async function auditBookCover(book) {
  const fallbackProbe = book.coverFallback
    ? await probeUrl(
        book.coverFallback.startsWith("/")
          ? new URL(book.coverFallback, baseUrl).href
          : book.coverFallback
      )
    : null;

  if (!book.thumbnail) {
    return buildFallbackAuditResult(book, fallbackProbe, "No primary thumbnail");
  }

  const targetUrl = book.thumbnail.startsWith("/")
    ? new URL(book.thumbnail, baseUrl).href
    : book.thumbnail;

  const probe = await probeUrl(targetUrl);

  if (!probe.ok) {
    return buildFallbackAuditResult(
      book,
      fallbackProbe,
      probe.error ?? `Primary HTTP ${probe.statusCode ?? "unknown"}`
    );
  }

  if (probe.bytes <= 1_000) {
    return buildFallbackAuditResult(
      book,
      fallbackProbe,
      `Primary suspiciously small response (${probe.bytes} bytes)`
    );
  }

  return {
    slug: book.slug,
    title: book.title,
    status: "ok",
    detail: `${probe.statusCode} ${probe.contentType ?? "unknown"} ${probe.bytes}+ bytes`,
  };
}

function buildFallbackAuditResult(book, fallbackProbe, primaryProblem) {
  if (!fallbackProbe) {
    return {
      slug: book.slug,
      title: book.title,
      status: "bad",
      detail: primaryProblem,
    };
  }

  if (fallbackProbe.ok && fallbackProbe.bytes > 1_000) {
    return {
      slug: book.slug,
      title: book.title,
      status: "ok",
      detail: `${primaryProblem}; fallback ok ${fallbackProbe.statusCode} ${fallbackProbe.contentType ?? "unknown"} ${fallbackProbe.bytes}+ bytes`,
    };
  }

  return {
    slug: book.slug,
    title: book.title,
    status: "bad",
    detail: `${primaryProblem}; fallback failed ${
      fallbackProbe.error ?? `HTTP ${fallbackProbe.statusCode ?? "unknown"}`
    }`,
  };
}

function probeUrl(url, redirectCount = 0) {
  const maxRedirects = 5;
  const maxBytes = 64 * 1024;
  const parsedUrl = new URL(url);
  const transport = parsedUrl.protocol === "https:" ? https : http;

  return new Promise((resolve) => {
    let settled = false;
    const request = transport.request(
      parsedUrl,
      {
        method: "GET",
        timeout: 4_000,
        rejectUnauthorized: !insecureTls,
        headers: {
          Range: `bytes=0-${maxBytes - 1}`,
          "User-Agent": "Books2Buy cover audit",
        },
      },
      (response) => {
        const statusCode = response.statusCode ?? 0;
        const location = response.headers.location;

        if (
          statusCode >= 300 &&
          statusCode < 400 &&
          location &&
          redirectCount < maxRedirects
        ) {
          response.resume();
          resolve(probeUrl(new URL(location, parsedUrl).href, redirectCount + 1));
          return;
        }

        let bytes = 0;
        response.on("data", (chunk) => {
          bytes += chunk.length;

          if (bytes >= maxBytes && !settled) {
            settled = true;
            resolve(buildProbeResult(response, bytes, true));
            request.destroy();
          }
        });
        response.on("end", () => {
          if (!settled) {
            settled = true;
            resolve(buildProbeResult(response, bytes, false));
          }
        });
      }
    );

    request.on("timeout", () => {
      if (!settled) {
        settled = true;
        request.destroy();
        resolve({ ok: false, error: "Request timed out" });
      }
    });
    request.on("error", (error) => {
      if (!settled) {
        settled = true;
        resolve({ ok: false, error: error.message });
      }
    });
    request.end();
  });
}

function buildProbeResult(response, bytes, truncated) {
  const statusCode = response.statusCode ?? 0;

  return {
    ok: statusCode >= 200 && statusCode < 300,
    statusCode,
    contentType: response.headers["content-type"],
    bytes,
    truncated,
  };
}

function printRows(rows) {
  const printableRows = rows.map((row) => ({
    status: row.status,
    slug: row.slug,
    title: row.title,
    detail: row.detail,
  }));

  console.table(printableRows);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
