import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { StorefrontHeader } from "@/app/components/StorefrontHeader";
import { getGuideBySlug, getGuides } from "@/lib/guides";

type GuidePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  return getGuides().map((guide) => ({
    slug: guide.slug,
  }));
}

export async function generateMetadata(
  props: GuidePageProps
): Promise<Metadata> {
  const { slug } = await props.params;
  const guide = getGuideBySlug(slug);

  if (!guide) {
    return {
      title: "Guide Not Found | Books2Buy",
    };
  }

  return {
    title: `${guide.title} | Books2Buy`,
    description: guide.description,
  };
}

export default async function GuidePage(props: GuidePageProps) {
  const { slug } = await props.params;
  const guide = getGuideBySlug(slug);

  if (!guide) {
    notFound();
  }

  return (
    <main className="trust-page-shell">
      <StorefrontHeader />

      <section className="trust-page-hero">
        <div className="catalog-breadcrumbs">
          <Link href="/">Home</Link>
          <span>/</span>
          <Link href="/guides">Guides</Link>
          <span>/</span>
          <strong>{guide.title}</strong>
        </div>
        <p className="catalog-kicker">{guide.category}</p>
        <h1>{guide.title}</h1>
        <p>{guide.description}</p>
        <p className="guide-reading-meta">{guide.readingTime} - Updated {guide.updatedAt}</p>
      </section>

      <article className="trust-policy-body guide-article">
        {guide.sections.map((section) => (
          <section key={section.heading}>
            <h2>{section.heading}</h2>
            <p>{section.body}</p>
          </section>
        ))}
      </article>

      <section className="trust-page-note">
        <h2>Continue browsing</h2>
        <div className="guide-related-links">
          {guide.relatedLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
