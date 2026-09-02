import Link from "next/link";
import type { TenantConfig } from "@/tenants/types";

export function Footer({ tenant }: { tenant: TenantConfig }) {
  return (
    <footer className="bg-navy-deep py-10 text-steel">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 text-center">
        <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
          {tenant.nav.map((link, i) => (
            <span key={link.href} className="flex items-center gap-6">
              {i > 0 && <span className="text-brass">◆</span>}
              <Link href={link.href} className="hover:text-white">
                {link.label}
              </Link>
            </span>
          ))}
        </nav>
        <p className="text-sm">
          <a href={tenant.contact.phoneHref} className="hover:text-white">
            {tenant.contact.phone}
          </a>
          {" · "}
          <a href={`mailto:${tenant.contact.email}`} className="hover:text-white">
            {tenant.contact.email}
          </a>
        </p>
        <p className="text-xs">{tenant.contact.complianceFooter}</p>
        <p className="text-xs">
          <Link href="/privacy" className="hover:text-white">
            Privacy
          </Link>
          {" · "}
          <Link href="/terms" className="hover:text-white">
            Terms
          </Link>
        </p>
      </div>
    </footer>
  );
}
