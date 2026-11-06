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

