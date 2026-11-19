/** Nativra — SwipeableRow (StyleSheet). Install: npx nativra-cli add swipeable-row */
import React from "react";
import {
  Animated,
  PanResponder,
  Pressable,
  StyleSheet,
  Text,
  View,
  type AccessibilityActionEvent,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { type ThemeColors, sp, themeStyle, ts, useThemeColors } from "@/hooks/use-theme-colors";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

export interface SwipeAction {
  label: string;
  onPress: () => void;
  variant?: "destructive" | "primary" | "secondary";
  icon?: React.ReactNode;
}

export interface SwipeableRowProps {
  children: React.ReactNode;
  /** Revealed by swiping left (Delete, Archive). The first action sits next to the row. */
  rightActions?: SwipeAction[];
  /** Revealed by swiping right (Mark read, Pin). */
  leftActions?: SwipeAction[];
  /** Width of each action button. */
  actionWidth?: number;
  onOpen?: (side: "left" | "right") => void;
  onClose?: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

export interface SwipeableRowHandle {
  /** Slides the row back. Call it when another row opens, or after an action. */
  close: () => void;
}

/**
 * A row that slides to reveal action buttons. Screen readers get the same actions through the
 * row's accessibility actions (swipe up/down on iOS, the actions menu on Android).
 */
export const SwipeableRow = React.forwardRef<SwipeableRowHandle, SwipeableRowProps>(function SwipeableRow(
  { children, rightActions = [], leftActions = [], actionWidth = 80, onOpen, onClose, disabled = false, style },
  ref
) {
  const c = useThemeColors();
  const styles = React.useMemo(() => createStyles(c), [c]);
  const reduceMotion = useReducedMotion();
  const translate = React.useRef(new Animated.Value(0)).current;
  const [open, setOpen] = React.useState<"left" | "right" | null>(null);

  // The responder is created once, so it reads the latest props through a ref.
  const latest = React.useRef({ rightActions, leftActions, actionWidth, onOpen, onClose, disabled, reduceMotion, offset: 0 });
  latest.current = { ...latest.current, rightActions, leftActions, actionWidth, onOpen, onClose, disabled, reduceMotion };

  const settle = React.useCallback(
    (to: number) => {
      const l = latest.current;
      const was = l.offset;
      l.offset = to;
      if (l.reduceMotion) translate.setValue(to);
      else Animated.spring(translate, { toValue: to, useNativeDriver: true, bounciness: 0, speed: 20 }).start();
      const side = to < 0 ? "right" : to > 0 ? "left" : null;
      setOpen(side);
      if (side && to !== was) l.onOpen?.(side);
      if (!side && was !== 0) l.onClose?.();
    },
    [translate]
  );

  React.useImperativeHandle(ref, () => ({ close: () => settle(0) }), [settle]);

  const responder = React.useMemo(() => {
    const limits = () => {
      const l = latest.current;
      return { min: -l.rightActions.length * l.actionWidth, max: l.leftActions.length * l.actionWidth };
    };
    const clamp = (x: number) => {
      const { min, max } = limits();
      return Math.min(max, Math.max(min, x));
    };
    // Capture: a Pressable inside the row already owns the touch, and a horizontal drag takes it over.
    const horizontal = (dx: number, dy: number) => !latest.current.disabled && Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(dy) * 1.5;
    return PanResponder.create({
      onMoveShouldSetPanResponderCapture: (_e, g) => horizontal(g.dx, g.dy),
      onMoveShouldSetPanResponder: (_e, g) => horizontal(g.dx, g.dy),
      onPanResponderTerminationRequest: () => false,
      onPanResponderMove: (_e, g) => translate.setValue(clamp(latest.current.offset + g.dx)),
      onPanResponderRelease: (_e, g) => {
        const { min, max } = limits();
        const x = clamp(latest.current.offset + g.dx);
        // Past halfway, or flicked, opens; anything else closes.
        if (min < 0 && (x < min / 2 || (g.vx < -0.5 && x < 0))) settle(min);
        else if (max > 0 && (x > max / 2 || (g.vx > 0.5 && x > 0))) settle(max);
        else settle(0);
      },
      onPanResponderTerminate: () => settle(latest.current.offset),
    });
  }, [translate, settle]);

  const run = (action: SwipeAction) => {
    settle(0);
    action.onPress();
  };
  const all = [...leftActions, ...rightActions];
  const onAccessibilityAction = (e: AccessibilityActionEvent) => {
    const action = all.find((a) => a.label === e.nativeEvent.actionName);
    if (action && !disabled) run(action);
  };

  const renderActions = (actions: SwipeAction[], side: "left" | "right") => (
    <View
      style={[styles.actions, side === "left" ? styles.left : styles.right]}
      // Hidden from screen readers while covered; they use the row's accessibility actions.
      importantForAccessibility={open === side ? "auto" : "no-hide-descendants"}
      accessibilityElementsHidden={open !== side}
    >
      {/* The first action sits next to the row: rightmost on the left side. */}
      {(side === "left" ? [...actions].reverse() : actions).map((action) => (
        <Pressable
          key={action.label}
          onPress={() => run(action)}
          accessibilityRole="button"
          accessibilityLabel={action.label}
          style={({ pressed }) => [styles.action, { width: actionWidth }, variantStyle(c, action.variant), pressed && styles.pressed]}
        >
          {action.icon}
          <Text style={[styles.actionLabel, { color: variantText(c, action.variant) }]} numberOfLines={1}>
            {action.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );

  return (
    <View style={[styles.container, style]}>
      {leftActions.length > 0 ? renderActions(leftActions, "left") : null}
      {rightActions.length > 0 ? renderActions(rightActions, "right") : null}
      <Animated.View
        style={[styles.content, { transform: [{ translateX: translate }] }]}
        accessibilityActions={disabled ? [] : all.map((a) => ({ name: a.label, label: a.label }))}
        onAccessibilityAction={onAccessibilityAction}
        {...responder.panHandlers}
      >
        {children}
      </Animated.View>
    </View>
  );
});

function variantStyle(c: ThemeColors, variant: SwipeAction["variant"] = "secondary"): ViewStyle {
  return { backgroundColor: variant === "destructive" ? c.destructive : variant === "primary" ? c.primary : c.muted };
}
function variantText(c: ThemeColors, variant: SwipeAction["variant"] = "secondary"): string {
  return variant === "destructive" ? c["destructive-foreground"] : variant === "primary" ? c["primary-foreground"] : c.foreground;
}

const createStyles = (c: ThemeColors) =>
  StyleSheet.create({
    container: { width: "100%", overflow: "hidden", backgroundColor: c.background },
    content: { backgroundColor: c.background },
    actions: { position: "absolute", top: 0, bottom: 0, flexDirection: "row" },
    left: { left: 0 },
    right: { right: 0 },
    action: { alignItems: "center", justifyContent: "center", gap: sp(4), paddingHorizontal: sp(8) },
    actionLabel: { fontSize: ts(13), fontWeight: themeStyle.fontWeight.label },
    pressed: { opacity: themeStyle.pressedOpacity },
  });
