/**
 * Nativra theme — Violet. Edit freely; you own this file.
 * Generated from @nativra/theme-engine by scripts/generate-themes.mjs — do not edit in the registry.
 */
export const violet = {
  success: "#15803d",
  "success-foreground": "#ffffff",
  warning: "#b45309",
  "warning-foreground": "#ffffff",
  info: "#0369a1",
  "info-foreground": "#ffffff",
  background: "#ffffff",
  foreground: "#2e1065",
  card: "#ffffff",
  "card-foreground": "#2e1065",
  popover: "#ffffff",
  "popover-foreground": "#2e1065",
  primary: "#7c3aed",
  "primary-foreground": "#ffffff",
  secondary: "#f5f3ff",
  "secondary-foreground": "#5b21b6",
  muted: "#f5f3ff",
  "muted-foreground": "#6d28d9",
  accent: "#ede9fe",
  "accent-foreground": "#5b21b6",
  destructive: "#ef4444",
  "destructive-foreground": "#ffffff",
  border: "#ddd6fe",
  input: "#ddd6fe",
  ring: "#7c3aed",
} as const;

export const violetDark = {
  success: "#4ade80",
  "success-foreground": "#052e16",
  warning: "#fbbf24",
  "warning-foreground": "#451a03",
  info: "#38bdf8",
  "info-foreground": "#082f49",
  background: "#0f0728",
  foreground: "#f5f3ff",
  card: "#1e103a",
  "card-foreground": "#f5f3ff",
  popover: "#1e103a",
  "popover-foreground": "#f5f3ff",
  primary: "#8b5cf6",
  "primary-foreground": "#0f0728",
  secondary: "#2e1065",
  "secondary-foreground": "#f5f3ff",
  muted: "#2e1065",
  "muted-foreground": "#c4b5fd",
  accent: "#3b0764",
  "accent-foreground": "#f5f3ff",
  destructive: "#f87171",
  "destructive-foreground": "#450a0a",
  border: "#3b0764",
  input: "#3b0764",
  ring: "#8b5cf6",
} as const;

export type VioletTheme = typeof violet;

/**
 * The active palette pair. Components read this through the use-theme-colors hook, so
 * installing a different theme over this file restyles every component. Shape, type and
 * density live separately in style.ts (npx nativra-cli style add <id>).
 */
export const themeColors = { light: violet, dark: violetDark } as const;
