/**
 * Nativra — ChatFlow (NativeWind)
 * @version 0.1.0
 * @target nativewind
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
    <SafeAreaView className="flex-1 bg-zinc-950">
      <StatusBar barStyle="light-content" />

      {activeThreadId ? (
        /* SCREEN 2: ACTIVE CHAT THREAD */
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          className="flex-1"
        >
          {/* Thread Header */}
          <View className="flex-row items-center justify-between border-b border-zinc-800 bg-zinc-900/90 px-4 py-3">
            <View className="flex-row items-center gap-3">
              <TouchableOpacity
                onPress={() => setActiveThreadId(null)}
                className="p-1 -ml-1 rounded-lg active:bg-zinc-800"
              >
                <ChevronLeft size={22} color="#ffffff" />
              </TouchableOpacity>

              <View className="relative">
                <View className="h-10 w-10 items-center justify-center rounded-full bg-sky-600">
                  <Text className="text-xs font-bold text-white">SD</Text>
                </View>
                <View className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 border-2 border-zinc-900" />
              </View>

              <View>
                <Text className="text-sm font-bold text-white">Enterprise Support</Text>
                <Text className="text-[11px] text-emerald-400">Online • Typically replies in 5m</Text>
              </View>
            </View>

            <TouchableOpacity className="p-1 rounded-lg">
              <MoreVertical size={18} color="#a1a1aa" />
            </TouchableOpacity>
          </View>

          {/* Messages Scroll View */}
          <ScrollView
            className="flex-1 px-4 py-4"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ gap: 12 }}
          >
            <View className="items-center my-2">
              <View className="rounded-full bg-zinc-900 border border-zinc-800 px-3 py-1">
                <Text className="text-[10px] font-semibold text-zinc-400">Today, November 7</Text>
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
                    className={`max-w-[78%] rounded-2xl px-4 py-2.5 ${
                      isUser
                        ? "bg-sky-600 rounded-br-xs"
                        : "bg-zinc-900 border border-zinc-800 rounded-bl-xs"
                    }`}
                  >
                    <Text
                      className={`text-sm leading-relaxed ${
                        isUser ? "text-white font-medium" : "text-zinc-200"
                      }`}
                    >
                      {msg.text}
                    </Text>
                    <View className="flex-row items-center justify-end gap-1 mt-1">
                      <Text
                        className={`text-[10px] ${
                          isUser ? "text-sky-200" : "text-zinc-500"
                        }`}
                      >
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
          <View className="border-t border-zinc-800 bg-zinc-900 px-4 py-3 flex-row items-center gap-2">
            <TouchableOpacity className="p-2 rounded-xl bg-zinc-800 active:bg-zinc-700">
              <Paperclip size={18} color="#a1a1aa" />
            </TouchableOpacity>

            <TextInput
              value={inputText}
              onChangeText={setInputText}
              placeholder="Type your message..."
              placeholderTextColor="#71717a"
              className="flex-1 rounded-xl bg-zinc-950 border border-zinc-800 px-4 py-2.5 text-sm text-white"
            />

            <TouchableOpacity
              onPress={handleSendMessage}
              className={`p-2.5 rounded-xl ${
                inputText.trim() ? "bg-sky-600" : "bg-zinc-800"
              }`}
            >
              <Send
                size={18}
                color={inputText.trim() ? "#ffffff" : "#71717a"}
              />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      ) : (
        /* SCREEN 1: CONVERSATION LIST */
        <View className="flex-1 px-4 py-4">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-2xl font-black text-white">Messages</Text>
            <View className="rounded-full bg-zinc-900 border border-zinc-800 px-2.5 py-1">
              <Text className="text-xs font-bold text-zinc-300">3 Threads</Text>
            </View>
          </View>

          {/* Search Box */}
          <View className="flex-row items-center gap-2 rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-2.5 mb-4">
            <Search size={16} color="#71717a" />
            <TextInput
              placeholder="Search conversations..."
              placeholderTextColor="#71717a"
              className="flex-1 text-xs text-white"
            />
          </View>

          {/* Filter Pills */}
          <View className="flex-row gap-2 mb-4">
            {(["all", "support", "direct"] as const).map((tab) => (
              <TouchableOpacity
                key={tab}
                onPress={() => setFilterTab(tab)}
                className={`rounded-xl px-3 py-1.5 capitalize ${
                  filterTab === tab
                    ? "bg-white"
                    : "bg-zinc-900 border border-zinc-800"
                }`}
              >
                <Text
                  className={`text-xs font-bold ${
                    filterTab === tab ? "text-zinc-950" : "text-zinc-400"
                  }`}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Thread List */}
          <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
            <View className="gap-2.5">
              {filteredThreads.map((thread) => (
                <TouchableOpacity
                  key={thread.id}
                  onPress={() => setActiveThreadId(thread.id)}
                  className="flex-row items-center justify-between rounded-2xl border border-zinc-800 bg-zinc-900/80 p-3.5 active:bg-zinc-800"
                >
                  <View className="flex-row items-center gap-3 flex-1 pr-3">
                    <View className="relative">
                      <View className="h-11 w-11 items-center justify-center rounded-2xl bg-zinc-800">
                        <Text className="text-sm font-bold text-white">{thread.initials}</Text>
                      </View>
                      {thread.online && (
                        <View className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 border-2 border-zinc-900" />
                      )}
                    </View>

                    <View className="flex-1">
                      <Text className="text-sm font-bold text-white" numberOfLines={1}>
                        {thread.name}
                      </Text>
                      <Text className="text-xs text-zinc-400 mt-0.5" numberOfLines={1}>
                        {thread.preview}
                      </Text>
                    </View>
                  </View>

                  <View className="items-end gap-1">
                    <Text className="text-[10px] text-zinc-500">{thread.time}</Text>
                    {thread.unread > 0 && (
                      <View className="h-5 min-w-5 items-center justify-center rounded-full bg-sky-500 px-1.5">
                        <Text className="text-[10px] font-bold text-white">{thread.unread}</Text>
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

