-- Demo data. Everything below is fake — fake names, fake addresses, fake
-- phone/email — and every lead's `notes` carries a DEMO marker so it's
-- unmistakable in the CRM. Safe to run repeatedly: it clears and
-- re-inserts rows scoped to the fixed harbison tenant id below rather
-- than accumulating duplicates.

do $$
declare
  v_tenant_id uuid := '11111111-1111-4111-8111-111111111111';
begin
  delete from outreach_log where tenant_id = v_tenant_id;
  delete from leads where tenant_id = v_tenant_id;

  insert into tenants (id, slug, name, config)
  values (
    v_tenant_id,
    'harbison',
    'The Harbison Standard',
    jsonb_build_object(
      'scoring', jsonb_build_object(
        'situationHigh', 40,
        'situationMid', 25,
        'situationPillar', 20,
        'timelineAsap', 30,
        'timelineSoon', 15,
        'hasPhone', 10,
        'engagementThresholdSeconds', 8,
        'engagementBonus', 10,
        'minFormSeconds', 3
      )
    )
  )
  on conflict (id) do update set
    slug = excluded.slug,
    name = excluded.name,
    config = excluded.config;
end $$;

-- HOT (score >= 80)
insert into leads (
  tenant_id, source, name, phone, email, property_address, city,
  situation, timeline, consent_text, consent_at, ip, user_agent,
  form_seconds_open, status, utm, notes
) values
  (
    '11111111-1111-4111-8111-111111111111', 'sell', 'Derek — DEMO', '661-555-0101',
    'derek.demo@example.com', '304 Apollo St', 'Bakersfield',
    'sell-probate', 'asap',
    'I agree to be contacted by call, text, or email about my property, including by automated systems. Consent is not a condition of any purchase. Message/data rates may apply. Reply STOP to opt out at any time.',
    now() - interval '2 days', '203.0.113.10', 'DEMO-SEED/1.0',
    14, 'contacted', '{"source":"youtube","medium":"video","campaign":"probate-explainer"}'::jsonb,
    '{"demo": "DEMO — seeded fake lead, not real"}'::jsonb
  ),
  (
    '11111111-1111-4111-8111-111111111111', 'sell', 'Priya — DEMO', '661-555-0102',
    'priya.demo@example.com', '1180 Comet Ave', 'Bakersfield',
    'sell-inherited', 'asap',
    'I agree to be contacted by call, text, or email about my property, including by automated systems. Consent is not a condition of any purchase. Message/data rates may apply. Reply STOP to opt out at any time.',
    now() - interval '6 hours', '203.0.113.11', 'DEMO-SEED/1.0',
    22, 'new', '{}'::jsonb,
    '{"demo": "DEMO — seeded fake lead, not real"}'::jsonb
  ),
  (
    '11111111-1111-4111-8111-111111111111', 'home', 'Wendell — DEMO', '661-555-0103',
    'wendell.demo@example.com', '77 Cinder Rd', 'Tehachapi',
    'sell-nod', 'asap',
    'I agree to be contacted by call, text, or email about my property, including by automated systems. Consent is not a condition of any purchase. Message/data rates may apply. Reply STOP to opt out at any time.',
    now() - interval '1 day', '203.0.113.12', 'DEMO-SEED/1.0',
    5, 'appointment', '{}'::jsonb,
    '{"demo": "DEMO — seeded fake lead, not real"}'::jsonb
  );

-- WARM (score 60-79)
insert into leads (
  tenant_id, source, name, phone, email, property_address, city,
  situation, timeline, consent_text, consent_at, ip, user_agent,
  form_seconds_open, status, utm, notes
) values
  (
    '11111111-1111-4111-8111-111111111111', 'sell', 'Connie — DEMO', '661-555-0104',
    'connie.demo@example.com', '52 Harvest Ln', 'Bakersfield',
    'sell-landlord', 'asap',
    'I agree to be contacted by call, text, or email about my property, including by automated systems. Consent is not a condition of any purchase. Message/data rates may apply. Reply STOP to opt out at any time.',
    now() - interval '3 days', '203.0.113.13', 'DEMO-SEED/1.0',
    11, 'contacted', '{}'::jsonb,
    '{"demo": "DEMO — seeded fake lead, not real"}'::jsonb
  ),
  (
    '11111111-1111-4111-8111-111111111111', 'build', 'Tomas — DEMO', '661-555-0105',
    'tomas.demo@example.com', 'Lot 14, Sundown Estates', 'Bakersfield',
    'build', 'asap',
    'I agree to be contacted by call, text, or email about my property, including by automated systems. Consent is not a condition of any purchase. Message/data rates may apply. Reply STOP to opt out at any time.',
    now() - interval '12 hours', '203.0.113.14', 'DEMO-SEED/1.0',
    18, 'new', '{"source":"instagram","medium":"social","campaign":"spec-home-launch"}'::jsonb,
    '{"demo": "DEMO — seeded fake lead, not real"}'::jsonb
  ),
  (
    '11111111-1111-4111-8111-111111111111', 'sell', 'Grace — DEMO', '661-555-0106',
    'grace.demo@example.com', '890 Meridian Ct', 'Bakersfield',
    'sell-inherited', '1-3months',
    'I agree to be contacted by call, text, or email about my property, including by automated systems. Consent is not a condition of any purchase. Message/data rates may apply. Reply STOP to opt out at any time.',
    now() - interval '4 days', '203.0.113.15', 'DEMO-SEED/1.0',
    9, 'offer_out', '{}'::jsonb,
    '{"demo": "DEMO — seeded fake lead, not real"}'::jsonb
  );

-- NURTURE (score < 60)
insert into leads (
  tenant_id, source, name, phone, email, property_address, city,
  situation, timeline, consent_text, consent_at, ip, user_agent,
  form_seconds_open, status, utm, notes
) values
  (
    '11111111-1111-4111-8111-111111111111', 'land', 'Oscar — DEMO', '661-555-0107',
    'oscar.demo@example.com', 'APN 123-456-789', 'Tehachapi',
    'land', '1-3months',
    'I agree to be contacted by call, text, or email about my property, including by automated systems. Consent is not a condition of any purchase. Message/data rates may apply. Reply STOP to opt out at any time.',
    now() - interval '5 days', '203.0.113.16', 'DEMO-SEED/1.0',
    4, 'new', '{}'::jsonb,
    '{"demo": "DEMO — seeded fake lead, not real"}'::jsonb
  ),
  (
    '11111111-1111-4111-8111-111111111111', 'home', 'Lena — DEMO', '661-555-0108',
    'lena.demo@example.com', '410 Quail Run', 'Bakersfield',
    'update', 'asap',
    'I agree to be contacted by call, text, or email about my property, including by automated systems. Consent is not a condition of any purchase. Message/data rates may apply. Reply STOP to opt out at any time.',
    now() - interval '7 days', '203.0.113.17', 'DEMO-SEED/1.0',
    10, 'dead', '{}'::jsonb,
    '{"demo": "DEMO — seeded fake lead, not real"}'::jsonb
  );

-- A couple of outreach_log rows so the lead-detail timeline isn't empty
-- in demo mode.
insert into outreach_log (tenant_id, lead_id, channel, direction, body, ai_generated, disclosed_ai, outcome)
select
  '11111111-1111-4111-8111-111111111111',
  id,
  'email',
  'out',
  'Got your note about 304 Apollo St, will call from (661) 472-7499 — pick up.',
  true,
  false,
  'sent'
from leads
where tenant_id = '11111111-1111-4111-8111-111111111111' and name = 'Derek — DEMO';

insert into outreach_log (tenant_id, lead_id, channel, direction, body, ai_generated, disclosed_ai, outcome)
select
  '11111111-1111-4111-8111-111111111111',
  id,
  'call',
  'out',
  'Left voicemail, will try again tomorrow.',
  false,
  false,
  'no-answer'
from leads
where tenant_id = '11111111-1111-4111-8111-111111111111' and name = 'Connie — DEMO';
