/**
 * Nativra theme — Zinc (Default). Edit freely; you own this file.
 * Generated from @nativra/theme-engine by scripts/generate-themes.mjs — do not edit in the registry.
 */
export const zinc = {
  background: "#ffffff",
  foreground: "#09090b",
  card: "#ffffff",
  "card-foreground": "#09090b",
  popover: "#ffffff",
  "popover-foreground": "#09090b",
  primary: "#18181b",
  "primary-foreground": "#fafafa",
  secondary: "#f4f4f5",
  "secondary-foreground": "#18181b",
  muted: "#f4f4f5",
  "muted-foreground": "#71717a",
  accent: "#f4f4f5",
  "accent-foreground": "#18181b",
  destructive: "#ef4444",
  "destructive-foreground": "#fafafa",
  border: "#e4e4e7",
  input: "#e4e4e7",
  ring: "#18181b",
} as const;

export const zincDark = {
  background: "#09090b",
  foreground: "#fafafa",
  card: "#09090b",
  "card-foreground": "#fafafa",
  popover: "#09090b",
  "popover-foreground": "#fafafa",
  primary: "#fafafa",
  "primary-foreground": "#18181b",
  secondary: "#27272a",
  "secondary-foreground": "#fafafa",
  muted: "#27272a",
  "muted-foreground": "#a1a1aa",
  accent: "#27272a",
  "accent-foreground": "#fafafa",
  destructive: "#7f1d1d",
  "destructive-foreground": "#fafafa",
  border: "#27272a",
  input: "#27272a",
  ring: "#d4d4d8",
} as const;

export type ZincTheme = typeof zinc;

/**
 * The active palette pair. Components read this through the use-theme-colors hook, so
 * installing a different theme over this file restyles every component.
 */
export const themeColors = { light: zinc, dark: zincDark } as const;
