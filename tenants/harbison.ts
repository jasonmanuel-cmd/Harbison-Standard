import type { TenantConfig } from "./types";

// THE HARBISON STANDARD — tenant #1. Every public page, email template,
// JSON-LD block, and OG image reads from this file. Do not hardcode any
// brand string, phone number, or license line in a component — import it
// from here (or from middleware's resolved tenant, once multi-tenant
// resolution lands in Phase 4).
export const harbison: TenantConfig = {
  slug: "harbison",
  name: "The Harbison Standard",
  domains: [
    // No domain purchased yet. Populated once the client buys one; until
    // then middleware falls back to NEXT_PUBLIC_TENANT. See DECISIONS.md.
  ],
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://example-harbison-standard.placeholder",

  brand: {
    logoPath: "/brand/logo.png",
    // No real logo.png was available to place in the repo at scaffold
    // time — only an inline chat preview, not a retrievable file. A text
    // wordmark placeholder renders until the real asset is dropped in.
    // TODO(operator): drop the real transparent PNG at public/brand/logo.png
    // and flip this to true.
    hasRealLogo: false,
  },

  contact: {
    displayName: "Nathaniel Harvison",
    roleLine: "Realtor · Developer · Investor — All Around Kern County, CA",
    phone: "(661) 472-7499",
    phoneHref: "tel:+16614727499",
    email: "nate85.realtor@gmail.com",
    licenseLine: "CA DRE #02059393",
    complianceFooter:
      "CA DRE #02059393 · All Around Kern County, CA · Equal Housing Opportunity",
  },

  social: {
    // Placeholders — no confirmed profile URLs yet. Replace before launch;
    // JSON-LD sameAs will simply omit empty strings.
    sameAs: [],
  },

  nav: [
    { label: "Sell", href: "/sell" },
    { label: "Build", href: "/build" },
    { label: "Land", href: "/land" },
    { label: "Press", href: "/press" },
    { label: "FAQ", href: "/faq" },
  ],

  copy: {
    positioningLine: "Real Estate Authority — From the Ground Up",
    tagline: "It's Not What You Do, It's How You DO IT!",
    heroTag: "Standards you can stand on",
    heroHeadline: "Real estate authority, from the ground up.",
    heroHeadlineHighlight: "from the ground up.",
    heroSubcopy:
      "One person, start to finish: Realtor, developer, investor. List it, buy it outright, build on it, or walk the lot with you and tell you what it's really worth — because I've done all four for over a decade in Kern County.",
    heroPrimaryCta: "GET A NUMBER ON YOUR PROPERTY",
    heroSecondaryCta: "SEE HOMES BEING BUILT",
    proofStats: [
      { value: "10+", label: "Years in Kern County" },
      { value: "[STAT]", label: "Homes closed" },
      { value: "[STAT]", label: "Spec homes built" },
      { value: "[STAT]", label: "Acres evaluated" },
    ],
    services: [
      {
        pillar: "flip",
        title: "Sell",
        description:
          "Probate, inherited, notice-of-default, or a tired-landlord situation. A direct cash number on your property, no listing required.",
        href: "/sell",
      },
      {
        pillar: "build",
        title: "Build",
        description:
          "Spec homes built and pre-sold in Kern County. See what's under construction and what's available before it's listed.",
        href: "/build",
      },
      {
        pillar: "invest",
        title: "Land",
        description:
          "Own a lot or parcel? Get a straight read on what it's worth and what it would take to build on it.",
        href: "/land",
      },
    ],
  },

  faq: [
    {
      id: "cash-buyer-in-bakersfield",
      question: "How does a cash sale work in Bakersfield?",
      answer:
        "A cash sale skips the listing, showings, and financing contingencies of a traditional sale. The property is evaluated against recent comparable sales and its condition, a written offer is made, and closing is typically scheduled through a local title company in as little as two to three weeks. There's no obligation to accept the offer.",
    },
    {
      id: "probate-sale-in-ca",
      question: "Can I sell a property that's in probate in California?",
      answer:
        "Yes. California probate law allows a personal representative with full authority under the Independent Administration of Estates Act to sell real property without court confirmation in most cases. Court confirmation is still required in some situations. An estate attorney should confirm the specific authority granted in your case. [mark: verify with counsel]",
    },
    {
      id: "investor-vs-listing-costs",
      question: "What's the real cost difference between a cash offer and listing?",
      answer:
        "A traditional listing typically carries commissions, staging, repair credits, and 30-60+ days of carrying costs (mortgage, taxes, insurance, utilities) before closing. A cash offer is lower than retail value but has no commission, no repair requests, and a closing timeline measured in weeks. Compare net proceeds, not just the offer number.",
    },
    {
      id: "ca-new-build-sb800-warranty",
      question: "What warranty applies to a new spec home built in California?",
      answer:
        "New homes built in California are generally covered under SB 800, the state's Right to Repair statute, which sets structural, plumbing, electrical, and other component standards and a pre-litigation repair process for construction defect claims. Warranty periods vary by component. A licensed contractor or attorney should confirm coverage details for a specific build. [mark: verify with counsel]",
    },
  ],

  scoring: {
    situationHigh: 40,
    situationMid: 25,
    situationPillar: 20,
    timelineAsap: 30,
    timelineSoon: 15,
    hasPhone: 10,
    engagementThresholdSeconds: 8,
    engagementBonus: 10,
    minFormSeconds: 3,
  },
};
