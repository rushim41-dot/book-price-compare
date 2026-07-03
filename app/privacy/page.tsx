import type { Metadata } from "next";
import { StorefrontHeader } from "@/app/components/StorefrontHeader";

export const metadata: Metadata = {
  title: "Privacy Policy | Books2Buy",
  description:
    "Books2Buy privacy policy covering search data, local analytics, affiliate links, and future account features.",
};

export default function PrivacyPage() {
  return (
    <main className="trust-page-shell">
      <StorefrontHeader />

      <section className="trust-page-hero">
        <p className="catalog-kicker">Privacy Policy</p>
        <h1>We collect only what helps the product work.</h1>
        <p>Last updated: June 26, 2026</p>
      </section>

      <section className="trust-policy-body">
        <h2>Information we use now</h2>
        <p>
          Books2Buy may store search terms and matched book summaries to improve catalog
          quality, popular searches, and browse recommendations. We do not currently offer
          user accounts, wishlists, or payment processing.
        </p>

        <h2>Outbound store links</h2>
        <p>
          When you click a store link, you leave Books2Buy and visit that store. The
          store may collect information according to its own privacy policy.
        </p>

        <h2>Future features</h2>
        <p>
          If we add accounts, saved books, or verified exact product links, this policy
          should be updated before those features go live.
        </p>

        <h2>Contact</h2>
        <p>
          For privacy questions, catalog corrections, or support requests, email
          support@books2buy.org.
        </p>
      </section>
    </main>
  );
}
