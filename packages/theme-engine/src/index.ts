/**
 * @nativra/theme-engine
 *
 * Transforms semantic design tokens into NativeWind CSS variable definitions
 * and React Native StyleSheet-compatible plain objects.
 */

// ---------------------------------------------------------------------------
// Token definitions
// ---------------------------------------------------------------------------

/** A color token value — either a hex string or a CSS/RN color string */
export type ColorValue = string;

/** A spacing/sizing token value in dp (density-independent pixels) */
export type SpaceValue = number;

/** A border radius token value in dp */
export type RadiusValue = number;

/** A font size token value in sp (scale-independent pixels) */
export type FontSizeValue = number;

export interface ColorScale {
  "50": ColorValue;
  "100": ColorValue;
  "200": ColorValue;
  "300": ColorValue;
  "400": ColorValue;
  "500": ColorValue;
  "600": ColorValue;
  "700": ColorValue;
  "800": ColorValue;
  "900": ColorValue;
  "950": ColorValue;
}

export interface SemanticColors {
  background: ColorValue;
  foreground: ColorValue;
  card: ColorValue;
  "card-foreground": ColorValue;
  popover: ColorValue;
  "popover-foreground": ColorValue;
  primary: ColorValue;
  "primary-foreground": ColorValue;
  secondary: ColorValue;
  "secondary-foreground": ColorValue;
  muted: ColorValue;
  "muted-foreground": ColorValue;
  accent: ColorValue;
  "accent-foreground": ColorValue;
  destructive: ColorValue;
  "destructive-foreground": ColorValue;
  border: ColorValue;
  input: ColorValue;
  ring: ColorValue;
}

export interface SpaceScale {
  "0": SpaceValue;
  "1": SpaceValue;
  "2": SpaceValue;
  "3": SpaceValue;
  "4": SpaceValue;
  "5": SpaceValue;
  "6": SpaceValue;
  "8": SpaceValue;
  "10": SpaceValue;
  "12": SpaceValue;
  "16": SpaceValue;
  "20": SpaceValue;
  "24": SpaceValue;
}

export interface RadiusScale {
  none: RadiusValue;
  sm: RadiusValue;
  md: RadiusValue;
  lg: RadiusValue;
  xl: RadiusValue;
  full: RadiusValue;
}

export interface FontSizeScale {
  xs: FontSizeValue;
  sm: FontSizeValue;
  base: FontSizeValue;
  lg: FontSizeValue;
  xl: FontSizeValue;
  "2xl": FontSizeValue;
  "3xl": FontSizeValue;
  "4xl": FontSizeValue;
}

export interface NativraThemeTokens {
  /** Theme identifier */
  id: string;
  /** Display name */
  name: string;
  /** Semantic colors for light mode */
  light: SemanticColors;
  /** Semantic colors for dark mode */
  dark: SemanticColors;
  space: SpaceScale;
  radius: RadiusScale;
  fontSize: FontSizeScale;
}

// ---------------------------------------------------------------------------
// Default theme
// ---------------------------------------------------------------------------

export const defaultTheme: NativraThemeTokens = {
  id: "default",
  name: "Default",
  light: {
    background: "#ffffff",
    foreground: "#0a0a0a",
    card: "#ffffff",
    "card-foreground": "#0a0a0a",
    popover: "#ffffff",
    "popover-foreground": "#0a0a0a",
    primary: "#171717",
    "primary-foreground": "#fafafa",
    secondary: "#f4f4f5",
    "secondary-foreground": "#171717",
    muted: "#f4f4f5",
    "muted-foreground": "#71717a",
    accent: "#f4f4f5",
    "accent-foreground": "#171717",
    destructive: "#ef4444",
    "destructive-foreground": "#fafafa",
    border: "#e4e4e7",
    input: "#e4e4e7",
    ring: "#a1a1aa",
  },
  dark: {
    background: "#0a0a0a",
    foreground: "#fafafa",
    card: "#0a0a0a",
    "card-foreground": "#fafafa",
    popover: "#0a0a0a",
    "popover-foreground": "#fafafa",
    primary: "#fafafa",
    "primary-foreground": "#171717",
    secondary: "#27272a",
    "secondary-foreground": "#fafafa",
    muted: "#27272a",
    "muted-foreground": "#a1a1aa",
    accent: "#27272a",
    "accent-foreground": "#fafafa",
    destructive: "#7f1d1d",
    "destructive-foreground": "#fafafa",
    border: "#27272a",
    input: "#27272a",
    ring: "#d4d4d8",
  },
  space: {
    "0": 0,
    "1": 4,
    "2": 8,
    "3": 12,
    "4": 16,
    "5": 20,
    "6": 24,
    "8": 32,
    "10": 40,
    "12": 48,
    "16": 64,
    "20": 80,
    "24": 96,
  },
  radius: {
    none: 0,
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    full: 9999,
  },
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    "2xl": 24,
    "3xl": 30,
    "4xl": 36,
  },
};

// ---------------------------------------------------------------------------
// StyleSheet adapter
// ---------------------------------------------------------------------------

/**
 * Converts theme tokens into a React Native StyleSheet-compatible flat object.
 * Returns separate light and dark color objects so they can be used with
 * `useColorScheme()`.
 */
export function toStyleSheetTokens(theme: NativraThemeTokens, colorScheme: "light" | "dark" = "light") {
  const colors = theme[colorScheme];
  return {
    colors,
    space: theme.space,
    radius: theme.radius,
    fontSize: theme.fontSize,
  };
}

// ---------------------------------------------------------------------------
// NativeWind / CSS variable adapter
// ---------------------------------------------------------------------------

/**
 * Converts theme tokens into a CSS custom property block suitable for
 * embedding in a global CSS file (used by NativeWind / web target).
 */
export function toCssVariables(theme: NativraThemeTokens): string {
  const lines: string[] = [];

  const pushColorVars = (colors: SemanticColors, selector: string) => {
    lines.push(`${selector} {`);
    for (const [key, value] of Object.entries(colors)) {
      lines.push(`  --color-${key}: ${value};`);
    }
    lines.push(`}`);
  };

  pushColorVars(theme.light, ":root");
  pushColorVars(theme.dark, "@media (prefers-color-scheme: dark) :root");

  lines.push(`:root {`);
  for (const [key, value] of Object.entries(theme.space)) {
    lines.push(`  --space-${key}: ${value}px;`);
  }
  for (const [key, value] of Object.entries(theme.radius)) {
    lines.push(`  --radius-${key}: ${value}px;`);
  }
  for (const [key, value] of Object.entries(theme.fontSize)) {
    lines.push(`  --font-size-${key}: ${value}px;`);
  }
  lines.push(`}`);

  return lines.join("\n");
}

export { defaultTheme as default };

