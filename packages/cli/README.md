<p align="center">
  <a href="https://nativra.vercel.app">
    <img src="https://nativra.vercel.app/icon.png" alt="Nativra CLI" width="72" height="72" />
  </a>
</p>

# nativra-cli

The official command-line interface for [Nativra](https://nativra.vercel.app) — the source-first UI platform for React Native and Expo.

**Try it without installing anything:** the [playground](https://nativra.vercel.app/playground) runs this CLI in your browser, against a real React Native project with an editor and a live preview.

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

## Commands

| Command | What it does |
|---|---|
| `init [--style <id>] [--force]` | Detects Expo, NativeWind, `src/` and your tsconfig alias, and writes `nativra.json` |
| `add <items...>` | Installs items and their dependencies; `<registry>/<id>` for other registries |
| `remove <items...>` | Removes installed items (refuses while other items depend on them) |
| `update [items...] [--dry-run] [--force]` | Updates installed items; files you edited are skipped unless `--force` |
| `diff <item>` | Shows how your copy differs from the registry |
| `rollback <item>` | Restores the most recent backup of an item |
| `list` · `search <query>` · `info <item>` | Browse the registry (`--json` for scripts) |
| `theme list` · `theme add <id>` | Color themes (written to `theme.ts` and, for NativeWind, `global.css`) |
| `style list` · `style add <id>` | UI styles: shape, type, density and surfaces |
| `registry list` · `registry add <name> <url>` | Manage registries |
| `doctor [--fix]` | Checks the project setup (exit code 1 when a check fails) |
| `audit [--fix] [--min-score <n>]` | Accessibility and token-hygiene report for your codebase |

## Themes

Ten color themes with light and dark palettes. Every component reads them, so switching restyles the app:

```bash
npx nativra-cli theme list
npx nativra-cli theme add midnight --overwrite
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

- **Expo**: SDK 51 and 52 (Expo Go and development builds), or React Native CLI apps without Expo
- **React Native**: 0.74+ (Old and New Architecture)
- **Styling**: NativeWind v4.0.1+ or React Native StyleSheet
- **Node.js**: 20+, with npm, pnpm, yarn or bun (detected from your project, including monorepo roots)

## License

MIT © Nativra Authors

