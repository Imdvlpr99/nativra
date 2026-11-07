import * as React from "react";
import {
  View,
  StyleSheet,
  type ViewProps,
  type StyleProp,
  type ViewStyle,
} from "react-native";

export type StackDirection = "row" | "column";
export type StackAlign = "start" | "center" | "end" | "stretch";
export type StackJustify = "start" | "center" | "end" | "between" | "around";
export type StackGap = "none" | "xs" | "sm" | "md" | "lg" | "xl" | number;

export interface StackProps extends ViewProps {
  direction?: StackDirection;
  align?: StackAlign;
  justify?: StackJustify;
  gap?: StackGap;
  wrap?: boolean;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
}

const gapSizes: Record<string, number> = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

const alignMap: Record<StackAlign, ViewStyle["alignItems"]> = {
  start: "flex-start",
  center: "center",
  end: "flex-end",
  stretch: "stretch",
};

const justifyMap: Record<StackJustify, ViewStyle["justifyContent"]> = {
  start: "flex-start",
  center: "center",
  end: "flex-end",
  between: "space-between",
  around: "space-around",
};

export function Stack({
  direction = "column",
  align = "stretch",
  justify = "start",
  gap = "none",
  wrap = false,
  style,
  children,
  ...props
}: StackProps) {
  const gapValue = typeof gap === "number" ? gap : gapSizes[gap] ?? 0;

  const stackStyle: ViewStyle = {
    flexDirection: direction,
    alignItems: alignMap[align],
    justifyContent: justifyMap[justify],
    gap: gapValue,
    flexWrap: wrap ? "wrap" : "nowrap",
  };

  return (
    <View style={[stackStyle, style]} {...props}>
      {children}
    </View>
  );
}

export function VStack(props: Omit<StackProps, "direction">) {
  return <Stack direction="column" {...props} />;
}

export function HStack(props: Omit<StackProps, "direction">) {
  return <Stack direction="row" {...props} />;
}

export function ZStack({ style, children, ...props }: ViewProps & { style?: StyleProp<ViewStyle> }) {
  return (
    <View style={[styles.zstack, style]} {...props}>
      {React.Children.map(children, (child) => (
        <View style={StyleSheet.absoluteFill}>{child}</View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  zstack: {
    position: "relative",
  },
});

