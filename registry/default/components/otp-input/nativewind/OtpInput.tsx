import * as React from "react";
import { View, TextInput, Text, Pressable, Platform } from "react-native";
import { cn } from "@/lib/utils";

export interface OtpInputProps {
  length?: number;
  value: string;
  onChangeText: (value: string) => void;
  disabled?: boolean;
  error?: boolean;
  secureTextEntry?: boolean;
  className?: string;
}

export function OtpInput({
  length = 6,
  value,
  onChangeText,
  disabled = false,
  error = false,
  secureTextEntry = false,
  className,
}: OtpInputProps) {
  const inputRef = React.useRef<React.ComponentRef<typeof TextInput>>(null);
  const [isFocused, setIsFocused] = React.useState(false);

  const handleCellPress = () => {
    if (!disabled) {
      inputRef.current?.focus();
    }
  };

  const digits = Array.from({ length }, (_, i) => value[i] ?? "");

  return (
    <View className={cn("w-full items-center justify-center", className)}>
      {/* Invisible Native Input */}
      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={(text) => {
          const cleaned = text.replace(/[^0-9]/g, "").slice(0, length);
          onChangeText(cleaned);
        }}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        // SMS code autofill: iOS reads textContentType, Android reads autoComplete.
        autoComplete={Platform.OS === "android" ? "sms-otp" : "one-time-code"}
        caretHidden
        // No maxLength: it would cut a pasted "123 456" before the space is removed. The
        // handler keeps digits only and trims to `length` itself.
        editable={!disabled}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        // Transparent and on top of the cells: a tap focuses it, a long press offers Paste.
        className="absolute inset-0 z-10 opacity-0"
        accessibilityLabel={`One-time code, ${length} digits`}
      />

      {/* Visible Cell Matrix */}
      <Pressable accessible={false} importantForAccessibility="no"
        onPress={handleCellPress}
        className="flex-row items-center justify-center sp-gap-2.5"
      >
        {digits.map((digit, idx) => {
          const isActive = isFocused && idx === Math.min(value.length, length - 1);
          const isFilled = digit.length > 0;

          return (
            <View
              key={idx}
              className={cn(
                "h-14 w-12 items-center justify-center rounded-control border-2 bg-card transition-all shadow-sm",
                error
                  ? "border-destructive bg-destructive/10"
                  : isActive
                  ? "border-primary ring-2 ring-ring/20"
                  : isFilled
                  ? "border-input"
                  : "border-border",
                disabled && "opacity-50"
              )}
            >
              <Text className="type-xl weight-title font-mono text-foreground">
                {isFilled ? (secureTextEntry ? "•" : digit) : ""}
              </Text>
            </View>
          );
        })}
      </Pressable>
    </View>
  );
}

