import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    projects: [
      { test: { name: 'unit', include: ['src/**/*.test.ts', 'tests/host-config.test.ts'] } },
      { test: { name: 'build-output', include: ['tests/build-output.test.ts'] } },
    ],
  },
});
