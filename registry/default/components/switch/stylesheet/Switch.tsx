/**
 * Nativra — Switch (React Native StyleSheet)
 * @version 0.1.0
 * @target stylesheet
 * @platforms android, ios
 *
 * Copy this file into your project. You own this code.
 * Install: npx nativra add switch
 */
import React from "react";
import {
  Switch as RNSwitch,
  useColorScheme,
  type SwitchProps as RNSwitchProps,
} from "react-native";

export interface SwitchProps extends Omit<RNSwitchProps, "value" | "onValueChange"> {
  value: boolean;
  onValueChange: (val: boolean) => void;
}

export function Switch({
  value,
  onValueChange,
  disabled = false,
  style,
  ...props
}: SwitchProps) {
  const isDark = useColorScheme() === "dark";
  const activeTrack = isDark ? "#fafafa" : "#18181b";
  const inactiveTrack = isDark ? "#3f3f46" : "#e4e4e7";
  const thumb = isDark ? (value ? "#18181b" : "#a1a1aa") : (value ? "#ffffff" : "#f4f4f5");

  return (
    <RNSwitch
      value={value}
      onValueChange={onValueChange}
      disabled={disabled}
      trackColor={{
        false: inactiveTrack,
        true: activeTrack,
      }}
      thumbColor={thumb}
      ios_backgroundColor={inactiveTrack}
      style={style}
      {...props}
    />
  );
}

