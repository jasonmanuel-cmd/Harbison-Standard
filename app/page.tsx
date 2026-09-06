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

      {/* Hero Section with Property Image */}
      <section className="relative w-full h-screen flex items-center justify-center overflow-hidden">
        <img
          src="/portfolio/house1.jpg"
          alt="Premium property development"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="hero-overlay"></div>

        <div className="relative z-10 text-center max-w-4xl px-6">
          <p className="text-brass uppercase tracking-widest font-semibold text-sm mb-6">The Harbison Standard</p>
          <h1 className="font-serif text-5xl md:text-7xl text-white mb-6 leading-tight">
            Built from the <span className="text-brass">ground up</span>
          </h1>
          <p className="text-white/90 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed">
            It's not what you do, it's <span className="font-semibold text-brass">how you do it.</span> Premium real estate development and institutional investment.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/offer"
              className="bg-brass text-navy px-8 py-4 font-bold uppercase tracking-wider text-sm hover:bg-brass/90 transition-colors shadow-lg"
            >
              Explore Properties
            </Link>
            <Link
              href="/invest"
              className="border-2 border-brass text-brass px-8 py-4 font-bold uppercase tracking-wider text-sm hover:bg-brass hover:text-navy transition-colors"
            >
              Investor Access
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
          <div className="text-white/60 text-sm uppercase tracking-widest animate-bounce">Scroll to explore</div>
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
                image: "/portfolio/house1a.jpg",
              },
              {
                title: "Development",
                description: "From first idea to final finish, we shape considered spaces with a lasting point of view.",
                image: "/portfolio/house2.jpg",
              },
              {
                title: "Investing",
                description: "Selective partnerships built around alignment, diligence, and long-term conviction.",
                image: "/portfolio/house2a.jpg",
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
                src="/portfolio/house1b.webp"
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
