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
                "h-14 w-12 items-center justify-center rounded-2xl border-2 bg-white dark:bg-zinc-900 transition-all shadow-sm",
                error
                  ? "border-red-500 bg-red-50/20"
                  : isActive
                  ? "border-sky-500 ring-2 ring-sky-500/20"
                  : isFilled
                  ? "border-zinc-400 dark:border-zinc-600"
                  : "border-zinc-200 dark:border-zinc-800",
                disabled && "opacity-50"
              )}
            >
              <Text className="text-xl font-bold font-mono text-zinc-900 dark:text-zinc-50">
                {isFilled ? (secureTextEntry ? "•" : digit) : ""}
              </Text>
            </View>
          );
        })}
      </Pressable>
    </View>
  );
}

