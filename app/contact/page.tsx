import type { Metadata } from "next";
import { StorefrontHeader } from "@/app/components/StorefrontHeader";

export const metadata: Metadata = {
  title: "Contact Books2Buy",
  description:
    "Contact Books2Buy for catalog corrections, partnership questions, and feedback about safe book comparison.",
};

export default function ContactPage() {
  return (
    <main className="trust-page-shell">
      <StorefrontHeader />

      <section className="trust-page-hero">
        <p className="catalog-kicker">Contact</p>
        <h1>Help us keep the catalog clean.</h1>
        <p>
          Send feedback about incorrect book metadata, duplicate editions, store-link
          issues, or partnership questions.
        </p>
      </section>

      <section className="trust-content-grid trust-content-grid-two">
        <article className="trust-content-card">
          <h2>Catalog corrections</h2>
          <p>
            If a title, author, ISBN, cover, publisher, or edition looks wrong, include
            the book title and the correction source so we can review it carefully.
          </p>
        </article>

        <article className="trust-content-card">
          <h2>Business and affiliate contact</h2>
          <p>
            Email support@books2buy.org for Amazon Associates, Bookswagon,
            publisher, partnership, and reader inquiries.
          </p>
          <p className="trust-muted">
            We review catalog corrections and partnership messages carefully so
            Books2Buy stays useful, accurate, and safe for readers.
          </p>
        </article>
      </section>
    </main>
  );
}
