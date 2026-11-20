import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // Each tool call spawns the CLI; slow on Windows and under turbo's parallel test run.
    testTimeout: 60_000,
    hookTimeout: 60_000,
  },
});
