import * as React from "react";
import { View, type ViewProps } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
  type Edge,
} from "react-native-safe-area-context";
import { cn } from "@/lib/utils";

export interface SafeAreaProps extends ViewProps {
  edges?: Edge[];
  className?: string;
  children?: React.ReactNode;
}

export function SafeArea({
  edges = ["top", "bottom", "left", "right"],
  className,
  children,
  ...props
}: SafeAreaProps) {
  return (
    <SafeAreaView
      edges={edges}
      className={cn("flex-1 bg-white dark:bg-zinc-950", className)}
      {...props}
    >
      {children}
    </SafeAreaView>
  );
}

export function SafeAreaInsetSpacer({ edge = "top" }: { edge?: "top" | "bottom" }) {
  const insets = useSafeAreaInsets();
  const height = edge === "top" ? insets.top : insets.bottom;
  return <View style={{ height }} />;
}
