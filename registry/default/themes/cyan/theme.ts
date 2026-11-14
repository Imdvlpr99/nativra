/**
 * Nativra theme — Cyan. Edit freely; you own this file.
 * Generated from @nativra/theme-engine by scripts/generate-themes.mjs — do not edit in the registry.
 */
export const cyan = {
  background: "#ffffff",
  foreground: "#083344",
  card: "#ffffff",
  "card-foreground": "#083344",
  popover: "#ffffff",
  "popover-foreground": "#083344",
  primary: "#0891b2",
  "primary-foreground": "#ffffff",
  secondary: "#ecfeff",
  "secondary-foreground": "#155e75",
  muted: "#ecfeff",
  "muted-foreground": "#0e7490",
  accent: "#cffafe",
  "accent-foreground": "#155e75",
  destructive: "#ef4444",
  "destructive-foreground": "#ffffff",
  border: "#a5f3fc",
  input: "#a5f3fc",
  ring: "#0891b2",
} as const;

export const cyanDark = {
  background: "#031d28",
  foreground: "#ecfeff",
  card: "#083344",
  "card-foreground": "#ecfeff",
  popover: "#083344",
  "popover-foreground": "#ecfeff",
  primary: "#06b6d4",
  "primary-foreground": "#031d28",
  secondary: "#155e75",
  "secondary-foreground": "#ecfeff",
  muted: "#155e75",
  "muted-foreground": "#67e8f9",
  accent: "#164e63",
  "accent-foreground": "#ecfeff",
  destructive: "#7f1d1d",
  "destructive-foreground": "#ffffff",
  border: "#164e63",
  input: "#164e63",
  ring: "#06b6d4",
} as const;

export type CyanTheme = typeof cyan;

/**
 * The active palette pair. Components read this through the use-theme-colors hook, so
 * installing a different theme over this file restyles every component.
 */
export const themeColors = { light: cyan, dark: cyanDark } as const;
