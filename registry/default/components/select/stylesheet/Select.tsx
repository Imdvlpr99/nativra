/** Nativra — Select (StyleSheet). Install: npx nativra add select */
import React, { useState } from "react";
import { FlatList, Modal, Pressable, StyleSheet, Text, View, useColorScheme } from "react-native";

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
  const [open, setOpen] = useState(false);
  const dark = useColorScheme() === "dark";
  const fg = dark ? "#fafafa" : "#18181b";
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
          {
            backgroundColor: dark ? "#18181b" : "#ffffff",
            borderColor: dark ? "#3f3f46" : "#d4d4d8",
          },
          disabled && styles.disabled,
        ]}
      >
        <Text style={[styles.triggerText, { color: selectedOption ? fg : "#a1a1aa" }]}>
          {selectedOption ? selectedOption.label : placeholder}
        </Text>
        <Text style={styles.arrow}>▼</Text>
      </Pressable>

      <Modal visible={open} transparent animationType="slide" onRequestClose={() => setOpen(false)}>
        <View style={styles.backdrop}>
          <Pressable style={styles.flex1} onPress={() => setOpen(false)} />
          <View style={[styles.sheet, { backgroundColor: dark ? "#18181b" : "#ffffff" }]}>
            <View style={styles.sheetHeader}>
              <Text style={[styles.sheetTitle, { color: fg }]}>
                {label ?? "Select an option"}
              </Text>
              <Pressable onPress={() => setOpen(false)}>
                <Text style={styles.doneBtn}>Done</Text>
              </Pressable>
            </View>

            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => {
                const isSelected = item.value === value;
                return (
                  <Pressable
                    onPress={() => {
                      onValueChange(item.value);
                      setOpen(false);
                    }}
                    style={[
                      styles.row,
                      isSelected && { backgroundColor: dark ? "#082f49" : "#f0f9ff" },
                    ]}
                  >
                    <Text
                      style={[
                        styles.rowText,
                        { color: isSelected ? "#0284c7" : fg, fontWeight: isSelected ? "700" : "500" },
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

const styles = StyleSheet.create({
  wrap: { width: "100%", gap: 6 },
  label: { fontSize: 14, fontWeight: "500" },
  trigger: { height: 44, borderRadius: 12, borderWidth: 1, paddingHorizontal: 14, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  triggerText: { fontSize: 16 },
  arrow: { fontSize: 10, color: "#a1a1aa" },
  disabled: { opacity: 0.5 },
  backdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.6)", justifyContent: "flex-end" },
  flex1: { flex: 1 },
  sheet: { maxHeight: "60%", borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20 },
  sheetHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingBottom: 14, borderBottomWidth: 1, borderBottomColor: "#27272a", marginBottom: 8 },
  sheetTitle: { fontSize: 16, fontWeight: "700" },
  doneBtn: { fontSize: 15, fontWeight: "600", color: "#0284c7" },
  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 14, paddingHorizontal: 12, borderRadius: 12 },
  rowText: { fontSize: 16 },
  check: { fontSize: 14, fontWeight: "700", color: "#0284c7" },
});
