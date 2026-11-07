/** Nativra — RadioGroup (StyleSheet). Install: npx nativra add radio-group */
import React from "react";
import { Pressable, StyleSheet, Text, View, useColorScheme } from "react-native";

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
  const dark = useColorScheme() === "dark";

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
                  ? dark ? "#082f49" : "#f0f9ff"
                  : dark ? "#18181b" : "#ffffff",
                borderColor: isSelected
                  ? "#0284c7"
                  : dark ? "#27272a" : "#e4e4e7",
              },
              isDisabled && styles.disabled,
            ]}
          >
            <View
              style={[
                styles.circle,
                { borderColor: isSelected ? "#0284c7" : dark ? "#52525b" : "#a1a1aa" },
              ]}
            >
              {isSelected ? <View style={styles.dot} /> : null}
            </View>

            <View style={styles.textWrap}>
              <Text style={[styles.label, { color: dark ? "#fafafa" : "#18181b" }]}>
                {opt.label}
              </Text>
              {opt.description ? (
                <Text style={[styles.description, { color: dark ? "#a1a1aa" : "#71717a" }]}>
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

const styles = StyleSheet.create({
  group: { width: "100%", gap: 12 },
  item: { flexDirection: "row", alignItems: "flex-start", gap: 12, borderRadius: 14, borderWidth: 1, padding: 14 },
  disabled: { opacity: 0.5 },
  circle: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, alignItems: "center", justifyContent: "center", marginTop: 2 },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: "#0284c7" },
  textWrap: { flex: 1 },
  label: { fontSize: 14, fontWeight: "600" },
  description: { fontSize: 12, marginTop: 2, lineHeight: 16 },
});

