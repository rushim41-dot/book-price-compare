import type { Metadata } from "next";
import { SiteFooter } from "@/app/components/SiteFooter";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://books2buy.org",
  ),
  title: "Books2Buy | Compare Book Prices Across Amazon, Flipkart, and Bookswagon",
  description:
    "Books2Buy helps readers in India compare book buying links across Amazon, Flipkart, and Bookswagon with clean search results and launch-ready guidance.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="antialiased" data-scroll-behavior="smooth">
      <body>
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
