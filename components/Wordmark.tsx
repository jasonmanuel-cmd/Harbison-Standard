import Image from "next/image";
import type { TenantConfig } from "@/tenants/types";
import { BenchmarkMark } from "./BenchmarkMark";

/**
 * Renders the tenant's real logo.png when one has been provided, otherwise
 * falls back to a text wordmark built from brand tokens (exact fonts and
 * colors, per §2) so the site never ships a broken <img>. See
 * tenant.brand.hasRealLogo and DECISIONS.md.
 */
export function Wordmark({
  tenant,
  variant = "light",
}: {
  tenant: TenantConfig;
  /** "light" = white text for navy backgrounds, "dark" = navy text for paper/parchment. */
  variant?: "light" | "dark";
}) {
  if (tenant.brand.hasRealLogo) {
    return (
      <Image
        src={tenant.brand.logoPath}
        alt={tenant.name}
        width={280}
        height={80}
        priority
      />
    );
  }

  const textColor = variant === "light" ? "text-white" : "text-navy";

  return (
    <span className="inline-flex items-center gap-3">
      <BenchmarkMark className="h-9 w-9 text-brass" />
      <span className="flex flex-col leading-none">
        <span className={`font-serif tracking-wide text-xl ${textColor}`}>
          HARBISON
        </span>
        <span className="font-serif tracking-[0.3em] text-xs text-brass">
          STANDARD
        </span>
      </span>
    </span>
  );
}
