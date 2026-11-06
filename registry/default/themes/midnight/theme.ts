/** Nativra theme — Midnight. Edit freely; you own this file. */
export const midnight = {
  background: "#0b0f19",
  foreground: "#f8fafc",
  card: "#111827",
  "card-foreground": "#f8fafc",
  popover: "#111827",
  "popover-foreground": "#f8fafc",
  primary: "#3b82f6",
  "primary-foreground": "#ffffff",
  secondary: "#1e293b",
  "secondary-foreground": "#f8fafc",
  muted: "#1e293b",
  "muted-foreground": "#94a3b8",
  accent: "#1d4ed8",
  "accent-foreground": "#ffffff",
  destructive: "#ef4444",
  "destructive-foreground": "#ffffff",
  border: "#1f2937",
  input: "#1f2937",
  ring: "#60a5fa",
} as const;

export type MidnightTheme = typeof midnight;

