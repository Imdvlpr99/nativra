import * as React from "react";
import { Pressable, Text, type PressableProps } from "react-native";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const fabVariants = cva(
  "absolute z-50 flex-row items-center justify-center rounded-full shadow-lg shadow-foreground/25 active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground shadow-primary/30",
        secondary: "bg-foreground text-background",
        accent: "bg-success text-success-foreground shadow-success/30",
      },
      size: {
        sm: "h-10 w-10",
        md: "h-14 w-14",
        lg: "h-16 w-16",
      },
      position: {
        "bottom-right": "bottom-6 right-6",
        "bottom-left": "bottom-6 left-6",
        "bottom-center": "bottom-6 left-1/2 -translate-x-1/2",
      },
      extended: {
        true: "w-auto sp-px-5 rounded-full sp-gap-2",
        false: "",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
      position: "bottom-right",
      extended: false,
    },
  }
);

export interface FabProps
  extends Omit<PressableProps, "children">,
    VariantProps<typeof fabVariants> {
  accessibilityLabel: string;
  label?: string;
  children?: React.ReactNode;
  className?: string;
}

export function Fab({
  variant,
  size,
  position,
  label,
  children,
  className,
  accessibilityLabel,
  disabled,
  onPress,
  ...props
}: FabProps) {
  const isExtended = Boolean(label);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || label || "Action"}
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      onPress={onPress}
      className={cn(fabVariants({ variant, size, position, extended: isExtended }), className)}
      {...props}
    >
      {children}
      {label && (
        <Text className={cn("weight-label type-sm", variant === "secondary" ? "text-background" : variant === "accent" ? "text-success-foreground" : "text-primary-foreground")}>
          {label}
        </Text>
      )}
    </Pressable>
  );
}

