import type { TenantConfig } from "@/tenants/types";

export function TrustBadges({ tenant }: { tenant: TenantConfig }) {
  return (
    <section className="bg-white py-12">
      <div className="mx-auto max-w-5xl px-6">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="border border-brass/20 bg-brass/5 p-6 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brass">
              Licensed Professional
            </p>
            <p className="mt-2 font-serif text-lg text-navy">{tenant.contact.licenseLine}</p>
            <p className="mt-2 text-sm text-navy/60">
              California Department of Real Estate verification available on request.
            </p>
          </div>

          <div className="border border-brass/20 bg-brass/5 p-6 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brass">
              10+ Years Experience
            </p>
            <p className="mt-2 font-serif text-lg text-navy">Kern County Specialist</p>
            <p className="mt-2 text-sm text-navy/60">
              Full-cycle expertise: sales, development, investment analysis.
            </p>
          </div>

          <div className="border border-brass/20 bg-brass/5 p-6 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brass">
              Direct Access
            </p>
            <p className="mt-2 font-serif text-lg text-navy">One Contact, Start to Finish</p>
            <p className="mt-2 text-sm text-navy/60">
              No team handoffs. You work with the same person throughout.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
