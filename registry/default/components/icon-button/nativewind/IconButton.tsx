import * as React from "react";
import { Pressable, ActivityIndicator, type PressableProps } from "react-native";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const iconButtonVariants = cva(
  "items-center justify-center rounded-xl transition-all active:scale-95 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900",
        primary: "bg-sky-500 text-white shadow-sm shadow-sky-500/20",
        secondary: "bg-zinc-100 text-zinc-900 border border-zinc-200 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-100",
        destructive: "bg-red-600 text-white shadow-sm shadow-red-600/20",
        outline: "border border-zinc-300 bg-transparent text-zinc-900 dark:border-zinc-700 dark:text-zinc-100",
        ghost: "bg-transparent text-zinc-900 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800",
      },
      size: {
        sm: "h-9 w-9 rounded-lg",
        md: "h-11 w-11 rounded-xl",
        lg: "h-13 w-13 rounded-2xl",
      },
      rounded: {
        default: "rounded-xl",
        full: "rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      rounded: "default",
    },
  }
);

export interface IconButtonProps
  extends Omit<PressableProps, "children">,
    VariantProps<typeof iconButtonVariants> {
  accessibilityLabel: string;
  loading?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function IconButton({
  variant,
  size,
  rounded,
  loading = false,
  disabled = false,
  accessibilityLabel,
  accessibilityHint,
  children,
  className,
  onPress,
  ...props
}: IconButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: disabled || loading, busy: loading }}
      disabled={disabled || loading}
      onPress={onPress}
      className={cn(iconButtonVariants({ variant, size, rounded }), className)}
      hitSlop={size === "sm" ? 4 : 0}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === "outline" || variant === "ghost" ? "#71717A" : "#FFFFFF"}
        />
      ) : (
        children
      )}
    </Pressable>
  );
}

