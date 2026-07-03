import type { Metadata } from "next";
import Link from "next/link";
import { StorefrontHeader } from "@/app/components/StorefrontHeader";

export const metadata: Metadata = {
  title: "About Books2Buy | Safe Book Price Comparison",
  description:
    "Learn how Books2Buy helps readers compare safe book-buying links while avoiding fake prices and unverified editions.",
};

export default function AboutPage() {
  return (
    <main className="trust-page-shell">
      <StorefrontHeader />

      <section className="trust-page-hero">
        <p className="catalog-kicker">About Books2Buy</p>
        <h1>Book discovery first. Verified buying links next.</h1>
        <p>
          Books2Buy is being built for readers in India who want a calmer way to
          find books, compare trusted stores, and avoid confusing edition matches.
        </p>
      </section>

      <section className="trust-content-grid">
        <article className="trust-content-card">
          <h2>What we do</h2>
          <p>
            We maintain a curated catalog of popular books, classics, Indian authors,
            and publisher-backed seed lists. Our store buttons currently open safe
            outbound searches on Amazon, Flipkart, and Bookswagon.
          </p>
        </article>

        <article className="trust-content-card">
          <h2>What we do not do</h2>
          <p>
            We do not show fake prices, fake discounts, or unverified product pages.
            Public book APIs and publisher catalogues may help us enrich metadata, but
            they do not override our curated canonical catalog records.
          </p>
        </article>

        <article className="trust-content-card">
          <h2>How we choose books</h2>
          <p>
            We prioritize reader intent, recognisable base editions, and clean metadata.
            Variant editions like summaries, workbooks, large print editions, boxed
            sets, or special editions are kept separate unless the reader clearly asks
            for them.
          </p>
        </article>
      </section>

      <section className="trust-page-note">
        <h2>Where we are headed</h2>
        <p>
          The next stage is affiliate approval, original buying guides, and verified
          exact product matching for safer outbound links. Until then, store links
          stay safe and prices remain hidden.
        </p>
        <Link href="/affiliate-disclosure" className="trust-page-link">
          Read our affiliate disclosure
        </Link>
      </section>
    </main>
  );
}
