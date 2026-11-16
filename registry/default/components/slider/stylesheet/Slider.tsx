/**
 * Nativra — Slider (StyleSheet)
 * @version 0.1.0
 * @target stylesheet
 * @platforms android, ios
 *
 * Copy this file into your project. You own this code.
 * Install: npx nativra-cli add slider --target stylesheet
 */
import React from "react";
import { View, Pressable, StyleSheet, type GestureResponderEvent, type ViewProps } from "react-native";
import { type ThemeColors, useThemeColors, elevation, sp } from "@/hooks/use-theme-colors";

export interface SliderProps extends ViewProps {
  value?: number;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  onValueChange?: (value: number) => void;
}

export function Slider({
  value = 50,
  min = 0,
  max = 100,
  disabled = false,
  onValueChange,
  style,
  ...props
}: SliderProps) {
  const c = useThemeColors();
  const styles = createStyles(c);
  const percentage = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));

  const handlePress = (e: GestureResponderEvent) => {
    if (disabled || !onValueChange) return;
    const { locationX } = e.nativeEvent;
    const ratio = Math.max(0, Math.min(1, locationX / 200));
    const nextVal = Math.round(min + ratio * (max - min));
    onValueChange(nextVal);
  };

  return (
    <Pressable
      accessibilityRole="adjustable"
      accessibilityValue={{ min, max, now: value }}
      disabled={disabled}
      onPress={handlePress}
      style={[styles.container, disabled && styles.disabled, style]}
      {...props}
    >
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${percentage}%` }]} />
      </View>
      <View style={[styles.thumb, { left: `${percentage}%` }]} />
    </Pressable>
  );
}

const createStyles = (c: ThemeColors) => StyleSheet.create({
  container: {
    width: "100%",
    paddingVertical: sp(12),
    justifyContent: "center",
    position: "relative",
  },
  disabled: {
    opacity: 0.5,
  },
  track: {
    height: 8,
    width: "100%",
    borderRadius: 9999,
    backgroundColor: c.muted,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    borderRadius: 9999,
    backgroundColor: c.primary,
  },
  thumb: {
    position: "absolute",
    top: "50%",
    marginTop: -14,
    marginLeft: -14,
    height: 28,
    width: 28,
    borderRadius: 14,
    backgroundColor: c.background,
    borderWidth: 2,
    borderColor: c.primary,
    ...elevation("card"),
  },
});

