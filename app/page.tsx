import { getTenant } from "@/tenants";
import { JsonLdScript } from "@/components/JsonLdScript";
import { buildGraph } from "@/lib/jsonld";

export const dynamic = "force-static";

export const metadata = {
  title: "Harbison Standard | Wholesale Acquisition & Institutional Capital",
  description:
    "Acquisition platform for cash sellers and institutional investors. Direct offers on properties. Off-market deal flow.",
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
        body {
          margin: 0;
          overflow: hidden;
          background-color: #051024;
        }

        @media (min-width: 768px) {
          .panel-hover {
            transition: flex 0.7s cubic-bezier(0.25, 1, 0.5, 1), background-color 0.5s ease;
          }
          .panel-hover:hover {
            flex: 1.15;
          }
        }

        .scanlines::before {
          content: " ";
          display: block;
          position: absolute;
          top: 0;
          left: 0;
          bottom: 0;
          right: 0;
          background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.1) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.03), rgba(0, 255, 0, 0.01), rgba(0, 0, 255, 0.03));
          z-index: 100;
          background-size: 100% 3px, 3px 100%;
          pointer-events: none;
          opacity: 0.4;
        }
      `}</style>

      <div className="relative flex h-screen w-screen flex-col overflow-hidden bg-navy text-white md:flex-row scanlines">
        {/* Logo Header */}
        <div className="absolute top-8 left-1/2 z-50 -translate-x-1/2 w-full px-4 md:top-12">
          <div className="mx-auto flex w-fit flex-col items-center">
            <div className="border border-brass bg-navy/95 backdrop-blur-md p-4 md:p-6 flex items-center justify-center space-x-4 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
              <div className="relative w-12 h-12 md:w-16 md:h-16 border border-brass rounded-full flex items-center justify-center">
                <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-brass -translate-x-1/2"></div>
                <div className="absolute left-0 right-0 top-1/2 h-[1px] bg-brass -translate-y-1/2"></div>
                <span className="font-serif text-2xl md:text-4xl text-brass relative z-10 bg-navy/90 px-1">
                  H
                </span>
              </div>
              <div className="text-left pl-2 border-l border-brass/30">
                <h1 className="font-serif text-xl md:text-3xl tracking-widest text-white uppercase font-bold leading-none mb-1">
                  Harbison
                </h1>
                <h2 className="font-sans text-[0.6rem] md:text-xs tracking-[0.3em] md:tracking-[0.4em] font-light text-brass uppercase">
                  Standard
                </h2>
              </div>
            </div>
          </div>
        </div>

        {/* Sell Panel */}
        <a
          href="/offer"
          className="group panel-hover flex-1 flex flex-col justify-center items-center p-8 md:p-16 border-b md:border-b-0 md:border-r border-white/10 relative hover:bg-white/[0.02] cursor-pointer outline-none focus:ring-4 focus:ring-white/20"
        >
          <div className="max-w-md text-center z-10 relative mt-24 md:mt-0">
            <h2 className="font-serif text-4xl md:text-6xl font-bold mb-4 text-white group-hover:-translate-y-2 transition-transform duration-500 ease-out">
              I Need To Sell<br />A Property
            </h2>
            <div className="w-12 h-[1px] bg-white mx-auto mb-6 group-hover:scale-x-150 transition-transform duration-500"></div>
            <p className="text-gray-400 text-sm md:text-base tracking-wide mb-10 leading-relaxed font-light px-4">
              Direct cash offers, flexible timelines, zero agent fees. We buy properties direct.
            </p>
            <button className="uppercase tracking-[0.2em] text-xs md:text-sm font-bold border border-white text-white px-10 py-5 hover:bg-white hover:text-navy transition-all duration-300 w-full md:w-auto">
              Get My Offer
            </button>
          </div>
          <div className="absolute bottom-4 left-8 text-white/5 font-serif text-7xl md:text-[12rem] pointer-events-none select-none leading-none">
            01
          </div>
        </a>

        {/* Invest Panel */}
        <a
          href="/invest"
          className="group panel-hover flex-1 flex flex-col justify-center items-center p-8 md:p-16 relative hover:bg-brass/[0.03] cursor-pointer outline-none focus:ring-4 focus:ring-brass/30"
        >
          <div className="max-w-md text-center z-10 relative mb-12 md:mb-0 mt-8 md:mt-0">
            <h2 className="font-serif text-4xl md:text-6xl font-bold mb-4 text-brass group-hover:-translate-y-2 transition-transform duration-500 ease-out">
              I Am An<br />Investor
            </h2>
            <div className="w-12 h-[1px] bg-brass mx-auto mb-6 group-hover:scale-x-150 transition-transform duration-500"></div>
            <p className="text-gray-400 text-sm md:text-base tracking-wide mb-10 leading-relaxed font-light px-4">
              Access off-market distressed assets, development projects, and institutional private equity opportunities.
            </p>
            <button className="uppercase tracking-[0.2em] text-xs md:text-sm font-bold border border-brass text-brass px-10 py-5 hover:bg-brass hover:text-navy transition-all duration-300 w-full md:w-auto shadow-[0_0_15px_rgba(197,160,89,0)] group-hover:shadow-[0_0_25px_rgba(197,160,89,0.2)]">
              Access Inventory
            </button>
          </div>
          <div className="absolute top-4 right-8 md:top-auto md:bottom-4 md:right-8 text-brass/5 font-serif text-7xl md:text-[12rem] pointer-events-none select-none leading-none">
            02
          </div>
        </a>
      </div>
    </>
  );
}
