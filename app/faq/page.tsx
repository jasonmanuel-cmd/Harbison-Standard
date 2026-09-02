import { getTenant } from "@/tenants";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { LeadForm } from "@/components/LeadForm";
import { JsonLdScript } from "@/components/JsonLdScript";
import { buildGraph } from "@/lib/jsonld";

export const dynamic = "force-static";

export default function FaqPage() {
  const tenant = getTenant();

  return (
    <>
      <JsonLdScript
        graph={buildGraph(tenant, {
          breadcrumbs: [
            { name: "Home", path: "/" },
            { name: "FAQ", path: "/faq" },
          ],
          faq: true,
        })}
      />
      <Header tenant={tenant} />

      <section className="bg-navy py-20">
        <div className="mx-auto max-w-3xl px-6">
          <p className="font-serif italic text-brass">FAQ</p>
          <h1 className="mt-4 font-serif text-4xl text-white md:text-5xl">
            Frequently asked questions
          </h1>
        </div>
      </section>

      <section className="bg-paper py-20">
        <div className="mx-auto max-w-3xl space-y-4 px-6">
          {tenant.faq.map((entry) => (
            <details key={entry.id} id={entry.id} className="border border-navy/10 bg-white p-6">
              <summary className="cursor-pointer font-serif text-lg text-navy">
                {entry.question}
              </summary>
              <p className="mt-3 text-navy/70">{entry.answer}</p>
              {entry.verifyWithCounsel && (
                <p className="mt-3 text-xs uppercase tracking-wide text-navy/40">
                  Reviewed for general information only — confirm specifics with an attorney.
                </p>
              )}
            </details>
          ))}
        </div>
      </section>

      <LeadForm source="home" heading="Still have a question?" />

      <Footer tenant={tenant} />
    </>
  );
}
