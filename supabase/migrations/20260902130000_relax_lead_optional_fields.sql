-- Phase 3: the missed-call webhook (§7.4) only ever has a phone number
-- at the moment of ingest — no email, property address, situation, or
-- consent. §7.4 itself says "Respect consent_at IS NULL → ... the SMS is
-- the compliant first-touch informational message," making a NULL
-- consent_at an expected, meaningful state for this path, not an error.
--
-- Phase 2's original migration marked these NOT NULL based solely on the
-- web form's required fields (§7.2) — correct for that one ingest path,
-- wrong as a constraint on the whole table now that a second ingest path
-- exists. Relaxing to the union of what every valid path can supply.
-- (An append-only fix, not an edit to the original migration — matches
-- how migrations should evolve once applied.)

alter table leads alter column email drop not null;
alter table leads alter column property_address drop not null;
alter table leads alter column situation drop not null;
alter table leads alter column consent_text drop not null;
alter table leads alter column consent_at drop not null;
