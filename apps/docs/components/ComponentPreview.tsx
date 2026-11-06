"use client";

import React, { useState } from "react";
import type { RegistryItem } from "@nativra/registry-schema";
import { Check, Copy, RefreshCw, Terminal, Sparkles, Mail, Lock } from "lucide-react";

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
