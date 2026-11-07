# NATIVRA V3 — PRODUCTION-READY MASTER BLUEPRINT UPGRADE

**Document Type:** Product Architecture and Technical Specification  
**Product:** Nativra  
**Version:** V3  
**Status:** Proposed  
**Foundation:** Nativra V1 + V2 Master Blueprint

---

# 1. PURPOSE OF V3

Nativra V3 extends the existing V1 and V2 product blueprint to make Nativra technically complete, scalable, maintainable, and ready for production development.

V3 must not replace or remove existing V1 and V2 functionality.

All existing capabilities must remain part of the product:

- Source-first component library.
- Component registry.
- CLI.
- Nativra Studio.
- Component Generator.
- Component Customizer.
- Interactive Screen Builder.
- Navigation Generator.
- Header and Sidebar Builder.
- Theme Engine.
- Icon Explorer.
- Hooks and Utilities.
- Blocks and Templates.
- Documentation Website.
- Native Android and iOS verification.
- Three-way component update and merge system.

V3 introduces additional technical specifications and improvements around these systems.

## 1.1 Product Direction

Nativra is a source-first React Native development platform that enables developers to discover, customize, generate, compose, and maintain React Native code.

**Product promise:**

Discover visually. Customize freely. Generate native code. Own everything.

## 1.2 Core Principles

1. Source ownership: developers own the generated code.
2. No mandatory runtime dependency on Nativra.
3. No mandatory AI dependency.
4. Schema-driven visual tools.
5. Predictable and reproducible code generation.
6. Native React Native compatibility.
7. Safe updates and dependency management.
8. Extensible registry architecture.
9. Accessibility by default.
10. Developer experience takes priority over unnecessary complexity.

---

# 2. TECHNICAL CONTRACTS AND SCHEMAS

This is the highest-priority V3 addition.

Every major Nativra subsystem must use clearly defined contracts.

Do not allow different packages to invent their own incompatible data structures.

## 2.1 Registry Schema

Create a centralized registry schema.

Every registry item must support:

- Unique identifier.
- Name.
- Description.
- Version.
- Category.
- Tags.
- Author.
- License.
- Source files.
- Dependencies.
- Peer dependencies.
- Supported styling systems.
- React Native compatibility.
- Expo compatibility.
- Preview metadata.
- Documentation metadata.
- Installation instructions.

Example conceptual structure:

```json
{
  "id": "button",
  "name": "Button",
  "version": "1.0.0",
  "type": "component",
  "category": "form",
  "description": "Customizable React Native button.",
  "files": [
    {
      "path": "components/ui/button.tsx",
      "type": "component"
    }
  ],
  "dependencies": [],
  "peerDependencies": [
    "react",
    "react-native"
  ],
  "styling": [
    "nativewind",
    "stylesheet"
  ],
  "platforms": [
    "ios",
    "android"
  ]
}
```

The example is illustrative. The actual schema must be defined using Zod and validated consistently across the CLI, Studio, registry, and generator.

## 2.2 Component Metadata Contract

Each component must have standardized metadata.

Required properties:

- Component ID.
- Component name.
- Component category.
- Description.
- Version.
- Supported platforms.
- Supported styling systems.
- Required dependencies.
- Optional dependencies.
- Component properties.
- Default property values.
- Preview configuration.
- Accessibility information.
- Documentation reference.
- Source file references.

## 2.3 Theme Token Schema

Define a shared theme token system.

Support:

- Colors.
- Typography.
- Font sizes.
- Font weights.
- Spacing.
- Border radius.
- Borders.
- Shadows.
- Opacity.
- Component-specific tokens.
- Light mode.
- Dark mode.
- Custom themes.

Theme tokens must be serializable and usable by both the Studio and generated React Native code.

## 2.4 Screen Builder Schema

The Screen Builder must use a versioned JSON-based document schema.

It must describe:

- Screen metadata.
- Canvas configuration.
- Component hierarchy.
- Component properties.
- Layout properties.
- Responsive configuration.
- Theme references.
- Navigation actions.
- Reusable component references.
- Component identifiers.
- Schema version.

Every document must be validated before rendering or code generation.

## 2.5 Navigation Schema

Define a centralized navigation configuration supporting:

- Stack navigators.
- Tab navigators.
- Drawer navigators.
- Nested navigators.
- Screen parameters.
- Deep links.
- Navigation options.
- Initial routes.
- Typed navigation parameters.

Generated navigation code must be compatible with the documented React Navigation integration.

## 2.6 Generator Contracts

Every generator must follow a predictable interface.

Conceptual contract:

```ts
interface Generator<TInput, TOutput> {
  validate(input: TInput): Promise<void>;
  generate(input: TInput): Promise<TOutput>;
}
```

The actual implementation must also define:

- Validation errors.
- Generation errors.
- File outputs.
- Dependency requirements.
- Formatting rules.
- Naming conventions.
- Deterministic output behavior.

---

# 3. COMPATIBILITY AND VERSION MANAGEMENT

Nativra must maintain an explicit compatibility matrix.

## 3.1 Supported Ecosystems

Track compatibility with:

- React Native.
- Expo SDK.
- React.
- TypeScript.
- NativeWind.
- React Navigation.
- Android.
- iOS.

Do not claim support for versions that have not been tested.

## 3.2 Compatibility Matrix

Create a compatibility document and machine-readable configuration.

Example:

| Technology | Compatibility information |
|---|---|
| React Native | Tested versions |
| Expo SDK | Tested SDK versions |
| React | Compatible versions |
| TypeScript | Minimum and tested versions |
| NativeWind | Supported versions |
| React Navigation | Supported versions |
| Android | Minimum API and tested APIs |
| iOS | Minimum deployment target and tested versions |

Actual version numbers must be established through current official documentation and automated testing.

## 3.3 Compatibility Validation

Before installing a component, Nativra must:

1. Detect the target project configuration.
2. Identify installed framework versions.
3. Check component compatibility.
4. Check peer dependencies.
5. Identify incompatible dependencies.
6. Display warnings and errors.
7. Allow the developer to review changes.
8. Generate an installation plan.

Never silently install incompatible dependencies.

---

# 4. ADVANCED INTERACTIVE SCREEN BUILDER

The Screen Builder should become one of Nativra's primary features.

## 4.1 Editing Capabilities

Implement:

- Drag and drop.
- Component selection.
- Multi-selection.
- Component duplication.
- Copy and paste.
- Component deletion.
- Undo and redo.
- Component grouping.
- Component nesting.
- Alignment guides.
- Snap-to-grid.
- Layer ordering.
- Component locking.
- Component visibility.
- Reusable sections.
- Saved components.

## 4.2 Canvas System

Support:

- Multiple screen sizes.
- Android preview.
- iPhone preview.
- Responsive layout preview.
- Scrollable content.
- Safe area visualization.
- Status bar visualization.
- Navigation bar visualization.
- Light and dark themes.

The canvas must represent React Native layout behavior as accurately as practical.

Web previews are not proof of native compatibility.

## 4.3 Properties Inspector

Every selected component must expose its editable properties.

Organize properties into:

1. General.
2. Layout.
3. Appearance.
4. Typography.
5. Spacing.
6. Borders.
7. Colors.
8. Responsive behavior.
9. Accessibility.
10. Advanced properties.

Properties must be generated from component metadata or validated schemas.

Avoid maintaining separate, manually duplicated property definitions.

## 4.4 Component Hierarchy

Provide a dedicated component tree.

Developers must be able to:

- Inspect nesting.
- Reorder components.
- Rename layers.
- Group components.
- Delete components.
- Select nested components.
- Detect invalid nesting.
- Navigate between parent and child components.

## 4.5 Undo and Redo

Implement a reliable history system.

Requirements:

- Undo individual operations.
- Redo reverted operations.
- Group related operations.
- Preserve stable component IDs.
- Avoid unnecessary full-document copies.
- Support keyboard shortcuts.
- Prevent invalid document states.

## 4.6 Reusable Components

Allow developers to save selected component groups as reusable components.

A reusable component must support:

- Name.
- Description.
- Properties.
- Default values.
- Preview.
- Source generation.
- Dependency metadata.
- Version information.

## 4.7 Screen Import and Export

Support:

- Export screen schema.
- Import screen schema.
- Duplicate screens.
- Export generated source files.
- Import compatible Nativra screen documents.

Do not promise arbitrary TSX-to-visual round-trip conversion.

Imported code must be explicitly supported by the parser or treated as external source.

---

# 5. CODE GENERATION ENGINE

The generator is a critical part of Nativra.

## 5.1 Requirements

Generated code must be:

- Valid TypeScript.
- Properly formatted.
- Readable.
- Predictable.
- Reproducible.
- Compatible with selected styling systems.
- Compatible with target framework versions.
- Free of unnecessary dependencies.

## 5.2 Supported Outputs

Generate:

- Individual components.
- Complete screens.
- Navigation structures.
- Header configurations.
- Sidebar configurations.
- Theme files.
- Hooks.
- Utility functions.
- Blocks.
- Templates.

## 5.3 Styling Modes

Support:

**NativeWind**

Generate appropriate className-based styling and required configuration guidance.

**StyleSheet**

Generate React Native StyleSheet definitions.

Do not generate web-only CSS.

## 5.4 Code Preview

Before exporting, developers must be able to:

- Inspect generated files.
- Navigate between files.
- Copy code.
- Download source files.
- Review dependencies.
- See installation instructions.
- Identify platform-specific code.

## 5.5 Deterministic Generation

The same validated input and generator version must produce equivalent output.

Avoid random filenames, unstable property ordering, and inconsistent formatting.

---

# 6. ADVANCED COMPONENT UPDATE SYSTEM

Improve the existing three-way merge architecture.

## 6.1 Three-Way Comparison

Compare:

- Base: Original installed component.
- Local: Developer's customized component.
- Remote: New registry version.

Identify:

- Added lines.
- Removed lines.
- Modified lines.
- Renamed files.
- Deleted files.
- Dependency changes.
- Configuration changes.

## 6.2 Update Workflow

1. Detect installed components.
2. Check registry versions.
3. Retrieve the updated source.
4. Compare Base, Local, and Remote.
5. Generate a change report.
6. Display a diff preview.
7. Identify potential conflicts.
8. Allow selective changes.
9. Apply approved changes.
10. Run validation.
11. Preserve rollback information.

## 6.3 Safety Rules

- Never silently overwrite local modifications.
- Never automatically remove unknown files.
- Never execute untrusted registry scripts.
- Never apply destructive updates without approval.
- Preserve original files until successful validation.
- Provide recovery instructions when an update fails.

## 6.4 Update History

Maintain:

- Component ID.
- Previous version.
- New version.
- Updated files.
- User-approved changes.
- Conflicts.
- Update timestamp.
- Validation result.

---

# 7. AI INTEGRATION ARCHITECTURE

AI must be optional.

Nativra must remain fully usable without AI services.

## 7.1 AI Features

Support future AI-assisted workflows:

- Generate components from natural-language prompts.
- Generate screens from descriptions.
- Convert screenshots into editable screen definitions.
- Suggest component properties.
- Explain component implementations.
- Suggest accessibility improvements.
- Identify layout problems.
- Generate navigation configurations.
- Recommend existing registry components.

## 7.2 Provider Architecture

Design a provider-independent interface.

Potential integrations:

- OpenAI.
- Google Gemini.
- Anthropic.
- Local model providers.
- OpenAI-compatible endpoints.

Provider-specific code must not be tightly coupled to the Screen Builder or Component Generator.

## 7.3 AI Safety

AI-generated code must be treated as untrusted until validated.

Requirements:

- Validate generated schemas.
- Inspect dependencies.
- Reject invalid file paths.
- Prevent path traversal.
- Do not execute generated scripts automatically.
- Require approval for destructive operations.
- Provide generated-code previews.

## 7.4 AI Context Export

Provide structured context for external coding agents.

Include:

- Project framework.
- Installed dependencies.
- Nativra component metadata.
- Theme configuration.
- Relevant registry definitions.
- Screen schema.
- Navigation schema.
- Generator conventions.

Allow developers to copy or export this context.

---

# 8. ACCESSIBILITY INSPECTOR

Add an accessibility inspection system to Nativra Studio.

## 8.1 Inspection Rules

Check:

- Missing accessibility labels.
- Missing roles.
- Incorrect accessibility states.
- Insufficient touch target sizes.
- Potential color contrast problems.
- Missing image descriptions.
- Incorrect component semantics.
- Potential keyboard and focus issues where applicable.

## 8.2 Inspection Results

Every issue must include:

- Severity.
- Component reference.
- Problem description.
- Suggested correction.
- Relevant documentation.

Do not claim that automated checks guarantee complete accessibility compliance.

---

# 9. COMPONENT PLAYGROUND

Create a dedicated environment for testing components.

## 9.1 Features

- Live component preview.
- Interactive property editing.
- Theme switching.
- Light and dark modes.
- Platform selection.
- Property presets.
- Code inspection.
- Dependency inspection.
- Copy generated code.
- Shareable configurations.

## 9.2 Component States

Where applicable, preview:

- Default.
- Pressed.
- Disabled.
- Loading.
- Focused.
- Selected.
- Error.
- Empty.

The playground must use the same component source and metadata as the registry.

---

# 10. DEVELOPER TOOLING

Expand Nativra Studio with additional developer utilities.

## 10.1 Dependency Analyzer

Display:

- Installed dependencies.
- Required dependencies.
- Optional dependencies.
- Version conflicts.
- Missing dependencies.
- Unused Nativra components.

## 10.2 Design Token Inspector

Allow developers to inspect:

- Theme tokens.
- Token references.
- Component-specific tokens.
- Light and dark values.
- Unused tokens.
- Generated theme files.

## 10.3 Component Search

Support searching by:

- Component name.
- Category.
- Tags.
- Description.
- Properties.
- Dependencies.
- Styling system.
- Platform support.

## 10.4 Project Diagnostics

Add a diagnostic tool that checks:

- Nativra configuration.
- Framework compatibility.
- Missing dependencies.
- Invalid registry references.
- Generator configuration.
- Theme configuration.
- Potential installation problems.

Diagnostics must explain how to resolve detected problems.

---

# 11. REGISTRY OPERATIONS AND ECOSYSTEM

The registry must support long-term growth.

## 11.1 Registry Management

Implement:

- Component publishing.
- Component versioning.
- Component updates.
- Deprecation.
- Removal policies.
- Registry validation.
- Metadata validation.
- Dependency validation.
- Release approval.

## 11.2 Contribution Workflow

Allow contributors to:

1. Create a component.
2. Validate its metadata.
3. Run automated tests.
4. Generate previews.
5. Submit a contribution.
6. Receive review feedback.
7. Publish an approved version.

## 11.3 Registry Security

- Validate all uploaded files.
- Restrict file paths.
- Reject unsafe executable content.
- Validate package metadata.
- Scan dependencies.
- Preserve license information.
- Maintain publishing history.

## 11.4 Versioning

Use semantic versioning where appropriate.

Define policies for:

- Patch releases.
- Minor releases.
- Major releases.
- Deprecations.
- Breaking changes.
- Compatibility requirements.

---

# 12. TESTING AND QUALITY ASSURANCE

V3 must introduce a formal testing strategy.

## 12.1 Unit Testing

Test:

- Schemas.
- Registry validation.
- Dependency resolution.
- Theme engine.
- Component metadata.
- Generator functions.
- Diff engine.
- Update engine.
- CLI utilities.

## 12.2 Integration Testing

Test:

- CLI installation.
- Registry retrieval.
- Component generation.
- Screen generation.
- Navigation generation.
- Theme generation.
- Dependency installation.
- Component updates.

## 12.3 Visual Testing

Test:

- Component previews.
- Theme variations.
- Responsive layouts.
- Screen Builder rendering.
- Component states.
- Platform differences.

## 12.4 End-to-End Testing

Test complete developer workflows:

1. Create a React Native project.
2. Initialize Nativra.
3. Search for a component.
4. Install a component.
5. Customize the component.
6. Generate a screen.
7. Generate navigation.
8. Apply a theme.
9. Update an installed component.
10. Verify the application.

## 12.5 Native Verification

Use real Android and iOS build environments.

React Native Web may supplement testing but cannot replace native verification.

Test supported Expo and bare React Native configurations.

---

# 13. SECURITY AND PRIVACY

Establish security requirements across the complete product.

## 13.1 Studio Security

- Sanitize user-provided input.
- Validate uploaded files.
- Restrict file operations.
- Prevent path traversal.
- Protect authentication sessions.
- Apply appropriate authorization.
- Avoid exposing API keys.
- Use secure communication.

## 13.2 Registry Security

- Validate component sources.
- Validate metadata.
- Inspect dependencies.
- Prevent malicious file paths.
- Maintain release history.
- Support vulnerability reporting.

## 13.3 Privacy

- AI must be optional.
- Do not transmit project source code without explicit user authorization.
- Do not require telemetry.
- Provide clear analytics controls.
- Never store provider API keys in publicly accessible frontend code.

---

# 14. PRODUCT OPERATIONS

Define operational requirements for a production release.

## 14.1 CI/CD

Automate:

- Type checking.
- Linting.
- Unit testing.
- Integration testing.
- Build verification.
- Registry validation.
- Package publishing.
- Documentation deployment.

## 14.2 Release Management

Define:

- Release channels.
- Version numbering.
- Changelog format.
- Release approval.
- Rollback procedure.
- Deprecation announcements.
- Compatibility announcements.

## 14.3 Documentation

Every public feature must have documentation.

Documentation must include:

- Overview.
- Installation.
- Configuration.
- Usage examples.
- API reference.
- Compatibility information.
- Common errors.
- Troubleshooting.
- Migration guides.

## 14.4 Error Reporting

Errors must be:

- Understandable.
- Actionable.
- Reproducible where possible.
- Properly categorized.
- Logged without exposing sensitive information.

---

# 15. UPDATED IMPLEMENTATION PRIORITIES

Do not attempt to implement all V3 features simultaneously.

Use the following implementation sequence.

## Phase 1 — Technical Foundation

- Define centralized schemas.
- Define registry contracts.
- Define generator contracts.
- Define theme contracts.
- Define screen document contracts.
- Define navigation contracts.
- Establish compatibility policy.

**Completion condition:** All major packages use consistent, validated contracts.

## Phase 2 — Core Reliability

- Improve registry validation.
- Improve dependency resolution.
- Improve CLI diagnostics.
- Improve generator determinism.
- Improve update safety.
- Add rollback support.

**Completion condition:** Core workflows are predictable and tested.

## Phase 3 — Screen Builder Improvements

- Implement undo and redo.
- Implement component hierarchy.
- Implement multi-selection.
- Implement alignment guides.
- Implement reusable sections.
- Implement responsive preview.
- Implement schema import and export.

**Completion condition:** Developers can reliably build and modify screens visually.

## Phase 4 — Code Generation Improvements

- Standardize generator interfaces.
- Implement code previews.
- Improve generated TypeScript.
- Implement dependency inspection.
- Add generation validation.
- Add deterministic output tests.

**Completion condition:** Generated code is reproducible and usable in supported React Native projects.

## Phase 5 — Component Update Improvements

- Implement Base/Local/Remote comparison.
- Implement conflict detection.
- Implement selective updates.
- Implement update history.
- Implement rollback.
- Add automated update tests.

**Completion condition:** Updates preserve developer customization and never silently overwrite local work.

## Phase 6 — Developer Experience

- Component Playground.
- Accessibility Inspector.
- Dependency Analyzer.
- Design Token Inspector.
- Improved Project Diagnostics.

**Completion condition:** Developers can inspect and troubleshoot their projects through Nativra Studio.

## Phase 7 — AI Integration

- Create provider abstraction.
- Implement AI configuration.
- Implement prompt-based component generation.
- Implement prompt-based screen generation.
- Implement structured context export.
- Implement generated-code validation.

**Completion condition:** AI features work without becoming mandatory dependencies.

## Phase 8 — Registry Ecosystem

- Component publishing.
- Registry contribution workflow.
- Version management.
- Deprecation policies.
- Release validation.
- Security checks.

**Completion condition:** The registry can safely support external contributions.

## Phase 9 — Production Readiness

- Complete native testing.
- Complete security review.
- Complete documentation.
- Complete CI/CD.
- Complete release process.
- Validate acceptance criteria.

**Completion condition:** Nativra meets its production release requirements.

---

# 16. ARCHITECTURAL RULES FOR AI CODING AGENTS

These rules are mandatory when implementing Nativra.

## 16.1 Preserve Existing Architecture

Before changing anything:

1. Inspect the existing repository.
2. Read the V1 and V2 master blueprints.
3. Inspect existing packages.
4. Identify completed functionality.
5. Identify incomplete functionality.
6. Identify architectural conflicts.
7. Propose changes before major refactoring.

Do not rebuild existing systems simply because a different implementation is preferred.

## 16.2 Implement Incrementally

- Work on one implementation phase at a time.
- Complete the required tests.
- Validate integration with existing packages.
- Update documentation.
- Record implementation status.
- Continue only when the current phase is stable.

## 16.3 Avoid Fake Implementations

Never:

- Use placeholder functionality while claiming completion.
- Generate hardcoded preview data as if it were real functionality.
- Claim native compatibility without native testing.
- Claim an update is safe without validating conflicts.
- Claim a schema is complete without validation.
- Ignore existing architectural constraints.

## 16.4 Maintain Consistency

All packages must follow shared:

- TypeScript conventions.
- Naming conventions.
- Error handling.
- Schema definitions.
- Dependency policies.
- Logging conventions.
- Formatting rules.
- Testing requirements.

## 16.5 Document Decisions

For significant architecture decisions, create Architecture Decision Records (ADRs).

Each ADR should contain:

- Decision title.
- Context.
- Problem.
- Proposed solution.
- Alternatives.
- Consequences.
- Status.

## 16.6 Report Progress Honestly

For every implementation phase, report:

- Completed tasks.
- Incomplete tasks.
- Modified files.
- New files.
- Tests executed.
- Test results.
- Known issues.
- Remaining work.

Never report a feature as complete when only its interface or visual mockup exists.

---

# 17. FINAL V3 ACCEPTANCE CRITERIA

Nativra V3 is ready for production evaluation when:

- [ ] All V1 features remain available.
- [ ] All V2 features remain available.
- [ ] Centralized schemas are implemented.
- [ ] Registry metadata is validated.
- [ ] Component contracts are standardized.
- [ ] Generator contracts are standardized.
- [ ] Compatibility validation works.
- [ ] Screen Builder supports reliable editing.
- [ ] Undo and redo work correctly.
- [ ] Reusable components work.
- [ ] Code generation is deterministic.
- [ ] Generated code passes validation.
- [ ] Component updates preserve local changes.
- [ ] Update conflicts are visible.
- [ ] Rollback is available.
- [ ] AI integration is optional.
- [ ] AI-generated output is validated.
- [ ] Accessibility inspection works.
- [ ] Component Playground works.
- [ ] Developer diagnostics work.
- [ ] Registry publishing is validated.
- [ ] Security checks are implemented.
- [ ] CI/CD pipelines work.
- [ ] Documentation covers public functionality.
- [ ] Android builds are verified.
- [ ] iOS builds are verified.
- [ ] End-to-end workflows pass.

---

# 18. FINAL PRODUCT DEFINITION

Nativra is a source-first React Native development platform combining a component library, registry, CLI, visual Studio, screen builder, navigation generator, theme engine, code generator, and developer utilities.

It gives developers visual tools without taking ownership of their source code.

Developers can discover components, customize them visually, compose complete screens, generate native React Native code, install source files into their projects, and safely maintain those files over time.

AI enhances the experience but is never required.

**Nativra's ultimate goal is to make React Native development faster, more visual, more consistent, and more accessible while preserving complete developer control over the resulting code.**

**Nativra V1 + V2 + V3 = Unified Nativra Master Product Specification.**