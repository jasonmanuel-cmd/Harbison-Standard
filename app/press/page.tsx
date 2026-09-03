import { getTenant } from "@/tenants";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { JsonLdScript } from "@/components/JsonLdScript";
import { buildGraph } from "@/lib/jsonld";
import { buildMetadata } from "@/lib/metadata";

export const dynamic = "force-static";

const SHORT_BIO =
  "Nathaniel Harvison is a Realtor, developer, and investor based in Kern County, California. He buys property directly for cash, builds and pre-sells spec homes, and evaluates land and investment opportunities. Licensed by the California DRE, he has worked in Kern County real estate for more than a decade, personally handling every stage of a transaction.";

export const metadata = buildMetadata({
  title: "Press Kit & Media",
  description: SHORT_BIO,
  path: "/press",
});

const LONG_BIO =
  "Nathaniel Harvison works all around Kern County — Bakersfield, Tehachapi, and the surrounding area — as a licensed Realtor, a developer, and an investor, usually on the same property in the same week. He buys houses directly for cash in situations like probate, inherited property, pre-foreclosure, and tenant-occupied rentals; builds and pre-sells spec homes from lot selection through closing; and evaluates land and investment property for buyers deciding what a parcel is actually worth. His approach: one person, start to finish, rather than handing a transaction between multiple specialists. He holds California DRE license #02059393 and is not affiliated with a brokerage team.";

const PILLARS = [
  {
    label: "Build",
    body: "How a spec home gets built and pre-sold in Kern County, from lot selection and permitting through closing — and what buyers should ask before putting money down on new construction.",
  },
  {
    label: "Update",
    body: "What's actually worth fixing before a sale versus what to leave for the buyer to handle, and how repair decisions change net proceeds.",
  },
  {
    label: "Invest",
    body: "How to evaluate a rental, a lot, or a parcel for its numbers rather than its story — comparable sales, carrying costs, and realistic timelines.",
  },
  {
    label: "Flip",
    body: "What a direct cash sale actually costs compared to listing, and how situations like probate or a notice of default change the calculus.",
  },
];

export default function PressPage() {
  const tenant = getTenant();
  const mailtoHref = `mailto:${tenant.contact.email}?subject=${encodeURIComponent(
    "Interview / booking request — " + tenant.name,
  )}`;

  return (
    <>
      <JsonLdScript
        graph={buildGraph(tenant, {
          breadcrumbs: [
            { name: "Home", path: "/" },
            { name: "Press", path: "/press" },
          ],
        })}
      />
      <div className="no-print">
        <Header tenant={tenant} />
      </div>

      <section className="no-print bg-navy py-20">
        <div className="mx-auto max-w-3xl px-6">
          <p className="font-serif italic text-brass">Press &amp; media</p>
          <h1 className="mt-4 font-serif text-4xl text-white md:text-5xl">
            {tenant.copy.positioningLine}
          </h1>
          <p className="mt-6 text-lg text-steel">{SHORT_BIO}</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href={tenant.contact.phoneHref}
              className="bg-brass px-6 py-3 text-sm font-semibold uppercase tracking-wide text-navy-deep"
            >
              Call {tenant.contact.phone}
            </a>
            <a
              href={mailtoHref}
              className="border border-steel px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white"
            >
              Email to book
            </a>
            <a
              href="#one-sheet"
              className="border border-steel px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white"
            >
              Jump to one-sheet
            </a>
          </div>
        </div>
      </section>

      <section className="no-print bg-paper py-20">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="font-serif text-3xl text-navy">Full bio</h2>
          <p className="mt-6 text-navy/70">{LONG_BIO}</p>
        </div>
      </section>

      <section className="no-print bg-parchment py-20">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="font-serif text-3xl text-navy">Talking points</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {PILLARS.map((p) => (
              <div key={p.label} className="border border-navy/10 bg-white p-6">
                <p className="inline-block border-b-2 border-brass font-serif text-xs font-semibold uppercase tracking-[0.3em] text-navy">
                  {p.label}
                </p>
                <p className="mt-3 text-navy/70">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* One-sheet: designed to be printed / saved as PDF via the
          browser's native print dialog. `.no-print` sections above and
          the header/footer are hidden by the @media print rule in
          globals.css, leaving just this block on the page. */}
      <section id="one-sheet" className="one-sheet bg-white py-16">
        <div className="mx-auto max-w-3xl border border-navy/10 p-10">
          <div className="flex items-center gap-6">
            <div
              aria-label="Headshot placeholder"
              className="flex h-24 w-24 shrink-0 items-center justify-center border border-brass bg-navy font-serif text-2xl text-brass"
            >
              NH
            </div>
            <div>
              <h2 className="font-serif text-2xl text-navy">
                {tenant.contact.displayName}
              </h2>
              <p className="text-navy/70">{tenant.contact.roleLine}</p>
            </div>
          </div>

          <p className="mt-6 text-navy/80">{SHORT_BIO}</p>

          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {PILLARS.map((p) => (
              <div key={p.label}>
                <p className="inline-block border-b-2 border-brass font-serif text-xs font-semibold uppercase tracking-[0.2em] text-navy">
                  {p.label}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 border-t border-navy/10 pt-6 text-sm text-navy/70">
            <p>
              {tenant.contact.phone} · {tenant.contact.email}
            </p>
            <p className="mt-1">{tenant.contact.complianceFooter}</p>
          </div>

          <button
            type="button"
            data-print-button
            className="no-print mt-8 border border-navy/20 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-navy"
          >
            Print / save as PDF
          </button>
        </div>
      </section>

      <script
        dangerouslySetInnerHTML={{
          __html: `(function(){
  var btn = document.querySelector('[data-print-button]');
  if (btn) btn.addEventListener('click', function () { window.print(); });
})();`,
        }}
      />

      <div className="no-print">
        <Footer tenant={tenant} />
      </div>
    </>
  );
}
