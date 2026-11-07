/**
 * Nativra — User Profile Block (StyleSheet)
 * @version 0.1.0
 * @target stylesheet
 * @platforms android, ios
 *
 * Copy this file into your project. You own this code.
 * Install: npx nativra add user-profile
 */
import React from "react";
import { View, StyleSheet } from "react-native";
import { Card } from "./Card";
import { Avatar } from "./Avatar";
import { Badge } from "./Badge";
import { Button } from "./Button";
import { Text } from "./Text";
import { Separator } from "./Separator";

export interface UserProfileStats {
  followers?: string;
  following?: string;
  projects?: string;
}

export interface UserProfileProps {
  name?: string;
  handle?: string;
  avatarFallback?: string;
  bio?: string;
  verified?: boolean;
  stats?: UserProfileStats;
  isFollowing?: boolean;
  onFollow?: () => void;
  onMessage?: () => void;
}

export function UserProfile({
  name = "Sophia Martinez",
  handle = "@sophiam",
  avatarFallback = "SM",
  bio = "Senior Mobile Engineer building design systems & fluid React Native mobile apps.",
  verified = true,
  stats = { followers: "14.2k", following: "420", projects: "38" },
  isFollowing = false,
  onFollow,
  onMessage,
}: UserProfileProps) {
  return (
    <Card elevated padding="lg" style={styles.card}>
      <View style={styles.header}>
        <Avatar size="lg" fallback={avatarFallback} />
        {verified && <Badge variant="primary" size="sm" label="Verified Pro" />}
      </View>

      <View style={styles.info}>
        <Text variant="h3">{name}</Text>
        <Text variant="muted" style={styles.handle}>{handle}</Text>
        <Text variant="p" style={styles.bio}>{bio}</Text>
      </View>

      <View style={styles.separatorContainer}>
        <Separator />
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statCol}>
          <Text variant="h4">{stats.followers ?? "0"}</Text>
          <Text variant="muted" style={styles.statLabel}>Followers</Text>
        </View>
        <Separator orientation="vertical" />
        <View style={styles.statCol}>
          <Text variant="h4">{stats.following ?? "0"}</Text>
          <Text variant="muted" style={styles.statLabel}>Following</Text>
        </View>
        <Separator orientation="vertical" />
        <View style={styles.statCol}>
          <Text variant="h4">{stats.projects ?? "0"}</Text>
          <Text variant="muted" style={styles.statLabel}>Projects</Text>
        </View>
      </View>

      <View style={styles.actionsRow}>
        <Button
          variant={isFollowing ? "outline" : "default"}
          size="sm"
          style={styles.actionBtn}
          onPress={onFollow}
        >
          {isFollowing ? "Following" : "Follow"}
        </Button>
        {onMessage && (
          <Button variant="secondary" size="sm" style={styles.actionBtn} onPress={onMessage}>
            Message
          </Button>
        )}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    maxWidth: 360,
    borderRadius: 24,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  info: {
    marginTop: 16,
  },
  handle: {
    fontSize: 12,
    marginTop: 2,
  },
  bio: {
    fontSize: 12,
    lineHeight: 18,
    marginTop: 8,
  },
  separatorContainer: {
    marginVertical: 16,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingVertical: 4,
  },
  statCol: {
    alignItems: "center",
  },
  statLabel: {
    fontSize: 10,
    marginTop: 2,
  },
  actionsRow: {
    marginTop: 20,
    flexDirection: "row",
    gap: 8,
  },
  actionBtn: {
    flex: 1,
  },
});
