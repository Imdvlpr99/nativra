import type { ItemType } from "./data";

export interface ItemTypeMeta {
  label: string;
  plural: string;
  /** URL segment under /docs, also the folder name under registry/default */
  segment: string;
  blurb: string;
  /** Default install folder, matching nativra.json defaults (blocks fall back to componentsDir) */
  dir: string;
}

export const ITEM_TYPE_ORDER: ItemType[] = ["component", "block", "template", "hook", "utility", "theme"];

export const TYPE_META: Record<ItemType, ItemTypeMeta> = {
  component: {
    label: "Component",
    plural: "Components",
    segment: "components",
    dir: "components/ui",
    blurb: "Accessible primitives such as buttons, inputs, sheets and tabs, each with NativeWind and StyleSheet sources.",
  },
  block: {
    label: "Block",
    plural: "Blocks",
    segment: "blocks",
    dir: "components/ui",
    blurb: "Composed sections such as login forms, settings lists and metric cards, built from the primitives.",
  },
  template: {
    label: "Template",
    plural: "Templates",
    segment: "templates",
    dir: "components/ui",
    blurb: "Full screen flows such as auth, onboarding, chat and commerce, ready to drop into a navigator.",
  },
  hook: {
    label: "Hook",
    plural: "Hooks",
    segment: "hooks",
    dir: "hooks",
    blurb: "Behaviour helpers for theme colors, haptics, the keyboard, reduced motion, screen readers and disclosure state.",
  },
  utility: {
    label: "Utility",
    plural: "Utilities",
    segment: "utilities",
    dir: "lib/utils",
    blurb: "Small shared helpers used by the components, such as cn() for class merging.",
  },
  theme: {
    label: "Theme",
    plural: "Themes",
    segment: "themes",
    dir: "lib/themes",
    blurb: "Semantic color tokens with light and dark palettes, installed as source and as CSS variables.",
  },
};

export function itemHref(type: ItemType, id: string): string {
  return `/docs/${TYPE_META[type].segment}/${id}`;
}

export function catalogHref(type: ItemType): string {
  return `/docs/${TYPE_META[type].segment}`;
}

export function typeFromSegment(segment: string): ItemType | undefined {
  return ITEM_TYPE_ORDER.find((t) => TYPE_META[t].segment === segment);
}

/** The command that installs an item. Themes have their own subcommand. */
export function installCommand(type: ItemType, id: string): string {
  return type === "theme" ? `npx nativra-cli theme add ${id}` : `npx nativra-cli add ${id}`;
}
