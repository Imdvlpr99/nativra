/**
 * Nativra — Empty State Block (React Native StyleSheet)
 * @version 0.1.0
 * @target stylesheet
 * @platforms android, ios
 *
 * Copy this file into your project. You own this code.
 * Install: npx nativra-cli add empty-state
 */
import React from "react";
import { View, StyleSheet, type ViewStyle } from "react-native";
import { useThemeColors, ts, sp } from "@/hooks/use-theme-colors";
import { Card } from "./Card";
import { Text } from "./Text";
import { Button } from "./Button";

export interface EmptyStateProps {
  icon?: string;
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  style?: ViewStyle;
}

export function EmptyState({
  icon = "📭",
  title = "No items found",
  description = "You don't have any items yet. Create your first one to get started.",
  actionLabel = "Create item",
  onAction,
  style,
}: EmptyStateProps) {
  const palette = useThemeColors();

  return (
    <Card padding="lg" style={[styles.card, style]}>
      <View style={[styles.iconCircle, { backgroundColor: palette.muted }]}>
        <Text style={styles.icon}>{icon}</Text>
      </View>
      <Text variant="h3" style={styles.title}>
        {title}
      </Text>
      <Text variant="muted" style={styles.description}>
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

const styles = StyleSheet.create({
  card: {
    alignItems: "center",
    justifyContent: "center",
    padding: sp(32),
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  icon: {
    fontSize: ts(28),
  },
  title: {
    textAlign: "center",
    marginBottom: 8,
  },
  description: {
    textAlign: "center",
    maxWidth: 260,
    marginBottom: 24,
  },
});

