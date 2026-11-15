/**
 * Nativra — ChatFlow (StyleSheet)
 * @version 0.1.0
 * @target stylesheet
 * @platforms android, ios
 *
 * Copy this file into your project. You own this code.
 * Install: npx nativra-cli add chat-flow
 */
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from "react-native";
import {
  Send,
  Paperclip,
  ChevronLeft,
  Search,
  CheckCheck,
  MoreVertical,
} from "lucide-react-native";
import { themeStyle, useThemeColors, type ThemeColors } from "@/hooks/use-theme-colors";

interface Message {
  id: string;
  sender: "user" | "agent";
  text: string;
  time: string;
}

export function ChatFlow() {
  const palette = useThemeColors();
  const styles = React.useMemo(() => createStyles(palette), [palette]);
  const [activeThreadId, setActiveThreadId] = useState<string | null>("t1");
  const [inputText, setInputText] = useState("");
  const [filterTab, setFilterTab] = useState<"all" | "support" | "direct">("all");

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "m1",
      sender: "agent",
      text: "Hi Jane! Welcome to Nativra Enterprise Support. How can we help today?",
      time: "10:14 AM",
    },
    {
      id: "m2",
      sender: "user",
      text: "Hello! We are configuring custom webhooks and want to confirm retry limits.",
      time: "10:15 AM",
    },
    {
      id: "m3",
      sender: "agent",
      text: "Webhooks retry up to 5 times with exponential backoff before routing to the DLQ.",
      time: "10:17 AM",
    },
  ]);

  const threads = [
    {
      id: "t1",
      name: "Enterprise Support Desk",
      preview: "Webhooks retry up to 5 times...",
      time: "10:17 AM",
      unread: 0,
      online: true,
      category: "support",
      initials: "SD",
    },
    {
      id: "t2",
      name: "Alex Rivera (Architect)",
      preview: "Shared the custom migration script.",
      time: "Yesterday",
      unread: 2,
      online: true,
      category: "direct",
      initials: "AR",
    },
    {
      id: "t3",
      name: "Billing & Invoicing Desk",
      preview: "Your November receipt is ready.",
      time: "Nov 02",
      unread: 0,
      online: false,
      category: "support",
      initials: "BD",
    },
  ];

  const handleSendMessage = () => {
    if (!inputText.trim()) return;
    const newMsg: Message = {
      id: `m-${Date.now()}`,
      sender: "user",
      text: inputText.trim(),
      time: "Just now",
    };
    setMessages((prev) => [...prev, newMsg]);
    setInputText("");
  };

  const filteredThreads = threads.filter(
    (t) => filterTab === "all" || t.category === filterTab
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />

      {activeThreadId ? (
        /* SCREEN 2: ACTIVE CHAT THREAD */
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.keyboardContainer}
        >
          {/* Thread Header */}
          <View style={styles.threadHeader}>
            <View style={styles.headerLeft}>
              <TouchableOpacity
                onPress={() => setActiveThreadId(null)}
                style={styles.backButton}
              >
                <ChevronLeft size={22} color={palette.foreground} />
              </TouchableOpacity>

              <View style={styles.avatarWrapper}>
                <View style={styles.agentAvatar}>
                  <Text style={styles.agentAvatarText}>SD</Text>
                </View>
                <View style={styles.onlineDot} />
              </View>

              <View>
                <Text style={styles.headerTitle}>Enterprise Support</Text>
                <Text style={styles.headerStatus}>Online • Typically replies in 5m</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.moreButton}>
              <MoreVertical size={18} color={palette["muted-foreground"]} />
            </TouchableOpacity>
          </View>

          {/* Messages Scroll View */}
          <ScrollView
            style={styles.messagesScroll}
            contentContainerStyle={styles.messagesContainer}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.dateBadgeWrapper}>
              <View style={styles.dateBadge}>
                <Text style={styles.dateBadgeText}>Today, November 7</Text>
              </View>
            </View>

            {messages.map((msg) => {
              const isUser = msg.sender === "user";
              return (
                <View
                  key={msg.id}
                  style={[styles.messageRow, isUser ? styles.rowEnd : styles.rowStart]}
                >
                  <View
                    style={[
                      styles.bubble,
                      isUser ? styles.bubbleUser : styles.bubbleAgent,
                    ]}
                  >
                    <Text style={[styles.bubbleText, isUser ? styles.textUser : styles.textAgent]}>
                      {msg.text}
                    </Text>
                    <View style={styles.bubbleFooter}>
                      <Text style={[styles.timeText, isUser ? styles.timeUser : styles.timeAgent]}>
                        {msg.time}
                      </Text>
                      {isUser && <CheckCheck size={12} color={palette["primary-foreground"]} />}
                    </View>
                  </View>
                </View>
              );
            })}
          </ScrollView>

          {/* Message Input Bar */}
          <View style={styles.inputBar}>
            <TouchableOpacity style={styles.attachBtn}>
              <Paperclip size={18} color={palette["muted-foreground"]} />
            </TouchableOpacity>

            <TextInput
              value={inputText}
              onChangeText={setInputText}
              placeholder="Type your message..."
              placeholderTextColor={palette["muted-foreground"]}
              style={styles.textInput}
            />

            <TouchableOpacity
              onPress={handleSendMessage}
              style={[styles.sendBtn, inputText.trim() ? styles.sendBtnActive : styles.sendBtnInactive]}
            >
              <Send size={18} color={inputText.trim() ? palette.foreground : palette["muted-foreground"]} />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      ) : (
        /* SCREEN 1: CONVERSATION LIST */
        <View style={styles.inboxContainer}>
          <View style={styles.inboxHeader}>
            <Text style={styles.inboxTitle}>Messages</Text>
            <View style={styles.threadCountBadge}>
              <Text style={styles.threadCountText}>3 Threads</Text>
            </View>
          </View>

          {/* Search Box */}
          <View style={styles.searchBar}>
            <Search size={16} color={palette["muted-foreground"]} />
            <TextInput
              placeholder="Search conversations..."
              placeholderTextColor={palette["muted-foreground"]}
              style={styles.searchInput}
            />
          </View>

          {/* Filter Pills */}
          <View style={styles.filterRow}>
            {(["all", "support", "direct"] as const).map((tab) => (
              <TouchableOpacity
                key={tab}
                onPress={() => setFilterTab(tab)}
                style={[styles.filterPill, filterTab === tab ? styles.filterPillActive : styles.filterPillInactive]}
              >
                <Text
                  style={[
                    styles.filterPillText,
                    filterTab === tab ? styles.filterPillTextActive : styles.filterPillTextInactive,
                  ]}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Thread List */}
          <ScrollView style={styles.threadScroll} showsVerticalScrollIndicator={false}>
            <View style={styles.threadList}>
              {filteredThreads.map((thread) => (
                <TouchableOpacity
                  key={thread.id}
                  onPress={() => setActiveThreadId(thread.id)}
                  style={styles.threadItem}
                >
                  <View style={styles.threadItemLeft}>
                    <View style={styles.avatarWrapper}>
                      <View style={styles.threadAvatar}>
                        <Text style={styles.avatarText}>{thread.initials}</Text>
                      </View>
                      {thread.online && <View style={styles.onlineDot} />}
                    </View>

                    <View style={styles.threadInfo}>
                      <Text style={styles.threadName} numberOfLines={1}>
                        {thread.name}
                      </Text>
                      <Text style={styles.threadPreview} numberOfLines={1}>
                        {thread.preview}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.threadItemRight}>
                    <Text style={styles.threadTime}>{thread.time}</Text>
                    {thread.unread > 0 && (
                      <View style={styles.unreadBadge}>
                        <Text style={styles.unreadText}>{thread.unread}</Text>
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
      )}
    </SafeAreaView>
  );
}

const createStyles = (palette: ThemeColors) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: palette.background,
  },
  keyboardContainer: {
    flex: 1,
  },
  threadHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: palette.border,
    backgroundColor: palette.card,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  backButton: {
    padding: 4,
    marginLeft: -4,
  },
  avatarWrapper: {
    position: "relative",
  },
  agentAvatar: {
    height: 40,
    width: 40,
    borderRadius: 20,
    backgroundColor: palette.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 12,
    fontWeight: "700",
    color: palette.foreground,
  },
  agentAvatarText: {
    fontSize: 12,
    fontWeight: "700",
    color: palette["primary-foreground"],
  },
  onlineDot: {
    position: "absolute",
    bottom: 0,
    right: 0,
    height: 12,
    width: 12,
    borderRadius: themeStyle.radius.small,
    backgroundColor: palette.success,
    borderWidth: 2,
    borderColor: palette.border,
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: palette.foreground,
  },
  headerStatus: {
    fontSize: 11,
    color: palette.success,
    marginTop: 1,
  },
  moreButton: {
    padding: 4,
  },
  messagesScroll: {
    flex: 1,
  },
  messagesContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
  },
  dateBadgeWrapper: {
    alignItems: "center",
    marginVertical: 8,
  },
  dateBadge: {
    borderRadius: 9999,
    backgroundColor: palette.card,
    borderWidth: 1,
    borderColor: palette.border,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  dateBadgeText: {
    fontSize: 10,
    fontWeight: "600",
    color: palette["muted-foreground"],
  },
  messageRow: {
    flexDirection: "row",
  },
  rowStart: {
    justifyContent: "flex-start",
  },
  rowEnd: {
    justifyContent: "flex-end",
  },
  bubble: {
    maxWidth: "78%",
    borderRadius: themeStyle.radius.card,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  bubbleUser: {
    backgroundColor: palette.primary,
    borderBottomRightRadius: 2,
  },
  bubbleAgent: {
    backgroundColor: palette.card,
    borderWidth: 1,
    borderColor: palette.border,
    borderBottomLeftRadius: 2,
  },
  bubbleText: {
    fontSize: 14,
    lineHeight: 20,
  },
  textUser: {
    color: palette["primary-foreground"],
    fontWeight: "500",
  },
  textAgent: {
    color: palette.foreground,
  },
  bubbleFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 4,
    marginTop: 4,
  },
  timeText: {
    fontSize: 10,
  },
  timeUser: {
    color: palette["primary-foreground"],
  },
  timeAgent: {
    color: palette["muted-foreground"],
  },
  inputBar: {
    borderTopWidth: 1,
    borderTopColor: palette.border,
    backgroundColor: palette.card,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  attachBtn: {
    padding: 8,
    borderRadius: themeStyle.radius.control,
    backgroundColor: palette.muted,
  },
  textInput: {
    flex: 1,
    borderRadius: themeStyle.radius.control,
    backgroundColor: palette.background,
    borderWidth: 1,
    borderColor: palette.border,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    color: palette.foreground,
  },
  sendBtn: {
    padding: 10,
    borderRadius: themeStyle.radius.control,
  },
  sendBtnActive: {
    backgroundColor: palette.primary,
  },
  sendBtnInactive: {
    backgroundColor: palette.muted,
  },
  inboxContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  inboxHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  inboxTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: palette.foreground,
  },
  threadCountBadge: {
    borderRadius: 9999,
    backgroundColor: palette.card,
    borderWidth: 1,
    borderColor: palette.border,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  threadCountText: {
    fontSize: 12,
    fontWeight: "700",
    color: palette["muted-foreground"],
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderRadius: themeStyle.radius.control,
    backgroundColor: palette.card,
    borderWidth: 1,
    borderColor: palette.border,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    fontSize: 12,
    color: palette.foreground,
  },
  filterRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  filterPill: {
    borderRadius: themeStyle.radius.control,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  filterPillActive: {
    backgroundColor: palette.foreground,
  },
  filterPillInactive: {
    backgroundColor: palette.card,
    borderWidth: 1,
    borderColor: palette.border,
  },
  filterPillText: {
    fontSize: 12,
    fontWeight: "700",
    textTransform: "capitalize",
  },
  filterPillTextActive: {
    color: palette["muted-foreground"],
  },
  filterPillTextInactive: {
    color: palette["muted-foreground"],
  },
  threadScroll: {
    flex: 1,
  },
  threadList: {
    gap: 10,
  },
  threadItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: themeStyle.radius.card,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: palette.card,
    padding: 14,
  },
  threadItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
    paddingRight: 12,
  },
  threadAvatar: {
    height: 44,
    width: 44,
    borderRadius: themeStyle.radius.card,
    backgroundColor: palette.muted,
    alignItems: "center",
    justifyContent: "center",
  },
  threadInfo: {
    flex: 1,
  },
  threadName: {
    fontSize: 14,
    fontWeight: "700",
    color: palette.foreground,
  },
  threadPreview: {
    fontSize: 12,
    color: palette["muted-foreground"],
    marginTop: 2,
  },
  threadItemRight: {
    alignItems: "flex-end",
    gap: 4,
  },
  threadTime: {
    fontSize: 10,
    color: palette["muted-foreground"],
  },
  unreadBadge: {
    height: 20,
    minWidth: 20,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 9999,
    backgroundColor: palette.primary,
    paddingHorizontal: 6,
  },
  unreadText: {
    fontSize: 10,
    fontWeight: "700",
    color: palette.foreground,
  },
});

