/** Nativra — DatePicker (NativeWind). Install: npx nativra-cli add date-picker */
import React, { useState } from "react";
import { Pressable, Text, View, type ViewProps } from "react-native";
import { elevation } from "@/hooks/use-theme-colors";

export interface DatePickerProps extends ViewProps {
  label?: string;
  value?: string;
  placeholder?: string;
  onChange?: (dateIso: string) => void;
  disabled?: boolean;
  className?: string;
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
  className = "",
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
    <View style={style} className={`w-full ${className}`} {...rest}>
      {label ? (
        <Text className="mb-1.5 type-xs weight-label text-foreground">
          {label}
        </Text>
      ) : null}

      <Pressable
        onPress={() => !disabled && setOpen(!open)}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityLabel={label ?? "Select date"}
        accessibilityState={{ expanded: open, disabled }}
        className={`flex-row items-center justify-between rounded-surface border border-border bg-card sp-px-3.5 sp-py-2.5 ${
          disabled ? "opacity-50" : "active:opacity-80"
        }`}
      >
        <View className="flex-row items-center sp-gap-2">
          <Text className="type-sm">📅</Text>
          <Text className="type-sm font-medium text-foreground">
            {displayValue}
          </Text>
        </View>
        <Text className="type-xs weight-label text-primary">
          {open ? "Close" : "Change"}
        </Text>
      </Pressable>

      {open ? (
        <View className="surface mt-2 rounded-surface sp-p-3" style={elevation("raised")}>
          <Text className="mb-2 type-2xs weight-title uppercase tracking-wider text-muted-foreground">
            November 2026
          </Text>
          <View className="flex-row flex-wrap sp-gap-1.5">
            {QUICK_DATES.map((item) => {
              const isSelected = item.value === activeVal;
              return (
                <Pressable
                  key={item.value}
                  onPress={() => handleSelect(item.value)}
                  accessibilityRole="button"
                  accessibilityState={{ selected: isSelected }}
                  className={`rounded-small sp-px-2.5 sp-py-1.5 border ${
                    isSelected
                      ? "bg-primary border-primary"
                      : "bg-muted border-border"
                  }`}
                >
                  <Text
                    className={`type-xs font-medium ${
                      isSelected ? "text-primary-foreground" : "text-foreground"
                    }`}
                  >
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

