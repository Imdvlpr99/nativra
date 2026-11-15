# Changelog

All notable changes to Nativra will be documented in this file.
This project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### 🎭 Styles: five complete looks, independent of color
- **New item type `style`**: the UI's character (radii by role, type scale, density, how cards and inputs are drawn, shadows, press feedback, dialog backdrop) now lives in `lib/themes/style.ts`, separate from the colors in `theme.ts`. Any of the 10 themes works with any style.
- **Five presets:** `soft` (the previous look and still the default), `crisp` (shadcn/ui-like: small radii, hairline borders, compact), `tailwind` (Tailwind UI-like: rings with layered shadows, roomy), `material` (Material 3-like: tonal surfaces, filled fields, lighter headings) and `ios` (iOS-like: grey grouped surfaces, larger type, dimming press feedback).
- **CLI:** `nativra init --style <id>` (or the new prompt) saves the choice in `nativra.json`, and components then install with that style. `nativra style add <id>` switches the whole app (with a backup) and `nativra style list` shows the presets. NativeWind projects get the matching classes in `global.css`.
- **All 65 components, blocks and templates** read the style in both targets:
  - **Font sizes:** `ts()` in StyleSheet, `type-*` classes in NativeWind.
  - **Weights:** from the style's heading, title and label weights.
  - **Spacing:** `sp()` in StyleSheet; in NativeWind, density-aware `sp-p-4`, `sp-gap-2`, … that mirror Tailwind's spacing scaled by the style's density, leaving Tailwind's own `p-4` untouched for the rest of the app.
  - **Card surfaces:** `surface(c)` / `surface`.
  - **Inputs:** `field(c)` / `field`, with a focus state.
  - **Control heights:** the style's control height for buttons, inputs and selects.
  - **Press feedback:** shrink or dim, depending on the style.
- **Hook:** `use-theme-colors` 0.2.0 adds `ts`, `sp`, `surface`, `field` and a style-aware `elevation`/`pressedStyle`. Theme files no longer carry `themeStyle`. Projects installed before styles existed get `style.ts` (their configured style, or `soft`) on the next `nativra update`, and keep working until then.
- **Docs:** a style picker in every live preview (remembered across pages), a Styles section, and each style's page renders real blocks in that style.
- Every restyled item is version-bumped, so `update` picks it up.

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
- **`add --overwrite`:** when the write fails and is undone, the backup taken for it is discarded, so the next `rollback` isn't spent on a no-op. `update` now does the same.
- **Installed theme kept:** a theme that only arrives as a dependency (components depend on `zinc`) no longer replaces the installed `theme.ts`, even with `--overwrite`, and no longer fails `--on-conflict error`. A file is tracked by the item that wrote it last, so `remove` of a replaced theme can't delete the new one.
- **Errors:** unexpected failures (for example an `http://` registry URL) print one line and exit 1 instead of a stack trace. An invalid `nativra.json` is named in the error.
- **`init`:** refuses to replace an existing `nativra.json` without confirmation (`--force` in scripts), and Ctrl+C at a prompt writes nothing.
- **`audit --fix`:** migrated `TouchableOpacity` keeps its press dimming as a `Pressable` style function. `TouchableHighlight` and touchables that spread props are left for manual migration.
- **`update`:** no longer writes a theme into `global.css` when none is installed.
- **`rollback`:** undoing an `update` restores the version recorded in `nativra.lock.json`, not only the files.
- **`add`:** `--overwrite` together with a different `--on-conflict` mode is rejected instead of silently overwriting.
- **Aliases:** an alias containing `$` is inserted literally when imports are rewritten.
- **Registry client:** an item whose `id` differs from the one requested is rejected. The README now says what the SHA-256 check covers: corrupted downloads, not a tampered registry.
- **React Native CLI projects:** only the `expo` dependency marks a project as Expo. React Native CLI apps (which also have an `app.json`) were treated as Expo and told to run `npx expo install`. `doctor` no longer fails them for missing Expo files.
- **Removing the active theme:** `remove <theme>` treats every item that needs a theme as a dependent, so it no longer deletes the `theme.ts` that installed components import. `update` stops warning that the default theme's file "is not tracked" when another theme is installed.
- **Other registries:** items from a registry added with `registry add` can be installed as `<registry>/<id>` (`add`, `info`, `diff`, `theme add`). `list` and `search` cover every configured registry, and `update` uses the registry each item came from. Relative local registry paths in `nativra.json` resolve against the project, not the shell's directory.
- **`theme add`:** NativeWind projects get the theme's CSS in `global.css` automatically. CSS is only written when `theme.ts` was actually replaced, so the two never describe different themes.
- **`doctor`:** exits with code 1 when a check fails. New checks: missing or edited installed files, the theme block in `global.css`, NativeWind's Metro and Babel setup, and npm packages the installed items need. A scaffolded Tailwind config scans the configured component folders.
- **Detection:** `tailwind.config.cjs` and `.mjs` count as NativeWind, `tsconfig.json` with comments or trailing commas is read correctly, and the package manager comes from `packageManager` in package.json or the nearest lockfile in a parent folder (monorepos).
- **`list`:** unknown `--type` values are rejected. `list`, `search` and `info` work before `init` and accept `--json`.
- **`add` and `info`:** warn about deprecated items and about Expo SDK or React Native versions below an item's minimum.
- **`update --dry-run`:** shows what would change without writing.

### 🔒 Security (`nativra-cli`)
- **Install arguments:** dependency names and version ranges from a registry can no longer start with `-`, so they can't pass flags such as `--global` to the package manager.
- **Terminal output:** control characters are stripped from registry text (names, descriptions, paths, diffs) before printing, so a registry can't send terminal escape sequences.
- **Same-version changes:** the lockfile records each file's registry hash. `update` warns when a file changes while the item's version stays the same, which is either a missed version bump or tampering.
- **Releases:** the publish workflow only runs for `v*` tags, so a manual run on a branch can't publish.
- **Docs site:** `apps/docs/vercel.json` adds `nosniff`, a referrer policy, a permissions policy and a CSP that blocks other sites from framing the docs. The preview posts its height only to its own origin.

### ♿ Registry
- **Accessibility:** buttons in Dialog, Select, Toast, BottomSheet, DataTable (pressable rows), OrderSummary, SettingsList, OnboardingFlow and SettingsFlow have `accessibilityRole`. Select options report their selected state, onboarding dots are labelled, and dismiss backdrops and the OTP cell row are hidden from screen readers. Dialog and Select mark their content modal. `nativra audit` now checks installed Nativra files like any other code, and only an element's own opening tag counts.
- **Backdrops:** Dialog, Select and BottomSheet use a theme scrim (`scrim()` in StyleSheet, `bg-scrim` in NativeWind) that stays dark in dark mode. The NativeWind versions used `bg-foreground/60`, which turned light in dark mode. Themes gain `scrimOpacity`, and older theme blocks in `global.css` are refreshed.
- **`auth-flow` 0.2.0:** the template no longer fakes authentication. Pass `onSubmit(step, values)` to call your backend; a thrown error is shown on the form. `onSuccess` no longer receives a made-up `token`. Inputs set `autoComplete` and `textContentType` for password managers and one-time-code autofill, the submit button waits for required fields, and the NativeWind title is readable (it used `text-primary-foreground` on the page background).
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
