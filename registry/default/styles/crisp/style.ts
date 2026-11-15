/**
 * Nativra style — Crisp. Edit freely; you own this file.
 * Generated from @nativra/theme-engine by scripts/generate-themes.mjs — do not edit in the registry.
 *
 * The UI's character, independent of its colors: radii by role, shadows, type scale, density,
 * surfaces, input fields and press feedback. Every component reads it through use-theme-colors,
 * so installing another style (npx nativra-cli style add <id>) restyles the whole app.
 */
export const themeStyle = {
  id: "crisp",
  name: "Crisp",
  radius: {
    button: 8,
    control: 8,
    card: 12,
    surface: 14,
    chip: 6,
    small: 4,
  },
  borderWidth: 1,
  shadow: {
    card: {
      offsetY: 1,
      radius: 2,
      opacity: 0.05,
      elevation: 1,
    },
    raised: {
      offsetY: 4,
      radius: 12,
      opacity: 0.08,
      elevation: 4,
    },
    overlay: {
      offsetY: 10,
      radius: 30,
      opacity: 0.16,
      elevation: 10,
    },
  },
  pressedScale: 1,
  scrimOpacity: 0.6,
  fontWeight: {
    heading: "600",
    title: "600",
    label: "500",
  },
  headingLetterSpacing: -0.5,
  typeScale: 0.94,
  density: 0.9,
  surface: "border",
  field: "outline",
  press: "opacity",
  pressedOpacity: 0.8,
  control: {
    height: 40,
    paddingX: 16,
  },
} as const;
