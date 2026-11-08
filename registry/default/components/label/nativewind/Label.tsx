/**
 * Nativra — Label (NativeWind)
 * @version 0.1.0
 * @target nativewind
 * @platforms android, ios
 *
 * Copy this file into your project. You own this code.
 * Install: npx nativra-cli add label
 */
import React from "react";
import { Text, View, type TextProps } from "react-native";

export interface LabelProps extends TextProps {
  children: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

export function Label({
  children,
  required = false,
  disabled = false,
  className = "",
  style,
  ...props
}: LabelProps) {
  return (
    <View className="flex-row items-center mb-1.5">
      <Text
        accessibilityRole="text"
        className={`text-sm font-medium text-zinc-900 dark:text-zinc-100 ${
          disabled ? "opacity-50" : ""
        } ${className}`.trim()}
        style={style}
        {...props}
      >
        {children}
      </Text>
      {required ? (
        <Text className="text-red-500 ml-1 text-sm font-bold" accessibilityLabel="required">
          *
        </Text>
      ) : null}
    </View>
  );
}

