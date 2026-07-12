import Link from "next/link";
import { getCatalogCategories, getCatalogCollections } from "@/lib/catalog";

const footerCollections = getCatalogCollections().filter((collection) =>
  ["investing", "world-classics", "peacock-classics", "prize-winners", "indian-authors"].includes(collection.slug)
);

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <section className="footer-brand-block">
          <Link href="/" className="footer-brand">
            Books<span>2</span>Buy
          </Link>
          <p>
            Books2Buy helps readers compare safe book-buying links across trusted stores.
            Prices stay hidden until exact product sources are verified.
          </p>
        </section>

        <nav className="footer-link-group" aria-label="Browse Books2Buy">
          <h2>Browse</h2>
          <Link href="/guides">Book Buying Guides</Link>
          {getCatalogCategories().slice(0, 4).map((category) => (
            <Link key={category.slug} href={`/categories/${category.slug}`}>
              {category.label}
            </Link>
          ))}
        </nav>

        <nav className="footer-link-group" aria-label="Book collections">
          <h2>Collections</h2>
          {footerCollections.map((collection) => (
            <Link key={collection.slug} href={`/collections/${collection.slug}`}>
              {collection.label}
            </Link>
          ))}
        </nav>

        <nav className="footer-link-group" aria-label="Company and legal">
          <h2>Company</h2>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/affiliate-disclosure">Affiliate Disclosure</Link>
          <Link href="/privacy">Privacy Policy</Link>
          <Link href="/terms">Terms</Link>
        </nav>
      </div>

      <div className="site-footer-bottom">
        <span>Copyright 2026 Books2Buy.</span>
        <span>Store availability, delivery, and final prices are checked on the store website.</span>
      </div>
    </footer>
  );
}
