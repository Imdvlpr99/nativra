/** Nativra — DatePicker (StyleSheet). Install: npx nativra-cli add date-picker */
import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewProps, type ViewStyle } from "react-native";

export interface DatePickerProps extends ViewProps {
  label?: string;
  value?: string;
  placeholder?: string;
  onChange?: (dateIso: string) => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

const QUICK_DATES = [
  { label: "Today", value: "2026-11-09", display: "Nov 9, 2026" },
  { label: "Tomorrow", value: "2026-11-10", display: "Nov 10, 2026" },
  { label: "Next Week", value: "2026-11-16", display: "Nov 16, 2026" },
  { label: "End of Month", value: "2026-11-30", display: "Nov 30, 2026" },
];

export function DatePicker({
  label,
  value,
  placeholder = "Select date...",
  onChange,
  disabled = false,
  style,
  ...rest
}: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const [internalVal, setInternalVal] = useState(value ?? "2026-11-09");
  const activeVal = value !== undefined ? value : internalVal;

  const selectedEntry = QUICK_DATES.find((d) => d.value === activeVal);
  const displayValue = selectedEntry ? selectedEntry.display : activeVal || placeholder;

  const handleSelect = (iso: string) => {
    setInternalVal(iso);
    onChange?.(iso);
    setOpen(false);
  };

  return (
    <View style={[styles.container, style]} {...rest}>
      {label ? <Text style={styles.label}>{label}</Text> : null}

      <Pressable
        onPress={() => !disabled && setOpen(!open)}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityLabel={label ?? "Select date"}
        accessibilityState={{ expanded: open, disabled }}
        style={({ pressed }) => [
          styles.trigger,
          disabled && styles.disabled,
          pressed && !disabled && styles.pressed,
        ]}
      >
        <View style={styles.triggerLeft}>
          <Text style={styles.icon}>📅</Text>
          <Text style={styles.valueText}>{displayValue}</Text>
        </View>
        <Text style={styles.actionText}>{open ? "Close" : "Change"}</Text>
      </Pressable>

      {open ? (
        <View style={styles.dropdown}>
          <Text style={styles.monthHeader}>NOVEMBER 2026</Text>
          <View style={styles.presetGrid}>
            {QUICK_DATES.map((item) => {
              const isSelected = item.value === activeVal;
              return (
                <Pressable
                  key={item.value}
                  onPress={() => handleSelect(item.value)}
                  accessibilityRole="button"
                  accessibilityState={{ selected: isSelected }}
                  style={[styles.presetBtn, isSelected && styles.presetBtnSelected]}
                >
                  <Text style={[styles.presetText, isSelected && styles.presetTextSelected]}>
                    {item.label} ({item.display.replace(", 2026", "")})
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: "100%" },
  label: { marginBottom: 6, fontSize: 12, fontWeight: "600", color: "#3f3f46" },
  trigger: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e4e4e7",
    backgroundColor: "#ffffff",
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  disabled: { opacity: 0.5 },
  pressed: { opacity: 0.8 },
  triggerLeft: { flexDirection: "row", alignItems: "center", gap: 8 },
  icon: { fontSize: 14 },
  valueText: { fontSize: 14, fontWeight: "500", color: "#18181b" },
  actionText: { fontSize: 12, fontWeight: "600", color: "#0284c7" },
  dropdown: {
    marginTop: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e4e4e7",
    backgroundColor: "#ffffff",
    padding: 12,
  },
  monthHeader: {
    marginBottom: 8,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.6,
    color: "#a1a1aa",
  },
  presetGrid: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  presetBtn: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e4e4e7",
    backgroundColor: "#fafafa",
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  presetBtnSelected: { backgroundColor: "#0284c7", borderColor: "#0284c7" },
  presetText: { fontSize: 12, fontWeight: "500", color: "#3f3f46" },
  presetTextSelected: { color: "#ffffff", fontWeight: "600" },
});

