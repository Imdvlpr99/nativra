/**
 * Nativra — Chat Bubble Block (NativeWind)
 * @version 0.1.0
 * @target nativewind
 * @platforms android, ios
 *
 * Copy this file into your project. You own this code.
 * Install: npx nativra-cli add chat-bubble
 */
import React from "react";
import { Pressable, Text, View, type StyleProp, type ViewStyle } from "react-native";
import { AlertCircle, Check, CheckCheck, Clock } from "lucide-react-native";
import { Avatar } from "./Avatar";
import { themeStyle, ts, useThemeColors } from "@/hooks/use-theme-colors";

export type MessageStatus = "sending" | "sent" | "delivered" | "read" | "failed";

export interface ChatBubbleProps {
  text: string;
  /** "me" sits on the right in the primary color; "them" on the left with an avatar. */
  from: "me" | "them";
  /** Display time, e.g. "14:20". */
  time?: string;
  /** Delivery state of your own messages. */
  status?: MessageStatus;
  /** Sender name and avatar for "them". */
  senderName?: string;
  avatarUrl?: string;
  /**
   * Position in a run of messages from one sender: the avatar shows on the last, and the corners
   * next to neighbours tighten. Default "single".
   */
  position?: "single" | "first" | "middle" | "last";
  /** Long press, e.g. to copy or react. */
  onLongPress?: () => void;
  /** Shown on failed messages. */
  onRetry?: () => void;
  style?: StyleProp<ViewStyle>;
  className?: string;
}

const STATUS_LABEL: Record<MessageStatus, string> = {
  sending: "Sending",
  sent: "Sent",
  delivered: "Delivered",
  read: "Read",
  failed: "Not sent",
};

/** One chat message, with grouping, delivery ticks, a failed state with retry, and an avatar for others. */
export function ChatBubble({
  text,
  from,
  time,
  status,
  senderName,
  avatarUrl,
  position = "single",
  onLongPress,
  onRetry,
  style,
  className = "",
}: ChatBubbleProps) {
  const palette = useThemeColors();
  const mine = from === "me";
  const showAvatar = !mine && (position === "single" || position === "last");
  const failed = mine && status === "failed";
  const tight = 4;
  const r = themeStyle.radius.card;
  // Corners facing the sender's other messages tighten, so a run reads as one block.
  const corners: ViewStyle = mine
    ? {
        borderTopRightRadius: position === "middle" || position === "last" ? tight : r,
        borderBottomRightRadius: position === "first" || position === "middle" ? tight : r,
      }
    : {
        borderTopLeftRadius: position === "middle" || position === "last" ? tight : r,
        borderBottomLeftRadius: position === "first" || position === "middle" ? tight : r,
      };
  const meta = [time, mine && status ? STATUS_LABEL[status] : null].filter(Boolean).join(", ");
  const tickColor = palette["primary-foreground"];
  // Read ticks are solid; sent and delivered ones are dimmer.
  const tickOpacity = status === "read" ? 1 : 0.7;
  const grouped = position === "first" || position === "middle";

  return (
    <View className={`flex-row items-end px-3 ${grouped ? "mb-0.5" : "mb-2"} ${mine ? "justify-end" : "justify-start"} ${className}`} style={style}>
      {!mine ? (
        <View className="w-8 mr-2">
          {showAvatar ? <Avatar size="sm" fallback={(senderName ?? "?").slice(0, 2).toUpperCase()} {...(avatarUrl ? { src: avatarUrl } : {})} /> : null}
        </View>
      ) : null}
      <View className={mine ? "items-end" : "items-start"} style={{ maxWidth: "78%" }}>
        <Pressable
          onLongPress={onLongPress}
          disabled={!onLongPress}
          accessibilityRole="text"
          accessibilityLabel={`${mine ? "You" : (senderName ?? "Them")}: ${text}${meta ? `. ${meta}` : ""}`}
          accessibilityHint={onLongPress ? "Long press for options" : undefined}
          className={`px-3 py-2 rounded-card ${mine ? "bg-primary" : "bg-muted"} ${failed ? "opacity-60" : ""}`}
          style={corners}
        >
          <Text className={`type-base ${mine ? "text-primary-foreground" : "text-foreground"}`}>{text}</Text>
          {time || (mine && status) ? (
            <View className="flex-row items-center justify-end sp-gap-1 mt-0.5" importantForAccessibility="no-hide-descendants" accessibilityElementsHidden>
              {time ? (
                <Text
                  className={`type-xs ${mine ? "text-primary-foreground opacity-75" : "text-muted-foreground"}`}
                  style={{ fontVariant: ["tabular-nums"] }}
                >
                  {time}
                </Text>
              ) : null}
              {mine && status === "sending" ? <Clock size={ts(12)} color={tickColor} opacity={tickOpacity} /> : null}
              {mine && status === "sent" ? <Check size={ts(13)} color={tickColor} opacity={tickOpacity} /> : null}
              {mine && (status === "delivered" || status === "read") ? (
                <CheckCheck size={ts(14)} color={tickColor} opacity={tickOpacity} strokeWidth={status === "read" ? 3 : 2} />
              ) : null}
            </View>
          ) : null}
        </Pressable>
        {failed ? (
          <Pressable
            onPress={onRetry}
            disabled={!onRetry}
            accessibilityRole="button"
            accessibilityLabel="Not sent. Tap to retry"
            className="flex-row items-center sp-gap-1 mt-1"
          >
            <AlertCircle size={ts(14)} color={palette.destructive} />
            <Text className="type-xs text-destructive">{onRetry ? "Not sent · Tap to retry" : "Not sent"}</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}
