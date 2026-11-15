/**
 * Nativra — Switch (React Native StyleSheet)
 * @version 0.1.0
 * @target stylesheet
 * @platforms android, ios
 *
 * Copy this file into your project. You own this code.
 * Install: npx nativra-cli add switch
 */
import React from "react";
import {
  Switch as RNSwitch,
  type SwitchProps as RNSwitchProps,
} from "react-native";
import { useThemeColors } from "@/hooks/use-theme-colors";

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
  const c = useThemeColors();
  const activeTrack = c.primary;
  const inactiveTrack = c.input;
  const thumb = value ? c["primary-foreground"] : c.background;

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

