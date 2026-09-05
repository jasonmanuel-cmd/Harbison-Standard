import type { TenantConfig } from "@/tenants/types";

// Builds the JSON-LD @graph for a public page per §7.5: Person + Brand +
// RealEstateAgent + WebSite are the tenant's global identity nodes and
// appear on every page; BreadcrumbList is page-specific; a Service node
// is added only on the funnel page it describes; an FAQPage node is
// added only where FAQ content is actually rendered on that page (JSON-LD
// should mirror visible content, not duplicate it site-wide).

export interface Breadcrumb {
  name: string;
  path: string;
}

export function buildGraph(
  tenant: TenantConfig,
  opts: {
    breadcrumbs: Breadcrumb[];
    service?: { pillar: string; name: string; description: string };
    faq?: boolean;
  },
) {
  const url = (path: string) => new URL(path, tenant.siteUrl).toString();

  const person = {
    "@type": "Person",
    "@id": `${tenant.siteUrl}#person`,
    name: tenant.contact.displayName,
    jobTitle: tenant.contact.roleLine,
    telephone: tenant.contact.phone,
    email: tenant.contact.email,
    url: tenant.siteUrl,
    ...(tenant.social.sameAs.length > 0 ? { sameAs: tenant.social.sameAs } : {}),
  };

  const brand = {
    "@type": "Brand",
    "@id": `${tenant.siteUrl}#brand`,
    name: tenant.name,
    slogan: tenant.copy.tagline,
  };

  const realEstateAgent = {
    "@type": "RealEstateAgent",
    "@id": `${tenant.siteUrl}#agent`,
    name: tenant.name,
    founder: { "@id": `${tenant.siteUrl}#person` },
    telephone: tenant.contact.phone,
    email: tenant.contact.email,
    areaServed: {
      "@type": "AdministrativeArea",
      name: "Kern County, CA",
    },
    url: tenant.siteUrl,
  };

  const website = {
    "@type": "WebSite",
    "@id": `${tenant.siteUrl}#website`,
    name: tenant.name,
    url: tenant.siteUrl,
    publisher: { "@id": `${tenant.siteUrl}#agent` },
  };

  const breadcrumbList = {
    "@type": "BreadcrumbList",
    itemListElement: opts.breadcrumbs.map((crumb, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: crumb.name,
      item: url(crumb.path),
    })),
  };

  const graph: Record<string, unknown>[] = [person, brand, realEstateAgent, website, breadcrumbList];

  if (opts.service) {
    graph.push({
      "@type": "Service",
      serviceType: opts.service.name,
      name: opts.service.name,
      description: opts.service.description,
      provider: { "@id": `${tenant.siteUrl}#agent` },
      areaServed: {
        "@type": "AdministrativeArea",
        name: "Kern County, CA",
      },
    });
  }

  if (opts.faq) {
    graph.push({
      "@type": "FAQPage",
      mainEntity: tenant.faq.map((entry) => ({
        "@type": "Question",
        name: entry.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: entry.answer,
        },
      })),
    });
  }

  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
}
