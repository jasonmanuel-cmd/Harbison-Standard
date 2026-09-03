import Link from "next/link";
import { getTenant } from "@/tenants";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { LeadForm } from "@/components/LeadForm";
import { AboutSection } from "@/components/AboutSection";
import { PortfolioSection } from "@/components/PortfolioSection";
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
          className="absolute inset-0 h-full w-full object-contain"
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

      <AboutSection tenant={tenant} />

      <LeadForm
        source="home"
        heading={tenant.copy.signupHeading}
        subcopy={tenant.copy.signupSubcopy}
      />

      <section className="bg-navy-deep py-20">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="text-center font-serif text-3xl text-white">
            Three ways to work together
          </h2>

          {/* CSS-only tabs: radio inputs drive :checked state via Tailwind's
              peer/name selectors, no client JS. Unrolled (not .map()'d) on
              purpose — Tailwind's JIT scanner needs each peer/peer-checked
              class to appear as a literal string in this file; a template-
              interpolated class name (e.g. `peer/${pillar}`) never gets
              generated. Assumes exactly 3 services, same as the funnel
              pages and nav elsewhere in this codebase. */}
          <div className="relative mt-12">
            <input
              type="radio"
              name="pillar"
              id="pillar-tab-0"
              defaultChecked
              className="peer/tab0 sr-only"
            />
            <input
              type="radio"
              name="pillar"
              id="pillar-tab-1"
              className="peer/tab1 sr-only"
            />
            <input
              type="radio"
              name="pillar"
              id="pillar-tab-2"
              className="peer/tab2 sr-only"
            />

            <div
              role="tablist"
              aria-label="Ways to work with The Harbison Standard"
              className="flex flex-wrap justify-center gap-2 border-b border-white/10"
            >
              {tenant.copy.services.map((service, index) => (
                <label
                  key={service.href}
                  htmlFor={`pillar-tab-${index}`}
                  className={`cursor-pointer border-b-2 border-transparent px-5 py-3 font-serif text-xs font-semibold uppercase tracking-[0.3em] text-steel transition-colors hover:text-white ${
                    index === 0
                      ? "peer-checked/tab0:border-brass peer-checked/tab0:text-brass"
                      : index === 1
                        ? "peer-checked/tab1:border-brass peer-checked/tab1:text-brass"
                        : "peer-checked/tab2:border-brass peer-checked/tab2:text-brass"
                  }`}
                >
                  {String(index + 1).padStart(2, "0")} · {service.title}
                </label>
              ))}
            </div>

            {tenant.copy.services.map((service, index) => (
              <div
                key={service.href}
                className={
                  index === 0
                    ? "hidden peer-checked/tab0:block"
                    : index === 1
                      ? "hidden peer-checked/tab1:block"
                      : "hidden peer-checked/tab2:block"
                }
              >
                <div className="grid gap-6 border border-white/10 bg-white/[0.03] p-8 md:grid-cols-[auto,1fr] md:items-center md:gap-10 md:p-12">
                  <p className="font-serif text-xs font-semibold uppercase tracking-[0.3em] text-brass">
                    {service.pillar}
                  </p>
                  <div>
                    <h3 className="font-serif text-3xl text-white">
                      {service.title}
                    </h3>
                    <p className="mt-4 max-w-xl text-steel">
                      {service.description}
                    </p>
                    <Link
                      href={service.href}
                      className="mt-6 inline-block border-b border-brass text-sm font-semibold uppercase tracking-wide text-brass hover:text-white"
                    >
                      Learn more →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <PortfolioSection tenant={tenant} />

      <section className="bg-paper py-20">
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

      <Footer tenant={tenant} />
    </>
  );
}
