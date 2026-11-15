/** Nativra — DatePicker (StyleSheet). Install: npx nativra-cli add date-picker */
import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewProps, type ViewStyle } from "react-native";
import { type ThemeColors, useThemeColors, themeStyle, ts, sp, pressedStyle } from "@/hooks/use-theme-colors";

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
  const c = useThemeColors();
  const styles = createStyles(c);
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

const createStyles = (c: ThemeColors) => StyleSheet.create({
  container: { width: "100%" },
  label: { marginBottom: 6, fontSize: ts(12), fontWeight: themeStyle.fontWeight.label, color: c.foreground },
  trigger: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: themeStyle.radius.surface,
    borderWidth: themeStyle.borderWidth,
    borderColor: c.border,
    backgroundColor: c.background,
    paddingHorizontal: sp(14),
    paddingVertical: sp(10),
  },
  disabled: { opacity: 0.5 },
  pressed: { ...pressedStyle(true) },
  triggerLeft: { flexDirection: "row", alignItems: "center", gap: sp(8) },
  icon: { fontSize: ts(14) },
  valueText: { fontSize: ts(14), fontWeight: "500", color: c.foreground },
  actionText: { fontSize: ts(12), fontWeight: themeStyle.fontWeight.label, color: c.primary },
  dropdown: {
    marginTop: 8,
    borderRadius: themeStyle.radius.surface,
    borderWidth: themeStyle.borderWidth,
    borderColor: c.border,
    backgroundColor: c.background,
    padding: sp(12),
  },
  monthHeader: {
    marginBottom: 8,
    fontSize: ts(11),
    fontWeight: themeStyle.fontWeight.title,
    letterSpacing: 0.6,
    color: c["muted-foreground"],
  },
  presetGrid: { flexDirection: "row", flexWrap: "wrap", gap: sp(6) },
  presetBtn: {
    borderRadius: themeStyle.radius.small,
    borderWidth: themeStyle.borderWidth,
    borderColor: c.border,
    backgroundColor: c.background,
    paddingHorizontal: sp(10),
    paddingVertical: sp(6),
  },
  presetBtnSelected: { backgroundColor: c.primary, borderColor: c.primary },
  presetText: { fontSize: ts(12), fontWeight: "500", color: c.foreground },
  presetTextSelected: { color: c["primary-foreground"], fontWeight: themeStyle.fontWeight.label },
});

