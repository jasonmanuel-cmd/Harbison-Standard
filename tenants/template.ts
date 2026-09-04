import type { TenantConfig } from "./types";

// Template tenant — demonstrates white-label architecture and tenant isolation.
// Every field is populated with placeholder copy; customize for your own
// agent. Proves zero Harbison strings leak through when a different tenant
// is loaded via NEXT_PUBLIC_TENANT=template.
export const template: TenantConfig = {
  slug: "template",
  name: "Template Operator",
  domains: [
    // No domain purchased yet. Populated once the operator buys one; until
    // then middleware falls back to NEXT_PUBLIC_TENANT. See DECISIONS.md.
  ],
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://example-template.placeholder",

  brand: {
    logoPath: "/brand/logo.png",
    // No real logo exists for this template — text wordmark renders.
    // TODO(operator): drop the real transparent PNG at public/brand/logo.png
    // and flip this to true.
    hasRealLogo: false,
  },

  contact: {
    displayName: "Alex Sample",
    roleLine: "Real Estate Professional — Your Service Area, State",
    phone: "(555) 123-4567",
    phoneHref: "tel:+15551234567",
    email: "alex@example.com",
    licenseLine: "State License #XXXXXXX",
    complianceFooter:
      "State License #XXXXXXX · Your Service Area · Equal Housing Opportunity",
  },

  social: {
    // Add confirmed profile URLs once they exist. Empty strings are omitted
    // from JSON-LD sameAs — don't fabricate placeholder URLs.
    sameAs: [],
  },

  nav: [
    { label: "Sell", href: "/sell" },
    { label: "Buy", href: "/buy" },
    { label: "Build", href: "/build" },
    { label: "Press", href: "/press" },
    { label: "FAQ", href: "/faq" },
  ],

  copy: {
    positioningLine: "Real Estate Authority — Your Unique Approach",
    tagline: "Your tagline here.",
    heroTag: "Your hero tag",
    heroHeadline: "Your hero headline.",
    heroHeadlineHighlight: "your key phrase.",
    heroSubcopy:
      "One person, start to finish. Describe your approach, experience, and service areas in 2-3 sentences.",
    heroPrimaryCta: "GET A NUMBER ON YOUR PROPERTY",
    heroSecondaryCta: "EXPLORE AVAILABLE PROPERTIES",
    proofStats: [
      { value: "10+", label: "Years in business" },
      { value: "[STAT]", label: "Properties sold" },
      { value: "[STAT]", label: "Homes built" },
      { value: "[STAT]", label: "Satisfied clients" },
    ],
    services: [
      {
        pillar: "flip",
        title: "Sell",
        description:
          "Describe your cash-offer or quick-sale process for sellers who need speed or simplicity.",
        href: "/sell",
      },
      {
        pillar: "build",
        title: "Buy or Build",
        description:
          "Describe your construction, development, or buyer-representation services.",
        href: "/build",
      },
      {
        pillar: "invest",
        title: "Invest",
        description:
          "Describe your investment analysis, land evaluation, or other value-add services.",
        href: "/invest",
      },
    ],

    aboutHeading: "Who you're working with",
    aboutBody:
      "1-2 paragraphs about yourself: your background, your philosophy, what makes your approach unique, and why clients should choose you over other agents in your market.",
    aboutPhotoPath: "/brand/headshot.webp",

    signupHeading: "Get on my radar",
    signupSubcopy:
      "Tell me what you're working with and where you're headed — and I'll route it straight to the right conversation. No obligation, no mass mailing list you have to unsubscribe from later.",

    portfolioHeading: "Recent closings",
    portfolioIntro: "A sample of recent transactions — sold, built, or brokered.",
    soldProperties: [
      {
        id: "sample-property-1",
        address: "123 Main St",
        cityStateZip: "Your City, State 12345",
        soldPrice: "$500,000",
        specs: "3 bd · 2 ba · 1,800 sqft",
        description:
          "Describe the property type, condition, and your role (sold outright, built, brokered, etc).",
        photos: ["/portfolio/sample-property-1/1.jpg"],
      },
    ],
  },

  faq: [
    {
      id: "faq-1",
      question: "What is your most common client question?",
      answer: "Answer it thoroughly and honestly. This is where you build trust.",
    },
    {
      id: "faq-2",
      question: "What misconception do you frequently correct?",
      answer:
        "Use this space to address common myths or misunderstandings in your market.",
    },
    {
      id: "faq-3",
      question: "What should clients know before [key transaction type]?",
      answer: "Walk through your process step-by-step so they know what to expect.",
      verifyWithCounsel: false, // Set to true if you need a legal disclaimer
    },
    {
      id: "faq-4",
      question: "How do you stand out from other agents in your area?",
      answer:
        "Be specific. What is your biggest value-add? Years of experience? Local knowledge? Unique services?",
    },
  ],

  scoring: {
    // Same baseline as Harbison; tune these weights based on what matters
    // most for your market (adjust in Supabase, no code change needed).
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
