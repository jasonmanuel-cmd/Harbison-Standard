import { getTenant } from "@/tenants";
import { Wordmark } from "@/components/Wordmark";
import { BenchmarkMark } from "@/components/BenchmarkMark";

// Phase 0 scaffold page: proves the tenant config, brand tokens, and
// wordmark/mark components render correctly. Full hero copy, service
// cards, proof strip, FAQ, and the lead form land in Phase 1 (§7.1).
export const dynamic = "force-static";

export default function HomePage() {
  const tenant = getTenant();

  return (
    <>
      <header className="bg-navy">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <Wordmark tenant={tenant} variant="light" />
          <nav className="hidden gap-6 text-sm text-steel md:flex">
            {tenant.nav.map((link, i) => (
              <span key={link.href} className="flex items-center gap-6">
                {i > 0 && <span className="text-brass">◆</span>}
                <a href={link.href} className="hover:text-white">
                  {link.label}
                </a>
              </span>
            ))}
          </nav>
        </div>
      </header>

      <section className="relative overflow-hidden bg-navy">
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
            <a
              href="/build"
              className="border border-steel px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white"
            >
              {tenant.copy.heroSecondaryCta}
            </a>
          </div>
        </div>
      </section>

      <footer className="bg-navy-deep py-8 text-center text-sm text-steel">
        <p>{tenant.contact.complianceFooter}</p>
      </footer>
    </>
  );
}
