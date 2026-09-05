import { getTenant } from "@/tenants";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { JsonLdScript } from "@/components/JsonLdScript";
import { buildGraph } from "@/lib/jsonld";
import { buildMetadata } from "@/lib/metadata";

export const dynamic = "force-static";

export const metadata = buildMetadata({
  title: "Institutional Investor Portal - Off-Market Deals",
  description:
    "Access off-market acquisition opportunities. Engineered returns through distressed asset acquisition and development projects.",
  path: "/invest",
});

const METRICS = [
  { value: "12%+", label: "Target Cap Rate" },
  { value: "$14.2M", label: "YTD Acquisition Volume" },
  { value: "14 days", label: "Average Closing Velocity" },
];

const PIPELINE = [
  {
    id: "ACQ-2024-001",
    class: "C",
    location: "Bakersfield, CA",
    acquisitionPrice: "$185,000",
    projectedArv: "$285,000",
    status: "Under Contract",
  },
  {
    id: "ACQ-2024-002",
    class: "B",
    location: "Kern County, CA",
    acquisitionPrice: "$425,000",
    projectedArv: "$595,000",
    status: "In Escrow",
  },
  {
    id: "ACQ-2024-003",
    class: "C",
    location: "Tehachapi, CA",
    acquisitionPrice: "$165,000",
    projectedArv: "$245,000",
    status: "Analyzing",
  },
  {
    id: "ACQ-2024-004",
    class: "B",
    location: "Bakersfield, CA",
    acquisitionPrice: "$575,000",
    projectedArv: "$795,000",
    status: "Off-Market",
  },
];

export default function InvestPage() {
  const tenant = getTenant();

  return (
    <>
      <JsonLdScript
        graph={buildGraph(tenant, {
          breadcrumbs: [
            { name: "Home", path: "/" },
            { name: "Invest", path: "/invest" },
          ],
          service: {
            pillar: "invest",
            name: "Institutional investor capital platform",
            description: "Off-market acquisition platform for distressed assets and development projects.",
          },
        })}
      />
      <Header tenant={tenant} />

      {/* Hero */}
      <section className="bg-navy py-20 md:py-32">
        <div className="mx-auto max-w-4xl px-6">
          <p className="font-serif italic text-brass">Invest</p>
          <h1 className="mt-4 font-serif text-4xl md:text-6xl text-white">
            Engineered Returns
          </h1>
          <p className="mt-6 text-lg text-steel max-w-2xl">
            Institutional precision in real estate acquisition. Off-market deal flow, engineered closings, and capital-efficient structuring across Kern County and Central California.
          </p>
        </div>
      </section>

      {/* Metrics */}
      <section className="bg-white border-y border-navy/10 py-16">
        <div className="mx-auto max-w-5xl px-6">
          <div className="grid gap-8 md:grid-cols-3">
            {METRICS.map((metric) => (
              <div key={metric.label} className="text-center">
                <p className="font-serif text-4xl md:text-5xl text-brass font-bold">
                  {metric.value}
                </p>
                <p className="mt-2 text-sm font-semibold uppercase tracking-[0.2em] text-navy/60">
                  {metric.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Active Pipeline */}
      <section className="bg-navy py-20">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="font-serif text-3xl text-white mb-10">Active Pipeline</h2>
          <div className="overflow-x-auto border border-brass/20 bg-navy-deep">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-brass/20">
                  <th className="px-6 py-4 text-left font-serif text-brass">Asset ID</th>
                  <th className="px-6 py-4 text-left font-serif text-brass">Class</th>
                  <th className="px-6 py-4 text-left font-serif text-brass">Location</th>
                  <th className="px-6 py-4 text-left font-serif text-brass">Acq. Price</th>
                  <th className="px-6 py-4 text-left font-serif text-brass">Proj. ARV</th>
                  <th className="px-6 py-4 text-left font-serif text-brass">Status</th>
                </tr>
              </thead>
              <tbody>
                {PIPELINE.map((item) => (
                  <tr key={item.id} className="border-b border-brass/10 hover:bg-brass/[0.02]">
                    <td className="px-6 py-4 font-mono text-white">{item.id}</td>
                    <td className="px-6 py-4 text-steel">{item.class}</td>
                    <td className="px-6 py-4 text-steel">{item.location}</td>
                    <td className="px-6 py-4 text-steel font-semibold">{item.acquisitionPrice}</td>
                    <td className="px-6 py-4 text-brass font-semibold">{item.projectedArv}</td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-semibold uppercase tracking-[0.1em] text-brass">
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Capital Requirements */}
      <section className="bg-paper py-20">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="font-serif text-3xl text-navy mb-8">Capital Structure</h2>
          <div className="space-y-6">
            <div className="border border-navy/10 bg-white p-6">
              <h3 className="font-serif text-lg text-navy font-bold">Minimum Allocation</h3>
              <p className="mt-2 text-3xl font-bold text-brass">$250,000</p>
              <p className="mt-2 text-navy/70">Institutional minimum to access the full pipeline and priority deal flow.</p>
            </div>
            <div className="border border-navy/10 bg-white p-6">
              <h3 className="font-serif text-lg text-navy font-bold">Target Returns</h3>
              <p className="mt-2 text-3xl font-bold text-brass">12-18% IRR</p>
              <p className="mt-2 text-navy/70">Blended returns across acquisition, fix-and-flip, and development projects.</p>
            </div>
            <div className="border border-navy/10 bg-white p-6">
              <h3 className="font-serif text-lg text-navy font-bold">Fund Structure</h3>
              <p className="mt-2 text-navy/70">
                Quarterly closings. Monthly distributions for performing assets. Direct partnership with operator (Nathaniel Harbison, 10+ years acquisition experience, $50M+ in transactions).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CRM Dashboard Link */}
      <section className="bg-paper py-20">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="font-serif text-3xl text-navy mb-4">Partner Dashboard</h2>
          <p className="text-navy/70 mb-6">
            Access the live deal pipeline, lead board, and performance metrics.
          </p>
          <a
            href="/dashboard"
            className="inline-block bg-navy text-white px-8 py-4 font-bold uppercase tracking-[0.2em] text-sm hover:bg-navy-deep transition-colors"
          >
            View Partner Dashboard
          </a>
        </div>
      </section>

      {/* Request Allocation */}
      <section className="bg-navy py-20">
        <div className="mx-auto max-w-2xl px-6">
          <h2 className="font-serif text-3xl text-white mb-8">Request Capital Access</h2>
          <form className="space-y-6 border border-brass/20 bg-navy-deep p-8">
            <div>
              <label className="block text-sm font-semibold uppercase tracking-[0.1em] text-brass mb-2">
                Entity Type
              </label>
              <select className="w-full border border-brass/30 bg-navy px-4 py-3 text-white placeholder-steel focus:border-brass focus:outline-none">
                <option value="">Select entity type</option>
                <option value="llc">LLC</option>
                <option value="corp">Corporation</option>
                <option value="partnership">Partnership</option>
                <option value="individual">Individual</option>
                <option value="trust">Trust</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold uppercase tracking-[0.1em] text-brass mb-2">
                Proposed Allocation
              </label>
              <select className="w-full border border-brass/30 bg-navy px-4 py-3 text-white placeholder-steel focus:border-brass focus:outline-none">
                <option value="">Select allocation amount</option>
                <option value="250k">$250,000</option>
                <option value="500k">$500,000</option>
                <option value="1m">$1,000,000</option>
                <option value="2m">$2,000,000+</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold uppercase tracking-[0.1em] text-brass mb-2">
                Name
              </label>
              <input
                type="text"
                placeholder="Your name"
                className="w-full border border-brass/30 bg-navy px-4 py-3 text-white placeholder-steel focus:border-brass focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold uppercase tracking-[0.1em] text-brass mb-2">
                Email
              </label>
              <input
                type="email"
                placeholder="your@email.com"
                className="w-full border border-brass/30 bg-navy px-4 py-3 text-white placeholder-steel focus:border-brass focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-brass text-navy py-3 font-bold uppercase tracking-[0.2em] text-sm hover:bg-brass/90 transition-colors"
            >
              Request Access
            </button>

            <p className="text-xs text-steel text-center">
              We will contact you within 24 hours to discuss fund structure and next steps.
            </p>
          </form>
        </div>
      </section>

      <Footer tenant={tenant} />
    </>
  );
}
