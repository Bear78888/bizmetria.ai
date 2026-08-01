# Credential Setup Checklist

**Last updated:** 2026-07-31
**Safety rule:** Verify names and functional outcomes only. Never paste, print, snapshot, or commit credential values.

## Platform Foundation preview

- [ ] Vercel Preview contains `NEXT_PUBLIC_SUPABASE_URL`.
- [ ] Its value is configured in Vercel as the project root URL, with no `/rest/v1/` path.
- [ ] Vercel Preview contains `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
- [ ] Vercel Preview contains `SUPABASE_SECRET_KEY`.
- [ ] Native Vercel Preview reports `Ready` for the PR head.
- [ ] Native Supabase integration validates the migration or creates a preview branch when supported.
- [ ] No production Supabase migration is applied without explicit owner permission.

## Later sandbox stages

- [ ] Anthropic, Stripe, Retell, and Resend expected names are present in Vercel Preview.
- [ ] Stripe keys pass test-mode validation.
- [ ] Later provisioned IDs/webhook names are added directly to the appropriate dashboard environment.
- [ ] Development calls, emails, and test payments use synthetic data only.

## Production activation

Production credentials, phone numbers, email delivery, database changes, real payments, and the final domain remain unchecked until the owner gives a separate explicit production authorization.
