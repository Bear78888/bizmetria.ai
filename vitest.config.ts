import { fileURLToPath } from 'node:url';

import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    // Mirror the `@/*` alias from tsconfig so tests can import application
    // modules exactly the way the application imports them.
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  // Resolve the way a React Server Component does. Without this the
  // `server-only` marker resolves to the module that throws on import, so every
  // server module — routes, storage, elevated clients — is untestable. Vitest
  // loads modules through Vite's SSR pipeline, so the condition belongs here.
  ssr: {
    resolve: {
      conditions: ['react-server', 'node', 'import'],
    },
  },
  test: {
    environment: 'node',
    include: ['tests/unit/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json-summary'],
    },
  },
});
