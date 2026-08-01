# Enabling lead capture in production

## What is true today

The public site is live and both locales serve the free AI Opportunity Check.
**Production does not store anything.** `ASSESSMENT_STORAGE_MODE` is unset, which
selects the mock adapter, so every submission is scored, returned to the
visitor, and then discarded. The canonical database holds zero rows because
nothing has ever been written to it, not because nobody has submitted.

Confirm the live state at any time — no credentials needed:

```
curl -s https://<deployment-host>/api/health
```

```json
{
  "status": "ok",
  "service": "bizmetria-web",
  "adapters": {
    "assessmentStorage": "mock",
    "analysisProvider": "deterministic",
    "resultEmail": "skipped"
  }
}
```

`assessmentStorage: "mock"` means leads are being lost.

## Readiness

| Prerequisite                                                                | State                                        |
| --------------------------------------------------------------------------- | -------------------------------------------- |
| Canonical project `rbndiytodvoyiejassnw` has the platform schema            | ready — 27 tables, RLS forced, 0 rows        |
| Write path exercised end to end against a real Postgres                     | ready — verified on the isolated dev project |
| The `consents` null-primary-key defect that failed every write              | fixed in `main`                              |
| Target guard refuses any project other than the canonical one in production | ready                                        |

The remaining unknown is the production `SUPABASE_SECRET_KEY` itself. It has
never performed a write, and an invalid or wrong-project key is exactly what
produced the Preview failures. The first real submission is therefore also the
first test of that key.

## Making the change

This writes customer data to the production database and needs an explicit
owner decision. It is one variable.

1. **Vercel → project `bizmetria-ai` → Settings → Environment Variables**, scope
   **Production**: add `ASSESSMENT_STORAGE_MODE` = `supabase`.
2. **Redeploy production.** Environment variables are captured when a deployment
   is created, so the running deployment keeps the old value until it is
   replaced.
3. **Verify** `/api/health` now reports `"assessmentStorage": "supabase"`.
4. **Submit one real assessment** through the live site and confirm a row lands
   in `leads`, `free_assessments`, `free_assessment_answers`,
   `opportunity_scores` and `consents`. A 503 with `assessment_unavailable`
   means the write failed; the reason is in the Vercel function logs, which
   carry the Postgres error code.

## Reverting

Remove the variable and redeploy. Rows already written stay written — deleting
customer data is a separate decision with its own retention rules.

## Not part of this change

Result email stays off (`RESEND_DELIVERY_MODE` unset), and the paid analysis
stays on the deterministic provider until `ANTHROPIC_API_KEY` exists. Storing a
lead and emailing a lead are separate switches on purpose.
