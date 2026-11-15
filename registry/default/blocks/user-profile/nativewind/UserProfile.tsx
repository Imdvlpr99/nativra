/**
 * Nativra — User Profile Block (NativeWind)
 * @version 0.1.0
 * @target nativewind
 * @platforms android, ios
 *
 * Copy this file into your project. You own this code.
 * Install: npx nativra-cli add user-profile
 */
import React from "react";
import { View } from "react-native";
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
  className?: string;
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
  className = "",
}: UserProfileProps) {
  return (
    <Card elevated padding="lg" className={`w-full max-w-sm rounded-card ${className}`.trim()}>
      <View className="flex-row items-center justify-between">
        <Avatar size="lg" fallback={avatarFallback} />
        {verified && <Badge variant="primary" size="sm" label="Verified Pro" />}
      </View>

      <View className="mt-4">
        <Text variant="h3">{name}</Text>
        <Text variant="muted" className="type-xs">{handle}</Text>
        <Text variant="p" className="mt-2 type-xs leading-relaxed text-muted-foreground">
          {bio}
        </Text>
      </View>

      <View className="my-4">
        <Separator />
      </View>

      <View className="flex-row items-center justify-around sp-py-1 text-center">
        <View className="items-center">
          <Text variant="h4">{stats.followers ?? "0"}</Text>
          <Text variant="muted" className="type-2xs">Followers</Text>
        </View>
        <Separator orientation="vertical" />
        <View className="items-center">
          <Text variant="h4">{stats.following ?? "0"}</Text>
          <Text variant="muted" className="type-2xs">Following</Text>
        </View>
        <Separator orientation="vertical" />
        <View className="items-center">
          <Text variant="h4">{stats.projects ?? "0"}</Text>
          <Text variant="muted" className="type-2xs">Projects</Text>
        </View>
      </View>

      <View className="mt-5 flex-row sp-gap-2">
        <Button
          variant={isFollowing ? "outline" : "default"}
          size="sm"
          className="flex-1"
          onPress={onFollow}
        >
          {isFollowing ? "Following" : "Follow"}
        </Button>
        {onMessage && (
          <Button variant="secondary" size="sm" className="flex-1" onPress={onMessage}>
            Message
          </Button>
        )}
      </View>
    </Card>
  );
}
