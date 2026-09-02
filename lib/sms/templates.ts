import type { TenantConfig } from "@/tenants/types";

/**
 * Missed-call text-back (§7.4). Reproduces the client-approved copy
 * exactly for the harbison tenant ("This is Nathaniel w/ The Harbison
 * Standard — missed your call...") while staying tenant-config-driven —
 * the first name comes from `contact.displayName`, the brand from
 * `tenant.name`, so a white-labeled tenant gets the same message shape
 * with their own identity.
 */
export function missedCallText(tenant: TenantConfig): string {
  const firstName = tenant.contact.displayName.trim().split(/\s+/)[0];
  return `This is ${firstName} w/ ${tenant.name} — missed your call. Text me the property address and I'll call you back with a number. Reply STOP to opt out.`;
}
