import Link from "next/link";
import type { TenantConfig } from "@/tenants/types";
import { Wordmark } from "@/components/Wordmark";

export function CrmHeader({ tenant, demo }: { tenant: TenantConfig; demo?: boolean }) {
  return (
    <header className="bg-navy">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href={demo ? "/dashboard?demo=1" : "/dashboard"}>
          <Wordmark tenant={tenant} variant="light" />
        </Link>
        <nav className="flex items-center gap-6 text-sm text-steel">
          {demo && (
            <span className="border border-brass px-2 py-1 text-xs font-semibold uppercase tracking-wide text-brass">
              Demo mode
            </span>
          )}
          <Link href={demo ? "/dashboard?demo=1" : "/dashboard"} className="hover:text-white">
            Board
          </Link>
          {!demo && (
            <>
              <Link href="/settings" className="hover:text-white">
                Settings
              </Link>
              <form action="/auth/signout" method="POST">
                <button type="submit" className="hover:text-white">
                  Sign out
                </button>
              </form>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
