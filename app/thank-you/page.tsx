import { getTenant } from "@/tenants";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { JsonLdScript } from "@/components/JsonLdScript";
import { buildGraph } from "@/lib/jsonld";

// Post-submit landing page (§7.2). Must render meaningfully with
// JavaScript disabled — this is exactly the page a plain <form method=
// "POST"> lands on after the route handler's 303 redirect. Reading
// `searchParams` opts this route out of force-static (fine: it's a
// utility page, not indexed content — excluded from sitemap.ts).
export default async function ThankYouPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string }>;
}) {
  const tenant = getTenant();
  const { ok } = await searchParams;
  const submitted = ok === "1";

  return (
    <>
      <JsonLdScript
        graph={buildGraph(tenant, {
          breadcrumbs: [
            { name: "Home", path: "/" },
            { name: "Thank you", path: "/thank-you" },
          ],
        })}
      />
      <Header tenant={tenant} />

      <section className="bg-navy py-24">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <h1 className="font-serif text-4xl text-white md:text-5xl">
            {submitted ? "Got it." : "Thanks for stopping by."}
          </h1>
          <p className="mt-6 text-lg text-steel">
            {submitted
              ? "Thanks — I'll call you from the number below. If it's urgent, call me directly."
              : "If you meant to send a property inquiry, use the form on the site — this page is just the landing spot after a submission."}
          </p>
          <a
            href={tenant.contact.phoneHref}
            className="mt-8 inline-block bg-brass px-6 py-3 text-sm font-semibold uppercase tracking-wide text-navy-deep"
          >
            Call {tenant.contact.phone}
          </a>
        </div>
      </section>

      <Footer tenant={tenant} />
    </>
  );
}
