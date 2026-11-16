import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // e2e and regression tests spawn several CLI processes per test. Under turbo's parallel
    // `pnpm test` (and on Windows, where process start-up is slow) that outgrows the 5s default.
    testTimeout: 30_000,
    hookTimeout: 30_000,
  },
});
