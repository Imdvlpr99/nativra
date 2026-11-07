import { z } from "zod";

/**
 * @nativra/studio-schema
 *
 * Defines the shape of editable props shown in Nativra Studio's property inspector.
 * Studio only edits schema-defined props — it does NOT infer props from TSX.
 */

// ---------------------------------------------------------------------------
// Control descriptors
// ---------------------------------------------------------------------------

/** A select/enum control */
export const SelectControlSchema = z.object({
  type: z.literal("select"),
  label: z.string(),
  propKey: z.string(),
  options: z.array(
    z.object({
      label: z.string(),
      value: z.string(),
    })
  ),
  defaultValue: z.string().optional(),
});
export type SelectControl = z.infer<typeof SelectControlSchema>;

/** A boolean toggle control */
export const BooleanControlSchema = z.object({
  type: z.literal("boolean"),
  label: z.string(),
  propKey: z.string(),
  defaultValue: z.boolean().optional(),
});
export type BooleanControl = z.infer<typeof BooleanControlSchema>;

/** A text input control */
export const TextControlSchema = z.object({
  type: z.literal("text"),
  label: z.string(),
  propKey: z.string(),
  placeholder: z.string().optional(),
  defaultValue: z.string().optional(),
});
export type TextControl = z.infer<typeof TextControlSchema>;

/** A color picker control */
export const ColorControlSchema = z.object({
  type: z.literal("color"),
  label: z.string(),
  /** References a semantic token key, e.g. "primary" */
  tokenKey: z.string(),
  defaultValue: z.string().optional(),
});
export type ColorControl = z.infer<typeof ColorControlSchema>;

/** A number slider control */
export const SliderControlSchema = z.object({
  type: z.literal("slider"),
  label: z.string(),
  propKey: z.string(),
  min: z.number(),
  max: z.number(),
  step: z.number().default(1),
  defaultValue: z.number().optional(),
});
export type SliderControl = z.infer<typeof SliderControlSchema>;

export const ControlSchema = z.discriminatedUnion("type", [
  SelectControlSchema,
  BooleanControlSchema,
  TextControlSchema,
  ColorControlSchema,
  SliderControlSchema,
]);
export type Control = z.infer<typeof ControlSchema>;

// ---------------------------------------------------------------------------
// Studio component definition
// ---------------------------------------------------------------------------

export const StudioComponentDefinitionSchema = z.object({
  /** Registry item id */
  id: z.string(),
  /** Display name */
  name: z.string(),
  /** Short description */
  description: z.string(),
  /** Ordered list of editable controls for this component */
  controls: z.array(ControlSchema),
  /** Default prop values used in preview */
  defaultProps: z.record(z.string(), z.unknown()).optional(),
});
export type StudioComponentDefinition = z.infer<typeof StudioComponentDefinitionSchema>;

// ---------------------------------------------------------------------------
// Built-in control presets
// ---------------------------------------------------------------------------

export const VARIANT_CONTROL: SelectControl = {
  type: "select",
  label: "Variant",
  propKey: "variant",
  options: [
    { label: "Default", value: "default" },
    { label: "Primary", value: "primary" },
    { label: "Secondary", value: "secondary" },
    { label: "Destructive", value: "destructive" },
    { label: "Outline", value: "outline" },
    { label: "Ghost", value: "ghost" },
  ],
  defaultValue: "default",
};

export const SIZE_CONTROL: SelectControl = {
  type: "select",
  label: "Size",
  propKey: "size",
  options: [
    { label: "XS", value: "xs" },
    { label: "SM", value: "sm" },
    { label: "MD (Default)", value: "md" },
    { label: "LG", value: "lg" },
    { label: "XL", value: "xl" },
  ],
  defaultValue: "md",
};

export const DISABLED_CONTROL: BooleanControl = {
  type: "boolean",
  label: "Disabled",
  propKey: "disabled",
  defaultValue: false,
};

export const LOADING_CONTROL: BooleanControl = {
  type: "boolean",
  label: "Loading",
  propKey: "loading",
  defaultValue: false,
};

// ---------------------------------------------------------------------------
// V3 Screen Builder Document Contract (Section 2.4 & Section 4)
// ---------------------------------------------------------------------------

export const ScreenBlockTypeSchema = z.enum([
  "header",
  "search",
  "user-profile",
  "metric-card",
  "pricing-card",
  "settings-list",
  "button-action",
  "divider",
  "custom",
]);
export type ScreenBlockType = z.infer<typeof ScreenBlockTypeSchema>;

export interface ScreenBlockNode {
  id: string;
  type: ScreenBlockType;
  title?: string | undefined;
  subtitle?: string | undefined;
  variant?: string | undefined;
  color?: string | undefined;
  props?: Record<string, unknown> | undefined;
  children?: ScreenBlockNode[] | undefined;
}

export const ScreenBlockNodeSchema: z.ZodType<ScreenBlockNode> = z.lazy(() =>
  z.object({
    id: z.string(),
    type: ScreenBlockTypeSchema,
    title: z.string().optional(),
    subtitle: z.string().optional(),
    variant: z.string().optional(),
    color: z.string().optional(),
    props: z.record(z.string(), z.unknown()).optional(),
    children: z.lazy(() => z.array(ScreenBlockNodeSchema)).optional(),
  })
);

export const CanvasConfigSchema = z.object({
  device: z.enum(["iphone", "android", "compact", "tablet"]).default("iphone"),
  isLandscape: z.boolean().default(false),
  zoom: z.number().default(100),
  target: z.enum(["nativewind", "stylesheet"]).default("nativewind"),
  colorScheme: z.enum(["light", "dark"]).default("light"),
});
export type CanvasConfig = z.infer<typeof CanvasConfigSchema>;

export const ScreenDocumentSchema = z.object({
  schemaVersion: z.literal("3.0.0").default("3.0.0"),
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  canvas: CanvasConfigSchema,
  nodes: z.array(ScreenBlockNodeSchema),
  themeRef: z.string().optional(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});
export type ScreenDocument = z.infer<typeof ScreenDocumentSchema>;

// ---------------------------------------------------------------------------
// V3 Navigation Document Contract (Section 2.5 & Section 13)
// ---------------------------------------------------------------------------

export const NavigationTypeSchema = z.enum(["tabs", "stack", "drawer"]);
export type NavigationType = z.infer<typeof NavigationTypeSchema>;

export const NavigationRouteSchema = z.object({
  id: z.string(),
  name: z.string(),
  title: z.string(),
  icon: z.string(),
  component: z.string(),
  headerShown: z.boolean().default(true),
  badge: z.string().optional(),
  params: z.record(z.string(), z.string()).optional(),
});
export type NavigationRoute = z.infer<typeof NavigationRouteSchema>;

export const NavigationDocumentSchema = z.object({
  schemaVersion: z.literal("3.0.0").default("3.0.0"),
  id: z.string(),
  name: z.string(),
  type: NavigationTypeSchema,
  initialRouteName: z.string(),
  routes: z.array(NavigationRouteSchema).min(1),
  activeTintColor: z.string().default("#3b82f6"),
  inactiveTintColor: z.string().default("#71717a"),
  backgroundColor: z.string().default("#09090b"),
});
export type NavigationDocument = z.infer<typeof NavigationDocumentSchema>;

// ---------------------------------------------------------------------------
// V4 Screen Intermediate Representation (Screen IR) Contract (Master Blueprint §8.1)
// ---------------------------------------------------------------------------

export const ScreenIRLayoutSchema = z.object({
  flexDirection: z.enum(["row", "column"]).optional(),
  alignItems: z.enum(["flex-start", "center", "flex-end", "stretch"]).optional(),
  justifyContent: z.enum(["flex-start", "center", "flex-end", "space-between"]).optional(),
  gap: z.number().optional(),
  padding: z.union([
    z.number(),
    z.object({
      top: z.number().optional(),
      bottom: z.number().optional(),
      left: z.number().optional(),
      right: z.number().optional(),
    }),
  ]).optional(),
  margin: z.union([
    z.number(),
    z.object({
      top: z.number().optional(),
      bottom: z.number().optional(),
      left: z.number().optional(),
      right: z.number().optional(),
    }),
  ]).optional(),
  width: z.union([z.string(), z.number()]).optional(),
  height: z.union([z.string(), z.number()]).optional(),
});
export type ScreenIRLayout = z.infer<typeof ScreenIRLayoutSchema>;

export interface ScreenIRNode {
  id: string;
  type: "primitive" | "component" | "block";
  name: string;
  props?: Record<string, unknown> | undefined;
  layout?: ScreenIRLayout | undefined;
  styleOverrides?: Record<string, unknown> | undefined;
  children?: ScreenIRNode[] | undefined;
}

export const ScreenIRNodeSchema: z.ZodType<ScreenIRNode> = z.lazy(() =>
  z.object({
    id: z.string(),
    type: z.enum(["primitive", "component", "block"]),
    name: z.string(),
    props: z.record(z.string(), z.unknown()).optional(),
    layout: ScreenIRLayoutSchema.optional(),
    styleOverrides: z.record(z.string(), z.unknown()).optional(),
    children: z.lazy(() => z.array(ScreenIRNodeSchema)).optional(),
  })
);

export const ScreenIRDocumentSchema = z.object({
  version: z.literal("1.0.0").default("1.0.0"),
  name: z.string(),
  target: z.enum(["nativewind", "stylesheet"]).default("nativewind"),
  root: ScreenIRNodeSchema,
});
export type ScreenIRDocument = z.infer<typeof ScreenIRDocumentSchema>;



