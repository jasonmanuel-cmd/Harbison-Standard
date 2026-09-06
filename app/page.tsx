import { getTenant } from "@/tenants";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { JsonLdScript } from "@/components/JsonLdScript";
import { buildGraph } from "@/lib/jsonld";
import Link from "next/link";
import Image from "next/image";

export const dynamic = "force-static";

export const metadata = {
  title: "Harbison Standard | Premium Real Estate Development & Investment",
  description:
    "Premier real estate development, acquisition, and institutional investment in California. Built from the ground up with precision and vision.",
};

export default function HomePage() {
  const tenant = getTenant();

  return (
    <>
      <JsonLdScript
        graph={buildGraph(tenant, {
          breadcrumbs: [{ name: "Home", path: "/" }],
        })}
      />

      <style>{`
        .hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(5, 16, 36, 0.6) 0%, rgba(5, 16, 36, 0.4) 100%);
        }

        .section-divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(197, 160, 89, 0.5), transparent);
        }

        .capabilities-card {
          position: relative;
          overflow: hidden;
          border: 1px solid rgba(197, 160, 89, 0.3);
          transition: all 0.3s ease;
        }

        .capabilities-card:hover {
          border-color: rgba(197, 160, 89, 0.6);
          box-shadow: 0 4px 20px rgba(197, 160, 89, 0.1);
        }

        .capabilities-image {
          width: 100%;
          height: 300px;
          object-fit: cover;
        }

        .gradient-text {
          background: linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}</style>

      <Header tenant={tenant} />

      {/* Hero Section - Three Column Layout */}
      <section className="relative w-full min-h-screen bg-gradient-to-r from-navy via-navy to-navy/95">
        <div className="absolute inset-0 grid grid-cols-3 overflow-hidden">
          {/* Left Column - Headshot */}
          <div className="relative">
            <img
              src="/brand/headshot.webp"
              alt="Nathanael Harbison"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Right Column - Property Image */}
          <div className="col-span-1"></div>
          <div className="relative">
            <img
              src="/portfolio/crestline-dr/1.webp"
              alt="Premium property development"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-l from-transparent to-navy/40"></div>
          </div>
        </div>

        {/* Center Content */}
        <div className="relative z-10 h-full flex items-center justify-center px-8">
          <div className="text-center max-w-2xl">
            {/* Logo Section */}
            <div className="mb-8">
              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="text-brass">
                  <svg className="w-12 h-12" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="1.5"/>
                    <line x1="24" y1="6" x2="24" y2="12" stroke="currentColor" strokeWidth="1.5"/>
                    <line x1="24" y1="36" x2="24" y2="42" stroke="currentColor" strokeWidth="1.5"/>
                    <line x1="6" y1="24" x2="12" y2="24" stroke="currentColor" strokeWidth="1.5"/>
                    <line x1="36" y1="24" x2="42" y2="24" stroke="currentColor" strokeWidth="1.5"/>
                  </svg>
                </div>
                <h1 className="font-serif text-4xl text-white tracking-wide">HARBISON<br />STANDARD</h1>
              </div>
              <p className="text-brass uppercase tracking-widest font-semibold text-xs">Real Estate • Development • Investing</p>
            </div>

            {/* Tagline */}
            <div className="mb-8">
              <p className="font-serif text-3xl md:text-4xl text-white italic leading-relaxed">
                It's not what you do,<br />
                <span className="text-brass">it's how you do it.</span>
              </p>
            </div>

            {/* Name and Credentials */}
            <div className="border-t border-brass/50 pt-6">
              <h2 className="font-serif text-2xl text-white mb-1">Nathanael Harbison</h2>
              <p className="text-brass uppercase tracking-widest font-semibold text-xs mb-6">Realtor® | DRE# 02059393</p>

              <div className="flex flex-wrap gap-4 justify-center">
                <Link
                  href="/offer"
                  className="bg-brass text-navy px-6 py-3 font-bold uppercase tracking-wider text-xs hover:bg-brass/90 transition-colors"
                >
                  Sell Your Property
                </Link>
                <Link
                  href="/invest"
                  className="border border-brass text-brass px-6 py-3 font-bold uppercase tracking-wider text-xs hover:bg-brass hover:text-navy transition-colors"
                >
                  Investor Access
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side Text Accent */}
        <div className="absolute right-8 top-1/2 transform -translate-y-1/2 z-20 text-right">
          <p className="text-brass uppercase tracking-widest font-semibold text-xs mb-32">People.</p>
          <p className="text-brass uppercase tracking-widest font-semibold text-xs mb-32">Properties.</p>
          <p className="text-brass uppercase tracking-widest font-semibold text-xs mb-32">Potential.</p>
        </div>

        {/* Bottom Right Text */}
        <div className="absolute right-8 bottom-8 z-20">
          <p className="text-brass/80 uppercase tracking-widest font-semibold text-xs">From the Ground Up.</p>
        </div>
      </section>

      {/* Tagline Section */}
      <section className="bg-navy py-24 text-center">
        <div className="mx-auto max-w-3xl px-6">
          <p className="text-brass uppercase text-sm tracking-widest font-semibold mb-4">Our Philosophy</p>
          <h2 className="font-serif text-4xl md:text-5xl text-white mb-8 leading-tight">
            Less noise.<br />More <span className="text-brass">signal.</span>
          </h2>
          <p className="text-white/70 text-lg leading-relaxed">
            We bring quiet discretion, sharp thinking, and an uncommon level of care to every property and partnership. The best opportunities are rarely the loudest ones.
          </p>
        </div>
      </section>

      {/* Three Disciplines Section */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-16">
            <p className="text-brass uppercase text-sm tracking-widest font-semibold mb-4">Our Approach</p>
            <h2 className="font-serif text-4xl md:text-5xl text-navy leading-tight">
              One perspective.<br /><span className="text-brass">Three disciplines.</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Real Estate",
                description: "Advisory grounded in place, timing, and the details that make a property matter.",
                image: "/portfolio/windsong-st/1.jpg",
              },
              {
                title: "Development",
                description: "From first idea to final finish, we shape considered spaces with a lasting point of view.",
                image: "/portfolio/crestline-dr/1.webp",
              },
              {
                title: "Investing",
                description: "Selective partnerships built around alignment, diligence, and long-term conviction.",
                image: "/portfolio/alsab-pl/1.jpg",
              },
            ].map((discipline) => (
              <div key={discipline.title} className="capabilities-card bg-white border border-navy/10">
                <img
                  src={discipline.image}
                  alt={discipline.title}
                  className="capabilities-image"
                />
                <div className="p-8">
                  <h3 className="font-serif text-2xl text-navy font-bold mb-4">{discipline.title}</h3>
                  <p className="text-navy/70 leading-relaxed">{discipline.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="bg-navy/5 py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left: Text */}
            <div>
              <p className="text-brass uppercase text-sm tracking-widest font-semibold mb-4">Our Process</p>
              <h2 className="font-serif text-4xl md:text-5xl text-navy leading-tight mb-8">
                Clarity at <span className="text-brass">every turn.</span>
              </h2>
              <ul className="space-y-6">
                {[
                  { num: "01", title: "Listen closely", desc: "We start with the real context, create a focused path forward, and stay close to the work until the right result is in reach." },
                  { num: "02", title: "Find the throughline", desc: "We identify the core logic connecting opportunity to outcome, and work within it." },
                  { num: "03", title: "Move with intention", desc: "Every decision is deliberate. Every step advances the goal. No noise, no shortcuts." },
                ].map((step) => (
                  <div key={step.num} className="flex gap-6">
                    <div className="text-brass text-2xl font-bold font-serif">{step.num}</div>
                    <div>
                      <h4 className="font-serif text-xl text-navy mb-2">{step.title}</h4>
                      <p className="text-navy/70 leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </ul>
            </div>

            {/* Right: Image */}
            <div className="relative h-96">
              <img
                src="/portfolio/woodshawn-dr/1.webp"
                alt="Development process"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-navy to-navy/90 py-24 text-white">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <p className="text-brass uppercase text-sm tracking-widest font-semibold mb-4">Ready to Connect</p>
          <h2 className="font-serif text-4xl md:text-5xl mb-8 leading-tight">
            Start a <span className="text-brass">conversation</span>
          </h2>
          <p className="text-white/80 text-lg mb-12 leading-relaxed">
            Whether you're a property owner, developer, or investor, we'd like to hear what you're working with and where you're headed.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/offer"
              className="bg-brass text-navy px-8 py-4 font-bold uppercase tracking-wider text-sm hover:bg-brass/90 transition-colors"
            >
              Sell Your Property
            </Link>
            <Link
              href="/invest"
              className="border-2 border-brass text-brass px-8 py-4 font-bold uppercase tracking-wider text-sm hover:bg-brass hover:text-navy transition-colors"
            >
              Explore Opportunities
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-5xl px-6">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { value: "10+", label: "Years Experience" },
              { value: "$50M+", label: "Transactions" },
              { value: "150+", label: "Properties" },
              { value: "2-3 wks", label: "Avg Close Time" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="font-serif text-4xl text-brass font-bold mb-3">{stat.value}</p>
                <p className="text-navy/70 font-semibold uppercase tracking-wider text-xs">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer tenant={tenant} />
    </>
  );
}
