<p align="center">
  <a href="https://nativra.vercel.app">
    <img src="https://nativra.vercel.app/icon.png" alt="Nativra CLI" width="72" height="72" />
  </a>
</p>

# nativra-cli

The official command-line interface for [Nativra](https://nativra.vercel.app) — the source-first UI platform for React Native and Expo.

## Features

- **Source Ownership** — Installs full TypeScript source code directly into your repository with zero runtime library lock-in.
- **Dual Styling Parity** — Generates idiomatic [NativeWind v4](https://nativewind.dev) or pure React Native [StyleSheet](https://reactnative.dev/docs/stylesheet) code.
- **Transactional Installation** — All file operations are staged and committed as atomic transactions. If any step fails, changes are safely rolled back to preserve your project state.
- **Integrity Checked** — Each file is checked against the SHA-256 hash the registry publishes with it before installation. This catches corrupted or truncated downloads; it does not prove who published the registry, so only add registries you trust.
- **Manifest-Driven Backups & Rollback** — Pre-update snapshots preserve full project-relative paths (components, hooks, utilities), allowing instant rollback.
- **Cycle & Traversal Protection** — Traversal segments (`../`) and cyclic dependency graphs are detected and safely rejected.

## Installation & Quick Start

Run via `npx` without global installation:

```bash
# Initialize Nativra in your Expo / React Native project
npx nativra-cli init

# Add components (resolves dependencies automatically)
npx nativra-cli add button input card

# List available registry items
npx nativra-cli list

# Compare installed components with upstream registry
npx nativra-cli diff button

# Safely update an installed component (creates backup before modifying)
npx nativra-cli update button

# Roll back an update if needed
npx nativra-cli rollback button

# Preview what an update would change
npx nativra-cli update --dry-run
```

## Styles

Every component's character (shape, type scale, density, surfaces, inputs and press feedback) comes from one style file, independent of the color theme. Pick one at `init`, or switch any time:

```bash
npx nativra-cli init --style crisp
npx nativra-cli style add ios
npx nativra-cli style list
```

| Style | Character |
|---|---|
| `soft` (default) | Pill buttons, generous rounding, soft shadows |
| `crisp` | shadcn/ui-like: small radii, hairline borders, compact |
| `tailwind` | Tailwind UI-like: rings, layered shadows, roomy |
| `material` | Material 3-like: tonal surfaces, filled fields |
| `ios` | iOS-like: grey grouped surfaces, larger type, dimming press |

## Other Registries

Add a registry once, then install its items as `<registry>/<id>`. `list` and `search` cover every configured registry, and `update` and `diff` use the registry each item was installed from.

```bash
npx nativra-cli registry add acme https://ui.acme.dev
npx nativra-cli add acme/data-grid
```

A local directory works too. A relative path is resolved against the project root.

## CI

- `nativra doctor` exits with code 1 when a check fails.
- `nativra audit --min-score <n>` fails below the score.
- `list`, `search` and `info` accept `--json`, and work before `init`.

## Conflict Policy & Non-Interactive CI

By default, Nativra **never** silently overwrites existing files.

| Flag / Option | Behavior |
|---|---|
| *(interactive)* | Prompts for each existing file: `Skip` or `Overwrite`. |
| `--yes` | Non-interactive. Preserves existing files by skipping them, preventing accidental code loss. |
| `--overwrite` | Non-interactive. Overwrites existing files with upstream code. |
| `--on-conflict <mode>` | Explicit policy: `skip`, `overwrite`, or `error` (aborts with exit code 1 on conflict). Without it: prompt interactively, skip with `--yes` or when not attached to a terminal. |

```bash
# In CI pipelines, keep existing files safely:
npx nativra-cli add button --yes

# In CI pipelines, fail if a file conflict occurs:
npx nativra-cli add button --yes --on-conflict error

# In automated scaffolding, force overwrite:
npx nativra-cli add button --yes --overwrite
```

## Compatibility Matrix

- **Expo**: SDK 51, SDK 52 (Expo Go and Development Builds)
- **React Native**: 0.74, 0.75, 0.76+ (Both Old Architecture and New Architecture Fabric/TurboModules)
- **Styling**: NativeWind v4.0.1+ / React Native StyleSheet
- **Runtime / Node**: Node.js >= 20.0.0, pnpm >= 9.0.0

## License

MIT © Nativra Authors

