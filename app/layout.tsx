import type { Metadata } from "next";
import { getTenant } from "@/tenants";
import "./globals.css";

const tenant = getTenant();

export const metadata: Metadata = {
  metadataBase: new URL(tenant.siteUrl),
  title: `${tenant.name} — ${tenant.copy.positioningLine}`,
  description: tenant.copy.heroSubcopy,
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
