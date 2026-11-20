/**
 * Nativra — Social Feed Template (NativeWind)
 * @version 0.1.0
 * @target nativewind
 * @platforms android, ios
 *
 * Copy this file into your project. You own this code.
 * Install: npx nativra-cli add social-feed
 */
import React from "react";
import { ActivityIndicator, FlatList, Pressable, Share, Text, View } from "react-native";
import { Heart, MessageCircle, PenSquare, Share2 } from "lucide-react-native";
import { SafeArea } from "./SafeArea";
import { Avatar } from "./Avatar";
import { Button } from "./Button";
import { ImageWithFallback } from "./ImageWithFallback";
import { Separator } from "./Separator";
import { ts, useThemeColors } from "@/hooks/use-theme-colors";
import { useInfiniteScroll, type Page } from "@/hooks/use-infinite-scroll";

export interface Post {
  id: string;
  author: string;
  handle: string;
  avatarUrl?: string;
  /** Display time, e.g. "2h". */
  time: string;
  text: string;
  imageUrl?: string;
  likes: number;
  comments: number;
  liked: boolean;
}

export interface SocialFeedProps {
  /** Loads one page of posts; `cursor` is undefined for the first. Defaults to demo data. */
  fetchPage?: (cursor: string | undefined) => Promise<Page<Post, string>>;
  /** Persists a like. The heart updates at once and rolls back if this rejects. */
  onToggleLike?: (post: Post, liked: boolean) => Promise<void> | void;
  onOpenComments?: (post: Post) => void;
  onCompose?: () => void;
}

const NAMES = ["Maya Chen", "Arif Rahman", "Lena Park", "Diego Alvarez", "Sara Okafor", "Tom Becker"];
const TEXTS = [
  "Shipped the new onboarding today. Retention on day 1 is already up 12%.",
  "Hot take: most loading spinners should be skeletons.",
  "Morning ride before standup. Best part of the week.",
  "Anyone else rebuilding their side project in Expo Router?",
  "Finally wrote the post about our design tokens. Link in bio.",
  "Coffee, a clear calendar, and a long-overdue refactor.",
];

/** Demo pages: 6 posts each, 3 pages, with a short delay like a real request. */
async function demoPage(cursor: string | undefined): Promise<Page<Post, string>> {
  const page = cursor ? Number(cursor) : 0;
  await new Promise((r) => setTimeout(r, 600));
  const items = Array.from({ length: 6 }, (_, i) => {
    const n = page * 6 + i;
    return {
      id: `p${n}`,
      author: NAMES[n % NAMES.length]!,
      handle: `@${NAMES[n % NAMES.length]!.split(" ")[0]!.toLowerCase()}`,
      time: `${n + 1}h`,
      text: TEXTS[n % TEXTS.length]!,
      ...(n % 3 === 0 ? { imageUrl: "" } : {}),
      likes: (n * 37) % 240,
      comments: (n * 7) % 31,
      liked: n % 4 === 1,
    };
  });
  return { items, nextCursor: page < 2 ? String(page + 1) : null };
}

// FlatList passes `highlighted` and `leadingItem` to separators; Separator would forward them to a View.
const PostSeparator = () => <Separator />;

export function SocialFeed({ fetchPage = demoPage, onToggleLike, onOpenComments, onCompose }: SocialFeedProps) {
  const palette = useThemeColors();
  const feed = useInfiniteScroll<Post, string>({ fetchPage });
  // Optimistic likes, keyed by post id, over what the server returned.
  const [likes, setLikes] = React.useState<Record<string, boolean>>({});

  const toggleLike = async (post: Post) => {
    const was = likes[post.id] ?? post.liked;
    setLikes((l) => ({ ...l, [post.id]: !was }));
    try {
      await onToggleLike?.(post, !was);
    } catch {
      setLikes((l) => ({ ...l, [post.id]: was }));
    }
  };

  const renderPost = ({ item }: { item: Post }) => {
    const liked = likes[item.id] ?? item.liked;
    const likeCount = item.likes + (liked === item.liked ? 0 : liked ? 1 : -1);
    return (
      <View className="px-4 py-3.5 sp-gap-2.5">
        <View className="flex-row items-center sp-gap-2.5">
          <Avatar size="sm" fallback={item.author.slice(0, 2).toUpperCase()} {...(item.avatarUrl ? { src: item.avatarUrl } : {})} />
          <View className="flex-1">
            <Text className="type-base weight-label text-foreground">{item.author}</Text>
            <Text className="type-sm text-muted-foreground">
              {item.handle} · {item.time}
            </Text>
          </View>
        </View>
        <Text className="type-base text-foreground leading-relaxed">{item.text}</Text>
        {item.imageUrl !== undefined ? (
          <ImageWithFallback source={item.imageUrl} aspectRatio={16 / 9} radius="lg" accessibilityLabel={`Photo from ${item.author}`} />
        ) : null}
        <View className="flex-row sp-gap-6">
          <Pressable
            onPress={() => void toggleLike(item)}
            accessibilityRole="button"
            accessibilityLabel={`${liked ? "Unlike" : "Like"}, ${likeCount} likes`}
            accessibilityState={{ selected: liked }} aria-selected={liked}
            hitSlop={8}
            className="flex-row items-center sp-gap-1.5 py-1 active:opacity-70"
          >
            <Heart size={ts(18)} color={liked ? palette.destructive : palette["muted-foreground"]} fill={liked ? palette.destructive : "transparent"} />
            <Text className={`type-sm ${liked ? "text-destructive" : "text-muted-foreground"}`} style={{ fontVariant: ["tabular-nums"] }}>
              {likeCount}
            </Text>
          </Pressable>
          <Pressable
            onPress={() => onOpenComments?.(item)}
            accessibilityRole="button"
            accessibilityLabel={`Comments, ${item.comments}`}
            hitSlop={8}
            className="flex-row items-center sp-gap-1.5 py-1 active:opacity-70"
          >
            <MessageCircle size={ts(18)} color={palette["muted-foreground"]} />
            <Text className="type-sm text-muted-foreground" style={{ fontVariant: ["tabular-nums"] }}>
              {item.comments}
            </Text>
          </Pressable>
          <Pressable
            onPress={() => void Share.share({ message: `${item.author}: ${item.text}` })}
            accessibilityRole="button"
            accessibilityLabel="Share"
            hitSlop={8}
            className="flex-row items-center py-1 active:opacity-70"
          >
            <Share2 size={ts(18)} color={palette["muted-foreground"]} />
          </Pressable>
        </View>
      </View>
    );
  };

  return (
    <SafeArea className="flex-1 bg-background" edges={["top"]}>
      <View className="flex-row items-center justify-between px-4 py-3">
        <Text accessibilityRole="header" className="type-2xl weight-title text-foreground">
          Feed
        </Text>
        <Pressable onPress={onCompose} accessibilityRole="button" accessibilityLabel="New post" hitSlop={8} className="active:opacity-70">
          <PenSquare size={ts(22)} color={palette.foreground} />
        </Pressable>
      </View>
      <FlatList
        {...feed.listProps}
        keyExtractor={(p) => p.id}
        renderItem={renderPost}
        ItemSeparatorComponent={PostSeparator}
        ListEmptyComponent={
          feed.refreshing ? undefined : (
            <View className="items-center sp-gap-3 p-8">
              <Text className="type-sm text-muted-foreground">{feed.error ? "Couldn't load the feed." : "Nothing here yet."}</Text>
              {feed.error ? (
                <Button size="sm" variant="outline" onPress={feed.retry}>
                  Try again
                </Button>
              ) : null}
            </View>
          )
        }
        ListFooterComponent={
          feed.error && feed.items.length > 0 ? (
            <View className="items-center p-8">
              <Button size="sm" variant="outline" onPress={feed.retry}>
                Couldn't load more · Retry
              </Button>
            </View>
          ) : feed.loading ? (
            <ActivityIndicator className="py-5" color={palette["muted-foreground"]} />
          ) : !feed.hasMore && feed.items.length > 0 ? (
            <Text className="py-5 text-center type-sm text-muted-foreground">You're all caught up</Text>
          ) : undefined
        }
      />
    </SafeArea>
  );
}
