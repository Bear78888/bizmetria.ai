# BE-003 isolated development Supabase target

## Why this replaces the Supabase Preview Branch

The canonical project `bizmetria.ai` (`rbndiytodvoyiejassnw`) lives in the
Supabase organization `zgthongawzokxqvmsvmt`, which is on the **Free** plan.
Supabase **Branching** requires the **Pro** plan or above, so the branch-based
provisioning workflow could never succeed there — every attempt returned
`HTTP 402 entitlement_required (branching_limit)`.

Rather than pay for a recurring Pro plan or maintain a fragile per-push
branch-creation workflow, non-production database verification uses a single,
standalone, **free-tier** development project. Standalone projects are not a
paid feature, so this adds no recurring cost.

## Registered isolated development project

| Field                    | Value                                   |
| ------------------------ | --------------------------------------- |
| Name                     | `bizmetria-be003-dev`                   |
| Project ref              | `bwmyzkufqrufjimtfwow`                  |
| Organization             | `zgthongawzokxqvmsvmt` (`bizmetria.ai`) |
| Region                   | `us-east-2`                             |
| Contains production data | no                                      |
| Development seed loaded  | no                                      |

This ref is registered in `src/lib/supabase/target.ts`
(`REGISTERED_PREVIEW_PROJECT_REFS`). It is accepted by the target guard and the
environment schema **only** when `SUPABASE_TARGET_ENV=preview` is set, so
production stays pinned to the canonical ref and the wrong-project incident refs
remain refused.

## Verification performed

- Applied `supabase/migrations/20260731000100_platform_foundation.sql`.
- Confirmed 27 public tables, RLS enabled and forced on all 27, 56 public + 2
  storage policies, 8 `app_private` functions, and the private `reports` bucket.
- Ran a full real (non-mock) free-assessment write through the exact adapter
  shape — lead, assessment, 11 answers, generated `total_score = 100`
  (`VERY_HIGH`), and consents — then deleted it and confirmed all tables return
  to zero rows (cascade verified). The project holds no data.

## Enabling the deployed Preview to use this target

The local default remains `ASSESSMENT_STORAGE_MODE=mock`. The
`.github/workflows/wire-be003-preview.yml` workflow wires the deployed Preview
for this Git branch: it reads the dev project keys through the Supabase
Management API and sets the following branch-scoped Vercel Preview variables
(values never printed or committed):

- `NEXT_PUBLIC_SUPABASE_URL=https://bwmyzkufqrufjimtfwow.supabase.co`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<dev publishable key>`
- `SUPABASE_SECRET_KEY=<dev secret key>` (sensitive)
- `BIZMETRIA_SUPABASE_SECRET_KEY=<dev secret key>` (sensitive; see below)
- `SUPABASE_PROJECT_REF=bwmyzkufqrufjimtfwow`
- `SUPABASE_TARGET_ENV=preview`
- `ASSESSMENT_STORAGE_MODE=supabase`

It then redeploys the Preview — Vercel captures environment variables when a
deployment is created, so an existing deployment keeps the previous values — and
submits a real assessment through the protected Preview URL using a Protection
Bypass for Automation secret (the Preview returns `401` to anonymous requests).
The test requires `storageMode=supabase`, confirms the row reached the dev
project, deletes it, and verifies no rows remain.

## The Vercel Marketplace Supabase integration hijacks `SUPABASE_*`

A Supabase integration installed from the Vercel Marketplace is connected to this
Vercel project and **overwrites the `SUPABASE_*` variables on every deployment**
with credentials for its own unrelated project. This was proved, not assumed:

- The target guard refused a write because `NEXT_PUBLIC_SUPABASE_URL` arrived as
  `choztfjytyqijwbrvqjh.supabase.co` while `SUPABASE_PROJECT_REF` was still ours.
- A direct PostgREST probe using the workflow-resolved secret key wrote
  successfully, while the deployed Preview reported `Invalid API key` — so the
  deployment was receiving a different key.

Two application-side defences follow:

1. Elevated access derives its origin from the verified `SUPABASE_PROJECT_REF`
   (`resolveSupabaseAdminUrl`) rather than trusting the public URL variable.
2. The service-role key is read from `BIZMETRIA_SUPABASE_SECRET_KEY`, a namespace
   no third-party integration manages, falling back to `SUPABASE_SECRET_KEY`.

The integration should still be disconnected from the `bizmetria-ai` Vercel
project, because the browser/SSR Supabase client keeps receiving its values. That
is a dashboard action (Vercel → Integrations → Supabase → Manage → Show
Connections, or Manage Access): the API only supports deleting the entire
marketplace installation, which is a paid resource that may serve other projects.

## Defect found by the live test

The live write exposed a bug that would have affected every production
submission: consent rows were built with `id: undefined`, and supabase-js pads a
bulk payload so all rows share the same keys, sending an explicit `null` primary
key. That suppressed the column default and failed with
`23502 null value in column "id" ... violates not-null constraint`, so no consent
record was ever stored. New consents are now inserted without the `id` column and
existing ones updated by id.

The canonical production environment must keep `SUPABASE_PROJECT_REF` and the URL
on `rbndiytodvoyiejassnw`, `ASSESSMENT_STORAGE_MODE=mock` (or unset), and must
never set `SUPABASE_TARGET_ENV`.
