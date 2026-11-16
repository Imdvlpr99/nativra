/** Nativra — DatePicker (NativeWind). Install: npx nativra-cli add date-picker */
import React, { useState } from "react";
import { Pressable, Text, View, type ViewProps } from "react-native";
import { elevation } from "@/hooks/use-theme-colors";

export interface DatePickerProps extends ViewProps {
  label?: string;
  /** Controlled value, "YYYY-MM-DD" ("" for none) */
  value?: string;
  /** Starting value when uncontrolled, "YYYY-MM-DD" */
  defaultValue?: string;
  placeholder?: string;
  onChange?: (dateIso: string) => void;
  /** Earliest selectable day, "YYYY-MM-DD" */
  minDate?: string;
  /** Latest selectable day, "YYYY-MM-DD" */
  maxDate?: string;
  /** BCP 47 locale for month and day names (default: the device's) */
  locale?: string;
  /** 0 = weeks start on Sunday, 1 = Monday */
  weekStartsOn?: 0 | 1;
  disabled?: boolean;
  className?: string;
}

// Dates are calendar days in local time: "2026-11-09" must never shift a day through UTC.
const pad = (n: number) => String(n).padStart(2, "0");
const toIso = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
function fromIso(iso: string | undefined): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso ?? "");
  if (!m) return null;
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  return toIso(d) === iso ? d : null; // rejects 2026-02-30
}
const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);

export function DatePicker({
  label,
  value,
  defaultValue,
  placeholder = "Select date...",
  onChange,
  minDate,
  maxDate,
  locale,
  weekStartsOn = 0,
  disabled = false,
  className = "",
  style,
  ...rest
}: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const [internal, setInternal] = useState(defaultValue ?? "");
  const selectedIso = value !== undefined ? value : internal;
  const selected = fromIso(selectedIso);

  const today = new Date();
  const todayIso = toIso(today);
  const [month, setMonth] = useState(() => {
    const base = selected ?? today;
    return new Date(base.getFullYear(), base.getMonth(), 1);
  });

  const inRange = (iso: string) => (!minDate || iso >= minDate) && (!maxDate || iso <= maxDate);
  // A malformed `locale` makes toLocaleDateString throw (RangeError): fall back to the device's.
  const format = (d: Date, options: Intl.DateTimeFormatOptions) => {
    try {
      return d.toLocaleDateString(locale, options);
    } catch {
      return d.toLocaleDateString(undefined, options);
    }
  };

  const select = (iso: string) => {
    if (!inRange(iso)) return;
    setInternal(iso);
    onChange?.(iso);
    setOpen(false);
  };
  const toggle = () => {
    if (disabled) return;
    // Opening shows the selected day's month, or this month.
    if (!open) setMonth(new Date((selected ?? today).getFullYear(), (selected ?? today).getMonth(), 1));
    setOpen(!open);
  };

  const quickPicks = [
    { label: "Today", date: today },
    { label: "Tomorrow", date: addDays(today, 1) },
    { label: "Next week", date: addDays(today, 7) },
    { label: "End of month", date: new Date(today.getFullYear(), today.getMonth() + 1, 0) },
  ];

  // Six weeks of cells starting on the configured weekday; days outside the month stay empty.
  const firstWeekday = (month.getDay() - weekStartsOn + 7) % 7;
  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const cells = Array.from({ length: 42 }, (_, i) => {
    const day = i - firstWeekday + 1;
    return day >= 1 && day <= daysInMonth ? new Date(month.getFullYear(), month.getMonth(), day) : null;
  });
  const weeks = Array.from({ length: 6 }, (_, w) => cells.slice(w * 7, w * 7 + 7)).filter((week) => week.some(Boolean));
  // 2023-01-01 was a Sunday: weekday names in the requested locale.
  const weekdays = Array.from({ length: 7 }, (_, i) => format(new Date(2023, 0, 1 + weekStartsOn + i), { weekday: "narrow" }));

  const shiftMonth = (delta: number) => setMonth(new Date(month.getFullYear(), month.getMonth() + delta, 1));

  return (
    <View style={style} className={`w-full ${className}`} {...rest}>
      {label ? <Text className="mb-1.5 type-xs weight-label text-foreground">{label}</Text> : null}

      <Pressable
        onPress={toggle}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityLabel={`${label ?? "Date"}: ${selected ? format(selected, { dateStyle: "full" }) : "none selected"}`}
        accessibilityState={{ expanded: open, disabled }}
        className={`flex-row items-center justify-between rounded-surface border border-border bg-card sp-px-3.5 sp-py-2.5 ${
          disabled ? "opacity-50" : "active:opacity-80"
        }`}
      >
        <View className="flex-row items-center sp-gap-2">
          <Text className="type-sm">📅</Text>
          <Text className={`type-sm ${selected ? "font-medium text-foreground" : "text-muted-foreground"}`}>
            {selected ? format(selected, { month: "short", day: "numeric", year: "numeric" }) : placeholder}
          </Text>
        </View>
        <Text className="type-xs weight-label text-primary">{open ? "Close" : "Change"}</Text>
      </Pressable>

      {open ? (
        <View className="surface mt-2 rounded-surface sp-p-3" style={elevation("raised")}>
          <View className="mb-2.5 flex-row flex-wrap sp-gap-1.5">
            {quickPicks.map(({ label: pick, date }) => {
              const iso = toIso(date);
              const allowed = inRange(iso);
              const isSelected = iso === selectedIso;
              return (
                <Pressable
                  key={pick}
                  onPress={() => select(iso)}
                  disabled={!allowed}
                  accessibilityRole="button"
                  accessibilityLabel={`${pick}, ${format(date, { dateStyle: "full" })}`}
                  accessibilityState={{ selected: isSelected, disabled: !allowed }}
                  className={`rounded-small border sp-px-2.5 sp-py-1.5 ${isSelected ? "border-primary bg-primary" : "border-border bg-muted"} ${
                    allowed ? "" : "opacity-50"
                  }`}
                >
                  <Text className={`type-xs font-medium ${isSelected ? "text-primary-foreground" : "text-foreground"}`}>{pick}</Text>
                </Pressable>
              );
            })}
          </View>

          <View className="mb-1.5 flex-row items-center justify-between">
            <Pressable
              onPress={() => shiftMonth(-1)}
              accessibilityRole="button"
              accessibilityLabel="Previous month"
              hitSlop={8}
              className="h-8 w-8 items-center justify-center rounded-small active:bg-muted"
            >
              <Text className="type-lg text-foreground">‹</Text>
            </Pressable>
            <Text accessibilityRole="header" className="type-sm weight-title text-foreground">
              {format(month, { month: "long", year: "numeric" })}
            </Text>
            <Pressable
              onPress={() => shiftMonth(1)}
              accessibilityRole="button"
              accessibilityLabel="Next month"
              hitSlop={8}
              className="h-8 w-8 items-center justify-center rounded-small active:bg-muted"
            >
              <Text className="type-lg text-foreground">›</Text>
            </Pressable>
          </View>

          <View className="flex-row" importantForAccessibility="no-hide-descendants">
            {weekdays.map((d, i) => (
              <Text key={i} className="w-[14.2857%] text-center type-2xs text-muted-foreground sp-py-1">
                {d}
              </Text>
            ))}
          </View>
          {weeks.map((week, w) => (
            <View key={w} className="flex-row">
              {week.map((date, i) => {
                if (!date) return <View key={i} className="aspect-square w-[14.2857%]" />;
                const iso = toIso(date);
                const allowed = inRange(iso);
                const isSelected = iso === selectedIso;
                return (
                  <Pressable
                    key={i}
                    onPress={() => select(iso)}
                    disabled={!allowed}
                    accessibilityRole="button"
                    accessibilityLabel={format(date, { dateStyle: "full" })}
                    accessibilityState={{ selected: isSelected, disabled: !allowed }}
                    className="aspect-square w-[14.2857%] items-center justify-center"
                  >
                    <View
                      className={`h-[86%] w-[86%] items-center justify-center rounded-small ${isSelected ? "bg-primary" : ""} ${
                        iso === todayIso && !isSelected ? "border border-primary" : ""
                      }`}
                    >
                      <Text
                        className={`type-sm ${
                          isSelected ? "weight-label text-primary-foreground" : allowed ? "text-foreground" : "text-muted-foreground opacity-50"
                        }`}
                      >
                        {date.getDate()}
                      </Text>
                    </View>
                  </Pressable>
                );
              })}
            </View>
          ))}
        </View>
      ) : null}
    </View>
  );
}
