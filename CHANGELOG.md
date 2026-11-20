# Changelog

All notable changes to Nativra will be documented in this file.
This project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### 🔒 Security
- Registry file paths may no longer contain control characters, and `add`, `update` and `diff` strip them from every path they print, so a registry can't send terminal escape sequences. Registry names in `registryDependencies` and `nativra.json` must be lowercase letters, numbers and `-`, and names in `nativra.json` must be unique.
- Remote registries are fetched one redirect at a time: a hop from HTTPS to plain HTTP (or from `http://localhost` to anywhere else) is refused before it is requested, and more than 5 redirects fail.
- `nativra.lock.json`, `nativra.json`, `.gitignore` and `.nativra/backups/` are no longer written or deleted through a symbolic link.
- Release workflow: each job gets only the permissions it needs, checkout no longer leaves a token in `.git/config`, and an optional job publishes to npm with provenance through trusted publishing.
- The npm publish job installs dependencies with `--ignore-scripts`, so no install script runs while the job can mint a publish token.
- `add --dry-run` strips control characters from item names too, the last registry text the CLI printed unfiltered.
- A `http://localhost` registry may only redirect to localhost, as documented.
- `pnpm audit` no longer ignores the two `image-size` advisories: Expo SDK 58's Metro doesn't use `image-size` at all. The unused `deepmerge` override is gone.
- CodeQL also scans the GitHub Actions workflows (`actions` language).

### ✨ MCP server
- New `@nativra/mcp` package: an MCP server with `nativra_search`, `nativra_list`, `nativra_info`, `nativra_init`, `nativra_add`, `nativra_diff`, `nativra_update` and `nativra_doctor`, so AI agents can find and install components. It runs the bundled CLI with argument arrays and never prompts. It can't force-overwrite edited files or remove items.

### ✨ Registry
- New components: `search-bar`, `form-field`, `list-item`, `swipeable-row` (no gesture-handler needed; actions are also screen-reader actions) and `time-picker`. New `register-form` block, and new `use-form` and `use-infinite-scroll` hooks. All are beta.
- New components: `country-picker` (searchable, about 240 countries with flags and dial codes), `phone-input` (country code picker; autofilled `+44…` numbers pick their country; `toE164`), `credit-card-input` (brand detection, Luhn, auto-advance), `image-with-fallback`, `section-list` (themed headers, inset-grouped variant) and `color-swatch`. All are beta.
- New blocks: `transaction-history` (grouped by day, daily totals, running balance), `product-card`, `search-results-row` (query highlighting) and `chat-bubble` (grouping, delivery ticks, retry). New templates: `social-feed`, `booking-flow` and `profile-flow`. All are beta.
- Button takes any node as its label, `leftIcon` / `rightIcon` (a node, or a function given the label color), and a function `style`; the loading spinner scales with the size.

### ✨ CLI
- `nativra diff --summary` prints one line per file and a count instead of the patch.
- `nativra list --outdated` lists only items with an update and exits 1 when there are any.
- `nativra search` marks beta, experimental and deprecated items.
- `nativra info --json --docs` includes the item's usage docs.
- `nativra update --check`: like `--dry-run`, but exits with code 1 while anything is out of date. An edited file whose registry source hasn't changed is reported as your edit and doesn't count.
- `nativra doctor --json` prints the checks as JSON for CI.
- `add` no longer treats a file that already matches what it would write as a conflict, and starts tracking it.
- Import rewriting also covers side-effect `import "@/…"`, `import("@/…")` and `require("@/…")`.
- `nativra diff --exit-code` exits with code 1 while the installed files differ from the registry, for CI.
- `update` removes files that a new item version no longer ships (backed up first, so `rollback` restores them). A dropped file you edited is kept and no longer tracked.
- `nativra doctor` warns when the project's NativeWind major isn't one Nativra's sources target, and when NativeWind 4 is paired with Tailwind CSS 4.
- `init --force` (or answering yes to replace) backs up the previous `nativra.json`; `nativra rollback nativra-config` restores it.
- Items with many dependencies resolve faster: each item's dependencies are fetched at once, and concurrent lookups of one item share a request.
- `nativra info <id>` shows the installed version and whether an update is available (`installedVersion` and `updateAvailable` with `--json`).
- `nativra list --installed` lists what the project has installed, each with the registry's current version and whether an update is available (`--json` too).

### 🐛 Fixes
- `update` keeps tracking a file it could not remove, instead of forgetting it while it stays on disk; `update --check` no longer fails over a dropped file that is already gone.
- `rollback nativra-config` refuses to discard edits made to `nativra.json` after `init`, unless `--force`.
- `add` keeps the CRLF line endings of a file that is already up to date.
- `init` only warns when it can't add `.nativra/` to a symlinked `.gitignore`, instead of reporting that `nativra.json` failed.
- Sibling imports named after `Object.prototype` members (`./toString`, `./constructor`) are no longer rewritten.
- Slider: a vertical scroll that starts on the slider scrolls the page instead of changing the value; accessibility actions at the limits no longer fire `onSlidingComplete`.
- NativeWind Button, Input and Textarea add a caller's `className` to their own classes instead of replacing them.
- Blocks and templates use the style's press feedback (`pressedStyle`) instead of a fixed opacity.
- Installing an item whose id is already installed from another registry (`acme/button` after `button`) is refused instead of overwriting the other's lockfile entry and backups.
- `audit --fix` refreshes lockfile hashes of the files it migrates that were unedited before, so `update` keeps updating them; `rollback audit-fix` moves them back.
- A lockfile entry without a `version` or `files` map gets the "restore it from git" error instead of a crash.
- `remove` no longer deletes the install folders named in `nativra.json` when they become empty.
- The registry build rejects an item with two files that would install under the same name.
- Docs home page: the registry overview counts every item type (utilities included) from the registry, so each card matches the catalog it links to.
- `rollback` reads and verifies every backup file before it changes anything. A corrupt backup used to fail halfway, leaving some files restored and the lockfile stale; if a write fails now, the files already restored are put back.
- Lockfile ids are looked up without `Object.prototype`, so `nativra remove constructor` reports an unknown item instead of crashing, and a registry item named like a prototype member can't leave files untracked.
- Path checks work in a project at a drive or filesystem root (`C:\`), where every path used to be rejected.
- On Windows, dependency installs run as one quoted command line, avoiding Node 24's DEP0190 warning.
- `theme add` and `style add` render files through the same code as `add`, `update` and `diff`.
- The registry build no longer stamps `updatedAt` with the build time, so identical sources build identical files. It also rejects dependency cycles and deprecated items without a `deprecationMessage`. It also rejects two items that would install a file with the same name into the same folder.
- `doctor` fetches installed items in parallel: on a network that drops requests, each one used to wait out the 15 s timeout in turn.
- Style and theme preset lookups ignore `Object.prototype` members, like the lockfile.
- Package-manager detection stops at the git root, so a stray lockfile in a folder above the project no longer picks the package manager.
- Release notes: tagging `v0.3.1` no longer picks up a `v0.3.10` section, tags with `+` work, and a tag without a CHANGELOG section fails the release instead of publishing placeholder notes.
- **Line endings no longer count as edits.** Git for Windows checks files out with CRLF by default (`core.autocrlf`), so after a commit and checkout every installed file looked modified: `update` skipped them as local changes, `remove` asked before deleting them, `rollback` refused, `add` treated identical files as conflicts and `diff` showed every line changed. Lockfile hashes and all comparisons now ignore line endings; existing lockfiles keep working.
- `update` no longer warns that a registry changed a file without a version bump when the installed file already matches the registry.

### ♿ Registry
- React Native 0.88 compatibility: Dialog and OTP Input no longer use APIs removed from RN 0.88's types (`StyleSheet.absoluteFillObject`, `useRef<TextInput>`).
- Badge accepts `className` (NativeWind) and `style` (StyleSheet); the e-commerce template already passed `className` and failed to type-check.
- Skeleton follows the style's radius roles (`sm`, `md`, `lg` → small, control, card) and holds still when Reduce Motion is on. Its `width`/`height` are typed as `DimensionValue`.
- Toast's close button has a 44pt touch target, and screen readers hear the variant ("Error. …") that the dot shows by color.
- 25 StyleSheet components no longer rebuild their styles on every render.
- **Slider** works on any width. It used to assume a 200pt track and measure taps from whichever child was touched. It now drags, honours `step`, takes `defaultValue` (uncontrolled) and `onSlidingComplete`, survives `min === max`, and screen readers adjust it by one step.
- **DatePicker** is a real date picker: a month grid with previous/next month, quick picks computed from today (they were fixed November 2026 dates), `minDate`/`maxDate`, `locale`, `weekStartsOn` and `defaultValue`. Values stay `"YYYY-MM-DD"`, read as local days.
- OTP Input: pasting a formatted code (`123 456`) keeps every digit, Android gets SMS-code autofill (`autoComplete="sms-otp"`), and the input covers the cells so a long press offers Paste.
- PaginationDots: with `onDotPress`, screen readers change the page with a swipe up or down.
- BottomSheet keeps VoiceOver inside the open sheet (`accessibilityViewIsModal`), like Dialog and Select.
- The registry build fails an `adjustable` element that doesn't handle `onAccessibilityAction`.
- Blocks and templates use `Pressable` everywhere: 46 `TouchableOpacity` elements across AppHeader, AppSidebar, FilterSheet, TransactionRow and five templates are converted, keeping their press dimming. Every pressable now has an accessibility role, and ChatFlow's icon-only buttons (back, more options, attach, send) have labels. The registry build now rejects `TouchableOpacity`/`TouchableHighlight` and a `Pressable` with neither a role nor a label.
- Slider calls a caller's `onLayout` instead of being replaced by it (which stopped dragging), and drags the right way in right-to-left layouts.
- Input forwards its ref to the `TextInput` (React 18 and 19), so forms can move focus between fields.
- LoginForm: password managers and autofill fill it (`autoComplete`, `textContentType`), screen readers read "Email" and "Password" instead of the placeholders, Next on the email field moves to the password, Go signs in, and it can't submit twice while loading.
- `useColorScheme`: choosing "system" after "dark" or "light" follows the system again; it used to stay on the forced scheme.
- `useKeyboard` uses the iOS "will" keyboard events, so layouts move with the keyboard instead of after it.
- `useHaptics` imports `expo-haptics` statically: Metro resolves `import()` while bundling, so the dynamic import never made it optional.
- npm ranges match what the sources are tested with: `lucide-react-native` `^1.73.0` (was `^0.460.0`, which stayed on 0.460.x), `react-native-safe-area-context` `>=4.10.0` and `expo-haptics` `>=13.0.0`, so new installs get the current majors that React Native 0.88 needs.

### 🧰 Repo
- The preview app now runs Expo SDK 58 (React Native 0.88, React 19.3, TypeScript 6.0) and copies every hook. Its `typecheck` also type-checks every NativeWind source with NativeWind's `className` types, which nothing compiled before.
- Every package that runs `tsc` declares its own `typescript` (5.x), so the Expo apps' TypeScript 6 can't be picked up through hoisting.
- The docs playground uses the CLI's own install logic (`filesForTarget`, the cross-folder import map) instead of a copy, so it can't drift from what `nativra add` writes.
- The preview playground batches console output, so code that logs on every render no longer floods the editor page.
- Docs pages keep `og:url` in sync on client-side navigation, and a 404's `noindex` no longer sticks to the next page.
- `.gitattributes` makes every checkout LF, so the registry builds byte-for-byte the same on Windows as in CI.
- CI checks that every registry npm range accepts the version the preview app tests with (`scripts/check-registry-deps.mjs`) and that the example apps are current with the registry (`scripts/check-examples.mjs`, `--fix` to refresh them). The examples are refreshed.
- The preview type-checks fixture props against the components (`fixture-check.ts`); the LoginForm and EmptyState fixtures used props that don't exist and are fixed.
- The docs' Yarn tab runs `npx`, since `yarn dlx` doesn't exist in Yarn 1.
- The CLI README, the repo README and the Updating guide cover `list --installed`, `update --check`, `diff --exit-code` and the backup `init --force` keeps. The home page's Styles card names the styles for screen readers, like the Themes card.
- The compatibility matrix lists Expo SDK 58, React Native 0.88.1, React 19.3, TypeScript 6.0 and NativeWind 4.2 as tested.

## [v0.3.0] - 2026-11-16

### 🧪 Playground: try Nativra in the browser
- **`/playground` on the docs site**: a real React Native project running in the browser, laid out like an IDE: an explorer, a registry browser with one-click installs, a tabbed code editor (CodeMirror), a live preview (react-native-web, phone frame or full panel, light or dark), and a Terminal / Console panel. Panes resize by drag or keyboard and collapse; the layout is remembered. Theme and Style pickers in the toolbar run the matching CLI commands. Phones get one pane at a time with a bottom tab bar. No install and no separate deployment: it ships with the docs.
- **Errors**: a compile error keeps the last working app on screen (like fast refresh) with a card that opens the failing file; the app's own `console` output has its own tab with grouped repeats and an error count.
- **A real CLI in the terminal**: `npx nativra-cli add | remove | list | search | info | theme | style | init` run a browser build of the CLI against the docs' own registry, using the same import rewriting and NativeWind CSS generation as the published CLI. Shell basics (`ls`, `tree`, `cat`, `touch`, `rm`, `clear`, `reset`, `help`), history and Tab completion included.
- **Both styling targets**: StyleSheet runs exactly as on a device; NativeWind compiles classes in the browser with Tailwind's browser build and the project's own `global.css` theme block.
- **Live editing**: TypeScript and JSX compile in the browser (Sucrase) as you type, errors show in the preview and the terminal, and the app's `console` output appears in the terminal. The project is saved in the browser; Reset starts over.
- **Isolated**: the preview runs in a sandboxed iframe with an opaque origin, so project code can't reach the docs site's storage or cookies.
- Item pages link to the playground with the item preinstalled (`/playground?add=<id>`).
- Fixed the NativeWind `settings-flow` sign-out button, whose text was nearly invisible on its own background.

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
- **Undoing a theme or style switch:** `theme add`, `style add` and `add --overwrite` back up a replaced file under the item that owned it, so `nativra rollback zinc` after switching to `rose` restores both `theme.ts` and its lock entry. Rollback also refuses to replace a file another item now owns if it was edited, and takes restored files back from that item.
- **Rollback accuracy:** files an `update` created are removed again, and a file that was the user's own (replaced by `add --overwrite`) goes back to untracked, so a later `update` won't overwrite it unasked.
- **`add <theme> --overwrite`:** rewrites the NativeWind theme block in `global.css` for the new theme.
- **`--registry` with `diff` and `update`:** the override is used even for items installed from another registry. `diff` reports an unreadable lockfile instead of ignoring it.
- **`add --install`:** a failed package install now fails the run (exit code 1).
- **Imports:** an item's own sibling file (for example a block's `./Card`) is never rewritten to a dependency's file of the same name.
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
