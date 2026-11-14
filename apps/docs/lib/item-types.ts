import type { RegistryItemType } from "@nativra/registry-schema";

/** Display + routing metadata for each registry item type. Safe to import from client components. */
export interface ItemTypeMeta {
  label: string;
  plural: string;
  /** URL segment under /docs */
  segment: string;
  blurb: string;
}

export const ITEM_TYPE_ORDER: RegistryItemType[] = ["component", "block", "template", "hook", "utility", "theme"];

export const TYPE_META: Record<RegistryItemType, ItemTypeMeta> = {
  component: {
    label: "Component",
    plural: "Components",
    segment: "components",
    blurb: "Accessible primitives — buttons, inputs, sheets, tabs — each with NativeWind and StyleSheet sources.",
  },
  block: {
    label: "Block",
    plural: "Blocks",
    segment: "blocks",
    blurb: "Composed sections such as login forms, settings lists and metric cards, built from the primitives.",
  },
  template: {
    label: "Template",
    plural: "Templates",
    segment: "templates",
    blurb: "Full screen flows — auth, onboarding, chat, commerce — ready to drop into a navigator.",
  },
  hook: {
    label: "Hook",
    plural: "Hooks",
    segment: "hooks",
    blurb: "Behavior helpers for haptics, keyboard, reduced motion, screen readers and disclosure state.",
  },
  utility: {
    label: "Utility",
    plural: "Utilities",
    segment: "utilities",
    blurb: "Small shared helpers used by the components, such as cn() for class merging.",
  },
  theme: {
    label: "Theme",
    plural: "Themes",
    segment: "themes",
    blurb: "Semantic token sets with light and dark palettes, installable as source or CSS variables.",
  },
};

export function itemHref(type: RegistryItemType, id: string): string {
  return `/docs/${TYPE_META[type].segment}/${id}`;
}

export function catalogHref(type: RegistryItemType): string {
  return `/docs/${TYPE_META[type].segment}`;
}
