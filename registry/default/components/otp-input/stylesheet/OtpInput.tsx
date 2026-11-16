import * as React from "react";
import {
  View,
  TextInput,
  Text,
  Pressable,
  Platform,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { type ThemeColors, alpha, useThemeColors, themeStyle, elevation, ts, sp } from "@/hooks/use-theme-colors";

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
  const styles = React.useMemo(() => createStyles(c), [c]);
  const inputRef = React.useRef<React.ComponentRef<typeof TextInput>>(null);
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
        // SMS code autofill: iOS reads textContentType, Android reads autoComplete.
        autoComplete={Platform.OS === "android" ? "sms-otp" : "one-time-code"}
        caretHidden
        // No maxLength: it would cut a pasted "123 456" before the space is removed. The
        // handler keeps digits only and trims to `length` itself.
        editable={!disabled}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        // Transparent and on top of the cells: a tap focuses it, a long press offers Paste.
        style={styles.hiddenInput}
        accessibilityLabel={`One-time code, ${length} digits`}
      />

      {/* Visible Cell Matrix */}
      <Pressable accessible={false} importantForAccessibility="no" onPress={handleCellPress} style={styles.cellRow}>
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
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 1,
    opacity: 0,
  },
  cellRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: sp(10),
  },
  cell: {
    width: 48,
    height: 56,
    borderRadius: themeStyle.radius.control,
    borderWidth: 2,
    borderColor: c.border,
    backgroundColor: c.background,
    alignItems: "center",
    justifyContent: "center",
    ...elevation("card"),
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
    fontSize: ts(22),
    fontWeight: themeStyle.fontWeight.title,
    fontFamily: "monospace",
    color: c.foreground,
  },
});

