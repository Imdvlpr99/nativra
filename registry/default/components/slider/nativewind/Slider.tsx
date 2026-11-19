/**
 * Nativra — Slider (NativeWind)
 * @target nativewind
 * @platforms android, ios
 *
 * Copy this file into your project. You own this code.
 * Install: npx nativra-cli add slider
 */
import React, { useMemo, useRef, useState } from "react";
import {
  I18nManager,
  PanResponder,
  View,
  type AccessibilityActionEvent,
  type GestureResponderEvent,
  type LayoutChangeEvent,
  type ViewProps,
} from "react-native";

export interface SliderProps extends ViewProps {
  /** Controlled value. Leave undefined and use `defaultValue` for an uncontrolled slider. */
  value?: number;
  /** Starting value when uncontrolled (default: the middle of the range) */
  defaultValue?: number;
  min?: number;
  max?: number;
  /** Values snap to multiples of `step` from `min` (default: 1) */
  step?: number;
  disabled?: boolean;
  /** Called with every new value while dragging, tapping, or adjusting with a screen reader */
  onValueChange?: (value: number) => void;
  /** Called once with the final value when a drag or tap ends */
  onSlidingComplete?: (value: number) => void;
  className?: string;
}

/** Clamps to [min, max] and snaps to the step grid, without floating-point dust (0.1 + 0.2). */
function snapValue(raw: number, min: number, max: number, step: number): number {
  if (!(max > min)) return min;
  const s = step > 0 ? step : 1;
  const snapped = min + Math.round((raw - min) / s) * s;
  return Math.min(max, Math.max(min, Number(snapped.toFixed(10))));
}

export function Slider({
  value,
  defaultValue,
  min = 0,
  max = 100,
  step = 1,
  disabled = false,
  onValueChange,
  onSlidingComplete,
  onLayout,
  className = "",
  ...props
}: SliderProps) {
  const [internal, setInternal] = useState(() => snapValue(defaultValue ?? (min + max) / 2, min, max, step));
  const current = snapValue(value ?? internal, min, max, step);
  const ratio = max > min ? (current - min) / (max - min) : 0;

  // The responder is created once, so it reads the latest props and layout through a ref.
  const latest = useRef({ current, min, max, step, disabled, width: 0, onValueChange, onSlidingComplete, controlled: value !== undefined });
  latest.current = { ...latest.current, current, min, max, step, disabled, onValueChange, onSlidingComplete, controlled: value !== undefined };
  const startX = useRef(0);
  /** True once the touch has moved horizontally; until then a parent ScrollView may take it. */
  const dragging = useRef(false);

  const commit = (next: number) => {
    const l = latest.current;
    if (next === l.current) return;
    l.current = next;
    if (!l.controlled) setInternal(next);
    l.onValueChange?.(next);
  };
  const valueAt = (x: number) => {
    const l = latest.current;
    if (l.width <= 0) return l.current;
    // Right-to-left: React Native mirrors the fill and thumb, but touches are measured from the
    // physical left edge, so the minimum is at the right.
    const fromStart = I18nManager.isRTL ? l.width - x : x;
    return snapValue(l.min + (fromStart / l.width) * (l.max - l.min), l.min, l.max, l.step);
  };

  const responder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => !latest.current.disabled,
        onMoveShouldSetPanResponder: (_e, g) => !latest.current.disabled && Math.abs(g.dx) > Math.abs(g.dy),
        // A parent ScrollView may take a touch that hasn't started dragging the thumb (a vertical
        // scroll that began on the slider); once the user drags horizontally, the slider keeps it.
        onPanResponderTerminationRequest: () => !dragging.current,
        // Children don't receive touches (pointerEvents="none"), so locationX is measured from
        // the slider itself rather than from the track or thumb under the finger.
        // Nothing is committed on touch-down, so a scroll that takes over leaves the value alone.
        onPanResponderGrant: (e: GestureResponderEvent) => {
          startX.current = e.nativeEvent.locationX;
          dragging.current = false;
        },
        onPanResponderMove: (_e, gesture) => {
          if (!dragging.current) {
            if (Math.abs(gesture.dx) < 4 || Math.abs(gesture.dx) < Math.abs(gesture.dy)) return;
            dragging.current = true;
          }
          commit(valueAt(startX.current + gesture.dx));
        },
        onPanResponderRelease: (_e, gesture) => {
          // A tap (or a drag that never passed the threshold) jumps to where the finger went down.
          if (!dragging.current) commit(valueAt(startX.current + gesture.dx));
          dragging.current = false;
          latest.current.onSlidingComplete?.(latest.current.current);
        },
        onPanResponderTerminate: () => {
          const wasDragging = dragging.current;
          dragging.current = false;
          if (wasDragging) latest.current.onSlidingComplete?.(latest.current.current);
        },
      }),
    // Created once on purpose: every handler reads props and layout through `latest`.
    []
  );

  const onAccessibilityAction = (e: AccessibilityActionEvent) => {
    if (disabled) return;
    const s = step > 0 ? step : 1;
    const action = e.nativeEvent.actionName;
    if (action !== "increment" && action !== "decrement") return;
    const next = snapValue(action === "increment" ? current + s : current - s, min, max, step);
    // Already at the limit: nothing changed, so no completion event either.
    if (next === current) return;
    commit(next);
    latest.current.onSlidingComplete?.(next);
  };

  return (
    <View
      accessible
      accessibilityRole="adjustable"
      accessibilityValue={{ min, max, now: current }}
      accessibilityState={{ disabled }}
      accessibilityActions={[{ name: "increment" }, { name: "decrement" }]}
      onAccessibilityAction={onAccessibilityAction}
      // Measured here for the drag math, then passed on: a caller's onLayout must not replace it.
      onLayout={(e: LayoutChangeEvent) => {
        latest.current.width = e.nativeEvent.layout.width;
        onLayout?.(e);
      }}
      // 32pt tall + 6pt above and below = the 44pt minimum touch target
      hitSlop={{ top: 6, bottom: 6 }}
      className={`relative w-full justify-center sp-py-3 ${disabled ? "opacity-50" : ""} ${className}`.trim()}
      {...responder.panHandlers}
      {...props}
    >
      <View pointerEvents="none" className="h-2 w-full overflow-hidden rounded-full bg-muted">
        <View className="h-full rounded-full bg-primary" style={{ width: `${ratio * 100}%` }} />
      </View>
      <View
        pointerEvents="none"
        className="absolute top-1/2 -ml-3.5 -mt-3.5 h-7 w-7 items-center justify-center rounded-full border-2 border-primary bg-background shadow-md"
        style={{ left: `${ratio * 100}%` }}
      />
    </View>
  );
}
