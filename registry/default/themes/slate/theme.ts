/** Nativra theme — Slate. Edit freely; you own this file. */
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

export type SlateTheme = typeof slate;

