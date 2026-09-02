import "server-only";
import type { TenantConfig } from "@/tenants/types";

/**
 * Resend (and most transactional-email providers) requires the `from`
 * address to be on a domain you've verified with them via DNS records —
 * you cannot send *as* an arbitrary Gmail/Outlook/etc. address you don't
 * control the domain for. The operator's current contact email
 * (nate85.realtor@gmail.com) is exactly that kind of address, and no
 * custom domain is purchased yet (see DECISIONS.md, Phase 0). Falls back
 * to it anyway so sends don't crash before a domain exists — Resend will
 * reject the send with a clear error in that case, which is the correct
 * failure mode, not a silent success. Once a domain is verified with
 * Resend, set RESEND_FROM_EMAIL (e.g. leads@theharbisonstandard.com) and
 * every automated email switches to it with no code change.
 */
export function resolveFromAddress(tenant: TenantConfig): string {
  return process.env.RESEND_FROM_EMAIL || tenant.contact.email;
}
