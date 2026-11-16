import * as React from "react";
import { View, Text, Modal, Pressable } from "react-native";
import { cn } from "@/lib/utils";

export interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function BottomSheet({
  isOpen,
  onClose,
  title,
  children,
  className,
}: BottomSheetProps) {
  if (!isOpen) return null;

  return (
    <Modal
      transparent
      visible={isOpen}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end bg-scrim">
        {/* Backdrop Dismiss */}
        <Pressable accessibilityRole="button"
          className="absolute inset-0"
          onPress={onClose}
          accessibilityLabel="Dismiss bottom sheet"
        />

        {/* Sheet Content Panel */}
        <View
          className={cn(
            "w-full rounded-t-surface border-t border-border bg-card sp-p-6 sp-pb-10 shadow-2xl",
            className
          )}
        >
          {/* Grab Handle */}
          <View className="mb-4 items-center">
            <View className="h-1.5 w-12 rounded-full bg-muted" />
          </View>

          {title && (
            <Text className="mb-4 type-base weight-title text-foreground">
              {title}
            </Text>
          )}

          {children}
        </View>
      </View>
    </Modal>
  );
}

