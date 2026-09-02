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
    },
  },
  plugins: [],
};

export default config;
