/** Nativra — RadioGroup (StyleSheet). Install: npx nativra-cli add radio-group */
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { type ThemeColors, alpha, useThemeColors, themeStyle, ts, sp } from "@/hooks/use-theme-colors";

export interface RadioOption {
  label: string;
  value: string;
  description?: string;
  disabled?: boolean;
}

export interface RadioGroupProps {
  options: RadioOption[];
  value: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
}

export function RadioGroup({
  options,
  value,
  onValueChange,
  disabled = false,
}: RadioGroupProps) {
  const c = useThemeColors();
  const styles = createStyles(c);

  return (
    <View accessibilityRole="radiogroup" style={styles.group}>
      {options.map((opt) => {
        const isSelected = opt.value === value;
        const isDisabled = disabled || opt.disabled;

        return (
          <Pressable
            key={opt.value}
            accessibilityRole="radio"
            accessibilityState={{ selected: isSelected, disabled: isDisabled }}
            onPress={() => !isDisabled && onValueChange(opt.value)}
            disabled={isDisabled}
            style={[
              styles.item,
              {
                backgroundColor: isSelected
                  ? alpha(c.primary, 0.08)
                  : c.background,
                borderColor: isSelected
                  ? c.primary
                  : c.border,
              },
              isDisabled && styles.disabled,
            ]}
          >
            <View
              style={[
                styles.circle,
                { borderColor: isSelected ? c.primary : c.input },
              ]}
            >
              {isSelected ? <View style={styles.dot} /> : null}
            </View>

            <View style={styles.textWrap}>
              <Text style={[styles.label, { color: c.foreground }]}>
                {opt.label}
              </Text>
              {opt.description ? (
                <Text style={[styles.description, { color: c["muted-foreground"] }]}>
                  {opt.description}
                </Text>
              ) : null}
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

const createStyles = (c: ThemeColors) => StyleSheet.create({
  group: { width: "100%", gap: sp(12) },
  item: { flexDirection: "row", alignItems: "flex-start", gap: sp(12), borderRadius: themeStyle.radius.control, borderWidth: themeStyle.borderWidth, padding: sp(14) },
  disabled: { opacity: 0.5 },
  circle: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, alignItems: "center", justifyContent: "center", marginTop: 2 },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: c.primary },
  textWrap: { flex: 1 },
  label: { fontSize: ts(14), fontWeight: themeStyle.fontWeight.label },
  description: { fontSize: ts(12), marginTop: 2, lineHeight: ts(16) },
});

