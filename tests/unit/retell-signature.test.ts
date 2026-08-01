import { Retell } from 'retell-sdk';
import { describe, expect, it } from 'vitest';

const API_KEY = 'key_unit_test_signature_only';

describe('Retell webhook signatures', () => {
  it('verify is asynchronous — treating its Promise as a boolean would accept everything', () => {
    const pending = Retell.verify('body', API_KEY, 'v=1,d=00');
    // This is the exact bug class the webhook route guards against: a
    // Promise is truthy, so `!Retell.verify(...)` never rejects anything.
    expect(pending).toBeInstanceOf(Promise);
    return pending.then((result) => expect(result).toBe(false));
  });

  it('round-trips a signature produced by the SDK signer', async () => {
    const body = JSON.stringify({ event: 'call_started', call: { call_id: 'call_test' } });
    const signature = await Retell.sign(body, API_KEY);
    await expect(Retell.verify(body, API_KEY, signature)).resolves.toBe(true);
  });

  it('rejects a tampered body', async () => {
    const body = JSON.stringify({ event: 'call_started', call: { call_id: 'call_test' } });
    const signature = await Retell.sign(body, API_KEY);
    await expect(Retell.verify(`${body} `, API_KEY, signature)).resolves.toBe(false);
  });

  it('rejects a signature made with a different key', async () => {
    const body = '{"event":"call_ended"}';
    const signature = await Retell.sign(body, 'key_some_other_key');
    await expect(Retell.verify(body, API_KEY, signature)).resolves.toBe(false);
  });
});
