import * as React from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
} from "react-native";

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
          <Pressable onPress={onSkip} style={styles.skipBtn}>
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
            <Pressable
              key={idx}
              onPress={() => setCurrentIndex(idx)}
              style={[
                styles.dot,
                idx === currentIndex ? styles.activeDot : styles.inactiveDot,
              ]}
            />
          ))}
        </View>

        <Pressable
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    padding: 32,
    backgroundColor: "#09090B",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  badgeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#38BDF8",
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#A1A1AA",
    textTransform: "uppercase",
    fontFamily: "monospace",
  },
  skipBtn: {
    padding: 8,
  },
  skipText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#71717A",
  },
  body: {
    alignItems: "center",
    gap: 24,
    marginVertical: "auto",
  },
  artBox: {
    width: 120,
    height: 120,
    borderRadius: 28,
    backgroundColor: "#18181B",
    borderWidth: 1,
    borderColor: "#27272A",
    alignItems: "center",
    justifyContent: "center",
  },
  emojiText: {
    fontSize: 54,
  },
  textWrap: {
    gap: 12,
    paddingHorizontal: 16,
  },
  titleText: {
    fontSize: 24,
    fontWeight: "900",
    color: "#FFFFFF",
    textAlign: "center",
  },
  descText: {
    fontSize: 14,
    color: "#A1A1AA",
    textAlign: "center",
    lineHeight: 20,
  },
  footer: {
    gap: 24,
  },
  dotsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  activeDot: {
    width: 32,
    backgroundColor: "#38BDF8",
  },
  inactiveDot: {
    width: 8,
    backgroundColor: "#27272A",
  },
  actionBtn: {
    width: "100%",
    borderRadius: 16,
    backgroundColor: "#0284C7",
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  btnPressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.9,
  },
  actionBtnText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 15,
  },
});
