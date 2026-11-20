/**
 * Nativra — Profile Flow Template (StyleSheet)
 * @version 0.1.0
 * @target stylesheet
 * @platforms android, ios
 *
 * Copy this file into your project. You own this code.
 * Install: npx nativra-cli add profile-flow
 */
import React from "react";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Bell, Camera, Lock, LogOut, User } from "lucide-react-native";
import { SafeArea } from "./SafeArea";
import { Button } from "./Button";
import { ImageWithFallback } from "./ImageWithFallback";
import { Input } from "./Input";
import { ListItem } from "./ListItem";
import { SectionList } from "./SectionList";
import { Textarea } from "./Textarea";
import { type ThemeColors, pressedStyle, sp, surface, themeStyle, ts, useThemeColors } from "@/hooks/use-theme-colors";
import { useForm } from "@/hooks/use-form";

export interface Profile {
  name: string;
  handle: string;
  bio: string;
  website: string;
  avatarUrl?: string;
  stats?: Array<{ label: string; value: string }>;
}

export interface ProfileFlowProps {
  profile?: Profile;
  /** Saves edits; while it runs the button spins, and a rejection shows its message. */
  onSave?: (profile: Profile) => Promise<void> | void;
  /** Opens your image picker and resolves to the new avatar URI, or null if cancelled. */
  onPickAvatar?: () => Promise<string | null>;
  /** A settings row was pressed: "account", "notifications" or "privacy". */
  onNavigate?: (id: string) => void;
  onSignOut?: () => void;
}

const DEMO: Profile = {
  name: "Maya Chen",
  handle: "maya",
  bio: "Product designer. Building calm software in Jakarta.",
  website: "maya.design",
  stats: [
    { label: "Posts", value: "128" },
    { label: "Followers", value: "4.2k" },
    { label: "Following", value: "312" },
  ],
};

const initials = (name: string) =>
  name
    .split(/\s+/)
    .map((w) => w[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase();

export function ProfileFlow({ profile: initial = DEMO, onSave, onPickAvatar, onNavigate, onSignOut }: ProfileFlowProps) {
  const c = useThemeColors();
  const styles = React.useMemo(() => createStyles(c), [c]);
  const [profile, setProfile] = React.useState(initial);
  const [editing, setEditing] = React.useState(false);
  const [avatar, setAvatar] = React.useState(initial.avatarUrl);
  const [saveError, setSaveError] = React.useState<string | null>(null);

  const rules = React.useMemo(
    () => ({
      name: (v: string) => (v.trim() ? undefined : "Enter your name"),
      handle: (v: string) => (/^[a-z0-9_.]{2,30}$/.test(v) ? undefined : "2–30 lowercase letters, numbers, _ or ."),
      bio: (v: string) => (v.length <= 160 ? undefined : `${v.length - 160} characters too long`),
    }),
    []
  );
  const form = useForm({
    initialValues: { name: profile.name, handle: profile.handle, bio: profile.bio, website: profile.website },
    rules,
    onSubmit: async (values) => {
      const next: Profile = { ...profile, ...values, name: values.name.trim(), ...(avatar ? { avatarUrl: avatar } : {}) };
      setSaveError(null);
      try {
        await onSave?.(next);
        setProfile(next);
        setEditing(false);
      } catch (err) {
        setSaveError(err instanceof Error ? err.message : "Couldn't save. Try again.");
      }
    },
  });

  const startEditing = () => {
    form.reset({ name: profile.name, handle: profile.handle, bio: profile.bio, website: profile.website });
    setAvatar(profile.avatarUrl);
    setSaveError(null);
    setEditing(true);
  };

  const avatarView = (size: number, uri: string | undefined, name: string) => (
    <ImageWithFallback
      source={uri ?? null}
      width={size}
      height={size}
      radius="full"
      accessibilityLabel={`${name}'s photo`}
      fallback={
        <View style={[styles.initials, { width: size, height: size }]}>
          <Text style={[styles.initialsText, { fontSize: size * 0.36 }]}>{initials(name)}</Text>
        </View>
      }
    />
  );

  if (editing) {
    return (
      <SafeArea style={styles.safe}>
        <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === "ios" ? "padding" : undefined}>
          <View style={styles.editHeader}>
            <Button variant="ghost" size="sm" onPress={() => setEditing(false)}>
              Cancel
            </Button>
            <Text accessibilityRole="header" style={styles.editTitle}>
              Edit profile
            </Text>
            <Button variant="link" size="sm" loading={form.isSubmitting} onPress={() => void form.handleSubmit()}>
              Save
            </Button>
          </View>
          <ScrollView contentContainerStyle={styles.editContent} keyboardShouldPersistTaps="handled">
            <Pressable
              onPress={async () => {
                const uri = await onPickAvatar?.();
                if (uri) setAvatar(uri);
              }}
              disabled={!onPickAvatar}
              accessibilityRole="button"
              accessibilityLabel="Change photo"
              style={({ pressed }) => [styles.avatarEdit, pressedStyle(pressed)]}
            >
              {avatarView(96, avatar, form.values.name || profile.name)}
              {onPickAvatar ? (
                <View style={styles.cameraBadge}>
                  <Camera size={ts(16)} color={c["primary-foreground"]} />
                </View>
              ) : null}
            </Pressable>
            <Input label="Name" {...form.field("name")} autoComplete="name" textContentType="name" />
            <Input label="Username" {...form.field("handle")} autoCapitalize="none" autoCorrect={false} />
            <Textarea label={`Bio (${form.values.bio.length}/160)`} {...form.field("bio")} rows={3} />
            <Input label="Website" {...form.field("website")} keyboardType="url" autoCapitalize="none" autoCorrect={false} textContentType="URL" />
            {saveError ? (
              <Text accessibilityLiveRegion="polite" style={styles.error}>
                {saveError}
              </Text>
            ) : null}
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeArea>
    );
  }

  const sections = [
    {
      title: "Settings",
      data: [
        { id: "account", title: "Account", icon: User },
        { id: "notifications", title: "Notifications", icon: Bell },
        { id: "privacy", title: "Privacy & security", icon: Lock },
      ],
    },
  ];

  return (
    <SafeArea style={styles.safe}>
      <SectionList
        variant="inset"
        sections={sections}
        keyExtractor={(row) => row.id}
        ListHeaderComponent={
          <View style={styles.hero}>
            {avatarView(88, profile.avatarUrl, profile.name)}
            <Text accessibilityRole="header" style={styles.name}>
              {profile.name}
            </Text>
            <Text style={styles.handle}>@{profile.handle}</Text>
            {profile.bio ? <Text style={styles.bio}>{profile.bio}</Text> : null}
            {profile.website ? <Text style={styles.website}>{profile.website}</Text> : null}
            {profile.stats?.length ? (
              <View style={styles.stats}>
                {profile.stats.map((s) => (
                  <View key={s.label} style={styles.stat} accessible accessibilityLabel={`${s.value} ${s.label}`}>
                    <Text style={styles.statValue}>{s.value}</Text>
                    <Text style={styles.statLabel}>{s.label}</Text>
                  </View>
                ))}
              </View>
            ) : null}
            <Button variant="outline" onPress={startEditing} style={styles.editButton}>
              Edit profile
            </Button>
          </View>
        }
        renderItem={({ item, index, section }) => {
          const Icon = item.icon;
          return (
            <ListItem
              title={item.title}
              leading={<Icon size={ts(20)} color={c.foreground} />}
              onPress={() => onNavigate?.(item.id)}
              divider={index < section.data.length - 1}
            />
          );
        }}
        ListFooterComponent={
          onSignOut ? (
            <View style={styles.signOut}>
              <ListItem title="Sign out" leading={<LogOut size={ts(20)} color={c.destructive} />} destructive chevron={false} onPress={onSignOut} />
            </View>
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
    hero: { alignItems: "center", paddingTop: sp(24), paddingBottom: sp(8), gap: sp(4) },
    initials: { alignItems: "center", justifyContent: "center", backgroundColor: c.muted },
    initialsText: { color: c.foreground, fontWeight: themeStyle.fontWeight.title },
    name: { fontSize: ts(22), fontWeight: themeStyle.fontWeight.title, color: c.foreground, marginTop: sp(8) },
    handle: { fontSize: ts(14), color: c["muted-foreground"] },
    bio: { fontSize: ts(15), color: c.foreground, textAlign: "center", marginTop: sp(8), paddingHorizontal: sp(16) },
    website: { fontSize: ts(14), color: c.primary },
    stats: { flexDirection: "row", alignSelf: "stretch", marginTop: sp(16), paddingVertical: sp(12), borderRadius: themeStyle.radius.card, ...surface(c) },
    stat: { flex: 1, alignItems: "center" },
    statValue: { fontSize: ts(18), fontWeight: themeStyle.fontWeight.title, color: c.foreground, fontVariant: ["tabular-nums"] },
    statLabel: { fontSize: ts(12), color: c["muted-foreground"] },
    editButton: { alignSelf: "stretch", marginTop: sp(16) },
    signOut: { ...surface(c), borderRadius: themeStyle.radius.card, overflow: "hidden" },
    editHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: sp(8), paddingVertical: sp(6) },
    editTitle: { fontSize: ts(16), fontWeight: themeStyle.fontWeight.title, color: c.foreground },
    editContent: { padding: sp(16), gap: sp(16) },
    avatarEdit: { alignSelf: "center", marginBottom: sp(8) },
    cameraBadge: {
      position: "absolute",
      right: 0,
      bottom: 0,
      width: 32,
      height: 32,
      borderRadius: 16,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: c.primary,
      borderWidth: 2,
      borderColor: c.background,
    },
    error: { fontSize: ts(13), color: c.destructive },
  });
