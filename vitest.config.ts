import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

const root = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  resolve: {
    // Mirror the tsconfig "@/*" alias so tests resolve source imports.
    alias: { '@': root },
  },
  test: {
    environment: 'node',
    include: ['lib/**/*.test.ts'],
  },
});
