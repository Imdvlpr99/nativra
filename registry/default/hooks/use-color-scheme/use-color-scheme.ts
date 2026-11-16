/** Nativra — useColorScheme. Install: npx nativra-cli add use-color-scheme */
import { useEffect, useState, useCallback } from "react";
import { useColorScheme as useRNColorScheme, Appearance } from "react-native";

export type ColorSchemeType = "light" | "dark" | "system";

export function useColorScheme() {
  const systemScheme = useRNColorScheme() ?? "light";
  const [override, setOverride] = useState<ColorSchemeType>("system");

  const activeScheme: "light" | "dark" = override === "system" ? systemScheme : override;

  const setColorScheme = useCallback((scheme: ColorSchemeType) => {
    setOverride(scheme);
    // "system" has to un-force the app too, or it stays on the last forced scheme. iOS and Android
    // follow the system for any value other than light/dark; React Native 0.82+ names it
    // "unspecified", which older type definitions don't list, hence the cast.
    Appearance.setColorScheme(
      (scheme === "system" ? "unspecified" : scheme) as Parameters<typeof Appearance.setColorScheme>[0]
    );
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

