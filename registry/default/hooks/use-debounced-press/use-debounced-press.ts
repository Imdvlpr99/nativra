/** Nativra — useDebouncedPress. Install: npx nativra-cli add use-debounced-press */
import { useCallback, useRef } from "react";

export interface UseDebouncedPressOptions {
  /** Minimum delay in milliseconds between accepted press events (default: 500ms) */
  delayMs?: number;
}

/**
 * Prevents accidental double-taps on navigation, checkout, or form actions
 * by ignoring rapid consecutive presses within `delayMs`.
 */
export function useDebouncedPress<T extends (...args: any[]) => unknown>(
  callback: T | undefined,
  options: UseDebouncedPressOptions = {}
): (...args: Parameters<T>) => void {
  const { delayMs = 500 } = options;
  const lastPressRef = useRef<number>(0);

  return useCallback(
    (...args: Parameters<T>) => {
      if (!callback) return;
      const now = Date.now();
      if (now - lastPressRef.current < delayMs) {
        return;
      }
      lastPressRef.current = now;
      callback(...args);
    },
    [callback, delayMs]
  );
}

