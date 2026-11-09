/**
 * @nativra/theme-engine
 *
 * Transforms semantic design tokens into NativeWind CSS variable definitions,
 * Tailwind configuration presets, and React Native StyleSheet-compatible plain objects.
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
// Standard Layout Scales
// ---------------------------------------------------------------------------

export const defaultSpace: SpaceScale = {
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
};

export const defaultRadius: RadiusScale = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

export const defaultFontSize: FontSizeScale = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  "2xl": 24,
  "3xl": 30,
  "4xl": 36,
};

// ---------------------------------------------------------------------------
// 8 Official Mobile Palettes (Section 5.2)
// ---------------------------------------------------------------------------

export const zincTheme: NativraThemeTokens = {
  id: "zinc",
  name: "Zinc (Default)",
  light: {
    background: "#ffffff",
    foreground: "#09090b",
    card: "#ffffff",
    "card-foreground": "#09090b",
    popover: "#ffffff",
    "popover-foreground": "#09090b",
    primary: "#18181b",
    "primary-foreground": "#fafafa",
    secondary: "#f4f4f5",
    "secondary-foreground": "#18181b",
    muted: "#f4f4f5",
    "muted-foreground": "#71717a",
    accent: "#f4f4f5",
    "accent-foreground": "#18181b",
    destructive: "#ef4444",
    "destructive-foreground": "#fafafa",
    border: "#e4e4e7",
    input: "#e4e4e7",
    ring: "#18181b",
  },
  dark: {
    background: "#09090b",
    foreground: "#fafafa",
    card: "#09090b",
    "card-foreground": "#fafafa",
    popover: "#09090b",
    "popover-foreground": "#fafafa",
    primary: "#fafafa",
    "primary-foreground": "#18181b",
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
  space: defaultSpace,
  radius: defaultRadius,
  fontSize: defaultFontSize,
};

export const slateTheme: NativraThemeTokens = {
  id: "slate",
  name: "Slate",
  light: {
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
  },
  dark: {
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
  },
  space: defaultSpace,
  radius: defaultRadius,
  fontSize: defaultFontSize,
};

export const emeraldTheme: NativraThemeTokens = {
  id: "emerald",
  name: "Emerald",
  light: {
    background: "#ffffff",
    foreground: "#064e3b",
    card: "#ffffff",
    "card-foreground": "#064e3b",
    popover: "#ffffff",
    "popover-foreground": "#064e3b",
    primary: "#059669",
    "primary-foreground": "#ffffff",
    secondary: "#ecfdf5",
    "secondary-foreground": "#065f46",
    muted: "#f0fdf4",
    "muted-foreground": "#047857",
    accent: "#d1fae5",
    "accent-foreground": "#065f46",
    destructive: "#ef4444",
    "destructive-foreground": "#ffffff",
    border: "#a7f3d0",
    input: "#a7f3d0",
    ring: "#059669",
  },
  dark: {
    background: "#022c22",
    foreground: "#ecfdf5",
    card: "#064e3b",
    "card-foreground": "#ecfdf5",
    popover: "#064e3b",
    "popover-foreground": "#ecfdf5",
    primary: "#10b981",
    "primary-foreground": "#022c22",
    secondary: "#065f46",
    "secondary-foreground": "#ecfdf5",
    muted: "#065f46",
    "muted-foreground": "#6ee7b7",
    accent: "#047857",
    "accent-foreground": "#ecfdf5",
    destructive: "#7f1d1d",
    "destructive-foreground": "#ffffff",
    border: "#047857",
    input: "#047857",
    ring: "#10b981",
  },
  space: defaultSpace,
  radius: defaultRadius,
  fontSize: defaultFontSize,
};

export const violetTheme: NativraThemeTokens = {
  id: "violet",
  name: "Violet",
  light: {
    background: "#ffffff",
    foreground: "#2e1065",
    card: "#ffffff",
    "card-foreground": "#2e1065",
    popover: "#ffffff",
    "popover-foreground": "#2e1065",
    primary: "#7c3aed",
    "primary-foreground": "#ffffff",
    secondary: "#f5f3ff",
    "secondary-foreground": "#5b21b6",
    muted: "#f5f3ff",
    "muted-foreground": "#6d28d9",
    accent: "#ede9fe",
    "accent-foreground": "#5b21b6",
    destructive: "#ef4444",
    "destructive-foreground": "#ffffff",
    border: "#ddd6fe",
    input: "#ddd6fe",
    ring: "#7c3aed",
  },
  dark: {
    background: "#0f0728",
    foreground: "#f5f3ff",
    card: "#1e103a",
    "card-foreground": "#f5f3ff",
    popover: "#1e103a",
    "popover-foreground": "#f5f3ff",
    primary: "#8b5cf6",
    "primary-foreground": "#0f0728",
    secondary: "#2e1065",
    "secondary-foreground": "#f5f3ff",
    muted: "#2e1065",
    "muted-foreground": "#c4b5fd",
    accent: "#3b0764",
    "accent-foreground": "#f5f3ff",
    destructive: "#7f1d1d",
    "destructive-foreground": "#ffffff",
    border: "#3b0764",
    input: "#3b0764",
    ring: "#8b5cf6",
  },
  space: defaultSpace,
  radius: defaultRadius,
  fontSize: defaultFontSize,
};

export const roseTheme: NativraThemeTokens = {
  id: "rose",
  name: "Rose",
  light: {
    background: "#ffffff",
    foreground: "#4c0519",
    card: "#ffffff",
    "card-foreground": "#4c0519",
    popover: "#ffffff",
    "popover-foreground": "#4c0519",
    primary: "#e11d48",
    "primary-foreground": "#ffffff",
    secondary: "#fff1f2",
    "secondary-foreground": "#9f1239",
    muted: "#fff1f2",
    "muted-foreground": "#be123c",
    accent: "#ffe4e6",
    "accent-foreground": "#9f1239",
    destructive: "#ef4444",
    "destructive-foreground": "#ffffff",
    border: "#fecdd3",
    input: "#fecdd3",
    ring: "#e11d48",
  },
  dark: {
    background: "#2a040e",
    foreground: "#fff1f2",
    card: "#4c0519",
    "card-foreground": "#fff1f2",
    popover: "#4c0519",
    "popover-foreground": "#fff1f2",
    primary: "#f43f5e",
    "primary-foreground": "#2a040e",
    secondary: "#881337",
    "secondary-foreground": "#fff1f2",
    muted: "#881337",
    "muted-foreground": "#fda4af",
    accent: "#9f1239",
    "accent-foreground": "#fff1f2",
    destructive: "#7f1d1d",
    "destructive-foreground": "#ffffff",
    border: "#9f1239",
    input: "#9f1239",
    ring: "#f43f5e",
  },
  space: defaultSpace,
  radius: defaultRadius,
  fontSize: defaultFontSize,
};

export const amberTheme: NativraThemeTokens = {
  id: "amber",
  name: "Amber",
  light: {
    background: "#ffffff",
    foreground: "#451a03",
    card: "#ffffff",
    "card-foreground": "#451a03",
    popover: "#ffffff",
    "popover-foreground": "#451a03",
    primary: "#d97706",
    "primary-foreground": "#ffffff",
    secondary: "#fffbeb",
    "secondary-foreground": "#92400e",
    muted: "#fffbeb",
    "muted-foreground": "#b45309",
    accent: "#fef3c7",
    "accent-foreground": "#92400e",
    destructive: "#ef4444",
    "destructive-foreground": "#ffffff",
    border: "#fde68a",
    input: "#fde68a",
    ring: "#d97706",
  },
  dark: {
    background: "#1c0b02",
    foreground: "#fffbeb",
    card: "#451a03",
    "card-foreground": "#fffbeb",
    popover: "#451a03",
    "popover-foreground": "#fffbeb",
    primary: "#f59e0b",
    "primary-foreground": "#1c0b02",
    secondary: "#78350f",
    "secondary-foreground": "#fffbeb",
    muted: "#78350f",
    "muted-foreground": "#fcd34d",
    accent: "#92400e",
    "accent-foreground": "#fffbeb",
    destructive: "#7f1d1d",
    "destructive-foreground": "#ffffff",
    border: "#92400e",
    input: "#92400e",
    ring: "#f59e0b",
  },
  space: defaultSpace,
  radius: defaultRadius,
  fontSize: defaultFontSize,
};

export const orangeTheme: NativraThemeTokens = {
  id: "orange",
  name: "Orange",
  light: {
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
  },
  dark: {
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
  },
  space: defaultSpace,
  radius: defaultRadius,
  fontSize: defaultFontSize,
};

export const cyanTheme: NativraThemeTokens = {
  id: "cyan",
  name: "Cyan",
  light: {
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
  },
  dark: {
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
  },
  space: defaultSpace,
  radius: defaultRadius,
  fontSize: defaultFontSize,
};

export const midnightTheme: NativraThemeTokens = {
  id: "midnight",
  name: "Midnight",
  light: {
    background: "#f8fafc",
    foreground: "#0b0f19",
    card: "#ffffff",
    "card-foreground": "#0b0f19",
    popover: "#ffffff",
    "popover-foreground": "#0b0f19",
    primary: "#1d4ed8",
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
    ring: "#1d4ed8",
  },
  dark: {
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
  },
  space: defaultSpace,
  radius: defaultRadius,
  fontSize: defaultFontSize,
};

export const darkSlateTheme: NativraThemeTokens = {
  id: "dark-slate",
  name: "Dark Slate",
  light: {
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
  },
  dark: {
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
  },
  space: defaultSpace,
  radius: defaultRadius,
  fontSize: defaultFontSize,
};

export const THEME_PRESETS: Record<string, NativraThemeTokens> = {
  zinc: zincTheme,
  slate: slateTheme,
  "dark-slate": darkSlateTheme,
  darkslate: darkSlateTheme,
  emerald: emeraldTheme,
  midnight: midnightTheme,
  violet: violetTheme,
  rose: roseTheme,
  amber: amberTheme,
  orange: orangeTheme,
  cyan: cyanTheme,
};

export const THEME_PALETTES = THEME_PRESETS;

export function getThemePreset(id: string): NativraThemeTokens {
  return THEME_PRESETS[id.toLowerCase()] ?? zincTheme;
}

export const defaultTheme: NativraThemeTokens = zincTheme;

// ---------------------------------------------------------------------------
// StyleSheet adapter
// ---------------------------------------------------------------------------

/**
 * Converts theme tokens into a React Native StyleSheet-compatible flat object.
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
// Density Presets, Font Scale Tiers, Typography Scale & High-Contrast Mode
// ---------------------------------------------------------------------------

export type DensityPreset = "compact" | "regular" | "comfortable";
export type FontScaleTier = "sm" | "md" | "lg" | "xl";

export interface TypographyVariantSpec {
  fontSize: number;
  lineHeight: number;
  fontWeight: "400" | "500" | "600" | "700" | "800";
  letterSpacing: number;
  tabularNums?: boolean;
}

export type TypographyVariantName =
  | "displayLarge"
  | "displayMedium"
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "bodyLarge"
  | "body"
  | "bodySmall"
  | "label"
  | "caption"
  | "overline";

export type TypographyScale = Record<TypographyVariantName, TypographyVariantSpec>;

const DENSITY_MULTIPLIERS: Record<DensityPreset, number> = {
  compact: 0.85,
  regular: 1.0,
  comfortable: 1.15,
};

const FONT_SCALE_MULTIPLIERS: Record<FontScaleTier, number> = {
  sm: 0.9,
  md: 1.0,
  lg: 1.125,
  xl: 1.25,
};

export const BASE_TYPOGRAPHY_SCALE: TypographyScale = {
  displayLarge: { fontSize: 34, lineHeight: 41, fontWeight: "700", letterSpacing: -0.6, tabularNums: true },
  displayMedium: { fontSize: 28, lineHeight: 34, fontWeight: "700", letterSpacing: -0.4, tabularNums: true },
  h1: { fontSize: 28, lineHeight: 34, fontWeight: "600", letterSpacing: -0.4 },
  h2: { fontSize: 22, lineHeight: 28, fontWeight: "600", letterSpacing: -0.3 },
  h3: { fontSize: 18, lineHeight: 24, fontWeight: "600", letterSpacing: -0.2 },
  h4: { fontSize: 16, lineHeight: 22, fontWeight: "600", letterSpacing: -0.1 },
  bodyLarge: { fontSize: 17, lineHeight: 24, fontWeight: "500", letterSpacing: 0 },
  body: { fontSize: 15, lineHeight: 22, fontWeight: "400", letterSpacing: 0 },
  bodySmall: { fontSize: 13, lineHeight: 18, fontWeight: "400", letterSpacing: 0 },
  label: { fontSize: 14, lineHeight: 20, fontWeight: "600", letterSpacing: 0.1 },
  caption: { fontSize: 12, lineHeight: 16, fontWeight: "500", letterSpacing: 0.2, tabularNums: true },
  overline: { fontSize: 11, lineHeight: 14, fontWeight: "700", letterSpacing: 0.8 },
};

/**
 * Computes a density- and font-scale-adjusted typography scale.
 */
export function getTypographyScale(
  density: DensityPreset = "regular",
  fontScale: FontScaleTier = "md"
): TypographyScale {
  const densityFactor = density === "compact" ? 0.94 : density === "comfortable" ? 1.06 : 1.0;
  const fontFactor = FONT_SCALE_MULTIPLIERS[fontScale] ?? 1.0;
  const multiplier = densityFactor * fontFactor;

  const result = {} as TypographyScale;
  for (const [key, spec] of Object.entries(BASE_TYPOGRAPHY_SCALE) as Array<[TypographyVariantName, TypographyVariantSpec]>) {
    result[key] = {
      ...spec,
      fontSize: Math.round(spec.fontSize * multiplier),
      lineHeight: Math.round(spec.lineHeight * multiplier),
    };
  }
  return result;
}

/**
 * Applies WCAG AAA high-contrast adjustments to a semantic color set.
 */
export function applyHighContrast(
  colors: SemanticColors,
  colorScheme: "light" | "dark" = "light"
): SemanticColors {
  if (colorScheme === "dark") {
    return {
      ...colors,
      background: "#000000",
      foreground: "#ffffff",
      card: "#09090b",
      "card-foreground": "#ffffff",
      "muted-foreground": "#e4e4e7",
      border: "#71717a",
      input: "#71717a",
    };
  }
  return {
    ...colors,
    background: "#ffffff",
    foreground: "#000000",
    card: "#ffffff",
    "card-foreground": "#000000",
    "muted-foreground": "#27272a",
    border: "#52525b",
    input: "#52525b",
  };
}

export interface ResolveThemeOptions {
  colorScheme?: "light" | "dark";
  density?: DensityPreset;
  fontScale?: FontScaleTier;
  highContrast?: boolean;
}

/**
 * Resolves a complete Nativra theme configuration with density-scaled spacing,
 * dynamic font-scale typography, and optional high-contrast accessibility tokens.
 */
export function resolveThemeTokens(
  theme: NativraThemeTokens,
  options: ResolveThemeOptions = {}
) {
  const {
    colorScheme = "light",
    density = "regular",
    fontScale = "md",
    highContrast = false,
  } = options;

  const baseColors = theme[colorScheme];
  const colors = highContrast ? applyHighContrast(baseColors, colorScheme) : baseColors;
  const spaceMultiplier = DENSITY_MULTIPLIERS[density] ?? 1.0;

  const space = Object.fromEntries(
    Object.entries(theme.space).map(([k, v]) => [k, Math.round(v * spaceMultiplier)])
  ) as unknown as SpaceScale;

  const typography = getTypographyScale(density, fontScale);

  return {
    id: theme.id,
    name: theme.name,
    colorScheme,
    density,
    fontScale,
    highContrast,
    colors,
    space,
    radius: theme.radius,
    fontSize: theme.fontSize,
    typography,
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

/**
 * Converts theme tokens into a Tailwind CSS theme.extend configuration object.
 */
export function toTailwindPreset(theme: NativraThemeTokens): Record<string, unknown> {
  return {
    theme: {
      extend: {
        colors: {
          background: "var(--color-background)",
          foreground: "var(--color-foreground)",
          card: {
            DEFAULT: "var(--color-card)",
            foreground: "var(--color-card-foreground)",
          },
          popover: {
            DEFAULT: "var(--color-popover)",
            foreground: "var(--color-popover-foreground)",
          },
          primary: {
            DEFAULT: "var(--color-primary)",
            foreground: "var(--color-primary-foreground)",
          },
          secondary: {
            DEFAULT: "var(--color-secondary)",
            foreground: "var(--color-secondary-foreground)",
          },
          muted: {
            DEFAULT: "var(--color-muted)",
            foreground: "var(--color-muted-foreground)",
          },
          accent: {
            DEFAULT: "var(--color-accent)",
            foreground: "var(--color-accent-foreground)",
          },
          destructive: {
            DEFAULT: "var(--color-destructive)",
            foreground: "var(--color-destructive-foreground)",
          },
          border: "var(--color-border)",
          input: "var(--color-input)",
          ring: "var(--color-ring)",
        },
        borderRadius: {
          sm: `${theme.radius.sm}px`,
          md: `${theme.radius.md}px`,
          lg: `${theme.radius.lg}px`,
          xl: `${theme.radius.xl}px`,
        },
      },
    },
  };
}

export { defaultTheme as default };
