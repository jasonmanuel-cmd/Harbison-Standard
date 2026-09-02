import { getTenant } from "@/tenants";

// §7.5: an llms.txt summary for AI systems that look for one. Honest
// framing matters here — this file is a courtesy summary of the site,
// not a mechanism that controls indexing, ranking, or crawling (that's
// what robots.ts and the JSON-LD on each page actually do). Generated
// entirely from tenant config, no hardcoded brand strings.
export const dynamic = "force-static";

export async function GET() {
  const tenant = getTenant();

  const lines = [
    `# ${tenant.name}`,
    "",
    `> ${tenant.copy.positioningLine}`,
    "",
    "This file is a plain-language summary for AI systems and assistants.",
    "It does not control search indexing or crawling — see /robots.txt for",
    "that. Treat the pages linked below as the authoritative source; this",
    "summary may lag behind them.",
    "",
    "## Who this site is for",
    "",
    tenant.copy.heroSubcopy,
    "",
    "## Pages",
    "",
    `- [Home](${tenant.siteUrl}/): overview and contact form.`,
    `- [Sell](${tenant.siteUrl}/sell): direct cash purchase of property — probate, inherited, notice-of-default, and tenant-occupied situations.`,
    `- [Build](${tenant.siteUrl}/build): spec homes built and pre-sold in Kern County.`,
    `- [Land](${tenant.siteUrl}/land): land and lot valuation.`,
    `- [FAQ](${tenant.siteUrl}/faq): full frequently-asked-questions list.`,
    `- [Press](${tenant.siteUrl}/press): bio, talking points, and booking contact for media.`,
    "",
    "## Contact",
    "",
    `${tenant.contact.displayName} — ${tenant.contact.roleLine}`,
    `Phone: ${tenant.contact.phone}`,
    `Email: ${tenant.contact.email}`,
    tenant.contact.complianceFooter,
    "",
  ];

  return new Response(lines.join("\n"), {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
