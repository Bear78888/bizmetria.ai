# Current State

**Workstream:** 09 — Backend, Data and Integrations
**Status:** `IN PROGRESS`
**Last updated:** 2026-07-31
**Current task:** `BE-002 — Platform Foundation`
**Current branch:** `task/ws-09/BE-002-platform-foundation`
**Current PR:** Pending creation

## Confirmed starting point

Remote `main` was verified at `7677bee1b0791bb4f954f058aa9e959d4796985a`; no PR was open when BE-002 began. MC-003, PS-003, FA-001, PS-004, LS-002, and LC-001 were already merged and are not being repeated. AE-001 remains unfinished but does not block Platform Foundation under the owner's current technical directive.

## In progress

Production-grade Next.js/TypeScript foundation, scoped environment validation, Supabase migration, Auth, RLS, private Storage, synthetic seed data, CI, unit/integration tests, browser smoke tests, and native preview verification.

## Safety boundary

Only synthetic/sandbox operation is authorized. Stripe live mode, real payments, production Retell numbers, production email, production Supabase changes, and final-domain publication are not part of BE-002.

## Acceptance gate

- strict typecheck, formatting, lint, unit/integration tests, and production build pass;
- GitHub CI passes;
- Vercel Preview is `Ready` and bilingual/auth/health surfaces respond;
- native Supabase preview validation succeeds when available;
- RLS and private-storage policies are present and migration-contract tests pass;
- no secret value is present in Git history or output.

## Exact next action

Publish the verified implementation as one draft PR, update its metadata once with the PR number, and run the remote acceptance gate without applying production Supabase changes.
