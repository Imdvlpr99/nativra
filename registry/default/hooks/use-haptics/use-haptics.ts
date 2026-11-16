/** Nativra — useHaptics. Install: npx nativra-cli add use-haptics */
import { useCallback } from "react";
import { Platform } from "react-native";
// A static import: Metro resolves `import()` while bundling too, so a dynamic one never made
// expo-haptics optional. The item installs it.
import * as Haptics from "expo-haptics";

export function useHaptics() {
  const trigger = useCallback(
    async (
      type: "light" | "medium" | "heavy" | "success" | "warning" | "error" = "light"
    ) => {
      if (Platform.OS === "web") return;
      try {
        if (type === "light") {
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        } else if (type === "medium") {
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        } else if (type === "heavy") {
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        } else if (type === "success") {
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        } else if (type === "warning") {
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        } else if (type === "error") {
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        }
      } catch {
        // Haptics are a nicety: a device without them (simulators, some Android) just stays silent.
      }
    },
    []
  );

  return { trigger };
}

