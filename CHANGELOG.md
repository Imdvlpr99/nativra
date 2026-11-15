# Changelog

All notable changes to Nativra will be documented in this file.
This project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### 🎨 Soft & friendly: every item restyled and theme-driven
- **Style tokens:** themes now carry `themeStyle`: radii by role (`button`, `control`, `card`, `surface`, `chip`, `small`), border width, three soft shadow levels, press feedback and heading weights. The `use-theme-colors` hook exposes them with `elevation()` and `pressedStyle()` helpers, and falls back to the defaults for theme files from earlier versions.
- **Status colors:** every theme has `success`, `warning` and `info` (each with a `-foreground`), in light and dark.
- **All 65 components, blocks and templates** use semantic colors and role-based radii in both targets. Blocks and templates previously hard-coded their colors, so `theme add` now restyles them too. Pill buttons, rounded cards with soft shadows, an inverted toast with status dots, and tinted status alerts.
- **NativeWind:** components use semantic shape classes (`rounded-button`, `rounded-card`, ...) that the CLI writes into `global.css` with the color variables; older theme blocks are refreshed on `add` and `update`. Add `success`, `warning` and `info` to `tailwind.config` (the CLI prints the snippet).
- **Type fixes** in `account-settings-flow`, `filter-sheet`, `order-summary`, `settings-list` and `team-member-row`, which did not typecheck.
- **Readable dark destructive color:** every theme's dark `destructive` is now `#f87171` with a dark foreground, so error text and required markers are legible on dark backgrounds.
- **Icon dependencies:** the six items that use `lucide-react-native` now also declare `react-native-svg`, which lucide needs to render.

### 📚 Docs: live previews of the real components
- Item pages render the actual StyleSheet source with react-native-web (the native preview app exported to `/preview/`), with example tabs, a theme picker and a light/dark toggle. Templates and sheets show in a phone frame. The hand-written HTML imitations are gone.
- Docs pages no longer print the YAML front matter of `docs.mdx` files.
- The native preview app builds again (Babel 7 for Expo 52; the `image-size` override is pinned to the 1.x line Metro expects). `pnpm audit` ignores GHSA-5p2g-fcmc-qvqq and GHSA-w3rx-r6r6-pgpr: both are denial-of-service bugs in `image-size` parsers with no patched 1.x release, reached only through Metro in the private preview app reading this repo's own images, and never shipped to users. Remove the exception when the preview app moves to an Expo SDK whose Metro accepts `image-size` 2.x.

### 🐛 Fixes (`nativra-cli`)
- **`src/` projects:** the theme import is rewritten through the project's path alias (`@/lib/themes/theme`). Components installed into a `src/` layout previously imported a non-existent `@/src/lib/themes/theme`. Existing `nativra.json` files are fixed without re-running `init`.
- **Exit codes:** `add`, `update` and `remove` exit with code 1 when an item can't be resolved or installed, instead of reporting success.
- **Lockfile:** written after each item, so a failure part-way through a run no longer leaves installed files untracked. An unreadable `nativra.lock.json` (for example with merge-conflict markers) now stops the command instead of being silently replaced.
- **Symlinks:** `add`, `update`, `theme add`, `audit --fix` and the `global.css` theme injection refuse to write through a symlinked file or directory, like `remove` and `rollback` already did.
- **`audit --fix`:** keeps the `TouchableOpacity`/`TouchableHighlight` import when the file still references it outside JSX (types, `Animated.createAnimatedComponent`).
- **`add --overwrite`:** when the write fails and is undone, the backup taken for it is discarded, so the next `rollback` isn't spent on a no-op.
- **`doctor --fix`:** recognises `tailwind.config.cjs`/`.mjs` instead of scaffolding a second config, and writes `.cjs` in ESM packages.
- **`registry add`:** validates the name and rejects insecure URLs up front. **`theme add`** reports an unknown theme without a stack trace.

### ✨ Improvements
- `add --overwrite` and `remove` back up the files they replace or delete; `rollback <id>` restores them (after `remove`, it restores the lockfile entry too).
- `rollback` refuses to discard edits made after the operation being undone; pass `--force` to proceed.
- `audit --min-score <n>` exits with code 1 below the given score, for CI.
- `nativra.json`'s `$schema` URL now resolves: `https://nativra.vercel.app/schema.json` is generated from the CLI's config schema.

### 🔒 CI
- GitHub Actions are pinned to commit SHAs (Dependabot keeps them current). The publish workflow verifies the tag matches the CLI version and no longer runs twice per release.

---

## [v0.2.3] - 2026-11-10

### 🚀 Developer Experience & Ergonomics Upgrade
- **Import Alias Rewriting (`nativra-cli`)**:
  - Automatically transforms component imports to match custom project structure and path aliases configured in `nativra.json` (e.g. `@/components/ui`, `~/components`, or relative paths).
  - Handles multi-line import statements and namespace imports seamlessly during `nativra add` and `nativra update`.
- **Auto-Dependency Installer (`--install`)**:
  - Added `--install` and `--no-install` flags to `nativra add`.
  - Automatically detects missing package dependencies and peer dependencies, prompting or executing installation using the project's native package manager (`npx expo install`, `pnpm add`, `yarn add`, `bun add`, or `npm install`).
- **Audit Tool Enhancements (`nativra audit --fix`)**:
  - Precise line and column numbers reported for every audit finding.
  - Detects `allowFontScaling={false}` accessibility violations.
  - Introduced `--fix` flag to automatically migrate legacy React Native `<TouchableOpacity>` to `<Pressable>` with preserved props.
- **Multi-Theme CSS Injection**:
  - `nativra theme add --as <name> --apply-css` auto-generates CSS variable rules and injects named theme classes into `global.css`.
  - Added new theme presets including `midnight` and `dark-slate`.
- **100% Component Contract Coverage**:
  - `@nativra/component-contracts` now covers all 39 components (adding contracts for `Badge`, `Card`, `Checkbox`, `Dialog`, `DropdownMenu`, `Progress`, `RadioGroup`, `Skeleton`, `Switch`, `Tabs`, and `Tooltip`).
  - Standardized `style?: StyleProp<ViewStyle>` override and native prop forwarding across all components in both NativeWind and StyleSheet flavors.
- **Runnable Example Showcases**:
  - Upgraded both `examples/expo-nativewind` and `examples/expo-stylesheet` into 4-tab interactive mobile showcase applications (`Controls`, `Feedback`, `Layout`, `Forms`).
  - Added strict TypeScript configs and verified clean typechecks.
- **Docs & Search Improvements**:
  - Added keyboard navigation (`↑`/`↓`/`Enter`) and active item scrolling to documentation search dialog.
  - Synchronized component and block counts across all documentation pages and README.

---

## [v0.2.2] - 2026-11-10

### 🚀 CLI Power-Up & Component Ergonomics
- Initial release of import alias transformation and auto-installer capabilities.
- Added Wave 2 component contracts and expanded example mobile showcases.

---

## [v0.2.1] - 2026-11-09

### 🛡️ Security, Registry & Supply-Chain Hardening
- **Path Traversal & Symlink Protection**: Enforced strict project-root (`cwd`) containment and symlink rejection across `nativra add`, `nativra update`, `nativra remove`, `nativra rollback`, and `nativra theme add`.
- **Portable Lockfile Paths**: `nativra.lock.json` now records portable POSIX project-relative file keys.
- **Mandatory SHA-256 & HTTPS**: `@nativra/registry-client` requires valid SHA-256 digests for all hydrated files and enforces HTTPS on remote registries.
- **Backup Integrity Verification**: `nativra rollback` validates SHA-256 checksums before restoring backup snapshots.
- **Zero Vulnerabilities**: Remediated all 59 transitive advisories in `pnpm audit` via dependency upgrades and pinned `pnpm.overrides`.
- **Registry Dependency Metadata**: Added missing `cn` utility and `class-variance-authority` declarations across all components and blocks.

---

## [v0.2.0] - 2026-11-08

### ✨ Registry & Theme Engine
- Live documentation portal and interactive component playground.
- Dual-engine component delivery: NativeWind and StyleSheet.
- CLI registry integration with `add`, `update`, `diff`, `rollback`, `list`, `audit`, and `theme`.
- Component contracts package for static analysis and type validation.

---

## [v0.1.0] - 2026-11-01

### 🚀 Initial Release
- Initial public release of Nativra React Native UI registry and CLI.
