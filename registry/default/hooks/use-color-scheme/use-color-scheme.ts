/** Nativra — useColorScheme. Install: npx nativra add use-color-scheme */
import { useEffect, useState, useCallback } from "react";
import { useColorScheme as useRNColorScheme, Appearance } from "react-native";

export type ColorSchemeType = "light" | "dark" | "system";

export function useColorScheme() {
  const systemScheme = useRNColorScheme() ?? "light";
  const [override, setOverride] = useState<ColorSchemeType>("system");

  const activeScheme: "light" | "dark" = override === "system" ? systemScheme : override;

  const setColorScheme = useCallback((scheme: ColorSchemeType) => {
    setOverride(scheme);
    if (scheme !== "system") {
      Appearance.setColorScheme(scheme);
    }
  }, []);

  const toggle = useCallback(() => {
    setColorScheme(activeScheme === "dark" ? "light" : "dark");
  }, [activeScheme, setColorScheme]);

  return {
    colorScheme: activeScheme,
    isDark: activeScheme === "dark",
    setColorScheme,
    toggle,
  };
}

