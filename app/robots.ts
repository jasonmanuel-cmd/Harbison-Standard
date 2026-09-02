import type { MetadataRoute } from "next";
import { getTenant } from "@/tenants";

// §7.5: explicitly welcome AI crawlers (rather than relying on a bare
// `*` allow, which some of these agents don't treat as an affirmative
// invitation), and keep CRM/API/personalized-video routes out of every
// crawler's way.
const AI_USER_AGENTS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "anthropic-ai",
  "PerplexityBot",
  "Google-Extended",
  "Applebot-Extended",
  "Amazonbot",
  "CCBot",
];

const DISALLOW = ["/v/", "/dashboard", "/leads/", "/settings", "/login", "/api", "/dev/"];

export default function robots(): MetadataRoute.Robots {
  const tenant = getTenant();

  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: DISALLOW },
      ...AI_USER_AGENTS.map((userAgent) => ({
        userAgent,
        allow: "/",
        disallow: DISALLOW,
      })),
    ],
    sitemap: `${tenant.siteUrl}/sitemap.xml`,
  };
}
