/**
 * Nativra style — Material. Edit freely; you own this file.
 * Generated from @nativra/theme-engine by scripts/generate-themes.mjs — do not edit in the registry.
 *
 * The UI's character, independent of its colors: radii by role, shadows, type scale, density,
 * surfaces, input fields and press feedback. Every component reads it through use-theme-colors,
 * so installing another style (npx nativra-cli style add <id>) restyles the whole app.
 */
export const themeStyle = {
  id: "material",
  name: "Material",
  radius: {
    button: 9999,
    control: 12,
    card: 16,
    surface: 28,
    chip: 8,
    small: 4,
  },
  borderWidth: 1,
  shadow: {
    card: {
      offsetY: 1,
      radius: 3,
      opacity: 0.12,
      elevation: 1,
    },
    raised: {
      offsetY: 2,
      radius: 6,
      opacity: 0.15,
      elevation: 3,
    },
    overlay: {
      offsetY: 4,
      radius: 12,
      opacity: 0.18,
      elevation: 6,
    },
  },
  pressedScale: 1,
  scrimOpacity: 0.32,
  fontWeight: {
    heading: "400",
    title: "500",
    label: "500",
  },
  headingLetterSpacing: 0,
  typeScale: 1,
  density: 1,
  surface: "tonal",
  field: "filled",
  press: "opacity",
  pressedOpacity: 0.88,
  control: {
    height: 48,
    paddingX: 24,
  },
} as const;
