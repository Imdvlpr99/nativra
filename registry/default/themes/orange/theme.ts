/**
 * Nativra theme — Orange. Edit freely; you own this file.
 * Generated from @nativra/theme-engine by scripts/generate-themes.mjs — do not edit in the registry.
 */
export const orange = {
  background: "#ffffff",
  foreground: "#431407",
  card: "#ffffff",
  "card-foreground": "#431407",
  popover: "#ffffff",
  "popover-foreground": "#431407",
  primary: "#ea580c",
  "primary-foreground": "#ffffff",
  secondary: "#fff7ed",
  "secondary-foreground": "#9a3412",
  muted: "#fff7ed",
  "muted-foreground": "#c2410c",
  accent: "#ffedd5",
  "accent-foreground": "#9a3412",
  destructive: "#ef4444",
  "destructive-foreground": "#ffffff",
  border: "#fed7aa",
  input: "#fed7aa",
  ring: "#ea580c",
} as const;

export const orangeDark = {
  background: "#1e0903",
  foreground: "#fff7ed",
  card: "#431407",
  "card-foreground": "#fff7ed",
  popover: "#431407",
  "popover-foreground": "#fff7ed",
  primary: "#f97316",
  "primary-foreground": "#1e0903",
  secondary: "#7c2d12",
  "secondary-foreground": "#fff7ed",
  muted: "#7c2d12",
  "muted-foreground": "#fdba74",
  accent: "#9a3412",
  "accent-foreground": "#fff7ed",
  destructive: "#7f1d1d",
  "destructive-foreground": "#ffffff",
  border: "#9a3412",
  input: "#9a3412",
  ring: "#f97316",
} as const;

export type OrangeTheme = typeof orange;

/**
 * The active palette pair. Components read this through the use-theme-colors hook, so
 * installing a different theme over this file restyles every component.
 */
export const themeColors = { light: orange, dark: orangeDark } as const;
