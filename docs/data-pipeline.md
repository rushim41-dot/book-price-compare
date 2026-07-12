# Books2Buy Data Pipeline

Books2Buy should scale from curated records first, then use external sources to enrich and verify. The public site must not depend on live Open Library, Google Books, or Project Gutenberg calls during page rendering.

## Source Priority

1. Curated Books2Buy catalog data.
2. Verified edition or product identifiers reviewed by us.
3. Open Library work or edition metadata.
4. Project Gutenberg public-domain ebook metadata.
5. Google Books candidate metadata.
6. Generated local fallback covers.

External data can suggest improvements, but it must not override curated title, author, ISBN, publisher, pages, or category decisions without review.

## First Database Shape

The first database should store only books we actually publish or are reviewing:

- `books`: canonical public catalog record.
- `authors` and `book_authors`: normalized author names.
- `categories`, `collections`, `book_collections`, and `book_tags`: browse structure.
- `external_book_identifiers`: Open Library, Google Books, Gutenberg, and ISBN IDs.
- `cover_assets`: chosen primary cover, candidates, and generated fallback.
- `store_offers`: safe store links now, verified product links later.
- `search_events`: demand signal for what to add next.
- `enrichment_jobs`: controlled background imports and audits.

This avoids importing millions of books before we know readers need them.

## Enrichment Flow

1. A book enters the curated catalog or appears often in search analytics.
2. An enrichment job searches Open Library, Google Books, and Gutenberg with a descriptive User-Agent.
3. Candidate IDs, covers, descriptions, and subjects are saved as candidates.
4. A review step accepts only the exact base book or intended edition.
5. The accepted result updates `books`, `external_book_identifiers`, and `cover_assets`.
6. Public pages read only from our stored data.

## Cover Rules

- Every public book should have a local fallback cover.
- Remote covers must be treated as optional.
- Open Library and Google Books cover URLs should be stored after review.
- Broken remote covers must not block rendering.
- ISBN cover links are allowed for catalog quality, but store links must still use title-only search unless the exact retail product is verified.

## Store And Price Rules

- Generic store links stay title-only.
- Raw ISBN store links are not used unless an exact product/edition is verified.
- `store_offers.link_type = 'search'` for current safe outbound search links.
- `store_offers.link_type = 'verified_product'` only after exact product URL/product ID review.
- Prices and alerts remain disabled until Amazon approval/agreement and exact product matching are ready.

## Manual Catalog Add Workflow

Use the manual add validator before pasting any new curated books into `lib/catalog.ts`:

```bash
npm run catalog:add:check -- data/manual-catalog-add.template.json
```

The validator checks the published catalog plus the candidate file for safe categories, collections, duplicate slugs or titles, title-only store queries, and missing/fake price data. Candidate `offers` can be omitted; the generated snippet uses `buildCatalogOffers(slug, title, authors)` so Amazon, Flipkart, and Bookswagon queries stay title-only.

For a stock-market shelf, prefer a collection such as `investing` first. Keep each book in the existing `personal-finance` or `business` category unless we intentionally add a new category across TypeScript, database seed data, and UI navigation.

## Scale Plan

Start with hundreds or thousands of high-demand books. Add more from search analytics, curated category lists, public-domain collections, and bestseller demand. Millions of records can wait until the matching and review pipeline is mature.

## Seed Export

Run this locally whenever the curated TypeScript catalog changes:

```bash
npm run export:catalog-seed
```

The script writes:

- `db/seed-catalog.sql`: paste into Supabase SQL Editor after `db/schema.sql`.
- `data/catalog-database-seed.json`: reviewable structured export of the same seed data.

To apply the generated catalog seed through the configured `DATABASE_URL`, run:

```bash
npm run db:seed-catalog
```

## Database Check

After adding the Supabase pooled connection string to `.env.local` as `DATABASE_URL`, run:

```bash
npm run db:check
```

The script verifies that the seeded catalog is reachable from local code without switching the public site to database reads.

To compare the seeded database against the generated local seed, run:

```bash
npm run db:compare-catalog
```

This checks table counts, book identity fields, cover fields, and current safe store-link metadata. Public pages should not switch to database reads until this comparison passes.
