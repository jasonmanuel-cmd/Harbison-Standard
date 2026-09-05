import type { Metadata } from "next";
import { getTenant } from "@/tenants";
import { buildMetadata } from "@/lib/metadata";
import "./globals.css";

const tenant = getTenant();

// buildMetadata's "Page | Site Name" title order suits subpages; the
// homepage itself reads better brand-first, so its title is overridden
// after spreading in the shared canonical/OG/Twitter fields.
export const metadata: Metadata = {
  metadataBase: new URL(tenant.siteUrl),
  ...buildMetadata({
    title: tenant.copy.positioningLine,
    description: tenant.copy.heroSubcopy,
    path: "/",
  }),
  title: `${tenant.name} — ${tenant.copy.positioningLine}`,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans text-navy antialiased">{children}</body>
    </html>
  );
}
