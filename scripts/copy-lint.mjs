#!/usr/bin/env node
// Fair-housing + banned-phrase linter. Runs in CI (npm run copy-lint) and
// fails the build if banned copy ships anywhere in the site. See §8 of the
// project spec.
//
// Phase 0: scans source text (app/, components/, tenants/) since that is
// the only copy that exists pre-launch. Phase 1 should extend this to also
// crawl the built static HTML output, once real pages/FAQ/press-kit copy
// exists, so copy assembled at render time is covered too.

import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;
const SCAN_DIRS = ["app", "components", "tenants"];
const SCAN_EXTENSIONS = new Set([".ts", ".tsx", ".md", ".mdx"]);

// Fair-housing steering language + demographic references (§8).
const FAIR_HOUSING_BANNED = [
  "best neighborhood",
  "safe area",
  "safe community",
  "family-friendly",
  "family friendly",
  "good schools",
  "bad area",
  "crime",
  "no children",
  "adults only",
  "exclusive community",
  "traditional family",
];

// Outcome/superlative claims banned by brand voice (§2) and CA DRE
// no-guarantee rule (§8). "best" is checked separately with a narrower
// pattern below since it appears inside allowed phrasing like "best read".
const CLAIM_BANNED = [
  "guaranteed",
  "guarantee",
  "highest cash offer",
  "risk-free",
  "risk free",
];

function collectFiles(dir) {
  let out = [];
  let entries;
  try {
    entries = readdirSync(dir);
  } catch {
    return out;
  }
  for (const entry of entries) {
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      out = out.concat(collectFiles(full));
    } else if (SCAN_EXTENSIONS.has(extname(full))) {
      out.push(full);
    }
  }
  return out;
}

function lintFile(path) {
  const text = readFileSync(path, "utf8");
  const lower = text.toLowerCase();
  const hits = [];

  for (const phrase of [...FAIR_HOUSING_BANNED, ...CLAIM_BANNED]) {
    if (lower.includes(phrase)) {
      hits.push(phrase);
    }
  }

  return hits;
}

function main() {
  const files = SCAN_DIRS.flatMap((dir) => collectFiles(join(ROOT, dir)));
  let failed = false;

  for (const file of files) {
    const hits = lintFile(file);
    if (hits.length > 0) {
      failed = true;
      console.error(`✗ ${file.replace(ROOT, "")}: banned phrase(s): ${hits.join(", ")}`);
    }
  }

  if (failed) {
    console.error("\ncopy-lint failed. Remove banned phrases (see §8) before shipping.");
    process.exit(1);
  }

  console.log(`copy-lint passed (${files.length} files scanned).`);
}

main();
