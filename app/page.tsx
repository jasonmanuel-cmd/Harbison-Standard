import { getTenant } from "@/tenants";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { JsonLdScript } from "@/components/JsonLdScript";
import { buildGraph } from "@/lib/jsonld";
import Link from "next/link";

export const dynamic = "force-static";

export const metadata = {
  title: "Harbison Standard | Real Estate Authority - People. Properties. Potential.",
  description:
    "Wholesale acquisition, development, and institutional investment. Direct offers on properties. Off-market deal flow.",
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
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        @keyframes twinkle {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }

        @keyframes shoot {
          0% {
            transform: translateX(0) translateY(0);
            opacity: 1;
          }
          100% {
            transform: translateX(300px) translateY(300px);
            opacity: 0;
          }
        }

        .starry-bg {
          background: linear-gradient(180deg, #0a1628 0%, #051024 50%, #0d1b2a 100%);
          position: relative;
          overflow: hidden;
        }

        .stars {
          position: absolute;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }

        .star {
          position: absolute;
          width: 2px;
          height: 2px;
          background: white;
          border-radius: 50%;
          animation: twinkle 3s ease-in-out infinite;
        }

        .shooting-star {
          position: absolute;
          width: 2px;
          height: 2px;
          background: white;
          border-radius: 50%;
          box-shadow: 0 0 10px 1px rgba(255, 255, 255, 0.5);
          animation: shoot 2s ease-in infinite;
        }

        .gradient-bg {
          background: linear-gradient(-45deg, #f8f9fa, #ffffff, #f0f4f8, #ffffff);
          background-size: 400% 400%;
          animation: gradient-shift 15s ease infinite;
        }

        .float-animation {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>

      <Header tenant={tenant} />

      {/* Starry Night Sky Section with Tagline */}
      <section className="starry-bg py-32 relative">
        {/* Animated stars */}
        <div className="absolute inset-0 stars pointer-events-none">
          {[...Array(50)].map((_, i) => (
            <div
              key={`star-${i}`}
              className="star"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
              }}
            />
          ))}
          {[...Array(5)].map((_, i) => (
            <div
              key={`shooting-${i}`}
              className="shooting-star"
              style={{
                left: `${Math.random() * 80}%`,
                top: `${Math.random() * 60}%`,
                animationDelay: `${i * 0.4}s`,
              }}
            />
          ))}
        </div>

        {/* Tagline Section */}
        <div className="mx-auto max-w-4xl px-6 text-center relative z-10">
          <p className="font-serif italic text-brass text-2xl md:text-4xl mb-4 leading-relaxed">
            "It's not what you do,
          </p>
          <p className="font-serif italic text-white text-3xl md:text-5xl font-bold leading-relaxed">
            it's how you do it."
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-brass to-transparent mx-auto mt-8 mb-12"></div>
          <p className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Excellence in execution. Precision in partnership. Direct, transparent, and committed to doing business the right way.
          </p>
        </div>
      </section>

      {/* Hero Section with Image */}
      <section className="relative overflow-hidden gradient-bg pt-20 pb-32">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left: Text Content */}
            <div className="flex flex-col justify-center">
              <p className="font-serif italic text-brass text-lg mb-4">Welcome to</p>
              <h1 className="font-serif text-5xl md:text-6xl text-navy mb-6 leading-tight">
                People.<br />Properties.<br />Potential.
              </h1>
              <p className="text-lg text-navy/70 mb-8 leading-relaxed">
                Real estate acquisition, development, and institutional investing. Direct, efficient, straightforward.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/offer"
                  className="bg-brass text-white px-8 py-4 font-bold uppercase tracking-wider text-sm hover:bg-brass/90 transition-colors shadow-lg"
                >
                  Sell Your Property
                </Link>
                <Link
                  href="/invest"
                  className="border-2 border-navy text-navy px-8 py-4 font-bold uppercase tracking-wider text-sm hover:bg-navy hover:text-white transition-colors"
                >
                  Investor Access
                </Link>
              </div>
            </div>

            {/* Right: Professional Image */}
            <div className="relative float-animation">
              <div className="bg-white rounded-lg shadow-2xl p-6 border border-brass/20">
                <img
                  src="/brand/headshot.webp"
                  alt="Nathanael Harbison"
                  className="w-full rounded-lg mb-6 object-cover h-96"
                />
                <div className="text-center border-t border-brass/20 pt-6">
                  <h3 className="font-serif text-2xl text-navy font-bold mb-1">Nathanael Harbison</h3>
                  <p className="font-semibold text-brass uppercase tracking-wider text-sm mb-3">Realtor® | DRE# 02059393</p>
                  <p className="text-navy/70 text-sm leading-relaxed">
                    10+ years in Kern County. Developer, investor, and direct acquisition specialist.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Props Section */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="font-serif text-4xl text-navy text-center mb-16">How We Work</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "For Sellers",
                items: ["Direct Cash Offers", "Fast Closing", "No Repairs Required", "Zero Agent Fees"],
              },
              {
                title: "For Developers",
                items: ["Off-Market Deals", "Institutional Capital", "Development Partnerships", "Wholesale Opportunities"],
              },
              {
                title: "For Investors",
                items: ["Curated Pipeline", "Performance Metrics", "12-18% Target Returns", "Quarterly Updates"],
              },
            ].map((group) => (
              <div key={group.title} className="bg-navy/5 border border-navy/10 rounded-lg p-8">
                <h3 className="font-serif text-2xl text-navy mb-6">{group.title}</h3>
                <ul className="space-y-3">
                  {group.items.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="text-brass font-bold mt-1">✓</span>
                      <span className="text-navy/80">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Two-Panel CTA */}
      <section className="bg-gradient-to-r from-navy via-navy/95 to-navy/90 py-20 text-white">
        <div className="mx-auto max-w-5xl px-6">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="border-l-4 border-brass pl-8">
              <h3 className="font-serif text-3xl mb-4">I Need To Sell</h3>
              <p className="text-white/80 mb-6 leading-relaxed">
                Get a direct cash offer on your property. No listing, no showings, no repairs. Close in weeks.
              </p>
              <Link
                href="/offer"
                className="inline-block bg-brass text-navy px-6 py-3 font-bold uppercase tracking-wider hover:bg-brass/90 transition-colors"
              >
                Get an Offer →
              </Link>
            </div>
            <div className="border-l-4 border-brass pl-8">
              <h3 className="font-serif text-3xl mb-4">I'm an Investor</h3>
              <p className="text-white/80 mb-6 leading-relaxed">
                Access curated off-market deals and institutional capital opportunities. 12-18% target returns.
              </p>
              <Link
                href="/invest"
                className="inline-block bg-brass text-navy px-6 py-3 font-bold uppercase tracking-wider hover:bg-brass/90 transition-colors"
              >
                Request Access →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="gradient-bg py-20">
        <div className="mx-auto max-w-5xl px-6">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { value: "10+", label: "Years Active" },
              { value: "$50M+", label: "Transactions" },
              { value: "150+", label: "Properties Closed" },
              { value: "2-3 weeks", label: "Avg. Closing Time" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="font-serif text-4xl text-brass font-bold mb-2">{stat.value}</p>
                <p className="text-navy/70 font-semibold uppercase tracking-wider text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer tenant={tenant} />
    </>
  );
}
