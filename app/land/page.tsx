import { getTenant } from "@/tenants";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { LeadForm } from "@/components/LeadForm";
import { JsonLdScript } from "@/components/JsonLdScript";
import { buildGraph } from "@/lib/jsonld";

export const dynamic = "force-static";

const FACTORS = [
  {
    title: "Zoning & buildability",
    body: "What the parcel is zoned for and whether it can be built on as-is, or what it would take to change that.",
  },
  {
    title: "Utilities & access",
    body: "Distance to water, power, and sewer or septic feasibility, and whether the parcel has legal road access.",
  },
  {
    title: "Comparable land sales",
    body: "Recent sales of similar parcels in the area, adjusted for size, access, and utility availability.",
  },
  {
    title: "Highest-value use",
    body: "Whether the parcel is worth more sold as-is, held, or built on — a straight read on the numbers either way.",
  },
];

export default function LandPage() {
  const tenant = getTenant();

  return (
    <>
      <JsonLdScript
        graph={buildGraph(tenant, {
          breadcrumbs: [
            { name: "Home", path: "/" },
            { name: "Land", path: "/land" },
          ],
          service: {
            pillar: "invest",
            name: "Land and lot valuation",
            description:
              "Valuation and buildability assessment for land and lots in Kern County.",
          },
        })}
      />
      <Header tenant={tenant} />

      <section className="bg-navy py-20">
        <div className="mx-auto max-w-3xl px-6">
          <p className="font-serif italic text-brass">Land</p>
          <h1 className="mt-4 font-serif text-4xl text-white md:text-5xl">
            What&rsquo;s your lot actually worth?
          </h1>
          <p className="mt-6 text-lg text-steel">
            Land is evaluated the same way a build site would be — zoning,
            access, utilities, and what similar parcels have sold for. A
            straight number, whether the answer is sell it, hold it, or
            build on it.
          </p>
        </div>
      </section>

      <section className="bg-paper py-20">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="font-serif text-3xl text-navy">What gets evaluated</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {FACTORS.map((factor) => (
              <div key={factor.title} className="border border-navy/10 bg-white p-6">
                <h3 className="font-serif text-xl text-navy">{factor.title}</h3>
                <p className="mt-3 text-navy/70">{factor.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <LeadForm source="land" defaultSituation="land" heading="Get a read on your parcel" />

      <Footer tenant={tenant} />
    </>
  );
}
