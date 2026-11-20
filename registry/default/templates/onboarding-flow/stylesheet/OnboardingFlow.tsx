import * as React from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { themeStyle, useThemeColors, type ThemeColors, ts, sp, surface, pressedStyle } from "@/hooks/use-theme-colors";

export interface OnboardingSlide {
  id: string;
  badge: string;
  title: string;
  description: string;
  emoji: string;
}

const DEFAULT_SLIDES: OnboardingSlide[] = [
  {
    id: "1",
    badge: "Source First",
    title: "You Own The Code",
    description: "Pure editable TypeScript components copied right into your repository with zero runtime lock-in.",
    emoji: "🚀",
  },
  {
    id: "2",
    badge: "Dual Styling",
    title: "NativeWind & StyleSheet",
    description: "Switch seamlessly between Tailwind CSS utility classes and React Native StyleSheet with 100% parity.",
    emoji: "⚡",
  },
  {
    id: "3",
    badge: "Production Ready",
    title: "Built For Native Devices",
    description: "Verified touch targets, haptics, safe areas, and smooth 60fps native performance.",
    emoji: "📱",
  },
];

export interface OnboardingFlowProps {
  slides?: OnboardingSlide[];
  onComplete?: () => void;
  onSkip?: () => void;
  style?: StyleProp<ViewStyle>;
}

export function OnboardingFlow({
  slides = DEFAULT_SLIDES,
  onComplete,
  onSkip,
  style,
}: OnboardingFlowProps) {
  const palette = useThemeColors();
  const styles = React.useMemo(() => createStyles(palette), [palette]);
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const currentSlide = slides[currentIndex] ?? slides[0];
  const isLast = currentIndex === slides.length - 1;

  const handleNext = () => {
    if (isLast) {
      onComplete?.();
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  return (
    <View style={[styles.container, style]}>
      {/* Top Header Controls */}
      <View style={styles.header}>
        <View style={styles.badgeRow}>
          <View style={styles.badgeDot} />
          <Text style={styles.badgeText}>{currentSlide.badge}</Text>
        </View>

        {!isLast && (
          <Pressable accessibilityRole="button" onPress={onSkip} style={styles.skipBtn}>
            <Text style={styles.skipText}>Skip</Text>
          </Pressable>
        )}
      </View>

      {/* Middle Illustration & Text */}
      <View style={styles.body}>
        <View style={styles.artBox}>
          <Text style={styles.emojiText}>{currentSlide.emoji}</Text>
        </View>

        <View style={styles.textWrap}>
          <Text style={styles.titleText}>{currentSlide.title}</Text>
          <Text style={styles.descText}>{currentSlide.description}</Text>
        </View>
      </View>

      {/* Bottom Navigation & Pagination Dots */}
      <View style={styles.footer}>
        <View style={styles.dotsRow}>
          {slides.map((_, idx) => (
            <Pressable accessibilityRole="button" accessibilityLabel={`Go to slide ${idx + 1} of ${slides.length}`} accessibilityState={{ selected: idx === currentIndex }} aria-selected={idx === currentIndex}
              key={idx}
              onPress={() => setCurrentIndex(idx)}
              style={[
                styles.dot,
                idx === currentIndex ? styles.activeDot : styles.inactiveDot,
              ]}
            />
          ))}
        </View>

        <Pressable accessibilityRole="button"
          onPress={handleNext}
          style={({ pressed }) => [styles.actionBtn, pressed && styles.btnPressed]}
        >
          <Text style={styles.actionBtnText}>
            {isLast ? "Get Started" : "Continue"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const createStyles = (palette: ThemeColors) => StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    padding: sp(32),
    backgroundColor: palette.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: sp(6),
  },
  badgeDot: {
    width: 8,
    height: 8,
    borderRadius: themeStyle.radius.small,
    backgroundColor: palette.primary,
  },
  badgeText: {
    fontSize: ts(12),
    fontWeight: themeStyle.fontWeight.title,
    color: palette["muted-foreground"],
    textTransform: "uppercase",
    fontFamily: "monospace",
  },
  skipBtn: {
    padding: sp(8),
  },
  skipText: {
    fontSize: ts(13),
    fontWeight: themeStyle.fontWeight.label,
    color: palette["muted-foreground"],
  },
  body: {
    alignItems: "center",
    gap: sp(24),
    marginVertical: "auto",
  },
  artBox: {
    ...surface(palette),
    width: 120,
    height: 120,
    borderRadius: themeStyle.radius.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  emojiText: {
    fontSize: ts(54),
  },
  textWrap: {
    gap: sp(12),
    paddingHorizontal: sp(16),
  },
  titleText: {
    fontSize: ts(24),
    fontWeight: themeStyle.fontWeight.heading,
    color: palette.foreground,
    textAlign: "center",
  },
  descText: {
    fontSize: ts(14),
    color: palette["muted-foreground"],
    textAlign: "center",
    lineHeight: ts(20),
  },
  footer: {
    gap: sp(24),
  },
  dotsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: sp(8),
  },
  dot: {
    height: 8,
    borderRadius: themeStyle.radius.small,
  },
  activeDot: {
    width: 32,
    backgroundColor: palette.primary,
  },
  inactiveDot: {
    width: 8,
    backgroundColor: palette.muted,
  },
  actionBtn: {
    width: "100%",
    borderRadius: themeStyle.radius.card,
    backgroundColor: palette.primary,
    paddingVertical: sp(15),
    alignItems: "center",
    justifyContent: "center",
  },
  btnPressed: { ...pressedStyle(true) },
  actionBtnText: {
    color: palette["primary-foreground"],
    fontWeight: themeStyle.fontWeight.title,
    fontSize: ts(15),
  },
});

