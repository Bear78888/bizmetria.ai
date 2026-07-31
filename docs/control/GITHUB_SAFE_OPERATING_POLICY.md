# GitHub Safe Operating Policy

This policy minimizes repository risk, partial state, suspicious automation patterns, and avoidable API pressure.

## Core operating rules

- Perform all modifying operations sequentially; do not issue parallel mutative requests.
- Prefer local preparation and one batched tree/commit or one normal Git push.
- Keep at least one second between separate direct API write requests.
- One task uses one branch and one draft PR.
- A short task should normally use one coherent commit.
- A long task may use one architecture/checkpoint commit plus one final metadata/validation commit.
- Never write directly to `main`.
- Never force push or rewrite `main` history.
- Never run mass issue, comment, branch, follow, star, fork, or test-commit activity.
- Never bypass rate limits, permission failures, or platform warnings.
- Stop if API behavior appears suspicious or inconsistent.

## Rate-limit and error handling

On `403`, `429`, secondary rate limit, abuse detection, or unexpected refusal:

1. Stop all modifying requests.
2. Read the complete error and available headers.
3. Honor `Retry-After`; if the primary limit is exhausted, wait until the recorded reset.
4. Otherwise wait at least the platform-recommended interval.
5. Use exponentially increasing delays for controlled retries.
6. Make no more than three controlled retry attempts.
7. After the third failure, stop and report the exact blocker.
8. Never switch accounts, tokens, or integrations to evade the limit.

## Security and privacy

- Use the least permissions required for the current task.
- Do not change repository/account settings, branch protection, secrets, keys, webhooks, or Actions permissions unless a separate explicit task authorizes it.
- Never commit tokens, passwords, `.env` files, credentials, customer personal data, or production exports.
- Keep payment-card data with the approved payment processor.
- Do not place backup archives or large binary backups in the primary repository.

## Post-write verification

After every write, verify its exact result before the next operation. After publishing:

- verify branch and commit SHAs;
- verify base/head and draft status of the PR;
- verify commit and changed-file counts;
- inspect checks and review state;
- confirm `main` was not changed directly;
- confirm unrelated/test branches are unchanged;
- record errors and partial state in the relevant Handoff and Migration Report.

## Official GitHub references

- [Best practices for using the REST API](https://docs.github.com/en/rest/using-the-rest-api/best-practices-for-using-the-rest-api)
- [Rate limits for the REST API](https://docs.github.com/en/rest/using-the-rest-api/rate-limits-for-the-rest-api)
- [Troubleshooting the REST API](https://docs.github.com/en/rest/using-the-rest-api/troubleshooting-the-rest-api)
- [About protected branches](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)
- [Managing and standardizing pull requests](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/getting-started/managing-and-standardizing-pull-requests)
- [Secure use reference: least privilege](https://docs.github.com/en/actions/reference/security/secure-use)
