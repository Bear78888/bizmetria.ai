import 'server-only';

import { createSupabaseAdminClient } from '@/lib/supabase/admin';

/**
 * Linking free-check results into an authenticated account (the soft gate).
 *
 * The free check is deliberately account-less: the submission attaches to a
 * lead, not a profile. Row-level security exposes a free assessment to a
 * customer through `leads.owner_profile_id` (`app_private.owns_lead`), so
 * "claiming" a free result is simply attaching the matching leads to the
 * signed-in profile.
 *
 * Authorization is the email match, the same rule as the paid-order claim:
 * Supabase only issues a session once the address is confirmed, so the
 * authenticated email is proof of ownership of every lead captured under it.
 */

export interface LinkableLeadCandidate {
  readonly id: string;
  readonly email: string | null;
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

/**
 * Pure selection, separated so the matching rule is testable without a
 * database: exact address match after trimming and case folding — never a
 * pattern match, so `ilike` wildcards in a stored address cannot widen it.
 */
export function selectLinkableLeadIds(
  candidates: readonly LinkableLeadCandidate[],
  authenticatedEmail: string,
): readonly string[] {
  const wanted = normalizeEmail(authenticatedEmail);
  if (!wanted) return [];
  return candidates
    .filter((lead) => lead.email !== null && normalizeEmail(lead.email) === wanted)
    .map((lead) => lead.id);
}

export interface FreeLinkOutcome {
  /** Number of leads newly attached to the profile by this call. */
  readonly newlyLinked: number;
}

/**
 * Attaches every unowned lead with the customer's confirmed email to their
 * profile. Idempotent: already-owned leads are never touched, and the update
 * re-checks `owner_profile_id is null` so a concurrent claim cannot re-own a
 * lead. Uses the admin client because the rows are, by definition, not yet
 * visible to the customer under row-level security.
 */
export async function linkFreeWorkToProfile(profile: {
  readonly id: string;
  readonly email: string;
}): Promise<FreeLinkOutcome> {
  if (process.env.ASSESSMENT_STORAGE_MODE !== 'supabase') {
    return { newlyLinked: 0 };
  }

  const supabase = createSupabaseAdminClient();

  // Candidates are narrowed in SQL only by "unowned and not deleted"; the
  // authoritative email comparison happens in selectLinkableLeadIds.
  const { data: candidates, error: candidatesError } = await supabase
    .from('leads')
    .select('id, email')
    .is('owner_profile_id', null)
    .is('deleted_at', null);
  if (candidatesError) {
    throw new Error(`Unable to look up linkable leads (${candidatesError.code ?? 'unknown'}).`);
  }

  const leadIds = selectLinkableLeadIds(candidates ?? [], profile.email);
  if (leadIds.length === 0) return { newlyLinked: 0 };

  const { data: linked, error: linkError } = await supabase
    .from('leads')
    .update({ owner_profile_id: profile.id })
    .in('id', leadIds)
    .is('owner_profile_id', null)
    .select('id');
  if (linkError) {
    throw new Error(`Unable to link leads to the profile (${linkError.code ?? 'unknown'}).`);
  }

  return { newlyLinked: linked?.length ?? 0 };
}
