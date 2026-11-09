# Changelog

All notable changes to Nativra will be documented in this file.
This project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
