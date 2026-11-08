import type { Metadata } from "next";
import Link from "next/link";
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  Smartphone,
  Sparkles,
  Cpu,
  ShieldCheck,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Platform Compatibility Matrix — iOS, Android, Expo Go & New Architecture",
  description:
    "Verified compatibility matrix for all Nativra components across iOS, Android, Expo Go, React Native 0.76+ New Architecture (Bridgeless & Fabric), and VoiceOver/TalkBack.",
  alternates: {
    canonical: "/docs/compatibility",
  },
};

interface MatrixItem {
  id: string;
  name: string;
  type: string;
  android: boolean;
  ios: boolean;
  expoGo: boolean;
  newArch: boolean;
  stylingTargets: string[];
  notes: string;
}

const COMPATIBILITY_DATA: MatrixItem[] = [
  { id: "avatar", name: "Avatar", type: "component", android: true, ios: true, expoGo: true, newArch: true, stylingTargets: ["NativeWind", "StyleSheet"], notes: "Pure React Native Image & Text primitives." },
  { id: "badge", name: "Badge", type: "component", android: true, ios: true, expoGo: true, newArch: true, stylingTargets: ["NativeWind", "StyleSheet"], notes: "Zero native bridge calls. Instant rendering." },
  { id: "button", name: "Button", type: "component", android: true, ios: true, expoGo: true, newArch: true, stylingTargets: ["NativeWind", "StyleSheet"], notes: "Uses Pressable with 44pt touch area and accessibilityState." },
  { id: "card", name: "Card", type: "component", android: true, ios: true, expoGo: true, newArch: true, stylingTargets: ["NativeWind", "StyleSheet"], notes: "Elevation shadow on Android; shadowOffset on iOS." },
  { id: "checkbox", name: "Checkbox", type: "component", android: true, ios: true, expoGo: true, newArch: true, stylingTargets: ["NativeWind", "StyleSheet"], notes: "Accessible role='checkbox' and aria-checked support." },
  { id: "input", name: "Input", type: "component", android: true, ios: true, expoGo: true, newArch: true, stylingTargets: ["NativeWind", "StyleSheet"], notes: "Native TextInput with custom border state and clear button." },
  { id: "label", name: "Label", type: "component", android: true, ios: true, expoGo: true, newArch: true, stylingTargets: ["NativeWind", "StyleSheet"], notes: "Accessible label wrapper for form controls." },
  { id: "separator", name: "Separator", type: "component", android: true, ios: true, expoGo: true, newArch: true, stylingTargets: ["NativeWind", "StyleSheet"], notes: "Pixel-perfect hairline border divider." },
  { id: "skeleton", name: "Skeleton", type: "component", android: true, ios: true, expoGo: true, newArch: true, stylingTargets: ["NativeWind", "StyleSheet"], notes: "Animated loop pulse effect without heavy dependencies." },
  { id: "spinner", name: "Spinner", type: "component", android: true, ios: true, expoGo: true, newArch: true, stylingTargets: ["NativeWind", "StyleSheet"], notes: "Standard ActivityIndicator with theme color tokens." },
  { id: "switch", name: "Switch", type: "component", android: true, ios: true, expoGo: true, newArch: true, stylingTargets: ["NativeWind", "StyleSheet"], notes: "Accessible toggle switch with track color customization." },
  { id: "text", name: "Text", type: "component", android: true, ios: true, expoGo: true, newArch: true, stylingTargets: ["NativeWind", "StyleSheet"], notes: "Dynamic font scaling and text variant hierarchy." },
  { id: "login-form", name: "Login Form", type: "block", android: true, ios: true, expoGo: true, newArch: true, stylingTargets: ["NativeWind", "StyleSheet"], notes: "Composed from Button, Input, Card, and Text." },
  { id: "empty-state", name: "Empty State", type: "block", android: true, ios: true, expoGo: true, newArch: true, stylingTargets: ["NativeWind", "StyleSheet"], notes: "Composed from Card, Button, and typography primitives." },
  { id: "use-disclosure", name: "useDisclosure", type: "hook", android: true, ios: true, expoGo: true, newArch: true, stylingTargets: ["NativeWind", "StyleSheet"], notes: "Pure React state hook; 100% platform agnostic." },
];

export default function CompatibilityPage() {

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="space-y-3 border-b border-border pb-8">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700 dark:border-sky-900 dark:bg-sky-950 dark:text-sky-300">
          Platform Standards
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          Platform Compatibility Matrix
        </h1>
        <p className="text-base text-muted-foreground max-w-2xl leading-relaxed">
          Nativra components are rigorously designed and verified for native mobile hardware. Every primitive adheres to platform HIG standards, accessibility requirements, and the React Native New Architecture.
        </p>
      </div>

      {/* Target SDK Guidelines */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-4 space-y-1.5">
          <div className="flex items-center gap-2 font-semibold text-foreground text-sm">
            <Smartphone className="h-4 w-4 text-emerald-500" />
            <span>Mobile Platforms</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Android API 26+ (Android 8.0+) & iOS 15.0+ supported with native gestures, haptics, and accessibility roles.
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 space-y-1.5">
          <div className="flex items-center gap-2 font-semibold text-foreground text-sm">
            <Sparkles className="h-4 w-4 text-amber-500" />
            <span>Expo SDK Support</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Expo SDK 51 and SDK 52 ready. Every core component runs in standard Expo Go without requiring custom development builds.
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 space-y-1.5">
          <div className="flex items-center gap-2 font-semibold text-foreground text-sm">
            <Cpu className="h-4 w-4 text-purple-500" />
            <span>New Architecture</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            100% compatible with React Native New Architecture (Fabric renderer & TurboModules) and concurrent React 18/19.
          </p>
        </div>
      </div>

      {/* Matrix Table */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold tracking-tight text-foreground">
          Component Verification Matrix
        </h2>

        <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-sm">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border bg-muted/50 text-muted-foreground font-semibold uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3.5">Component / Item</th>
                <th className="px-4 py-3.5 text-center">Android</th>
                <th className="px-4 py-3.5 text-center">iOS</th>
                <th className="px-4 py-3.5 text-center">Expo Go</th>
                <th className="px-4 py-3.5 text-center">Fabric (New Arch)</th>
                <th className="px-4 py-3.5">Styling Targets</th>
                <th className="px-4 py-3.5">Implementation Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {COMPATIBILITY_DATA.map((item) => (
                <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-semibold text-foreground">
                    <Link
                      href={item.type === "component" ? `/docs/components/${item.id}` : `/docs/${item.type}s`}
                      className="hover:underline flex items-center gap-1.5"
                    >
                      <span>{item.name}</span>
                      <span className="rounded bg-muted px-1.5 py-0.2 font-mono text-[10px] text-muted-foreground font-normal">
                        {item.type}
                      </span>
                    </Link>
                  </td>

                  <td className="px-4 py-3 text-center">
                    {item.android ? (
                      <CheckCircle2 className="mx-auto h-4 w-4 text-emerald-500" />
                    ) : (
                      <XCircle className="mx-auto h-4 w-4 text-red-500" />
                    )}
                  </td>

                  <td className="px-4 py-3 text-center">
                    {item.ios ? (
                      <CheckCircle2 className="mx-auto h-4 w-4 text-emerald-500" />
                    ) : (
                      <XCircle className="mx-auto h-4 w-4 text-red-500" />
                    )}
                  </td>

                  <td className="px-4 py-3 text-center">
                    {item.expoGo ? (
                      <CheckCircle2 className="mx-auto h-4 w-4 text-emerald-500" />
                    ) : (
                      <HelpCircle className="mx-auto h-4 w-4 text-amber-500" />
                    )}
                  </td>

                  <td className="px-4 py-3 text-center">
                    {item.newArch ? (
                      <CheckCircle2 className="mx-auto h-4 w-4 text-emerald-500" />
                    ) : (
                      <XCircle className="mx-auto h-4 w-4 text-red-500" />
                    )}
                  </td>

                  <td className="px-4 py-3 font-mono text-[11px] text-muted-foreground">
                    {item.stylingTargets.join(" • ")}
                  </td>

                  <td className="px-4 py-3 text-muted-foreground text-[11px] max-w-xs">
                    {item.notes}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Quality Guarantees */}
      <section className="rounded-xl border border-border bg-muted/30 p-5 space-y-2 text-xs">
        <div className="flex items-center gap-2 font-semibold text-foreground">
          <ShieldCheck className="h-4 w-4 text-emerald-500" />
          <span>Automated Verification Assurance</span>
        </div>
        <p className="text-muted-foreground leading-relaxed">
          Nativra verifies every component in a dedicated Expo companion testing app (<code className="font-mono text-foreground">apps/native-preview</code>) on both Android and iOS devices before publishing to the registry. We test touch responsiveness, accessibility announcements, dynamic font scaling, and light/dark theme transitions.
        </p>
      </section>
    </div>
  );
}
