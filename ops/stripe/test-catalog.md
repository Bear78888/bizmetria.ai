# Stripe test catalog

**Account:** `acct_1TzfDfReWI4VeYwH` — the BizMetria account, created 2026-08-01.
This replaces the earlier connection to an unrelated account (`Refundmyleads`),
whose credential was a **live** key. Stripe requires separate accounts for
businesses that operate independently, and mixing them would have put BizMetria
charges under another business's statement descriptor and tax identity.

**Mode:** test only. `scripts/provision-stripe-catalog.ts` refuses to run
against a key that does not start with `sk_test_`, so it cannot create a live
object by accident.

## What exists

| Object  | Identifier                       | Detail                        |
| ------- | -------------------------------- | ----------------------------- |
| Product | `prod_UzeptuObiGjDpW`            | BizMetria Business Assessment |
| Price   | `price_1TzfVPReWI4VeYwHgDI8Fvfp` | $299.00 USD, one-time         |

The price carries the lookup key `bizmetria_assessment_usd_299`, so the
application resolves it by name rather than storing an identifier that changes
between test and live.

## Promotion ladder

Implements `DEC-012` and `DEC-020` (`D04-B`): $49–$199 off, one promotion per
order, no stacking, and the $199 tier private and late-reactivation-only.

| Code     | Off  | State    | Cap | Approved use                                          |
| -------- | ---- | -------- | --- | ----------------------------------------------------- |
| `BIZ49`  | $49  | active   | —   | Bounded public campaign or approved partner cohort    |
| `BIZ99`  | $99  | active   | —   | Abandoned-checkout recovery, direct lifecycle message |
| `BIZ149` | $149 | disabled | 25  | Invite-only pilot or high-intent recovery             |
| `BIZ199` | $199 | disabled | 25  | Late reactivation; private code, never advertised     |

`BIZ149` and `BIZ199` are deliberately inactive. The approved launch rule is to
start with $49 and $99 and keep the deeper tiers switched off until payment,
attribution and suppression tests pass.

## Why the codes carry no expiry

The approved windows — 7 days for $49, 72 hours for the rest — run from the
moment a code is issued to a specific person. A Stripe promotion code only
supports one absolute `expires_at`, which cannot express a per-recipient
window. Eligibility and expiry are therefore enforced server-side at checkout,
and the Stripe object stays a dumb discount.

## Re-running

```
STRIPE_SECRET_KEY=sk_test_... node --experimental-strip-types \
  scripts/provision-stripe-catalog.ts
```

Idempotent: objects are matched by metadata, lookup key or code, and each
creation carries a stable idempotency key. Re-running converges the `active`
flag rather than creating duplicates — verified by running it three times and
confirming exactly four promotion codes exist.

## Before live mode

A separate, owner-approved activation step (`DEC-026`). It needs business
verification on the new account, live keys added to Vercel, a live webhook
endpoint with its signing secret, and this catalog re-created in live mode. No
part of that is done here.
