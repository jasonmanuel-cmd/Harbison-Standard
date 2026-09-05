// Test-only Postgres driver. Shells out to `psql` (already present on any
// box with the Postgres tooling this test suite needs, including CI)
// rather than adding a `pg` npm dependency just for tests — see
// DECISIONS.md.
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const DB = process.env.HARBISON_TEST_DB ?? "harbison_test";
const ROOT = fileURLToPath(new URL("../..", import.meta.url));

function runPsql(args, input) {
  return execFileSync("sudo", ["-u", "postgres", "psql", "-q", "-d", DB, "-v", "ON_ERROR_STOP=1", ...args], {
    input,
    encoding: "utf8",
    stdio: ["pipe", "pipe", "pipe"],
  });
}

function runPsqlOnMaintenanceDb(sql) {
  return execFileSync("sudo", ["-u", "postgres", "psql", "-d", "postgres", "-v", "ON_ERROR_STOP=1", "-c", sql], {
    encoding: "utf8",
  });
}

/** Drops and recreates the test DB, then applies the auth shim, every
 * real migration in order, and re-grants (the shim's grants run before
 * the migrations create any tables, so they need reapplying after). */
export function resetTestDb() {
  runPsqlOnMaintenanceDb(`DROP DATABASE IF EXISTS ${DB};`);
  runPsqlOnMaintenanceDb(`CREATE DATABASE ${DB};`);

  const shim = readFileSync(`${ROOT}/tests/fixtures/auth-shim.sql`, "utf8");
  runPsql(["-f", "-"], shim);

  const migrationFiles = execFileSync("sh", ["-c", `ls ${ROOT}/supabase/migrations/*.sql`], {
    encoding: "utf8",
  })
    .trim()
    .split("\n")
    .sort();

  for (const path of migrationFiles) {
    runPsql(["-f", "-"], readFileSync(path, "utf8"));
  }

  runPsql(["-c", "grant select, insert, update, delete on all tables in schema public to anon, authenticated;"]);
}

/**
 * Runs `sql` inside a transaction as the given Postgres role, optionally
 * impersonating a user for auth.uid() via the same request.jwt.claims
 * mechanism PostgREST uses on real Supabase. Returns stdout (CSV rows for
 * SELECTs, empty for statements with no result set). Throws (with a
 * `.stderr` on the error) if the SQL errors — including RLS `WITH CHECK`
 * violations on INSERT/UPDATE, which surface as real Postgres errors,
 * unlike a denied SELECT/DELETE, which just returns/affects zero rows.
 */
export function runAs(sql, { role = "postgres", uid } = {}) {
  const preamble = [
    "BEGIN;",
    role !== "postgres" ? `SET LOCAL ROLE ${role};` : "",
    uid ? `SET LOCAL request.jwt.claims = '${JSON.stringify({ sub: uid })}';` : "",
  ]
    .filter(Boolean)
    .join("\n");

  const script = `${preamble}\n${sql}\nCOMMIT;`;
  try {
    return runPsql(["-tAF,", "-f", "-"], script);
  } catch (err) {
    err.message = `${err.message}\n--- stderr ---\n${err.stderr}`;
    throw err;
  }
}

/** Convenience: runs `sql` as the unrestricted `postgres` superuser
 * (bypasses RLS entirely) — used for test setup/fixtures and to verify
 * ground truth after an RLS-restricted operation. */
export function runAsSuperuser(sql) {
  return runAs(sql, { role: "postgres" });
}
