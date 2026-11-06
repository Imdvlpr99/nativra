# Nativra

> **Native UI, built your way.**

Nativra is a source-first UI development platform for React Native. It combines the discoverability and copy-into-your-project philosophy of [shadcn/ui](https://ui.shadcn.com) with tooling designed specifically for native mobile development.

## What is Nativra?

Developers use Nativra to:

- **Discover** components, hooks, utilities, themes, blocks, and screen templates.
- **Preview and inspect** each item.
- **Customize** supported properties and design tokens in Nativra Studio.
- **Install** source files into their own React Native project through the Nativra CLI.
- **Own, edit, and maintain** the installed code without depending on a Nativra runtime package.
- **Verify behavior** in a real Expo Android/iOS app, not only in a browser preview.

## Monorepo Structure

```
nativra/
├── apps/
│   ├── docs/              # Public documentation and catalog (Next.js)
│   ├── studio/            # Visual component editor (Next.js)
│   └── native-preview/    # Expo app for Android/iOS verification
├── packages/
│   ├── cli/               # Nativra CLI
│   ├── registry-schema/   # Zod schemas and inferred types
│   ├── registry-client/   # Fetch/cache/resolve registry items
│   ├── registry-builder/  # Build authored sources into registry output
│   ├── codegen/           # Project-specific source generation
│   ├── theme-engine/      # Token model and target adapters
│   ├── studio-schema/     # Editable props and controls
│   ├── preview-runtime/   # Shared preview harness utilities
│   ├── component-contracts/ # Shared types and behavioral contracts
│   ├── config/            # Shared lint/tsconfig/test configs
│   └── utils/             # Shared pure utilities
├── registry/
│   └── default/           # Default component registry
├── examples/
│   ├── expo-nativewind/
│   └── expo-stylesheet/
└── tests/
```

## Getting Started

### Prerequisites

- Node.js >= 20
- pnpm >= 9

### Install dependencies

```bash
pnpm install
```

### Build all packages

```bash
pnpm build
```

### Start development

```bash
pnpm dev
```

## Product Principles

- **Source ownership** — installed components are copied into the consumer's project.
- **Native first** — Android and iOS behavior are the primary quality bar.
- **Two styling targets** — NativeWind and React Native StyleSheet.
- **Registry as source of truth** — docs, CLI, Studio, and code previews consume the same item definitions.
- **No mandatory account** — browsing, previewing, and installing public items must work without login.
- **Safe installation** — preview changes, protect user files, and never silently overwrite.

## License

MIT

