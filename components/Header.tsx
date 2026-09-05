import Link from "next/link";
import type { TenantConfig } from "@/tenants/types";
import { Wordmark } from "./Wordmark";

export function Header({ tenant }: { tenant: TenantConfig }) {
  return (
    <header className="bg-navy">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-5">
        <Link href="/" className="shrink-0">
          <Wordmark tenant={tenant} variant="light" />
        </Link>
        <nav className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-steel">
          {tenant.nav.map((link, i) => (
            <span key={link.href} className="flex items-center gap-6">
              {i > 0 && <span className="text-brass">◆</span>}
              <Link href={link.href} className="hover:text-white">
                {link.label}
              </Link>
            </span>
          ))}
          <a
            href={tenant.contact.phoneHref}
            className="border border-brass px-4 py-2 text-brass hover:bg-brass hover:text-navy-deep"
          >
            {tenant.contact.phone}
          </a>
        </nav>
      </div>
    </header>
  );
}
