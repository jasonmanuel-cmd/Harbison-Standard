import "server-only";
import type { Metadata } from "next";
import { getTenant } from "@/tenants";

/**
 * Shared per-page metadata builder. Root layout.tsx sets the site-wide
 * defaults (title/description for "/"); every other public page calls
 * this with its own real title/description instead of inheriting the
 * home page's — Next.js does not do this automatically, and shipping one
 * title across 8 pages is a real SEO gap, not a style choice. Canonical
 * and OG/Twitter both read tenant.siteUrl, so they're correct the moment
 * NEXT_PUBLIC_SITE_URL is set to a real domain — no per-page hardcoding.
 */
export function buildMetadata({
  title,
  description,
  path,
}: {
  /** Page-specific title. The tenant name is appended automatically. */
  title: string;
  description: string;
  /** Leading-slash path, e.g. "/sell". */
  path: string;
}): Metadata {
  const tenant = getTenant();
  const url = new URL(path, tenant.siteUrl).toString();
  const fullTitle = `${title} | ${tenant.name}`;

  return {
    title: fullTitle,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: tenant.name,
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
    },
  };
}
