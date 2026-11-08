/**
 * Nativra — Activity Timeline Block (StyleSheet)
 * @version 0.1.0
 * @target stylesheet
 * @platforms android, ios
 *
 * Copy this file into your project. You own this code.
 * Install: npx nativra-cli add activity-timeline
 */
import React from "react";
import { StyleSheet, View, Text as RNText } from "react-native";
import { Badge } from "./Badge";
import { Text } from "./Text";

export interface TimelineEvent {
  id: string;
  title: string;
  description?: string;
  timestamp: string;
  badge?: string;
  status?: "default" | "success" | "warning" | "error";
  isLast?: boolean;
}

export interface ActivityTimelineProps {
  events?: TimelineEvent[];
  style?: object;
}

export function ActivityTimeline({
  events = [
    {
      id: "1",
      title: "Invoice #INV-2049 Paid",
      description: "Payment settled via Stripe webhook.",
      timestamp: "12m ago",
      badge: "Completed",
      status: "success",
    },
    {
      id: "2",
      title: "New Team Member Invited",
      description: "sarah@acme.corp added with Developer role.",
      timestamp: "1h ago",
      badge: "Security",
      status: "default",
    },
    {
      id: "3",
      title: "Database Backup Completed",
      description: "Automated snapshot encrypted and replicated to S3.",
      timestamp: "4h ago",
      badge: "System",
      status: "success",
      isLast: true,
    },
  ],
  style,
}: ActivityTimelineProps) {
  return (
    <View style={[styles.container, style]}>
      {events.map((event, idx) => {
        const isLast = event.isLast ?? idx === events.length - 1;
        const statusStyle =
          event.status === "success"
            ? styles.dotSuccess
            : event.status === "warning"
            ? styles.dotWarning
            : event.status === "error"
            ? styles.dotError
            : styles.dotDefault;

        return (
          <View key={event.id} style={styles.row}>
            {/* Timeline Spine */}
            <View style={styles.spineCol}>
              <View style={[styles.dot, statusStyle]} />
              {!isLast && <View style={styles.line} />}
            </View>

            {/* Event Body */}
            <View style={[styles.bodyCol, !isLast ? styles.pbExtra : null]}>
              <View style={styles.headerRow}>
                <Text style={styles.titleText}>{event.title}</Text>
                <RNText style={styles.timeText}>{event.timestamp}</RNText>
              </View>

              {event.description && (
                <RNText style={styles.descText}>{event.description}</RNText>
              )}

              {event.badge && (
                <View style={styles.badgeRow}>
                  <Badge size="sm" variant="secondary" label={event.badge} />
                </View>
              )}
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  row: {
    flexDirection: "row",
  },
  spineCol: {
    width: 20,
    alignItems: "center",
    marginRight: 16,
  },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    zIndex: 2,
  },
  dotDefault: {
    backgroundColor: "#0284c7",
    borderColor: "#38bdf8",
  },
  dotSuccess: {
    backgroundColor: "#10b981",
    borderColor: "#34d399",
  },
  dotWarning: {
    backgroundColor: "#f59e0b",
    borderColor: "#fbbf24",
  },
  dotError: {
    backgroundColor: "#ef4444",
    borderColor: "#f87171",
  },
  line: {
    width: 2,
    flex: 1,
    backgroundColor: "#27272a",
    marginVertical: 4,
  },
  bodyCol: {
    flex: 1,
  },
  pbExtra: {
    paddingBottom: 24,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  titleText: {
    fontWeight: "600",
    color: "#f4f4f5",
    fontSize: 14,
  },
  timeText: {
    fontSize: 12,
    color: "#71717a",
  },
  descText: {
    fontSize: 12,
    color: "#a1a1aa",
    marginTop: 4,
    lineHeight: 18,
  },
  badgeRow: {
    flexDirection: "row",
    marginTop: 8,
  },
});

