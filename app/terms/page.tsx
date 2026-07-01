import type { Metadata } from "next";
import { StorefrontHeader } from "@/app/components/StorefrontHeader";

export const metadata: Metadata = {
  title: "Terms of Use | Books2Buy",
  description:
    "Books2Buy terms covering catalog information, outbound store links, prices, and user responsibilities.",
};

export default function TermsPage() {
  return (
    <main className="trust-page-shell">
      <StorefrontHeader />

      <section className="trust-page-hero">
        <p className="catalog-kicker">Terms of Use</p>
        <h1>Use Books2Buy as a discovery and comparison aid.</h1>
        <p>Last updated: June 26, 2026</p>
      </section>

      <section className="trust-policy-body">
        <h2>Catalog information</h2>
        <p>
          We work to keep book metadata accurate, but catalog details can contain errors
          or edition differences. Always confirm the final product details on the store
          website before buying.
        </p>

        <h2>Store links</h2>
        <p>
          Books2Buy links to third-party stores. Purchases, delivery, returns, refunds,
          taxes, and support are handled by the store you choose.
        </p>

        <h2>Prices</h2>
        <p>
          We do not guarantee price, availability, delivery time, or offers. Prices appear
          only when we have a trusted source, and final checkout details belong to the
          store.
        </p>

        <h2>Responsible use</h2>
        <p>
          Do not misuse Books2Buy, attempt to scrape protected store pages through the
          service, or rely on unverified metadata as the only source for a purchase.
        </p>
      </section>
    </main>
  );
}
