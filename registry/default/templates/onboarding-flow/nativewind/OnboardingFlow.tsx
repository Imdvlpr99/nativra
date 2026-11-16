import * as React from "react";
import { View, Text, Pressable } from "react-native";
import { cn } from "@/lib/utils";

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
  className?: string;
}

export function OnboardingFlow({
  slides = DEFAULT_SLIDES,
  onComplete,
  onSkip,
  className,
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
    <View className={cn("flex-1 justify-between sp-p-8 bg-background select-none", className)}>
      {/* Top Header Controls */}
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center sp-gap-1.5">
          <View className="h-2 w-2 rounded-full bg-primary" />
          <Text className="type-xs weight-title text-muted-foreground uppercase tracking-widest font-mono">
            {currentSlide.badge}
          </Text>
        </View>

        {!isLast && (
          <Pressable accessibilityRole="button" onPress={onSkip} className="sp-p-2">
            <Text className="type-xs weight-label text-muted-foreground hover:text-muted-foreground">Skip</Text>
          </Pressable>
        )}
      </View>

      {/* Middle Illustration & Text */}
      <View className="items-center text-center space-y-6 my-auto">
        <View className="surface h-32 w-32 rounded-card items-center justify-center shadow-2xl shadow-primary/10">
          <Text className="text-6xl">{currentSlide.emoji}</Text>
        </View>

        <View className="space-y-3 sp-px-4">
          <Text className="type-2xl weight-heading text-foreground text-center tracking-tight">
            {currentSlide.title}
          </Text>
          <Text className="type-sm text-muted-foreground text-center leading-relaxed">
            {currentSlide.description}
          </Text>
        </View>
      </View>

      {/* Bottom Navigation & Pagination Dots */}
      <View className="space-y-6">
        <View className="flex-row items-center justify-center sp-gap-2">
          {slides.map((_, idx) => (
            <Pressable accessibilityRole="button" accessibilityLabel={`Go to slide ${idx + 1} of ${slides.length}`} accessibilityState={{ selected: idx === currentIndex }}
              key={idx}
              onPress={() => setCurrentIndex(idx)}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                idx === currentIndex ? "w-8 bg-primary" : "w-2 bg-muted"
              )}
            />
          ))}
        </View>

        <Pressable accessibilityRole="button"
          onPress={handleNext}
          className="w-full rounded-card bg-primary sp-py-4 items-center justify-center shadow-lg shadow-primary/25 active:scale-95 transition-all"
        >
          <Text className="type-sm weight-title text-primary-foreground">
            {isLast ? "Get Started" : "Continue"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

