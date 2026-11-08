/** Nativra — useReducedMotion. Install: npx nativra-cli add use-reduced-motion */
import { useEffect, useState } from "react";
import { AccessibilityInfo } from "react-native";

/**
 * Tracks the device's OS-level "Reduce Motion" accessibility setting
 * in real time on iOS and Android.
 */
export function useReducedMotion(): boolean {
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    let mounted = true;

    AccessibilityInfo.isReduceMotionEnabled()
      .then((enabled) => {
        if (mounted) setReduceMotion(Boolean(enabled));
      })
      .catch(() => {
        // Fallback if unsupported
      });

    const subscription = AccessibilityInfo.addEventListener(
      "reduceMotionChanged",
      (enabled) => {
        if (mounted) setReduceMotion(Boolean(enabled));
      }
    );

    return () => {
      mounted = false;
      subscription.remove();
    };
  }, []);

  return reduceMotion;
}

