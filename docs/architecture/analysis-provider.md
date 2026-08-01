# Analysis provider: Claude (Anthropic)

**Decision date:** 2026-08-01
**Decided by:** project owner
**Status:** canonical — supersedes every earlier reference to OpenAI

Claude is the analysis provider for the paid Business Assessment. OpenAI was
planned for that role in the original roadmap and is no longer used anywhere in
this project; `OPENAI_API_KEY` has been removed from the environment contract.

## What the analysis is

The free AI Opportunity Check produces a deterministic score. It is arithmetic
over eleven fixed-choice answers, it involves no model, and that does not
change. The paid assessment turns that score into the four report sections the
free result shows as locked:

| Report section          | Contract field    |
| ----------------------- | ----------------- |
| Full personalized analysis | `executiveSummary`, `findings` |
| Complete recommendations   | `recommendations` |
| Impact vs. Effort Matrix   | `impact` / `effort` on each recommendation |
| 30–90 day roadmap          | `roadmap` |

`src/features/analysis/contract.ts` holds that shape as a Zod schema and the
contract version `business-analysis/1.0.0`.

## Two providers, one contract

| Provider        | Model           | Network | Used when |
| --------------- | --------------- | ------- | --------- |
| `claude`        | `claude-opus-5` | yes     | `ANTHROPIC_API_KEY` is configured |
| `deterministic` | none            | no      | no credential is configured, or `ANALYSIS_PROVIDER=deterministic` |

Both satisfy the same contract, and `tests/unit/analysis.test.ts` asserts the
same properties against both. The deterministic provider is not a placeholder
to be deleted: it keeps the feature developable and testable without a
credential, it makes CI free and offline, and it is the reference the Claude
provider is measured against.

`ANALYSIS_PROVIDER` only narrows the automatic choice. Setting it to `claude`
demands a credential and fails loudly without one — that is what a production
environment should do.

## The Claude call

`src/features/analysis/claude.ts` uses the official `@anthropic-ai/sdk`:

- `claude-opus-5`, adaptive thinking, `output_config.effort: 'high'`
- structured outputs via `zodOutputFormat(analysisContentSchema)` and
  `client.messages.parse()`, so the response shape is constrained at the API
  rather than repaired afterwards
- the system prompt carries nothing respondent-specific and is marked
  `cache_control: ephemeral`, so it stays a cacheable prefix across requests

## What the provider is not allowed to receive

`buildAnalysisInput` reduces a submission to the questionnaire and its score.
Contact name, business name, email, phone and website are structurally absent
from the object it returns, so no analysis provider can be sent them. The one
free-text field in the questionnaire — the respondent's own words for their
business category — travels inside a `<questionnaire>` block that the system
prompt designates as data, never as instructions.

## No silent downgrade

A failed Claude call raises `AnalysisProviderError`. It never falls back to the
deterministic analysis, because a paying customer receiving a rule-based report
labelled as a personalized one would be invisible to both them and the
operator. The same applies to a response that parses but is degenerate:
`normalizeAnalysisContent` rejects an analysis with no findings, no
recommendations, or an empty roadmap.

## Owner action still outstanding

`ANTHROPIC_API_KEY` does not yet exist in any environment. Until it is added to
Vercel (Preview and Production), every deployment runs the deterministic
provider. The schema accepts its absence deliberately — requiring it would fail
the build for a feature that has not shipped yet — but it validates the prefix
when present, so a key pasted into the wrong variable fails at build time.
