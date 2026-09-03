import type { Config } from "tailwindcss";

// Brand tokens are the single source of truth for color/type across the
// site. Do not use raw hex values in components — always reference these
// token names. See DECISIONS.md and the brand table in the project spec.
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./tenants/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: "#12233F",
        "navy-deep": "#0B1830",
        brass: "#C9A24B",
        steel: "#9FB0C9",
        parchment: "#E7E1D2",
        paper: "#F7F5EF",
      },
      fontFamily: {
        serif: ["Georgia", "Times New Roman", "serif"],
        sans: ["Helvetica", "Arial", "sans-serif"],
      },
      keyframes: {
        // Slow continuous scale on the hero background video/image — a
        // "Ken Burns" drift. Pure CSS, no JS, so it costs nothing on the
        // JS-optional/no-JS path (it just doesn't animate, video is still
        // fully visible and playing).
        kenburns: {
          "0%": { transform: "scale(1)" },
          "100%": { transform: "scale(1.12)" },
        },
        // Staged entrance for hero copy — small delay stagger via
        // animation-delay utilities per element, not JS.
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        kenburns: "kenburns 20s ease-out forwards",
        "fade-up": "fade-up 0.8s ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;
