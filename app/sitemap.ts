import type { MetadataRoute } from "next";
import { getCatalogCategories } from "@/lib/catalog";
import {
  getCatalogBooks,
  getCatalogCollectionsFromSource,
} from "@/lib/catalog-source";
import { getGuides } from "@/lib/guides";

const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://books2buy.org"
).replace(/\/$/, "");

const LAST_MODIFIED = new Date("2026-07-02");

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [catalogBooks, catalogCollections] = await Promise.all([
    getCatalogBooks(),
    getCatalogCollectionsFromSource(),
  ]);

  const staticRoutes = [
    "",
    "/about",
    "/contact",
    "/affiliate-disclosure",
    "/privacy",
    "/terms",
    "/guides",
  ].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: LAST_MODIFIED,
    changeFrequency: "monthly" as const,
    priority: path === "" ? 1 : 0.75,
  }));

  const guideRoutes = getGuides().map((guide) => ({
    url: `${SITE_URL}/guides/${guide.slug}`,
    lastModified: new Date(guide.updatedAt),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const categoryRoutes = getCatalogCategories().map((category) => ({
    url: `${SITE_URL}/categories/${category.slug}`,
    lastModified: LAST_MODIFIED,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const collectionRoutes = catalogCollections.map((collection) => ({
    url: `${SITE_URL}/collections/${collection.slug}`,
    lastModified: LAST_MODIFIED,
    changeFrequency: "weekly" as const,
    priority: 0.75,
  }));

  const bookRoutes = catalogBooks.map((book) => ({
    url: `${SITE_URL}/books/${book.slug}`,
    lastModified: LAST_MODIFIED,
    changeFrequency: "monthly" as const,
    priority: 0.55,
  }));

  return [
    ...staticRoutes,
    ...guideRoutes,
    ...categoryRoutes,
    ...collectionRoutes,
    ...bookRoutes,
  ];
}
