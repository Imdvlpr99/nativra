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
    <View className="w-full gap-1.5">
      {label ? (
        <Text className="text-sm font-medium text-zinc-900 dark:text-zinc-50">{label}</Text>
      ) : null}

      <Pressable
        accessibilityRole="combobox"
        accessibilityState={{ disabled, expanded: open }}
        onPress={() => !disabled && setOpen(true)}
        disabled={disabled}
        className={`h-11 flex-row items-center justify-between rounded-xl border border-zinc-300 bg-white px-4 dark:border-zinc-700 dark:bg-zinc-900 ${
          disabled ? "opacity-50" : "active:opacity-85"
        }`}
      >
        <Text
          className={`text-base ${
            selectedOption ? "text-zinc-900 dark:text-zinc-50" : "text-zinc-400"
          }`}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </Text>
        <Text className="text-xs text-zinc-400">▼</Text>
      </Pressable>

      <Modal visible={open} transparent animationType="slide" onRequestClose={() => setOpen(false)}>
        <View className="flex-1 justify-end bg-black/60">
          <Pressable className="flex-1" onPress={() => setOpen(false)} />
          <View className="max-h-[60%] rounded-t-3xl border-t border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
            <View className="mb-4 flex-row items-center justify-between pb-2 border-b border-zinc-200 dark:border-zinc-800">
              <Text className="text-base font-bold text-zinc-900 dark:text-zinc-50">
                {label ?? "Select an option"}
              </Text>
              <Pressable onPress={() => setOpen(false)} className="p-1">
                <Text className="text-sm font-semibold text-sky-500">Done</Text>
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
                    className={`flex-row items-center justify-between py-3.5 px-3 rounded-xl ${
                      isSelected ? "bg-sky-50 dark:bg-sky-950/40" : "active:bg-zinc-100 dark:active:bg-zinc-800"
                    }`}
                  >
                    <Text
                      className={`text-base ${
                        isSelected
                          ? "font-bold text-sky-600 dark:text-sky-400"
                          : "text-zinc-800 dark:text-zinc-200"
                      }`}
                    >
                      {item.label}
                    </Text>
                    {isSelected ? (
                      <Text className="text-sm font-bold text-sky-600 dark:text-sky-400">✓</Text>
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

