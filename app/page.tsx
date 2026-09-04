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
import { TrustBadges } from "@/components/TrustBadges";
import { SocialProof } from "@/components/SocialProof";
import { ComparisonTable } from "@/components/ComparisonTable";

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

      <section className="relative flex min-h-[92vh] items-center overflow-hidden bg-navy">
        {/* object-cover (not contain) is deliberate: this is a full-bleed
            hero banner, not a boxed picture — the section has a real
            min-height so the crop stays reasonable at every viewport
            instead of the aggressive zoom a short/narrow container would
            force. animate-kenburns is a slow, one-shot CSS scale — pure
            CSS, no JS, so a no-JS browser just sees the plain video. */}
        <video
          className="absolute inset-0 h-full w-full origin-center animate-kenburns object-cover object-center"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
        >
          <source src="/media/hero.mp4" type="video/mp4" />
        </video>
        <div
          className="absolute inset-0 bg-gradient-to-t from-navy-deep via-navy/70 to-navy/30"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-navy-deep/80 via-transparent to-transparent"
          aria-hidden="true"
        />
        <BenchmarkMark className="pointer-events-none absolute -right-16 top-1/2 h-96 w-96 -translate-y-1/2 text-brass opacity-10" />

        <div className="relative mx-auto w-full max-w-3xl px-6 py-24">
          <p className="animate-fade-up inline-flex items-center gap-2 border border-brass/40 bg-navy-deep/60 px-4 py-2 font-serif text-xs font-semibold uppercase tracking-[0.3em] text-brass backdrop-blur-sm">
            <span aria-hidden="true">◆</span>
            {tenant.contact.roleLine}
          </p>
          <h1 className="animate-fade-up mt-6 font-serif text-5xl leading-[1.05] text-white [animation-delay:150ms] [text-shadow:0_2px_24px_rgba(0,0,0,0.45)] md:text-7xl">
            {tenant.copy.heroHeadline.replace(
              tenant.copy.heroHeadlineHighlight,
              "",
            )}
            <span className="text-brass">
              {tenant.copy.heroHeadlineHighlight}
            </span>
          </h1>
          <p className="animate-fade-up mt-6 max-w-xl text-lg text-steel [animation-delay:300ms]">
            {tenant.copy.heroSubcopy}
          </p>
          <div className="animate-fade-up mt-10 flex flex-wrap gap-4 [animation-delay:450ms]">
            <a
              href="#lead-form"
              className="bg-brass px-8 py-4 text-sm font-semibold uppercase tracking-wide text-navy-deep shadow-[0_8px_30px_rgba(201,162,75,0.35)] transition-transform hover:scale-105"
            >
              {tenant.copy.heroPrimaryCta}
            </a>
            <Link
              href="/build"
              className="border border-white/40 bg-white/5 px-8 py-4 text-sm font-semibold uppercase tracking-wide text-white backdrop-blur-sm transition-colors hover:border-white hover:bg-white/15"
            >
              {tenant.copy.heroSecondaryCta}
            </Link>
          </div>
          <p className="animate-fade-up mt-12 text-xs uppercase tracking-[0.3em] text-steel/70 [animation-delay:600ms]">
            {tenant.contact.licenseLine} · Equal Housing Opportunity
          </p>
        </div>
      </section>

      <TrustBadges tenant={tenant} />

      {/* Deliberately light, not navy: the header + hero above this are
          already a full dark band. Stacking a third dark section here
          reads as an undifferentiated wall of navy (confirmed by
          screenshot during dev) rather than a designed rhythm. */}
      <section className="border-y border-navy/10 bg-paper py-14">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-x-6 gap-y-10 divide-navy/10 px-6 text-center md:grid-cols-4 md:divide-x">
          {tenant.copy.proofStats.map((stat) => (
            <div key={stat.label} className="px-2">
              <p className="font-serif text-4xl text-navy md:text-5xl">
                {stat.value}
              </p>
              <p className="mt-2 text-xs font-semibold uppercase tracking-[0.2em] text-navy/60">
                {stat.label}
              </p>
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

      <SocialProof />

      <section className="relative overflow-hidden bg-navy-deep py-20">
        <BenchmarkMark className="pointer-events-none absolute -left-24 -top-24 h-96 w-96 text-brass opacity-[0.04]" />
        <div className="relative mx-auto max-w-5xl px-6">
          <p className="text-center font-serif text-xs font-semibold uppercase tracking-[0.3em] text-brass">
            One point of contact, every stage
          </p>
          <h2 className="mt-3 text-center font-serif text-3xl text-white md:text-4xl">
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
                <div className="grid gap-6 border border-white/10 bg-white/[0.03] p-8 transition-colors duration-300 hover:border-brass/40 hover:bg-white/[0.06] md:grid-cols-[auto,1fr] md:items-center md:gap-10 md:p-12">
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
                      className="group mt-6 inline-flex items-center gap-2 border-b border-brass text-sm font-semibold uppercase tracking-wide text-brass hover:text-white"
                    >
                      Learn more
                      <span className="transition-transform group-hover:translate-x-1">
                        →
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ComparisonTable />

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
