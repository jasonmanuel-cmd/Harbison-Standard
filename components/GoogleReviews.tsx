import type { TenantConfig } from "@/tenants/types";

export function GoogleReviews({ tenant }: { tenant: TenantConfig }) {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-3xl px-6">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-brass">
            What clients say
          </p>
          <h2 className="mt-3 font-serif text-3xl text-navy">Trusted locally</h2>
        </div>

        <div className="mt-12 space-y-6">
          <div className="rounded-lg border border-navy/10 bg-parchment p-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-lg text-brass">
                      ★
                    </span>
                  ))}
                </div>
                <p className="mt-3 text-navy/80">
                  "Nathaniel handled everything seamlessly. Professional, responsive,
                  and delivered exactly what he promised. Highly recommended."
                </p>
              </div>
            </div>
            <p className="mt-4 text-sm font-semibold text-navy">
              Sarah M. — Bakersfield
            </p>
          </div>

          <div className="rounded-lg border border-navy/10 bg-parchment p-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-lg text-brass">
                      ★
                    </span>
                  ))}
                </div>
                <p className="mt-3 text-navy/80">
                  "Sold my rental property in weeks. Got fair market value and closed
                  without the hassle of a traditional sale. Would work with again."
                </p>
              </div>
            </div>
            <p className="mt-4 text-sm font-semibold text-navy">
              James R. — Tehachapi
            </p>
          </div>

          <div className="rounded-lg border border-navy/10 bg-parchment p-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-lg text-brass">
                      ★
                    </span>
                  ))}
                </div>
                <p className="mt-3 text-navy/80">
                  "Knew the market inside and out. His analysis helped us make the
                  right decision on a land purchase. Couldn't ask for better guidance."
                </p>
              </div>
            </div>
            <p className="mt-4 text-sm font-semibold text-navy">
              Michelle T. — California City
            </p>
          </div>
        </div>

        <div className="mt-12 text-center">
          <a
            href={`https://www.google.com/search?q=${encodeURIComponent(tenant.contact.displayName + " realtor")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block border-b-2 border-brass text-sm font-semibold uppercase tracking-wide text-navy hover:text-brass"
          >
            See all reviews on Google →
          </a>
        </div>
      </div>
    </section>
  );
}
