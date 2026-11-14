import * as React from "react";
import {
  View,
  TextInput,
  Text,
  Pressable,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { type ThemeColors, alpha, useThemeColors } from "@/hooks/use-theme-colors";

export interface OtpInputProps {
  length?: number;
  value: string;
  onChangeText: (value: string) => void;
  disabled?: boolean;
  error?: boolean;
  secureTextEntry?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function OtpInput({
  length = 6,
  value,
  onChangeText,
  disabled = false,
  error = false,
  secureTextEntry = false,
  style,
}: OtpInputProps) {
  const c = useThemeColors();
  const styles = createStyles(c);
  const inputRef = React.useRef<TextInput>(null);
  const [isFocused, setIsFocused] = React.useState(false);

  const handleCellPress = () => {
    if (!disabled) {
      inputRef.current?.focus();
    }
  };

  const digits = Array.from({ length }, (_, i) => value[i] ?? "");

  return (
    <View style={[styles.container, style]}>
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
        style={styles.hiddenInput}
        accessibilityLabel="OTP pin input"
      />

      {/* Visible Cell Matrix */}
      <Pressable onPress={handleCellPress} style={styles.cellRow}>
        {digits.map((digit, idx) => {
          const isActive = isFocused && idx === Math.min(value.length, length - 1);
          const isFilled = digit.length > 0;

          return (
            <View
              key={idx}
              style={[
                styles.cell,
                isFilled && styles.filledCell,
                isActive && styles.activeCell,
                error && styles.errorCell,
                disabled && styles.disabledCell,
              ]}
            >
              <Text style={styles.digitText}>
                {isFilled ? (secureTextEntry ? "•" : digit) : ""}
              </Text>
            </View>
          );
        })}
      </Pressable>
    </View>
  );
}

const createStyles = (c: ThemeColors) => StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  hiddenInput: {
    position: "absolute",
    width: 0,
    height: 0,
    opacity: 0,
  },
  cellRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  cell: {
    width: 48,
    height: 56,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: c.border,
    backgroundColor: c.background,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  filledCell: {
    borderColor: c.ring,
  },
  activeCell: {
    borderColor: c.primary,
    backgroundColor: alpha(c.primary, 0.08),
  },
  errorCell: {
    borderColor: c.destructive,
    backgroundColor: alpha(c.destructive, 0.08),
  },
  disabledCell: {
    opacity: 0.5,
  },
  digitText: {
    fontSize: 22,
    fontWeight: "700",
    fontFamily: "monospace",
    color: c.foreground,
  },
});

