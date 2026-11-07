/**
 * Nativra — ChatFlow (StyleSheet)
 * @version 0.1.0
 * @target stylesheet
 * @platforms android, ios
 *
 * Copy this file into your project. You own this code.
 * Install: npx nativra add chat-flow
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

interface Message {
  id: string;
  sender: "user" | "agent";
  text: string;
  time: string;
}

export function ChatFlow() {
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
                <ChevronLeft size={22} color="#ffffff" />
              </TouchableOpacity>

              <View style={styles.avatarWrapper}>
                <View style={styles.agentAvatar}>
                  <Text style={styles.avatarText}>SD</Text>
                </View>
                <View style={styles.onlineDot} />
              </View>

              <View>
                <Text style={styles.headerTitle}>Enterprise Support</Text>
                <Text style={styles.headerStatus}>Online • Typically replies in 5m</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.moreButton}>
              <MoreVertical size={18} color="#a1a1aa" />
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
                      {isUser && <CheckCheck size={12} color="#bae6fd" />}
                    </View>
                  </View>
                </View>
              );
            })}
          </ScrollView>

          {/* Message Input Bar */}
          <View style={styles.inputBar}>
            <TouchableOpacity style={styles.attachBtn}>
              <Paperclip size={18} color="#a1a1aa" />
            </TouchableOpacity>

            <TextInput
              value={inputText}
              onChangeText={setInputText}
              placeholder="Type your message..."
              placeholderTextColor="#71717a"
              style={styles.textInput}
            />

            <TouchableOpacity
              onPress={handleSendMessage}
              style={[styles.sendBtn, inputText.trim() ? styles.sendBtnActive : styles.sendBtnInactive]}
            >
              <Send size={18} color={inputText.trim() ? "#ffffff" : "#71717a"} />
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
            <Search size={16} color="#71717a" />
            <TextInput
              placeholder="Search conversations..."
              placeholderTextColor="#71717a"
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

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#09090b",
  },
  keyboardContainer: {
    flex: 1,
  },
  threadHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#27272a",
    backgroundColor: "#18181b",
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
    backgroundColor: "#0284c7",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#ffffff",
  },
  onlineDot: {
    position: "absolute",
    bottom: 0,
    right: 0,
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: "#10b981",
    borderWidth: 2,
    borderColor: "#18181b",
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#ffffff",
  },
  headerStatus: {
    fontSize: 11,
    color: "#34d399",
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
    backgroundColor: "#18181b",
    borderWidth: 1,
    borderColor: "#27272a",
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  dateBadgeText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#a1a1aa",
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
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  bubbleUser: {
    backgroundColor: "#0284c7",
    borderBottomRightRadius: 2,
  },
  bubbleAgent: {
    backgroundColor: "#18181b",
    borderWidth: 1,
    borderColor: "#27272a",
    borderBottomLeftRadius: 2,
  },
  bubbleText: {
    fontSize: 14,
    lineHeight: 20,
  },
  textUser: {
    color: "#ffffff",
    fontWeight: "500",
  },
  textAgent: {
    color: "#f4f4f5",
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
    color: "#bae6fd",
  },
  timeAgent: {
    color: "#71717a",
  },
  inputBar: {
    borderTopWidth: 1,
    borderTopColor: "#27272a",
    backgroundColor: "#18181b",
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  attachBtn: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: "#27272a",
  },
  textInput: {
    flex: 1,
    borderRadius: 12,
    backgroundColor: "#09090b",
    borderWidth: 1,
    borderColor: "#27272a",
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    color: "#ffffff",
  },
  sendBtn: {
    padding: 10,
    borderRadius: 12,
  },
  sendBtnActive: {
    backgroundColor: "#0284c7",
  },
  sendBtnInactive: {
    backgroundColor: "#27272a",
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
    color: "#ffffff",
  },
  threadCountBadge: {
    borderRadius: 9999,
    backgroundColor: "#18181b",
    borderWidth: 1,
    borderColor: "#27272a",
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  threadCountText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#d4d4d8",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderRadius: 12,
    backgroundColor: "#18181b",
    borderWidth: 1,
    borderColor: "#27272a",
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    fontSize: 12,
    color: "#ffffff",
  },
  filterRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  filterPill: {
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  filterPillActive: {
    backgroundColor: "#ffffff",
  },
  filterPillInactive: {
    backgroundColor: "#18181b",
    borderWidth: 1,
    borderColor: "#27272a",
  },
  filterPillText: {
    fontSize: 12,
    fontWeight: "700",
    textTransform: "capitalize",
  },
  filterPillTextActive: {
    color: "#09090b",
  },
  filterPillTextInactive: {
    color: "#a1a1aa",
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
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#27272a",
    backgroundColor: "#18181b",
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
    borderRadius: 16,
    backgroundColor: "#27272a",
    alignItems: "center",
    justifyContent: "center",
  },
  threadInfo: {
    flex: 1,
  },
  threadName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#ffffff",
  },
  threadPreview: {
    fontSize: 12,
    color: "#a1a1aa",
    marginTop: 2,
  },
  threadItemRight: {
    alignItems: "flex-end",
    gap: 4,
  },
  threadTime: {
    fontSize: 10,
    color: "#71717a",
  },
  unreadBadge: {
    height: 20,
    minWidth: 20,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 9999,
    backgroundColor: "#0284c7",
    paddingHorizontal: 6,
  },
  unreadText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#ffffff",
  },
});

