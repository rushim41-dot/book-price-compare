-- Books2Buy catalog database foundation.
-- Keep curated data canonical; external sources only enrich or verify records.

create extension if not exists pgcrypto;
create extension if not exists pg_trgm;

create table if not exists categories (
  slug text primary key,
  label text not null,
  description text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists collections (
  slug text primary key,
  label text not null,
  description text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists books (
  id uuid primary key default gen_random_uuid(),
  catalog_id text not null unique,
  slug text not null unique,
  title text not null,
  description text not null,
  category_slug text not null references categories(slug),
  thumbnail_url text,
  cover_fallback_path text,
  publisher text,
  published_date_text text,
  isbn13 text,
  isbn10 text,
  language text not null default 'English',
  format text not null,
  pages integer check (pages is null or pages > 0),
  data_quality_status text not null default 'curated'
    check (data_quality_status in ('curated', 'verified', 'needs_review', 'rejected')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists authors (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  normalized_name text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists book_authors (
  book_id uuid not null references books(id) on delete cascade,
  author_id uuid not null references authors(id) on delete restrict,
  author_order integer not null check (author_order >= 0),
  role text not null default 'author',
  primary key (book_id, author_id, role)
);

create table if not exists book_tags (
  book_id uuid not null references books(id) on delete cascade,
  tag text not null,
  primary key (book_id, tag)
);

create table if not exists book_collections (
  book_id uuid not null references books(id) on delete cascade,
  collection_slug text not null references collections(slug) on delete cascade,
  position integer,
  primary key (book_id, collection_slug)
);

create table if not exists external_book_identifiers (
  id uuid primary key default gen_random_uuid(),
  book_id uuid not null references books(id) on delete cascade,
  source text not null check (
    source in (
      'isbn10',
      'isbn13',
      'open_library_work',
      'open_library_edition',
      'open_library_cover',
      'google_books_volume',
      'project_gutenberg',
      'manual'
    )
  ),
  external_id text not null,
  external_url text,
  confidence text not null default 'needs_review'
    check (confidence in ('curated', 'verified', 'candidate', 'needs_review', 'rejected')),
  verified_at timestamptz,
  notes text,
  created_at timestamptz not null default now(),
  unique (source, external_id),
  unique (book_id, source, external_id)
);

create table if not exists cover_assets (
  id uuid primary key default gen_random_uuid(),
  book_id uuid not null references books(id) on delete cascade,
  source text not null check (
    source in (
      'curated',
      'open_library',
      'google_books',
      'project_gutenberg',
      'local_generated',
      'manual'
    )
  ),
  image_url text,
  storage_path text,
  status text not null default 'candidate'
    check (status in ('primary', 'fallback', 'candidate', 'broken', 'rejected')),
  is_primary boolean not null default false,
  reviewed_at timestamptz,
  notes text,
  created_at timestamptz not null default now(),
  check (image_url is not null or storage_path is not null)
);

create table if not exists store_offers (
  id uuid primary key default gen_random_uuid(),
  book_id uuid not null references books(id) on delete cascade,
  store text not null check (store in ('amazon', 'flipkart', 'bookswagon')),
  affiliate_query text not null,
  outbound_url text,
  product_id text,
  link_type text not null default 'search'
    check (link_type in ('search', 'verified_product')),
  price_amount_inr integer,
  price_last_checked_at timestamptz,
  price_display_allowed boolean not null default false,
  offer_summary text,
  delivery_text text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (book_id, store),
  check (
    link_type = 'search'
    or (link_type = 'verified_product' and product_id is not null and outbound_url is not null)
  ),
  check (price_display_allowed = false or price_amount_inr is not null)
);

create table if not exists search_events (
  id uuid primary key default gen_random_uuid(),
  query text not null,
  normalized_query text not null,
  matched_book_id uuid references books(id) on delete set null,
  matched_confidence text,
  country_code text,
  created_at timestamptz not null default now()
);

create table if not exists enrichment_jobs (
  id uuid primary key default gen_random_uuid(),
  book_id uuid references books(id) on delete cascade,
  source text not null check (source in ('open_library', 'google_books', 'project_gutenberg', 'manual')),
  status text not null default 'queued'
    check (status in ('queued', 'running', 'completed', 'failed', 'skipped')),
  input jsonb not null default '{}'::jsonb,
  result jsonb,
  error_message text,
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

create index if not exists books_category_idx on books(category_slug);
create index if not exists books_title_trgm_idx on books using gin (title gin_trgm_ops);
create index if not exists books_isbn13_idx on books(isbn13) where isbn13 is not null;
create index if not exists books_isbn10_idx on books(isbn10) where isbn10 is not null;
create index if not exists authors_name_trgm_idx on authors using gin (name gin_trgm_ops);
create index if not exists book_tags_tag_idx on book_tags(tag);
create index if not exists book_collections_collection_idx on book_collections(collection_slug, position);
create index if not exists cover_assets_book_status_idx on cover_assets(book_id, status);
create index if not exists external_ids_book_source_idx on external_book_identifiers(book_id, source);
create index if not exists store_offers_store_idx on store_offers(store);
create index if not exists search_events_normalized_query_idx on search_events(normalized_query);
create index if not exists enrichment_jobs_status_idx on enrichment_jobs(status, source, created_at);
