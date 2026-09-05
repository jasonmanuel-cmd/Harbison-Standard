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
    displayName: "Nathaniel Harbison",
    roleLine: "Wholesale Acquisition · Institutional Capital",
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
    { label: "Sell Property", href: "/offer" },
    { label: "Invest", href: "/invest" },
    { label: "Communities", href: "/communities" },
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
    {
      id: "what-is-nod",
      question: "What is a Notice of Default and how does it work?",
      answer:
        "A Notice of Default (NOD) is a legal notice that a borrower has fallen behind on mortgage payments. It's the first step in the foreclosure process, typically issued after 3-4 months of missed payments. Once issued, the owner usually has 4-5 months to cure the default before the lender can foreclose. A cash offer can resolve the situation quickly and preserve equity.",
    },
    {
      id: "inherited-property-costs",
      question: "What does it cost to sell an inherited property?",
      answer:
        "Costs vary by sale type. A traditional listing costs 5-6% in commissions plus 1-2% in closing costs. A cash offer typically has no commission and lower closing costs (0.5-1%), with savings offset by a lower offer price. Estate taxes and probate costs depend on California law and the property value. Consulting an accountant and estate attorney is essential.",
    },
    {
      id: "how-long-spec-home",
      question: "How long does it take to build a spec home?",
      answer:
        "Timeline varies by complexity. A single-story residential build typically takes 8-12 months from foundation to turnkey. Multi-story or complex designs can take 12-18 months. Delays happen due to weather, permit delays, material shortages, and inspection schedules. A well-managed project with experienced subcontractors minimizes delays.",
    },
    {
      id: "how-much-lot-cost",
      question: "How much does a raw lot cost in Kern County?",
      answer:
        "Lot prices vary dramatically by location and zoning. In California City, expect $40k-$100k per lot. In Bakersfield's premium areas, $200k-$400k+. In Tehachapi, $150k-$500k depending on views and acreage. Prices reflect location, utilities available, zoning (residential vs commercial), and market demand. A site analysis is free—reach out to discuss your specific location.",
    },
    {
      id: "why-buy-cash",
      question: "Why would someone choose a cash offer over a traditional listing?",
      answer:
        "Speed (weeks vs months), certainty (no financing contingencies), simplicity (no showings, repairs, or buyer drama), and urgency situations (estate sales, foreclosure, relocation, tenant problems). The trade-off: a cash offer is typically 15-25% below retail value because it reflects the buyer's risk and cost of capital.",
    },
    {
      id: "tenant-issues-sale",
      question: "Can I sell a property with problem tenants still living in it?",
      answer:
        "Yes, but it complicates the sale. Tenant-occupied properties (especially with lease agreements) typically sell for less because buyers assume eviction costs and delays. A cash buyer with experience managing tenant transitions can close quickly while you avoid months of legal proceedings.",
    },
    {
      id: "land-valuation",
      question: "How do you value raw land?",
      answer:
        "Raw land valuation depends on: location and zoning, utilities and access, topography and buildability, local market comparables, and intended use (residential, commercial, agricultural). Highest and best use analysis determines which use generates the most value. A site analysis includes comps, zoning research, and development potential.",
    },
    {
      id: "build-timeline-before-sell",
      question: "Should I finish improvements before selling or sell as-is?",
      answer:
        "It depends on ROI. Some repairs (roof, foundation, major systems) add value and buyer confidence. Cosmetic fixes often don't justify their cost. A cash buyer typically purchases as-is, accepting the property's condition. A traditional buyer expects a turnkey or near-turnkey home. Discuss your situation for a clear recommendation.",
    },
    {
      id: "multiple-units-investment",
      question: "Are multi-unit properties better for cash flow than single-family?",
      answer:
        "Multi-unit (duplex, triplex, fourplex) properties can generate higher total rent but have higher operating costs and vacancy risk. Single-family homes are easier to manage and sell. The best choice depends on your market knowledge, management capacity, and target return. Local market analysis determines which strategy works best for your area.",
    },
    {
      id: "investment-analysis-free",
      question: "Do you offer free property or land analysis?",
      answer:
        "Yes. A property analysis is free—no obligation. I'll review market comps, estimate fair market value for a traditional sale, calculate cash flow if it's a rental, and assess development potential if it's land. This helps you understand what your property is actually worth and what financial scenario makes sense for your situation.",
    },
    {
      id: "tax-consequences-sale",
      question: "What are the tax consequences of selling a property?",
      answer:
        "Federal capital gains tax applies to the profit on a sale (long-term vs short-term rates differ). California has no state capital gains tax on real estate. If you've lived in the home 2 of the last 5 years, up to $250k (single) or $500k (married) of gain is excluded. Consult a CPA or tax attorney to understand your specific situation.",
      verifyWithCounsel: true,
    },
    {
      id: "what-reo-property",
      question: "What is an REO (bank-owned) property?",
      answer:
        "REO (Real Estate Owned) means the lender foreclosed and now owns the property. These properties are listed by the bank at market value or below, but come with inspection periods and often sales contingencies. They can be good deals but require normal financing and inspections—faster than auctions but slower than cash offers.",
    },
    {
      id: "buy-below-market",
      question: "How do you find below-market deals?",
      answer:
        "Below-market deals come from distressed situations (foreclosure, NOD, probate), off-market sellers (direct mail, networking, bird dogs), expired listings (delisted homes with motivated sellers), and whole-sale networks. Most never hit MLS. Building relationships with probate attorneys, estate agents, and local wholesalers reveals off-market opportunities.",
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
