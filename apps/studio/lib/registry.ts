import { readFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { RegistryItemSchema, RegistryManifestSchema } from "@nativra/registry-schema";
import type { RegistryItem, RegistryManifest } from "@nativra/registry-schema";
import {
  DISABLED_CONTROL,
  LOADING_CONTROL,
  SIZE_CONTROL,
  VARIANT_CONTROL,
  type Control,
  type SelectControl,
} from "@nativra/studio-schema";

const BUILT_REGISTRY = resolve(process.cwd(), "../../dist/registry");

export async function getManifest(): Promise<RegistryManifest> {
  const raw = await readFile(join(BUILT_REGISTRY, "registry.json"), "utf8");
  return RegistryManifestSchema.parse(JSON.parse(raw));
}

export async function getItem(id: string): Promise<RegistryItem> {
  const raw = await readFile(join(BUILT_REGISTRY, "items", `${id}.json`), "utf8");
  return RegistryItemSchema.parse(JSON.parse(raw));
}

const BADGE_VARIANT: SelectControl = {
  ...VARIANT_CONTROL,
  options: VARIANT_CONTROL.options.filter((o) => ["default", "primary", "secondary", "destructive", "outline"].includes(o.value)),
};

/** Editable controls are explicit per item — Studio never infers props from TSX. */
export const STUDIO_CONTROLS: Record<string, Control[]> = {
  button: [VARIANT_CONTROL, SIZE_CONTROL, DISABLED_CONTROL, LOADING_CONTROL, { type: "text", label: "Label", propKey: "children", defaultValue: "Button" }],
  badge: [
    BADGE_VARIANT,
    { ...SIZE_CONTROL, options: SIZE_CONTROL.options.filter((o) => ["sm", "md", "lg"].includes(o.value)) },
    { type: "text", label: "Label", propKey: "label", defaultValue: "Badge" },
  ],
  input: [
    { type: "text", label: "Label", propKey: "label", defaultValue: "Email" },
    { type: "text", label: "Placeholder", propKey: "placeholder", defaultValue: "you@example.com" },
    { type: "boolean", label: "Error", propKey: "error", defaultValue: false },
    { type: "text", label: "Error message", propKey: "errorMessage", defaultValue: "Invalid email" },
    DISABLED_CONTROL,
  ],
  card: [
    { type: "boolean", label: "Elevated", propKey: "elevated", defaultValue: false },
    {
      type: "select", label: "Padding", propKey: "padding", defaultValue: "md",
      options: [{ label: "SM", value: "sm" }, { label: "MD", value: "md" }, { label: "LG", value: "lg" }],
    },
  ],
  separator: [
    {
      type: "select", label: "Orientation", propKey: "orientation", defaultValue: "horizontal",
      options: [{ label: "Horizontal", value: "horizontal" }, { label: "Vertical", value: "vertical" }],
    },
  ],
  text: [
    {
      type: "select", label: "Variant", propKey: "variant", defaultValue: "p",
      options: [
        { label: "H1", value: "h1" },
        { label: "H2", value: "h2" },
        { label: "H3", value: "h3" },
        { label: "Paragraph", value: "p" },
        { label: "Lead", value: "lead" },
        { label: "Muted", value: "muted" },
        { label: "Code", value: "code" },
      ],
    },
    { type: "text", label: "Text", propKey: "children", defaultValue: "The quick brown fox jumps over the lazy dog." },
  ],
  label: [
    { type: "text", label: "Label", propKey: "children", defaultValue: "Email address" },
    { type: "boolean", label: "Required", propKey: "required", defaultValue: true },
    DISABLED_CONTROL,
  ],
  checkbox: [
    { type: "boolean", label: "Checked", propKey: "checked", defaultValue: true },
    { type: "text", label: "Label", propKey: "label", defaultValue: "I agree to the Terms of Service" },
    DISABLED_CONTROL,
  ],
  switch: [
    { type: "boolean", label: "Value", propKey: "value", defaultValue: true },
    DISABLED_CONTROL,
  ],
  skeleton: [
    {
      type: "select", label: "Radius", propKey: "radius", defaultValue: "md",
      options: [
        { label: "None", value: "none" },
        { label: "SM", value: "sm" },
        { label: "MD", value: "md" },
        { label: "LG", value: "lg" },
        { label: "Full", value: "full" },
      ],
    },
    { type: "text", label: "Width", propKey: "width", defaultValue: "180" },
    { type: "text", label: "Height", propKey: "height", defaultValue: "24" },
  ],
  spinner: [
    {
      type: "select", label: "Size", propKey: "size", defaultValue: "md",
      options: [
        { label: "SM", value: "sm" },
        { label: "MD", value: "md" },
        { label: "LG", value: "lg" },
      ],
    },
  ],
  avatar: [
    { type: "text", label: "Fallback", propKey: "fallback", defaultValue: "NV" },
    {
      type: "select", label: "Size", propKey: "size", defaultValue: "md",
      options: [
        { label: "SM", value: "sm" },
        { label: "MD", value: "md" },
        { label: "LG", value: "lg" },
        { label: "XL", value: "xl" },
      ],
    },
  ],
  "empty-state": [
    { type: "text", label: "Title", propKey: "title", defaultValue: "No Projects Found" },
    { type: "text", label: "Description", propKey: "description", defaultValue: "You have not created any mobile projects yet. Tap below to begin." },
    { type: "text", label: "Action Label", propKey: "actionLabel", defaultValue: "Create Project" },
    { type: "boolean", label: "Show Action", propKey: "showAction", defaultValue: true },
  ],
  "login-form": [
    { type: "text", label: "Title", propKey: "title", defaultValue: "Welcome back" },
    { type: "text", label: "Subtitle", propKey: "subtitle", defaultValue: "Enter your credentials to access your account" },
    { type: "text", label: "Button Label", propKey: "submitLabel", defaultValue: "Sign In" },
    LOADING_CONTROL,
    DISABLED_CONTROL,
  ],
  "use-disclosure": [
    { type: "boolean", label: "Open by Default", propKey: "defaultIsOpen", defaultValue: false },
    { type: "text", label: "Trigger Text", propKey: "triggerLabel", defaultValue: "Open Sheet" },
    { type: "text", label: "Sheet Title", propKey: "sheetTitle", defaultValue: "Interactive Sheet" },
  ],
};
