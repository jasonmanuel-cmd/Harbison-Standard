import { ImageResponse } from "next/og";
import { getTenant } from "@/tenants";
import { findLeadByVideoSlug } from "@/lib/video-lookup";

// OG image for a personalized video page (§7.4: "auto-generated (edge,
// satori) with brand frame"). next/og's ImageResponse is Next's built-in
// wrapper around Satori — no separate `satori` dependency needed. Not
// pinning `runtime = "edge"`: Next 16 deprecated that route-segment
// declaration in favor of always using the "nodejs" runtime (which still
// runs ImageResponse/Satori identically) — see DECISIONS.md.
export const alt = "Video message";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tenant = getTenant();
  const lead = await findLeadByVideoSlug(slug);
  const addressLine = lead?.property_address ?? "your property";

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#12233F",
          border: "16px solid #C9A24B",
          fontFamily: "Georgia, serif",
        }}
      >
        <div style={{ fontSize: 28, color: "#C9A24B", letterSpacing: 4, fontStyle: "italic" }}>
          {tenant.contact.displayName}
        </div>
        <div
          style={{
            marginTop: 24,
            fontSize: 56,
            color: "#FFFFFF",
            textAlign: "center",
            padding: "0 80px",
          }}
        >
          A quick word about {addressLine}
        </div>
        <div style={{ marginTop: 32, fontSize: 24, color: "#9FB0C9" }}>{tenant.name}</div>
      </div>
    ),
    { ...size },
  );
}
