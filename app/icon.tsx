import { ImageResponse } from "next/og";

// Favicon / browser-tab icon, generated from the same benchmark mark used
// as the brand watermark elsewhere (components/BenchmarkMark.tsx) — see
// that file's comment: "Used as favicon source, loading placeholder, and
// hero watermark." No static PNG existed; this covers that gap without
// asking for a hand-exported asset. Next's file convention picks this up
// automatically — no manual <link rel="icon"> needed.
export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#12233F",
          borderRadius: "50%",
        }}
      >
        <svg
          width="44"
          height="44"
          viewBox="0 0 100 100"
          fill="none"
          stroke="#C9A24B"
          strokeWidth={7}
        >
          <circle cx="50" cy="38" r="24" />
          <path d="M50 14 L50 62" />
          <path d="M26 38 L74 38" />
          <path d="M38 62 L50 84 L62 62 Z" />
        </svg>
      </div>
    ),
    { ...size },
  );
}
