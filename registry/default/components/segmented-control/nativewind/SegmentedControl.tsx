/**
 * Nativra — SegmentedControl (NativeWind)
 * @version 0.1.0
 * @target nativewind
 * @platforms android, ios
 *
 * Copy this file into your project. You own this code.
 * Install: npx nativra-cli add segmented-control
 */
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Pressable,
  Animated,
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
  className?: string;
}

export function SegmentedControl({
  values,
  options: providedOptions,
  value,
  onValueChange,
  size = "md",
  disabled = false,
  className = "",
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

  const heightClass =
    size === "sm" ? "h-9" : size === "lg" ? "h-13" : "h-11";
  const textClass =
    size === "sm" ? "text-xs" : size === "lg" ? "text-base font-semibold" : "text-sm font-medium";

  const translateX = animatedIndex.interpolate({
    inputRange: options.map((_, i) => i),
    outputRange: options.map((_, i) => i * itemWidth),
    extrapolate: "clamp",
  });

  return (
    <View
      onLayout={handleLayout}
      accessibilityRole="tablist"
      className={`relative w-full flex-row items-center rounded-2xl bg-zinc-100 p-1 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 ${heightClass} ${
        disabled ? "opacity-50" : ""
      } ${className}`.trim()}
      style={style}
      {...props}
    >
      {containerWidth > 0 && count > 0 && (
        <Animated.View
          style={{
            position: "absolute",
            top: padding,
            bottom: padding,
            left: padding,
            width: itemWidth,
            transform: [{ translateX }],
          }}
          className="rounded-xl bg-white shadow-sm dark:bg-zinc-800"
        />
      )}

      {options.map((option, index) => {
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
            className="flex-1 z-10 h-full flex-row items-center justify-center gap-1.5 px-2 active:opacity-80"
          >
            {option.icon && <View>{option.icon}</View>}
            <Text
              className={`${textClass} transition-colors ${
                isSelected
                  ? "text-zinc-950 dark:text-white font-semibold"
                  : "text-zinc-600 dark:text-zinc-400"
              }`}
              numberOfLines={1}
            >
              {option.label}
            </Text>
            {option.badge !== undefined && (
              <View
                className={`ml-1 rounded-full px-1.5 py-0.2 ${
                  isSelected
                    ? "bg-zinc-900 text-white dark:bg-white"
                    : "bg-zinc-200 dark:bg-zinc-800"
                }`}
              >
                <Text
                  className={`text-[10px] font-bold ${
                    isSelected
                      ? "text-white dark:text-zinc-950"
                      : "text-zinc-600 dark:text-zinc-300"
                  }`}
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

