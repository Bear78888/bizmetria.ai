/**
 * Provisions the BizMetria interview agents in Retell (development/test).
 *
 * Creates one voice agent per locale (EN, ES), each backed by a Retell LLM
 * response engine whose prompt implements the ten approved interview
 * objectives from PS-004 §9.2 — and nothing beyond them. Idempotent by agent
 * name: an existing `bizmetria-interview-en` / `-es` agent is reused and its
 * ids are printed, so re-running never creates duplicates.
 *
 * No phone numbers are purchased and no calls are placed. Web-call access is
 * created at interview time by the application, not here.
 *
 *   RETELL_API_KEY=... [RETELL_WEBHOOK_URL=...] node scripts/provision-retell-agents.mjs
 */

import { Retell } from 'retell-sdk';

const apiKey = process.env.RETELL_API_KEY;
if (!apiKey) throw new Error('RETELL_API_KEY is required.');

// The public origin serving /api/webhooks/retell since domain activation.
const webhookUrl = process.env.RETELL_WEBHOOK_URL ?? 'https://bizmetria.com/api/webhooks/retell';

const client = new Retell({ apiKey });

/**
 * The interview contract, shared by both locales. The agent adapts probe
 * selection within these objectives; it must not expand into implementation
 * consulting or unrestricted discovery (PS-004 §9.1).
 */
const interviewContract = `
You are conducting a structured business-assessment interview for BizMetria.
The customer has already given recorded consent. They may have completed the
written questionnaire, or may have chosen to answer everything in this
conversation instead; this call usually takes 30-60 minutes.

CONVERSATION STYLE — this matters as much as the content:
- Talk like a sharp, friendly human interviewer, not a form being read aloud.
- One short question at a time — usually a single sentence.
- Never read out lists of options or categories. Ask openly and let them
  answer in their own words; only offer two or three quick examples if they
  are genuinely stuck.
- Acknowledge in a few words ("Got it." "Makes sense." "Okay."), varied, then
  move on. Never recap or summarize what they just said back at them, except
  once at the very end.
- No monologues, no long transitions, no explaining why you are asking.

Work through these ten objectives, adapting your follow-up questions but never
leaving this scope:
1. Confirm the participant's role, authority, and scope, and who must validate
   material decisions.
2. Confirm the primary objective, the intended operational outcome, and the
   time horizon.
3. Walk through the primary workflow from trigger to outcome: capture the
   trigger, the outcome, and at least two ordered steps.
4. Clarify handoffs, exceptions, the main bottleneck, delays, manual effort,
   and rework.
5. Confirm system categories, how connected they are, data sources, data
   quality, and authorized-access constraints.
6. For every material quantity, distinguish measured, estimated, and unknown
   values. "Unknown" is always an acceptable answer; never invent precision.
7. Confirm constraints, regulated-data categories, risks, capacity, and
   dependencies. "None" or "unknown" are acceptable.
8. Test improvement hypotheses against what the customer actually said, without
   prescribing implementations, vendors, or prices.
9. Surface and resolve — or explicitly classify — material contradictions
   between the questionnaire and this conversation.
10. Close by confirming what the report will and will not cover, the selected
    language, the limits of the evidence, and the next steps.

Hard rules:
- Never request or accept passwords, API keys, card or bank data, government
  identifiers, customer lists, employee records, health data, or any other
  sensitive records. If such a topic affects feasibility, note the category at
  a high level and move on.
- Do not give implementation consulting, legal, tax, or financial advice, and
  do not promise outcomes, savings, or delivery dates.
- Stay professional, concise, and warm. One question at a time.
`.trim();

const locales = [
  {
    key: 'en',
    agentName: 'bizmetria-interview-en',
    language: 'en-US',
    beginMessage:
      'Hello! This is the BizMetria business assessment interview. This call is recorded and transcribed, as you agreed a moment ago. It takes up to 45 minutes, and "I don\'t know" is always a fine answer. Shall we begin?',
    promptSuffix: 'Conduct the entire interview in English.',
  },
  {
    key: 'es',
    agentName: 'bizmetria-interview-es',
    language: 'es-419',
    beginMessage:
      'Hola, le habla la entrevista de la Evaluación Empresarial de BizMetria. Esta llamada se graba y se transcribe, como usted aceptó hace un momento. Dura hasta 45 minutos y "no lo sé" siempre es una respuesta válida. ¿Comenzamos?',
    promptSuffix: 'Realice toda la entrevista en español.',
  },
];

const LANGUAGE_MARKERS = {
  en: ['en', 'english'],
  es: ['es', 'spanish', 'español', 'espanol'],
};

/**
 * Chooses a voice for the language. Metadata varies by provider ('es-419',
 * 'Spanish', a voice named 'Santiago'…), so matching is by marker across
 * language, accent and name. The current voice is kept whenever it already
 * fits, so convergence never churns a working agent. When nothing matches,
 * the available languages are printed and the first voice overall is the
 * fallback — a working agent with an imperfect accent beats no agent.
 */
async function pickVoice(language, currentVoiceId) {
  const voices = await client.voice.list();
  const markers = LANGUAGE_MARKERS[language.split('-')[0]] ?? [language.split('-')[0]];
  // Short codes only ever match the language/accent fields (so 'es' cannot
  // match a voice named 'Jess'); words may match anywhere in the metadata.
  const shortMarkers = markers.filter((marker) => marker.length <= 3);
  const longMarkers = markers.filter((marker) => marker.length > 3);
  const matches = (voice) => {
    const langField = `${voice.language ?? ''} ${voice.accent ?? ''}`.toLowerCase().trim();
    const everything = [voice.language, voice.accent, voice.voice_name, voice.voice_id]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();
    return (
      shortMarkers.some((marker) => langField.startsWith(marker)) ||
      longMarkers.some((marker) => everything.includes(marker))
    );
  };
  const candidates = voices.filter(matches).sort((a, b) => a.voice_id.localeCompare(b.voice_id));
  const current = currentVoiceId
    ? candidates.find((voice) => voice.voice_id === currentVoiceId)
    : undefined;
  if (current) return current.voice_id;
  if (candidates.length === 0) {
    const seen = [...new Set(voices.map((voice) => voice.language ?? 'unknown'))].sort();
    console.log(`no voice matched ${language}; available languages: ${seen.join(', ')}`);
  }
  const chosen = candidates[0] ?? voices.sort((a, b) => a.voice_id.localeCompare(b.voice_id))[0];
  if (!chosen) throw new Error(`No Retell voice available for language ${language}.`);
  return chosen.voice_id;
}

// Agent listing is paginated: the response is `{ items }`, not an array.
async function listAgents() {
  const response = await client.agent.list();
  return response.items ?? [];
}

const existingAgents = await listAgents();

for (const locale of locales) {
  const existing = existingAgents.find((agent) => agent.agent_name === locale.agentName);
  if (existing) {
    // Converge voice and webhook: the first provisioning run could fall back
    // to an English voice, and agents created before domain activation still
    // point their webhook at the Vercel host. Convergence is best-effort per
    // step — the agents already work, so a provider hiccup here must not
    // fail the run; each step names itself so a repeated failure is
    // attributable from the log.
    let step = 'retrieve agent';
    try {
      const full = await client.agent.retrieve(existing.agent_id);
      step = 'pick voice';
      const desiredVoice = await pickVoice(locale.language, full.voice_id);
      // The prompt is converged on every run, so style and contract changes
      // in this file reach agents that already exist.
      const llmId = full.response_engine?.llm_id;
      if (llmId) {
        step = 'update prompt';
        await client.llm.update(llmId, {
          general_prompt: `${interviewContract}\n\n${locale.promptSuffix}`,
        });
      }
      step = 'compare fields';
      const changes = {};
      if (full.voice_id !== desiredVoice) changes.voice_id = desiredVoice;
      if (full.webhook_url !== webhookUrl) changes.webhook_url = webhookUrl;
      if (Object.keys(changes).length > 0) {
        step = `update ${Object.keys(changes).join('+')}`;
        await client.agent.update(existing.agent_id, changes);
        console.log(
          `${locale.agentName}: exists, agent_id=${existing.agent_id}, updated ${Object.keys(changes).join('+')} (voice=${changes.voice_id ?? full.voice_id})`,
        );
      } else {
        console.log(
          `${locale.agentName}: exists, agent_id=${existing.agent_id}, voice=${full.voice_id}`,
        );
      }
    } catch (error) {
      const status = error?.status ?? 'unknown';
      console.log(
        `${locale.agentName}: exists, agent_id=${existing.agent_id}, convergence skipped — ${step} failed with ${status}`,
      );
    }
    continue;
  }

  const llm = await client.llm.create({
    model: 'claude-4.5-sonnet',
    general_prompt: `${interviewContract}\n\n${locale.promptSuffix}`,
    begin_message: locale.beginMessage,
  });

  const voiceId = await pickVoice(locale.language);
  const agent = await client.agent.create({
    agent_name: locale.agentName,
    response_engine: { type: 'retell-llm', llm_id: llm.llm_id },
    voice_id: voiceId,
    language: locale.language,
    webhook_url: webhookUrl,
  });

  console.log(
    `${locale.agentName}: created, agent_id=${agent.agent_id}, llm_id=${llm.llm_id}, voice=${voiceId}`,
  );
}

console.log('');
console.log('Set these in Vercel (Production):');
const finalAgents = await listAgents();
for (const locale of locales) {
  const agent = finalAgents.find((candidate) => candidate.agent_name === locale.agentName);
  if (agent) {
    console.log(`RETELL_AGENT_ID_${locale.key.toUpperCase()}=${agent.agent_id}`);
  }
}
