/**
 * Nativra — Social Feed Template (StyleSheet)
 * @version 0.1.0
 * @target stylesheet
 * @platforms android, ios
 *
 * Copy this file into your project. You own this code.
 * Install: npx nativra-cli add social-feed
 */
import React from "react";
import { ActivityIndicator, FlatList, Pressable, Share, StyleSheet, Text, View } from "react-native";
import { Heart, MessageCircle, PenSquare, Share2 } from "lucide-react-native";
import { SafeArea } from "./SafeArea";
import { Avatar } from "./Avatar";
import { Button } from "./Button";
import { ImageWithFallback } from "./ImageWithFallback";
import { Separator } from "./Separator";
import { type ThemeColors, pressedStyle, sp, themeStyle, ts, useThemeColors } from "@/hooks/use-theme-colors";
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
  const c = useThemeColors();
  const styles = React.useMemo(() => createStyles(c), [c]);
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
      <View style={styles.post}>
        <View style={styles.postHeader}>
          <Avatar size="sm" fallback={item.author.slice(0, 2).toUpperCase()} {...(item.avatarUrl ? { src: item.avatarUrl } : {})} />
          <View style={styles.flex}>
            <Text style={styles.author}>{item.author}</Text>
            <Text style={styles.meta}>
              {item.handle} · {item.time}
            </Text>
          </View>
        </View>
        <Text style={styles.body}>{item.text}</Text>
        {item.imageUrl !== undefined ? (
          <ImageWithFallback source={item.imageUrl} aspectRatio={16 / 9} radius="lg" accessibilityLabel={`Photo from ${item.author}`} />
        ) : null}
        <View style={styles.actions}>
          <Pressable
            onPress={() => void toggleLike(item)}
            accessibilityRole="button"
            accessibilityLabel={`${liked ? "Unlike" : "Like"}, ${likeCount} likes`}
            accessibilityState={{ selected: liked }} aria-selected={liked}
            hitSlop={8}
            style={({ pressed }) => [styles.action, pressedStyle(pressed)]}
          >
            <Heart size={ts(18)} color={liked ? c.destructive : c["muted-foreground"]} fill={liked ? c.destructive : "transparent"} />
            <Text style={[styles.count, liked && { color: c.destructive }]}>{likeCount}</Text>
          </Pressable>
          <Pressable
            onPress={() => onOpenComments?.(item)}
            accessibilityRole="button"
            accessibilityLabel={`Comments, ${item.comments}`}
            hitSlop={8}
            style={({ pressed }) => [styles.action, pressedStyle(pressed)]}
          >
            <MessageCircle size={ts(18)} color={c["muted-foreground"]} />
            <Text style={styles.count}>{item.comments}</Text>
          </Pressable>
          <Pressable
            onPress={() => void Share.share({ message: `${item.author}: ${item.text}` })}
            accessibilityRole="button"
            accessibilityLabel="Share"
            hitSlop={8}
            style={({ pressed }) => [styles.action, pressedStyle(pressed)]}
          >
            <Share2 size={ts(18)} color={c["muted-foreground"]} />
          </Pressable>
        </View>
      </View>
    );
  };

  return (
    <SafeArea style={styles.safe} edges={["top"]}>
      <View style={styles.header}>
        <Text accessibilityRole="header" style={styles.title}>
          Feed
        </Text>
        <Pressable onPress={onCompose} accessibilityRole="button" accessibilityLabel="New post" hitSlop={8} style={({ pressed }) => pressedStyle(pressed)}>
          <PenSquare size={ts(22)} color={c.foreground} />
        </Pressable>
      </View>
      <FlatList
        {...feed.listProps}
        keyExtractor={(p) => p.id}
        renderItem={renderPost}
        ItemSeparatorComponent={PostSeparator}
        ListEmptyComponent={
          feed.refreshing ? undefined : (
            <View style={styles.center}>
              <Text style={styles.meta}>{feed.error ? "Couldn't load the feed." : "Nothing here yet."}</Text>
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
            <View style={styles.center}>
              <Button size="sm" variant="outline" onPress={feed.retry}>
                Couldn't load more · Retry
              </Button>
            </View>
          ) : feed.loading ? (
            <ActivityIndicator style={styles.footer} color={c["muted-foreground"]} />
          ) : !feed.hasMore && feed.items.length > 0 ? (
            <Text style={[styles.meta, styles.footer, styles.centerText]}>You're all caught up</Text>
          ) : undefined
        }
      />
    </SafeArea>
  );
}

const createStyles = (c: ThemeColors) =>
  StyleSheet.create({
    safe: { flex: 1, backgroundColor: c.background },
    flex: { flex: 1 },
    header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: sp(16), paddingVertical: sp(12) },
    title: { fontSize: ts(24), fontWeight: themeStyle.fontWeight.title, color: c.foreground },
    post: { paddingHorizontal: sp(16), paddingVertical: sp(14), gap: sp(10) },
    postHeader: { flexDirection: "row", alignItems: "center", gap: sp(10) },
    author: { fontSize: ts(15), fontWeight: themeStyle.fontWeight.label, color: c.foreground },
    meta: { fontSize: ts(13), color: c["muted-foreground"] },
    body: { fontSize: ts(15), lineHeight: ts(22), color: c.foreground },
    actions: { flexDirection: "row", gap: sp(24) },
    action: { flexDirection: "row", alignItems: "center", gap: sp(6), paddingVertical: sp(4) },
    count: { fontSize: ts(13), color: c["muted-foreground"], fontVariant: ["tabular-nums"] },
    center: { alignItems: "center", gap: sp(12), padding: sp(32) },
    centerText: { textAlign: "center" },
    footer: { paddingVertical: sp(20) },
  });
