/**
 * Nativra — Chat Bubble Block (React Native StyleSheet)
 * @version 0.1.0
 * @target stylesheet
 * @platforms android, ios
 *
 * Copy this file into your project. You own this code.
 * Install: npx nativra-cli add chat-bubble
 */
import React from "react";
import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from "react-native";
import { AlertCircle, Check, CheckCheck, Clock } from "lucide-react-native";
import { Avatar } from "./Avatar";
import { type ThemeColors, sp, themeStyle, ts, useThemeColors } from "@/hooks/use-theme-colors";

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
}: ChatBubbleProps) {
  const c = useThemeColors();
  const styles = React.useMemo(() => createStyles(c), [c]);
  const mine = from === "me";
  const showAvatar = !mine && (position === "single" || position === "last");
  const failed = mine && status === "failed";
  const tight = sp(4);
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
  const tickColor = c["primary-foreground"];
  // Read ticks are solid; sent and delivered ones are dimmer.
  const tickOpacity = status === "read" ? 1 : 0.7;

  return (
    <View style={[styles.row, mine ? styles.rowMine : styles.rowTheirs, position === "first" || position === "middle" ? styles.grouped : null, style]}>
      {!mine ? (
        <View style={styles.avatarSlot}>
          {showAvatar ? <Avatar size="sm" fallback={(senderName ?? "?").slice(0, 2).toUpperCase()} {...(avatarUrl ? { src: avatarUrl } : {})} /> : null}
        </View>
      ) : null}
      <View style={[styles.column, mine && styles.columnMine]}>
        <Pressable
          onLongPress={onLongPress}
          disabled={!onLongPress}
          accessibilityRole="text"
          accessibilityLabel={`${mine ? "You" : (senderName ?? "Them")}: ${text}${meta ? `. ${meta}` : ""}`}
          accessibilityHint={onLongPress ? "Long press for options" : undefined}
          style={[styles.bubble, mine ? styles.bubbleMine : styles.bubbleTheirs, corners, failed && styles.bubbleFailed]}
        >
          <Text style={[styles.text, mine ? styles.textMine : styles.textTheirs]}>{text}</Text>
          {time || (mine && status) ? (
            <View style={styles.meta} importantForAccessibility="no-hide-descendants" accessibilityElementsHidden>
              {time ? <Text style={[styles.time, mine ? styles.timeMine : styles.timeTheirs]}>{time}</Text> : null}
              {mine && status === "sending" ? <Clock size={ts(12)} color={tickColor} opacity={tickOpacity} /> : null}
              {mine && status === "sent" ? <Check size={ts(13)} color={tickColor} opacity={tickOpacity} /> : null}
              {mine && (status === "delivered" || status === "read") ? (
                <CheckCheck size={ts(14)} color={tickColor} opacity={tickOpacity} strokeWidth={status === "read" ? 3 : 2} />
              ) : null}
            </View>
          ) : null}
        </Pressable>
        {failed ? (
          <Pressable onPress={onRetry} disabled={!onRetry} accessibilityRole="button" accessibilityLabel="Not sent. Tap to retry" style={styles.failedRow}>
            <AlertCircle size={ts(14)} color={c.destructive} />
            <Text style={styles.failedText}>{onRetry ? "Not sent · Tap to retry" : "Not sent"}</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const createStyles = (c: ThemeColors) =>
  StyleSheet.create({
    row: { flexDirection: "row", alignItems: "flex-end", paddingHorizontal: sp(12), marginBottom: sp(8) },
    grouped: { marginBottom: sp(2) },
    rowMine: { justifyContent: "flex-end" },
    rowTheirs: { justifyContent: "flex-start" },
    avatarSlot: { width: 32, marginRight: sp(8) },
    column: { maxWidth: "78%", alignItems: "flex-start" },
    columnMine: { alignItems: "flex-end" },
    bubble: { paddingHorizontal: sp(12), paddingVertical: sp(8), borderRadius: themeStyle.radius.card },
    bubbleMine: { backgroundColor: c.primary },
    bubbleTheirs: { backgroundColor: c.muted },
    bubbleFailed: { opacity: 0.6 },
    text: { fontSize: ts(15), lineHeight: ts(21) },
    textMine: { color: c["primary-foreground"] },
    textTheirs: { color: c.foreground },
    meta: { flexDirection: "row", alignItems: "center", justifyContent: "flex-end", gap: sp(4), marginTop: sp(2) },
    time: { fontSize: ts(11), fontVariant: ["tabular-nums"] },
    timeMine: { color: c["primary-foreground"], opacity: 0.75 },
    timeTheirs: { color: c["muted-foreground"] },
    failedRow: { flexDirection: "row", alignItems: "center", gap: sp(4), marginTop: sp(4) },
    failedText: { fontSize: ts(12), color: c.destructive },
  });
