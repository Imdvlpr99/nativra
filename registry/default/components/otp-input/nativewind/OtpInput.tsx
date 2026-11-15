import * as React from "react";
import { View, TextInput, Text, Pressable } from "react-native";
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
  const inputRef = React.useRef<TextInput>(null);
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
        maxLength={length}
        editable={!disabled}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="absolute h-0 w-0 opacity-0"
        accessibilityLabel="OTP pin input"
      />

      {/* Visible Cell Matrix */}
      <Pressable
        onPress={handleCellPress}
        className="flex-row items-center justify-center gap-2.5"
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
              <Text className="text-xl font-bold font-mono text-foreground">
                {isFilled ? (secureTextEntry ? "•" : digit) : ""}
              </Text>
            </View>
          );
        })}
      </Pressable>
    </View>
  );
}

