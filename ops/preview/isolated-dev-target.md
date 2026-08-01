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

The application still defaults to `ASSESSMENT_STORAGE_MODE=mock`. To make a
Vercel Preview write to this isolated project, set the following branch-scoped
Preview variables (never commit their values):

- `NEXT_PUBLIC_SUPABASE_URL=https://bwmyzkufqrufjimtfwow.supabase.co`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<dev publishable key>`
- `SUPABASE_SECRET_KEY=<dev secret key>` (sensitive)
- `SUPABASE_PROJECT_REF=bwmyzkufqrufjimtfwow`
- `SUPABASE_TARGET_ENV=preview`
- `ASSESSMENT_STORAGE_MODE=supabase`

The canonical production environment must keep `SUPABASE_PROJECT_REF` and the URL
on `rbndiytodvoyiejassnw`, `ASSESSMENT_STORAGE_MODE=mock` (or unset), and must
never set `SUPABASE_TARGET_ENV`.
