/**
 * Nativra — Empty State Block (NativeWind)
 * @version 0.1.0
 * @target nativewind
 * @platforms android, ios
 *
 * Copy this file into your project. You own this code.
 * Install: npx nativra-cli add empty-state
 */
import React from "react";
import { View } from "react-native";
import { Card } from "./Card";
import { Text } from "./Text";
import { Button } from "./Button";

export interface EmptyStateProps {
  icon?: string;
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  icon = "📭",
  title = "No items found",
  description = "You don't have any items yet. Create your first one to get started.",
  actionLabel = "Create item",
  onAction,
  className = "",
}: EmptyStateProps) {
  return (
    <Card padding="lg" className={`items-center justify-center text-center p-8 ${className}`.trim()}>
      <View className="mb-4 h-16 w-16 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
        <Text className="text-3xl">{icon}</Text>
      </View>
      <Text variant="h3" className="mb-2 text-center">
        {title}
      </Text>
      <Text variant="muted" className="mb-6 text-center max-w-xs">
        {description}
      </Text>
      {actionLabel && onAction && (
        <Button variant="default" size="md" onPress={onAction}>
          {actionLabel}
        </Button>
      )}
    </Card>
  );
}

