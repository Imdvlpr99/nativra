/**
 * Nativra theme — Orange. Edit freely; you own this file.
 * Generated from @nativra/theme-engine by scripts/generate-themes.mjs — do not edit in the registry.
 */
export const orange = {
  success: "#15803d",
  "success-foreground": "#ffffff",
  warning: "#b45309",
  "warning-foreground": "#ffffff",
  info: "#0369a1",
  "info-foreground": "#ffffff",
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
  success: "#4ade80",
  "success-foreground": "#052e16",
  warning: "#fbbf24",
  "warning-foreground": "#451a03",
  info: "#38bdf8",
  "info-foreground": "#082f49",
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
  destructive: "#f87171",
  "destructive-foreground": "#450a0a",
  border: "#9a3412",
  input: "#9a3412",
  ring: "#f97316",
} as const;

export type OrangeTheme = typeof orange;

/**
 * The active palette pair. Components read this through the use-theme-colors hook, so
 * installing a different theme over this file restyles every component. Shape, type and
 * density live separately in style.ts (npx nativra-cli style add <id>).
 */
export const themeColors = { light: orange, dark: orangeDark } as const;
