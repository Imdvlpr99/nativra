/** Nativra — PaginationDots (StyleSheet). Install: npx nativra-cli add pagination-dots */
import React from "react";
import { Pressable, StyleSheet, View, type StyleProp, type ViewProps, type ViewStyle } from "react-native";
import { type ThemeColors, useThemeColors, sp } from "@/hooks/use-theme-colors";

export interface PaginationDotsProps extends ViewProps {
  total: number;
  currentIndex: number;
  onDotPress?: (index: number) => void;
  style?: StyleProp<ViewStyle>;
}

export function PaginationDots({
  total,
  currentIndex,
  onDotPress,
  style,
  ...rest
}: PaginationDotsProps) {
  const c = useThemeColors();
  const styles = React.useMemo(() => createStyles(c), [c]);
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
      style={[styles.container, style]}
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
            style={[styles.dot, isActive && styles.dotActive]}
          />
        );
      })}
    </View>
  );
}

const createStyles = (c: ThemeColors) => StyleSheet.create({
  container: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: sp(6) },
  dot: { width: 8, height: 8, borderRadius: 9999, backgroundColor: c.input },
  dotActive: { width: 24, backgroundColor: c.primary },
});

