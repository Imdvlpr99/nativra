/**
 * Nativra — Activity Timeline Block (NativeWind)
 * @version 0.1.0
 * @target nativewind
 * @platforms android, ios
 *
 * Copy this file into your project. You own this code.
 * Install: npx nativra-cli add activity-timeline
 */
import React from "react";
import { View } from "react-native";
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
  className?: string;
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
  className = "",
}: ActivityTimelineProps) {
  return (
    <View className={`w-full ${className}`.trim()}>
      {events.map((event, idx) => {
        const isLast = event.isLast ?? idx === events.length - 1;
        const dotBg =
          event.status === "success"
            ? "bg-emerald-500 border-emerald-400"
            : event.status === "warning"
            ? "bg-amber-500 border-amber-400"
            : event.status === "error"
            ? "bg-rose-500 border-rose-400"
            : "bg-sky-500 border-sky-400";

        return (
          <View key={event.id} className="flex-row">
            {/* Timeline Line & Node */}
            <View className="items-center mr-4 w-5">
              <View className={`w-3.5 h-3.5 rounded-full border-2 ${dotBg} z-10`} />
              {!isLast && <View className="w-0.5 flex-1 bg-zinc-800 my-1" />}
            </View>

            {/* Content Card */}
            <View className={`flex-1 ${!isLast ? "pb-6" : ""}`}>
              <View className="flex-row items-center justify-between gap-2">
                <Text className="font-semibold text-zinc-100 text-sm">
                  {event.title}
                </Text>
                <Text className="text-xs text-zinc-500">{event.timestamp}</Text>
              </View>

              {event.description && (
                <Text className="text-xs text-zinc-400 mt-1 leading-relaxed">
                  {event.description}
                </Text>
              )}

              {event.badge && (
                <View className="mt-2 flex-row">
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

