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

    aboutHeading: "Who you're working with",
    aboutBody:
      "I'm a realtor, developer, and investor — not three different people you get passed between. When you call, you get me: the same person who negotiates the sale also walks the framing, pulls the comps, and signs the closing paperwork. I've spent over a decade doing all four in Kern County, and I bring the same direct approach to every property, whether it's a family home, a spec build, or a raw parcel someone inherited and doesn't know what to do with.",
    aboutPhotoPath: "/brand/headshot.webp",

    signupHeading: "Get on my radar",
    signupSubcopy:
      "Tell me what you're working with and where you're headed — selling, building, or evaluating land — and I'll route it straight to the right conversation. No obligation, no mass mailing list you have to unsubscribe from later.",

    portfolioHeading: "Recent closings",
    portfolioIntro:
      "A sample of properties closed — sold outright, built, or brokered — with the actual address and numbers.",
    soldProperties: [
      {
        id: "windsong-st",
        address: "21213 Windsong St",
        cityStateZip: "California City, CA 93505",
        soldPrice: "$305,000",
        specs: "3 bd · 3 ba · 1,591 sqft",
        description:
          "Two-story home overlooking the golf course, with an open kitchen and dining layout and a covered patio for outdoor living.",
        photos: ["/portfolio/windsong-st/1.jpg"],
      },
      {
        id: "sheridan-st",
        address: "10618 Sheridan St",
        cityStateZip: "California City, CA 93505",
        soldPrice: "$345,000",
        specs: "4 bd · 2 ba · 1,705 sqft",
        description:
          "New construction with acrylic stucco, waterproof vinyl plank flooring, quartz countertops, and an owned 3kW solar system.",
        photos: [
          "/portfolio/sheridan-st/1.jpg",
          "/portfolio/sheridan-st/2.jpg",
          "/portfolio/sheridan-st/3.jpg",
          "/portfolio/sheridan-st/4.jpg",
          "/portfolio/sheridan-st/5.jpg",
        ],
      },
      {
        id: "mendiburu-rd",
        address: "9664 Mendiburu Rd",
        cityStateZip: "California City, CA 93505",
        soldPrice: "$359,000",
        specs: "4 bd · 2 ba · 2,246 sqft",
        description:
          "Full remodel on city sewer with a 3-car garage, new luxury vinyl plank flooring, and a completely updated kitchen.",
        photos: ["/portfolio/mendiburu-rd/1.jpg"],
      },
      {
        id: "alsab-pl",
        address: "17400 Alsab Pl",
        cityStateZip: "Stallion Springs, CA 93561",
        soldPrice: "$390,000",
        specs: "3 bd · 2 ba · 1,507 sqft",
        description:
          "Freshly built mountain home in Stallion Springs with RV parking, an insulated garage, and built-in fire suppression.",
        photos: ["/portfolio/alsab-pl/1.jpg"],
      },
      {
        id: "crestline-dr",
        address: "2574 Crestline Dr",
        cityStateZip: "Lemon Grove, CA 91945",
        soldPrice: "$720,000",
        specs: "3 bd · 2 ba · 1,310 sqft",
        description:
          "Mid-century Lemon Grove home with original hardwood floors, a brick fireplace, and a bonus sunroom.",
        photos: [
          "/portfolio/crestline-dr/1.webp",
          "/portfolio/crestline-dr/2.webp",
          "/portfolio/crestline-dr/3.webp",
          "/portfolio/crestline-dr/4.webp",
          "/portfolio/crestline-dr/5.webp",
        ],
      },
      {
        id: "woodshawn-dr",
        address: "7318 Woodshawn Dr",
        cityStateZip: "San Diego, CA 92114",
        soldPrice: "$785,000",
        specs: "3 bd · 2 ba · 1,320 sqft",
        description:
          "Fully remodeled Encanto home with an open kitchen-to-living layout and a 360-square-foot covered back patio.",
        photos: [
          "/portfolio/woodshawn-dr/1.webp",
          "/portfolio/woodshawn-dr/2.webp",
          "/portfolio/woodshawn-dr/3.webp",
          "/portfolio/woodshawn-dr/4.webp",
          "/portfolio/woodshawn-dr/5.webp",
        ],
      },
      {
        id: "pellisier-rd",
        address: "18024 Pellisier Rd",
        cityStateZip: "Tehachapi, CA 93561",
        soldPrice: "$980,000",
        specs: "4 bd · 3 ba · 2,805 sqft · 20 acres",
        description:
          "20-acre Cummings Valley ranch with a 40x60 barn, a private well, and vaulted cedar ceilings across an open-concept main house.",
        photos: [
          "/portfolio/pellisier-rd/1.webp",
          "/portfolio/pellisier-rd/2.webp",
          "/portfolio/pellisier-rd/3.webp",
          "/portfolio/pellisier-rd/4.webp",
          "/portfolio/pellisier-rd/5.webp",
        ],
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
        "Yes. California probate law allows a personal representative with full authority under the Independent Administration of Estates Act to sell real property without court confirmation in most cases. Court confirmation is still required in some situations. An estate attorney should confirm the specific authority granted in your case.",
      verifyWithCounsel: true,
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
        "New homes built in California are generally covered under SB 800, the state's Right to Repair statute, which sets structural, plumbing, electrical, and other component standards and a pre-litigation repair process for construction defect claims. Warranty periods vary by component. A licensed contractor or attorney should confirm coverage details for a specific build.",
      verifyWithCounsel: true,
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
