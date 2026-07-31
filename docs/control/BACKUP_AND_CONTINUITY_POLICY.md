# Backup and Continuity Policy

GitHub must not be the only copy of BizMetria or the only route to operational context.

## Required backup layers

1. Maintain an external repository mirror under independent access control.
2. Maintain an encrypted local or controlled-host mirror clone:

   ```bash
   git clone --mirror https://github.com/Bear78888/bizmetria.ai.git bizmetria.ai.git
   ```

3. Periodically refresh the mirror and create a dated bundle containing all refs:

   ```bash
   git -C bizmetria.ai.git remote update --prune
   git -C bizmetria.ai.git bundle create bizmetria-ai-YYYY-MM-DD.bundle --all
   ```

4. Store repository documentation and a copy of `docs/control/MASTER_CONTINUATION.md` outside GitHub.
5. Store backups outside the primary GitHub account and outside the primary working device.

## Recommended frequency

- After any major governance, product-contract, or release milestone.
- At least weekly during active development.
- Before account, organization, permission, or repository migrations.
- Immediately after a verified recovery.

The owner may approve a different schedule based on activity and risk; record it rather than assuming it.

## Restore testing

At least quarterly during active development:

1. restore the latest mirror or bundle into an isolated location;
2. verify all expected branches, tags, and recent commits;
3. open and validate the control documents and representative deliverables;
4. record date, source backup, result, gaps, and remediation outside the primary repository.

A backup is not trusted until restore has been tested.

## GitHub access loss

1. Stop writes and preserve local state.
2. Record the last verified remote SHA, branches, PRs, and error.
3. Retrieve the latest independently stored mirror/bundle and Master Continuation copy.
4. Restore to a new authorized Git provider only with explicit owner authority.
5. Verify object/ref completeness before resuming.
6. Re-establish one source of truth and document any lost unmerged work.
7. Never use another account or token merely to evade a platform restriction.

## Repository exclusions

Do not commit bundle files, mirror repositories, credential material, private exports, or large backup archives to `Bear78888/bizmetria.ai`.

This migration creates policy only. It does not create a real mirror, bundle, or external provider resource.
