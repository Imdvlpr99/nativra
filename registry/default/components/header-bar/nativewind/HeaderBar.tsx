/** Nativra — HeaderBar (NativeWind). Install: npx nativra-cli add header-bar */
import React from "react";
import { Pressable, Text, View, type ViewProps } from "react-native";

export interface HeaderBarProps extends ViewProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  rightLabel?: string;
  onRightPress?: () => void;
  elevated?: boolean;
  className?: string;
}

export function HeaderBar({
  title,
  subtitle,
  onBack,
  rightLabel,
  onRightPress,
  elevated = false,
  className = "",
  style,
  ...rest
}: HeaderBarProps) {
  return (
    <View
      accessibilityRole="header"
      style={style}
      className={`flex-row items-center justify-between border-b border-border bg-card sp-px-4 sp-py-3 ${
        elevated ? "shadow-sm" : ""
      } ${className}`}
      {...rest}
    >
      <View className="w-16 items-start">
        {onBack ? (
          <Pressable
            onPress={onBack}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            className="flex-row items-center sp-gap-1 rounded-button sp-py-1 sp-pr-2 active:opacity-70"
          >
            <Text className="type-base weight-title text-primary">‹</Text>
            <Text className="type-xs weight-label text-primary">Back</Text>
          </Pressable>
        ) : null}
      </View>

      <View className="flex-1 items-center sp-px-2">
        <Text
          numberOfLines={1}
          className="type-sm weight-title tracking-tight text-foreground"
        >
          {title}
        </Text>
        {subtitle ? (
          <Text numberOfLines={1} className="type-2xs text-muted-foreground">
            {subtitle}
          </Text>
        ) : null}
      </View>

      <View className="w-16 items-end">
        {rightLabel ? (
          <Pressable
            onPress={onRightPress}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel={rightLabel}
            className="rounded-button bg-primary/10 sp-px-2.5 sp-py-1 active:opacity-75"
          >
            <Text className="type-xs weight-label text-primary">
              {rightLabel}
            </Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

