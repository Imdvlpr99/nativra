"use client";

import React, { useState } from "react";
import type { RegistryItem } from "@nativra/registry-schema";
import {
  Check,
  Copy,
  RefreshCw,
  Terminal,
  Sparkles,
  Mail,
  Lock,
  ShieldCheck,
  Heart,
  Plus,
  Bell,
  Search,
  ChevronDown,
  ChevronUp,
  Info,
  CheckCircle2,
  X,
  ArrowUpRight,
  ArrowDownLeft,
  ShoppingCart,
  Star,
  Eye,
  EyeOff,
  Send,
  Paperclip,
  Shield,
  TrendingUp,
  ChevronLeft,
  LayoutDashboard,
  BarChart3,
  Users,
  CreditCard,
  LogOut,
  Flame,
  Keyboard,
  Vibrate,
  Sun,
  Moon,
  Code2,
  Palette,
} from "lucide-react";
import { DeviceFrame } from "./DeviceFrame";

interface ComponentPreviewProps {
  item: RegistryItem;
}

// ---------------------------------------------------------------------------
// Type-safe Style Maps for Previews
// ---------------------------------------------------------------------------

type ButtonVariant = "default" | "primary" | "secondary" | "destructive" | "outline" | "ghost" | "link";
type ButtonSize = "xs" | "sm" | "md" | "lg" | "xl";

const BUTTON_VARIANTS: Record<ButtonVariant, string> = {
  default: "bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200",
  primary: "bg-sky-600 text-white hover:bg-sky-500",
  secondary: "bg-zinc-100 text-zinc-900 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-50 dark:hover:bg-zinc-700",
  destructive: "bg-red-600 text-white hover:bg-red-500",
  outline: "border border-border bg-transparent text-foreground hover:bg-muted/50",
  ghost: "bg-transparent text-foreground hover:bg-muted/50",
  link: "bg-transparent text-sky-600 underline hover:text-sky-700 dark:text-sky-400",
};

const BUTTON_SIZES: Record<ButtonSize, string> = {
  xs: "px-2.5 py-1 text-xs gap-1",
  sm: "px-3 py-1.5 text-xs gap-1.5",
  md: "px-4 py-2 text-sm gap-2",
  lg: "px-5 py-2.5 text-base gap-2",
  xl: "px-6 py-3 text-base gap-2.5 font-bold",
};

type BadgeVariant = "default" | "primary" | "secondary" | "destructive" | "outline";
type BadgeSize = "sm" | "md" | "lg";

const BADGE_VARIANTS: Record<BadgeVariant, string> = {
  default: "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900",
  primary: "bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300",
  secondary: "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300",
  destructive: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300",
  outline: "border border-border text-foreground bg-transparent",
};

const BADGE_SIZES: Record<BadgeSize, string> = {
  sm: "px-2 py-0.5 text-[10px]",
  md: "px-2.5 py-0.5 text-xs",
  lg: "px-3 py-1 text-xs",
};

type AvatarSize = "sm" | "md" | "lg" | "xl";
const AVATAR_SIZES: Record<AvatarSize, { box: string; text: string }> = {
  sm: { box: "h-8 w-8", text: "text-xs" },
  md: { box: "h-10 w-10", text: "text-sm" },
  lg: { box: "h-14 w-14", text: "text-base" },
  xl: { box: "h-20 w-20", text: "text-xl" },
};

type TextVariant = "h1" | "h2" | "h3" | "h4" | "body" | "muted";
const TEXT_VARIANTS: Record<TextVariant, string> = {
  h1: "text-3xl font-extrabold tracking-tight",
  h2: "text-2xl font-bold tracking-tight",
  h3: "text-xl font-semibold",
  h4: "text-lg font-medium",
  body: "text-sm text-foreground leading-relaxed",
  muted: "text-sm text-muted-foreground",
};

type SpinnerSize = "sm" | "md" | "lg";
const SPINNER_SIZES: Record<SpinnerSize, string> = {
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-8 w-8",
};

// ---------------------------------------------------------------------------
// Component Preview Harness
// ---------------------------------------------------------------------------

export function ComponentPreview({ item }: ComponentPreviewProps) {
  const [copied, setCopied] = useState(false);
  const [copyMode, setCopyMode] = useState<"cli" | "import">("cli");

  // Button state
  const [btnVariant, setBtnVariant] = useState<ButtonVariant>("default");
  const [btnSize, setBtnSize] = useState<ButtonSize>("md");
  const [btnLoading, setBtnLoading] = useState(false);
  const [btnDisabled, setBtnDisabled] = useState(false);

  // Badge state
  const [badgeVariant, setBadgeVariant] = useState<BadgeVariant>("default");
  const [badgeSize, setBadgeSize] = useState<BadgeSize>("md");

  // Avatar state
  const [avatarSize, setAvatarSize] = useState<AvatarSize>("md");

  // Checkbox state
  const [checked, setChecked] = useState(true);
  const [checkboxDisabled, setCheckboxDisabled] = useState(false);

  // Switch state
  const [switchOn, setSwitchOn] = useState(true);
  const [switchDisabled, setSwitchDisabled] = useState(false);

  // Input state
  const [inputVal, setInputVal] = useState("johndoe@example.com");
  const [inputError, setInputError] = useState(false);
  const [inputDisabled, setInputDisabled] = useState(false);

  // Card state
  const [cardElevated, setCardElevated] = useState(true);
  const [cardPadding, setCardPadding] = useState<"sm" | "md" | "lg">("md");

  // Label state
  const [labelRequired, setLabelRequired] = useState(true);
  const [labelDisabled, setLabelDisabled] = useState(false);

  // Separator state
  const [sepOrientation, setSepOrientation] = useState<"horizontal" | "vertical">("horizontal");

  // Skeleton state
  const [skeletonShape, setSkeletonShape] = useState<"card" | "avatar" | "lines">("card");

  // Spinner state
  const [spinnerSize, setSpinnerSize] = useState<SpinnerSize>("md");
  const [spinnerVariant, setSpinnerVariant] = useState<"default" | "primary">("default");

  // Text state
  const [textVariant, setTextVariant] = useState<TextVariant>("h2");

  // Hook disclosure demo state
  const [isDisclosureOpen, setIsDisclosureOpen] = useState(true);

  // Additional component states
  const [sliderVal, setSliderVal] = useState(65);
  const [progressVal] = useState(72);
  const [activeTabId, setActiveTabId] = useState("account");
  const [activeAccordion, setActiveAccordion] = useState<string | null>("acc-1");
  const [radioVal, setRadioVal] = useState("starter");
  const [textareaVal, setTextareaVal] = useState("Designed with clean typography and balanced mobile padding.");

  // Metronic Enterprise states
  const [segmentedTab, setSegmentedTab] = useState("overview");
  const [walletHideBalance, setWalletHideBalance] = useState(false);
  const [cartCount, setCartCount] = useState(2);
  const [filterCategory, setFilterCategory] = useState("All");
  const [accountTab, setAccountTab] = useState<"profile" | "team" | "security" | "billing">("profile");
  const [ratingStarsVal, setRatingStarsVal] = useState(4);
  const [chatDemoText, setChatDemoText] = useState("");

  const importSnippet = React.useMemo(() => {
    const firstFile = item.files?.[0]?.path;
    const rawFileName = firstFile
      ? firstFile.split("/").pop()?.replace(/\.(tsx|ts|jsx|js)$/, "")
      : "";
    const name = rawFileName || item.name.replace(/[^a-zA-Z0-9]/g, "");

    if (item.type === "hook") {
      return `import { ${name} } from "@/hooks/${name}";`;
    }
    if (item.type === "block") {
      return `import { ${name} } from "@/components/blocks/${name}";`;
    }
    if (item.type === "template") {
      return `import { ${name} } from "@/components/templates/${name}";`;
    }
    if (item.type === "utility") {
      return `import { ${name} } from "@/lib/utils";`;
    }
    return `import { ${name} } from "@/components/ui/${name}";`;
  }, [item]);

  const copyCommand = () => {
    const textToCopy = copyMode === "cli" ? `npx nativra add ${item.id}` : importSnippet;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // -------------------------------------------------------------------------
  // Render Canvas
  // -------------------------------------------------------------------------
  const renderInteractiveCanvas = () => {
    switch (item.id) {
      case "button":
        return (
          <div className="flex flex-col items-center justify-center gap-4">
            <button
              disabled={btnDisabled || btnLoading}
              className={`inline-flex items-center justify-center rounded-lg font-medium transition-all ${
                BUTTON_VARIANTS[btnVariant]
              } ${BUTTON_SIZES[btnSize]} ${
                btnDisabled || btnLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
              }`}
            >
              {btnLoading && <RefreshCw className="h-4 w-4 animate-spin mr-1.5" />}
              <span>{btnLoading ? "Please wait..." : "Continue"}</span>
            </button>
          </div>
        );

      case "badge":
        return (
          <div className="flex items-center justify-center">
            <span
              className={`inline-flex items-center font-medium rounded-full ${
                BADGE_VARIANTS[badgeVariant]
              } ${BADGE_SIZES[badgeSize]}`}
            >
              Feature Preview
            </span>
          </div>
        );

      case "avatar":
        return (
          <div className="flex items-center justify-center">
            <div
              className={`relative flex items-center justify-center rounded-full bg-zinc-200 font-semibold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 overflow-hidden shadow-sm ${
                AVATAR_SIZES[avatarSize].box
              }`}
            >
              <span className={AVATAR_SIZES[avatarSize].text}>JD</span>
            </div>
          </div>
        );

      case "checkbox":
        return (
          <div className="flex items-center justify-center">
            <label
              className={`flex items-center gap-3 cursor-pointer select-none ${
                checkboxDisabled ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <div
                onClick={() => !checkboxDisabled && setChecked(!checked)}
                className={`flex h-5 w-5 items-center justify-center rounded border transition-colors ${
                  checked
                    ? "bg-zinc-900 border-zinc-900 text-white dark:bg-zinc-100 dark:border-zinc-100 dark:text-zinc-900"
                    : "border-zinc-400 bg-transparent dark:border-zinc-600"
                }`}
              >
                {checked && <Check className="h-3.5 w-3.5 stroke-[3]" />}
              </div>
              <span className="text-sm font-medium text-foreground">
                Accept terms and privacy policy
              </span>
            </label>
          </div>
        );

      case "switch":
        return (
          <div className="flex items-center justify-center">
            <label
              className={`flex items-center gap-3 cursor-pointer select-none ${
                switchDisabled ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <div
                onClick={() => !switchDisabled && setSwitchOn(!switchOn)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  switchOn
                    ? "bg-sky-600 dark:bg-sky-500"
                    : "bg-zinc-300 dark:bg-zinc-700"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    switchOn ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </div>
              <span className="text-sm font-medium text-foreground">
                Enable push notifications
              </span>
            </label>
          </div>
        );

      case "input":
        return (
          <div className="w-full max-w-sm space-y-1.5">
            <label
              className={`block text-xs font-semibold ${
                inputDisabled ? "text-muted-foreground" : "text-foreground"
              }`}
            >
              Email address <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                disabled={inputDisabled}
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="name@example.com"
                className={`w-full rounded-lg border bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors ${
                  inputError
                    ? "border-red-500 focus:border-red-600"
                    : "border-border focus:border-sky-500 dark:focus:border-sky-400"
                } ${inputDisabled ? "opacity-50 cursor-not-allowed bg-muted/30" : ""}`}
              />
            </div>
            <p
              className={`text-xs ${
                inputError ? "text-red-500 font-medium" : "text-muted-foreground"
              }`}
            >
              {inputError
                ? "Please enter a valid email address."
                : "We will never share your email with third parties."}
            </p>
          </div>
        );

      case "card": {
        const paddingClass =
          cardPadding === "sm" ? "p-3" : cardPadding === "lg" ? "p-6" : "p-4";
        return (
          <div className="w-full max-w-sm">
            <div
              className={`rounded-xl border border-border bg-card text-card-foreground transition-all ${
                cardElevated ? "shadow-md" : "shadow-none"
              } ${paddingClass}`}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm">Account Overview</h4>
                  <p className="text-xs text-muted-foreground">Standard Developer Tier</p>
                </div>
              </div>
              <p className="mt-3 text-xs text-muted-foreground leading-relaxed">
                Nativra cards support customizable padding and optional elevation for native mobile depth.
              </p>
            </div>
          </div>
        );
      }

      case "label":
        return (
          <div className="flex items-center justify-center">
            <span
              className={`text-sm font-medium ${
                labelDisabled ? "text-muted-foreground opacity-50" : "text-foreground"
              }`}
            >
              Display Name
              {labelRequired && <span className="ml-1 text-red-500">*</span>}
            </span>
          </div>
        );

      case "separator":
        return (
          <div className="flex h-36 w-full max-w-sm items-center justify-center">
            {sepOrientation === "horizontal" ? (
              <div className="w-full space-y-3">
                <div className="text-xs text-muted-foreground">Section Alpha</div>
                <div className="h-[1px] w-full bg-border" />
                <div className="text-xs text-muted-foreground">Section Beta</div>
              </div>
            ) : (
              <div className="flex h-16 items-center gap-4">
                <span className="text-xs text-muted-foreground">Item 1</span>
                <div className="h-full w-[1px] bg-border" />
                <span className="text-xs text-muted-foreground">Item 2</span>
                <div className="h-full w-[1px] bg-border" />
                <span className="text-xs text-muted-foreground">Item 3</span>
              </div>
            )}
          </div>
        );

      case "skeleton":
        return (
          <div className="w-full max-w-sm">
            {skeletonShape === "avatar" && (
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
                <div className="space-y-2 flex-1">
                  <div className="h-3.5 w-3/4 rounded bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
                  <div className="h-3 w-1/2 rounded bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
                </div>
              </div>
            )}
            {skeletonShape === "card" && (
              <div className="rounded-xl border border-border p-4 space-y-3 bg-card">
                <div className="h-24 w-full rounded-lg bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
                <div className="h-4 w-2/3 rounded bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
                <div className="h-3 w-full rounded bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
              </div>
            )}
            {skeletonShape === "lines" && (
              <div className="space-y-2.5">
                <div className="h-4 w-full rounded bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
                <div className="h-4 w-5/6 rounded bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
                <div className="h-4 w-2/3 rounded bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
              </div>
            )}
          </div>
        );

      case "spinner": {
        const colorClass =
          spinnerVariant === "primary" ? "text-sky-600 dark:text-sky-400" : "text-foreground";
        return (
          <div className="flex items-center justify-center">
            <RefreshCw
              className={`animate-spin ${SPINNER_SIZES[spinnerSize]} ${colorClass}`}
            />
          </div>
        );
      }

      case "text":
        return (
          <div className="flex items-center justify-center text-center">
            <p className={TEXT_VARIANTS[textVariant]}>
              Build resilient React Native interfaces.
            </p>
          </div>
        );

      case "login-form":
        return (
          <div className="w-full max-w-sm rounded-xl border border-border bg-card p-5 text-card-foreground shadow-sm">
            <h4 className="font-bold text-base">Welcome Back</h4>
            <p className="text-xs text-muted-foreground mb-4">Enter your credentials to sign in</p>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium block mb-1">Email</label>
                <div className="flex items-center rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs">
                  <Mail className="h-3.5 w-3.5 text-muted-foreground mr-2" />
                  <input
                    type="email"
                    readOnly
                    value="dev@nativra.dev"
                    className="bg-transparent outline-none flex-1 text-xs"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium block mb-1">Password</label>
                <div className="flex items-center rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs">
                  <Lock className="h-3.5 w-3.5 text-muted-foreground mr-2" />
                  <input
                    type="password"
                    readOnly
                    value="••••••••••••"
                    className="bg-transparent outline-none flex-1 text-xs"
                  />
                </div>
              </div>
              <button
                type="button"
                className="w-full rounded-lg bg-zinc-900 py-2 text-xs font-semibold text-white dark:bg-zinc-100 dark:text-zinc-900 mt-2"
              >
                Sign In
              </button>
            </div>
          </div>
        );

      case "empty-state":
        return (
          <div className="w-full max-w-sm rounded-xl border border-dashed border-border bg-card p-6 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <Sparkles className="h-6 w-6" />
            </div>
            <h4 className="font-semibold text-sm">No items found</h4>
            <p className="mt-1 text-xs text-muted-foreground">
              Get started by creating your first component with Nativra CLI.
            </p>
            <button className="mt-4 rounded-lg bg-sky-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-sky-500">
              Create Item
            </button>
          </div>
        );

      case "use-disclosure":
        return (
          <div className="w-full max-w-sm rounded-xl border border-border bg-card p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium">useDisclosure() State</span>
              <button
                onClick={() => setIsDisclosureOpen(!isDisclosureOpen)}
                className="rounded-md bg-zinc-900 px-2.5 py-1 text-xs font-medium text-white dark:bg-zinc-100 dark:text-zinc-900"
              >
                {isDisclosureOpen ? "Close Modal" : "Open Modal"}
              </button>
            </div>
            {isDisclosureOpen && (
              <div className="mt-3 rounded-lg border border-border bg-muted/40 p-3 text-xs text-muted-foreground">
                <p className="font-medium text-foreground">Disclosure isOpen = true</p>
                <p className="mt-1">
                  Provides `isOpen`, `onOpen()`, `onClose()`, and `onToggle()` helpers.
                </p>
              </div>
            )}
          </div>
        );

      case "user-profile":
        return (
          <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-5 text-card-foreground shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-900 text-white font-bold text-sm dark:bg-zinc-100 dark:text-zinc-900">
                SM
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-sky-100 px-2.5 py-0.5 text-[11px] font-semibold text-sky-800 dark:bg-sky-950 dark:text-sky-300">
                <ShieldCheck className="h-3 w-3" />
                Verified Pro
              </span>
            </div>
            <div className="mt-3">
              <h4 className="font-bold text-base text-foreground">Sophia Martinez</h4>
              <p className="text-xs text-muted-foreground">@sophiam</p>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                Senior Mobile Engineer building design systems & fluid React Native mobile apps.
              </p>
            </div>
            <div className="my-3.5 h-px w-full bg-border" />
            <div className="flex items-center justify-around text-center py-1">
              <div>
                <p className="text-sm font-bold text-foreground">14.2k</p>
                <p className="text-[10px] text-muted-foreground">Followers</p>
              </div>
              <div className="h-5 w-px bg-border" />
              <div>
                <p className="text-sm font-bold text-foreground">420</p>
                <p className="text-[10px] text-muted-foreground">Following</p>
              </div>
              <div className="h-5 w-px bg-border" />
              <div>
                <p className="text-sm font-bold text-foreground">38</p>
                <p className="text-[10px] text-muted-foreground">Projects</p>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <button className="flex-1 rounded-xl bg-zinc-900 py-2 text-xs font-semibold text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900">
                Follow
              </button>
              <button className="flex-1 rounded-xl border border-border bg-muted/40 py-2 text-xs font-semibold text-foreground hover:bg-muted">
                Message
              </button>
            </div>
          </div>
        );

      case "settings-list":
        return (
          <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-5 text-card-foreground shadow-sm">
            <h4 className="font-bold text-base text-foreground">Preferences</h4>
            <p className="text-xs text-muted-foreground mb-3">Manage your mobile app experience</p>
            <div className="space-y-3 divide-y divide-border text-xs">
              <div className="flex items-center justify-between pt-2">
                <div>
                  <p className="font-medium text-foreground">Push Notifications</p>
                  <p className="text-[11px] text-muted-foreground">Receive instant alerts</p>
                </div>
                <div className="flex h-5 w-9 cursor-pointer items-center justify-end rounded-full bg-sky-600 p-0.5">
                  <div className="h-4 w-4 rounded-full bg-white shadow-sm" />
                </div>
              </div>
              <div className="flex items-center justify-between pt-3">
                <div>
                  <p className="font-medium text-foreground">Dark Theme</p>
                  <p className="text-[11px] text-muted-foreground">Midnight palette</p>
                </div>
                <div className="flex h-5 w-9 cursor-pointer items-center justify-start rounded-full bg-muted p-0.5">
                  <div className="h-4 w-4 rounded-full bg-background shadow-sm" />
                </div>
              </div>
              <div className="flex items-center justify-between pt-3">
                <div>
                  <p className="font-medium text-foreground">Face ID & Security</p>
                  <p className="text-[11px] text-muted-foreground">Biometric app lock</p>
                </div>
                <div className="flex h-5 w-9 cursor-pointer items-center justify-end rounded-full bg-sky-600 p-0.5">
                  <div className="h-4 w-4 rounded-full bg-white shadow-sm" />
                </div>
              </div>
            </div>
          </div>
        );

      case "pricing-card":
        return (
          <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-sm">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-base text-foreground">Pro Mobile</h4>
              <span className="rounded-full bg-sky-100 px-2 py-0.5 text-[10px] font-semibold text-sky-800 dark:bg-sky-950 dark:text-sky-300">
                Most Popular
              </span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">Complete mobile UI infrastructure for production Expo apps.</p>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-3xl font-extrabold text-foreground">$19</span>
              <span className="text-xs text-muted-foreground">/ month, billed yearly</span>
            </div>
            <div className="my-4 h-px w-full bg-border" />
            <div className="space-y-2 text-xs text-foreground">
              <div className="flex items-center gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>12 foundation mobile components</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>Dual NativeWind v4 & StyleSheet</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>Source-first ownership, 0 bloat</span>
              </div>
            </div>
            <button className="mt-5 w-full rounded-xl bg-zinc-900 py-2.5 text-xs font-semibold text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900">
              Start 14-Day Free Trial
            </button>
          </div>
        );

      case "metric-card":
        return (
          <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-5 text-card-foreground shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Monthly Active Users</span>
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                +24.8%
              </span>
            </div>
            <div className="mt-3">
              <h3 className="text-3xl font-black tracking-tight text-foreground">48,290</h3>
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-xs text-muted-foreground">
              <span>vs last month</span>
              <span className="font-medium text-emerald-600">High organic retention</span>
            </div>
          </div>
        );

      case "icon-button":
        return (
          <div className="flex items-center justify-center gap-4">
            <button
              type="button"
              className="flex h-11 w-11 items-center justify-center rounded-xl bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 shadow-sm active:scale-95 transition-all"
            >
              <Heart className="h-5 w-5 fill-current" />
            </button>
            <button
              type="button"
              className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-500 text-white shadow-sm shadow-sky-500/20 active:scale-95 transition-all"
            >
              <Bell className="h-5 w-5" />
            </button>
            <button
              type="button"
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-card text-foreground hover:bg-muted/50 active:scale-95 transition-all"
            >
              <Search className="h-5 w-5" />
            </button>
          </div>
        );

      case "fab":
        return (
          <div className="relative h-44 w-full max-w-sm rounded-2xl border border-dashed border-border bg-muted/20 p-4 flex flex-col justify-between">
            <p className="text-xs text-muted-foreground">Mobile Viewport Canvas</p>
            <div className="flex justify-end">
              <button
                type="button"
                className="flex items-center gap-2 rounded-full bg-sky-600 px-4 py-3 text-xs font-bold text-white shadow-lg shadow-sky-600/30 hover:bg-sky-500 active:scale-95 transition-all"
              >
                <Plus className="h-4 w-4 stroke-[3]" />
                <span>Create New</span>
              </button>
            </div>
          </div>
        );

      case "otp-input":
        return (
          <div className="flex flex-col items-center gap-3">
            <div className="flex gap-2.5">
              {["2", "0", "4", "8"].map((digit, i) => (
                <div
                  key={i}
                  className="flex h-12 w-12 items-center justify-center rounded-xl border-2 border-sky-500 bg-background text-lg font-bold text-foreground shadow-sm"
                >
                  {digit}
                </div>
              ))}
            </div>
            <p className="text-[11px] text-muted-foreground font-medium">Auto-focusing PIN entry box</p>
          </div>
        );

      case "progress":
        return (
          <div className="w-full max-w-sm space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-foreground">Syncing Database</span>
              <span className="text-sky-600 dark:text-sky-400">{progressVal}%</span>
            </div>
            <div className="h-2.5 w-full rounded-full bg-muted overflow-hidden">
              <div
                className="h-full bg-sky-600 transition-all duration-300 rounded-full"
                style={{ width: `${progressVal}%` }}
              />
            </div>
          </div>
        );

      case "alert":
        return (
          <div className="w-full max-w-sm rounded-xl border border-sky-200 bg-sky-50 p-4 text-sky-900 dark:border-sky-900/50 dark:bg-sky-950/40 dark:text-sky-200">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-sky-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h5 className="text-xs font-bold">New Update Available</h5>
                <p className="text-xs opacity-90 leading-relaxed">
                  Version 4.2 of your design token bundle is ready to sync.
                </p>
              </div>
            </div>
          </div>
        );

      case "tabs":
        return (
          <div className="w-full max-w-sm space-y-3">
            <div className="flex rounded-xl bg-muted p-1 text-xs font-semibold">
              {[
                { id: "account", label: "Account" },
                { id: "security", label: "Security" },
                { id: "billing", label: "Billing" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTabId(tab.id)}
                  className={`flex-1 rounded-lg py-1.5 transition-all text-center ${
                    activeTabId === tab.id
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <div className="rounded-xl border border-border bg-card p-4 text-xs text-muted-foreground">
              Active tab view: <strong className="text-foreground capitalize">{activeTabId}</strong>
            </div>
          </div>
        );

      case "accordion":
        return (
          <div className="w-full max-w-sm rounded-xl border border-border divide-y divide-border overflow-hidden bg-card text-xs">
            {[
              { id: "acc-1", title: "Can I customize NativeWind classes?", text: "Yes! All components are source-first, so you can freely modify any Tailwind class directly in your project." },
              { id: "acc-2", title: "Does it work with React Native StyleSheet?", text: "Nativra provides 100% parity across both NativeWind v4 and React Native StyleSheet targets." },
            ].map((acc) => (
              <div key={acc.id} className="p-3">
                <button
                  onClick={() => setActiveAccordion(activeAccordion === acc.id ? null : acc.id)}
                  className="flex w-full items-center justify-between font-semibold text-foreground text-left"
                >
                  <span>{acc.title}</span>
                  {activeAccordion === acc.id ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                </button>
                {activeAccordion === acc.id && (
                  <p className="mt-2 text-muted-foreground leading-relaxed pt-1 border-t border-border/50">
                    {acc.text}
                  </p>
                )}
              </div>
            ))}
          </div>
        );

      case "bottom-sheet":
        return (
          <div className="w-full max-w-sm rounded-2xl border border-border bg-card shadow-xl overflow-hidden">
            <div className="flex justify-center pt-2.5 pb-1">
              <div className="h-1.5 w-10 rounded-full bg-muted-foreground/30" />
            </div>
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-foreground">Select Payment Method</h4>
                <span className="text-[10px] text-muted-foreground">Swipe down to dismiss</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between rounded-xl border border-border bg-muted/30 p-2.5 text-xs">
                  <span>Apple Pay / Google Wallet</span>
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                </div>
                <div className="flex items-center justify-between rounded-xl border border-border bg-muted/30 p-2.5 text-xs text-muted-foreground">
                  <span>Credit Card (••• 4242)</span>
                </div>
              </div>
            </div>
          </div>
        );

      case "stack":
        return (
          <div className="w-full max-w-sm rounded-xl border border-dashed border-border p-4 space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
              VStack Layout (gap-3)
            </span>
            <div className="flex flex-col gap-2.5">
              <div className="h-8 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-xs font-semibold text-sky-600 dark:text-sky-400">
                Item 1 (VStack child)
              </div>
              <div className="h-8 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-xs font-semibold text-sky-600 dark:text-sky-400">
                Item 2 (VStack child)
              </div>
            </div>
          </div>
        );

      case "safe-area":
        return (
          <div className="relative h-44 w-full max-w-sm rounded-2xl border-2 border-border bg-zinc-950 p-2 overflow-hidden flex flex-col justify-between text-zinc-100">
            <div className="flex justify-between items-center px-2 py-1 text-[10px] font-mono text-zinc-400 border-b border-zinc-800">
              <span>9:41</span>
              <span className="rounded-full bg-zinc-800 px-2 py-0.5 text-[9px]">Top Inset: 44pt</span>
              <span>100%</span>
            </div>
            <div className="flex-1 flex items-center justify-center">
              <span className="text-xs text-zinc-400 font-medium">Safe Protected Content Zone</span>
            </div>
            <div className="flex justify-center pb-1">
              <div className="h-1 w-24 rounded-full bg-zinc-600" />
            </div>
          </div>
        );

      case "textarea":
        return (
          <div className="w-full max-w-sm space-y-1.5">
            <label className="text-xs font-semibold text-foreground block">Project Notes</label>
            <textarea
              rows={3}
              value={textareaVal}
              onChange={(e) => setTextareaVal(e.target.value)}
              className="w-full rounded-xl border border-border bg-background p-3 text-xs text-foreground outline-none focus:ring-2 focus:ring-sky-500 transition-all resize-none"
            />
            <div className="flex justify-end text-[10px] text-muted-foreground">
              {textareaVal.length} characters
            </div>
          </div>
        );

      case "radio-group":
        return (
          <div className="w-full max-w-sm space-y-2">
            {[
              { id: "starter", title: "Free Community Tier", desc: "Core mobile components" },
              { id: "pro", title: "Enterprise & Team Pro", desc: "Advanced templates and generators" },
            ].map((opt) => (
              <div
                key={opt.id}
                onClick={() => setRadioVal(opt.id)}
                className={`flex items-start gap-3 rounded-xl border p-3 cursor-pointer transition-colors ${
                  radioVal === opt.id
                    ? "border-sky-500 bg-sky-50/50 dark:bg-sky-950/20"
                    : "border-border hover:bg-muted/40"
                }`}
              >
                <div
                  className={`mt-0.5 flex h-4 w-4 items-center justify-center rounded-full border transition-colors ${
                    radioVal === opt.id ? "border-sky-500 bg-sky-500" : "border-muted-foreground"
                  }`}
                >
                  {radioVal === opt.id && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
                </div>
                <div className="space-y-0.5 text-xs">
                  <p className="font-semibold text-foreground">{opt.title}</p>
                  <p className="text-muted-foreground text-[11px]">{opt.desc}</p>
                </div>
              </div>
            ))}
          </div>
        );

      case "select":
        return (
          <div className="w-full max-w-sm space-y-1.5">
            <label className="text-xs font-semibold text-foreground block">Country / Region</label>
            <div className="flex items-center justify-between rounded-xl border border-border bg-background px-3 py-2.5 text-xs text-foreground shadow-sm cursor-pointer hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors">
              <span>United States (US)</span>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        );

      case "slider":
        return (
          <div className="w-full max-w-sm space-y-3">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-foreground">Haptic Intensity</span>
              <span className="text-sky-600 dark:text-sky-400 font-mono">{sliderVal}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={sliderVal}
              onChange={(e) => setSliderVal(Number(e.target.value))}
              className="w-full accent-sky-500 cursor-pointer"
            />
          </div>
        );

      case "toast":
        return (
          <div className="w-full max-w-sm rounded-xl border border-border bg-card p-3 shadow-lg flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
              <div>
                <p className="font-bold text-foreground">File exported successfully</p>
                <p className="text-[11px] text-muted-foreground">Saved to /components/ui/</p>
              </div>
            </div>
            <button className="text-muted-foreground hover:text-foreground p-1">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        );

      case "dialog":
        return (
          <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-5 shadow-2xl space-y-4">
            <div className="space-y-1">
              <h4 className="font-bold text-base text-foreground">Confirm File Deletion</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Are you sure you want to delete this component? This action will remove the source file from your local workspace.
              </p>
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <button className="rounded-xl border border-border px-3.5 py-1.5 text-xs font-semibold text-foreground hover:bg-muted">
                Cancel
              </button>
              <button className="rounded-xl bg-red-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-red-500">
                Delete
              </button>
            </div>
          </div>
        );

      case "segmented-control":
        return (
          <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-4">
            <div className="relative flex rounded-xl border border-border bg-muted/60 p-1">
              {[
                { id: "overview", label: "Overview" },
                { id: "analytics", label: "Analytics", badge: 3 },
                { id: "settings", label: "Settings" },
              ].map((tab) => {
                const active = segmentedTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setSegmentedTab(tab.id)}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      active
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <span>{tab.label}</span>
                    {tab.badge && (
                      <span className="rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 px-1.5 py-0.2 text-[10px] font-bold">
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            <div className="mt-3 text-center text-xs text-muted-foreground">
              Active View: <span className="font-semibold text-foreground capitalize">{segmentedTab}</span>
            </div>
          </div>
        );

      case "data-table":
        return (
          <div className="w-full max-w-md overflow-hidden rounded-xl border border-border bg-card shadow-sm text-xs">
            <div className="flex border-b border-border bg-muted/50 px-4 py-2.5 font-semibold uppercase tracking-wider text-muted-foreground">
              <span className="w-2/5">Customer</span>
              <span className="w-1/4">Role</span>
              <span className="w-1/4">Status</span>
              <span className="w-1/6 text-right">Spent</span>
            </div>
            {[
              { name: "Alex Morgan", role: "Owner", status: "Active", spent: "$12,450" },
              { name: "Sarah Connor", role: "Admin", status: "Active", spent: "$4,200" },
              { name: "James Holden", role: "Viewer", status: "Pending", spent: "$850" },
            ].map((row, i) => (
              <div
                key={row.name}
                className={`flex items-center px-4 py-2.5 border-b border-border/60 ${
                  i % 2 === 1 ? "bg-muted/20" : ""
                }`}
              >
                <span className="w-2/5 font-semibold text-foreground">{row.name}</span>
                <span className="w-1/4 text-muted-foreground">{row.role}</span>
                <span className="w-1/4">
                  <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                    {row.status}
                  </span>
                </span>
                <span className="w-1/6 text-right font-medium text-foreground">{row.spent}</span>
              </div>
            ))}
            <div className="flex justify-between bg-muted/30 px-4 py-2 text-[11px] text-muted-foreground">
              <span>Showing 3 of 24 records</span>
              <span className="font-medium">Page 1 of 8</span>
            </div>
          </div>
        );

      case "transaction-row":
        return (
          <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <ArrowDownLeft className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-foreground">Stripe Payout Cleared</h4>
                  <p className="text-xs text-muted-foreground">Today, 14:28 • Deposit</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-sm text-emerald-600 dark:text-emerald-400">+$8,420.00</p>
                <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                  Completed
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-border/60 pt-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
                  <ArrowUpRight className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-foreground">AWS Cloud Hosting</h4>
                  <p className="text-xs text-muted-foreground">Yesterday, 19:00 • Infrastructure</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-sm text-foreground">-$1,240.50</p>
                <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold text-muted-foreground">
                  Processed
                </span>
              </div>
            </div>
          </div>
        );

      case "activity-timeline":
        return (
          <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-5 space-y-4">
            <h4 className="font-bold text-sm text-foreground">Audit Activity Log</h4>
            <div className="space-y-4 relative pl-5 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
              {[
                { title: "Production deployment v2.4", time: "10m ago", dot: "bg-sky-500", desc: "Deployed 18 microservices" },
                { title: "API Gateway rate-limit modified", time: "2h ago", dot: "bg-amber-500", desc: "Increased tier to 50k req/min" },
                { title: "Organization member invited", time: "5h ago", dot: "bg-emerald-500", desc: "Added alex@company.corp" },
              ].map((ev, i) => (
                <div key={i} className="relative">
                  <div className={`absolute -left-5 top-1 h-2.5 w-2.5 rounded-full ${ev.dot} ring-4 ring-card`} />
                  <p className="font-semibold text-xs text-foreground">{ev.title}</p>
                  <p className="text-[11px] text-muted-foreground">{ev.desc}</p>
                  <span className="text-[10px] text-muted-foreground/75 mt-0.5 block">{ev.time}</span>
                </div>
              ))}
            </div>
          </div>
        );

      case "kpi-comparison-card":
        return (
          <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Quarterly Revenue Target</span>
              <span className="rounded-full bg-sky-500/10 px-2 py-0.5 text-[11px] font-bold text-sky-600 dark:text-sky-400">
                82% Achieved
              </span>
            </div>
            <div className="flex items-baseline justify-between pt-1">
              <div>
                <span className="text-[11px] text-muted-foreground">Current Gross</span>
                <p className="text-2xl font-black text-foreground">$412,850</p>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-muted-foreground">Target Goal</span>
                <p className="text-lg font-bold text-muted-foreground">$500,000</p>
              </div>
            </div>
            <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
              <div className="h-full w-[82%] rounded-full bg-sky-500" />
            </div>
          </div>
        );

      case "filter-sheet":
        return (
          <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h4 className="font-bold text-sm text-foreground">Filter Catalog</h4>
              <button className="text-xs font-semibold text-muted-foreground hover:text-foreground">Reset All</button>
            </div>
            <div className="space-y-2">
              <span className="text-xs font-medium text-muted-foreground">Categories</span>
              <div className="flex flex-wrap gap-1.5">
                {["All", "SaaS", "Mobile", "Enterprise", "Hardware"].map((c) => (
                  <button
                    key={c}
                    onClick={() => setFilterCategory(c)}
                    className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                      filterCategory === c
                        ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-950"
                        : "border border-border bg-muted/40 text-muted-foreground"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2 pt-1">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Budget Cap</span>
                <span className="font-bold text-foreground">$2,500</span>
              </div>
              <input type="range" className="w-full accent-sky-500 cursor-pointer" defaultValue={60} />
            </div>
            <button className="w-full rounded-xl bg-sky-600 py-2.5 text-xs font-bold text-white shadow hover:bg-sky-500">
              Apply Filters (18 Results)
            </button>
          </div>
        );

      case "analytics-dashboard":
        return (
          <DeviceFrame title="Executive Analytics">
            <div className="p-4 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-black text-white">Analytics</h3>
                  <p className="text-[11px] text-zinc-400">Executive Performance</p>
                </div>
                <span className="rounded-full bg-zinc-800 px-2 py-0.5 text-[10px] font-bold text-zinc-300">
                  Live
                </span>
              </div>

              {/* 2x2 Metric Grid */}
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { title: "MRR", val: "$48.2k", delta: "+14.2%", isPos: true },
                  { title: "Active Users", val: "18,420", delta: "+8.9%", isPos: true },
                  { title: "Conversion", val: "3.42%", delta: "-0.4%", isPos: false },
                  { title: "Avg LTV", val: "$1,290", delta: "+22.5%", isPos: true },
                ].map((m) => (
                  <div key={m.title} className="rounded-xl border border-zinc-800 bg-zinc-900/90 p-3">
                    <p className="text-[10px] font-semibold text-zinc-400 uppercase">{m.title}</p>
                    <p className="text-base font-black text-white mt-1">{m.val}</p>
                    <span className={`text-[10px] font-bold ${m.isPos ? "text-emerald-400" : "text-rose-400"}`}>
                      {m.delta}
                    </span>
                  </div>
                ))}
              </div>

              {/* Channel Distribution */}
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/90 p-4 space-y-3">
                <p className="text-xs font-bold text-white">Traffic Acquisition</p>
                {[
                  { name: "Direct Traffic", pct: 45, color: "bg-sky-500" },
                  { name: "Organic Search", pct: 32, color: "bg-emerald-500" },
                  { name: "Referrals", pct: 23, color: "bg-purple-500" },
                ].map((ch) => (
                  <div key={ch.name} className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-zinc-300">{ch.name}</span>
                      <span className="font-bold text-white">{ch.pct}%</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-zinc-800 overflow-hidden">
                      <div className={`h-full ${ch.color}`} style={{ width: `${ch.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </DeviceFrame>
        );

      case "ecommerce-flow":
        return (
          <DeviceFrame title="Storefront">
            <div className="p-4 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-black text-white">Storefront</h3>
                  <p className="text-[11px] text-zinc-400">Curated Collection</p>
                </div>
                <div className="relative flex items-center justify-center h-9 w-9 rounded-full bg-zinc-900 border border-zinc-800">
                  <ShoppingCart className="h-4 w-4 text-white" />
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-sky-500 text-[9px] font-bold text-white">
                    {cartCount}
                  </span>
                </div>
              </div>

              {/* Hero Banner */}
              <div className="rounded-2xl border border-zinc-800 bg-gradient-to-tr from-sky-600/30 to-indigo-900/40 p-4 space-y-2">
                <span className="rounded-full bg-sky-500/20 px-2 py-0.5 text-[10px] font-bold text-sky-400">
                  NEW SEASON
                </span>
                <p className="text-base font-bold text-white">Minimalist Mobile Essentials</p>
                <p className="text-[11px] text-zinc-300">Save 20% with code NATIVRA20</p>
              </div>

              {/* Product Cards */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { name: "Pro Headset", price: "$249.00", rating: 4.9 },
                  { name: "MagSafe Stand", price: "$79.00", rating: 4.8 },
                ].map((p) => (
                  <div key={p.name} className="rounded-xl border border-zinc-800 bg-zinc-900/90 p-3 space-y-2">
                    <div className="h-20 w-full rounded-lg bg-zinc-800/80 flex items-center justify-center text-zinc-500 text-xs">
                      Product Image
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">{p.name}</p>
                      <div className="flex items-center gap-1 text-amber-400 text-[10px]">
                        <Star className="h-3 w-3 fill-current" />
                        <span>{p.rating}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-xs font-bold text-white">{p.price}</span>
                      <button
                        onClick={() => setCartCount((c) => c + 1)}
                        className="rounded-lg bg-sky-600 px-2 py-1 text-[10px] font-bold text-white"
                      >
                        + Add
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </DeviceFrame>
        );

      case "fintech-wallet":
        return (
          <DeviceFrame title="Fintech Vault">
            <div className="p-4 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-black text-white">Wallet</h3>
                  <p className="text-[11px] text-zinc-400">Multi-Chain Vault</p>
                </div>
                <button
                  onClick={() => setWalletHideBalance((h) => !h)}
                  className="rounded-xl border border-zinc-800 bg-zinc-900 px-2.5 py-1 text-xs text-zinc-300"
                >
                  {walletHideBalance ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                </button>
              </div>

              {/* Net Worth Card */}
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/90 p-5 space-y-1">
                <span className="text-[10px] font-semibold text-zinc-400 uppercase">Total Valuation</span>
                <p className="text-3xl font-black text-white">
                  {walletHideBalance ? "••••••••" : "$160,523.00"}
                </p>
                <span className="text-xs font-bold text-emerald-400">+$12,410.80 (24h)</span>

                <div className="flex gap-2 pt-4">
                  {["Send", "Receive", "Swap"].map((act) => (
                    <button key={act} className="flex-1 rounded-xl bg-zinc-800 py-2 text-xs font-bold text-white hover:bg-zinc-700">
                      {act}
                    </button>
                  ))}
                </div>
              </div>

              {/* Assets */}
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/90 p-4 space-y-3">
                <p className="text-xs font-bold text-white">Allocated Assets</p>
                {[
                  { name: "Bitcoin", symbol: "BTC", val: "$94,248.00", change: "+4.2%" },
                  { name: "Ethereum", symbol: "ETH", val: "$38,400.00", change: "+6.8%" },
                  { name: "USD Coin", symbol: "USDC", val: "$15,200.00", change: "0.0%" },
                ].map((a) => (
                  <div key={a.symbol} className="flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-white">{a.name}</p>
                      <span className="text-[10px] text-zinc-400">{a.symbol}</span>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-white">{a.val}</p>
                      <span className="text-[10px] font-bold text-emerald-400">{a.change}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </DeviceFrame>
        );

      case "account-settings-flow":
        return (
          <DeviceFrame title="Account Hub">
            <div className="p-4 space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-600 font-bold text-white text-sm">
                  JD
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-white">Jane Doe</h3>
                    <span className="rounded-full bg-zinc-800 px-2 py-0.2 text-[9px] font-bold text-zinc-300">
                      Enterprise
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400">jane.doe@enterprise.corp</p>
                </div>
              </div>

              {/* Section Tabs */}
              <div className="flex rounded-xl border border-zinc-800 bg-zinc-900 p-1 text-xs">
                {(["profile", "team", "security", "billing"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setAccountTab(t)}
                    className={`flex-1 py-1.5 rounded-lg font-semibold capitalize transition-all ${
                      accountTab === t ? "bg-zinc-800 text-white" : "text-zinc-400"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              {/* Tab Contents */}
              {accountTab === "profile" && (
                <div className="rounded-xl border border-zinc-800 bg-zinc-900/90 p-4 space-y-3 text-xs">
                  <p className="font-bold text-white">Organization Details</p>
                  <div className="rounded-lg bg-zinc-950 p-2.5 border border-zinc-800 text-zinc-300">
                    Acme Global Technologies Ltd.
                  </div>
                  <div className="rounded-lg bg-zinc-950 p-2.5 border border-zinc-800 text-zinc-300">
                    UTC-05:00 (Eastern Time)
                  </div>
                </div>
              )}

              {accountTab === "team" && (
                <div className="rounded-xl border border-zinc-800 bg-zinc-900/90 p-4 space-y-3 text-xs">
                  <div className="flex justify-between font-bold text-white">
                    <span>Seats Quota</span>
                    <span className="text-sky-400">8 / 10 Used</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-zinc-800 overflow-hidden">
                    <div className="h-full w-4/5 rounded-full bg-sky-500" />
                  </div>
                  <div className="space-y-2 pt-2">
                    {["Jane Doe (Owner)", "Alex River (Admin)", "Carlos Gomez (Billing)"].map((m) => (
                      <div key={m} className="rounded-lg bg-zinc-950 p-2 border border-zinc-800 text-zinc-300 text-[11px]">
                        {m}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {accountTab === "security" && (
                <div className="rounded-xl border border-zinc-800 bg-zinc-900/90 p-4 space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-white">Two-Factor Auth</p>
                      <p className="text-[10px] text-zinc-400">TOTP Authenticator</p>
                    </div>
                    <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                      Enabled
                    </span>
                  </div>
                  <div className="border-t border-zinc-800 pt-2 space-y-2">
                    <p className="text-[10px] text-zinc-400 font-semibold uppercase">Active Devices</p>
                    <div className="rounded-lg bg-zinc-950 p-2 border border-zinc-800 text-[11px]">
                      <p className="font-bold text-white">iPhone 16 Pro • Current</p>
                      <p className="text-[10px] text-zinc-400">New York, USA</p>
                    </div>
                  </div>
                </div>
              )}

              {accountTab === "billing" && (
                <div className="rounded-xl border border-zinc-800 bg-zinc-900/90 p-4 space-y-3 text-xs">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-bold text-white">Enterprise Tier</p>
                      <p className="text-[10px] text-zinc-400">$499 / month</p>
                    </div>
                    <span className="rounded-full bg-sky-500/20 px-2 py-0.5 text-[10px] font-bold text-sky-400">
                      Active
                    </span>
                  </div>
                  <div className="rounded-lg bg-zinc-950 p-2 border border-zinc-800 flex justify-between items-center">
                    <span className="font-bold text-white">VISA •••• 4242</span>
                    <span className="text-[10px] text-zinc-400">Exp 09/28</span>
                  </div>
                </div>
              )}
            </div>
          </DeviceFrame>
        );
      case "rating-stars":
        return (
          <div className="flex flex-col items-center justify-center gap-3">
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  onClick={() => setRatingStarsVal(s)}
                  className="p-1 transition-transform active:scale-125"
                  aria-label={`Rate ${s} stars`}
                >
                  <Star
                    className={`h-7 w-7 transition-colors ${
                      ratingStarsVal >= s
                        ? "fill-amber-400 text-amber-400"
                        : "fill-transparent text-muted-foreground/40"
                    }`}
                  />
                </button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground font-medium">
              Rated: <span className="text-foreground font-bold">{ratingStarsVal} of 5 stars</span>
            </p>
          </div>
        );

      case "payment-method-card":
        return (
          <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-4 space-y-3 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-13 items-center justify-center rounded-lg bg-zinc-950 font-black text-white text-[11px] uppercase tracking-wider px-2">
                  VISA
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-foreground">•••• 4242</span>
                    <span className="rounded-full bg-muted px-2 py-0.2 text-[10px] font-semibold text-muted-foreground">
                      Default
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">Expires 09/28</p>
                </div>
              </div>
              <CheckCircle2 className="h-5 w-5 text-sky-500" />
            </div>
            <div className="border-t border-border pt-2 text-[11px] font-semibold text-muted-foreground">
              JANE DOE
            </div>
          </div>
        );

      case "team-member-row":
        return (
          <div className="w-full max-w-sm rounded-xl border border-border bg-card p-3.5 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-200 dark:bg-zinc-800 font-bold text-xs text-foreground">
                AM
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Alex Morgan</p>
                <p className="text-xs text-muted-foreground">alex.morgan@acme.corp</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 rounded-full bg-sky-500/10 px-2.5 py-1 text-xs font-semibold text-sky-600 dark:text-sky-400">
              <Shield className="h-3 w-3" />
              <span>Admin</span>
            </div>
          </div>
        );

      case "mini-sparkline-card":
        return (
          <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Daily Revenue
              </span>
              <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                <TrendingUp className="h-3 w-3" />
                <span>+18.4%</span>
              </span>
            </div>
            <div className="mt-3 flex items-end justify-between">
              <span className="text-2xl font-black text-foreground">$14,250</span>
              <div className="flex items-end gap-1.5 h-9">
                {[12, 16, 14, 22, 19, 28, 25, 34, 30, 42].map((val, i) => (
                  <div
                    key={i}
                    style={{ height: `${(val / 42) * 100}%` }}
                    className={`w-1 rounded-full ${
                      i === 9 ? "bg-emerald-500" : "bg-emerald-500/35"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        );

      case "chat-flow":
        return (
          <DeviceFrame title="Support & Messaging">
            <div className="flex flex-col h-[620px] bg-zinc-950 text-white">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900 px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="h-9 w-9 rounded-full bg-sky-600 flex items-center justify-center font-bold text-xs text-white">
                      SD
                    </div>
                    <div className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-zinc-900" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">Enterprise Support</p>
                    <p className="text-[10px] text-emerald-400">Online • Replies in 5m</p>
                  </div>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 p-4 space-y-3 overflow-y-auto">
                <div className="flex justify-start">
                  <div className="max-w-[80%] rounded-2xl rounded-bl-xs bg-zinc-900 border border-zinc-800 p-3 text-xs leading-relaxed text-zinc-200">
                    Hi Jane! Welcome to Nativra Enterprise Support. How can we help today?
                    <span className="text-[9px] text-zinc-500 block text-right mt-1">10:14 AM</span>
                  </div>
                </div>

                <div className="flex justify-end">
                  <div className="max-w-[80%] rounded-2xl rounded-br-xs bg-sky-600 p-3 text-xs leading-relaxed text-white">
                    Hello! We are configuring custom webhooks and want to confirm retry limits.
                    <span className="text-[9px] text-sky-200 block text-right mt-1">10:15 AM</span>
                  </div>
                </div>

                <div className="flex justify-start">
                  <div className="max-w-[80%] rounded-2xl rounded-bl-xs bg-zinc-900 border border-zinc-800 p-3 text-xs leading-relaxed text-zinc-200">
                    Webhooks retry up to 5 times with exponential backoff before routing to the DLQ.
                    <span className="text-[9px] text-zinc-500 block text-right mt-1">10:17 AM</span>
                  </div>
                </div>
              </div>

              {/* Input Bar */}
              <div className="border-t border-zinc-800 bg-zinc-900 p-3 flex items-center gap-2">
                <button className="p-2 rounded-xl bg-zinc-800 text-zinc-400 hover:text-white">
                  <Paperclip className="h-4 w-4" />
                </button>
                <input
                  type="text"
                  value={chatDemoText}
                  onChange={(e) => setChatDemoText(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 rounded-xl bg-zinc-950 border border-zinc-800 px-3 py-2 text-xs text-white placeholder-zinc-500 outline-none"
                />
                <button className="p-2 rounded-xl bg-sky-600 text-white">
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </DeviceFrame>
        );

      case "app-header":
        return (
          <div className="w-full max-w-lg rounded-2xl border border-zinc-800 bg-zinc-950 overflow-hidden shadow-xl">
            <div className="p-4 border-b border-zinc-800/80">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300">
                    <ChevronLeft className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white tracking-tight">Analytics Overview</h3>
                    <p className="text-[11px] text-zinc-400">Enterprise Dashboard</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="relative h-9 w-9 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400">
                    <Bell className="h-4 w-4" />
                    <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-rose-500 text-[9px] font-bold text-white flex items-center justify-center border-2 border-zinc-950">
                      3
                    </span>
                  </div>
                  <div className="h-9 w-9 rounded-full bg-sky-500/20 border border-sky-500/40 flex items-center justify-center text-xs font-bold text-sky-400 font-mono">
                    JD
                  </div>
                </div>
              </div>

              {/* Integrated Search Input */}
              <div className="mt-3 flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/90 px-3 py-2 text-xs">
                <Search className="h-3.5 w-3.5 text-zinc-500" />
                <span className="text-zinc-500">Search transactions, metrics, logs...</span>
              </div>
            </div>
            <div className="p-4 bg-zinc-950/60 text-center text-xs text-zinc-500">
              Content body viewport rendered below header
            </div>
          </div>
        );

      case "app-sidebar":
        return (
          <div className="w-full max-w-sm rounded-2xl border border-zinc-800 bg-zinc-950 overflow-hidden shadow-xl flex flex-col">
            <div className="p-4 border-b border-zinc-800/80 flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-sky-500/20 border border-sky-500/40 flex items-center justify-center text-sky-400 font-bold font-mono">
                N
              </div>
              <div>
                <h3 className="text-sm font-bold text-white tracking-tight">Nativra Workspace</h3>
                <p className="text-[10px] text-zinc-400 font-mono">v4.0.0 Enterprise</p>
              </div>
            </div>

            <div className="p-3 space-y-3">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider px-2 block">
                MAIN MENU
              </span>
              <div className="space-y-1">
                <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-sky-500/15 border border-sky-500/30 text-white font-medium text-xs">
                  <div className="flex items-center gap-2.5">
                    <LayoutDashboard className="h-4 w-4 text-sky-400" />
                    <span>Dashboard</span>
                  </div>
                  <span className="text-[10px] font-bold text-sky-400 bg-sky-500/20 px-1.5 py-0.5 rounded">
                    Active
                  </span>
                </div>
                <div className="flex items-center justify-between px-3 py-2 rounded-xl text-zinc-400 hover:bg-zinc-900 text-xs">
                  <div className="flex items-center gap-2.5">
                    <BarChart3 className="h-4 w-4 text-zinc-400" />
                    <span>Analytics</span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/20 px-1.5 py-0.5 rounded">
                    Live
                  </span>
                </div>
                <div className="flex items-center justify-between px-3 py-2 rounded-xl text-zinc-400 hover:bg-zinc-900 text-xs">
                  <div className="flex items-center gap-2.5">
                    <Users className="h-4 w-4 text-zinc-400" />
                    <span>Team Members</span>
                  </div>
                  <span className="text-[10px] text-zinc-400 bg-zinc-800 px-1.5 py-0.5 rounded">
                    8
                  </span>
                </div>
                <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-zinc-400 hover:bg-zinc-900 text-xs">
                  <CreditCard className="h-4 w-4 text-zinc-400" />
                  <span>Billing & Plans</span>
                </div>
              </div>
            </div>

            <div className="p-3 border-t border-zinc-800/80 bg-zinc-900/40">
              <div className="flex items-center justify-between p-2 rounded-xl bg-zinc-900/80 border border-zinc-800">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-xs font-bold text-emerald-400 font-mono">
                    AM
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Alex Mercer</h4>
                    <p className="text-[10px] text-zinc-400">Enterprise Admin</p>
                  </div>
                </div>
                <div className="h-7 w-7 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-400">
                  <LogOut className="h-3.5 w-3.5" />
                </div>
              </div>
            </div>
          </div>
        );

      case "notification-item":
        return (
          <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-950 p-4 shadow-lg space-y-3">
            <div className="flex items-start gap-3.5">
              <div className="relative">
                <div className="h-10 w-10 rounded-full bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-xs font-bold text-indigo-400">
                  MV
                </div>
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-sky-500 border-2 border-zinc-950" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white truncate">Marcus Vance</h4>
                  <span className="text-[10px] text-zinc-500">12m ago</span>
                </div>
                <p className="text-xs text-zinc-300 mt-0.5 leading-relaxed">
                  requested feedback on <span className="font-semibold text-sky-400">Design System Spec</span>
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-md bg-zinc-900 border border-zinc-800 px-2 py-0.5 text-[10px] text-zinc-400 font-mono">
                    v4.0.0
                  </span>
                  <span className="text-[10px] text-emerald-400 font-medium">Ready for review</span>
                </div>
              </div>
            </div>
          </div>
        );

      case "order-summary":
        return (
          <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-950 p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div>
                <h4 className="text-xs font-bold text-white">Order Summary</h4>
                <p className="text-[10px] text-zinc-500 font-mono">#NV-88219</p>
              </div>
              <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
                Verified
              </span>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-zinc-400">
                <span>Subtotal (3 items)</span>
                <span className="text-zinc-200 font-mono">$108.00</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Discount (Coupon NV20)</span>
                <span className="text-emerald-400 font-mono">-$20.00</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Estimated Tax (8%)</span>
                <span className="text-zinc-200 font-mono">$8.80</span>
              </div>
              <div className="border-t border-zinc-800 pt-2 flex justify-between font-bold text-white">
                <span>Total Amount</span>
                <span className="text-sm font-mono text-sky-400">$96.80</span>
              </div>
            </div>
            <button className="w-full rounded-xl bg-sky-600 hover:bg-sky-500 py-2.5 text-xs font-bold text-white transition-colors">
              Proceed to Payment
            </button>
          </div>
        );

      case "stat-progress-card":
        return (
          <div className="w-full max-w-sm rounded-2xl border border-zinc-800 bg-zinc-950 p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400">
                  <Flame className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Weekly Workout Goal</h4>
                  <p className="text-[10px] text-zinc-500">4 of 5 sessions completed</p>
                </div>
              </div>
              <span className="text-xs font-black font-mono text-rose-400">80%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-zinc-900 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-rose-500 to-amber-500 rounded-full w-[80%]" />
            </div>
            <div className="flex items-center justify-between text-[10px] text-zinc-500 border-t border-zinc-800/80 pt-2">
              <span>🔥 14-day streak</span>
              <span>1 session left</span>
            </div>
          </div>
        );

      case "auth-flow":
        return (
          <DeviceFrame title="Authentication">
            <div className="p-4 space-y-4">
              <div className="text-center pt-2">
                <div className="inline-flex h-12 w-12 rounded-2xl bg-sky-500/20 border border-sky-500/40 items-center justify-center text-sky-400 font-bold font-mono text-lg mb-2">
                  NV
                </div>
                <h3 className="text-base font-bold text-white">Welcome back</h3>
                <p className="text-[11px] text-zinc-400">Enter credentials to continue</p>
              </div>
              <div className="space-y-2.5">
                <div>
                  <label className="text-[10px] font-semibold text-zinc-400 uppercase">Email</label>
                  <input
                    type="email"
                    value="sophia@nativra.dev"
                    readOnly
                    className="w-full mt-1 rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-zinc-400 uppercase">Password</label>
                  <input
                    type="password"
                    value="••••••••••••"
                    readOnly
                    className="w-full mt-1 rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>
              <button className="w-full py-2.5 rounded-xl bg-sky-600 font-bold text-white text-xs">
                Sign In
              </button>
              <div className="text-center">
                <span className="text-[11px] text-zinc-500">Don&apos;t have an account? </span>
                <span className="text-[11px] text-sky-400 font-semibold">Sign Up</span>
              </div>
            </div>
          </DeviceFrame>
        );

      case "onboarding-flow":
        return (
          <DeviceFrame title="Onboarding">
            <div className="p-4 flex flex-col justify-between h-full space-y-6">
              <div className="text-center pt-8 space-y-3">
                <div className="inline-flex h-16 w-16 rounded-3xl bg-sky-500/10 border border-sky-500/20 items-center justify-center text-sky-400 mb-2">
                  <Sparkles className="h-8 w-8" />
                </div>
                <h3 className="text-base font-bold text-white">Pure Mobile Velocity</h3>
                <p className="text-xs text-zinc-400 px-2 leading-relaxed">
                  Source-first React Native components designed for smooth 120 FPS mobile experiences.
                </p>
              </div>
              <div className="space-y-4 pb-2">
                <div className="flex justify-center gap-1.5">
                  <span className="h-1.5 w-6 rounded-full bg-sky-500" />
                  <span className="h-1.5 w-1.5 rounded-full bg-zinc-800" />
                  <span className="h-1.5 w-1.5 rounded-full bg-zinc-800" />
                </div>
                <button className="w-full py-2.5 rounded-xl bg-sky-600 font-bold text-white text-xs">
                  Get Started →
                </button>
              </div>
            </div>
          </DeviceFrame>
        );

      case "settings-flow":
        return (
          <DeviceFrame title="Preferences">
            <div className="p-3 space-y-4">
              <div>
                <span className="text-[10px] font-bold text-zinc-500 uppercase px-2 mb-1.5 block">Account & Security</span>
                <div className="rounded-2xl border border-zinc-800 bg-zinc-950 divide-y divide-zinc-800/80">
                  <div className="flex items-center justify-between p-3">
                    <span className="text-xs text-white">Biometric Login</span>
                    <span className="h-5 w-9 rounded-full bg-emerald-500 p-0.5 flex items-center justify-end">
                      <span className="h-4 w-4 rounded-full bg-white" />
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3">
                    <span className="text-xs text-white">Two-Factor Authentication</span>
                    <span className="text-[10px] text-emerald-400 font-semibold">Enabled</span>
                  </div>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold text-zinc-500 uppercase px-2 mb-1.5 block">App Experience</span>
                <div className="rounded-2xl border border-zinc-800 bg-zinc-950 divide-y divide-zinc-800/80">
                  <div className="flex items-center justify-between p-3">
                    <span className="text-xs text-white">Push Notifications</span>
                    <span className="h-5 w-9 rounded-full bg-emerald-500 p-0.5 flex items-center justify-end">
                      <span className="h-4 w-4 rounded-full bg-white" />
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3">
                    <span className="text-xs text-white">Haptic Feedback</span>
                    <span className="h-5 w-9 rounded-full bg-emerald-500 p-0.5 flex items-center justify-end">
                      <span className="h-4 w-4 rounded-full bg-white" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </DeviceFrame>
        );

      case "cn":
        return (
          <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-950 p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <Code2 className="h-4 w-4 text-sky-400" />
                <h4 className="text-xs font-bold text-white">Class & Style Merger (cn)</h4>
              </div>
              <span className="rounded bg-sky-500/20 text-sky-400 text-[10px] px-2 py-0.5 font-mono">
                clsx + twMerge
              </span>
            </div>
            <div className="rounded-xl bg-zinc-900 p-3 font-mono text-[11px] text-zinc-300 space-y-1">
              <p className="text-zinc-500">// NativeWind (Tailwind conflict resolution)</p>
              <p className="text-emerald-400">cn(&quot;px-4 py-2 bg-red-500&quot;, &quot;bg-sky-600&quot;)</p>
              <p className="text-zinc-400">→ &quot;px-4 py-2 bg-sky-600&quot;</p>
              <p className="text-zinc-500 pt-2">// StyleSheet (Object flattening)</p>
              <p className="text-emerald-400">cn(styles.base, isActive &amp;&amp; styles.active)</p>
            </div>
          </div>
        );

      case "use-keyboard":
        return (
          <div className="w-full max-w-sm rounded-2xl border border-zinc-800 bg-zinc-950 p-5 shadow-xl space-y-3 text-center">
            <div className="inline-flex h-10 w-10 rounded-xl bg-zinc-900 border border-zinc-800 items-center justify-center text-sky-400">
              <Keyboard className="h-5 w-5" />
            </div>
            <h4 className="text-xs font-bold text-white">useKeyboard Hook</h4>
            <p className="text-[11px] text-zinc-400">Tracks software keyboard visibility & height</p>
            <div className="flex justify-center gap-4 text-xs font-mono pt-1">
              <span className="text-zinc-500">isVisible: <span className="text-emerald-400 font-bold">false</span></span>
              <span className="text-zinc-500">height: <span className="text-zinc-300 font-bold">0px</span></span>
            </div>
          </div>
        );

      case "use-haptics":
        return (
          <div className="w-full max-w-sm rounded-2xl border border-zinc-800 bg-zinc-950 p-5 shadow-xl space-y-3 text-center">
            <div className="inline-flex h-10 w-10 rounded-xl bg-zinc-900 border border-zinc-800 items-center justify-center text-rose-400">
              <Vibrate className="h-5 w-5" />
            </div>
            <h4 className="text-xs font-bold text-white">useHaptics Hook</h4>
            <p className="text-[11px] text-zinc-400">Triggers iOS / Android Taptic feedback</p>
            <div className="flex justify-center gap-2 pt-1">
              <button className="px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 hover:text-white">Light</button>
              <button className="px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 hover:text-white">Medium</button>
              <button className="px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-emerald-400 hover:bg-emerald-950/40">Success</button>
            </div>
          </div>
        );

      case "use-color-scheme":
        return (
          <div className="w-full max-w-sm rounded-2xl border border-zinc-800 bg-zinc-950 p-5 shadow-xl space-y-3 text-center">
            <div className="inline-flex h-10 w-10 rounded-xl bg-zinc-900 border border-zinc-800 items-center justify-center text-amber-400">
              <Sun className="h-5 w-5" />
            </div>
            <h4 className="text-xs font-bold text-white">useColorScheme Hook</h4>
            <p className="text-[11px] text-zinc-400">System dark/light mode detection & overrides</p>
            <div className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-1.5 text-xs text-zinc-300">
              <Moon className="h-3.5 w-3.5 text-sky-400" />
              <span>Current Scheme: <strong className="text-white">dark</strong></span>
            </div>
          </div>
        );

      case "amber":
      case "dark-slate":
      case "emerald":
      case "midnight":
      case "rose":
      case "slate":
      case "violet":
      case "zinc":
        return (
          <div className="w-full max-w-sm rounded-3xl border border-zinc-800 bg-zinc-900 p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div>
                <h4 className="text-sm font-bold text-white capitalize">{item.name}</h4>
                <p className="text-[11px] text-zinc-400">{item.description || "Nativra Semantic Color Palette"}</p>
              </div>
              <Palette className="h-4 w-4 text-sky-400" />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[
                { name: "Primary", bg: "bg-sky-500", text: "text-white" },
                { name: "Accent", bg: "bg-indigo-500", text: "text-white" },
                { name: "Surface", bg: "bg-zinc-800", text: "text-zinc-200" },
                { name: "Muted", bg: "bg-zinc-700", text: "text-zinc-300" },
              ].map((swatch) => (
                <div key={swatch.name} className="flex flex-col items-center gap-1.5">
                  <div className={`h-10 w-full rounded-xl ${swatch.bg} shadow flex items-center justify-center font-mono text-[9px] font-bold ${swatch.text}`}>
                    {swatch.name[0]}
                  </div>
                  <span className="text-[10px] text-zinc-400">{swatch.name}</span>
                </div>
              ))}
            </div>
            <div className="rounded-xl bg-zinc-950 p-3 font-mono text-[10px] text-zinc-400 border border-zinc-800/80">
              $ npx nativra add {item.id}
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center text-sm text-muted-foreground">
            {item.name} component preview
          </div>
        );
    }
  };

  // -------------------------------------------------------------------------
  // Render Controls Panel
  // -------------------------------------------------------------------------
  const renderControls = () => {
    switch (item.id) {
      case "button":
        return (
          <div className="space-y-4 text-xs">
            <div>
              <span className="font-semibold text-muted-foreground block mb-1.5">Variant</span>
              <div className="flex flex-wrap gap-1.5">
                {(["default", "primary", "secondary", "destructive", "outline", "ghost", "link"] as ButtonVariant[]).map((v) => (
                  <button
                    key={v}
                    onClick={() => setBtnVariant(v)}
                    className={`rounded-md px-2.5 py-1 capitalize transition-colors ${
                      btnVariant === v
                        ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-semibold"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span className="font-semibold text-muted-foreground block mb-1.5">Size</span>
              <div className="flex flex-wrap gap-1.5">
                {(["xs", "sm", "md", "lg", "xl"] as ButtonSize[]).map((s) => (
                  <button
                    key={s}
                    onClick={() => setBtnSize(s)}
                    className={`rounded-md px-2.5 py-1 uppercase transition-colors ${
                      btnSize === s
                        ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-semibold"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4 pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={btnLoading}
                  onChange={(e) => setBtnLoading(e.target.checked)}
                  className="rounded"
                />
                <span className="font-medium">Loading State</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={btnDisabled}
                  onChange={(e) => setBtnDisabled(e.target.checked)}
                  className="rounded"
                />
                <span className="font-medium">Disabled State</span>
              </label>
            </div>
          </div>
        );

      case "badge":
        return (
          <div className="space-y-4 text-xs">
            <div>
              <span className="font-semibold text-muted-foreground block mb-1.5">Variant</span>
              <div className="flex flex-wrap gap-1.5">
                {(["default", "primary", "secondary", "destructive", "outline"] as BadgeVariant[]).map((v) => (
                  <button
                    key={v}
                    onClick={() => setBadgeVariant(v)}
                    className={`rounded-md px-2.5 py-1 capitalize transition-colors ${
                      badgeVariant === v
                        ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-semibold"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span className="font-semibold text-muted-foreground block mb-1.5">Size</span>
              <div className="flex flex-wrap gap-1.5">
                {(["sm", "md", "lg"] as BadgeSize[]).map((s) => (
                  <button
                    key={s}
                    onClick={() => setBadgeSize(s)}
                    className={`rounded-md px-2.5 py-1 uppercase transition-colors ${
                      badgeSize === s
                        ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-semibold"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case "avatar":
        return (
          <div className="space-y-3 text-xs">
            <span className="font-semibold text-muted-foreground block">Size Preset</span>
            <div className="flex flex-wrap gap-1.5">
              {(["sm", "md", "lg", "xl"] as AvatarSize[]).map((s) => (
                <button
                  key={s}
                  onClick={() => setAvatarSize(s)}
                  className={`rounded-md px-2.5 py-1 uppercase transition-colors ${
                    avatarSize === s
                      ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-semibold"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        );

      case "input":
        return (
          <div className="flex items-center gap-4 text-xs">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={inputError}
                onChange={(e) => setInputError(e.target.checked)}
                className="rounded"
              />
              <span className="font-medium">Error State</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={inputDisabled}
                onChange={(e) => setInputDisabled(e.target.checked)}
                className="rounded"
              />
              <span className="font-medium">Disabled State</span>
            </label>
          </div>
        );

      case "checkbox":
        return (
          <div className="flex items-center gap-4 text-xs">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={checkboxDisabled}
                onChange={(e) => setCheckboxDisabled(e.target.checked)}
                className="rounded"
              />
              <span className="font-medium">Disabled</span>
            </label>
          </div>
        );

      case "switch":
        return (
          <div className="flex items-center gap-4 text-xs">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={switchDisabled}
                onChange={(e) => setSwitchDisabled(e.target.checked)}
                className="rounded"
              />
              <span className="font-medium">Disabled</span>
            </label>
          </div>
        );

      case "label":
        return (
          <div className="flex items-center gap-4 text-xs">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={labelRequired}
                onChange={(e) => setLabelRequired(e.target.checked)}
                className="rounded"
              />
              <span className="font-medium">Required Asterisk</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={labelDisabled}
                onChange={(e) => setLabelDisabled(e.target.checked)}
                className="rounded"
              />
              <span className="font-medium">Disabled</span>
            </label>
          </div>
        );

      case "card":
        return (
          <div className="space-y-3 text-xs">
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={cardElevated}
                  onChange={(e) => setCardElevated(e.target.checked)}
                  className="rounded"
                />
                <span className="font-medium">Elevated Shadow</span>
              </label>
            </div>
            <div>
              <span className="font-semibold text-muted-foreground block mb-1">Padding</span>
              <div className="flex gap-1.5">
                {(["sm", "md", "lg"] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => setCardPadding(p)}
                    className={`rounded-md px-2.5 py-1 uppercase ${
                      cardPadding === p
                        ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-semibold"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case "skeleton":
        return (
          <div className="space-y-2 text-xs">
            <span className="font-semibold text-muted-foreground block">Shape Preset</span>
            <div className="flex gap-1.5">
              {(["card", "avatar", "lines"] as const).map((shape) => (
                <button
                  key={shape}
                  onClick={() => setSkeletonShape(shape)}
                  className={`rounded-md px-2.5 py-1 capitalize ${
                    skeletonShape === shape
                      ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-semibold"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {shape}
                </button>
              ))}
            </div>
          </div>
        );

      case "spinner":
        return (
          <div className="space-y-3 text-xs">
            <div>
              <span className="font-semibold text-muted-foreground block mb-1">Size</span>
              <div className="flex gap-1.5">
                {(["sm", "md", "lg"] as SpinnerSize[]).map((s) => (
                  <button
                    key={s}
                    onClick={() => setSpinnerSize(s)}
                    className={`rounded-md px-2.5 py-1 uppercase ${
                      spinnerSize === s
                        ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-semibold"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <span className="font-semibold text-muted-foreground block mb-1">Color Variant</span>
              <div className="flex gap-1.5">
                {(["default", "primary"] as const).map((c) => (
                  <button
                    key={c}
                    onClick={() => setSpinnerVariant(c)}
                    className={`rounded-md px-2.5 py-1 capitalize ${
                      spinnerVariant === c
                        ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-semibold"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case "text":
        return (
          <div className="space-y-2 text-xs">
            <span className="font-semibold text-muted-foreground block">Typography Variant</span>
            <div className="flex flex-wrap gap-1.5">
              {(["h1", "h2", "h3", "h4", "body", "muted"] as TextVariant[]).map((v) => (
                <button
                  key={v}
                  onClick={() => setTextVariant(v)}
                  className={`rounded-md px-2.5 py-1 uppercase ${
                    textVariant === v
                      ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-semibold"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
        );

      case "separator":
        return (
          <div className="space-y-2 text-xs">
            <span className="font-semibold text-muted-foreground block">Orientation</span>
            <div className="flex gap-1.5">
              {(["horizontal", "vertical"] as const).map((o) => (
                <button
                  key={o}
                  onClick={() => setSepOrientation(o)}
                  className={`rounded-md px-2.5 py-1 capitalize ${
                    sepOrientation === o
                      ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-semibold"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {o}
                </button>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const hasControls = [
    "button",
    "badge",
    "avatar",
    "input",
    "checkbox",
    "switch",
    "card",
    "skeleton",
    "spinner",
    "text",
    "separator",
  ].includes(item.id);

  return (
    <div className="space-y-4">
      {/* Visual Canvas Box */}
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        {/* Canvas Toolbar */}
        <div className="flex items-center justify-between border-b border-border bg-muted/30 px-4 py-2.5 text-xs text-muted-foreground">
          <span className="font-medium">Interactive Preview</span>
          <span className="font-mono text-[11px] text-muted-foreground">
            {item.name} • v{item.version}
          </span>
        </div>

        {/* Live Playground Canvas */}
        <div className="flex min-h-[260px] items-center justify-center p-8 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:16px_16px]">
          {renderInteractiveCanvas()}
        </div>

        {/* Property Customizer Controls */}
        {hasControls && (
          <div className="border-t border-border bg-background p-4">
            <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Controls
            </div>
            {renderControls()}
          </div>
        )}
      </div>

      {/* Quick Install Bar & Import Snippet Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-muted/40 p-2.5">
        <div className="flex flex-wrap items-center gap-2.5 min-w-0">
          <div className="flex rounded-lg bg-background p-0.5 border border-border text-[11px] font-medium shrink-0">
            <button
              type="button"
              onClick={() => setCopyMode("cli")}
              className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 transition-colors ${
                copyMode === "cli"
                  ? "bg-muted font-semibold text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Terminal className="h-3 w-3" />
              <span>CLI</span>
            </button>
            <button
              type="button"
              onClick={() => setCopyMode("import")}
              className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 transition-colors ${
                copyMode === "import"
                  ? "bg-muted font-semibold text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Code2 className="h-3 w-3 text-sky-500" />
              <span>Import</span>
            </button>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs overflow-x-auto">
            {copyMode === "cli" ? (
              <>
                <span className="text-muted-foreground">$</span>
                <span className="text-foreground">npx nativra add {item.id}</span>
              </>
            ) : (
              <span className="text-foreground font-medium">{importSnippet}</span>
            )}
          </div>
        </div>

        <button
          onClick={copyCommand}
          className="flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted shrink-0 ml-auto"
          aria-label={copyMode === "cli" ? "Copy install command" : "Copy import statement"}
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-500" />
              <span className="text-emerald-500 font-medium">Copied</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5 text-muted-foreground" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
