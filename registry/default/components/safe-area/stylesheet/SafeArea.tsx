import * as React from "react";
import { View, StyleSheet, type ViewProps, type StyleProp, type ViewStyle } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
  type Edge,
} from "react-native-safe-area-context";

export interface SafeAreaProps extends ViewProps {
  edges?: Edge[];
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
}

const SafeView = SafeAreaView as unknown as React.ComponentType<any>;

export function SafeArea({
  edges = ["top", "bottom", "left", "right"],
  style,
  children,
  ...props
}: SafeAreaProps) {
  return (
    <SafeView edges={edges} style={[styles.container, style]} {...props}>
      {children}
    </SafeView>
  );
}

export function SafeAreaInsetSpacer({ edge = "top" }: { edge?: "top" | "bottom" }) {
  const insets = useSafeAreaInsets();
  const height = edge === "top" ? insets.top : insets.bottom;
  return <View style={{ height }} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
});

