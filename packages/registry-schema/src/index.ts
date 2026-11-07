import { z } from "zod";

// ---------------------------------------------------------------------------
// Primitive enums
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
// Registry item (the core entity)
// ---------------------------------------------------------------------------

export const RegistryItemSchema = z.object({
  /** Unique identifier within the registry, e.g. "button" */
  id: z.string().regex(/^[a-z][a-z0-9-]*$/, {
    message: "ID must be lowercase letters, numbers and hyphens, starting with a letter",
  }),
  /** Display name */
  name: z.string().min(1),
  /** Short description shown in catalogs */
  description: z.string().min(1),
  type: RegistryItemTypeSchema,
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
      description: z.string(),
      type: RegistryItemTypeSchema,
      status: ItemStatusSchema,
      version: z.string(),
      stylingTargets: z.array(StylingTargetSchema),
      tags: z.array(z.string()).optional(),
    })
  ),
});
export type RegistryManifest = z.infer<typeof RegistryManifestSchema>;

// ---------------------------------------------------------------------------
// Compatibility Matrix Contract (Section 3.2 & Section 3.3)
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

