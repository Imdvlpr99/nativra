import * as React from "react";
import { View, type ViewProps } from "react-native";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const stackVariants = cva("flex", {
  variants: {
    direction: {
      column: "flex-col",
      row: "flex-row",
    },
    align: {
      start: "items-start",
      center: "items-center",
      end: "items-end",
      stretch: "items-stretch",
    },
    justify: {
      start: "justify-start",
      center: "justify-center",
      end: "justify-end",
      between: "justify-between",
      around: "justify-around",
    },
    gap: {
      none: "gap-0",
      xs: "gap-1",
      sm: "gap-2",
      md: "gap-4",
      lg: "gap-6",
      xl: "gap-8",
    },
    wrap: {
      true: "flex-wrap",
      false: "flex-nowrap",
    },
  },
  defaultVariants: {
    direction: "column",
    align: "stretch",
    justify: "start",
    gap: "none",
    wrap: false,
  },
});

export interface StackProps extends ViewProps, VariantProps<typeof stackVariants> {
  children?: React.ReactNode;
  className?: string;
}

export function Stack({
  direction,
  align,
  justify,
  gap,
  wrap,
  className,
  children,
  ...props
}: StackProps) {
  return (
    <View
      className={cn(stackVariants({ direction, align, justify, gap, wrap }), className)}
      {...props}
    >
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

export function ZStack({ className, children, ...props }: ViewProps & { className?: string }) {
  return (
    <View className={cn("relative", className)} {...props}>
      {React.Children.map(children, (child) => (
        <View className="absolute inset-0">{child}</View>
      ))}
    </View>
  );
}

