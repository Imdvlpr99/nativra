import { useEffect, useState } from "react";

/** Package runners for one-off CLI commands (`npx nativra-cli …`). */
export const RUNNERS = {
  npm: { exec: "npx", install: "npm install" },
  pnpm: { exec: "pnpm dlx", install: "pnpm add" },
  yarn: { exec: "yarn dlx", install: "yarn add" },
  bun: { exec: "bunx", install: "bun add" },
} as const;
export type Runner = keyof typeof RUNNERS;

const KEY = "nativra-docs-runner";
const EVENT = "nativra-runner-change";

/** Rewrites an npm-style command (`npx …`, `npm install …`) for the chosen runner. */
export function forRunner(command: string, runner: Runner): string {
  return command
    .replace(/^npx /, `${RUNNERS[runner].exec} `)
    .replace(/^npm install /, `${RUNNERS[runner].install} `);
}

/** Shared, remembered package-runner preference: changing it anywhere updates every command. */
export function useRunner(): [Runner, (r: Runner) => void] {
  const [runner, setRunnerState] = useState<Runner>("npm");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(KEY);
      if (saved && saved in RUNNERS) setRunnerState(saved as Runner);
    } catch {
      // Storage unavailable: keep npm.
    }
    const onChange = (e: Event) => setRunnerState((e as CustomEvent<Runner>).detail);
    window.addEventListener(EVENT, onChange);
    return () => window.removeEventListener(EVENT, onChange);
  }, []);

  const setRunner = (r: Runner) => {
    try {
      localStorage.setItem(KEY, r);
    } catch {
      // Ignore: the preference just won't persist.
    }
    window.dispatchEvent(new CustomEvent<Runner>(EVENT, { detail: r }));
  };

  return [runner, setRunner];
}
