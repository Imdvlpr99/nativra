<p align="center">
  <a href="https://nativra.vercel.app">
    <img src="assets/logo.png" alt="Nativra Banner" width="560" />
  </a>
</p>

<p align="center">
  <strong>Native UI, built your way.</strong><br />
  A source-first UI development platform for React Native & Expo.<br />
  Copy production-ready components into your codebase, own every line, and customize without runtime package locks.
</p>

<p align="center">
  <a href="https://github.com/Imdvlpr99/nativra/actions"><img src="https://img.shields.io/badge/CI-Passing-emerald?style=flat-square&logo=github" alt="CI Status" /></a>
  <a href="https://npmjs.com/package/nativra-cli"><img src="https://img.shields.io/badge/npm-v0.3.0-sky?style=flat-square&logo=npm" alt="npm package" /></a>
  <a href="https://reactnative.dev"><img src="https://img.shields.io/badge/React%20Native-0.74+-22c55e?style=flat-square&logo=react" alt="React Native 0.74+" /></a>
  <a href="https://expo.dev"><img src="https://img.shields.io/badge/Expo-SDK%2051+-000000?style=flat-square&logo=expo" alt="Expo SDK 51+" /></a>
  <a href="#license"><img src="https://img.shields.io/badge/License-MIT-blue?style=flat-square" alt="License" /></a>
</p>

---

## What is Nativra?

Nativra combines the discoverability, accessibility, and copy-into-your-project philosophy of [shadcn/ui](https://ui.shadcn.com) with tooling and behavioral ergonomics designed specifically for native mobile apps.

Developers use Nativra to:

- 🔍 **Discover** — 39 components, 18 blocks, 8 full-screen templates and 8 hooks, each in NativeWind v4 and StyleSheet.
- 🧪 **Try it in the browser** — The [playground](https://nativra.vercel.app/playground) is a real React Native project with an editor, a live preview, and a terminal running `nativra-cli`. No install.
- 🎭 **Pick a style** — Five complete looks (`soft`, `crisp`, `tailwind`, `material`, `ios`), independent of the 10 color themes. Switch the whole app with one command.
- 📱 **Preview & Inspect** — Every item renders live in the docs, in any theme, style, and light or dark mode.
- ⚡ **Install** — Add TypeScript sources directly to your project with `npx nativra-cli add <item>`, from the default registry or your own.
- 🛡️ **Own Your Code** — No runtime dependency lock-in; edit and maintain code directly. Local edits are never overwritten without asking.

---

## Monorepo Architecture

```
nativra/
├── assets/                # Official brand logos, marks, and favicons
├── apps/
│   ├── docs/              # Documentation, catalog, live previews and the playground (Vite + React, prerendered)
│   └── native-preview/    # Expo app: native verification, and the docs' web previews and playground runtime
├── packages/
│   ├── cli/               # nativra — Install, diff, update, and rollback components
│   ├── registry-schema/   # Zod validation schemas and TypeScript contracts
│   ├── registry-client/   # Upstream registry client with HTTP caching and checksums
│   ├── registry-builder/  # Compiles authored sources into registry distributions
│   ├── theme-engine/      # Semantic token model and CSS/StyleSheet adapters
│   ├── preview-runtime/   # Shared canvas runtime and test fixtures
│   ├── config/            # Shared ESLint, Prettier, TypeScript, and Vitest configs
│   └── utils/             # Lightweight utilities (cn, style mergers)
├── registry/
│   └── default/           # Authored components, blocks, templates, hooks, themes and styles
└── examples/
    ├── expo-nativewind/   # Expo example with NativeWind v4
    └── expo-stylesheet/   # Expo example with pure StyleSheet
```

---

## Quick Start

Want to look around first? Open the [playground](https://nativra.vercel.app/playground) and run the same commands in your browser.

### Initialize in your project

```bash
npx nativra-cli init                # detects Expo, NativeWind, src/ and your tsconfig alias
npx nativra-cli init --style ios    # or pick a style up front
```

### Add components

```bash
# Add primitives
npx nativra-cli add button input card

# Add composite blocks
npx nativra-cli add app-header order-summary stat-progress-card

# Add complete screen templates
npx nativra-cli add analytics-dashboard fintech-wallet
```

### Theme and style

```bash
npx nativra-cli theme add midnight --overwrite   # colors (10 themes)
npx nativra-cli style add material               # shape, type, density, surfaces (5 styles)
```

### Keep up to date

```bash
npx nativra-cli update --dry-run   # see what would change
npx nativra-cli update             # files you edited are skipped unless --force
npx nativra-cli rollback button    # undo the last change to an item
```

---

## Development & Contributing

### Prerequisites

- Node.js >= 20.x
- pnpm >= 9.x

### Setup

```bash
# Clone the repository
git clone https://github.com/Imdvlpr99/nativra.git
cd nativra

# Install workspace dependencies
pnpm install

# Build all packages & registry
pnpm build

# Run the documentation and playground locally (http://localhost:3000)
pnpm dev

# Run native preview in the browser
pnpm --filter @nativra/native-preview web

# Typecheck, lint and test everything
pnpm typecheck && pnpm lint && pnpm test
```

---

## Product Principles

- **Source Ownership** — Installed components live directly in your codebase; you own every line.
- **Native-First** — Built from the ground up for React Native 0.74+ (Bridgeless & TurboModule ready).
- **Dual Styling Parity** — Full 1:1 parity between NativeWind v4 and pure React Native StyleSheet.
- **Tokens, Not Hard-Coded Values** — Colors come from the theme and shape, type and density from the style, so one command restyles everything.
- **Safe Operations** — Conflict detection, per-file hashes, backups and rollback protect your codebase.
- **Zero Account Walls** — Browse, inspect, and install public components freely without logging in.

---

## License

Distributed under the [MIT License](LICENSE).
