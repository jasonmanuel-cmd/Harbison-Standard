#!/usr/bin/env node
// Fair-housing + banned-phrase linter. Runs in CI (npm run copy-lint) and
// fails the build if banned copy ships anywhere in the site. See §8 of the
// project spec.
//
// Scans source text for banned phrases. Started (Phase 0) covering only
// app/, components/, tenants/ since that was the only copy that existed
// pre-launch; added lib/ in Phase 3 once email templates
// (lib/email/templates.ts) became real outbound copy. Should still be
// extended to crawl the built static HTML output, so copy assembled at
// render time (not just source string literals) is covered too.

import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, extname } from "node:path";
import { findBannedPhrases } from "./lint-rules.mjs";

const ROOT = new URL("..", import.meta.url).pathname;
const SCAN_DIRS = ["app", "components", "tenants", "lib"];
const SCAN_EXTENSIONS = new Set([".ts", ".tsx", ".md", ".mdx"]);

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
  return findBannedPhrases(readFileSync(path, "utf8"));
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
