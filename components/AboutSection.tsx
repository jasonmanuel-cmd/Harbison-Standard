import Image from "next/image";
import type { TenantConfig } from "@/tenants/types";

export function AboutSection({ tenant }: { tenant: TenantConfig }) {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto grid max-w-4xl items-center gap-10 px-6 md:grid-cols-[240px,1fr]">
        {tenant.copy.aboutPhotoPath ? (
          <Image
            src={tenant.copy.aboutPhotoPath}
            alt={tenant.contact.displayName}
            width={240}
            height={240}
            className="mx-auto h-60 w-60 rounded-full object-cover md:mx-0"
          />
        ) : null}
        <div>
          <p className="font-serif text-xs font-semibold uppercase tracking-[0.3em] text-brass">
            {tenant.contact.roleLine}
          </p>
          <h2 className="mt-3 font-serif text-3xl text-navy">
            {tenant.copy.aboutHeading}
          </h2>
          <p className="mt-4 text-navy/80">{tenant.copy.aboutBody}</p>
          <p className="mt-4 text-sm text-navy/60">{tenant.contact.licenseLine}</p>
        </div>
      </div>
    </section>
  );
}
