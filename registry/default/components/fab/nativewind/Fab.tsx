import * as React from "react";
import { Pressable, Text, type PressableProps } from "react-native";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const fabVariants = cva(
  "absolute z-50 flex-row items-center justify-center rounded-full shadow-lg shadow-black/25 active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        primary: "bg-sky-500 text-white shadow-sky-500/30",
        secondary: "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900",
        accent: "bg-emerald-500 text-white shadow-emerald-500/30",
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
        true: "w-auto px-5 rounded-full gap-2",
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
      {label && <Text className="font-semibold text-white text-sm">{label}</Text>}
    </Pressable>
  );
}

