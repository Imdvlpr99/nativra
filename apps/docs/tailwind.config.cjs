/** @type {import('tailwindcss').Config} */
module.exports = {
  // The theme toggle sets the "dark" class on <html> (see index.html).
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "SFMono-Regular", "Menlo", "Consolas", "monospace"],
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        surface: "hsl(var(--surface))",
        card: "hsl(var(--card))",
        "card-foreground": "hsl(var(--foreground))",
        popover: "hsl(var(--popover))",
        "popover-foreground": "hsl(var(--foreground))",
        primary: "hsl(var(--primary))",
        "primary-foreground": "hsl(var(--primary-foreground))",
        secondary: "hsl(var(--muted))",
        "secondary-foreground": "hsl(var(--foreground))",
        muted: "hsl(var(--muted))",
        "muted-foreground": "hsl(var(--muted-foreground))",
        accent: "hsl(var(--accent))",
        "accent-foreground": "hsl(var(--foreground))",
        destructive: "hsl(var(--destructive))",
        "destructive-foreground": "hsl(0 0% 100%)",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--brand))",
        brand: "hsl(var(--brand))",
        code: {
          DEFAULT: "hsl(var(--code-bg))",
          border: "hsl(var(--code-border))",
          fg: "hsl(var(--code-fg))",
          muted: "hsl(var(--code-muted))",
        },
      },
      borderRadius: {
        xl: "var(--radius)",
        lg: "calc(var(--radius) - 2px)",
        md: "calc(var(--radius) - 4px)",
        sm: "calc(var(--radius) - 6px)",
      },
      backgroundImage: {
        // The logo's lime → cyan gradient: the site's single decorative signature.
        signature: "linear-gradient(90deg, #a3e635 0%, #34d399 45%, #22d3ee 100%)",
      },
    },
  },
  plugins: [],
};
