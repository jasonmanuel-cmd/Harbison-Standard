import { getTenant } from "@/tenants";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { buildMetadata } from "@/lib/metadata";
import Link from "next/link";

export const dynamic = "force-static";

export const metadata = buildMetadata({
  title: "Communities",
  description: "Local market guides for Kern County real estate investment.",
  path: "/communities",
});

const COMMUNITIES = [
  {
    slug: "bakersfield",
    name: "Bakersfield",
    description: "Kern County's largest city with strong cash flow and growth potential.",
    icon: "🏙️",
  },
  {
    slug: "tehachapi",
    name: "Tehachapi",
    description: "Mountain gateway with lifestyle appeal and premium pricing.",
    icon: "⛰️",
  },
  {
    slug: "california-city",
    name: "California City",
    description: "Affordable lots and highest investment yields in the region.",
    icon: "🏗️",
  },
];

export default function CommunitiesPage() {
  const tenant = getTenant();

  return (
    <>
      <Header tenant={tenant} />

      <section className="bg-navy py-20">
        <div className="mx-auto max-w-3xl px-6">
          <h1 className="font-serif text-4xl text-white md:text-5xl">Communities</h1>
          <p className="mt-4 text-lg text-steel">
            Detailed market insights for every area I work in. Learn the neighborhoods,
            see the numbers, understand the opportunity.
          </p>
        </div>
      </section>

      <section className="bg-paper py-20">
        <div className="mx-auto max-w-4xl px-6">
          <div className="grid gap-6 md:grid-cols-3">
            {COMMUNITIES.map((community) => (
              <Link key={community.slug} href={`/communities/${community.slug}`}>
                <div className="group transform cursor-pointer rounded-lg border border-navy/10 bg-white p-8 transition-all duration-300 hover:-translate-y-1 hover:border-brass hover:shadow-lg">
                  <p className="text-4xl">{community.icon}</p>
                  <h3 className="mt-4 font-serif text-2xl text-navy group-hover:text-brass">
                    {community.name}
                  </h3>
                  <p className="mt-3 text-navy/70">{community.description}</p>
                  <p className="mt-6 inline-block border-b-2 border-brass text-sm font-semibold uppercase tracking-wide text-navy group-hover:text-brass">
                    Read Guide →
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer tenant={tenant} />
    </>
  );
}
