/**
 * Nativra — Switch (NativeWind)
 * @version 0.1.0
 * @target nativewind
 * @platforms android, ios
 *
 * Copy this file into your project. You own this code.
 * Install: npx nativra add switch
 */
import React from "react";
import { Switch as RNSwitch, type SwitchProps as RNSwitchProps } from "react-native";

export interface SwitchProps extends Omit<RNSwitchProps, "value" | "onValueChange"> {
  value: boolean;
  onValueChange: (val: boolean) => void;
  className?: string;
}

export function Switch({
  value,
  onValueChange,
  disabled = false,
  className = "",
  style,
  ...props
}: SwitchProps) {
  return (
    <RNSwitch
      value={value}
      onValueChange={onValueChange}
      disabled={disabled}
      trackColor={{
        false: "#71717a",
        true: "#18181b",
      }}
      thumbColor={value ? "#ffffff" : "#f4f4f5"}
      ios_backgroundColor="#71717a"
      className={className}
      style={style}
      {...props}
    />
  );
}

