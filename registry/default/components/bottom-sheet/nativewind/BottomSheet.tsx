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
      <View className="flex-1 justify-end bg-black/50">
        {/* Backdrop Dismiss */}
        <Pressable
          className="absolute inset-0"
          onPress={onClose}
          accessibilityLabel="Dismiss bottom sheet"
        />

        {/* Sheet Content Panel */}
        <View
          className={cn(
            "w-full rounded-t-3xl border-t border-zinc-200 bg-white p-6 pb-10 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900",
            className
          )}
        >
          {/* Grab Handle */}
          <View className="mb-4 items-center">
            <View className="h-1.5 w-12 rounded-full bg-zinc-300 dark:bg-zinc-700" />
          </View>

          {title && (
            <Text className="mb-4 text-base font-bold text-zinc-900 dark:text-zinc-50">
              {title}
            </Text>
          )}

          {children}
        </View>
      </View>
    </Modal>
  );
}
