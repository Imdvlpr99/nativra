# NATIVRA V2 — MASTER BLUEPRINT

**Version:** 2.0.0  
**Project Type:** Standalone React Native Developer Toolkit  
**Architecture:** Source-first  
**Primary Framework:** React Native  
**Primary Development Environment:** Expo  
**Styling Targets:** NativeWind and StyleSheet  
**Documentation Status:** Master Product Specification

---

# TABLE OF CONTENTS

1. Product Overview
2. Product Vision and Principles
3. Product Scope
4. Feature Specification
5. System Architecture
6. Technology Stack
7. Registry System
8. CLI Specification
9. Component Library
10. Hooks and Utilities
11. Nativra Studio
12. Component Generator and Customizer
13. Interactive Screen Builder
14. Navigation Generator
15. Header and Sidebar Builder
16. Theme Engine
17. Icon Explorer
18. Blocks and Templates
19. Component Update and Merge System
20. Security and Safety
21. UI/UX Design Requirements
22. Testing Strategy
23. Deployment and Release
24. Implementation Roadmap
25. AI Coding Agent Instructions
26. Final Product Acceptance Criteria

---

# 1. PRODUCT OVERVIEW

## 1.1 What Is Nativra?

Nativra is a standalone React Native developer toolkit designed to help developers discover, customize, generate, compose, install, and maintain native UI components and application interfaces.

It combines a source-first component library with visual development tools.

Nativra provides:

- Component Library.
- Component Generator.
- Component Customizer.
- Interactive Screen Builder.
- Navigation Generator.
- Header and Sidebar Builder.
- Theme Engine.
- Icon Explorer.
- Blocks and Templates.
- Registry System.
- CLI.
- Documentation Website.
- Nativra Studio.

The goal is to make React Native UI development faster and more accessible without sacrificing source-code ownership.

## 1.2 Product Vision

Make React Native UI development more accessible, visual, flexible, and maintainable without sacrificing developer control.

## 1.3 Product Mission

- Make reusable React Native components easier to discover.
- Allow developers to customize components visually.
- Generate clean and editable React Native source code.
- Simplify navigation and screen construction.
- Provide reusable blocks and application templates.
- Support multiple styling approaches.
- Provide safe component installation and updates.
- Offer useful tools without requiring a mandatory hosted backend.
- Improve the developer experience for both beginners and experienced developers.

## 1.4 Core Product Promise

**Discover visually. Customize freely. Generate native code. Own everything.**

## 1.5 Relationship With shadcn/ui

Nativra adopts the source-first philosophy of shadcn/ui.

Shared principles:

- Components are distributed as source code.
- Developers own their installed components.
- Components can be customized directly.
- A registry distributes reusable resources.
- CLI tooling simplifies installation.
- Updates must respect local modifications.

Nativra is not a literal port of shadcn/ui.

It must account for React Native requirements:

- Native component primitives.
- Platform-specific behavior.
- Native navigation integrations.
- Native styling systems.
- Android and iOS verification.
- Expo compatibility.
- Native dependency management.

The goal is to adapt the philosophy, not reproduce the web implementation.

## 1.6 Target Audience

### Beginners

- React Native learners.
- Developers who struggle with UI implementation.
- Developers who want ready-to-use components.
- Developers who need visual guidance.

### Intermediate Developers

- Developers building production applications.
- Developers who want reusable UI patterns.
- Developers who need faster screen development.
- Developers who want to customize generated components.

### Experienced Developers

- Developers maintaining design systems.
- Developers building component libraries.
- Developers creating internal development tools.
- Developers who require complete source ownership.

## 1.7 What Nativra Is Not

Nativra is not:

- A replacement for React Native.
- A replacement for Expo.
- A replacement for React Navigation.
- A mandatory runtime UI framework.
- A proprietary visual layout runtime.
- A tool requiring an account for core functionality.
- A browser-only substitute for native testing.
- A no-code platform that prevents developers from accessing source code.

---

# 2. PRODUCT VISION AND PRINCIPLES

## 2.1 Source-First Architecture

Every generated component must be delivered as editable source code.

Example:

    src/
    └── components/
        └── ui/
            ├── button.tsx
            ├── input.tsx
            ├── card.tsx
            └── dialog.tsx

Developers must be able to modify these files without depending on a proprietary runtime.

## 2.2 Styling Independence

Nativra must support two primary styling approaches.

### NativeWind

Example:

    import { Pressable, Text } from "react-native";

    export function Button() {
      return (
        <Pressable className="rounded-xl bg-blue-600 px-4 py-3">
          <Text className="text-center font-semibold text-white">
            Continue
          </Text>
        </Pressable>
      );
    }

### StyleSheet

Example:

    import {
      Pressable,
      StyleSheet,
      Text
    } from "react-native";

    export function Button() {
      return (
        <Pressable style={styles.button}>
          <Text style={styles.label}>Continue</Text>
        </Pressable>
      );
    }

    const styles = StyleSheet.create({
      button: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 12,
        backgroundColor: "#2563EB"
      },
      label: {
        color: "#FFFFFF",
        fontWeight: "600",
        textAlign: "center"
      }
    });

Both approaches should provide equivalent behavior and documented APIs wherever practical.

## 2.3 No Lock-In

Developers must be able to:

- Export generated source code.
- Modify installed components.
- Remove Nativra tooling without breaking installed components.
- Use generated components without a Nativra runtime.
- Continue development if Nativra services are unavailable.

## 2.4 Schema-Driven Generation

Visual builders must use structured schemas as their source of truth.

Do not build the primary visual editing system around arbitrary TSX parsing.

Instead:

1. Define supported component types.
2. Define editable properties.
3. Store structured documents.
4. Validate document data.
5. Generate React Native source code.

## 2.5 Safe Updates

Nativra must never silently overwrite developer modifications.

Updates must support:

- Local modification detection.
- Remote version comparison.
- Three-way merge.
- Conflict reporting.
- Manual conflict resolution.
- Backup and rollback.

## 2.6 Native-First Design

Nativra targets React Native rather than simply adapting web components.

Use native primitives and verify behavior on Android and iOS.

## 2.7 Incremental Adoption

Developers should be able to use individual Nativra features independently.

The CLI, registry, components, and Studio should not create unnecessary dependencies on one another.

## 2.8 Developer Experience

Every feature should prioritize:

- Clear documentation.
- Predictable behavior.
- Helpful error messages.
- Readable generated code.
- Simple configuration.
- Consistent APIs.

---

# 3. PRODUCT SCOPE

## 3.1 Core Features

- Component registry.
- Component library.
- CLI.
- Component Generator.
- Component Customizer.
- Theme Engine.
- Documentation website.
- Hooks and utilities.

## 3.2 Visual Development Features

- Nativra Studio.
- Screen Builder.
- Navigation Generator.
- Header Builder.
- Sidebar Builder.
- Block Builder.
- Component preview.

## 3.3 Discovery Features

- Component Explorer.
- Icon Explorer.
- Template Explorer.
- Registry browser.
- Search and filtering.

## 3.4 Management Features

- Registry management.
- Dependency resolution.
- Component installation.
- Component update manager.
- Three-way diff and merge.
- Conflict detection.
- Project configuration.

## 3.5 Feature Priorities

| Feature | Priority |
|---|---|
| Monorepo foundation | Critical |
| Registry | Critical |
| CLI | Critical |
| Component library | Critical |
| NativeWind support | Critical |
| StyleSheet support | Critical |
| Documentation | Critical |
| Component Generator | High |
| Theme Engine | High |
| Nativra Studio | High |
| Screen Builder | High |
| Navigation Generator | High |
| Block Builder | Medium |
| Header and Sidebar Builder | Medium |
| Icon Explorer | Medium |
| Advanced registry management | Medium |
| AI-assisted generation | Future |

---

# 4. SYSTEM ARCHITECTURE

## 4.1 Architecture Overview

Nativra must use a modular monorepo architecture.

Recommended structure:

    nativra/
    │
    ├── apps/
    │   ├── docs/
    │   ├── studio/
    │   └── native-preview/
    │
    ├── packages/
    │   ├── cli/
    │   ├── core/
    │   ├── schemas/
    │   ├── registry/
    │   ├── registry-client/
    │   ├── registry-builder/
    │   ├── generator/
    │   ├── dependency-resolver/
    │   ├── updater/
    │   ├── diff-engine/
    │   ├── theme-engine/
    │   ├── studio-schema/
    │   ├── preview-runtime/
    │   ├── component-contracts/
    │   ├── config/
    │   └── utils/
    │
    ├── registry/
    │   └── default/
    │
    ├── examples/
    │   ├── expo-nativewind/
    │   └── expo-stylesheet/
    │
    ├── tooling/
    │   ├── scripts/
    │   └── configs/
    │
    ├── docs/
    │
    ├── package.json
    ├── pnpm-workspace.yaml
    └── turbo.json

## 4.2 Applications

### apps/docs

Public documentation website.

Responsibilities:

- Landing page.
- Documentation.
- Component catalog.
- Component detail pages.
- Code examples.
- Installation guides.
- API references.
- CLI documentation.

### apps/studio

Main visual development application.

Responsibilities:

- Component Generator.
- Component Customizer.
- Screen Builder.
- Navigation Generator.
- Header and Sidebar Builder.
- Theme Studio.
- Block Builder.
- Icon Explorer.
- Template Explorer.

### apps/native-preview

Real React Native preview application.

Responsibilities:

- Render native components.
- Verify Android behavior.
- Verify iOS behavior.
- Test gestures.
- Test native interactions.
- Test platform-specific components.

React Native Web can provide supplementary previews but must not be treated as proof of native compatibility.

## 4.3 Shared Packages

| Package | Responsibility |
|---|---|
| core | Shared business logic |
| schemas | Validation schemas |
| registry | Registry definitions |
| registry-client | Registry communication |
| registry-builder | Registry artifact generation |
| generator | Source code generation |
| dependency-resolver | Dependency management |
| updater | Component update operations |
| diff-engine | File comparison and merging |
| theme-engine | Theme transformations |
| studio-schema | Visual builder schemas |
| preview-runtime | Isolated preview support |
| component-contracts | Component metadata |
| config | Configuration management |
| utils | Shared utilities |

## 4.4 Dependency Direction

Apps depend on feature packages.

Feature packages depend on core packages.

Core packages depend on schemas and utilities.

Core packages must not depend on application-specific UI.

## 4.5 Architecture Requirements

- Use TypeScript.
- Keep modules independently testable.
- Avoid circular dependencies.
- Share validation schemas.
- Separate UI from business logic.
- Keep code generation independent of Studio.
- Keep registry access independent of the web application.
- Avoid mandatory hosted services.

---

# 5. TECHNOLOGY STACK

## 5.1 Recommended Stack

| Area | Technology |
|---|---|
| Monorepo | pnpm workspaces |
| Build orchestration | Turborepo |
| Language | TypeScript |
| Web framework | Next.js |
| Web UI | React |
| Web styling | Tailwind CSS |
| UI primitives | Radix UI where appropriate |
| Code editor | Monaco Editor or CodeMirror |
| Native framework | React Native |
| Native development | Expo |
| Styling target 1 | NativeWind |
| Styling target 2 | StyleSheet |
| Schema validation | Zod |
| CLI | Node.js |
| Unit testing | Vitest |
| Native component testing | React Native Testing Library |
| Browser testing | Playwright |
| Native E2E testing | Maestro |
| CI/CD | GitHub Actions |
| Versioning | Changesets |
| Distribution | npm |
| Registry hosting | Static JSON and source files |

## 5.2 TypeScript

Use TypeScript throughout the project.

Reasons:

- Reliable component contracts.
- Predictable registry metadata.
- Validated builder documents.
- Safer code generation.
- Explicit CLI interfaces.
- Stable shared packages.

## 5.3 Expo

Expo should be the primary development and verification environment.

Initial priorities:

- Expo compatibility.
- Android verification.
- iOS verification.
- Expo example projects.
- Expo-compatible dependencies.

Bare React Native CLI compatibility should be introduced as a formal target after the Expo workflow is stable.

## 5.4 Styling Targets

### NativeWind

Generate components compatible with NativeWind.

### StyleSheet

Generate components using React Native StyleSheet.

Avoid coupling the core registry or code generator to one styling system.

## 5.5 Code Generation

Use deterministic generators.

The same validated configuration should produce the same source output.

Generated files must be readable, formatted, and maintainable.

## 5.6 Technology Selection Rule

Do not add dependencies without a clear reason.

Prefer stable, maintained libraries with compatible licenses and active ecosystems.

Verify package compatibility before adopting a dependency.

---

# 6. REGISTRY SYSTEM

## 6.1 Registry Purpose

The registry is the source of truth for distributable Nativra resources.

It stores:

- Components.
- Hooks.
- Utilities.
- Blocks.
- Templates.
- Themes.
- Navigation configurations.
- Metadata.
- Dependencies.
- Version information.

## 6.2 Registry Structure

    registry/
    └── default/
        ├── registry.json
        │
        ├── components/
        │   ├── button/
        │   │   ├── registry-item.json
        │   │   ├── button.tsx
        │   │   └── examples/
        │   │
        │   ├── input/
        │   ├── card/
        │   ├── dialog/
        │   └── checkbox/
        │
        ├── hooks/
        ├── utilities/
        ├── blocks/
        ├── templates/
        └── themes/

## 6.3 Component Metadata

Example:

    {
      "name": "button",
      "type": "registry:component",
      "title": "Button",
      "description": "A customizable native button component.",
      "version": "1.0.0",
      "files": [
        {
          "path": "components/ui/button.tsx",
          "type": "registry:component"
        }
      ],
      "dependencies": [],
      "registryDependencies": [],
      "styling": [
        "nativewind",
        "stylesheet"
      ],
      "platforms": [
        "ios",
        "android"
      ]
    }

## 6.4 Registry Requirements

The registry must support:

- Component lookup.
- Component metadata.
- Version information.
- File retrieval.
- Dependency resolution.
- Styling variant selection.
- Platform compatibility information.
- Search and filtering.
- Registry validation.

## 6.5 Registry Distribution

Initial implementation:

- Host registry JSON files.
- Host source files as static assets.
- Use versioned registry paths.
- Allow custom registry URLs.
- Cache registry responses.
- Validate downloaded metadata.

Do not require a database for the initial registry.

## 6.6 Custom Registries

Developers should eventually be able to configure additional registries.

Example:

    {
      "$schema": "https://nativra.dev/schema/config.json",
      "registries": {
        "@nativra": "https://registry.nativra.dev",
        "@company": "https://components.example.com"
      }
    }

Custom registries must follow the same schema and validation rules.

---

# 7. CLI SPECIFICATION

## 7.1 CLI Identity

Package name:

    nativra

Command:

    nativra

## 7.2 CLI Responsibilities

The CLI manages source installation and maintenance.

It should not become a runtime dependency of installed components.

## 7.3 Commands

### Initialize a Project

    npx nativra init

Responsibilities:

- Detect React Native project.
- Detect Expo configuration.
- Ask for styling target.
- Configure registry.
- Configure output directories.
- Create Nativra configuration.

### Add a Component

    npx nativra add button

### Add Multiple Components

    npx nativra add button input card

### Search

    npx nativra search button

### List Components

    npx nativra list

### Inspect Component

    npx nativra info button

### Check Project Configuration

    npx nativra doctor

### Preview Installation

    npx nativra add button --dry-run

### Update a Component

    npx nativra update button

### Check Available Updates

    npx nativra outdated

## 7.4 Configuration File

Example:

    {
      "$schema": "https://nativra.dev/schema/config.json",
      "style": "nativewind",
      "tsx": true,
      "aliases": {
        "components": "@/components",
        "utils": "@/lib"
      },
      "registries": {
        "@nativra": "https://registry.nativra.dev"
      },
      "paths": {
        "components": "src/components/ui",
        "hooks": "src/hooks",
        "utils": "src/lib"
      }
    }

## 7.5 Installation Process

When a developer runs:

    npx nativra add button

The CLI should:

1. Read the project configuration.
2. Detect the project structure.
3. Resolve the requested registry item.
4. Validate registry metadata.
5. Resolve dependencies.
6. Download required files.
7. Validate destination paths.
8. Detect existing files.
9. Display the installation plan.
10. Request confirmation where necessary.
11. Install files atomically.
12. Update the installation manifest.

## 7.6 Installation Manifest

Create:

    .nativra/
    └── manifest.json

Example:

    {
      "version": 1,
      "components": {
        "button": {
          "version": "1.0.0",
          "registry": "@nativra",
          "files": [
            "src/components/ui/button.tsx"
          ],
          "installedAt": "2026-11-07T00:00:00.000Z"
        }
      }
    }

## 7.7 CLI Safety Requirements

- Never execute downloaded source code during installation.
- Prevent path traversal.
- Validate registry schemas.
- Use HTTPS for remote registries.
- Support dry-run.
- Detect conflicting files.
- Preserve existing files.
- Request permission before installing dependencies.
- Use atomic file operations.
- Provide actionable error messages.

---

# 8. COMPONENT LIBRARY

## 8.1 Purpose

The component library provides reusable native UI components that developers can install into their projects.

## 8.2 Component Categories

### Actions

- Button.
- Icon Button.
- Floating Action Button.

### Inputs

- Input.
- Textarea.
- Checkbox.
- Radio.
- Switch.
- Select.

### Display

- Card.
- Badge.
- Avatar.
- Divider.
- Skeleton.
- Progress.

### Feedback

- Alert.
- Dialog.
- Toast.
- Loading Indicator.

### Layout

- Container.
- Stack.
- Row.
- Column.
- Spacer.

## 8.3 Component Requirements

Every official component should have:

- Name.
- Description.
- Props.
- Default values.
- Variants.
- Supported platforms.
- Styling compatibility.
- Dependencies.
- Accessibility behavior.
- Examples.
- Known limitations.

## 8.4 Example Component Contract

    type ButtonProps = {
      children: React.ReactNode;
      variant?: "primary" | "secondary" | "outline";
      size?: "sm" | "md" | "lg";
      disabled?: boolean;
      loading?: boolean;
      onPress?: () => void;
    };

## 8.5 Component Development Requirements

- Use native React Native primitives.
- Support TypeScript.
- Follow consistent naming.
- Provide documented props.
- Support accessibility.
- Avoid unnecessary dependencies.
- Include examples.
- Include tests.
- Provide NativeWind and StyleSheet implementations where applicable.

---

# 9. HOOKS AND UTILITIES

## 9.1 Purpose

Nativra must provide reusable hooks and utility functions in addition to UI components.

## 9.2 Initial Hooks

| Hook | Purpose |
|---|---|
| useDebounce | Debounce rapidly changing values |
| useToggle | Manage boolean state |
| usePrevious | Access previous state |
| useDisclosure | Manage open and closed states |
| useKeyboard | Observe keyboard visibility and dimensions |
| useNetworkStatus | Observe network connectivity |
| useAsync | Manage asynchronous operations |
| useMounted | Track component mount state |

## 9.3 Utility Categories

- Class name utilities.
- Color utilities.
- Formatting utilities.
- Validation utilities.
- Platform utilities.
- Dimension utilities.

## 9.4 Requirements

Each hook and utility must have:

- TypeScript types.
- Documentation.
- Usage examples.
- Tests.
- Registry metadata.
- Dependency information where applicable.

---

# 10. NATIVRA STUDIO

## 10.1 Overview

Nativra Studio is the central visual development environment.

It brings Nativra's visual tools into one application.

## 10.2 Main Layout

    ┌───────────────────────────────────────────────────────────┐
    │ Nativra       Project       Preview       Export       User │
    ├───────────────┬───────────────────────────┬───────────────┤
    │               │                           │               │
    │ Sidebar       │ Main Workspace             │ Inspector     │
    │               │                           │               │
    │ Components    │                           │ Properties    │
    │ Screens       │       Preview Canvas      │ Styling       │
    │ Navigation    │                           │ Layout        │
    │ Blocks        │                           │ Variants      │
    │ Themes        │                           │ Code          │
    │ Icons         │                           │               │
    │ Templates     │                           │               │
    │               │                           │               │
    ├───────────────┴───────────────────────────┴───────────────┤
    │ Console / Validation / Generated Files / Dependencies     │
    └───────────────────────────────────────────────────────────┘

## 10.3 Main Navigation

- Overview.
- Component Generator.
- Screen Builder.
- Navigation Generator.
- Header and Sidebar Builder.
- Block Builder.
- Theme Studio.
- Icon Explorer.
- Template Explorer.
- Registry.

## 10.4 Studio Workspace Requirements

- Resizable panels.
- Responsive layout.
- Dark and light themes.
- Keyboard shortcuts.
- Undo and redo.
- Preview refresh.
- Code inspection.
- Export.
- Save and load projects.
- Error reporting.
- Component dependency inspection.

## 10.5 Project Persistence

The Studio should support local project documents.

Example:

    .nativra-studio/
    ├── project.json
    ├── components/
    ├── screens/
    ├── navigation/
    ├── themes/
    └── assets/

Do not make cloud storage mandatory.

---

# 11. COMPONENT GENERATOR AND CUSTOMIZER

## 11.1 Purpose

The Component Generator allows developers to visually configure a React Native component and generate its source code.

The original Component Customizer remains part of this module.

## 11.2 Main Interface

    ┌───────────────────────────────────────────────────────────┐
    │ Component Generator                         Export Code   │
    ├───────────────┬───────────────────────────┬───────────────┤
    │ Component     │                           │ Properties    │
    │               │                           │               │
    │ Button        │        Live Preview       │ Variant       │
    │ Input         │                           │ Size          │
    │ Card          │                           │ Radius        │
    │ Checkbox      │                           │ Colors        │
    │ Switch        │                           │ Padding       │
    │ Badge         │                           │ Typography    │
    │ Avatar        │                           │ State         │
    │               │                           │               │
    ├───────────────┴───────────────────────────┴───────────────┤
    │ Generated Source Code                                      │
    └───────────────────────────────────────────────────────────┘

## 11.3 Component Configuration

For a Button:

- Variant.
- Size.
- Color.
- Radius.
- Padding.
- Typography.
- Border.
- Disabled state.
- Loading state.
- Icon placement.
- Full-width mode.

## 11.4 Component Schema

Example:

    type ButtonConfig = {
      variant:
        | "primary"
        | "secondary"
        | "outline"
        | "ghost"
        | "destructive";

      size:
        | "sm"
        | "md"
        | "lg";

      radius: number;
      fullWidth: boolean;
      disabled: boolean;
      loading: boolean;
      label: string;
    };

## 11.5 Generation Process

1. Select component.
2. Load its schema.
3. Display configurable properties.
4. Update preview when values change.
5. Validate configuration.
6. Generate TypeScript source.
7. Show generated code.
8. Allow copying or exporting.
9. Allow adding the component to a registry or project.

## 11.6 Generated Code Requirements

The generated component must be a real React Native implementation.

The preview must not be a separate fake implementation that behaves differently from the exported code.

---

# 12. INTERACTIVE SCREEN BUILDER

## 12.1 Purpose

The Screen Builder allows developers to visually compose complete React Native screens.

It is one of Nativra's main V2 features.

## 12.2 Core Concept

A developer should be able to create a screen by placing supported components onto a visual canvas.

The builder then generates editable React Native source code.

## 12.3 Interface

    ┌─────────────────────────────────────────────────────────────┐
    │ Screen Builder       Device       Undo       Redo      Export │
    ├───────────────┬───────────────────────────────┬───────────────┤
    │ Components    │                               │ Inspector     │
    │               │       Device Preview          │               │
    │ Layout        │                               │ Properties    │
    │ Basic         │        ┌─────────────┐         │ Layout        │
    │ Inputs        │        │             │         │ Spacing       │
    │ Display       │        │   Screen    │         │ Appearance    │
    │ Actions       │        │             │         │ Responsive    │
    │ Navigation    │        │             │         │               │
    │               │        └─────────────┘         │               │
    ├───────────────┴───────────────────────────────┴───────────────┤
    │ Layers / Component Tree / Generated Code / Validation          │
    └─────────────────────────────────────────────────────────────┘

## 12.4 Canvas Capabilities

- Add components.
- Remove components.
- Move components.
- Reorder components.
- Resize supported layout elements.
- Select elements.
- Duplicate elements.
- Group elements.

## 12.5 Component Tree

Display the hierarchy of the current screen.

Example:

    Screen
    └── SafeAreaView
        └── ScrollView
            ├── Header
            ├── SearchInput
            ├── Section
            │   ├── Title
            │   └── ProductCard
            └── BottomAction

## 12.6 Inspector

Properties depend on the selected element.

Examples:

- Width.
- Height.
- Padding.
- Margin.
- Gap.
- Alignment.
- Background.
- Border.
- Radius.
- Typography.
- Visibility.
- Position.

## 12.7 Device Preview

Support:

- Small phone.
- Standard phone.
- Large phone.
- Tablet.
- Custom dimensions.

Device previews are visual aids. They do not replace testing on real Android and iOS targets.

## 12.8 Supported Layout Primitives

- View.
- SafeAreaView.
- ScrollView.
- FlatList.
- SectionList.
- Stack.
- Row.
- Column.
- Spacer.
- Divider.

## 12.9 Screen Document Schema

Example:

    {
      "id": "home-screen",
      "type": "screen",
      "name": "Home",
      "children": [
        {
          "id": "header",
          "type": "header",
          "props": {
            "title": "Home"
          }
        },
        {
          "id": "search",
          "type": "input",
          "props": {
            "placeholder": "Search products"
          }
        }
      ]
    }

## 12.10 Code Generation

Example:

    import {
      SafeAreaView,
      ScrollView,
      Text,
      View
    } from "react-native";

    import { Input } from "@/components/ui/input";

    export default function HomeScreen() {
      return (
        <SafeAreaView style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={{ padding: 20 }}>
            <View style={{ marginBottom: 20 }}>
              <Text style={{ fontSize: 24, fontWeight: "700" }}>
                Home
              </Text>
            </View>

            <Input placeholder="Search products" />
          </ScrollView>
        </SafeAreaView>
      );
    }

## 12.11 Editing Requirements

- Undo and redo.
- Multi-selection where supported.
- Copy and paste.
- Duplicate.
- Delete.
- Drag and drop.
- Component tree selection.
- Property validation.
- Code preview.
- Export.
- Save and reopen.

## 12.12 Architectural Restriction

Do not build the Screen Builder around unrestricted TSX parsing.

Instead:

1. Use a structured screen schema.
2. Define supported component types.
3. Define editable properties.
4. Validate the document.
5. Generate source from the document.

Arbitrary imported TSX should remain outside the visual editing scope unless a future, explicitly limited import feature is implemented.

---

# 13. NAVIGATION GENERATOR

## 13.1 Purpose

Generate React Native navigation structures visually.

The initial target should be React Navigation.

## 13.2 Navigation Types

- Stack Navigation.
- Bottom Tab Navigation.
- Drawer Navigation.
- Nested Navigation.
- Authentication Flow.

## 13.3 Builder Interface

    ┌─────────────────────────────────────────────────────────────┐
    │ Navigation Generator                           Export        │
    ├───────────────┬───────────────────────────────┬───────────────┤
    │ Navigation    │                               │ Configuration │
    │ Types         │       Navigation Canvas       │               │
    │               │                               │ Navigator     │
    │ Stack         │       ┌─────────────┐         │ Screen        │
    │ Bottom Tabs   │       │    Home     │         │ Options       │
    │ Drawer        │       └──────┬──────┘         │ Initial Route │
    │ Auth Flow     │              │                │               │
    │               │       ┌──────┴──────┐         │               │
    │               │       │             │         │               │
    │               │    Details       Profile     │               │
    ├───────────────┴───────────────────────────────┴───────────────┤
    │ Generated Navigation Code                                    │
    └─────────────────────────────────────────────────────────────┘

## 13.4 Capabilities

- Create navigators.
- Add screens.
- Rename screens.
- Reorder screens.
- Configure initial routes.
- Configure screen options.
- Nest navigators.
- Configure tab icons.
- Configure drawer items.
- Generate navigation types.
- Generate navigation source code.
- Display required dependencies.

## 13.5 Navigation Schema

Example:

    {
      "type": "bottom-tabs",
      "initialRouteName": "Home",
      "screens": [
        {
          "name": "Home",
          "component": "HomeScreen",
          "options": {
            "title": "Home"
          }
        },
        {
          "name": "Profile",
          "component": "ProfileScreen",
          "options": {
            "title": "Profile"
          }
        }
      ]
    }

## 13.6 Generated Output

    src/
    └── navigation/
        ├── index.tsx
        ├── types.ts
        ├── root-navigator.tsx
        ├── tab-navigator.tsx
        └── linking.ts

## 13.7 Dependency Management

The generator must detect the selected navigation configuration and display required packages.

Do not install packages without developer approval.

---

# 14. HEADER AND SIDEBAR BUILDER

## 14.1 Purpose

Provide a dedicated visual builder for application headers and sidebar navigation.

This module should work independently and integrate with Screen Builder and Navigation Generator.

## 14.2 Header Types

- Basic Header.
- Centered Title Header.
- Back Navigation Header.
- Search Header.
- Profile Header.
- Transparent Header.
- Collapsible Header.
- Custom Header.

## 14.3 Header Properties

- Title.
- Subtitle.
- Left action.
- Right actions.
- Back button.
- Logo.
- Avatar.
- Background.
- Height.
- Alignment.
- Border.
- Shadow.
- Safe area behavior.

## 14.4 Sidebar Types

- Fixed Sidebar.
- Collapsible Sidebar.
- Drawer Sidebar.
- Icon-only Sidebar.
- Profile Sidebar.
- Nested Sidebar.

## 14.5 Sidebar Properties

- Logo.
- Header section.
- Profile section.
- Navigation groups.
- Navigation items.
- Icons.
- Active state.
- Footer section.
- Width.
- Background.
- Divider.
- Item spacing.

## 14.6 Sidebar Schema

Example:

    {
      "type": "sidebar",
      "width": 280,
      "items": [
        {
          "label": "Dashboard",
          "icon": "layout-dashboard",
          "route": "Dashboard"
        },
        {
          "label": "Settings",
          "icon": "settings",
          "route": "Settings"
        }
      ]
    }

## 14.7 Output

Generate editable React Native components.

For mobile navigation, drawer-based behavior should use a compatible native navigation implementation rather than assuming a web-style fixed sidebar works on phones.

---

# 15. THEME ENGINE

## 15.1 Purpose

The Theme Engine manages reusable design tokens across Nativra components, blocks, and screens.

## 15.2 Theme Categories

- Colors.
- Typography.
- Spacing.
- Border radius.
- Shadows.
- Elevation.
- Opacity.
- Component variants.

## 15.3 Theme Structure

    themes/
    ├── default/
    ├── neutral/
    ├── ocean/
    ├── forest/
    └── custom/

## 15.4 Theme Schema

Example:

    {
      "name": "Default",
      "mode": "light",
      "colors": {
        "background": "#FFFFFF",
        "foreground": "#111827",
        "primary": "#2563EB",
        "secondary": "#E5E7EB",
        "muted": "#F3F4F6",
        "border": "#E5E7EB",
        "destructive": "#DC2626"
      },
      "radius": {
        "sm": 6,
        "md": 10,
        "lg": 16,
        "full": 999
      },
      "spacing": {
        "xs": 4,
        "sm": 8,
        "md": 16,
        "lg": 24,
        "xl": 32
      }
    }

## 15.5 Theme Studio

Users should be able to:

- Select a theme.
- Edit colors.
- Edit typography.
- Edit spacing.
- Edit radii.
- Preview changes.
- Switch light and dark modes.
- Create custom themes.
- Export theme configuration.

## 15.6 Output Formats

Generate:

- TypeScript theme objects.
- NativeWind-compatible configuration.
- StyleSheet-compatible theme utilities.

Theme generation should not require a mandatory Nativra runtime.

---

# 16. ICON EXPLORER

## 16.1 Purpose

Icon Explorer provides a searchable interface for discovering icons and generating their usage code.

## 16.2 Capabilities

- Search icons.
- Browse icon libraries.
- Filter by category.
- Preview icons.
- Change icon size.
- Change icon color.
- Preview stroke width where supported.
- Copy icon names.
- Copy import statements.
- Generate JSX usage.
- Display package dependencies.

## 16.3 Initial Icon Libraries

Potential integrations:

- Lucide.
- Material Community Icons.
- Ionicons.
- Font Awesome.

The first release should focus on a small number of well-supported icon packages rather than trying to support every icon ecosystem.

## 16.4 Icon Details

Each icon entry should provide:

- Icon name.
- Library.
- Package name.
- Import path.
- Platform support notes.
- Preview.
- Example code.

## 16.5 Example Generated Code

    import { Home } from "lucide-react-native";

    export function HomeIcon() {
      return <Home size={24} color="#2563EB" />;
    }

The explorer must display any required package installation instructions.

---

# 17. BLOCKS AND TEMPLATES

## 17.1 Blocks

Blocks are reusable combinations of components.

Examples:

- Login Form.
- Signup Form.
- Profile Header.
- Search Section.
- Product Card Grid.
- Settings Section.
- Statistics Cards.
- Empty State.
- Error State.
- Loading Section.

## 17.2 Block Requirements

Each block should have:

- Preview.
- Description.
- Source files.
- Dependencies.
- Styling support.
- Configuration schema.
- Installation instructions.
- Version information.

## 17.3 Templates

Templates are larger reusable screen or application starting points.

### Screen Templates

- Login Screen.
- Registration Screen.
- Dashboard.
- Profile Screen.
- Settings Screen.
- Product Listing.
- Product Details.

### Application Templates

- E-commerce Starter.
- Dashboard Starter.
- Social App Starter.
- Authentication Starter.
- Productivity App Starter.

## 17.4 Template Structure

    templates/
    └── ecommerce/
        ├── template.json
        ├── screens/
        ├── components/
        ├── navigation/
        ├── themes/
        └── README.md

## 17.5 Block vs Template

A block is a reusable interface section.

A template is a larger starting point that may include multiple screens, navigation, and shared components.

---

# 18. COMPONENT UPDATE AND MERGE SYSTEM

## 18.1 Purpose

Allow developers to update installed components without losing their customizations.

This is one of the most important requirements of Nativra's source-first architecture.

## 18.2 The Problem

A developer installs a component and modifies it.

Later, Nativra publishes a new version.

A normal overwrite would destroy the developer's changes.

Nativra must prevent this.

## 18.3 Three-Way Merge

Use three versions:

- Base: Original version installed by the developer.
- Local: Current file in the developer's project.
- Remote: New version in the registry.

Compare all three.

    Base
      |
      ├── Local modifications
      |
      └── Remote updates
              |
              v
         Three-way merge
              |
              v
       Merge result or conflicts

## 18.4 Update Process

1. Read installation manifest.
2. Retrieve original base version.
3. Retrieve latest registry version.
4. Read local file.
5. Calculate changes.
6. Detect conflicting modifications.
7. Display a comparison.
8. Generate a proposed merge.
9. Ask for confirmation.
10. Apply the update.
11. Save the new base version.

## 18.5 Update Outcomes

- No local changes: update safely.
- Only remote changes: update safely.
- Separate local and remote changes: attempt merge.
- Conflicting changes: require manual resolution.

## 18.6 Required Interface

The update interface should display:

- Original code.
- Local code.
- New registry code.
- Proposed merged code.
- Conflict markers.
- Accept and reject controls.

Never silently replace locally modified source files.

---

# 19. SECURITY AND SAFETY

## 19.1 Registry Security

- Use HTTPS.
- Validate metadata.
- Validate file paths.
- Reject path traversal.
- Do not execute downloaded scripts.
- Verify expected file types.
- Support file hashes.
- Handle invalid registry responses safely.

## 19.2 CLI Security

- Require permission for package installation.
- Use dry-run previews.
- Preserve existing files.
- Use atomic writes.
- Create backups before destructive operations.
- Provide rollback where possible.
- Never delete unrelated project files.

## 19.3 Studio Security

- Treat imported project data as untrusted.
- Do not execute arbitrary imported JavaScript.
- Restrict preview execution.
- Validate component schemas.
- Avoid unsafe dynamic evaluation.
- Keep user project files separate from Studio internal state.

## 19.4 Data Privacy

Core Nativra functionality should not require a user account.

Do not upload project source code to a remote server unless the developer explicitly chooses a feature that requires it.

---

# 20. UI/UX DESIGN REQUIREMENTS

## 20.1 Design Direction

Nativra should feel like a professional developer tool.

The design should prioritize:

- Clarity.
- Information density.
- Consistency.
- Efficient workflows.
- Readability.
- Minimal distractions.
- Developer productivity.

## 20.2 Visual Identity

Suggested direction:

- Modern developer-tool aesthetic.
- Neutral surfaces.
- Clear typography.
- Subtle borders.
- Consistent spacing.
- Restrained accent colors.
- Strong code readability.

Avoid making Studio look like a generic consumer dashboard.

## 20.3 Global UI Requirements

- Light theme.
- Dark theme.
- Responsive layouts.
- Consistent navigation.
- Resizable workspace panels.
- Keyboard shortcuts.
- Clear focus states.
- Accessible controls.
- Helpful empty states.
- Consistent dialogs.
- Clear error messages.

## 20.4 Studio Layout

The visual development environment should use:

- Left sidebar for tools and component discovery.
- Center workspace for canvas and previews.
- Right inspector for properties.
- Bottom panel for code, logs, validation, and dependencies.

## 20.5 Design System

Nativra itself should use a consistent design system.

Define reusable:

- Colors.
- Typography.
- Spacing.
- Borders.
- Radius.
- Shadows.
- Buttons.
- Inputs.
- Dialogs.
- Tabs.
- Dropdowns.
- Panels.
- Tooltips.

Do not create different visual systems for every Studio module.

---

# 21. TESTING STRATEGY

## 21.1 Testing Philosophy

Nativra must test both its generated code and its own tools.

A component that looks correct in a browser is not necessarily correct on Android or iOS.

## 21.2 Unit Tests

Use Vitest for:

- Schema validation.
- Registry resolution.
- Code generation.
- Dependency resolution.
- Theme transformations.
- File comparison.
- Merge operations.

## 21.3 Web UI Tests

Use Playwright for:

- Studio navigation.
- Component customization.
- Screen Builder operations.
- Export workflows.
- Registry browsing.

## 21.4 React Native Tests

Use React Native Testing Library for:

- Component rendering.
- User interactions.
- Accessibility.
- Component states.

## 21.5 Native End-to-End Tests

Use Maestro for:

- Android flows.
- iOS flows.
- Navigation.
- Inputs.
- Dialogs.
- Platform-specific behavior.

## 21.6 Styling Matrix

Every core component should be tested with:

| Styling | Android | iOS |
|---|---|---|
| NativeWind | Required | Required |
| StyleSheet | Required | Required |

## 21.7 Release Requirements

Before publishing a component:

- Schema passes.
- TypeScript passes.
- Unit tests pass.
- Native tests pass where applicable.
- Example application builds.
- Documentation exists.
- Dependencies are declared.
- Registry metadata validates.

---

# 22. DEPLOYMENT AND RELEASE

## 22.1 Deployment Architecture

Nativra should be deployable without requiring a complex backend.

Recommended initial setup:

| Service | Purpose |
|---|---|
| Vercel or equivalent | Docs and Studio |
| Static hosting or CDN | Registry files |
| npm | CLI distribution |
| GitHub | Source repository |
| GitHub Actions | CI/CD |

## 22.2 Registry Publishing

The registry build process should:

1. Validate metadata.
2. Validate source files.
3. Run tests.
4. Generate registry artifacts.
5. Calculate hashes.
6. Publish versioned artifacts.
7. Update registry index.

## 22.3 Release Strategy

Use semantic versioning.

    MAJOR.MINOR.PATCH

Examples:

- 1.0.0 — Initial stable release.
- 1.1.0 — New components.
- 1.1.1 — Bug fixes.
- 2.0.0 — Breaking changes.

Use Changesets to coordinate package releases.

## 22.4 Initial Release Checklist

- [ ] CLI published.
- [ ] Registry published.
- [ ] Documentation deployed.
- [ ] Studio deployed.
- [ ] Core components available.
- [ ] NativeWind examples tested.
- [ ] StyleSheet examples tested.
- [ ] Android verified.
- [ ] iOS verified.
- [ ] Installation guide complete.
- [ ] Update behavior documented.
- [ ] Security review complete.

---

# 23. IMPLEMENTATION ROADMAP

Implementation must happen incrementally.

Do not attempt to build the entire product in one uncontrolled operation.

## PHASE 1 — FOUNDATION

Goal: Establish the development environment.

Tasks:

- Create monorepo.
- Configure pnpm.
- Configure Turborepo.
- Configure TypeScript.
- Create shared packages.
- Configure linting.
- Configure formatting.
- Configure testing.
- Set up GitHub Actions.

Deliverable: Working monorepo.

## PHASE 2 — SCHEMA AND REGISTRY

Goal: Establish the source distribution system.

Tasks:

- Define registry schemas.
- Define component metadata.
- Create registry directory.
- Implement registry validation.
- Implement registry lookup.
- Create first component entry.

Deliverable: Validated component registry.

## PHASE 3 — FIRST COMPONENT

Goal: Prove the complete source-first workflow.

Start with Button.

Tasks:

- Create NativeWind Button.
- Create StyleSheet Button.
- Create metadata.
- Add examples.
- Add tests.
- Add documentation.
- Generate registry artifacts.

Deliverable: First distributable Nativra component.

## PHASE 4 — CLI

Goal: Install components into real projects.

Tasks:

- Implement init.
- Implement add.
- Implement list.
- Implement search.
- Implement info.
- Implement doctor.
- Implement dry-run.
- Implement installation manifest.
- Implement conflict protection.

Deliverable: Working CLI.

## PHASE 5 — COMPONENT LIBRARY

Goal: Expand the registry.

Build:

- Button.
- Input.
- Textarea.
- Card.
- Badge.
- Avatar.
- Checkbox.
- Radio.
- Switch.
- Divider.
- Skeleton.
- Alert.

Each component should support both styling targets where applicable.

Deliverable: Initial component library.

## PHASE 6 — DOCUMENTATION WEBSITE

Goal: Make Nativra usable by developers.

Build:

- Landing page.
- Documentation.
- Component catalog.
- Component detail pages.
- Code examples.
- Installation guides.
- CLI documentation.

Deliverable: Public documentation website.

## PHASE 7 — COMPONENT GENERATOR

Goal: Introduce visual component customization.

Tasks:

- Define component schemas.
- Build component selector.
- Build property inspector.
- Build preview.
- Implement source generator.
- Implement export.

Deliverable: Working Component Generator.

## PHASE 8 — THEME ENGINE

Goal: Introduce design token management.

Tasks:

- Define theme schema.
- Build theme editor.
- Add light and dark modes.
- Generate NativeWind configuration.
- Generate StyleSheet theme utilities.
- Add theme export.

Deliverable: Theme Studio.

## PHASE 9 — NATIVRA STUDIO

Goal: Build the central visual environment.

Tasks:

- Build Studio layout.
- Add navigation.
- Add workspace state.
- Add project persistence.
- Integrate Component Generator.
- Integrate Theme Studio.
- Add code viewer.

Deliverable: Initial Nativra Studio.

## PHASE 10 — BLOCKS AND TEMPLATES

Goal: Expand from individual components to reusable interface sections.

Tasks:

- Define block schema.
- Build block registry.
- Create first blocks.
- Define template schema.
- Build template explorer.
- Add template export.

Deliverable: Blocks and Templates.

## PHASE 11 — SCREEN BUILDER

Goal: Build visual screen composition.

Tasks:

- Define screen document schema.
- Implement component tree.
- Implement canvas.
- Implement drag and drop.
- Implement inspector.
- Implement undo and redo.
- Implement code generation.
- Implement export.

Deliverable: Screen Builder.

## PHASE 12 — NAVIGATION GENERATOR

Goal: Generate navigation architecture.

Tasks:

- Define navigation schema.
- Build navigator canvas.
- Add screen management.
- Add nested navigation.
- Generate navigation types.
- Generate React Navigation code.
- Display dependencies.

Deliverable: Navigation Generator.

## PHASE 13 — HEADER AND SIDEBAR BUILDER

Goal: Generate reusable application navigation layouts.

Tasks:

- Define header schemas.
- Define sidebar schemas.
- Build visual editors.
- Add preview.
- Generate source code.
- Integrate with Screen Builder.

Deliverable: Header and Sidebar Builder.

## PHASE 14 — ICON EXPLORER

Goal: Add icon discovery and integration.

Tasks:

- Integrate first icon library.
- Build icon catalog.
- Implement search.
- Implement preview.
- Implement code generation.
- Display dependencies.

Deliverable: Icon Explorer.

## PHASE 15 — UPDATE AND MERGE SYSTEM

Goal: Protect developer modifications.

Tasks:

- Track installed base versions.
- Calculate file changes.
- Implement three-way diff.
- Implement merge engine.
- Build conflict viewer.
- Implement rollback.

Deliverable: Safe update system.

## PHASE 16 — RELEASE PREPARATION

Goal: Prepare Nativra for public use.

Tasks:

- Test complete workflows.
- Verify Android.
- Verify iOS.
- Improve documentation.
- Review security.
- Publish CLI.
- Publish registry.
- Deploy documentation.
- Deploy Studio.

Deliverable: Nativra V2 public release.

---

# 24. AI CODING AGENT INSTRUCTIONS

This section is intended to be used directly as instructions for an AI coding agent.

## 24.1 Role

You are the senior software architect and implementation engineer responsible for building Nativra.

You must follow this Nativra V2 Master Blueprint as the source of truth.

Do not redesign the product or remove specified features without explicit approval.

## 24.2 Core Development Rules

1. Use TypeScript.
2. Follow the monorepo architecture.
3. Keep packages modular.
4. Use shared schemas.
5. Avoid duplicated business logic.
6. Write tests alongside implementation.
7. Keep generated code readable.
8. Preserve source-first architecture.
9. Support NativeWind and StyleSheet.
10. Never silently overwrite user files.
11. Do not implement fake functionality.
12. Do not mark incomplete features as complete.
13. Verify generated code in a React Native environment.
14. Document architectural decisions.

## 24.3 Implementation Workflow

Before implementing a feature:

1. Read the relevant blueprint section.
2. Inspect the current repository.
3. Identify existing packages and dependencies.
4. Identify missing functionality.
5. Create an implementation plan.
6. Identify affected modules.
7. Define acceptance criteria.

During implementation:

1. Implement schemas first.
2. Implement core logic.
3. Implement UI.
4. Implement tests.
5. Implement documentation.
6. Run validation.
7. Fix errors before continuing.

After implementation:

1. Report files created.
2. Report files modified.
3. Report tests executed.
4. Report test results.
5. Report remaining limitations.
6. Update the project roadmap.

## 24.4 Development Order

Follow this order:

    1. Monorepo Foundation
            |
            v
    2. Shared Schemas
            |
            v
    3. Registry System
            |
            v
    4. First Component
            |
            v
    5. CLI
            |
            v
    6. Component Library
            |
            v
    7. Documentation
            |
            v
    8. Component Generator
            |
            v
    9. Theme Engine
            |
            v
    10. Nativra Studio
            |
            v
    11. Blocks and Templates
            |
            v
    12. Screen Builder
            |
            v
    13. Navigation Generator
            |
            v
    14. Header and Sidebar Builder
            |
            v
    15. Icon Explorer
            |
            v
    16. Update and Merge System
            |
            v
    17. Testing and Release

## 24.5 AI Agent Restrictions

The coding agent must not:

- Generate the entire project in one uncontrolled operation.
- Replace working modules unnecessarily.
- Ignore the existing architecture.
- Create multiple competing implementations of the same feature.
- Use mock data as a substitute for required functionality.
- Claim native compatibility without native verification.
- Install dependencies without considering project compatibility.
- Delete existing user code without permission.
- Skip tests to make a feature appear complete.
- Introduce unnecessary runtime dependencies.
- Build visual builders around unrestricted TSX parsing.

## 24.6 Acceptance Criteria

A feature is complete only when:

- Its requirements are implemented.
- Its schema is validated.
- Its UI works.
- Its generated output is correct, where applicable.
- Its tests pass.
- Its documentation exists.
- Its known limitations are recorded.

## 24.7 First Instruction to the Coding Agent

Start with repository inspection.

Do not begin implementing the entire product immediately.

First:

1. Inspect the current project directory.
2. Determine whether a project already exists.
3. Identify the existing technology stack.
4. Compare the repository against the Nativra V2 architecture.
5. Report what already exists.
6. Create a phased implementation plan.
7. Begin Phase 1 only after establishing the current state.

---

# 25. FINAL PRODUCT ACCEPTANCE CRITERIA

Nativra V2 is considered ready for its initial public release when the following conditions are satisfied.

## 25.1 Foundation

- [ ] Monorepo is configured.
- [ ] Shared packages are implemented.
- [ ] TypeScript configuration is consistent.
- [ ] CI pipeline works.
- [ ] Tests execute successfully.

## 25.2 Registry

- [ ] Registry schemas are validated.
- [ ] Registry metadata is consistent.
- [ ] Source files are retrievable.
- [ ] Dependency resolution works.
- [ ] Versioning works.

## 25.3 CLI

- [ ] Project initialization works.
- [ ] Component installation works.
- [ ] Search works.
- [ ] Component information works.
- [ ] Dry-run works.
- [ ] Conflict detection works.
- [ ] Installation manifest works.

## 25.4 Component Library

- [ ] Initial component set is available.
- [ ] NativeWind implementations are tested.
- [ ] StyleSheet implementations are tested.
- [ ] Documentation is available.
- [ ] Android compatibility is verified.
- [ ] iOS compatibility is verified.

## 25.5 Studio

- [ ] Studio layout works.
- [ ] Component Generator works.
- [ ] Theme Studio works.
- [ ] Generated source can be exported.
- [ ] Project data can be saved and reopened.

## 25.6 Visual Builders

- [ ] Screen Builder works.
- [ ] Component tree works.
- [ ] Inspector works.
- [ ] Navigation Generator works.
- [ ] Header Builder works.
- [ ] Sidebar Builder works.
- [ ] Code generation produces editable source.

## 25.7 Management

- [ ] Blocks can be installed.
- [ ] Templates can be installed.
- [ ] Icon Explorer generates valid usage examples.
- [ ] Component updates detect local changes.
- [ ] Three-way merge works.
- [ ] Conflicts are reported clearly.

## 25.8 Documentation and Release

- [ ] Installation documentation exists.
- [ ] API documentation exists.
- [ ] Component documentation exists.
- [ ] CLI documentation exists.
- [ ] Studio documentation exists.
- [ ] Security review is complete.
- [ ] Public registry is deployed.
- [ ] CLI is published.
- [ ] Documentation website is deployed.

---

# 26. FINAL PRODUCT DEFINITION

Nativra V2 is a source-first React Native developer ecosystem.

It should provide a complete workflow:

1. Discover components, hooks, utilities, icons, blocks, and templates.
2. Customize components visually.
3. Create themes.
4. Build complete application screens.
5. Generate navigation structures.
6. Generate headers and sidebars.
7. Export editable React Native source code.
8. Install source files through the CLI.
9. Manage components through the registry.
10. Update components safely without destroying local changes.
11. Verify native behavior on Android and iOS.

The final objective is to create a developer-owned React Native toolkit that combines the flexibility of source-first component distribution with the productivity of visual development tools.

**Nativra: Build native interfaces visually. Keep control of your code.**