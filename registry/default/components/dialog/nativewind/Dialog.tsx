/** Nativra — Dialog (NativeWind). Install: npx nativra add dialog */
import React from "react";
import { Modal, Pressable, Text, View } from "react-native";

export interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  destructive?: boolean;
  children?: React.ReactNode;
}

export function Dialog({
  open,
  onOpenChange,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  destructive = false,
  children,
}: DialogProps) {
  const handleCancel = () => {
    onCancel?.();
    onOpenChange(false);
  };

  const handleConfirm = () => {
    onConfirm?.();
    onOpenChange(false);
  };

  return (
    <Modal
      visible={open}
      transparent
      animationType="fade"
      onRequestClose={handleCancel}
    >
      <View className="flex-1 items-center justify-center bg-black/60 px-6">
        <Pressable className="absolute inset-0" onPress={handleCancel} />
        <View className="w-full max-w-sm rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900 z-10">
          <Text className="text-lg font-bold text-zinc-900 dark:text-zinc-50">{title}</Text>
          {description ? (
            <Text className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              {description}
            </Text>
          ) : null}

          {children ? <View className="mt-4">{children}</View> : null}

          <View className="mt-6 flex-row justify-end gap-3">
            <Pressable
              onPress={handleCancel}
              className="h-10 px-4 rounded-xl border border-zinc-300 dark:border-zinc-700 items-center justify-center active:opacity-75"
            >
              <Text className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                {cancelText}
              </Text>
            </Pressable>
            <Pressable
              onPress={handleConfirm}
              className={`h-10 px-4 rounded-xl items-center justify-center active:opacity-75 ${
                destructive ? "bg-red-600" : "bg-zinc-900 dark:bg-zinc-50"
              }`}
            >
              <Text
                className={`text-sm font-semibold ${
                  destructive ? "text-white" : "text-white dark:text-zinc-900"
                }`}
              >
                {confirmText}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
