/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Public marketing pages are pre-rendered at build time (force-static in
  // each route) so the site can be hosted as pure static output + a small
  // set of dynamic API/CRM routes. See DECISIONS.md.
  async headers() {
    // The four low-risk, no-config-required security headers. Deliberately
    // NOT including a Content-Security-Policy here: LeadForm ships an
    // inline <script> (dangerouslySetInnerHTML) and next/image + next/og
    // both need real allowlisting to not silently break under a CSP — that
    // needs to be built and tested deliberately, not bolted on blind.
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(self)",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
