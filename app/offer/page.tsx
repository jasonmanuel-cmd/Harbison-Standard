import { getTenant } from "@/tenants";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { LeadForm } from "@/components/LeadForm";
import { JsonLdScript } from "@/components/JsonLdScript";
import { buildGraph } from "@/lib/jsonld";
import { buildMetadata } from "@/lib/metadata";

export const dynamic = "force-static";

export const metadata = buildMetadata({
  title: "Cash Offer - Sell Your Property Fast",
  description:
    "Get a direct cash offer on your property. No inspections, no appraisals, no repairs. Quick closing.",
  path: "/offer",
});

const BENEFITS = [
  {
    title: "Direct Funding",
    body: "We have capital on hand. No contingencies, no bank delays. Offer to close in weeks, not months.",
  },
  {
    title: "As-Is Purchase",
    body: "Sell the property in any condition. No repairs required, no inspections, no appraisals.",
  },
  {
    title: "Zero Agent Fees",
    body: "We handle everything directly. No commission, no listing fees, no marketing costs.",
  },
  {
    title: "Your Timeline",
    body: "Sell on your schedule. Quick close in 2-3 weeks, or take longer if you need time to transition.",
  },
];

const PROCESS = [
  {
    step: "01",
    title: "Submit Property Info",
    body: "Tell us about the property, condition, and any tenant situation. Takes 5 minutes.",
  },
  {
    step: "02",
    title: "Quick Review",
    body: "We evaluate based on recent comps, condition, and market conditions in Kern County.",
  },
  {
    step: "03",
    title: "Written Offer",
    body: "Receive a firm cash offer with closing timeline. No obligation to accept.",
  },
  {
    step: "04",
    title: "Close with Title",
    body: "Work with a local title company for closing. Funds transfer directly to you.",
  },
];

export default function OfferPage() {
  const tenant = getTenant();

  return (
    <>
      <JsonLdScript
        graph={buildGraph(tenant, {
          breadcrumbs: [
            { name: "Home", path: "/" },
            { name: "Sell", path: "/offer" },
          ],
          service: {
            pillar: "offer",
            name: "Cash property acquisition",
            description: "Direct cash offers on Kern County property. No contingencies, as-is purchase.",
          },
        })}
      />
      <Header tenant={tenant} />

      <section className="bg-navy py-20">
        <div className="mx-auto max-w-3xl px-6">
          <p className="font-serif italic text-brass">Sell</p>
          <h1 className="mt-4 font-serif text-4xl text-white md:text-5xl">
            Skip the listing. Get a direct offer.
          </h1>
          <p className="mt-6 text-lg text-steel">
            Direct cash acquisition. No agent commissions, no repairs, no contingencies. We buy properties as-is and close on your timeline.
          </p>
        </div>
      </section>

      <section className="bg-paper py-20">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="font-serif text-3xl text-navy">Why sell to us</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {BENEFITS.map((benefit) => (
              <div key={benefit.title} className="border border-navy/10 bg-white p-6">
                <h3 className="font-serif text-xl text-navy">{benefit.title}</h3>
                <p className="mt-3 text-navy/70">{benefit.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-navy py-20">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="font-serif text-3xl text-white mb-10">How it works</h2>
          <div className="grid gap-6 md:grid-cols-4">
            {PROCESS.map((item) => (
              <div key={item.step} className="relative">
                <p className="font-serif text-4xl text-brass/20 mb-4">{item.step}</p>
                <h3 className="font-serif text-lg text-white mb-2">{item.title}</h3>
                <p className="text-steel text-sm">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <LeadForm
        source="offer"
        defaultSituation="sell-inherited"
        heading="Tell me about your property"
      />

      <Footer tenant={tenant} />
    </>
  );
}
