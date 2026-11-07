import { z } from "zod";

// ---------------------------------------------------------------------------
// Primitive enums & constants
// ---------------------------------------------------------------------------

export const StylingTargetSchema = z.enum(["nativewind", "stylesheet"]);
export type StylingTarget = z.infer<typeof StylingTargetSchema>;

export const PlatformSchema = z.enum(["android", "ios", "web"]);
export type Platform = z.infer<typeof PlatformSchema>;

export const RegistryItemTypeSchema = z.enum([
  "component",
  "hook",
  "utility",
  "block",
  "template",
  "theme",
]);
export type RegistryItemType = z.infer<typeof RegistryItemTypeSchema>;

export const ItemStatusSchema = z.enum(["stable", "beta", "experimental", "deprecated"]);
export type ItemStatus = z.infer<typeof ItemStatusSchema>;

// ---------------------------------------------------------------------------
// Accessibility metadata contract (V4 §3 & §15)
// ---------------------------------------------------------------------------

export const AccessibilityMetadataSchema = z.object({
  /** Whether accessibility props or screen-reader labels are mandatory */
  required: z.boolean().default(false),
  /** Standard accessibility role, e.g. "button", "header", "checkbox" */
  role: z.string().optional(),
  /** Whether component implements accessibilityLabel prop */
  supportsAccessibilityLabel: z.boolean().default(true),
  /** Whether component implements accessibilityHint prop */
  supportsAccessibilityHint: z.boolean().optional(),
  /** Recommended touch target size in dp (e.g. 44 or 48) */
  minTouchTarget: z.number().optional(),
  /** Additional guidance or screen reader notes */
  notes: z.string().optional(),
});
export type AccessibilityMetadata = z.infer<typeof AccessibilityMetadataSchema>;

// ---------------------------------------------------------------------------
// Testing metadata contract (V4 §3 & §15)
// ---------------------------------------------------------------------------

export const TestingMetadataSchema = z.object({
  hasUnitTests: z.boolean().default(false),
  hasE2eTests: z.boolean().default(false),
  testedFrameworks: z.array(z.string()).optional(),
  notes: z.string().optional(),
});
export type TestingMetadata = z.infer<typeof TestingMetadataSchema>;

// ---------------------------------------------------------------------------
// Dependency schemas
// ---------------------------------------------------------------------------

export const NpmDependencySchema = z.object({
  /** npm package name */
  package: z.string().min(1),
  /** semver range, e.g. "^1.2.3" */
  version: z.string().min(1),
  /** whether it's a peer dependency */
  peer: z.boolean().optional(),
});
export type NpmDependency = z.infer<typeof NpmDependencySchema>;

export const RegistryDependencySchema = z.object({
  /** Registry item id, e.g. "button" */
  id: z.string().min(1),
  /** Registry name, defaults to "default" */
  registry: z.string().default("default"),
});
export type RegistryDependency = z.infer<typeof RegistryDependencySchema>;

// ---------------------------------------------------------------------------
// Source file schema
// ---------------------------------------------------------------------------

export const SourceFileSchema = z.object({
  /** Relative path within the installed location, e.g. "components/ui/Button.tsx" */
  path: z.string().min(1),
  /** Styling target this file is for */
  target: StylingTargetSchema.optional(),
  /** Raw source content (populated during build) */
  content: z.string().optional(),
  /** SHA-256 hash of content for integrity checks */
  hash: z.string().optional(),
});
export type SourceFile = z.infer<typeof SourceFileSchema>;

// ---------------------------------------------------------------------------
// Platform compatibility matrix
// ---------------------------------------------------------------------------

export const PlatformCompatibilitySchema = z.object({
  android: z.boolean().default(true),
  ios: z.boolean().default(true),
  web: z.boolean().optional(),
  expoGo: z.boolean().optional(),
  /** Minimum Expo SDK version required */
  minExpoSdk: z.number().int().positive().optional(),
  /** Minimum React Native version required */
  minReactNative: z.string().optional(),
  notes: z.string().optional(),
});
export type PlatformCompatibility = z.infer<typeof PlatformCompatibilitySchema>;

// ---------------------------------------------------------------------------
// Registry item (the core unified entity - V4 §3)
// ---------------------------------------------------------------------------

export const RegistryItemSchema = z.object({
  /** Optional JSON schema URI */
  $schema: z.string().optional(),
  /** Unique identifier within the registry, e.g. "button" */
  id: z.string().regex(/^[a-z][a-z0-9-]*$/, {
    message: "ID must be lowercase letters, numbers and hyphens, starting with a letter",
  }),
  /** Display name (e.g. "Button") */
  name: z.string().min(1),
  /** Optional full title */
  title: z.string().optional(),
  /** Short description shown in catalogs */
  description: z.string().min(1),
  type: RegistryItemTypeSchema,
  /** High-level category, e.g. "actions", "layout", "forms", "feedback" */
  category: z.string().optional(),
  status: ItemStatusSchema.default("stable"),
  /** Semver version for this item */
  version: z.string().regex(/^\d+\.\d+\.\d+/, {
    message: "Must be a valid semver string",
  }),
  /** Supported styling targets */
  stylingTargets: z.array(StylingTargetSchema).min(1),
  /** Platform compatibility details */
  platforms: PlatformCompatibilitySchema,
  /** Source files for each styling target */
  files: z.array(SourceFileSchema).min(1),
  /** Other registry items this item depends on */
  registryDependencies: z.array(RegistryDependencySchema).optional(),
  /** npm packages this item requires */
  npmDependencies: z.array(NpmDependencySchema).optional(),
  /** Peer dependencies (e.g. { "react": "*", "react-native": "*" }) */
  peerDependencies: z.record(z.string(), z.string()).optional(),
  /** Component usage examples IDs */
  examples: z.array(z.string()).optional(),
  /** Accessibility requirements & metadata */
  accessibility: AccessibilityMetadataSchema.optional(),
  /** Testing metadata & status */
  testing: TestingMetadataSchema.optional(),
  /** Tags for search/filter */
  tags: z.array(z.string()).optional(),
  /** Relative path to preview image or gif */
  previewImage: z.string().optional(),
  /** Relative path to documentation MDX file */
  docsPath: z.string().optional(),
  /** Deprecation message, set when status is "deprecated" */
  deprecationMessage: z.string().optional(),
  /** ISO date when this item was added */
  addedAt: z.string().datetime().optional(),
  /** ISO date when this item was last updated */
  updatedAt: z.string().datetime().optional(),
});
export type RegistryItem = z.infer<typeof RegistryItemSchema>;

// ---------------------------------------------------------------------------
// Registry manifest (registry.json at the root)
// ---------------------------------------------------------------------------

export const RegistryManifestSchema = z.object({
  /** Registry name, e.g. "default" or a custom org name */
  name: z.string().min(1),
  /** Semver version of the registry format itself */
  schemaVersion: z.string(),
  /** Base URL where registry assets are served */
  baseUrl: z.string().url().optional(),
  /** All items in this registry */
  items: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      title: z.string().optional(),
      description: z.string(),
      type: RegistryItemTypeSchema,
      category: z.string().optional(),
      status: ItemStatusSchema,
      version: z.string(),
      stylingTargets: z.array(StylingTargetSchema),
      tags: z.array(z.string()).optional(),
    })
  ),
});
export type RegistryManifest = z.infer<typeof RegistryManifestSchema>;

// ---------------------------------------------------------------------------
// Compatibility Matrix Contract (V4 §16)
// ---------------------------------------------------------------------------

export const CompatibilityMatrixSchema = z.object({
  reactNative: z.object({
    min: z.string(),
    tested: z.array(z.string()),
  }),
  expo: z.object({
    minSdk: z.number(),
    testedSdks: z.array(z.number()),
  }),
  react: z.object({
    min: z.string(),
    tested: z.array(z.string()),
  }),
  typescript: z.object({
    min: z.string(),
    tested: z.array(z.string()),
  }),
  nativewind: z.object({
    supportedVersions: z.array(z.string()),
  }),
  reactNavigation: z.object({
    supportedVersions: z.array(z.string()),
  }),
  android: z.object({
    minSdk: z.number(),
    targetSdk: z.number(),
  }),
  ios: z.object({
    minDeploymentTarget: z.string(),
  }),
});
export type CompatibilityMatrix = z.infer<typeof CompatibilityMatrixSchema>;

export const DEFAULT_COMPATIBILITY_MATRIX: CompatibilityMatrix = {
  reactNative: { min: "0.74.0", tested: ["0.74.5", "0.76.0", "0.76.3"] },
  expo: { minSdk: 51, testedSdks: [51, 52] },
  react: { min: "18.2.0", tested: ["18.2.0", "18.3.1", "19.0.0"] },
  typescript: { min: "5.0.0", tested: ["5.3.3", "5.4.5", "5.9.3"] },
  nativewind: { supportedVersions: ["^4.0.1", "^4.1.0"] },
  reactNavigation: { supportedVersions: ["^6.0.0", "^7.0.0"] },
  android: { minSdk: 24, targetSdk: 35 },
  ios: { minDeploymentTarget: "15.1" },
};

export interface ProjectEnvironment {
  reactNative?: string;
  expoSdk?: number;
  react?: string;
  typescript?: string;
  nativewind?: string;
}

export interface CompatibilityCheckResult {
  compatible: boolean;
  warnings: string[];
  errors: string[];
}

/**
 * Validates consumer project dependencies against the versioned compatibility matrix.
 */
export function checkProjectCompatibility(
  env: ProjectEnvironment,
  matrix: CompatibilityMatrix = DEFAULT_COMPATIBILITY_MATRIX
): CompatibilityCheckResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (env.expoSdk !== undefined && env.expoSdk < matrix.expo.minSdk) {
    errors.push(
      `Installed Expo SDK (${env.expoSdk}) is below minimum supported SDK ${matrix.expo.minSdk}.`
    );
  }

  if (env.reactNative) {
    const minRN = matrix.reactNative.min.replace(/^[~^]/, "");
    if (env.reactNative < minRN) {
      warnings.push(
        `React Native version ${env.reactNative} is below tested minimum ${matrix.reactNative.min}.`
      );
    }
  }

  return {
    compatible: errors.length === 0,
    warnings,
    errors,
  };
}

// ---------------------------------------------------------------------------
// V4 Project Configuration Contract (V4 §5)
// ---------------------------------------------------------------------------

export const ProjectAliasesSchema = z.object({
  components: z.string().default("@/components"),
  utils: z.string().default("@/lib/utils"),
  hooks: z.string().optional(),
  themes: z.string().optional(),
});
export type ProjectAliases = z.infer<typeof ProjectAliasesSchema>;

export const ComponentsConfigSchema = z.object({
  directory: z.string().default("src/components/ui"),
  aliases: ProjectAliasesSchema.default({
    components: "@/components",
    utils: "@/lib/utils",
  }),
});
export type ComponentsConfig = z.infer<typeof ComponentsConfigSchema>;

export const NativraConfigV4Schema = z.object({
  $schema: z.string().optional(),
  version: z.number().default(4),
  typescript: z.boolean().default(true),
  framework: z.enum(["expo", "bare"]).default("expo"),
  styling: z.enum(["nativewind", "stylesheet"]).default("nativewind"),
  components: ComponentsConfigSchema.default({
    directory: "src/components/ui",
    aliases: {
      components: "@/components",
      utils: "@/lib/utils",
    },
  }),
  registry: z.record(z.string(), z.string()).default({
    default: "https://registry.nativra.dev",
  }),
  theme: z
    .object({
      default: z.string().default("default"),
    })
    .default({ default: "default" }),

  // Backward compatibility fields for legacy v1-v3 configurations
  registries: z
    .array(
      z.object({
        name: z.string().default("default"),
        url: z.string(),
      })
    )
    .optional(),
  componentsDir: z.string().optional(),
  hooksDir: z.string().optional(),
  utilsDir: z.string().optional(),
  stylingTarget: z.enum(["nativewind", "stylesheet"]).optional(),
  aliasPrefix: z.string().optional(),
});
export type NativraConfigV4 = z.infer<typeof NativraConfigV4Schema>;
