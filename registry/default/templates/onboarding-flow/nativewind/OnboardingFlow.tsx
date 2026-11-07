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
    <View className={cn("flex-1 justify-between p-8 bg-zinc-950 select-none", className)}>
      {/* Top Header Controls */}
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-1.5">
          <View className="h-2 w-2 rounded-full bg-sky-400" />
          <Text className="text-xs font-bold text-zinc-400 uppercase tracking-widest font-mono">
            {currentSlide.badge}
          </Text>
        </View>

        {!isLast && (
          <Pressable onPress={onSkip} className="p-2">
            <Text className="text-xs font-semibold text-zinc-500 hover:text-zinc-300">Skip</Text>
          </Pressable>
        )}
      </View>

      {/* Middle Illustration & Text */}
      <View className="items-center text-center space-y-6 my-auto">
        <View className="h-32 w-32 rounded-3xl bg-zinc-900 border border-zinc-800 items-center justify-center shadow-2xl shadow-sky-500/10">
          <Text className="text-6xl">{currentSlide.emoji}</Text>
        </View>

        <View className="space-y-3 px-4">
          <Text className="text-2xl font-black text-white text-center tracking-tight">
            {currentSlide.title}
          </Text>
          <Text className="text-sm text-zinc-400 text-center leading-relaxed">
            {currentSlide.description}
          </Text>
        </View>
      </View>

      {/* Bottom Navigation & Pagination Dots */}
      <View className="space-y-6">
        <View className="flex-row items-center justify-center gap-2">
          {slides.map((_, idx) => (
            <Pressable
              key={idx}
              onPress={() => setCurrentIndex(idx)}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                idx === currentIndex ? "w-8 bg-sky-400" : "w-2 bg-zinc-800"
              )}
            />
          ))}
        </View>

        <Pressable
          onPress={handleNext}
          className="w-full rounded-2xl bg-sky-500 py-4 items-center justify-center shadow-lg shadow-sky-500/25 active:scale-95 transition-all"
        >
          <Text className="text-sm font-bold text-white">
            {isLast ? "Get Started" : "Continue"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

