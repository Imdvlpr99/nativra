/** Nativra — Select (NativeWind). Install: npx nativra-cli add select */
import React, { useState } from "react";
import { FlatList, Modal, Pressable, Text, View } from "react-native";

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
  const selectedOption = options.find((o) => o.value === value);

  return (
    <View className="w-full sp-gap-1.5">
      {label ? (
        <Text className="type-sm font-medium text-foreground">{label}</Text>
      ) : null}

      <Pressable
        accessibilityRole="combobox"
        accessibilityState={{ disabled, expanded: open }}
        onPress={() => !disabled && setOpen(true)}
        disabled={disabled}
        className={`field min-h-control flex-row items-center justify-between rounded-control sp-px-4 ${
          disabled ? "opacity-50" : "active:opacity-85"
        }`}
      >
        <Text
          className={`type-base ${
            selectedOption ? "text-foreground" : "text-muted-foreground"
          }`}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </Text>
        <Text className="type-xs text-muted-foreground">▼</Text>
      </Pressable>

      <Modal visible={open} transparent animationType="slide" onRequestClose={() => setOpen(false)}>
        <View className="flex-1 justify-end bg-scrim" accessibilityViewIsModal>
          <Pressable accessible={false} importantForAccessibility="no" className="flex-1" onPress={() => setOpen(false)} />
          <View className="max-h-[60%] rounded-t-surface border-t border-border bg-card sp-p-5">
            <View className="mb-4 flex-row items-center justify-between sp-pb-2 border-b border-border">
              <Text className="type-base weight-title text-foreground">
                {label ?? "Select an option"}
              </Text>
              <Pressable accessibilityRole="button" onPress={() => setOpen(false)} className="sp-p-1">
                <Text className="type-sm weight-label text-primary">Done</Text>
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
                    className={`flex-row items-center justify-between sp-py-3.5 sp-px-3 rounded-control ${
                      isSelected ? "bg-primary/10" : "active:bg-muted"
                    }`}
                  >
                    <Text
                      className={`type-base ${
                        isSelected
                          ? "weight-title text-primary"
                          : "text-foreground"
                      }`}
                    >
                      {item.label}
                    </Text>
                    {isSelected ? (
                      <Text className="type-sm weight-title text-primary">✓</Text>
                    ) : null}
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

