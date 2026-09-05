import { ImageResponse } from "next/og";
import { getTenant } from "@/tenants";

// Site-wide default OG/Twitter card image (Next's file convention — this
// single file covers every page that doesn't define its own via the
// `alt`/`size`/`contentType` exports below, per Next.js metadata
// resolution). /v/[slug] has its own, more specific one that overrides
// this. Same brand treatment (navy/brass frame) as that file.
export const alt = "The Harbison Standard";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage() {
  const tenant = getTenant();

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
        <div
          style={{
            fontSize: 28,
            color: "#C9A24B",
            letterSpacing: 6,
            fontStyle: "italic",
            textTransform: "uppercase",
          }}
        >
          {tenant.copy.heroTag}
        </div>
        <div
          style={{
            marginTop: 24,
            fontSize: 60,
            color: "#FFFFFF",
            textAlign: "center",
            padding: "0 100px",
            lineHeight: 1.15,
          }}
        >
          {tenant.copy.positioningLine}
        </div>
        <div style={{ marginTop: 32, fontSize: 24, color: "#9FB0C9" }}>
          {tenant.contact.roleLine}
        </div>
      </div>
    ),
    { ...size },
  );
}
