import Link from "next/link";
import type { TenantConfig } from "@/tenants/types";

export function Header({ tenant }: { tenant: TenantConfig }) {
  return (
    <header className="bg-white border-b border-navy/10 sticky top-0 z-40 shadow-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        {/* Logo with Border */}
        <Link href="/" className="shrink-0 flex items-center gap-3">
          <div className="relative w-10 h-10 border-2 border-brass rounded-full flex items-center justify-center bg-white">
            <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-brass -translate-x-1/2"></div>
            <div className="absolute left-0 right-0 top-1/2 h-[1px] bg-brass -translate-y-1/2"></div>
            <span className="font-serif text-lg text-brass font-bold relative z-10">H</span>
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-lg font-bold text-navy">Harbison</span>
            <span className="font-sans text-xs tracking-widest text-brass uppercase font-semibold">Standard</span>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-6 ml-auto">
          <div className="hidden md:flex items-center gap-6 text-sm">
            {tenant.nav.map((link, i) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-navy/70 hover:text-navy font-semibold transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Phone and Admin */}
          <div className="flex items-center gap-3 border-l border-navy/10 pl-3">
            <a
              href={tenant.contact.phoneHref}
              className="text-brass font-bold text-sm hover:text-brass/80 transition-colors hidden md:block"
            >
              {tenant.contact.phone}
            </a>
            <Link
              href="/admin"
              className="text-navy/60 hover:text-navy text-xs uppercase font-bold tracking-wider transition-colors"
              title="Admin Access"
            >
              Admin
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
