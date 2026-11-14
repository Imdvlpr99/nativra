/**
 * Nativra theme — Emerald. Edit freely; you own this file.
 * Generated from @nativra/theme-engine by scripts/generate-themes.mjs — do not edit in the registry.
 */
export const emerald = {
  background: "#ffffff",
  foreground: "#064e3b",
  card: "#ffffff",
  "card-foreground": "#064e3b",
  popover: "#ffffff",
  "popover-foreground": "#064e3b",
  primary: "#059669",
  "primary-foreground": "#ffffff",
  secondary: "#ecfdf5",
  "secondary-foreground": "#065f46",
  muted: "#f0fdf4",
  "muted-foreground": "#047857",
  accent: "#d1fae5",
  "accent-foreground": "#065f46",
  destructive: "#ef4444",
  "destructive-foreground": "#ffffff",
  border: "#a7f3d0",
  input: "#a7f3d0",
  ring: "#059669",
} as const;

export const emeraldDark = {
  background: "#022c22",
  foreground: "#ecfdf5",
  card: "#064e3b",
  "card-foreground": "#ecfdf5",
  popover: "#064e3b",
  "popover-foreground": "#ecfdf5",
  primary: "#10b981",
  "primary-foreground": "#022c22",
  secondary: "#065f46",
  "secondary-foreground": "#ecfdf5",
  muted: "#065f46",
  "muted-foreground": "#6ee7b7",
  accent: "#047857",
  "accent-foreground": "#ecfdf5",
  destructive: "#7f1d1d",
  "destructive-foreground": "#ffffff",
  border: "#047857",
  input: "#047857",
  ring: "#10b981",
} as const;

export type EmeraldTheme = typeof emerald;

/**
 * The active palette pair. Components read this through the use-theme-colors hook, so
 * installing a different theme over this file restyles every component.
 */
export const themeColors = { light: emerald, dark: emeraldDark } as const;
