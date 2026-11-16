<p align="center">
  <a href="https://nativra.vercel.app">
    <img src="assets/logo.png" alt="Nativra" width="560" />
  </a>
</p>

<p align="center">
  UI components for React Native and Expo that you copy into your project and own.<br />
  Every component comes in two versions: NativeWind and plain StyleSheet.
</p>

<p align="center">
  <a href="https://nativra.vercel.app/docs">Docs</a> ·
  <a href="https://nativra.vercel.app/playground">Playground</a> ·
  <a href="https://nativra.vercel.app/docs/components">Components</a> ·
  <a href="https://www.npmjs.com/package/nativra-cli">npm</a>
</p>

<p align="center">
  <a href="https://github.com/Imdvlpr99/nativra/actions/workflows/ci.yml"><img src="https://github.com/Imdvlpr99/nativra/actions/workflows/ci.yml/badge.svg" alt="CI" /></a>
  <a href="https://www.npmjs.com/package/nativra-cli"><img src="https://img.shields.io/npm/v/nativra-cli?style=flat-square&logo=npm" alt="npm version" /></a>
  <a href="https://www.npmjs.com/package/nativra-cli"><img src="https://img.shields.io/npm/dt/nativra-cli?style=flat-square&logo=npm&label=downloads" alt="Total npm downloads" /></a>
  <a href="https://reactnative.dev"><img src="https://img.shields.io/badge/React%20Native-0.74+-22c55e?style=flat-square&logo=react" alt="React Native 0.74+" /></a>
  <a href="https://expo.dev"><img src="https://img.shields.io/badge/Expo-SDK%2051+-000000?style=flat-square&logo=expo" alt="Expo SDK 51+" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-blue?style=flat-square" alt="MIT License" /></a>
</p>

---

Nativra works like [shadcn/ui](https://ui.shadcn.com), for mobile. You don't install a component library. Instead, the `nativra-cli` command copies each component's TypeScript source into your project. From then on the code is yours to edit. Nothing in `node_modules` changes underneath you, and updates only happen when you ask for them.

## Try it in your browser

The [playground](https://nativra.vercel.app/playground) is a real React Native project running in your browser. It has a file explorer, an editor, a live preview and a terminal where you can run `nativra-cli` commands. Nothing to install.

## Add Nativra to your app

You need:

- An Expo app (SDK 51 or later) or a React Native CLI app (0.74 or later)
- Node.js 20 or later

**1. Set up your project.** Run this in your app's root folder:

```bash
npx nativra-cli init
```

`init` looks at your project and asks a few questions: NativeWind or StyleSheet, which style you want, and where components should go. Your answers are saved in `nativra.json`. To accept the detected defaults without questions, add `--yes`.

**2. Add a component.**

```bash
npx nativra-cli add button
```

The CLI copies `components/ui/Button.tsx` into your project, plus everything it needs:

```
components/ui/Button.tsx      the component
hooks/use-theme-colors.ts     reads your theme and style
lib/themes/theme.ts           your color theme
lib/themes/style.ts           your style: shape, type, spacing
```

If the component needs npm packages, the CLI shows the install command and offers to run it.

**3. Use it.**

```tsx
import { Button } from "@/components/ui/Button";

export default function Screen() {
  return <Button variant="primary" onPress={() => console.log("Saved")}>Save</Button>;
}
```

Imports use your project's path alias (`@/` above). `init` reads it from your `tsconfig.json`.

## What you can add

| Kind | Examples | Browse |
|---|---|---|
| 39 components | Button, Input, Card, Select, Dialog, BottomSheet, Tabs, Toast | [Components](https://nativra.vercel.app/docs/components) |
| 18 blocks | Login form, Settings list, Order summary, Pricing card | [Blocks](https://nativra.vercel.app/docs/blocks) |
| 8 templates | Auth flow, Onboarding, Chat, Fintech wallet, Analytics dashboard | [Templates](https://nativra.vercel.app/docs/templates) |
| 8 hooks | Theme colors, Haptics, Keyboard, Reduced motion | [Hooks](https://nativra.vercel.app/docs/hooks) |

Add several at once with `npx nativra-cli add card input select`. Each item's docs page has a live preview, its props and the source.

## Change the look

Two settings control how every component looks. You can change either one at any time.

- **Theme**: the colors, in light and dark. There are 10 themes: zinc, slate, dark-slate, midnight, violet, rose, orange, amber, emerald and cyan.
- **Style**: shape, type size, spacing and how cards and inputs are drawn. There are 5 styles:

| Style | Looks like |
|---|---|
| `soft` | Pill buttons, rounded cards, soft shadows (the default) |
| `crisp` | shadcn/ui: small radii, thin borders, compact |
| `tailwind` | Tailwind UI: subtle rings, layered shadows, roomy spacing |
| `material` | Material 3: tinted surfaces, filled inputs |
| `ios` | iOS: grey grouped surfaces, larger type |

```bash
npx nativra-cli theme add midnight --overwrite
npx nativra-cli style add material
```

Every installed component picks up the change; you don't edit any component code. In NativeWind projects the CLI also updates the theme block in `global.css`.

## Keep components up to date

When a component in the registry changes, update your copy:

```bash
npx nativra-cli list --installed   # what you installed, and which items have updates
npx nativra-cli update --dry-run   # see what would change
npx nativra-cli update             # update everything you installed
```

In CI, `update --check` and `diff <item> --exit-code` exit with code 1 while something is out of date.

If you edited a component, `update` skips it and says so. To see the differences first, run `npx nativra-cli diff button`. To replace your version anyway, run `update --force`.

Every change the CLI makes is backed up first. To undo the last change to an item:

```bash
npx nativra-cli rollback button
```

Backups live in `.nativra/` in your project, which `init` adds to `.gitignore`.

## When something goes wrong

| You see | What to do |
|---|---|
| `No nativra.json found` | Run `npx nativra-cli init` in your app's root folder, or pass `--cwd <folder>`. |
| `nativra.json already exists` | `init` won't replace your settings. Edit `nativra.json`, or re-run with `--force`. |
| `has local changes — skipped` | You edited that file. Review with `nativra diff <item>`, then `update --force` to replace it. |
| NativeWind components have no colors | Your `tailwind.config.js` doesn't map Nativra's colors yet. `add` prints the `colors` block to paste into `theme.extend`; the [NativeWind guide](https://nativra.vercel.app/docs/styling/nativewind) has it too. |
| Dependency install failed | Run the install command the CLI printed yourself, then start your app again. |

`npx nativra-cli doctor` checks the whole setup and tells you what to fix.

## Work on Nativra

This repository holds the CLI, the component registry, the docs site and the preview app.

```bash
git clone https://github.com/Imdvlpr99/nativra.git
cd nativra
pnpm install
pnpm dev        # docs and playground at http://localhost:3000
```

Before opening a pull request, run:

```bash
pnpm typecheck && pnpm lint && pnpm test
```

| Folder | What's in it |
|---|---|
| `registry/default/` | Component, block, template, hook, theme and style sources |
| `packages/cli/` | The `nativra-cli` command |
| `packages/theme-engine/` | Themes and styles |
| `apps/docs/` | The docs site and playground |
| `apps/native-preview/` | Expo app for checking components on a device, and the docs' live previews |
| `examples/` | Example Expo apps for NativeWind and StyleSheet |

Every component has a NativeWind version and a StyleSheet version that look the same. Components use theme colors and style values, never hard-coded colors or sizes. The [contributing guide](https://nativra.vercel.app/docs/contributing) covers adding a component.

## License

[MIT](LICENSE)
