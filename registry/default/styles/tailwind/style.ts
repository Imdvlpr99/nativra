/**
 * Nativra style — Tailwind. Edit freely; you own this file.
 * Generated from @nativra/theme-engine by scripts/generate-themes.mjs — do not edit in the registry.
 *
 * The UI's character, independent of its colors: radii by role, shadows, type scale, density,
 * surfaces, input fields and press feedback. Every component reads it through use-theme-colors,
 * so installing another style (npx nativra-cli style add <id>) restyles the whole app.
 */
export const themeStyle = {
  id: "tailwind",
  name: "Tailwind",
  radius: {
    button: 10,
    control: 10,
    card: 16,
    surface: 20,
    chip: 9999,
    small: 6,
  },
  borderWidth: 1,
  shadow: {
    card: {
      offsetY: 2,
      radius: 8,
      opacity: 0.08,
      elevation: 2,
    },
    raised: {
      offsetY: 10,
      radius: 24,
      opacity: 0.12,
      elevation: 8,
    },
    overlay: {
      offsetY: 20,
      radius: 50,
      opacity: 0.22,
      elevation: 16,
    },
  },
  pressedScale: 0.98,
  scrimOpacity: 0.55,
  fontWeight: {
    heading: "700",
    title: "600",
    label: "600",
  },
  headingLetterSpacing: -0.6,
  typeScale: 1,
  density: 1.1,
  surface: "ring",
  field: "outline",
  press: "opacity",
  pressedOpacity: 0.85,
  control: {
    height: 44,
    paddingX: 18,
  },
} as const;
