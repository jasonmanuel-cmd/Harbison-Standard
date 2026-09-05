import { getTenant } from "@/tenants";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { JsonLdScript } from "@/components/JsonLdScript";
import { buildGraph } from "@/lib/jsonld";
import { buildMetadata } from "@/lib/metadata";
import { notFound } from "next/navigation";

export const dynamic = "force-static";

const COMMUNITIES = {
  bakersfield: {
    name: "Bakersfield",
    slug: "bakersfield",
    population: "403,000",
    medianAge: "32",
    medianIncome: "$68,000",
    overview:
      "Kern County's largest city, Bakersfield is a growing hub for real estate investment and development. The central California location offers strong rental yields, diverse neighborhoods, and ongoing infrastructure expansion.",
    neighborhoods: [
      {
        name: "Downtown Bakersfield",
        description:
          "Urban revitalization in progress. Walkable streets, new apartments, mixed-use developments. Gentrification opportunity zone.",
      },
      {
        name: "Old Town Bakersfield",
        description:
          "Historic neighborhood with character homes, restaurants, antique shops. Popular with buyers seeking established community feel.",
      },
      {
        name: "Southwest Bakersfield",
        description:
          "Family-oriented, affordable. Good schools, parks, newer subdivisions. Entry-level buyer market.",
      },
      {
        name: "North of the Boulevard",
        description:
          "Mixed income, diverse population. Ongoing development projects. Investor-friendly cash flow properties.",
      },
    ],
    schools: [
      { name: "Bakersfield High School", rating: "8/10", type: "Public" },
      { name: "Garces Memorial High School", rating: "9/10", type: "Private" },
      { name: "Bakersfield Christian Schools", rating: "8.5/10", type: "Private" },
    ],
    marketData: {
      medianHomePrice: "$385,000",
      priceChange: "+8.2% YoY",
      avgSalePrice: "$355,000",
      daysOnMarket: "42",
      rentPerMonth: "$1,400–$2,200",
      investmentYield: "6.8–8.2%",
    },
    whyInvest:
      "Strong cash flow, growing population, diverse economy (agriculture, oil, tech). Affordability attracts both owner-occupants and investors. Central location serves surrounding regions.",
  },
  tehachapi: {
    name: "Tehachapi",
    slug: "tehachapi",
    population: "14,000",
    medianAge: "38",
    medianIncome: "$72,000",
    overview:
      "Mountain gateway community with cooler climate, scenic views, and strong retiree appeal. Wind farms and outdoor recreation drive tourism and property values.",
    neighborhoods: [
      {
        name: "Stallion Springs",
        description:
          "Gated master-planned community. Horse properties, large lots, amenities. Premium pricing for privacy and space.",
      },
      {
        name: "Downtown Tehachapi",
        description:
          "Historic town center. Antique shops, restaurants, local character. Walking distance to shops and services.",
      },
      {
        name: "Cummings Valley",
        description:
          "Rural ranchland, large acreage, investment potential. Agricultural operations, long-term appreciation play.",
      },
    ],
    schools: [
      { name: "Tehachapi High School", rating: "7.5/10", type: "Public" },
      { name: "Tehachapi Montessori", rating: "8/10", type: "Private" },
    ],
    marketData: {
      medianHomePrice: "$525,000",
      priceChange: "+12.1% YoY",
      avgSalePrice: "$480,000",
      daysOnMarket: "55",
      rentPerMonth: "$1,600–$2,400",
      investmentYield: "5.2–6.8%",
    },
    whyInvest:
      "Lifestyle destination for retirees and remote workers. Limited inventory drives appreciation. Scenic appeal and outdoor recreation (hiking, wind sports) attract affluent buyers. Premium margins on development.",
  },
  "california-city": {
    name: "California City",
    slug: "california-city",
    population: "15,000",
    medianAge: "35",
    medianIncome: "$58,000",
    overview:
      "Planned community with affordable lots, strong cash flow potential, and room for growth. Lower purchase price allows portfolio expansion and rental income focus.",
    neighborhoods: [
      {
        name: "City Center",
        description:
          "Planned downtown area. Master-planned lots, commercial zoning. Future appreciation as city develops.",
      },
      {
        name: "Residential Areas",
        description:
          "Affordable single-family lots. Developer-friendly. Good for first-time builders and investors seeking cash flow.",
      },
    ],
    schools: [
      { name: "California City High School", rating: "7/10", type: "Public" },
    ],
    marketData: {
      medianHomePrice: "$285,000",
      priceChange: "+10.5% YoY",
      avgSalePrice: "$275,000",
      daysOnMarket: "38",
      rentPerMonth: "$1,100–$1,600",
      investmentYield: "7.5–9.2%",
    },
    whyInvest:
      "Lowest cost of entry. Highest cash-on-cash returns. Build-to-rent plays. Portfolio scaling opportunity. Highway accessibility to Bakersfield and LA.",
  },
};

export async function generateStaticParams() {
  return Object.keys(COMMUNITIES).map((slug) => ({
    slug,
  }));
}

export const metadata = buildMetadata({
  title: "Community Guides",
  description: "Local market insights for Bakersfield, Tehachapi, California City.",
  path: "/communities/[slug]",
});

export default function CommunityPage({ params }: { params: { slug: string } }) {
  const tenant = getTenant();
  const community = COMMUNITIES[params.slug as keyof typeof COMMUNITIES];

  if (!community) {
    notFound();
  }

  return (
    <>
      <JsonLdScript
        graph={buildGraph(tenant, {
          breadcrumbs: [
            { name: "Home", path: "/" },
            { name: "Communities", path: "/communities" },
            { name: community.name, path: `/communities/${community.slug}` },
          ],
        })}
      />
      <Header tenant={tenant} />

      <section className="bg-navy py-20">
        <div className="mx-auto max-w-3xl px-6">
          <h1 className="font-serif text-4xl text-white md:text-5xl">
            {community.name}
          </h1>
          <p className="mt-4 text-lg text-steel">{community.overview}</p>
          <div className="mt-8 grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm uppercase tracking-wide text-brass">
                Population
              </p>
              <p className="text-2xl font-semibold text-white">
                {community.population}
              </p>
            </div>
            <div>
              <p className="text-sm uppercase tracking-wide text-brass">
                Median Age
              </p>
              <p className="text-2xl font-semibold text-white">
                {community.medianAge}
              </p>
            </div>
            <div>
              <p className="text-sm uppercase tracking-wide text-brass">
                Median Income
              </p>
              <p className="text-2xl font-semibold text-white">
                {community.medianIncome}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-paper py-20">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="font-serif text-3xl text-navy">Neighborhoods</h2>
          <div className="mt-10 space-y-6">
            {community.neighborhoods.map((neighborhood) => (
              <div key={neighborhood.name} className="border-l-4 border-brass pl-6">
                <h3 className="font-serif text-xl text-navy">{neighborhood.name}</h3>
                <p className="mt-2 text-navy/70">{neighborhood.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="font-serif text-3xl text-navy">Schools</h2>
          <div className="mt-10 grid gap-4">
            {community.schools.map((school) => (
              <div
                key={school.name}
                className="flex items-center justify-between border border-navy/10 p-4"
              >
                <div>
                  <p className="font-semibold text-navy">{school.name}</p>
                  <p className="text-sm text-navy/60">{school.type}</p>
                </div>
                <p className="text-lg font-bold text-brass">{school.rating}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-parchment py-20">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="font-serif text-3xl text-navy">Market Data</h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            <div className="border border-navy/10 bg-white p-6">
              <p className="text-sm uppercase tracking-wide text-navy/60">
                Median Home Price
              </p>
              <p className="mt-2 text-3xl font-bold text-navy">
                {community.marketData.medianHomePrice}
              </p>
              <p className="mt-1 text-sm text-brass">
                {community.marketData.priceChange}
              </p>
            </div>
            <div className="border border-navy/10 bg-white p-6">
              <p className="text-sm uppercase tracking-wide text-navy/60">
                Average Sale Price
              </p>
              <p className="mt-2 text-3xl font-bold text-navy">
                {community.marketData.avgSalePrice}
              </p>
              <p className="mt-1 text-sm text-steel">
                {community.marketData.daysOnMarket} days on market
              </p>
            </div>
            <div className="border border-navy/10 bg-white p-6">
              <p className="text-sm uppercase tracking-wide text-navy/60">
                Rental Range
              </p>
              <p className="mt-2 text-3xl font-bold text-navy">
                {community.marketData.rentPerMonth}
              </p>
            </div>
            <div className="border border-navy/10 bg-white p-6">
              <p className="text-sm uppercase tracking-wide text-navy/60">
                Investment Yield
              </p>
              <p className="mt-2 text-3xl font-bold text-brass">
                {community.marketData.investmentYield}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-navy py-20">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="font-serif text-3xl text-white">Why Invest Here</h2>
          <p className="mt-6 text-lg text-steel">{community.whyInvest}</p>
          <a
            href={`/?situation=invest&area=${community.slug}`}
            className="mt-8 inline-block bg-brass px-8 py-3 font-semibold uppercase tracking-wide text-navy-deep hover:bg-brass/90"
          >
            Get a Property Analysis
          </a>
        </div>
      </section>

      <Footer tenant={tenant} />
    </>
  );
}
