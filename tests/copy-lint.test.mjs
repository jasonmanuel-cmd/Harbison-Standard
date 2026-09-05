// §9 acceptance test: "copy-lint passes on all pages; intentionally
// adding 'safe neighborhood' fails the build." The full copy-lint run
// (npm run copy-lint) already proves the "passes on all pages" half on
// every CI run; this proves the detection logic itself actually catches
// a banned phrase, independent of which real files currently exist.
import { test } from "node:test";
import assert from "node:assert/strict";
import { findBannedPhrases } from "../scripts/lint-rules.mjs";

test("copy-lint catches a banned fair-housing phrase", () => {
  const hits = findBannedPhrases("Welcome to this safe neighborhood near great schools.");
  assert.ok(hits.length > 0, "expected at least one banned phrase to be caught");
});

test("copy-lint catches a banned outcome/guarantee claim", () => {
  const hits = findBannedPhrases("We offer the highest cash offer, guaranteed.");
  assert.ok(hits.includes("highest cash offer"));
  assert.ok(hits.includes("guaranteed"));
});

test("copy-lint is case-insensitive", () => {
  const hits = findBannedPhrases("This is a SAFE COMMUNITY.");
  assert.ok(hits.includes("safe community"));
});

test("copy-lint does not flag ordinary property-facts copy", () => {
  const hits = findBannedPhrases(
    "1,400 sqft, 3 bed 2 bath, built 1998, new roof in 2021, closes in three weeks.",
  );
  assert.deepEqual(hits, []);
});
