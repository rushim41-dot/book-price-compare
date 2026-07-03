import type { Metadata } from "next";
import { StorefrontHeader } from "@/app/components/StorefrontHeader";

export const metadata: Metadata = {
  title: "Affiliate Disclosure | Books2Buy",
  description:
    "Books2Buy affiliate disclosure for store links, commissions, and verified pricing policy.",
};

export default function AffiliateDisclosurePage() {
  return (
    <main className="trust-page-shell">
      <StorefrontHeader />

      <section className="trust-page-hero">
        <p className="catalog-kicker">Affiliate Disclosure</p>
        <h1>Some store links may earn a commission.</h1>
        <p>
          Books2Buy may participate in affiliate programs, including book retailers and
          marketplace partners. If you buy through an eligible link, we may earn a
          commission at no extra cost to you.
        </p>
      </section>

      <section className="trust-policy-body">
        <h2>Amazon Associate disclosure</h2>
        <p>
          As an Amazon Associate I earn from qualifying purchases.
        </p>
        <p className="trust-muted">
          Amazon Associate links are added only through approved Amazon link formats
          after acceptance into the program.
        </p>

        <h2>Our current link policy</h2>
        <p>
          Store buttons open approved outbound searches or verified product links when
          available. We do not use raw ISBN store links unless an exact edition or product
          has been verified.
        </p>

        <h2>Prices and availability</h2>
        <p>
          Final prices, delivery estimates, discounts, taxes, and availability are set by
          the store and can change at any time. Books2Buy hides prices unless they come
          from a trusted verified source.
        </p>

        <h2>Editorial independence</h2>
        <p>
          Affiliate relationships do not decide canonical book metadata. Author, ISBN,
          publisher, page count, and cover data are used for catalog quality and matching,
          not to force one store over another.
        </p>
      </section>
    </main>
  );
}
