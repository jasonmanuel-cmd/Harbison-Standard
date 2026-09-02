import { getTenant } from "@/tenants";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { JsonLdScript } from "@/components/JsonLdScript";
import { buildGraph } from "@/lib/jsonld";

export const dynamic = "force-static";

export default function TermsPage() {
  const tenant = getTenant();

  return (
    <>
      <JsonLdScript
        graph={buildGraph(tenant, {
          breadcrumbs: [
            { name: "Home", path: "/" },
            { name: "Terms", path: "/terms" },
          ],
        })}
      />
      <Header tenant={tenant} />

      <section className="bg-paper py-20">
        <div className="mx-auto max-w-2xl px-6">
          <h1 className="font-serif text-4xl text-navy">Terms of use</h1>
          <p className="mt-2 text-sm text-navy/70">
            Plain-language summary — last updated with this site&rsquo;s launch.
          </p>

          <div className="mt-10 space-y-8 text-navy/80">
            <div>
              <h2 className="font-serif text-xl text-navy">Informational site</h2>
              <p className="mt-2">
                This site is provided to share information about{" "}
                {tenant.contact.displayName}&rsquo;s real estate services in Kern
                County, California, and to let visitors request contact about
                a property. Nothing on this site is an offer to purchase any
                specific property, a promise of any specific price or outcome,
                or a substitute for legal, tax, or financial advice.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-xl text-navy">No promised outcomes</h2>
              <p className="mt-2">
                Any figures, timelines, or valuations discussed are estimates
                based on available information at the time — they are not a
                promise of any specific price or result. Every property and
                situation is different; a written offer, once made, is the
                only binding number.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-xl text-navy">License</h2>
              <p className="mt-2">{tenant.contact.complianceFooter}</p>
            </div>

            <div>
              <h2 className="font-serif text-xl text-navy">Site content</h2>
              <p className="mt-2">
                The text, design, and mark on this site belong to{" "}
                {tenant.name} and may not be copied or reused without
                permission.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-xl text-navy">Governing law</h2>
              <p className="mt-2">
                These terms are governed by the laws of the State of
                California.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-xl text-navy">Questions</h2>
              <p className="mt-2">
                Contact{" "}
                <a href={`mailto:${tenant.contact.email}`} className="underline decoration-brass">
                  {tenant.contact.email}
                </a>{" "}
                with any questions about these terms.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer tenant={tenant} />
    </>
  );
}
