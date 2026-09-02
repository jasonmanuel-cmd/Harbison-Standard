// Banned-phrase lists + detection, shared by scripts/copy-lint.mjs and
// tests/copy-lint.test.mjs. Split out so the detection logic itself has
// an automated regression test (§9 acceptance test: "intentionally
// adding 'safe neighborhood' fails the build") independent of scanning
// real source files.

// Fair-housing steering language + demographic references (§8).
export const FAIR_HOUSING_BANNED = [
  "best neighborhood",
  "safe neighborhood",
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
// no-guarantee rule (§8).
export const CLAIM_BANNED = [
  "guaranteed",
  "guarantee",
  "highest cash offer",
  "risk-free",
  "risk free",
];

export const ALL_BANNED = [...FAIR_HOUSING_BANNED, ...CLAIM_BANNED];

/** Returns every banned phrase found in `text` (case-insensitive), or an empty array. */
export function findBannedPhrases(text) {
  const lower = text.toLowerCase();
  return ALL_BANNED.filter((phrase) => lower.includes(phrase));
}
