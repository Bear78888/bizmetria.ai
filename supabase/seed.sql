-- Synthetic development-only event. Never place real customer data in this file.
insert into public.integration_events (
  id,
  source,
  event_type,
  external_event_id,
  payload,
  processing_status,
  received_at
)
values (
  '00000000-0000-4000-8000-000000000001',
  'synthetic_seed',
  'platform.foundation.ready',
  'synthetic-foundation-event-001',
  '{"synthetic": true, "environment": "local"}'::jsonb,
  'processed',
  '2026-07-31T00:00:00Z'::timestamptz
)
on conflict (source, external_event_id) do nothing;
