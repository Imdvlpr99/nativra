import * as React from "react";
import { Pressable, ActivityIndicator, type PressableProps } from "react-native";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const iconButtonVariants = cva(
  "items-center justify-center rounded-xl transition-all active:scale-95 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-foreground text-background",
        primary: "bg-primary text-primary-foreground shadow-sm shadow-primary/20",
        secondary: "bg-muted text-foreground border border-border",
        destructive: "bg-destructive text-destructive-foreground shadow-sm shadow-red-600/20",
        outline: "border border-input bg-transparent text-foreground",
        ghost: "bg-transparent text-foreground hover:bg-muted",
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

