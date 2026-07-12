import { readFile } from "node:fs/promises";
import Module from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

import ts from "typescript";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const require = Module.createRequire(import.meta.url);
const candidatePath = process.argv[2]
  ? path.resolve(rootDir, process.argv[2])
  : null;

registerTypeScriptRequireHook();

const {
  CATALOG_BOOKS,
  CATEGORY_RECORDS,
  COLLECTION_RECORDS,
} = require("../lib/catalog.ts");

const allowedCategories = new Set(CATEGORY_RECORDS.map((category) => category.slug));
const existingBookSlugs = new Set(CATALOG_BOOKS.map((book) => book.slug));
const existingCollectionSlugs = new Set(
  COLLECTION_RECORDS.map((collection) => collection.slug)
);
const allKnownTitles = new Map(
  CATALOG_BOOKS.map((book) => [normalizeText(book.title), book.slug])
);
const errors = [];
const warnings = [];

auditPublishedCatalog();

let candidate = { collections: [], books: [] };

if (candidatePath) {
  candidate = await readCandidate(candidatePath);
  validateCandidate(candidate);
}

if (errors.length > 0) {
  console.error(`Catalog add validation failed with ${errors.length} issue(s):`);
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

for (const warning of warnings) {
  console.warn(`Warning: ${warning}`);
}

console.log(
  JSON.stringify(
    {
      status: "ok",
      checkedCatalogBooks: CATALOG_BOOKS.length,
      checkedCandidateBooks: candidate.books.length,
      checkedCandidateCollections: candidate.collections.length,
      candidatePath,
    },
    null,
    2
  )
);

if (candidate.books.length > 0) {
  console.log("\nSuggested lib/catalog.ts book snippet:\n");
  console.log(buildBookSnippet(candidate.books));
}

function auditPublishedCatalog() {
  const seenSlugs = new Set();
  const seenTitles = new Set();
  const seenDescriptions = new Map();

  for (const book of CATALOG_BOOKS) {
    if (seenSlugs.has(book.slug)) {
      errors.push(`catalog:${book.slug} duplicates an existing published slug`);
    }
    seenSlugs.add(book.slug);

    const normalizedTitle = normalizeText(book.title);
    if (seenTitles.has(normalizedTitle)) {
      warnings.push(`catalog:${book.slug} duplicates an existing published title`);
    }
    seenTitles.add(normalizedTitle);

    const normalizedDescription = normalizeText(book.description);
    const duplicateDescriptionSlug = seenDescriptions.get(normalizedDescription);
    const descriptionWordCount = book.description.trim().split(/\s+/).length;

    if (descriptionWordCount < 25) {
      errors.push(
        `catalog:${book.slug}.description must contain at least 25 words of editorial copy`
      );
    }

    if (duplicateDescriptionSlug) {
      errors.push(
        `catalog:${book.slug}.description duplicates catalog:${duplicateDescriptionSlug}`
      );
    }
    seenDescriptions.set(normalizedDescription, book.slug);

    validateBookRecord(book, `catalog:${book.slug}`, {
      allowExistingSlug: true,
      knownCandidateBookSlugs: new Set(),
      knownCandidateCollectionSlugs: new Set(),
    });
  }
}

async function readCandidate(filePath) {
  let parsed;

  try {
    parsed = JSON.parse(await readFile(filePath, "utf8"));
  } catch (error) {
    throw new Error(`Unable to read candidate JSON at ${filePath}: ${error.message}`);
  }

  if (!isPlainObject(parsed)) {
    errors.push("candidate file must contain a JSON object");
    return { collections: [], books: [] };
  }

  return {
    collections: readArray(parsed.collections, "collections"),
    books: readArray(parsed.books, "books"),
  };
}

function validateCandidate(candidateData) {
  const candidateBookSlugs = new Set();
  const candidateCollectionSlugs = new Set();

  for (const collection of candidateData.collections) {
    if (!isPlainObject(collection)) {
      errors.push("each candidate collection must be an object");
      continue;
    }

    validateSlug(collection.slug, "collection.slug");
    validateRequiredString(collection.label, `collection:${collection.slug}.label`);
    validateRequiredString(
      collection.description,
      `collection:${collection.slug}.description`
    );

    if (existingCollectionSlugs.has(collection.slug)) {
      warnings.push(
        `collection ${collection.slug} already exists; additions should update its bookSlugs intentionally`
      );
    }

    if (candidateCollectionSlugs.has(collection.slug)) {
      errors.push(`duplicate candidate collection slug ${collection.slug}`);
    }
    candidateCollectionSlugs.add(collection.slug);
  }

  for (const book of candidateData.books) {
    if (!isPlainObject(book)) {
      errors.push("each candidate book must be an object");
      continue;
    }

    if (candidateBookSlugs.has(book.slug)) {
      errors.push(`duplicate candidate book slug ${book.slug}`);
    }
    candidateBookSlugs.add(book.slug);
  }

  for (const collection of candidateData.collections) {
    if (!isPlainObject(collection)) {
      continue;
    }

    const bookSlugs = readArray(collection.bookSlugs, `collection:${collection.slug}.bookSlugs`);
    for (const slug of bookSlugs) {
      if (!existingBookSlugs.has(slug) && !candidateBookSlugs.has(slug)) {
        errors.push(`collection ${collection.slug} references unknown book slug ${slug}`);
      }
    }
  }

  for (const book of candidateData.books) {
    if (!isPlainObject(book)) {
      continue;
    }

    validateBookRecord(book, `candidate:${book.slug}`, {
      allowExistingSlug: false,
      knownCandidateBookSlugs: candidateBookSlugs,
      knownCandidateCollectionSlugs: candidateCollectionSlugs,
    });
  }
}

function validateBookRecord(book, context, options) {
  validateSlug(book.slug, `${context}.slug`);

  if (!options.allowExistingSlug && existingBookSlugs.has(book.slug)) {
    errors.push(`${context} duplicates existing catalog slug`);
  }

  validateRequiredString(book.title, `${context}.title`);
  validateStringArray(book.authors, `${context}.authors`, { minLength: 1 });
  validateRequiredString(book.description, `${context}.description`);

  if (!allowedCategories.has(book.category)) {
    errors.push(
      `${context}.category must be one of ${Array.from(allowedCategories).join(", ")}`
    );
  }

  validateNullableString(book.thumbnail, `${context}.thumbnail`);
  validateNullableString(book.publisher, `${context}.publisher`);
  validateNullableString(book.publishedDate, `${context}.publishedDate`);
  validateNullableString(book.isbn13, `${context}.isbn13`);
  validateNullableString(book.isbn10, `${context}.isbn10`);
  validateRequiredString(book.language, `${context}.language`);
  validateRequiredString(book.format, `${context}.format`);
  validateNullableNumber(book.pages, `${context}.pages`);
  validateStringArray(book.tags, `${context}.tags`, { minLength: 1 });
  validateStringArray(book.featuredCollectionSlugs, `${context}.featuredCollectionSlugs`);

  if (typeof book.isbn13 === "string" && !/^\d{13}$/.test(book.isbn13)) {
    errors.push(`${context}.isbn13 must be 13 digits or null`);
  }

  if (typeof book.isbn10 === "string" && !/^[0-9X]{10}$/i.test(book.isbn10)) {
    errors.push(`${context}.isbn10 must be 10 ISBN characters or null`);
  }

  for (const collectionSlug of book.featuredCollectionSlugs ?? []) {
    if (
      !existingCollectionSlugs.has(collectionSlug) &&
      !options.knownCandidateCollectionSlugs.has(collectionSlug)
    ) {
      errors.push(`${context} references unknown collection ${collectionSlug}`);
    }
  }

  const duplicateTitleSlug = allKnownTitles.get(normalizeText(book.title));
  if (!options.allowExistingSlug && duplicateTitleSlug) {
    errors.push(`${context}.title duplicates existing catalog book ${duplicateTitleSlug}`);
  }

  validateSafeOffers(book, context);
}

function validateSafeOffers(book, context) {
  const offers = book.offers;

  if (offers === undefined) {
    return;
  }

  if (!Array.isArray(offers)) {
    errors.push(`${context}.offers must be omitted or an array`);
    return;
  }

  for (const offer of offers) {
    if (!isPlainObject(offer)) {
      errors.push(`${context}.offers entries must be objects`);
      continue;
    }

    if (offer.affiliateQuery !== book.title) {
      errors.push(`${context}.${offer.store ?? "store"} affiliateQuery must equal title only`);
    }

    if (typeof offer.affiliateQuery === "string" && looksLikeIsbn(offer.affiliateQuery)) {
      errors.push(`${context}.${offer.store ?? "store"} affiliateQuery must not be an ISBN`);
    }

    if ("outboundUrl" in offer || "productId" in offer || "linkType" in offer) {
      errors.push(
        `${context}.${offer.store ?? "store"} must not include product links in manual additions`
      );
    }

    if (offer.price && offer.price.amountInr !== null) {
      errors.push(`${context}.${offer.store ?? "store"} must not include a manual price`);
    }
  }
}

function buildBookSnippet(books) {
  return books
    .map((book) => {
      const lines = [
        "{",
        `  id: "catalog-${book.slug}",`,
        `  slug: ${quote(book.slug)},`,
        `  title: ${quote(book.title)},`,
        `  authors: ${JSON.stringify(book.authors)},`,
        `  description: ${quote(book.description)},`,
        `  category: ${quote(book.category)},`,
        `  thumbnail: ${toTsNullableString(book.thumbnail)},`,
        `  publisher: ${toTsNullableString(book.publisher)},`,
        `  publishedDate: ${toTsNullableString(book.publishedDate)},`,
        `  isbn13: ${toTsNullableString(book.isbn13)},`,
        `  isbn10: ${toTsNullableString(book.isbn10)},`,
        `  language: ${quote(book.language)},`,
        `  format: ${quote(book.format)},`,
        `  pages: ${book.pages ?? "null"},`,
        `  tags: ${JSON.stringify(book.tags)},`,
        `  featuredCollectionSlugs: ${JSON.stringify(book.featuredCollectionSlugs)},`,
        `  offers: buildCatalogOffers(${quote(book.slug)}, ${quote(book.title)}, ${JSON.stringify(book.authors)}),`,
        "},",
      ];

      return lines.join("\n");
    })
    .join("\n");
}

function readArray(value, label) {
  if (value === undefined) {
    return [];
  }

  if (!Array.isArray(value)) {
    errors.push(`${label} must be an array`);
    return [];
  }

  return value;
}

function validateSlug(value, label) {
  if (typeof value !== "string" || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)) {
    errors.push(`${label} must be a lowercase kebab-case slug`);
  }
}

function validateRequiredString(value, label) {
  if (typeof value !== "string" || value.trim().length === 0) {
    errors.push(`${label} must be a non-empty string`);
  }
}

function validateNullableString(value, label) {
  if (value !== null && typeof value !== "string") {
    errors.push(`${label} must be a string or null`);
  }
}

function validateNullableNumber(value, label) {
  if (value !== null && typeof value !== "number") {
    errors.push(`${label} must be a number or null`);
  }
}

function validateStringArray(value, label, options = {}) {
  if (!Array.isArray(value) || !value.every((item) => typeof item === "string")) {
    errors.push(`${label} must be an array of strings`);
    return;
  }

  if (options.minLength && value.length < options.minLength) {
    errors.push(`${label} must contain at least ${options.minLength} item(s)`);
  }
}

function looksLikeIsbn(value) {
  return /^[0-9Xx -]{10,17}$/.test(value.trim());
}

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function normalizeText(value) {
  return typeof value === "string" ? value.trim().toLowerCase().replace(/\s+/g, " ") : "";
}

function quote(value) {
  return JSON.stringify(value);
}

function toTsNullableString(value) {
  return value === null || value === undefined ? "null" : quote(value);
}

function registerTypeScriptRequireHook() {
  const originalResolveFilename = Module._resolveFilename;

  Module._resolveFilename = function resolveFilename(request, parent, isMain, options) {
    if (request.startsWith("@/")) {
      return originalResolveFilename.call(
        this,
        path.join(rootDir, request.slice(2)),
        parent,
        isMain,
        options
      );
    }

    return originalResolveFilename.call(this, request, parent, isMain, options);
  };

  Module._extensions[".ts"] = function compileTypeScript(module, filename) {
    const source = require("node:fs").readFileSync(filename, "utf8");
    const output = ts.transpileModule(source, {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        moduleResolution: ts.ModuleResolutionKind.NodeJs,
        target: ts.ScriptTarget.ES2022,
        esModuleInterop: true,
        jsx: ts.JsxEmit.ReactJSX,
      },
      fileName: filename,
    });

    module._compile(output.outputText, filename);
  };
}
