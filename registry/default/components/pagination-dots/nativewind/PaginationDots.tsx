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
      accessibilityRole="adjustable"
      accessibilityLabel={`Page ${currentIndex + 1} of ${safeTotal}`}
      style={style}
      className={`flex-row items-center justify-center gap-1.5 ${className}`}
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
                ? "w-6 bg-sky-600 dark:bg-sky-400"
                : "w-2 bg-zinc-300 dark:bg-zinc-700"
            }`}
          />
        );
      })}
    </View>
  );
}

