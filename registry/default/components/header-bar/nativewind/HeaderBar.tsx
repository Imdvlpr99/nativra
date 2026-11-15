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
      className={`flex-row items-center justify-between border-b border-border bg-card px-4 py-3 ${
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
            className="flex-row items-center gap-1 rounded-button py-1 pr-2 active:opacity-70"
          >
            <Text className="text-base font-bold text-primary">‹</Text>
            <Text className="text-xs font-semibold text-primary">Back</Text>
          </Pressable>
        ) : null}
      </View>

      <View className="flex-1 items-center px-2">
        <Text
          numberOfLines={1}
          className="text-sm font-bold tracking-tight text-foreground"
        >
          {title}
        </Text>
        {subtitle ? (
          <Text numberOfLines={1} className="text-[11px] text-muted-foreground">
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
            className="rounded-button bg-primary/10 px-2.5 py-1 active:opacity-75"
          >
            <Text className="text-xs font-semibold text-primary">
              {rightLabel}
            </Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

