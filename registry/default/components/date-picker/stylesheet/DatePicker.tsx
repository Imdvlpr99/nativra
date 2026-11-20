/** Nativra — DatePicker (StyleSheet). Install: npx nativra-cli add date-picker */
import React, { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewProps, type ViewStyle } from "react-native";
import { type ThemeColors, useThemeColors, themeStyle, ts, sp, pressedStyle } from "@/hooks/use-theme-colors";

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
  style?: StyleProp<ViewStyle>;
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
  style,
  ...rest
}: DatePickerProps) {
  const c = useThemeColors();
  const styles = useMemo(() => createStyles(c), [c]);
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
    <View style={[styles.container, style]} {...rest}>
      {label ? <Text style={styles.label}>{label}</Text> : null}

      <Pressable
        onPress={toggle}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityLabel={`${label ?? "Date"}: ${selected ? format(selected, { dateStyle: "full" }) : "none selected"}`}
        accessibilityState={{ expanded: open, disabled }}
        style={({ pressed }) => [styles.trigger, disabled && styles.disabled, pressed && !disabled && styles.pressed]}
      >
        <View style={styles.triggerLeft}>
          <Text style={styles.icon}>📅</Text>
          <Text style={[styles.valueText, !selected && styles.placeholderText]}>
            {selected ? format(selected, { month: "short", day: "numeric", year: "numeric" }) : placeholder}
          </Text>
        </View>
        <Text style={styles.actionText}>{open ? "Close" : "Change"}</Text>
      </Pressable>

      {open ? (
        <View style={styles.dropdown}>
          <View style={styles.presetRow}>
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
                  accessibilityState={{ selected: isSelected, disabled: !allowed }} aria-selected={isSelected}
                  style={[styles.presetBtn, isSelected && styles.presetBtnSelected, !allowed && styles.disabled]}
                >
                  <Text style={[styles.presetText, isSelected && styles.presetTextSelected]}>{pick}</Text>
                </Pressable>
              );
            })}
          </View>

          <View style={styles.monthRow}>
            <Pressable onPress={() => shiftMonth(-1)} accessibilityRole="button" accessibilityLabel="Previous month" hitSlop={8} style={styles.navBtn}>
              <Text style={styles.navText}>‹</Text>
            </Pressable>
            <Text style={styles.monthHeader} accessibilityRole="header">
              {format(month, { month: "long", year: "numeric" })}
            </Text>
            <Pressable onPress={() => shiftMonth(1)} accessibilityRole="button" accessibilityLabel="Next month" hitSlop={8} style={styles.navBtn}>
              <Text style={styles.navText}>›</Text>
            </Pressable>
          </View>

          <View style={styles.week} importantForAccessibility="no-hide-descendants">
            {weekdays.map((d, i) => (
              <Text key={i} style={styles.weekday}>
                {d}
              </Text>
            ))}
          </View>
          {weeks.map((week, w) => (
            <View key={w} style={styles.week}>
              {week.map((date, i) => {
                if (!date) return <View key={i} style={styles.cell} />;
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
                    accessibilityState={{ selected: isSelected, disabled: !allowed }} aria-selected={isSelected}
                    style={styles.cell}
                  >
                    <View style={[styles.day, iso === todayIso && styles.today, isSelected && styles.daySelected]}>
                      <Text style={[styles.dayText, isSelected && styles.dayTextSelected, !allowed && styles.dayTextDisabled]}>
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
  placeholderText: { color: c["muted-foreground"], fontWeight: "400" },
  actionText: { fontSize: ts(12), fontWeight: themeStyle.fontWeight.label, color: c.primary },
  dropdown: {
    marginTop: 8,
    borderRadius: themeStyle.radius.surface,
    borderWidth: themeStyle.borderWidth,
    borderColor: c.border,
    backgroundColor: c.background,
    padding: sp(12),
  },
  presetRow: { flexDirection: "row", flexWrap: "wrap", gap: sp(6), marginBottom: sp(10) },
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
  monthRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: sp(6) },
  navBtn: { width: 32, height: 32, alignItems: "center", justifyContent: "center", borderRadius: themeStyle.radius.small },
  navText: { fontSize: ts(20), color: c.foreground },
  monthHeader: { fontSize: ts(14), fontWeight: themeStyle.fontWeight.title, color: c.foreground },
  week: { flexDirection: "row" },
  weekday: { width: `${100 / 7}%`, textAlign: "center", fontSize: ts(11), color: c["muted-foreground"], paddingVertical: sp(4) },
  cell: { width: `${100 / 7}%`, aspectRatio: 1, alignItems: "center", justifyContent: "center" },
  day: { width: "86%", height: "86%", alignItems: "center", justifyContent: "center", borderRadius: themeStyle.radius.small },
  today: { borderWidth: 1, borderColor: c.primary },
  daySelected: { backgroundColor: c.primary },
  dayText: { fontSize: ts(13), color: c.foreground },
  dayTextSelected: { color: c["primary-foreground"], fontWeight: themeStyle.fontWeight.label },
  dayTextDisabled: { color: c["muted-foreground"], opacity: 0.5 },
});
