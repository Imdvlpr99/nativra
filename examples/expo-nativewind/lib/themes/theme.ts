/**
 * Nativra theme — Zinc (Default). Edit freely; you own this file.
 * Generated from @nativra/theme-engine by scripts/generate-themes.mjs — do not edit in the registry.
 */
export const zinc = {
  success: "#15803d",
  "success-foreground": "#ffffff",
  warning: "#b45309",
  "warning-foreground": "#ffffff",
  info: "#0369a1",
  "info-foreground": "#ffffff",
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
  success: "#4ade80",
  "success-foreground": "#052e16",
  warning: "#fbbf24",
  "warning-foreground": "#451a03",
  info: "#38bdf8",
  "info-foreground": "#082f49",
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
  destructive: "#f87171",
  "destructive-foreground": "#450a0a",
  border: "#27272a",
  input: "#27272a",
  ring: "#d4d4d8",
} as const;

export type ZincTheme = typeof zinc;

/**
 * The active palette pair. Components read this through the use-theme-colors hook, so
 * installing a different theme over this file restyles every component. Shape, type and
 * density live separately in style.ts (npx nativra-cli style add <id>).
 */
export const themeColors = { light: zinc, dark: zincDark } as const;
