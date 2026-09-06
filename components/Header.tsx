import Link from "next/link";
import type { TenantConfig } from "@/tenants/types";

export function Header({ tenant }: { tenant: TenantConfig }) {
  return (
    <header className="bg-navy border-b-4 border-brass sticky top-0 z-40 shadow-lg">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        {/* Logo with Gold Square Border */}
        <Link href="/" className="shrink-0 flex items-center gap-4">
          <div className="border-4 border-brass p-3 bg-navy/50">
            <div className="relative w-10 h-10 border-2 border-brass flex items-center justify-center">
              <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-brass -translate-x-1/2"></div>
              <div className="absolute left-0 right-0 top-1/2 h-[1px] bg-brass -translate-y-1/2"></div>
              <span className="font-serif text-lg text-brass font-bold relative z-10">H</span>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-xl font-bold text-white tracking-wider">HARBISON</span>
            <span className="font-sans text-xs tracking-[0.3em] text-brass uppercase font-bold">Standard</span>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-6 ml-auto">
          <div className="hidden md:flex items-center gap-8 text-sm">
            {tenant.nav.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-white/70 hover:text-brass font-semibold transition-colors uppercase tracking-wide"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Phone and Admin */}
          <div className="flex items-center gap-4 border-l border-brass/30 pl-4">
            <a
              href={tenant.contact.phoneHref}
              className="text-brass font-bold text-sm hover:text-white transition-colors hidden md:block"
            >
              {tenant.contact.phone}
            </a>
            <Link
              href="/admin"
              className="text-brass hover:text-white text-xs uppercase font-bold tracking-wider transition-colors border border-brass/50 px-3 py-2 hover:border-brass"
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
