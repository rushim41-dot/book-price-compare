"use client";

import Link from "next/link";
import { FormEvent } from "react";
import { getCatalogCategories, getCatalogCollections } from "@/lib/catalog";

const headerCategories = getCatalogCategories();
const headerCollections = getCatalogCollections();
const headerShelfSlugs = [
  "world-classics",
  "peacock-classics",
  "prize-winners",
  "indian-authors",
];
const headerShelves = headerShelfSlugs
  .map((slug) => headerCollections.find((collection) => collection.slug === slug))
  .filter((collection): collection is NonNullable<(typeof headerCollections)[number]> => Boolean(collection));

type StorefrontHeaderProps = {
  query?: string;
  defaultQuery?: string;
  onQueryChange?: (value: string) => void;
  onSubmit?: (event: FormEvent<HTMLFormElement>) => void;
  searchInputId?: string;
};

export function StorefrontHeader({
  query,
  defaultQuery,
  onQueryChange,
  onSubmit,
  searchInputId = "book-query",
}: StorefrontHeaderProps) {
  const isControlledSearch = typeof query === "string";

  return (
    <header className="storefront-header">
      <div className="storefront-brand-row">
        <Link href="/" className="brand-link">
          <BookOpenIcon />
          <span className="brand-lockup">
            <span className="brand-word">
              Books<span>2</span>Buy
            </span>
            <span className="brand-tagline">Compare. Save. Read more.</span>
          </span>
        </Link>

        <form
          onSubmit={onSubmit}
          action="/search"
          method="get"
          className="storefront-search"
          role="search"
        >
          <SearchIcon />
          <input
            id={searchInputId}
            name="q"
            type="text"
            placeholder="Search by title, author, publisher or ISBN"
            value={isControlledSearch ? query : undefined}
            defaultValue={isControlledSearch ? undefined : defaultQuery}
            onChange={(event) => onQueryChange?.(event.target.value)}
            className="nav-search-input"
          />
          <button type="submit" className="nav-search-button">
            <SearchIcon />
          </button>
        </form>

        <div className="storefront-actions">
          <a href="#account" className="nav-action">
            <UserIcon />
            <span>Account</span>
          </a>
          <a href="#wishlist" className="nav-action">
            <HeartIcon />
            <span>Wishlist</span>
          </a>
          <a href="#cart" className="nav-action">
            <CartIcon />
            <span>Cart</span>
          </a>
        </div>
      </div>

      <nav className="storefront-nav" aria-label="Storefront navigation">
        <Link href="/" className="storefront-home-link" aria-label="Home">
          <HomeIcon />
        </Link>
        {headerShelves.map((collection) => (
          <Link key={collection.slug} href={`/collections/${collection.slug}`} className="storefront-nav-link">
            {collection.label}
          </Link>
        ))}
        {headerCategories.slice(0, 2).map((category) => (
          <Link key={category.slug} href={`/categories/${category.slug}`} className="storefront-nav-link storefront-nav-link-muted">
            {category.label}
          </Link>
        ))}
        <Link href="/contact" className="storefront-nav-link storefront-nav-link-muted">
          Contact
        </Link>
      </nav>
    </header>
  );
}

function BookOpenIcon() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className="brand-icon">
      <path
        d="M5 6.5C5 5.12 6.12 4 7.5 4h5.93c1.53 0 2.98.65 4 1.8A5.52 5.52 0 0 1 21.43 4h3.07C25.88 4 27 5.12 27 6.5V25a2 2 0 0 1-2 2h-3.57a5.7 5.7 0 0 0-4.03 1.67L16 30l-1.4-1.33A5.7 5.7 0 0 0 10.57 27H7a2 2 0 0 1-2-2V6.5Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16 6v22M9.5 9H13M9.5 13H13M19 9h3.5M19 13h3.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="inline-icon">
      <path d="m21 21-4.3-4.3M10.8 18a7.2 7.2 0 1 1 0-14.4 7.2 7.2 0 0 1 0 14.4Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="inline-icon">
      <path d="M20 21a8 8 0 0 0-16 0M12 13a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="inline-icon">
      <path d="M20.8 5.6a5.2 5.2 0 0 0-7.4 0L12 7l-1.4-1.4a5.2 5.2 0 1 0-7.4 7.4L12 21.8l8.8-8.8a5.2 5.2 0 0 0 0-7.4Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="inline-icon">
      <path d="m3 11 9-8 9 8M5 10v10h5v-6h4v6h5V10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="inline-icon">
      <path d="M3 4h2l2.1 10.2A2 2 0 0 0 9 16h8.4a2 2 0 0 0 1.9-1.4L21 8H6M9 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2ZM18 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
