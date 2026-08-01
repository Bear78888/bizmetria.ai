import { fileURLToPath } from 'node:url';

import { defineConfig } from 'vitest/config';

// Opt-in checks that call real third-party APIs. Never part of `npm run ci`:
// they need credentials, they cost money, and a provider outage must not turn
// into a red build. Run with `npm run test:live`.
export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  ssr: {
    resolve: {
      conditions: ['react-server', 'node', 'import'],
    },
  },
  test: {
    environment: 'node',
    include: ['tests/live/**/*.live.test.ts'],
    testTimeout: 180_000,
  },
});
