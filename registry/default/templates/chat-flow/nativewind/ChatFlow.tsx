/**
 * Nativra — ChatFlow (NativeWind)
 * @version 0.1.0
 * @target nativewind
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
} from "react-native";
import {
  Send,
  Paperclip,
  ChevronLeft,
  Search,
  CheckCheck,
  Circle,
  MoreVertical,
} from "lucide-react-native";
import { useThemeColors } from "@/hooks/use-theme-colors";

interface Message {
  id: string;
  sender: "user" | "agent";
  text: string;
  time: string;
}

export function ChatFlow() {
  const palette = useThemeColors();
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
    <SafeAreaView className="flex-1 bg-background">
      <StatusBar barStyle="light-content" />

      {activeThreadId ? (
        /* SCREEN 2: ACTIVE CHAT THREAD */
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          className="flex-1"
        >
          {/* Thread Header */}
          <View className="flex-row items-center justify-between border-b border-border bg-card/90 sp-px-4 sp-py-3">
            <View className="flex-row items-center sp-gap-3">
              <TouchableOpacity
                onPress={() => setActiveThreadId(null)}
                className="sp-p-1 -ml-1 rounded-control active:bg-muted"
              >
                <ChevronLeft size={22} color={palette.foreground} />
              </TouchableOpacity>

              <View className="relative">
                <View className="h-10 w-10 items-center justify-center rounded-full bg-primary">
                  <Text className="type-xs weight-title text-primary-foreground">SD</Text>
                </View>
                <View className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-success border-2 border-border" />
              </View>

              <View>
                <Text className="type-sm weight-title text-foreground">Enterprise Support</Text>
                <Text className="type-2xs text-success">Online • Typically replies in 5m</Text>
              </View>
            </View>

            <TouchableOpacity className="sp-p-1 rounded-control">
              <MoreVertical size={18} color={palette["muted-foreground"]} />
            </TouchableOpacity>
          </View>

          {/* Messages Scroll View */}
          <ScrollView
            className="flex-1 sp-px-4 sp-py-4"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ gap: 12 }}
          >
            <View className="items-center my-2">
              <View className="surface rounded-full sp-px-3 sp-py-1">
                <Text className="type-2xs weight-label text-muted-foreground">Today, November 7</Text>
              </View>
            </View>

            {messages.map((msg) => {
              const isUser = msg.sender === "user";
              return (
                <View
                  key={msg.id}
                  className={`flex-row ${isUser ? "justify-end" : "justify-start"}`}
                >
                  <View
                    className={`max-w-[78%] rounded-card sp-px-4 sp-py-2.5 ${
                      isUser
                        ? "bg-primary rounded-br-xs"
                        : "surface rounded-bl-xs"
                    }`}
                  >
                    <Text
                      className={`type-sm leading-relaxed ${
                        isUser ? "text-primary-foreground font-medium" : "text-foreground"
                      }`}
                    >
                      {msg.text}
                    </Text>
                    <View className="flex-row items-center justify-end sp-gap-1 mt-1">
                      <Text
                        className={`type-2xs ${
                          isUser ? "text-primary-foreground" : "text-muted-foreground"
                        }`}
                      >
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
          <View className="border-t border-border bg-card sp-px-4 sp-py-3 flex-row items-center sp-gap-2">
            <TouchableOpacity className="sp-p-2 rounded-control bg-muted active:bg-accent">
              <Paperclip size={18} color={palette["muted-foreground"]} />
            </TouchableOpacity>

            <TextInput
              value={inputText}
              onChangeText={setInputText}
              placeholder="Type your message..."
              placeholderTextColor={palette["muted-foreground"]}
              className="field flex-1 rounded-control sp-px-4 sp-py-2.5 type-sm text-foreground"
            />

            <TouchableOpacity
              onPress={handleSendMessage}
              className={`sp-p-2.5 rounded-control ${
                inputText.trim() ? "bg-primary" : "bg-muted"
              }`}
            >
              <Send
                size={18}
                color={inputText.trim() ? palette.foreground : palette["muted-foreground"]}
              />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      ) : (
        /* SCREEN 1: CONVERSATION LIST */
        <View className="flex-1 sp-px-4 sp-py-4">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="type-2xl weight-heading text-foreground">Messages</Text>
            <View className="surface rounded-full sp-px-2.5 sp-py-1">
              <Text className="type-xs weight-title text-muted-foreground">3 Threads</Text>
            </View>
          </View>

          {/* Search Box */}
          <View className="surface flex-row items-center sp-gap-2 rounded-control sp-px-3 sp-py-2.5 mb-4">
            <Search size={16} color={palette["muted-foreground"]} />
            <TextInput
              placeholder="Search conversations..."
              placeholderTextColor={palette["muted-foreground"]}
              className="flex-1 type-xs text-foreground"
            />
          </View>

          {/* Filter Pills */}
          <View className="flex-row sp-gap-2 mb-4">
            {(["all", "support", "direct"] as const).map((tab) => (
              <TouchableOpacity
                key={tab}
                onPress={() => setFilterTab(tab)}
                className={`rounded-control sp-px-3 sp-py-1.5 capitalize ${
                  filterTab === tab
                    ? "bg-foreground"
                    : "surface"
                }`}
              >
                <Text
                  className={`type-xs weight-title ${
                    filterTab === tab ? "text-muted-foreground" : "text-muted-foreground"
                  }`}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Thread List */}
          <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
            <View className="sp-gap-2.5">
              {filteredThreads.map((thread) => (
                <TouchableOpacity
                  key={thread.id}
                  onPress={() => setActiveThreadId(thread.id)}
                  className="flex-row items-center justify-between rounded-card border border-border bg-card/80 sp-p-3.5 active:bg-muted"
                >
                  <View className="flex-row items-center sp-gap-3 flex-1 sp-pr-3">
                    <View className="relative">
                      <View className="h-11 w-11 items-center justify-center rounded-card bg-muted">
                        <Text className="type-sm weight-title text-foreground">{thread.initials}</Text>
                      </View>
                      {thread.online && (
                        <View className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-success border-2 border-border" />
                      )}
                    </View>

                    <View className="flex-1">
                      <Text className="type-sm weight-title text-foreground" numberOfLines={1}>
                        {thread.name}
                      </Text>
                      <Text className="type-xs text-muted-foreground mt-0.5" numberOfLines={1}>
                        {thread.preview}
                      </Text>
                    </View>
                  </View>

                  <View className="items-end sp-gap-1">
                    <Text className="type-2xs text-muted-foreground">{thread.time}</Text>
                    {thread.unread > 0 && (
                      <View className="h-5 min-w-5 items-center justify-center rounded-full bg-primary sp-px-1.5">
                        <Text className="type-2xs weight-title text-primary-foreground">{thread.unread}</Text>
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

