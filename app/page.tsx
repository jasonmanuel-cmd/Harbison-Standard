import Link from "next/link";
import { getTenant } from "@/tenants";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { LeadForm } from "@/components/LeadForm";
import { BenchmarkMark } from "@/components/BenchmarkMark";
import { JsonLdScript } from "@/components/JsonLdScript";
import { buildGraph } from "@/lib/jsonld";

export const dynamic = "force-static";

export default function HomePage() {
  const tenant = getTenant();
  const teaserFaq = tenant.faq.slice(0, 3);

  return (
    <>
      <JsonLdScript
        graph={buildGraph(tenant, {
          breadcrumbs: [{ name: "Home", path: "/" }],
          faq: true,
        })}
      />
      <Header tenant={tenant} />

      <section className="relative overflow-hidden bg-navy">
        <video
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
        >
          <source src="/media/hero.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-navy/70" aria-hidden="true" />
        <BenchmarkMark className="pointer-events-none absolute -right-16 top-1/2 h-96 w-96 -translate-y-1/2 text-brass opacity-10" />
        <div className="relative mx-auto max-w-3xl px-6 py-24">
          <p className="font-serif italic text-brass">{tenant.copy.heroTag}</p>
          <h1 className="mt-4 font-serif text-4xl leading-tight text-white md:text-5xl">
            {tenant.copy.heroHeadline.replace(
              tenant.copy.heroHeadlineHighlight,
              "",
            )}
            <span className="text-brass">
              {tenant.copy.heroHeadlineHighlight}
            </span>
          </h1>
          <p className="mt-6 text-lg text-steel">{tenant.copy.heroSubcopy}</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="#lead-form"
              className="bg-brass px-6 py-3 text-sm font-semibold uppercase tracking-wide text-navy-deep"
            >
              {tenant.copy.heroPrimaryCta}
            </a>
            <Link
              href="/build"
              className="border border-steel px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white"
            >
              {tenant.copy.heroSecondaryCta}
            </Link>
          </div>
        </div>
      </section>

      <section className="border-y border-navy/10 bg-paper py-10">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-6 px-6 text-center md:grid-cols-4">
          {tenant.copy.proofStats.map((stat) => (
            <div key={stat.label}>
              <p className="font-serif text-3xl text-navy">{stat.value}</p>
              <p className="mt-1 text-sm text-navy/70">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-paper py-20">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="text-center font-serif text-3xl text-navy">
            Three ways to work together
          </h2>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {tenant.copy.services.map((service) => (
              <Link
                key={service.href}
                href={service.href}
                className="block border border-navy/10 bg-white p-8 hover:border-brass"
              >
                <p className="inline-block border-b-2 border-brass font-serif text-xs font-semibold uppercase tracking-[0.3em] text-navy">
                  {service.pillar}
                </p>
                <h3 className="mt-3 font-serif text-2xl text-navy">
                  {service.title}
                </h3>
                <p className="mt-3 text-navy/70">{service.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-parchment py-20">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="font-serif text-3xl text-navy">Frequently asked</h2>
          <div className="mt-8 space-y-4">
            {teaserFaq.map((entry) => (
              <details key={entry.id} className="border border-navy/10 bg-white p-5">
                <summary className="cursor-pointer font-semibold text-navy">
                  {entry.question}
                </summary>
                <p className="mt-3 text-navy/70">{entry.answer}</p>
              </details>
            ))}
          </div>
          <Link
            href="/faq"
            className="mt-6 inline-block font-semibold text-navy underline decoration-brass"
          >
            See the full FAQ →
          </Link>
        </div>
      </section>

      <LeadForm source="home" />

      <Footer tenant={tenant} />
    </>
  );
}
