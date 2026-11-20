/** Nativra — Select (StyleSheet). Install: npx nativra-cli add select */
import React, { useState } from "react";
import { FlatList, Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { type ThemeColors, alpha, field, scrim, useThemeColors, themeStyle, ts, sp } from "@/hooks/use-theme-colors";

export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectProps {
  label?: string;
  placeholder?: string;
  options: SelectOption[];
  value?: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
}

export function Select({
  label,
  placeholder = "Select an option...",
  options,
  value,
  onValueChange,
  disabled = false,
}: SelectProps) {
  const c = useThemeColors();
  const styles = React.useMemo(() => createStyles(c), [c]);
  const [open, setOpen] = useState(false);
  const fg = c.foreground;
  const selectedOption = options.find((o) => o.value === value);

  return (
    <View style={styles.wrap}>
      {label ? <Text style={[styles.label, { color: fg }]}>{label}</Text> : null}

      <Pressable
        accessibilityRole="combobox"
        accessibilityState={{ disabled, expanded: open }}
        onPress={() => !disabled && setOpen(true)}
        disabled={disabled}
        style={[
          styles.trigger,
          field(c, open),
          disabled && styles.disabled,
        ]}
      >
        <Text style={[styles.triggerText, { color: selectedOption ? fg : c["muted-foreground"] }]}>
          {selectedOption ? selectedOption.label : placeholder}
        </Text>
        <Text style={styles.arrow}>▼</Text>
      </Pressable>

      <Modal visible={open} transparent animationType="slide" onRequestClose={() => setOpen(false)}>
        <View style={styles.backdrop} accessibilityViewIsModal>
          <Pressable accessible={false} importantForAccessibility="no" style={styles.flex1} onPress={() => setOpen(false)} />
          <View style={[styles.sheet, { backgroundColor: c.background }]}>
            <View style={styles.sheetHeader}>
              <Text style={[styles.sheetTitle, { color: fg }]}>
                {label ?? "Select an option"}
              </Text>
              <Pressable accessibilityRole="button" onPress={() => setOpen(false)}>
                <Text style={styles.doneBtn}>Done</Text>
              </Pressable>
            </View>

            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => {
                const isSelected = item.value === value;
                return (
                  <Pressable accessibilityRole="button" accessibilityState={{ selected: isSelected }} aria-selected={isSelected}
                    onPress={() => {
                      onValueChange(item.value);
                      setOpen(false);
                    }}
                    style={[
                      styles.row,
                      isSelected && { backgroundColor: alpha(c.primary, 0.08) },
                    ]}
                  >
                    <Text
                      style={[
                        styles.rowText,
                        { color: isSelected ? c.primary : fg, fontWeight: isSelected ? "700" : "500" },
                      ]}
                    >
                      {item.label}
                    </Text>
                    {isSelected ? <Text style={styles.check}>✓</Text> : null}
                  </Pressable>
                );
              }}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const createStyles = (c: ThemeColors) => StyleSheet.create({
  wrap: { width: "100%", gap: sp(6) },
  label: { fontSize: ts(14), fontWeight: "500" },
  trigger: { minHeight: themeStyle.control.height, borderRadius: themeStyle.radius.control, paddingHorizontal: sp(14), flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  triggerText: { fontSize: ts(16) },
  arrow: { fontSize: ts(10), color: c["muted-foreground"] },
  disabled: { opacity: 0.5 },
  backdrop: { flex: 1, backgroundColor: scrim(), justifyContent: "flex-end" },
  flex1: { flex: 1 },
  sheet: { maxHeight: "60%", borderTopLeftRadius: themeStyle.radius.surface, borderTopRightRadius: themeStyle.radius.surface, padding: sp(20) },
  sheetHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingBottom: sp(14), borderBottomWidth: 1, borderBottomColor: c.border, marginBottom: 8 },
  sheetTitle: { fontSize: ts(16), fontWeight: themeStyle.fontWeight.title },
  doneBtn: { fontSize: ts(15), fontWeight: themeStyle.fontWeight.label, color: c.primary },
  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: sp(14), paddingHorizontal: sp(12), borderRadius: themeStyle.radius.control },
  rowText: { fontSize: ts(16) },
  check: { fontSize: ts(14), fontWeight: themeStyle.fontWeight.title, color: c.primary },
});

