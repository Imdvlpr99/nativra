/** Nativra — Input (NativeWind). Install: npx nativra-cli add input */
import React from "react";
import { Text, TextInput, View, type TextInputProps } from "react-native";
import { field, themeStyle, useThemeColors } from "@/hooks/use-theme-colors";

export interface InputProps extends TextInputProps {
  label?: string;
  error?: boolean;
  errorMessage?: string;
  disabled?: boolean;
}

/** Forwards its ref to the TextInput, so forms can focus the next field (React 18 and 19). */
export const Input = React.forwardRef<React.ComponentRef<typeof TextInput>, InputProps>(function Input(
  { label, error = false, errorMessage, disabled = false, style, onFocus, onBlur, ...rest },
  ref
) {
  const palette = useThemeColors();
  const [focused, setFocused] = React.useState(false);
  const filled = themeStyle.field === "filled";
  return (
    <View className="w-full sp-gap-1.5">
      {label ? <Text className="type-sm weight-label text-foreground">{label}</Text> : null}
      <TextInput
        ref={ref}
        editable={!disabled}
        accessibilityLabel={rest.accessibilityLabel ?? label}
        accessibilityState={{ disabled }}
        placeholderTextColor={palette["muted-foreground"]}
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
        // `field` (outlined or filled, from the style) is the resting look; focus is drawn in JS.
        className={[
          "field rounded-control min-h-control sp-px-3.5 sp-py-2.5 type-base text-foreground",
          error ? (filled ? "border-b-2 border-destructive" : "border-destructive") : "",
          disabled ? "opacity-50" : "",
        ].join(" ")}
        style={[focused && !error ? field(palette, true) : null, style]}
        {...rest}
      />
      {error && errorMessage ? <Text className="type-xs text-destructive">{errorMessage}</Text> : null}
    </View>
  );
});
