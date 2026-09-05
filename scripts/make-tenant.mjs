#!/usr/bin/env node
/**
 * Interactive tenant scaffolding — guides an operator through creating
 * a new branded site config from the Harbison Standard white-label base.
 *
 * Usage: node scripts/make-tenant.mjs
 */

import { readFileSync, writeFileSync, existsSync } from "fs";
import { resolve } from "path";
import readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = (prompt) =>
  new Promise((resolve) => rl.question(prompt, resolve));

const slugify = (str) =>
  str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

const generateTenantFile = (data) => {
  const { slug, displayName, roleLine, phone, phoneHref, email, licenseLine, complianceFooter, positioningLine, heroHeadline } = data;

  return `import type { TenantConfig } from "./types";

export const ${slug}: TenantConfig = {
  slug: "${slug}",
  name: "${data.brandName}",
  domains: [
    // Update this once a custom domain is purchased and DNS is set up.
    // Until then, canonical URLs use the NEXT_PUBLIC_SITE_URL placeholder.
  ],
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://example-${slug}.placeholder",

  brand: {
    logoPath: "/brand/logo.png",
    // Drop your real transparent PNG at public/brand/logo.png and flip this
    // to true once the asset is in place. Text wordmark renders until then.
    hasRealLogo: false,
  },

  contact: {
    displayName: "${displayName}",
    roleLine: "${roleLine}",
    phone: "${phone}",
    phoneHref: "tel:${phoneHref}",
    email: "${email}",
    licenseLine: "${licenseLine}",
    complianceFooter: "${complianceFooter}",
  },

  social: {
    // Add confirmed profile URLs here (LinkedIn, Facebook, Instagram, etc).
    // Empty strings are omitted from JSON-LD sameAs.
    sameAs: [],
  },

  nav: [
    { label: "Sell", href: "/sell" },
    { label: "Buy", href: "/buy" },
    { label: "Build", href: "/build" },
    { label: "Press", href: "/press" },
    { label: "FAQ", href: "/faq" },
  ],

  copy: {
    positioningLine: "${positioningLine}",
    tagline: "Your real-estate partner, every step.",
    heroTag: "Local expertise, nationwide reach",
    heroHeadline: "${heroHeadline}",
    heroHeadlineHighlight: "", // Wrap the part of heroHeadline you want brass-colored in this field
    heroSubcopy:
      "One person, start to finish. [CUSTOMIZE: describe your approach, experience, and service areas]",
    heroPrimaryCta: "GET A NUMBER ON YOUR PROPERTY",
    heroSecondaryCta: "EXPLORE AVAILABLE PROPERTIES",
    proofStats: [
      { value: "[STAT]", label: "Years in business" },
      { value: "[STAT]", label: "Properties sold" },
      { value: "[STAT]", label: "Homes built" },
      { value: "[STAT]", label: "Satisfied clients" },
    ],
    services: [
      {
        pillar: "flip",
        title: "Sell",
        description: "[CUSTOMIZE: describe your cash-offer or quick-sale process]",
        href: "/sell",
      },
      {
        pillar: "build",
        title: "Build",
        description: "[CUSTOMIZE: describe your construction or development services]",
        href: "/build",
      },
      {
        pillar: "invest",
        title: "Invest",
        description: "[CUSTOMIZE: describe your investment analysis or land evaluation]",
        href: "/invest",
      },
    ],

    aboutHeading: "Who you're working with",
    aboutBody:
      "[CUSTOMIZE: 1-2 paragraphs about yourself, your background, your philosophy, and what makes your approach unique]",
    aboutPhotoPath: "/brand/headshot.webp",

    signupHeading: "Get on my radar",
    signupSubcopy:
      "Tell me what you're working with and where you're headed — and I'll route it straight to the right conversation.",

    portfolioHeading: "Recent closings",
    portfolioIntro: "A sample of recent transactions — properties sold, built, or brokered.",
    soldProperties: [
      {
        id: "property-1",
        address: "[ADDRESS]",
        cityStateZip: "[CITY], [STATE] [ZIP]",
        soldPrice: "$[PRICE]",
        specs: "[BEDS] bd · [BATHS] ba · [SQFT] sqft",
        description: "[CUSTOMIZE: property type, unique features, outcome]",
        photos: ["/portfolio/property-1/1.jpg"],
      },
    ],
  },

  faq: [
    {
      id: "question-1",
      question: "[CUSTOMIZE: What is your most common client question?]",
      answer: "[CUSTOMIZE: Your answer here]",
    },
    {
      id: "question-2",
      question: "[CUSTOMIZE: What misconception do you frequently correct?]",
      answer: "[CUSTOMIZE: Your answer here]",
    },
    {
      id: "question-3",
      question: "[CUSTOMIZE: What should clients know before [key transaction type]?]",
      answer: "[CUSTOMIZE: Your answer here]",
      verifyWithCounsel: false, // Set to true if this answer requires a legal disclaimer
    },
    {
      id: "question-4",
      question: "[CUSTOMIZE: What's your biggest value-add vs. a typical [agent/investor/builder]?]",
      answer: "[CUSTOMIZE: Your answer here]",
    },
  ],

  scoring: {
    situationHigh: 40,
    situationMid: 25,
    situationPillar: 20,
    timelineAsap: 30,
    timelineSoon: 15,
    hasPhone: 10,
    engagementThresholdSeconds: 8,
    engagementBonus: 10,
    minFormSeconds: 3,
  },
};
`;
};

const updateTenantIndex = (slug, name) => {
  const indexPath = resolve("tenants/index.ts");
  let indexContent = readFileSync(indexPath, "utf-8");

  // Add import after the harbison import (before type import)
  const importLine = `import { ${slug} } from "./${slug}";\n`;
  if (!indexContent.includes(`import { ${slug} }`)) {
    const harbisImportEnd = indexContent.indexOf(`import { harbison }`);
    const lineEnd = indexContent.indexOf("\n", harbisImportEnd) + 1;
    indexContent =
      indexContent.slice(0, lineEnd) + importLine + indexContent.slice(lineEnd);
  }

  // Add to tenants Record (between harbison and closing brace)
  const recordLine = `  [${slug}.slug]: ${slug},\n`;
  if (!indexContent.includes(`[${slug}.slug]`)) {
    const closeRecord = indexContent.indexOf("};", indexContent.indexOf("const tenants:"));
    indexContent =
      indexContent.slice(0, closeRecord) +
      recordLine +
      indexContent.slice(closeRecord);
  }

  writeFileSync(indexPath, indexContent, "utf-8");
};

(async () => {
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("Harbison Standard — New Operator Tenant Setup");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  const displayName = await question(
    "Real name (e.g., Jamie Chen): "
  );
  const brandName = await question(
    `Brand name (e.g., Chen Real Estate) [${displayName}]: `
  );
  const slug = slugify(brandName || displayName);

  // Check if file already exists
  const filePath = resolve(`tenants/${slug}.ts`);
  if (existsSync(filePath)) {
    console.log(`\n❌ File already exists: tenants/${slug}.ts`);
    rl.close();
    process.exit(1);
  }

  const phone = await question("Phone number (e.g., +1 (555) 123-4567): ");
  const phoneHref = phone.replace(/\D/g, "");
  const email = await question("Email address: ");
  const licenseLine = await question(
    "License info (e.g., CA DRE #02059393): "
  );
  const serviceAreas = await question(
    "Service areas (comma-separated, e.g., Bakersfield, Kern County, Statewide): "
  );
  const positioningLine = await question(
    `Positioning line (e.g., Real Estate Authority — From the Ground Up): `
  );
  const heroHeadline = await question(
    "Hero headline (e.g., Real estate expertise, no shortcuts): "
  );

  const complianceFooter = `${licenseLine} · ${serviceAreas} · Equal Housing Opportunity`;
  const roleLine = `Licensed Real Estate [Professional] — ${serviceAreas}`;

  const data = {
    slug,
    displayName,
    brandName,
    phone,
    phoneHref,
    email,
    licenseLine,
    complianceFooter,
    roleLine,
    positioningLine,
    heroHeadline,
  };

  // Generate tenant file
  const tenantCode = generateTenantFile(data);
  writeFileSync(filePath, tenantCode, "utf-8");

  // Update tenants/index.ts
  updateTenantIndex(slug, brandName || displayName);

  console.log("\n✅ Tenant created successfully!\n");
  console.log(`📄 File: tenants/${slug}.ts`);
  console.log(`📝 Slug: ${slug}\n`);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("Next steps:");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
  console.log(`1. Edit tenants/${slug}.ts:`);
  console.log("   - Replace [CUSTOMIZE: ...] placeholders with real copy");
  console.log("   - Add sold properties to portfolioHeading");
  console.log("   - Customize FAQ answers for your market\n");

  console.log("2. Add assets:");
  console.log("   - Drop your logo at public/brand/logo.png");
  console.log("   - Drop your headshot at public/brand/headshot.webp");
  console.log("   - Add property photos to public/portfolio/[id]/\n");

  console.log("3. Insert tenant row into Supabase:");
  console.log(`   insert into tenants (slug, name, config) values (`);
  console.log(`     '${slug}',`);
  console.log(`     '${brandName || displayName}',`);
  console.log(`     '{\"scoring\": {\"situationHigh\": 40, ...}}'::jsonb`);
  console.log(`   );\n`);

  console.log("4. Create Vercel project:");
  console.log(`   - Fork this repo to your own GitHub org`);
  console.log(`   - Create new Vercel project from your fork`);
  console.log(`   - Set NEXT_PUBLIC_TENANT=${slug}`);
  console.log(`   - Set same Supabase/Resend/cron env vars as Harbison\n`);

  console.log("5. Deploy & verify:");
  console.log("   - Deploy to Vercel");
  console.log("   - Visit /dashboard?demo=1 (no login needed, shows seed data)");
  console.log("   - Submit test lead from /sell page");
  console.log("   - Confirm it appears only on your /dashboard\n");

  console.log("📖 See OPERATOR.md for full documentation.\n");

  rl.close();
})();
