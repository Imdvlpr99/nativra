/**
 * Nativra theme — Slate. Edit freely; you own this file.
 * Generated from @nativra/theme-engine by scripts/generate-themes.mjs — do not edit in the registry.
 */
export const slate = {
  background: "#ffffff",
  foreground: "#0f172a",
  card: "#ffffff",
  "card-foreground": "#0f172a",
  popover: "#ffffff",
  "popover-foreground": "#0f172a",
  primary: "#0f172a",
  "primary-foreground": "#f8fafc",
  secondary: "#f1f5f9",
  "secondary-foreground": "#0f172a",
  muted: "#f1f5f9",
  "muted-foreground": "#64748b",
  accent: "#f1f5f9",
  "accent-foreground": "#0f172a",
  destructive: "#ef4444",
  "destructive-foreground": "#f8fafc",
  border: "#e2e8f0",
  input: "#e2e8f0",
  ring: "#0f172a",
} as const;

export const slateDark = {
  background: "#020617",
  foreground: "#f8fafc",
  card: "#020617",
  "card-foreground": "#f8fafc",
  popover: "#020617",
  "popover-foreground": "#f8fafc",
  primary: "#f8fafc",
  "primary-foreground": "#0f172a",
  secondary: "#1e293b",
  "secondary-foreground": "#f8fafc",
  muted: "#1e293b",
  "muted-foreground": "#94a3b8",
  accent: "#1e293b",
  "accent-foreground": "#f8fafc",
  destructive: "#7f1d1d",
  "destructive-foreground": "#f8fafc",
  border: "#1e293b",
  input: "#1e293b",
  ring: "#cbd5e1",
} as const;

export type SlateTheme = typeof slate;

/**
 * The active palette pair. Components read this through the use-theme-colors hook, so
 * installing a different theme over this file restyles every component.
 */
export const themeColors = { light: slate, dark: slateDark } as const;
