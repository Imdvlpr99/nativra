/** Nativra — PaginationDots (NativeWind). Install: npx nativra-cli add pagination-dots */
import React from "react";
import { Pressable, View, type ViewProps } from "react-native";

export interface PaginationDotsProps extends ViewProps {
  total: number;
  currentIndex: number;
  onDotPress?: (index: number) => void;
  className?: string;
}

export function PaginationDots({
  total,
  currentIndex,
  onDotPress,
  className = "",
  style,
  ...rest
}: PaginationDotsProps) {
  const safeTotal = Math.max(1, total);

  return (
    <View
      // One element for screen readers. With onDotPress, a swipe up or down changes the page.
      accessible
      accessibilityRole={onDotPress ? "adjustable" : undefined}
      accessibilityLabel={`Page ${currentIndex + 1} of ${safeTotal}`}
      accessibilityValue={{ min: 1, max: safeTotal, now: currentIndex + 1 }}
      accessibilityActions={onDotPress ? [{ name: "increment" }, { name: "decrement" }] : undefined}
      onAccessibilityAction={(e) => {
        const next = currentIndex + (e.nativeEvent.actionName === "increment" ? 1 : e.nativeEvent.actionName === "decrement" ? -1 : 0);
        if (next !== currentIndex && next >= 0 && next < safeTotal) onDotPress?.(next);
      }}
      style={style}
      className={`flex-row items-center justify-center sp-gap-1.5 ${className}`}
      {...rest}
    >
      {Array.from({ length: safeTotal }).map((_, idx) => {
        const isActive = idx === currentIndex;
        return (
          <Pressable
            key={idx}
            onPress={() => onDotPress?.(idx)}
            hitSlop={6}
            accessibilityRole="button"
            accessibilityLabel={`Go to page ${idx + 1}`}
            accessibilityState={{ selected: isActive }}
            className={`h-2 rounded-full ${
              isActive
                ? "w-6 bg-primary"
                : "w-2 bg-muted"
            }`}
          />
        );
      })}
    </View>
  );
}

