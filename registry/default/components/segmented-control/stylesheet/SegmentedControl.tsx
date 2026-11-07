/**
 * Nativra — SegmentedControl (StyleSheet)
 * @version 0.1.0
 * @target stylesheet
 * @platforms android, ios
 *
 * Copy this file into your project. You own this code.
 * Install: npx nativra add segmented-control
 */
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Pressable,
  Animated,
  StyleSheet,
  type LayoutChangeEvent,
  type ViewProps,
} from "react-native";

export interface SegmentedControlOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
  badge?: string | number;
  disabled?: boolean;
}

export interface SegmentedControlProps extends Omit<ViewProps, "children"> {
  values?: string[];
  options?: SegmentedControlOption[];
  value: string;
  onValueChange: (value: string) => void;
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
}

export function SegmentedControl({
  values,
  options: providedOptions,
  value,
  onValueChange,
  size = "md",
  disabled = false,
  style,
  ...props
}: SegmentedControlProps) {
  const options: SegmentedControlOption[] = React.useMemo(() => {
    if (providedOptions) return providedOptions;
    if (values) return values.map((v) => ({ value: v, label: v }));
    return [];
  }, [providedOptions, values]);

  const activeIndex = Math.max(
    0,
    options.findIndex((opt) => opt.value === value)
  );

  const [containerWidth, setContainerWidth] = useState(0);
  const animatedIndex = useRef(new Animated.Value(activeIndex)).current;

  useEffect(() => {
    Animated.spring(animatedIndex, {
      toValue: activeIndex,
      damping: 22,
      stiffness: 240,
      mass: 0.8,
      useNativeDriver: true,
    }).start();
  }, [activeIndex, animatedIndex]);

  const handleLayout = (e: LayoutChangeEvent) => {
    const w = e.nativeEvent.layout.width;
    if (w > 0) setContainerWidth(w);
  };

  const padding = 4;
  const count = options.length || 1;
  const availableWidth = Math.max(0, containerWidth - padding * 2);
  const itemWidth = availableWidth / count;

  const translateX = animatedIndex.interpolate({
    inputRange: options.map((_, i) => i),
    outputRange: options.map((_, i) => i * itemWidth),
    extrapolate: "clamp",
  });

  const sizeStyle =
    size === "sm" ? styles.containerSm : size === "lg" ? styles.containerLg : styles.containerMd;
  const textSizeStyle =
    size === "sm" ? styles.textSm : size === "lg" ? styles.textLg : styles.textMd;

  return (
    <View
      onLayout={handleLayout}
      accessibilityRole="tablist"
      style={[styles.container, sizeStyle, disabled && styles.disabled, style]}
      {...props}
    >
      {containerWidth > 0 && count > 0 && (
        <Animated.View
          style={[
            styles.indicator,
            {
              top: padding,
              bottom: padding,
              left: padding,
              width: itemWidth,
              transform: [{ translateX }],
            },
          ]}
        />
      )}

      {options.map((option) => {
        const isSelected = option.value === value;
        const isItemDisabled = disabled || option.disabled;

        return (
          <Pressable
            key={option.value}
            accessibilityRole="tab"
            accessibilityState={{ selected: isSelected, disabled: isItemDisabled }}
            accessibilityLabel={option.label}
            disabled={isItemDisabled}
            onPress={() => onValueChange(option.value)}
            style={styles.item}
          >
            {option.icon && <View style={styles.iconContainer}>{option.icon}</View>}
            <Text
              style={[
                styles.text,
                textSizeStyle,
                isSelected ? styles.textSelected : styles.textUnselected,
              ]}
              numberOfLines={1}
            >
              {option.label}
            </Text>
            {option.badge !== undefined && (
              <View style={[styles.badge, isSelected ? styles.badgeSelected : styles.badgeUnselected]}>
                <Text
                  style={[
                    styles.badgeText,
                    isSelected ? styles.badgeTextSelected : styles.badgeTextUnselected,
                  ]}
                >
                  {option.badge}
                </Text>
              </View>
            )}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    backgroundColor: "#18181b",
    borderWidth: 1,
    borderColor: "#27272a",
    padding: 4,
  },
  containerSm: {
    height: 36,
  },
  containerMd: {
    height: 44,
  },
  containerLg: {
    height: 52,
  },
  disabled: {
    opacity: 0.5,
  },
  indicator: {
    position: "absolute",
    borderRadius: 12,
    backgroundColor: "#27272a",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  item: {
    flex: 1,
    zIndex: 10,
    height: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
  },
  iconContainer: {
    marginRight: 6,
  },
  text: {
    textAlign: "center",
  },
  textSm: {
    fontSize: 12,
    fontWeight: "500",
  },
  textMd: {
    fontSize: 14,
    fontWeight: "500",
  },
  textLg: {
    fontSize: 16,
    fontWeight: "600",
  },
  textSelected: {
    color: "#ffffff",
    fontWeight: "600",
  },
  textUnselected: {
    color: "#a1a1aa",
  },
  badge: {
    marginLeft: 6,
    borderRadius: 9999,
    paddingHorizontal: 6,
    paddingVertical: 1,
  },
  badgeSelected: {
    backgroundColor: "#ffffff",
  },
  badgeUnselected: {
    backgroundColor: "#27272a",
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "700",
  },
  badgeTextSelected: {
    color: "#09090b",
  },
  badgeTextUnselected: {
    color: "#d4d4d8",
  },
});

