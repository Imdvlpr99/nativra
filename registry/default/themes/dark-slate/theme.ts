/** Nativra theme — Dark Slate. Edit freely; you own this file. */
export const darkSlate = {
  background: "#0f172a",
  foreground: "#f8fafc",
  card: "#1e293b",
  primary: "#38bdf8",
  "primary-foreground": "#0f172a",
  muted: "#334155",
  "muted-foreground": "#94a3b8",
  border: "#334155",
  destructive: "#ef4444",
} as const;

export type DarkSlateTheme = typeof darkSlate;

