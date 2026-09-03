import Image from "next/image";
import type { TenantConfig } from "@/tenants/types";

/**
 * Real closed transactions — photos and specs sourced from the operator's
 * own records, not stock or placeholder listings. Each card shows the sold
 * price plainly (these are closed deals, not active listings) so nothing
 * here reads as a current-inventory claim.
 */
export function PortfolioSection({ tenant }: { tenant: TenantConfig }) {
  return (
    <section className="bg-parchment py-20">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-center font-serif text-3xl text-navy">
          {tenant.copy.portfolioHeading}
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-navy/70">
          {tenant.copy.portfolioIntro}
        </p>

        <div className="mt-12 grid gap-10 md:grid-cols-2">
          {tenant.copy.soldProperties.map((property) => (
            <article
              key={property.id}
              className="border border-navy/10 bg-white"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-navy/5">
                <Image
                  src={property.photos[0]}
                  alt={`${property.address}, ${property.cityStateZip}`}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover"
                />
                <p className="absolute bottom-0 right-0 bg-navy/90 px-3 py-1 text-sm font-semibold text-white">
                  Sold {property.soldPrice}
                </p>
              </div>

              {property.photos.length > 1 ? (
                <div className="grid grid-cols-4 gap-0.5 bg-navy/10 p-0.5">
                  {property.photos.slice(1, 5).map((photo) => (
                    <div key={photo} className="relative aspect-square overflow-hidden">
                      <Image
                        src={photo}
                        alt={`${property.address} additional view`}
                        fill
                        sizes="150px"
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              ) : null}

              <div className="p-6">
                <h3 className="font-serif text-xl text-navy">
                  {property.address}
                </h3>
                <p className="text-sm text-navy/60">{property.cityStateZip}</p>
                <p className="mt-2 text-sm font-semibold uppercase tracking-wide text-brass">
                  {property.specs}
                </p>
                <p className="mt-3 text-navy/70">{property.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
