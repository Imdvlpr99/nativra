/** Nativra — TimePicker (NativeWind). Install: npx nativra-cli add time-picker */
import React from "react";
import { Pressable, ScrollView, Text, View, type AccessibilityActionEvent, type StyleProp, type ViewStyle } from "react-native";

export interface TimePickerProps {
  label?: string;
  /** Controlled value, 24-hour "HH:mm" */
  value?: string;
  /** Starting value when uncontrolled, "HH:mm" (default: "09:00") */
  defaultValue?: string;
  onChange?: (time: string) => void;
  /** Minutes between options (default 5). A value off the step is still shown. */
  minuteStep?: number;
  /** 12 shows an AM/PM column; 24 shows 0-23. Default: the device locale's convention. */
  hourCycle?: 12 | 24;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  className?: string;
}

interface Option {
  value: number;
  label: string;
}

const ROW = 40;
const VISIBLE = 5;
const pad = (n: number) => String(n).padStart(2, "0");

/** "HH:mm" -> minutes since midnight, or null when malformed. */
function parse(time: string | undefined): number | null {
  const m = /^(\d{1,2}):(\d{2})$/.exec(time ?? "");
  if (!m) return null;
  const h = Number(m[1]);
  const min = Number(m[2]);
  return h < 24 && min < 60 ? h * 60 + min : null;
}
const format = (total: number) => `${pad(Math.floor(total / 60))}:${pad(total % 60)}`;

function localeHourCycle(): 12 | 24 {
  try {
    const cycle = new Intl.DateTimeFormat(undefined, { hour: "numeric" }).resolvedOptions().hourCycle;
    return cycle === "h23" || cycle === "h24" ? 24 : 12;
  } catch {
    return 12;
  }
}

export function TimePicker({
  label,
  value,
  defaultValue = "09:00",
  onChange,
  minuteStep = 5,
  hourCycle,
  disabled = false,
  style,
  className = "",
}: TimePickerProps) {
  const cycle = React.useMemo(() => hourCycle ?? localeHourCycle(), [hourCycle]);
  const [internal, setInternal] = React.useState(() => parse(defaultValue) ?? 9 * 60);
  const total = parse(value) ?? internal;
  const h24 = Math.floor(total / 60);
  const minute = total % 60;
  const pm = h24 >= 12;

  const set = (next: number) => {
    const wrapped = ((next % 1440) + 1440) % 1440;
    if (wrapped === total) return;
    if (value === undefined) setInternal(wrapped);
    onChange?.(format(wrapped));
  };

  const hours: Option[] =
    cycle === 24
      ? Array.from({ length: 24 }, (_, h) => ({ value: h, label: pad(h) }))
      : Array.from({ length: 12 }, (_, i) => ({ value: i === 0 ? 12 : i, label: String(i === 0 ? 12 : i) }));
  const step = Math.min(60, Math.max(1, Math.floor(minuteStep)));
  const minuteValues = Array.from({ length: Math.ceil(60 / step) }, (_, i) => i * step);
  if (!minuteValues.includes(minute)) minuteValues.push(minute);
  const minutes: Option[] = minuteValues.sort((a, b) => a - b).map((m) => ({ value: m, label: pad(m) }));
  const periods: Option[] = [
    { value: 0, label: "AM" },
    { value: 1, label: "PM" },
  ];

  const hourShown = cycle === 24 ? h24 : h24 % 12 === 0 ? 12 : h24 % 12;
  const selectHour = (h: number) => set((cycle === 24 ? h : (h % 12) + (pm ? 12 : 0)) * 60 + minute);

  return (
    <View className={`w-full sp-gap-1.5 ${className}`} style={style}>
      {label ? <Text className="type-sm weight-label text-foreground">{label}</Text> : null}
      <View
        className={`surface rounded-card flex-row items-center justify-center sp-px-3 overflow-hidden ${disabled ? "opacity-50" : ""}`}
        style={{ height: ROW * VISIBLE }}
      >
        <View
          pointerEvents="none"
          className="absolute left-2 right-2 rounded-control bg-muted"
          style={{ top: ROW * Math.floor(VISIBLE / 2), height: ROW }}
        />
        <Column label="Hour" options={hours} selected={hourShown} onSelect={selectHour} disabled={disabled} />
        <Text className="type-lg weight-title text-foreground">:</Text>
        <Column label="Minute" options={minutes} selected={minute} onSelect={(m) => set(h24 * 60 + m)} disabled={disabled} />
        {cycle === 12 ? (
          <Column
            label="AM or PM"
            options={periods}
            selected={pm ? 1 : 0}
            onSelect={(p) => set(((h24 % 12) + (p ? 12 : 0)) * 60 + minute)}
            disabled={disabled}
          />
        ) : null}
      </View>
    </View>
  );
}

interface ColumnProps {
  label: string;
  options: Option[];
  selected: number;
  onSelect: (value: number) => void;
  disabled: boolean;
}

/** One scrollable column. Screen readers see a single adjustable control (swipe up/down). */
function Column({ label, options, selected, onSelect, disabled }: ColumnProps) {
  const scroll = React.useRef<React.ComponentRef<typeof ScrollView>>(null);
  const index = Math.max(0, options.findIndex((o) => o.value === selected));
  const first = React.useRef(true);

  // Keep the selected option in the middle row.
  React.useEffect(() => {
    scroll.current?.scrollTo({ y: index * ROW, animated: !first.current });
    first.current = false;
  }, [index]);

  const settleAt = (y: number) => {
    const next = options[Math.min(options.length - 1, Math.max(0, Math.round(y / ROW)))];
    if (next && next.value !== selected) onSelect(next.value);
  };

  const onAccessibilityAction = (e: AccessibilityActionEvent) => {
    if (disabled) return;
    const delta = e.nativeEvent.actionName === "increment" ? 1 : e.nativeEvent.actionName === "decrement" ? -1 : 0;
    if (delta === 0) return;
    const next = options[(index + delta + options.length) % options.length];
    if (next) onSelect(next.value);
  };

  return (
    <View
      accessible
      accessibilityRole="adjustable"
      accessibilityLabel={label}
      accessibilityValue={{ text: options[index]?.label ?? "" }}
      accessibilityState={{ disabled }}
      accessibilityActions={[{ name: "increment" }, { name: "decrement" }]}
      onAccessibilityAction={onAccessibilityAction}
      className="w-16"
      style={{ height: ROW * VISIBLE }}
    >
      <ScrollView
        ref={scroll}
        showsVerticalScrollIndicator={false}
        scrollEnabled={!disabled}
        snapToInterval={ROW}
        decelerationRate="fast"
        nestedScrollEnabled
        // Padding lets the first and last options reach the middle row.
        contentContainerStyle={{ paddingVertical: ROW * Math.floor(VISIBLE / 2) }}
        onMomentumScrollEnd={(e) => settleAt(e.nativeEvent.contentOffset.y)}
        // A slow drag that is let go without a flick has no momentum phase.
        onScrollEndDrag={(e) => {
          if (Math.abs(e.nativeEvent.velocity?.y ?? 0) < 0.05) settleAt(e.nativeEvent.contentOffset.y);
        }}
      >
        {options.map((o) => {
          const active = o.value === selected;
          return (
            <Pressable
              key={o.value}
              disabled={disabled}
              onPress={() => onSelect(o.value)}
              accessibilityRole="button"
              accessibilityLabel={o.label}
              className="items-center justify-center"
              style={{ height: ROW }}
            >
              <Text
                className={`type-lg ${active ? "text-foreground weight-title" : "text-muted-foreground"}`}
                style={{ fontVariant: ["tabular-nums"] }}
              >
                {o.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}
