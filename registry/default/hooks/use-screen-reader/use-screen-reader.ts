/** Nativra — useScreenReader. Install: npx nativra-cli add use-screen-reader */
import { useCallback, useEffect, useState } from "react";
import { AccessibilityInfo } from "react-native";

export interface UseScreenReaderResult {
  /** Whether iOS VoiceOver or Android TalkBack is currently enabled */
  isEnabled: boolean;
  /** Announces a polite message to the active screen reader */
  announce: (message: string) => void;
}

/**
 * Reactive hook for detecting iOS VoiceOver / Android TalkBack status
 * and dispatching live screen-reader announcements.
 */
export function useScreenReader(): UseScreenReaderResult {
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    let mounted = true;

    AccessibilityInfo.isScreenReaderEnabled()
      .then((enabled) => {
        if (mounted) setIsEnabled(Boolean(enabled));
      })
      .catch(() => {
        // Fallback if unsupported
      });

    const subscription = AccessibilityInfo.addEventListener(
      "screenReaderChanged",
      (enabled) => {
        if (mounted) setIsEnabled(Boolean(enabled));
      }
    );

    return () => {
      mounted = false;
      subscription.remove();
    };
  }, []);

  const announce = useCallback((message: string) => {
    if (!message) return;
    AccessibilityInfo.announceForAccessibility(message);
  }, []);

  return { isEnabled, announce };
}

