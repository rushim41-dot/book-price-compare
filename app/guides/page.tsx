import type { Metadata } from "next";
import Link from "next/link";
import { StorefrontHeader } from "@/app/components/StorefrontHeader";
import { getGuides } from "@/lib/guides";

export const metadata: Metadata = {
  title: "Book Buying Guides | Books2Buy",
  description:
    "Read Books2Buy guides for safer book comparison, classics, Indian authors, categories, and verified price policy.",
};

export default function GuidesPage() {
  const guides = getGuides();

  return (
    <main className="trust-page-shell">
      <StorefrontHeader />

      <section className="trust-page-hero">
        <p className="catalog-kicker">Book Buying Guides</p>
        <h1>Useful reading paths before you compare stores.</h1>
        <p>
          Clear guides for choosing editions, browsing categories, avoiding mismatches,
          and understanding how Books2Buy keeps price comparison careful.
        </p>
      </section>

      <section className="guide-grid" aria-label="Books2Buy guides">
        {guides.map((guide) => (
          <Link key={guide.slug} href={`/guides/${guide.slug}`} className="guide-card">
            <span>{guide.category}</span>
            <h2>{guide.title}</h2>
            <p>{guide.description}</p>
            <small>{guide.readingTime}</small>
          </Link>
        ))}
      </section>
    </main>
  );
}
