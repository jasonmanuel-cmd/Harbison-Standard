import type { MetadataRoute } from "next";
import { getTenant } from "@/tenants";

// Tenant-driven sitemap of static content pages. Deliberately excludes
// /thank-you (a post-submit utility page, not content) and /v/[slug]
// (personalized, noindex — see app/robots.ts and DECISIONS.md; the
// video-page route itself ships in Phase 3).
export default function sitemap(): MetadataRoute.Sitemap {
  const tenant = getTenant();
  const url = (path: string) => new URL(path, tenant.siteUrl).toString();

  return [
    { url: url("/"), changeFrequency: "weekly", priority: 1 },
    { url: url("/sell"), changeFrequency: "monthly", priority: 0.9 },
    { url: url("/build"), changeFrequency: "monthly", priority: 0.9 },
    { url: url("/land"), changeFrequency: "monthly", priority: 0.9 },
    { url: url("/press"), changeFrequency: "monthly", priority: 0.6 },
    { url: url("/faq"), changeFrequency: "monthly", priority: 0.7 },
    { url: url("/privacy"), changeFrequency: "yearly", priority: 0.1 },
    { url: url("/terms"), changeFrequency: "yearly", priority: 0.1 },
  ];
}
