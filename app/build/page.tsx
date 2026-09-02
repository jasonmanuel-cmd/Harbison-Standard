import { getTenant } from "@/tenants";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { LeadForm } from "@/components/LeadForm";
import { JsonLdScript } from "@/components/JsonLdScript";
import { buildGraph } from "@/lib/jsonld";

export const dynamic = "force-static";

const STAGES = [
  {
    title: "Lot selection",
    body: "Land is evaluated for buildability, utility access, and permitting timeline before a build is scheduled.",
  },
  {
    title: "Plans & permits",
    body: "Plans are drawn and submitted to the county. SB 800 (California's Right to Repair statute) governs the structural, plumbing, and electrical standards the finished home is built to.",
  },
  {
    title: "Construction",
    body: "Built by licensed trades under direct oversight, start to finish — the same person managing the build is the one you talk to.",
  },
  {
    title: "Pre-sale",
    body: "Homes are made available before completion where the stage of construction allows it, at a fixed price with no bidding process.",
  },
];

export default function BuildPage() {
  const tenant = getTenant();

  return (
    <>
      <JsonLdScript
        graph={buildGraph(tenant, {
          breadcrumbs: [
            { name: "Home", path: "/" },
            { name: "Build", path: "/build" },
          ],
          service: {
            pillar: "build",
            name: "New-construction spec homes",
            description:
              "Spec homes built and pre-sold in Kern County, from lot selection through closing.",
          },
        })}
      />
      <Header tenant={tenant} />

      <section className="bg-navy py-20">
        <div className="mx-auto max-w-3xl px-6">
          <p className="font-serif italic text-brass">Build</p>
          <h1 className="mt-4 font-serif text-4xl text-white md:text-5xl">
            Spec homes built and pre-sold in Kern County.
          </h1>
          <p className="mt-6 text-lg text-steel">
            One person overseeing the build from lot to closing — the
            developer and the agent are the same person you&rsquo;re talking to.
            See what&rsquo;s under construction and what&rsquo;s available before it&rsquo;s
            listed.
          </p>
        </div>
      </section>

      <section className="bg-paper py-20">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="font-serif text-3xl text-navy">How a build runs</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {STAGES.map((stage) => (
              <div key={stage.title} className="border border-navy/10 bg-white p-6">
                <h3 className="font-serif text-xl text-navy">{stage.title}</h3>
                <p className="mt-3 text-navy/70">{stage.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <LeadForm
        source="build"
        defaultSituation="build"
        heading="Get notified about upcoming homes"
      />

      <Footer tenant={tenant} />
    </>
  );
}
