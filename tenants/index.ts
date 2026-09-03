import { harbison } from "./harbison";
import type { TenantConfig } from "./types";

// Registry of all tenants this deployment can serve. Phase 4 adds
// host-header resolution in middleware.ts against each tenant's `domains`
// array; until then every request resolves to NEXT_PUBLIC_TENANT (or the
// single registered tenant, if only one exists).
const tenants: Record<string, TenantConfig> = {
  [harbison.slug]: harbison,
};

export function getTenant(slug?: string): TenantConfig {
  const key = slug || process.env.NEXT_PUBLIC_TENANT || harbison.slug;
  const tenant = tenants[key];
  if (!tenant) {
    throw new Error(`Unknown tenant slug: "${key}"`);
  }
  return tenant;
}

export type { TenantConfig } from "./types";
