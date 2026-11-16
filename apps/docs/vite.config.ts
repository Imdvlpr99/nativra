import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  // Dev pre-bundling must match the build target; its es2020 default can't downlevel some deps.
  optimizeDeps: { rolldownOptions: { transform: { target: "es2022" } } },
  build: {
    target: "es2022",
    // Shiki grammars are split into their own lazily loaded chunks.
    chunkSizeWarningLimit: 900,
  },
  ssr: {
    // Bundle workspace packages into the prerender build so it runs without a TS loader.
    noExternal: ["@nativra/theme-engine", "@nativra/registry-schema"],
  },
});
