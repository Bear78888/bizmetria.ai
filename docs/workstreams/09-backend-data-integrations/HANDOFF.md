# Handoff

**Workstream:** 09 — Backend, Data and Integrations
**Last updated:** 2026-07-31

## Current implementation

BE-003 adds the real bilingual public website and deterministic Free AI Opportunity Check on top of merged BE-002. The server validates and recomputes every score, returns only approved free content, and can persist the lead, consent, assessment, answers, and score through the existing foundation schema. Elevated writes and CLI operations are guarded to exact project ref `rbndiytodvoyiejassnw`.

## Branch and PR

- Branch: `task/ws-09/BE-003-public-site-free-assessment-v2`
- PR: draft PR pending
- Base: verified `main` `ddfafe0079972b48540b35b4ee3cf4cfce3e68fd`

## Remaining gate

Require green GitHub CI and Vercel Preview. The owner must replace the unrelated Vercel Preview Supabase integration variables with values from the correct Supabase Preview Branch and confirm that the masked publishable and secret keys belong to that branch. Do not paste keys into GitHub, documentation, or chat. Until then, Preview remains on the explicit mock persistence adapter.

## Safety

PR #20 remains closed without merge. The wrong project is frozen; no rollback or cleanup was attempted. Production database writes, live Stripe, SMS marketing, and production Resend delivery remain disabled.
