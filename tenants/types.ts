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
  /**
   * Initial scoring weights (§5). The live source of truth at request
   * time is the `config->'scoring'` jsonb on this tenant's row in the
   * `tenants` table — `fn_score_lead()` reads it there on every insert,
   * so weights are tunable from the CRM later without a new migration.
   * This object is only the seed value written into that column when the
   * tenant row is created (see supabase/seed.sql); editing it here after
   * that has no runtime effect until the DB row is updated too.
   */
  scoring: {
    situationHigh: number; // sell-probate | sell-inherited | sell-nod
    situationMid: number; // land | sell-landlord
    situationPillar: number; // build | invest
    timelineAsap: number;
    timelineSoon: number; // 1-3months
    hasPhone: number;
    engagementThresholdSeconds: number; // form must stay open >= this long...
    engagementBonus: number; // ...to earn this many points
    minFormSeconds: number; // below this -> forced 0 + flagged_spam
  };
}
