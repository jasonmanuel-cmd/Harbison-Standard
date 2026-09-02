// RLS + scoring proof tests (§9). Runs against a real local Postgres —
// see tests/helpers/db.mjs and tests/fixtures/auth-shim.sql for how that
// stands in for the parts of Supabase's platform (auth schema, anon/
// authenticated roles) this suite needs but a bare Postgres doesn't have.
//
// Requires a local Postgres server the `postgres` OS/DB superuser can
// reach (see README's "Running the test suite" section). Skips itself
// with a clear message if that's not available, rather than failing CI
// for an unrelated environment reason.
import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { resetTestDb, runAs, runAsSuperuser } from "./helpers/db.mjs";

function dbAvailable() {
  try {
    execFileSync("sudo", ["-u", "postgres", "psql", "-c", "select 1;"], { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

const CONSENT =
  "I agree to be contacted by call, text, or email about my property, including by automated systems. Consent is not a condition of any purchase. Message/data rates may apply. Reply STOP to opt out at any time.";

function csvRows(output) {
  return output
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => line.split(","));
}

// RETURNING defaults on: it's how the scoring tests read back the
// trigger's output. But RLS applies to RETURNING too — Postgres checks
// the row against the actor's SELECT policy before handing it back, and
// raises exactly the same "new row violates row-level security policy"
// error if that fails. anon has no SELECT policy on leads at all, so an
// anon insert must ask for `returning: false` — which is itself a live
// proof that anon truly can't read back what it just wrote, not a
// workaround for a test bug. (This also means production code must never
// chain `.select()` after an anon-context `.insert()`; supabase-js
// doesn't by default, but see DECISIONS.md.)
function insertLeadSql({
  tenantId,
  situation = "sell-probate",
  timeline = "asap",
  phone = "'555-1111'",
  formSecondsOpen = "14",
  returning = true,
}) {
  return `
    insert into leads (tenant_id, source, name, phone, email, property_address, situation, timeline, consent_text, consent_at, form_seconds_open)
    values ('${tenantId}', 'home', 'Test Lead', ${phone}, 'test@example.com', '1 Test St', '${situation}', '${timeline}', '${CONSENT}', now(), ${formSecondsOpen})
    ${returning ? "returning id, score, bucket, flagged_spam" : ""};
  `;
}

test("RLS + scoring", { skip: !dbAvailable() && "no local Postgres reachable" }, async (t) => {
  resetTestDb();

  let tenantA, tenantB, userA, userB;

  // Mirrors the weights in tenants/harbison.ts / supabase/seed.sql — a
  // tenant with no scoring config is a valid (and separately covered)
  // edge case, but the HOT/WARM/NURTURE assertions below need a tenant
  // actually configured the way production tenants are.
  const scoringConfig = JSON.stringify({
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
  }).replace(/'/g, "''");

  await t.test("setup: two tenants, one profile each", () => {
    const out = runAsSuperuser(`
      insert into tenants (slug, name, config) values ('tenant-a', 'Tenant A', '${scoringConfig}'::jsonb) returning id;
    `);
    tenantA = csvRows(out)[0][0];

    const outB = runAsSuperuser(`
      insert into tenants (slug, name, config) values ('tenant-b', 'Tenant B', '${scoringConfig}'::jsonb) returning id;
    `);
    tenantB = csvRows(outB)[0][0];

    const uA = runAsSuperuser(`insert into auth.users default values returning id;`);
    userA = csvRows(uA)[0][0];
    const uB = runAsSuperuser(`insert into auth.users default values returning id;`);
    userB = csvRows(uB)[0][0];

    runAsSuperuser(`insert into profiles (id, tenant_id, role) values ('${userA}', '${tenantA}', 'owner');`);
    runAsSuperuser(`insert into profiles (id, tenant_id, role) values ('${userB}', '${tenantB}', 'owner');`);

    assert.ok(tenantA && tenantB && userA && userB);
  });

  await t.test("anon can INSERT a lead", () => {
    runAs(insertLeadSql({ tenantId: tenantA, returning: false }), { role: "anon" });
    const out = runAsSuperuser(`select count(*) from leads where tenant_id = '${tenantA}';`);
    assert.equal(csvRows(out)[0][0], "1");
  });

  await t.test("anon SELECT on leads returns zero rows", () => {
    const out = runAs(`select count(*) from leads;`, { role: "anon" });
    assert.equal(csvRows(out)[0][0], "0");
  });

  await t.test("anon UPDATE on leads affects zero rows (row unchanged)", () => {
    const before = runAsSuperuser(`select status from leads where tenant_id = '${tenantA}' limit 1;`);
    runAs(`update leads set status = 'dead';`, { role: "anon" });
    const after = runAsSuperuser(`select status from leads where tenant_id = '${tenantA}' limit 1;`);
    assert.equal(before, after);
    assert.notEqual(csvRows(before)[0][0], "dead");
  });

  await t.test("anon has no access to tenants, profiles, or outreach_log", () => {
    for (const table of ["tenants", "profiles", "outreach_log"]) {
      const out = runAs(`select count(*) from ${table};`, { role: "anon" });
      assert.equal(csvRows(out)[0][0], "0", `anon should see 0 rows in ${table}`);
    }
  });

  await t.test("authenticated user sees only their own tenant's leads", () => {
    runAsSuperuser(insertLeadSql({ tenantId: tenantB }));
    // tenant A now has 1 lead (from the anon-insert test above), tenant B has 1.
    const asA = runAs(`select count(*) from leads;`, { role: "authenticated", uid: userA });
    assert.equal(csvRows(asA)[0][0], "1");

    const rows = runAs(`select tenant_id from leads;`, { role: "authenticated", uid: userA });
    assert.equal(csvRows(rows)[0][0], tenantA);
  });

  await t.test("authenticated user cannot INSERT a lead into a different tenant", () => {
    assert.throws(() => {
      runAs(insertLeadSql({ tenantId: tenantB }), { role: "authenticated", uid: userA });
    }, /row-level security/i);
  });

  await t.test("probate + asap + phone scores >= 80 (HOT)", () => {
    const out = runAsSuperuser(
      insertLeadSql({ tenantId: tenantA, situation: "sell-probate", timeline: "asap", formSecondsOpen: "14" }),
    );
    const [, score, bucket, flaggedSpam] = csvRows(out)[0];
    assert.ok(Number(score) >= 80, `expected score >= 80, got ${score}`);
    assert.equal(bucket, "hot");
    assert.equal(flaggedSpam, "f");
  });

  await t.test("form filled too fast forces score 0 and flags spam", () => {
    const out = runAsSuperuser(
      insertLeadSql({ tenantId: tenantA, situation: "sell-probate", timeline: "asap", formSecondsOpen: "1" }),
    );
    const [, score, bucket, flaggedSpam] = csvRows(out)[0];
    assert.equal(score, "0");
    assert.equal(bucket, "nurture");
    assert.equal(flaggedSpam, "t");
  });

  await t.test("missed-call-shaped insert (phone only, no email/address/situation/consent) succeeds", () => {
    const out = runAsSuperuser(`
      insert into leads (tenant_id, source, name, phone)
      values ('${tenantA}', 'missed-call', 'Missed Call Test', '555-2222')
      returning id, score, bucket, flagged_spam;
    `);
    const [, score, bucket, flaggedSpam] = csvRows(out)[0];
    // No situation/timeline means no bonus from either — the only points
    // come from having a phone number (+10, per this test file's tenant
    // scoring config). The real point of this test is that the insert
    // succeeds at all with those columns omitted.
    assert.equal(score, "10");
    assert.equal(bucket, "nurture");
    assert.equal(flaggedSpam, "f");
  });
});
