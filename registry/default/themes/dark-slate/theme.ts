/**
 * Nativra theme — Dark Slate. Edit freely; you own this file.
 * Generated from @nativra/theme-engine by scripts/generate-themes.mjs — do not edit in the registry.
 */
export const darkSlate = {
  background: "#f8fafc",
  foreground: "#0f172a",
  card: "#ffffff",
  "card-foreground": "#0f172a",
  popover: "#ffffff",
  "popover-foreground": "#0f172a",
  primary: "#0284c7",
  "primary-foreground": "#ffffff",
  secondary: "#f1f5f9",
  "secondary-foreground": "#0f172a",
  muted: "#f1f5f9",
  "muted-foreground": "#64748b",
  accent: "#e2e8f0",
  "accent-foreground": "#0f172a",
  destructive: "#ef4444",
  "destructive-foreground": "#ffffff",
  border: "#cbd5e1",
  input: "#cbd5e1",
  ring: "#0284c7",
} as const;

export const darkSlateDark = {
  background: "#0f172a",
  foreground: "#f8fafc",
  card: "#1e293b",
  "card-foreground": "#f8fafc",
  popover: "#1e293b",
  "popover-foreground": "#f8fafc",
  primary: "#38bdf8",
  "primary-foreground": "#0f172a",
  secondary: "#334155",
  "secondary-foreground": "#f8fafc",
  muted: "#334155",
  "muted-foreground": "#94a3b8",
  accent: "#0369a1",
  "accent-foreground": "#ffffff",
  destructive: "#ef4444",
  "destructive-foreground": "#ffffff",
  border: "#334155",
  input: "#334155",
  ring: "#38bdf8",
} as const;

export type DarkSlateTheme = typeof darkSlate;

/**
 * The active palette pair. Components read this through the use-theme-colors hook, so
 * installing a different theme over this file restyles every component.
 */
export const themeColors = { light: darkSlate, dark: darkSlateDark } as const;
