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
} from "lucide-react";

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

  const copyCommand = () => {
    navigator.clipboard.writeText(`npx nativra add ${item.id}`);
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

      {/* Quick Install Bar */}
      <div className="flex items-center justify-between rounded-xl border border-border bg-muted/40 px-4 py-2.5">
        <div className="flex items-center gap-2 font-mono text-xs">
          <Terminal className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-muted-foreground">$</span>
          <span className="text-foreground">npx nativra add {item.id}</span>
        </div>
        <button
          onClick={copyCommand}
          className="flex items-center gap-1.5 rounded-lg border border-border bg-background px-2.5 py-1 text-xs font-medium text-foreground transition-colors hover:bg-muted"
          aria-label="Copy install command"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-500" />
              <span className="text-emerald-500">Copied</span>
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
