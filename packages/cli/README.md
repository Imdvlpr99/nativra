<p align="center">
  <a href="https://nativra.vercel.app">
    <img src="https://nativra.vercel.app/icon.png" alt="Nativra" width="72" height="72" />
  </a>
</p>

# nativra-cli

Copies [Nativra](https://nativra.vercel.app) UI components into your React Native or Expo project as TypeScript source you own. Every component comes in a NativeWind version and a StyleSheet version.

Want to try it first? The [playground](https://nativra.vercel.app/playground) runs this CLI in your browser against a real React Native project, with a live preview.

## Requirements

- An Expo app (SDK 51 or later) or a React Native CLI app (0.74 or later)
- Node.js 20 or later, with npm, pnpm, yarn or bun

You don't need to install the CLI; run it with `npx`.

## Get started

Run these in your app's root folder.

```bash
npx nativra-cli init
npx nativra-cli add button
```

`init` detects Expo, NativeWind, a `src/` folder and your tsconfig path alias, asks a few questions, and saves the answers in `nativra.json`. To accept the detected defaults without questions, add `--yes`.

`add` copies the component and everything it depends on:

```
✔ Resolved 4 item(s)
  ✓ Written: lib/themes/theme.ts
  ✓ Written: lib/themes/style.ts
  ✓ Written: hooks/use-theme-colors.ts
  ✓ Written: components/ui/Button.tsx
✅ Done!
```

Then import it like any file in your project:

```tsx
import { Button } from "@/components/ui/Button";

<Button variant="primary" onPress={save}>Save</Button>
```

If a component needs npm packages (for example `react-native-svg`), `add` shows the install command and offers to run it. In an Expo app it uses `npx expo install`, so you get versions that match your SDK.

Browse everything you can add in the [component docs](https://nativra.vercel.app/docs/components), or run `npx nativra-cli list`.

## Commands

| Command | What it does |
|---|---|
| `init` | Creates `nativra.json`. `--yes` accepts the detected defaults, `--style <id>` picks a style, `--force` replaces an existing file. |
| `add <items...>` | Installs items and their dependencies. `--dry-run` shows the plan without writing. |
| `update [items...]` | Updates installed items. `--dry-run` shows what would change. Skips files you edited unless `--force`. |
| `diff <item>` | Shows how your copy differs from the registry version. |
| `rollback <item>` | Undoes the last change to an item. |
| `remove <items...>` | Deletes installed items. Refuses while other installed items still use them. |
| `list` · `search <query>` · `info <item>` | Browses the registry. `list --type block` filters, `--json` prints JSON. |
| `theme list` · `theme add <id>` | Lists or installs a color theme. |
| `style list` · `style add <id>` | Lists or installs a style. |
| `registry list` · `registry add <name> <url>` | Lists or adds component registries. |
| `doctor` | Checks your setup and says what to fix. `--fix` creates missing config. |
| `audit` | Reports accessibility and hard-coded colors in your code. |

Every command accepts `--cwd <folder>` to run against another project. `npx nativra-cli <command> --help` lists all options.

## Change colors and style

Two settings control how every installed component looks:

- **Theme**: colors for light and dark mode. Choose from `zinc`, `slate`, `dark-slate`, `midnight`, `violet`, `rose`, `orange`, `amber`, `emerald` and `cyan`.
- **Style**: shape, type size, spacing and how cards and inputs are drawn.

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

The theme lives in `lib/themes/theme.ts` and the style in `lib/themes/style.ts`. Without `--overwrite`, `theme add` asks before replacing your current theme; in a script it skips. `style add` always replaces the current style. In NativeWind projects both commands also rewrite the Nativra block in `global.css`.

## Updates never overwrite your edits

The CLI records a hash of every file it writes in `nativra.lock.json`. Commit that file with your code. Before changing anything, it compares your files against those hashes:

- `update` skips files you edited and tells you which. Run `diff` to review, then `update --force` to replace them.
- `add` never replaces an existing file silently. It asks, or skips when running without a terminal.
- `remove` asks before deleting files you edited.

Before any change, the CLI saves a backup in `.nativra/backups/`, which `init` adds to `.gitignore`. `rollback <item>` restores the most recent one; run it again to go further back. Rollback refuses to discard edits you made after that change unless you pass `--force`.

## Use it in CI and scripts

Without a terminal the CLI never prompts. It skips existing files and doesn't install npm packages unless asked.

```bash
npx nativra-cli add button card --yes                       # keep existing files
npx nativra-cli add button --yes --on-conflict error        # fail if a file exists
npx nativra-cli add button --yes --overwrite --install      # replace files, install packages
```

- Failures exit with code 1, including `doctor` when a check fails and a failed `--install`.
- `audit --min-score 80` fails the run when the accessibility score is below 80.
- `list`, `search` and `info` accept `--json`.

## Use another registry

You can add components from any registry that follows the Nativra format, on a website or in a local folder:

```bash
npx nativra-cli registry add acme https://ui.acme.dev
npx nativra-cli add acme/data-grid
```

`update` and `diff` use the registry each item came from. Registries must use HTTPS; `http://localhost` is allowed for development. A relative folder path is resolved from your project root.

Only add registries you trust. The CLI checks each file against the hash the registry publishes with it. That catches corrupted downloads, but it doesn't prove who published the registry.

## Troubleshooting

| You see | What to do |
|---|---|
| `No nativra.json found` | Run `npx nativra-cli init` in your app's root folder, or pass `--cwd <folder>`. |
| `nativra.json already exists` | `init` won't replace your settings. Edit `nativra.json`, or re-run with `--force`. |
| `has local changes — skipped` | You edited that file. Review with `diff`, then `update --force` to replace it. |
| `Refusing to remove "zinc" while other items depend on it` | Installed components need that item (here, the active theme). Remove those first, or pass `--force`. |
| NativeWind components have no colors | Your `tailwind.config.js` doesn't map Nativra's colors. `add` prints the `colors` block to paste into `theme.extend`; the [NativeWind guide](https://nativra.vercel.app/docs/styling/nativewind) has it too. |
| `Insecure HTTP registry URL rejected` | Use an `https://` URL, or `http://localhost` for a local registry. |

`npx nativra-cli doctor` checks your config, packages, Tailwind and Babel setup, theme CSS and installed files in one go.

## Links

- [Documentation](https://nativra.vercel.app/docs)
- [Playground](https://nativra.vercel.app/playground)
- [Changelog](https://github.com/Imdvlpr99/nativra/blob/main/CHANGELOG.md)
- [Report an issue](https://github.com/Imdvlpr99/nativra/issues)

## License

MIT
