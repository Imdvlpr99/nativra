/** Nativra — PaginationDots (StyleSheet). Install: npx nativra-cli add pagination-dots */
import React from "react";
import { Pressable, StyleSheet, View, type ViewStyle } from "react-native";

export interface PaginationDotsProps {
  total: number;
  currentIndex: number;
  onDotPress?: (index: number) => void;
  style?: ViewStyle;
}

export function PaginationDots({
  total,
  currentIndex,
  onDotPress,
  style,
}: PaginationDotsProps) {
  const safeTotal = Math.max(1, total);

  return (
    <View
      accessibilityRole="adjustable"
      accessibilityLabel={`Page ${currentIndex + 1} of ${safeTotal}`}
      style={[styles.container, style]}
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
            style={[styles.dot, isActive && styles.dotActive]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6 },
  dot: { width: 8, height: 8, borderRadius: 9999, backgroundColor: "#d4d4d8" },
  dotActive: { width: 24, backgroundColor: "#0284c7" },
});

