/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Public marketing pages are pre-rendered at build time (force-static in
  // each route) so the site can be hosted as pure static output + a small
  // set of dynamic API/CRM routes. See DECISIONS.md.
};

module.exports = nextConfig;
