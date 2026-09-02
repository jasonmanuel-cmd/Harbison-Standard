// Shared shape every tenant config must satisfy. This is the contract that
// keeps the white-label layer honest: components read from a TenantConfig,
// never from hardcoded brand strings. See §6 of the project spec and
// scripts/make-tenant.mjs, which scaffolds new tenants against this type.

export type Pillar = "build" | "update" | "invest" | "flip";

export interface NavLink {
  label: string;
  href: string;
}

export interface FaqEntry {
  /** Stable id, used as the anchor + JSON-LD identifier. */
  id: string;
  question: string;
  /** 40-80 words, self-contained, citable, fair-housing-clean. */
  answer: string;
  /** Set true when the answer needs a legal-review pass before launch. */
  verifyWithCounsel?: boolean;
}

export interface ServiceCard {
  pillar: Pillar;
  title: string;
  description: string;
  href: string;
}

export interface ProofStat {
  value: string;
  label: string;
}

export interface TenantContact {
  displayName: string;
  roleLine: string;
  phone: string;
  phoneHref: string;
  email: string;
  licenseLine: string;
  complianceFooter: string;
}

export interface TenantCopy {
  positioningLine: string;
  tagline: string;
  heroTag: string;
  heroHeadline: string;
  /** Substring of heroHeadline to render in brass. */
  heroHeadlineHighlight: string;
  heroSubcopy: string;
  heroPrimaryCta: string;
  heroSecondaryCta: string;
  proofStats: ProofStat[];
  services: ServiceCard[];
}

export interface TenantConfig {
  /** Row key in the `tenants` table (§5). */
  slug: string;
  name: string;
  /** Hostnames that resolve to this tenant in middleware.ts. */
  domains: string[];
  /** Falls back to a placeholder until a domain is purchased. */
  siteUrl: string;
  brand: {
    logoPath: string;
    /** True once a real transparent logo.png has been dropped in. */
    hasRealLogo: boolean;
  };
  contact: TenantContact;
  social: {
    /** sameAs URLs for JSON-LD; placeholders until profiles are confirmed. */
    sameAs: string[];
  };
  nav: NavLink[];
  copy: TenantCopy;
  faq: FaqEntry[];
  /** Tunable scoring weights consumed by fn_score_lead() (§5), mirrored
   *  here so the CRM can eventually read/edit them from one place. */
  scoring: {
    situationHigh: number; // sell-probate | sell-inherited | sell-nod
    situationMid: number; // land | sell-landlord
    situationPillar: number; // build | invest
    timelineAsap: number;
    timelineSoon: number; // 1-3months
    hasPhone: number;
    engagedFormSeconds: number;
    minFormSeconds: number; // below this -> forced 0 + flagged_spam
  };
}
