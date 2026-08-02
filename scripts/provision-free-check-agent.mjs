/**
 * Provisions the free-check PHONE agent and its inbound number (idempotent).
 *
 * Creates/updates a Retell LLM + agent that runs the 11-question free AI
 * Opportunity Check by voice, wires the production webhook, then ensures a
 * phone number routes inbound calls to it (bought once; reruns reuse it).
 *
 * Prints RETELL_FREE_AGENT_ID=... and NEXT_PUBLIC_FREE_CHECK_PHONE=... for
 * the workflow to store in Vercel. Requires RETELL_API_KEY in the env.
 * Buying a number bills the Retell account (~$2/month) — the workflow gate
 * makes that an explicit, confirmed action.
 */

const API = 'https://api.retellai.com';
const AGENT_NAME = 'BizMetria Free Check Phone Agent';
const WEBHOOK_URL = 'https://bizmetria.com/api/webhooks/retell';
const VOICE_ID = '11labs-Adrian';
const AREA_CODE = Number(process.env.FREE_CHECK_AREA_CODE ?? '415');

const PROMPT = `You are the BizMetria free AI Opportunity Check agent. Callers dialled this number to take a free, 11-question check by voice instead of the web form. Be warm, efficient, and plain-spoken; one question at a time; short acknowledgements. The whole call should take about 5–10 minutes.

LANGUAGE: Start in English. If the caller speaks Spanish or asks for Spanish, switch fully to Spanish (usted form) for the rest of the call.

OPENING: Briefly: this is the free BizMetria AI Opportunity Check; about ten minutes; eleven quick questions about how the business runs; at the end they get a 0-100 score by email; the call is recorded and transcribed to produce the result. "I don't know" is always fine.

ASK THESE QUESTIONS IN ORDER (offer the options naturally, don't read them as a list unless the caller struggles):
1. What kind of business is it? (home services / dental or medical clinic / e-commerce / professional services / real estate / restaurant or hospitality / fitness or wellness / auto services / other - if other, ask what)
2. Team size? (just me / 2-5 / 6-15 / 16-50 / more than 50)
3. Roughly how many new inquiries or leads per month? (0-10 / 11-50 / 51-200 / more than 200 / not sure)
4. Through which channels do inquiries arrive? Several allowed. (phone calls / email / website form / WhatsApp or text / social media / walk-ins / referrals / marketplaces / other)
5. How fast does someone typically get a first reply? (within minutes / within an hour / within the same day / next day or later / often no reply at all)
6. How do they keep track of customers? (a CRM / spreadsheets / notebook or paper / memory / no consistent system)
7. Which areas involve repetitive manual work? Several allowed. (lead intake / scheduling / quotes or invoices / data entry / customer follow-up / reporting / inventory / payroll or HR admin / marketing content / customer support / document handling / none)
8. What happens with leads that do not convert right away? (structured follow-up sequence / occasional manual follow-up / follow-up when someone remembers / no defined follow-up process)
9. Biggest operational problem right now? (losing leads or slow response / too much manual work / disorganized customer data / limited visibility or reporting / costs growing faster than revenue / other)
10. What outcome would matter most in the next 90 days? (more new customers / faster response to inquiries / less time on admin / clearer numbers and reporting / lower operating costs / other)
11. How urgent is improving this? (want to start now / within 1-3 months / exploring options / just curious)

THEN CAPTURE CONTACT (required for the result):
- First name, business name.
- Email address: have them spell it, then read it back letter by letter and confirm. This is where the score goes — without a confirmed email the result cannot be delivered.
- Ask: "May we email you your result?" (this is the service message, not marketing).

CLOSING: Thank them; their AI Opportunity Score will arrive by email shortly, with a link to see the full breakdown online after creating a free account; the score is rule-based - same answers, same score.

NEVER: promise outcomes, revenue figures, or specific results; give consulting advice on the call; discuss anything beyond the check. If asked about the paid Business Assessment: it is a one-time $299 with a personalized reviewed report - details are on bizmetria.com. If the caller wants a human: support@bizmetria.com.`;

const key = process.env.RETELL_API_KEY;
if (!key) {
  console.error('RETELL_API_KEY is required.');
  process.exit(1);
}

async function retell(method, path, body) {
  const response = await fetch(`${API}${path}`, {
    method,
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const text = await response.text();
  if (!response.ok) {
    throw new Error(`${method} ${path} failed: ${response.status} ${text.slice(0, 300)}`);
  }
  return text ? JSON.parse(text) : {};
}

// --- Agent (create once, converge prompt/webhook on reruns) -----------------

const agents = await retell('GET', '/list-agents');
let agent = (Array.isArray(agents) ? agents : []).find((a) => a.agent_name === AGENT_NAME);

if (agent) {
  const full = await retell('GET', `/get-agent/${agent.agent_id}`);
  const llmId = full.response_engine?.llm_id;
  if (llmId) {
    await retell('PATCH', `/update-retell-llm/${llmId}`, { general_prompt: PROMPT });
  }
  const changes = {};
  if (full.webhook_url !== WEBHOOK_URL) changes.webhook_url = WEBHOOK_URL;
  if (Object.keys(changes).length > 0) {
    await retell('PATCH', `/update-agent/${agent.agent_id}`, changes);
  }
  console.log(`${AGENT_NAME}: exists, agent_id=${agent.agent_id}, prompt converged`);
} else {
  const llm = await retell('POST', '/create-retell-llm', {
    model: 'claude-4.5-sonnet',
    general_prompt: PROMPT,
    begin_message:
      'Hi! This is the free BizMetria AI Opportunity Check. In about ten minutes and eleven quick questions, you will get a zero-to-one-hundred score for your business by email. This call is recorded and transcribed to produce your result. Ready to start?',
  });
  agent = await retell('POST', '/create-agent', {
    agent_name: AGENT_NAME,
    voice_id: VOICE_ID,
    language: 'multi',
    response_engine: { type: 'retell-llm', llm_id: llm.llm_id },
    webhook_url: WEBHOOK_URL,
  });
  console.log(`${AGENT_NAME}: created, agent_id=${agent.agent_id}`);
}

// --- Phone number (reuse any number already routed to this agent) -----------

// Numbers use weighted agent lists since Retell's 2026-03-31 migration; the
// legacy single-agent field is read for old rows but never written.
const inboundAgents = [{ agent_id: agent.agent_id, weight: 1 }];

function routesTo(n, agentId) {
  if (Array.isArray(n.inbound_agents)) {
    return n.inbound_agents.some((entry) => entry.agent_id === agentId);
  }
  return n.inbound_agent_id === agentId;
}

function isSpare(n) {
  const list = Array.isArray(n.inbound_agents) ? n.inbound_agents : [];
  return list.length === 0 && !n.inbound_agent_id;
}

const numbers = await retell('GET', '/list-phone-numbers');
let number = (Array.isArray(numbers) ? numbers : []).find((n) => routesTo(n, agent.agent_id));

if (!number) {
  // A number bought earlier but pointed nowhere is re-pointed rather than
  // buying a second one; only a truly numberless account buys.
  const spare = (Array.isArray(numbers) ? numbers : []).find((n) => isSpare(n));
  if (spare) {
    await retell('PATCH', `/update-phone-number/${encodeURIComponent(spare.phone_number)}`, {
      inbound_agents: inboundAgents,
    });
    number = spare;
    console.log(`Re-pointed existing number ${spare.phone_number} to the free agent.`);
  } else {
    number = await retell('POST', '/create-phone-number', {
      inbound_agents: inboundAgents,
      area_code: AREA_CODE,
    });
    console.log(`Bought ${number.phone_number} (area code ${AREA_CODE}).`);
  }
} else {
  console.log(`Number already routed: ${number.phone_number}`);
}

console.log(`RETELL_FREE_AGENT_ID=${agent.agent_id}`);
console.log(`NEXT_PUBLIC_FREE_CHECK_PHONE=${number.phone_number}`);
