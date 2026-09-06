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

        @keyframes buildUp {
          0% { height: 0%; }
          100% { height: 100%; }
        }

        @keyframes roofRise {
          0% { transform: translateY(20px); opacity: 0; }
          50% { opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }

        @keyframes windowGlow {
          0%, 20% { opacity: 0; }
          30% { opacity: 0.3; }
          50% { opacity: 1; }
          100% { opacity: 1; }
        }

        @keyframes craneMove {
          0% { transform: translateX(-100px) rotate(-5deg); }
          50% { transform: translateX(80px) rotate(0deg); }
          100% { transform: translateX(-100px) rotate(-5deg); }
        }

        .construction-bg {
          background: linear-gradient(180deg, #87CEEB 0%, #E0F4FF 100%);
          position: relative;
          overflow: hidden;
        }

        .building-scene {
          position: absolute;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: flex-end;
          justify-content: center;
          padding-bottom: 80px;
        }

        .building-frame {
          position: relative;
          width: 280px;
          height: 380px;
        }

        .foundation {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 50px;
          background: linear-gradient(to bottom, #8B7355, #654321);
          border: 3px solid #3d2817;
          width: 100%;
        }

        .walls {
          position: absolute;
          bottom: 50px;
          left: 0;
          right: 0;
          width: 100%;
          height: 220px;
          background: linear-gradient(to right, #E8D7C3 0%, #F5EBE0 50%, #E8D7C3 100%);
          border-left: 3px solid #999;
          border-right: 3px solid #999;
          animation: buildUp 3s ease-out forwards;
          overflow: hidden;
        }

        .window {
          position: absolute;
          width: 38px;
          height: 38px;
          background: #87CEEB;
          border: 2px solid #333;
          box-shadow: inset 0 0 8px rgba(197, 160, 89, 0.4);
          opacity: 0;
          animation: windowGlow 2s ease-out forwards;
        }

        .window-1 { top: 30px; left: 35px; animation-delay: 1.5s; }
        .window-2 { top: 30px; right: 35px; animation-delay: 1.7s; }
        .window-3 { top: 100px; left: 35px; animation-delay: 1.9s; }
        .window-4 { top: 100px; right: 35px; animation-delay: 2.1s; }
        .window-5 { top: 170px; left: 35px; animation-delay: 2.3s; }
        .window-6 { top: 170px; right: 35px; animation-delay: 2.5s; }

        .roof {
          position: absolute;
          bottom: 270px;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 0;
          border-left: 140px solid transparent;
          border-right: 140px solid transparent;
          border-bottom: 90px solid #8B4513;
          animation: roofRise 1.5s ease-out 2.5s forwards;
          opacity: 0;
        }

        .door {
          position: absolute;
          bottom: 50px;
          left: 50%;
          transform: translateX(-35px);
          width: 70px;
          height: 100px;
          background: #654321;
          border: 2px solid #3d2817;
          border-radius: 3px;
          opacity: 0;
          animation: windowGlow 1.5s ease-out 2.8s forwards;
        }

        .door-handle {
          position: absolute;
          top: 45px;
          right: 12px;
          width: 8px;
          height: 8px;
          background: #C5A059;
          border-radius: 50%;
        }

        .crane {
          position: absolute;
          top: 40px;
          left: 50%;
          transform: translateX(-50%);
          width: 280px;
          height: 100px;
        }

        .crane-tower {
          position: absolute;
          left: 50%;
          transform: translateX(-6px);
          top: 0;
          width: 12px;
          height: 80px;
          background: #666;
        }

        .crane-arm {
          position: absolute;
          top: 20px;
          left: 50%;
          transform-origin: left center;
          width: 150px;
          height: 8px;
          background: #555;
          border-radius: 4px;
          animation: craneMove 6s ease-in-out infinite;
        }

        .crane-cable {
          position: absolute;
          top: 28px;
          left: calc(50% + 140px);
          width: 2px;
          height: 60px;
          background: #999;
          animation: craneMove 6s ease-in-out infinite;
        }

        .crane-hook {
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-6px);
          width: 12px;
          height: 15px;
          background: #C5A059;
          border-radius: 0 0 6px 6px;
          animation: craneMove 6s ease-in-out infinite;
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

      {/* Construction Scene Section with Tagline */}
      <section className="construction-bg py-32 relative h-96">
        {/* Animated construction scene */}
        <div className="building-scene">
          <div className="building-frame">
            {/* Crane */}
            <div className="crane">
              <div className="crane-tower"></div>
              <div className="crane-arm"></div>
              <div className="crane-cable"></div>
              <div className="crane-hook"></div>
            </div>

            {/* Building */}
            <div className="walls">
              <div className="window window-1"></div>
              <div className="window window-2"></div>
              <div className="window window-3"></div>
              <div className="window window-4"></div>
              <div className="window window-5"></div>
              <div className="window window-6"></div>
            </div>
            <div className="roof"></div>
            <div className="door">
              <div className="door-handle"></div>
            </div>
            <div className="foundation"></div>
          </div>
        </div>

        {/* Tagline Section */}
        <div className="mx-auto max-w-4xl px-6 text-center relative z-10 absolute inset-0 flex flex-col items-center justify-center">
          <p className="font-serif italic text-navy text-2xl md:text-4xl mb-4 leading-relaxed">
            "It's not what you do,
          </p>
          <p className="font-serif italic text-navy text-3xl md:text-5xl font-bold leading-relaxed">
            it's how you do it."
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-brass to-transparent mx-auto mt-8 mb-12"></div>
          <p className="text-navy/70 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Built from the ground up. Excellence in execution. Direct partnerships with developers and investors.
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
