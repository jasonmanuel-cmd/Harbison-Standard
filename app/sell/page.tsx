import { getTenant } from "@/tenants";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { LeadForm } from "@/components/LeadForm";
import { JsonLdScript } from "@/components/JsonLdScript";
import { buildGraph } from "@/lib/jsonld";
import { buildMetadata } from "@/lib/metadata";
import { ComparisonTable } from "@/components/ComparisonTable";

export const dynamic = "force-static";

export const metadata = buildMetadata({
  title: "Sell for Cash — Probate, Inherited & Distressed Property",
  description:
    "Probate, inherited, notice-of-default, or a tired-landlord situation. A direct cash number on your Kern County property, no listing required.",
  path: "/sell",
});

const TRACKS = [
  {
    situation: "sell-probate",
    title: "Probate",
    body: "Administering an estate that includes real property. A cash sale can close on the timeline the court process allows, without listing, showings, or repairs.",
  },
  {
    situation: "sell-inherited",
    title: "Inherited property",
    body: "Inherited a house you don't plan to live in or rent out, possibly with other heirs involved. A direct sale converts it to cash without the carrying costs of holding an empty property.",
  },
  {
    situation: "sell-nod",
    title: "Notice of default",
    body: "Received a notice of default and want options before the timeline runs out. A cash sale can close faster than a traditional listing.",
  },
  {
    situation: "sell-landlord",
    title: "Tired landlord",
    body: "Tenant-occupied or vacant rental that's become more work than it's worth. Sell as-is, tenant in place or not — no repairs required before closing.",
  },
];

export default function SellPage() {
  const tenant = getTenant();

  return (
    <>
      <JsonLdScript
        graph={buildGraph(tenant, {
          breadcrumbs: [
            { name: "Home", path: "/" },
            { name: "Sell", path: "/sell" },
          ],
          service: {
            pillar: "flip",
            name: "Cash purchase of Kern County property",
            description:
              "Direct cash offers on Kern County property, including probate, inherited, pre-foreclosure, and tenant-occupied situations.",
          },
        })}
      />
      <Header tenant={tenant} />

      <section className="bg-navy py-20">
        <div className="mx-auto max-w-3xl px-6">
          <p className="font-serif italic text-brass">Sell</p>
          <h1 className="mt-4 font-serif text-4xl text-white md:text-5xl">
            A direct cash number on your property.
          </h1>
          <p className="mt-6 text-lg text-steel">
            No listing, no showings, no repairs. The property is evaluated
            against recent comparable sales and its condition, and a written
            offer follows. Closing runs through a local title company —
            typically two to three weeks once terms are agreed. There&rsquo;s no
            obligation to accept.
          </p>
        </div>
      </section>

      <section className="bg-paper py-20">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="font-serif text-3xl text-navy">Common situations</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {TRACKS.map((track) => (
              <div key={track.situation} className="border border-navy/10 bg-white p-6">
                <h3 className="font-serif text-xl text-navy">{track.title}</h3>
                <p className="mt-3 text-navy/70">{track.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ComparisonTable />

      <LeadForm
        source="sell"
        defaultSituation="sell-inherited"
        heading="Tell me about the property"
      />

      <Footer tenant={tenant} />
    </>
  );
}
