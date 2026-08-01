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
- `SUPABASE_PROJECT_REF=bwmyzkufqrufjimtfwow`
- `SUPABASE_TARGET_ENV=preview`
- `ASSESSMENT_STORAGE_MODE=supabase`

Vercel's own Git-integration build then produces the Preview; its build
succeeding with these variables confirms the app accepts and targets the
isolated dev project. A live HTTP write test against the Preview URL additionally
requires bypassing Vercel Deployment Protection (the Preview returns `401` to
anonymous requests), e.g. with a Protection Bypass for Automation token.

The canonical production environment must keep `SUPABASE_PROJECT_REF` and the URL
on `rbndiytodvoyiejassnw`, `ASSESSMENT_STORAGE_MODE=mock` (or unset), and must
never set `SUPABASE_TARGET_ENV`.
