import { createHash } from 'node:crypto';

import Anthropic from '@anthropic-ai/sdk';
import { NextResponse } from 'next/server';
import { z } from 'zod';

import { METRIA_SYSTEM_PROMPT } from '@/features/chatbot/prompt';
import { admitChatRequest } from '@/features/chatbot/rate-limit';
import { createSupabaseRateLimitStore } from '@/features/chatbot/supabase-rate-limit';

export const runtime = 'nodejs';
export const maxDuration = 60;

const MAX_REQUEST_BYTES = 32 * 1024;

// Opus for quality — the bot is the live demo of the product. The cost side
// is bounded elsewhere: short history, capped output, per-visitor and global
// rate limits, and a cached constant system prefix.
const CHAT_MODEL = 'claude-opus-5';
const MAX_OUTPUT_TOKENS = 400;

const chatRequestSchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(['user', 'assistant']),
        content: z.string().trim().min(1).max(1000),
      }),
    )
    .min(1)
    .max(12)
    // The newest message must be the visitor's — the reply answers it.
    .refine((messages) => messages[messages.length - 1]?.role === 'user', {
      message: 'last message must be from the user',
    }),
});

function visitorKeyHash(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for') ?? '';
  const address = forwarded.split(',')[0]?.trim() || 'unknown';
  // Hashed so raw addresses never persist in the rate-limit table.
  return createHash('sha256').update(address).digest('hex');
}

export async function POST(request: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'chat_unavailable' }, { status: 503 });
  }

  let payload: unknown;
  try {
    const rawPayload = await request.text();
    if (rawPayload.length > MAX_REQUEST_BYTES) {
      return NextResponse.json({ error: 'invalid_request' }, { status: 413 });
    }
    payload = JSON.parse(rawPayload);
  } catch {
    return NextResponse.json({ error: 'invalid_request' }, { status: 400 });
  }

  const parsed = chatRequestSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: 'invalid_request' }, { status: 400 });
  }

  try {
    const admitted = await admitChatRequest(
      createSupabaseRateLimitStore(),
      visitorKeyHash(request),
    );
    if (!admitted) {
      return NextResponse.json({ error: 'rate_limited' }, { status: 429 });
    }
  } catch (error) {
    // A rate-limiter failure closes the endpoint rather than opening it.
    console.error('chat rate limiting failed', error);
    return NextResponse.json({ error: 'chat_unavailable' }, { status: 503 });
  }

  try {
    const client = new Anthropic({ apiKey });
    const response = await client.messages.create({
      model: CHAT_MODEL,
      max_tokens: MAX_OUTPUT_TOKENS,
      // Constant across every visitor, so the prefix stays cacheable.
      system: [{ type: 'text', text: METRIA_SYSTEM_PROMPT, cache_control: { type: 'ephemeral' } }],
      messages: parsed.data.messages,
    });

    if (response.stop_reason === 'refusal') {
      return NextResponse.json({ error: 'chat_unavailable' }, { status: 502 });
    }

    const reply = response.content
      .filter((block): block is Anthropic.TextBlock => block.type === 'text')
      .map((block) => block.text)
      .join('')
      .trim();
    if (reply.length === 0) {
      return NextResponse.json({ error: 'chat_unavailable' }, { status: 502 });
    }

    return NextResponse.json({ reply });
  } catch (error) {
    console.error('chat completion failed', error);
    return NextResponse.json({ error: 'chat_unavailable' }, { status: 503 });
  }
}
