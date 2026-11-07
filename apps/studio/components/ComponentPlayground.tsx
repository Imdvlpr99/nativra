'use client';

import React, { useState, useMemo, useCallback, useRef } from 'react';
import {
  Play,
  Copy,
  Check,
  Sparkles,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Lock,
  Sun,
  Moon,
  Crosshair,
  Activity,
  Terminal,
  Shield,
  Volume2,
  Grid,
  MinusSquare,
  ChevronDown,
  Info,
  Zap,
  X,
} from 'lucide-react';

export type ComponentState =
  | 'default'
  | 'pressed'
  | 'disabled'
  | 'loading'
  | 'focused'
  | 'selected'
  | 'error'
  | 'empty';

export type PlaygroundComponent =
  | 'button'
  | 'input'
  | 'badge'
  | 'card'
  | 'switch'
  | 'avatar'
  | 'checkbox'
  | 'slider'
  | 'progress'
  | 'tabs'
  | 'alert'
  | 'accordion';

export type ViewMode = 'focused' | 'matrix';
export type SimulationMode = 'forced' | 'live';
export type AnimationSpeed = 1 | 0.5 | 0.25;
export type AccentColor = 'sky' | 'emerald' | 'violet' | 'amber' | 'rose';
export type ComponentSize = 'sm' | 'md' | 'lg';
export type ComponentVariant = 'primary' | 'secondary' | 'destructive' | 'outline' | 'ghost';

export interface InteractionEvent {
  id: string;
  name: string;
  timestamp: string;
  detail: string;
}

const STATES: { id: ComponentState; label: string; desc: string; tag: string }[] = [
  { id: 'default', label: 'Default', desc: 'Standard interactive rest state', tag: 'Rest' },
  { id: 'pressed', label: 'Pressed / Active', desc: 'Active press down visual feedback', tag: 'Interaction' },
  { id: 'disabled', label: 'Disabled', desc: 'Non-interactive diminished state', tag: 'Restricted' },
  { id: 'loading', label: 'Loading', desc: 'In-progress spinner indicator', tag: 'Pending' },
  { id: 'focused', label: 'Focused', desc: 'Accessibility focus ring or cursor active', tag: 'Focus' },
  { id: 'selected', label: 'Selected', desc: 'Checked or active item highlight', tag: 'Value' },
  { id: 'error', label: 'Error', desc: 'Form validation failure / alert state', tag: 'Invalid' },
  { id: 'empty', label: 'Empty', desc: 'Zero data / placeholder blank state', tag: 'Zero-data' },
];

const COMPONENT_CATEGORIES = [
  {
    category: 'Inputs & Controls',
    items: [
      { id: 'button' as PlaygroundComponent, label: 'Button', badge: 'Core' },
      { id: 'input' as PlaygroundComponent, label: 'Input', badge: 'Form' },
      { id: 'switch' as PlaygroundComponent, label: 'Switch', badge: 'Form' },
      { id: 'checkbox' as PlaygroundComponent, label: 'Checkbox', badge: 'Form' },
      { id: 'slider' as PlaygroundComponent, label: 'Slider', badge: 'Input' },
    ],
  },
  {
    category: 'Feedback & Status',
    items: [
      { id: 'badge' as PlaygroundComponent, label: 'Badge', badge: 'Indicator' },
      { id: 'progress' as PlaygroundComponent, label: 'Progress', badge: 'Visual' },
      { id: 'alert' as PlaygroundComponent, label: 'Alert', badge: 'Notice' },
      { id: 'avatar' as PlaygroundComponent, label: 'Avatar', badge: 'Media' },
    ],
  },
  {
    category: 'Layout & Navigation',
    items: [
      { id: 'card' as PlaygroundComponent, label: 'Card', badge: 'Surfaces' },
      { id: 'tabs' as PlaygroundComponent, label: 'Tabs', badge: 'Nav' },
      { id: 'accordion' as PlaygroundComponent, label: 'Accordion', badge: 'Display' },
    ],
  },
];

const ACCENT_STYLES: Record<
  AccentColor,
  {
    bg: string;
    hover: string;
    ring: string;
    text: string;
    glow: string;
    gradient: string;
  }
> = {
  sky: {
    bg: 'bg-sky-500',
    hover: 'hover:bg-sky-400',
    ring: 'ring-sky-500/30 border-sky-500',
    text: 'text-sky-400',
    glow: 'shadow-sky-500/20',
    gradient: 'from-sky-500 to-indigo-500',
  },
  emerald: {
    bg: 'bg-emerald-500',
    hover: 'hover:bg-emerald-400',
    ring: 'ring-emerald-500/30 border-emerald-500',
    text: 'text-emerald-400',
    glow: 'shadow-emerald-500/20',
    gradient: 'from-emerald-500 to-teal-600',
  },
  violet: {
    bg: 'bg-violet-500',
    hover: 'hover:bg-violet-400',
    ring: 'ring-violet-500/30 border-violet-500',
    text: 'text-violet-400',
    glow: 'shadow-violet-500/20',
    gradient: 'from-violet-500 to-purple-600',
  },
  amber: {
    bg: 'bg-amber-500',
    hover: 'hover:bg-amber-400',
    ring: 'ring-amber-500/30 border-amber-500',
    text: 'text-amber-400',
    glow: 'shadow-amber-500/20',
    gradient: 'from-amber-500 to-orange-600',
  },
  rose: {
    bg: 'bg-rose-500',
    hover: 'hover:bg-rose-400',
    ring: 'ring-rose-500/30 border-rose-500',
    text: 'text-rose-400',
    glow: 'shadow-rose-500/20',
    gradient: 'from-rose-500 to-pink-600',
  },
};

export function ComponentPlayground({
  target = 'nativewind',
}: {
  target?: 'nativewind' | 'stylesheet';
}) {
  // Navigation & View State
  const [component, setComponent] = useState<PlaygroundComponent>('button');
  const [activeState, setActiveState] = useState<ComponentState>('default');
  const [viewMode, setViewMode] = useState<ViewMode>('focused');
  const [simMode, setSimMode] = useState<SimulationMode>('forced');
  const [platform, setPlatform] = useState<'ios' | 'android'>('ios');
  const [animSpeed, setAnimSpeed] = useState<AnimationSpeed>(1);
  const [isDark, setIsDark] = useState(true);
  const [showTouchTarget, setShowTouchTarget] = useState(false);
  const [accent, setAccent] = useState<AccentColor>('sky');
  const [size, setSize] = useState<ComponentSize>('md');
  const [variant, setVariant] = useState<ComponentVariant>('primary');
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'code' | 'events' | 'a11y'>('code');

  // Live Interactive States (for Live Simulation Mode)
  const [livePressing, setLivePressing] = useState(false);
  const [liveLoading, setLiveLoading] = useState(false);
  const [liveInputValue, setLiveInputValue] = useState('');
  const [liveInputFocused, setLiveInputFocused] = useState(false);
  const [liveSwitchValue, setLiveSwitchValue] = useState(true);
  const [liveCheckboxValue, setLiveCheckboxValue] = useState<boolean | 'indeterminate'>('indeterminate');
  const [liveSliderValue, setLiveSliderValue] = useState(65);
  const [liveSelectedTab, setLiveSelectedTab] = useState<'overview' | 'features' | 'reviews'>('overview');
  const [liveAccordionOpen, setLiveAccordionOpen] = useState(true);
  const [liveAlertDismissed, setLiveAlertDismissed] = useState(false);

  // Haptic feedback indicator
  const [hapticFeedback, setHapticFeedback] = useState<string | null>(null);
  const hapticTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Event stream
  const [events, setEvents] = useState<InteractionEvent[]>([]);

  const triggerHaptic = useCallback(
    (type: string, detail: string) => {
      const timestamp = new Date().toLocaleTimeString();
      setHapticFeedback(`${type}: ${detail}`);
      if (hapticTimerRef.current) clearTimeout(hapticTimerRef.current);
      hapticTimerRef.current = setTimeout(() => setHapticFeedback(null), 1400);

      setEvents((prev) => [
        {
          id: Math.random().toString(36).substring(2, 9),
          name: type,
          timestamp,
          detail,
        },
        ...prev.slice(0, 49),
      ]);
    },
    []
  );

  const clearEvents = useCallback(() => setEvents([]), []);

  // Compute active state based on mode
  const resolvedState = useMemo<ComponentState>(() => {
    if (simMode === 'forced') return activeState;

    // In live mode, dynamically compute state from live interactions
    if (component === 'button') {
      if (liveLoading) return 'loading';
      if (livePressing) return 'pressed';
      return 'default';
    }
    if (component === 'input') {
      if (liveInputFocused) return 'focused';
      if (liveInputValue.length > 0 && !liveInputValue.includes('@')) return 'error';
      if (liveInputValue.length === 0) return 'empty';
      return 'default';
    }
    if (component === 'switch') {
      return liveSwitchValue ? 'selected' : 'default';
    }
    if (component === 'checkbox') {
      return liveCheckboxValue === true ? 'selected' : 'default';
    }
    return activeState;
  }, [simMode, activeState, component, liveLoading, livePressing, liveInputFocused, liveInputValue, liveSwitchValue, liveCheckboxValue]);

  // Code snippet generator
  const codeSnippet = useMemo(() => {
    const isNW = target === 'nativewind';
    const acc = ACCENT_STYLES[accent];

    if (component === 'button') {
      if (isNW) {
        switch (resolvedState) {
          case 'pressed':
            return `import { Button } from "@/components/ui/button";\n\nexport function Specimen() {\n  return (\n    <Button\n      variant="${variant}"\n      size="${size}"\n      className="scale-95 opacity-80 ${acc.bg}"\n    >\n      Pressed Button\n    </Button>\n  );\n}`;
          case 'disabled':
            return `import { Button } from "@/components/ui/button";\n\nexport function Specimen() {\n  return (\n    <Button\n      variant="${variant}"\n      size="${size}"\n      disabled\n      aria-disabled={true}\n    >\n      Disabled Button\n    </Button>\n  );\n}`;
          case 'loading':
            return `import { Button } from "@/components/ui/button";\n\nexport function Specimen() {\n  return (\n    <Button\n      variant="${variant}"\n      size="${size}"\n      loading={true}\n    >\n      Processing...\n    </Button>\n  );\n}`;
          case 'selected':
            return `import { Button } from "@/components/ui/button";\n\nexport function Specimen() {\n  return (\n    <Button\n      variant="${variant}"\n      size="${size}"\n      className="ring-2 ring-sky-400 ${acc.bg}"\n    >\n      Selected Option\n    </Button>\n  );\n}`;
          case 'error':
            return `import { Button } from "@/components/ui/button";\n\nexport function Specimen() {\n  return (\n    <Button\n      variant="destructive"\n      size="${size}"\n    >\n      Destructive Action\n    </Button>\n  );\n}`;
          default:
            return `import { Button } from "@/components/ui/button";\n\nexport function Specimen() {\n  return (\n    <Button\n      variant="${variant}"\n      size="${size}"\n      onPress={() => console.log("onPress")}\n    >\n      Primary Action\n    </Button>\n  );\n}`;
        }
      } else {
        return `import { Pressable, Text, StyleSheet, ActivityIndicator } from "react-native";\n\nexport function Specimen() {\n  return (\n    <Pressable\n      style={({ pressed }) => [\n        styles.button,\n        styles.${size},\n        pressed && styles.pressed,\n        ${resolvedState === 'disabled' ? 'styles.disabled,' : ''}\n      ]}\n      disabled={${resolvedState === 'disabled' || resolvedState === 'loading'}}\n      accessibilityRole="button"\n    >\n      ${
          resolvedState === 'loading'
            ? '<ActivityIndicator color="#fff" size="small" />'
            : `<Text style={styles.buttonText}>${
                resolvedState === 'disabled'
                  ? 'Disabled Button'
                  : resolvedState === 'pressed'
                  ? 'Pressed State'
                  : 'Primary Action'
              }</Text>`
        }\n    </Pressable>\n  );\n}\n\nconst styles = StyleSheet.create({\n  button: { borderRadius: 12, alignItems: 'center', justifyContent: 'center' },\n  md: { paddingVertical: 12, paddingHorizontal: 20 },\n  pressed: { transform: [{ scale: 0.96 }], opacity: 0.85 },\n  disabled: { opacity: 0.5 },\n  buttonText: { color: '#ffffff', fontWeight: '600' },\n});`;
      }
    }

    if (component === 'input') {
      if (isNW) {
        switch (resolvedState) {
          case 'focused':
            return `import { Input } from "@/components/ui/input";\n\nexport function Specimen() {\n  return (\n    <Input\n      label="Email Address"\n      placeholder="name@domain.com"\n      className="${acc.ring} ring-2"\n      autoFocus\n    />\n  );\n}`;
          case 'error':
            return `import { Input } from "@/components/ui/input";\n\nexport function Specimen() {\n  return (\n    <Input\n      label="Email Address"\n      value="invalid-email"\n      error={true}\n      errorMessage="Please provide a valid email format."\n      className="border-red-500 bg-red-500/10"\n    />\n  );\n}`;
          case 'disabled':
            return `import { Input } from "@/components/ui/input";\n\nexport function Specimen() {\n  return (\n    <Input\n      label="Email Address"\n      value="locked@nativra.com"\n      disabled={true}\n      editable={false}\n    />\n  );\n}`;
          case 'empty':
            return `import { Input } from "@/components/ui/input";\n\nexport function Specimen() {\n  return (\n    <Input\n      label="Email Address"\n      placeholder="Enter email address..."\n    />\n  );\n}`;
          default:
            return `import { Input } from "@/components/ui/input";\n\nexport function Specimen() {\n  return (\n    <Input\n      label="Email Address"\n      placeholder="sophia@example.com"\n    />\n  );\n}`;
        }
      } else {
        return `import { View, Text, TextInput, StyleSheet } from "react-native";\n\nexport function Specimen() {\n  return (\n    <View style={styles.container}>\n      <Text style={styles.label}>Email Address</Text>\n      <TextInput\n        style={[styles.input, ${resolvedState === 'error' ? 'styles.errorBorder' : 'null'}]}\n        placeholder="Enter email address..."\n        placeholderTextColor="#71717a"\n        editable={${resolvedState !== 'disabled'}}\n      />\n    </View>\n  );\n}\n\nconst styles = StyleSheet.create({\n  container: { gap: 6, width: '100%' },\n  label: { fontSize: 13, fontWeight: '600', color: '#a1a1aa' },\n  input: { borderWidth: 1, borderColor: '#27272a', borderRadius: 12, padding: 12, color: '#f4f4f5' },\n  errorBorder: { borderColor: '#ef4444' },\n});`;
      }
    }

    if (component === 'switch') {
      return isNW
        ? `import { Switch } from "@/components/ui/switch";\n\nexport function Specimen() {\n  return (\n    <Switch\n      checked={${resolvedState === 'selected' || resolvedState === 'default'}}\n      disabled={${resolvedState === 'disabled'}}\n      onCheckedChange={(val) => console.log(val)}\n    />\n  );\n}`
        : `import { Switch } from "react-native";\n\nexport function Specimen() {\n  return (\n    <Switch\n      value={${resolvedState === 'selected' || resolvedState === 'default'}}\n      disabled={${resolvedState === 'disabled'}}\n      trackColor={{ false: "#27272a", true: "#0ea5e9" }}\n      thumbColor="#ffffff"\n    />\n  );\n}`;
    }

    if (component === 'checkbox') {
      return isNW
        ? `import { Checkbox } from "@/components/ui/checkbox";\n\nexport function Specimen() {\n  return (\n    <Checkbox\n      checked={${resolvedState === 'selected' ? 'true' : resolvedState === 'empty' ? 'false' : '"indeterminate"'}}\n      disabled={${resolvedState === 'disabled'}}\n      onCheckedChange={(checked) => console.log(checked)}\n    />\n  );\n}`
        : `// React Native Checkbox Specimen (StyleSheet)`;
    }

    if (component === 'slider') {
      return isNW
        ? `import { Slider } from "@/components/ui/slider";\n\nexport function Specimen() {\n  return (\n    <Slider\n      value={${liveSliderValue}}\n      min={0}\n      max={100}\n      step={1}\n      disabled={${resolvedState === 'disabled'}}\n      onValueChange={(val) => console.log(val)}\n    />\n  );\n}`
        : `// React Native Slider Specimen (StyleSheet)`;
    }

    return `// Specimen: <${component.toUpperCase()} state="${resolvedState}" target="${target}" />`;
  }, [component, resolvedState, target, variant, size, accent, liveSliderValue]);

  const copyCode = useCallback(() => {
    navigator.clipboard.writeText(codeSnippet);
    setCopied(true);
    triggerHaptic('System', 'Code copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  }, [codeSnippet, triggerHaptic]);

  // Accessibility Announcement preview string
  const a11yAnnouncement = useMemo(() => {
    switch (component) {
      case 'button':
        if (resolvedState === 'loading') return 'Processing, in progress, button.';
        if (resolvedState === 'disabled') return 'Disabled Button, dimmed, button.';
        return 'Primary Action, button. Double tap to activate.';
      case 'input':
        if (resolvedState === 'error') return 'Email Address, edit text. Invalid email format, error.';
        if (resolvedState === 'disabled') return 'Email Address, locked@nativra.com, dimmed, edit text.';
        return 'Email Address, edit text. Double tap to enter text.';
      case 'switch':
        return `Push Notifications, switch, ${liveSwitchValue ? 'on' : 'off'}. Double tap to toggle.`;
      case 'checkbox':
        return `I accept the Terms and Conditions, checkbox, ${
          liveCheckboxValue === true ? 'checked' : liveCheckboxValue === 'indeterminate' ? 'mixed' : 'not checked'
        }. Double tap to toggle.`;
      case 'slider':
        return `Volume Slider, ${liveSliderValue} percent, adjustable. Swipe up or down to adjust.`;
      case 'badge':
        return 'Pro Member, status tag.';
      default:
        return `${component}, interactive specimen.`;
    }
  }, [component, resolvedState, liveSwitchValue, liveCheckboxValue, liveSliderValue]);

  const accStyle = ACCENT_STYLES[accent];

  // Helper to render interactive component specimen
  const renderSpecimen = (stateToRender: ComponentState, isMatrixCard = false) => {
    const isLive = simMode === 'live' && !isMatrixCard;
    const currentState = isMatrixCard ? stateToRender : resolvedState;
    const animDuration = animSpeed === 1 ? '150ms' : animSpeed === 0.5 ? '350ms' : '750ms';

    return (
      <div
        className="relative flex flex-col items-center justify-center w-full"
        style={{ transitionDuration: animDuration }}
      >
        {/* Touch Target Bounding Box Overlay */}
        {showTouchTarget && (
          <div className="absolute pointer-events-none -inset-3 border-2 border-dashed border-cyan-400/80 rounded-2xl bg-cyan-500/10 flex items-start justify-between p-1 z-30">
            <span className="text-[9px] font-mono text-cyan-300 font-bold bg-cyan-950/90 px-1 rounded shadow">
              {platform === 'ios' ? '44 × 44 pt' : '48 × 48 dp'}
            </span>
            <span className="text-[9px] font-mono text-emerald-400 font-bold bg-emerald-950/90 px-1 rounded shadow">
              Pass
            </span>
          </div>
        )}

        {/* Specimen: BUTTON */}
        {component === 'button' && (
          <div className="w-full flex flex-col items-center gap-2">
            <button
              type="button"
              disabled={currentState === 'disabled' || currentState === 'loading'}
              onMouseDown={() => {
                if (isLive) {
                  setLivePressing(true);
                  triggerHaptic('iOS UIImpactFeedbackGenerator', 'Impact Medium (onPressIn)');
                }
              }}
              onMouseUp={() => {
                if (isLive) {
                  setLivePressing(false);
                  triggerHaptic('iOS UIImpactFeedbackGenerator', 'Impact Light (onPressOut)');
                }
              }}
              onClick={() => {
                if (isLive) {
                  triggerHaptic('React Native onPress', 'Event triggered');
                  setLiveLoading(true);
                  setTimeout(() => setLiveLoading(false), 1200);
                }
              }}
              className={`w-full font-semibold rounded-2xl flex items-center justify-center gap-2 transition-all relative overflow-hidden select-none ${
                size === 'sm' ? 'py-2 px-4 text-xs' : size === 'lg' ? 'py-4 px-8 text-base' : 'py-3.5 px-6 text-sm'
              } ${
                currentState === 'pressed' || (isLive && livePressing)
                  ? 'scale-95 opacity-80 ' + accStyle.bg
                  : currentState === 'disabled'
                  ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed opacity-60'
                  : currentState === 'loading' || (isLive && liveLoading)
                  ? accStyle.bg + ' text-white opacity-90 cursor-wait'
                  : currentState === 'selected'
                  ? accStyle.bg + ' text-white ring-4 ring-sky-500/30'
                  : currentState === 'error'
                  ? 'bg-red-600 text-white hover:bg-red-500'
                  : variant === 'secondary'
                  ? 'bg-zinc-800 text-zinc-100 hover:bg-zinc-700'
                  : variant === 'outline'
                  ? 'border border-zinc-700 bg-transparent text-zinc-200 hover:bg-zinc-800'
                  : variant === 'ghost'
                  ? 'bg-transparent text-zinc-300 hover:bg-zinc-800'
                  : accStyle.bg + ' text-white ' + accStyle.hover + ' shadow-lg ' + accStyle.glow
              }`}
            >
              {(currentState === 'loading' || (isLive && liveLoading)) && (
                <Loader2 className="h-4 w-4 animate-spin text-white" />
              )}
              {currentState === 'disabled' && <Lock className="h-4 w-4" />}
              {currentState === 'selected' && <CheckCircle2 className="h-4 w-4" />}
              <span>
                {currentState === 'loading' || (isLive && liveLoading)
                  ? 'Processing...'
                  : currentState === 'disabled'
                  ? 'Disabled Button'
                  : currentState === 'selected'
                  ? 'Selected Option'
                  : currentState === 'error'
                  ? 'Destructive Action'
                  : currentState === 'pressed' || (isLive && livePressing)
                  ? 'Pressed State'
                  : 'Primary Action'}
              </span>
            </button>
            {!isMatrixCard && (
              <span className="text-[11px] text-zinc-500">
                Physics: {platform === 'ios' ? 'iOS Spring Curve (95% scale)' : 'Android Material Ripple (Wave FX)'}
              </span>
            )}
          </div>
        )}

        {/* Specimen: INPUT */}
        {component === 'input' && (
          <div className="w-full space-y-2">
            <label className="text-xs font-semibold block text-zinc-400">Email Address</label>
            <div
              className={`w-full rounded-xl px-4 py-3 text-sm border flex items-center gap-2 transition-all ${
                currentState === 'focused' || (isLive && liveInputFocused)
                  ? `${accStyle.ring} ring-2 bg-zinc-950 text-white`
                  : currentState === 'error'
                  ? 'border-red-500 bg-red-500/10 text-red-200'
                  : currentState === 'disabled'
                  ? 'border-zinc-800 bg-zinc-800/40 text-zinc-500 cursor-not-allowed'
                  : 'border-zinc-800 bg-zinc-950 text-zinc-200'
              }`}
            >
              <input
                type="text"
                readOnly={!isLive || currentState === 'disabled'}
                disabled={currentState === 'disabled'}
                value={
                  isLive
                    ? liveInputValue
                    : currentState === 'error'
                    ? 'invalid-email-format'
                    : currentState === 'disabled'
                    ? 'locked@nativra.com'
                    : currentState === 'empty'
                    ? ''
                    : 'sophia@example.com'
                }
                onChange={(e) => {
                  if (isLive) {
                    setLiveInputValue(e.target.value);
                    triggerHaptic('onChangeText', `Value: "${e.target.value}"`);
                  }
                }}
                onFocus={() => {
                  if (isLive) {
                    setLiveInputFocused(true);
                    triggerHaptic('onFocus', 'Keyboard shown, cursor at position 0');
                  }
                }}
                onBlur={() => {
                  if (isLive) {
                    setLiveInputFocused(false);
                    triggerHaptic('onBlur', 'Keyboard dismissed');
                  }
                }}
                placeholder="Enter email address..."
                className="bg-transparent border-none outline-none w-full text-sm text-inherit placeholder:text-zinc-600"
              />
              {currentState === 'error' && <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />}
            </div>
            {currentState === 'error' && (
              <p className="text-[11px] text-red-400 font-medium">Please provide a valid email format.</p>
            )}
          </div>
        )}

        {/* Specimen: SWITCH */}
        {component === 'switch' && (
          <div className="w-full flex items-center justify-between p-2">
            <span className="text-sm font-medium text-zinc-200">Push Notifications</span>
            <div
              role="switch"
              aria-checked={isLive ? liveSwitchValue : currentState === 'selected' || currentState === 'default'}
              tabIndex={0}
              onClick={() => {
                if (currentState !== 'disabled') {
                  const next = !liveSwitchValue;
                  setLiveSwitchValue(next);
                  triggerHaptic('Android HapticFeedbackConstants', `TOGGLE_CHANGED (${next ? 'ON' : 'OFF'})`);
                }
              }}
              className={`w-13 h-7 rounded-full p-1 cursor-pointer transition-colors relative flex items-center ${
                currentState === 'disabled'
                  ? 'bg-zinc-800 opacity-50 cursor-not-allowed'
                  : (isLive ? liveSwitchValue : currentState === 'selected' || currentState === 'default')
                  ? accStyle.bg
                  : 'bg-zinc-700'
              }`}
            >
              <div
                className={`h-5 w-5 rounded-full bg-white shadow-md transition-transform duration-200 ease-out transform ${
                  (isLive ? liveSwitchValue : currentState === 'selected' || currentState === 'default')
                    ? 'translate-x-6'
                    : 'translate-x-0'
                }`}
              />
            </div>
          </div>
        )}

        {/* Specimen: CHECKBOX */}
        {component === 'checkbox' && (
          <div
            className="flex items-center gap-3 cursor-pointer select-none"
            onClick={() => {
              if (currentState !== 'disabled') {
                const next = liveCheckboxValue === true ? false : true;
                setLiveCheckboxValue(next);
                triggerHaptic('iOS SelectionFeedback', `Checked: ${next}`);
              }
            }}
          >
            <div
              className={`h-6 w-6 rounded-lg border flex items-center justify-center transition-all ${
                currentState === 'disabled'
                  ? 'border-zinc-800 bg-zinc-800/40 text-zinc-600 cursor-not-allowed'
                  : currentState === 'selected' || (isLive && liveCheckboxValue === true)
                  ? `${accStyle.bg} border-transparent text-white shadow-md`
                  : currentState === 'empty' || (isLive && liveCheckboxValue === false)
                  ? 'border-zinc-700 bg-zinc-900/60'
                  : `${accStyle.bg}/20 border-sky-500 text-sky-400`
              }`}
            >
              {(currentState === 'selected' || (isLive && liveCheckboxValue === true)) && (
                <Check className="h-4 w-4 stroke-[3]" />
              )}
              {currentState === 'default' && !isLive && <MinusSquare className="h-4 w-4" />}
            </div>
            <span className={`text-sm ${currentState === 'disabled' ? 'text-zinc-600' : 'text-zinc-200'}`}>
              I accept the Terms and Privacy Policy
            </span>
          </div>
        )}

        {/* Specimen: SLIDER */}
        {component === 'slider' && (
          <div className="w-full space-y-3">
            <div className="flex justify-between text-xs font-semibold text-zinc-400">
              <span>Haptic Intensity</span>
              <span className="font-mono text-zinc-200">{liveSliderValue}%</span>
            </div>
            <div className="relative w-full flex items-center">
              <input
                type="range"
                min="0"
                max="100"
                disabled={currentState === 'disabled'}
                value={currentState === 'empty' ? 0 : liveSliderValue}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setLiveSliderValue(val);
                  triggerHaptic('Slider Scrubber', `Value: ${val}`);
                }}
                className="w-full h-2 rounded-lg bg-zinc-800 appearance-none cursor-pointer accent-sky-400 disabled:opacity-50"
              />
            </div>
          </div>
        )}

        {/* Specimen: PROGRESS */}
        {component === 'progress' && (
          <div className="w-full space-y-2">
            <div className="flex justify-between text-xs font-semibold text-zinc-400">
              <span>Syncing with Cloud</span>
              <span className="font-mono text-zinc-200">
                {currentState === 'empty' ? '0%' : currentState === 'selected' ? '100%' : '68%'}
              </span>
            </div>
            <div className="w-full h-3 rounded-full bg-zinc-800 overflow-hidden">
              <div
                className={`h-full ${accStyle.bg} transition-all duration-500 rounded-full`}
                style={{
                  width:
                    currentState === 'empty'
                      ? '0%'
                      : currentState === 'selected'
                      ? '100%'
                      : currentState === 'loading'
                      ? '40%'
                      : '68%',
                }}
              />
            </div>
          </div>
        )}

        {/* Specimen: BADGE */}
        {component === 'badge' && (
          <div className="flex flex-col items-center gap-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-all ${
                currentState === 'error'
                  ? 'bg-red-500/15 text-red-400 border border-red-500/30'
                  : currentState === 'selected'
                  ? `${accStyle.bg}/20 ${accStyle.text} border ${accStyle.ring}`
                  : currentState === 'disabled'
                  ? 'bg-zinc-800 text-zinc-500'
                  : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
              }`}
            >
              <Sparkles className="h-3 w-3" />
              <span>{currentState === 'error' ? 'Failed' : 'Pro Member'}</span>
            </span>
          </div>
        )}

        {/* Specimen: TABS */}
        {component === 'tabs' && (
          <div className="w-full flex rounded-xl bg-zinc-950 p-1 border border-zinc-800">
            {(['overview', 'features', 'reviews'] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => {
                  setLiveSelectedTab(t);
                  triggerHaptic('SegmentedControl', `Tab selected: ${t}`);
                }}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                  liveSelectedTab === t
                    ? 'bg-zinc-800 text-white shadow-sm ring-1 ring-zinc-700/60'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        )}

        {/* Specimen: CARD */}
        {component === 'card' && (
          <div
            className={`w-full p-5 rounded-2xl border transition-all ${
              currentState === 'pressed'
                ? 'scale-95 border-sky-500/50 bg-zinc-900/90'
                : 'border-zinc-800 bg-zinc-950/60'
            } flex items-center justify-between`}
          >
            <div>
              <div className="text-xs text-zinc-400 font-medium">Monthly ARR</div>
              <div className="text-2xl font-bold text-white mt-1">$48,250</div>
            </div>
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 font-semibold text-xs">+18.4%</div>
          </div>
        )}

        {/* Specimen: AVATAR */}
        {component === 'avatar' && (
          <div className="flex flex-col items-center gap-2">
            <div
              className={`h-16 w-16 rounded-full bg-gradient-to-tr ${accStyle.gradient} flex items-center justify-center font-bold text-white text-lg shadow-lg relative`}
            >
              SM
              {currentState === 'selected' && (
                <div className="absolute bottom-0 right-0 h-4 w-4 rounded-full bg-emerald-500 border-2 border-zinc-900" />
              )}
            </div>
            <span className="text-xs text-zinc-400">Sophia Martinez</span>
          </div>
        )}

        {/* Specimen: ALERT */}
        {component === 'alert' && (
          liveAlertDismissed ? (
            <button
              type="button"
              onClick={() => {
                setLiveAlertDismissed(false);
                triggerHaptic('Alert Reset', 'Notification restored');
              }}
              className="text-xs px-3 py-1.5 rounded-lg bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white transition-colors"
            >
              Reset Dismissed Alert
            </button>
          ) : (
            <div
              className={`w-full p-4 rounded-xl border flex items-start gap-3 transition-all relative ${
                currentState === 'error'
                  ? 'border-red-500/40 bg-red-500/10 text-red-200'
                  : 'border-sky-500/30 bg-sky-500/10 text-sky-200'
              }`}
            >
              <Info className="h-5 w-5 shrink-0 mt-0.5 text-sky-400" />
              <div className="flex-1 text-xs">
                <span className="font-bold block">Production Deployment Notice</span>
                <span className="text-zinc-400">
                  Your mobile build bundle has been synced with the latest React Native architecture.
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setLiveAlertDismissed(true);
                  triggerHaptic('Alert Dismiss', 'Notification dismissed');
                }}
                className="text-zinc-400 hover:text-white p-1 rounded-md transition-colors"
                title="Dismiss alert"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          )
        )}

        {/* Specimen: ACCORDION */}
        {component === 'accordion' && (
          <div className="w-full rounded-xl border border-zinc-800 bg-zinc-950 overflow-hidden">
            <button
              type="button"
              onClick={() => {
                setLiveAccordionOpen(!liveAccordionOpen);
                triggerHaptic('Accordion', `Toggled: ${!liveAccordionOpen ? 'OPEN' : 'CLOSED'}`);
              }}
              className="w-full p-3.5 flex items-center justify-between text-left text-xs font-semibold text-zinc-200 hover:bg-zinc-900"
            >
              <span>Can I use NativeWind and StyleSheet simultaneously?</span>
              <ChevronDown
                className={`h-4 w-4 text-zinc-400 transition-transform ${liveAccordionOpen ? 'rotate-180' : ''}`}
              />
            </button>
            {liveAccordionOpen && (
              <div className="p-3.5 border-t border-zinc-800/60 text-xs text-zinc-400 leading-relaxed bg-zinc-900/30">
                Yes! Nativra generates zero-runtime source code compatible with both standard React Native StyleSheet and
                NativeWind Tailwind classes.
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-1 overflow-hidden h-full">
      {/* Left Column: Component Picker & State Switcher */}
      <aside className="w-80 shrink-0 flex flex-col border-r border-zinc-800 bg-zinc-900/60">
        {/* Header */}
        <div className="p-4 border-b border-zinc-800">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Play className="h-4 w-4 text-sky-400" />
              <h2 className="text-xs font-semibold text-zinc-100">Component Playground</h2>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20">
              v3.2 Lab
            </span>
          </div>

          {/* View Mode Toggle: Single vs 8-State Matrix */}
          <div className="grid grid-cols-2 gap-1 p-1 bg-zinc-950/80 rounded-xl border border-zinc-800 mb-3">
            <button
              type="button"
              onClick={() => setViewMode('focused')}
              className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                viewMode === 'focused'
                  ? 'bg-zinc-800 text-white shadow-sm font-semibold'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Crosshair className="h-3.5 w-3.5 text-sky-400" />
              <span>Focused State</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('matrix')}
              className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                viewMode === 'matrix'
                  ? 'bg-zinc-800 text-white shadow-sm font-semibold'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Grid className="h-3.5 w-3.5 text-emerald-400" />
              <span>8-State Matrix</span>
            </button>
          </div>

          {/* Simulation Mode Toggle (Forced vs Live) */}
          {viewMode === 'focused' && (
            <div className="flex items-center justify-between px-1">
              <span className="text-[11px] text-zinc-400 font-medium">Interaction Mode:</span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setSimMode('forced')}
                  className={`px-2 py-0.5 rounded-md text-[11px] font-medium transition-colors ${
                    simMode === 'forced'
                      ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                      : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  Forced State
                </button>
                <button
                  type="button"
                  onClick={() => setSimMode('live')}
                  className={`px-2 py-0.5 rounded-md text-[11px] font-medium transition-colors ${
                    simMode === 'live'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  Live Interactive
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Component Selector by Category */}
        <div className="p-3 border-b border-zinc-800/80 overflow-y-auto max-h-48 space-y-3">
          {COMPONENT_CATEGORIES.map((cat) => (
            <div key={cat.category} className="space-y-1">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 px-1">
                {cat.category}
              </div>
              <div className="grid grid-cols-3 gap-1">
                {cat.items.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setComponent(item.id);
                      triggerHaptic('Specimen Switched', item.label);
                    }}
                    className={`capitalize px-2 py-1.5 rounded-lg text-xs font-medium transition-all text-center truncate ${
                      component === item.id
                        ? 'bg-sky-500/15 text-sky-300 border border-sky-500/30 font-semibold'
                        : 'text-zinc-400 hover:text-zinc-200 bg-zinc-950/40 border border-zinc-800/40 hover:border-zinc-700'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* States Header */}
        <div className="px-4 py-2 border-b border-zinc-800/80 flex items-center justify-between">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
            Interactive States (8)
          </span>
          <span className="text-[10px] text-zinc-400 font-mono capitalize">{activeState}</span>
        </div>

        {/* States List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {STATES.map((s) => {
            const isSelected = activeState === s.id;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => {
                  setActiveState(s.id);
                  setSimMode('forced');
                  triggerHaptic('State Selected', s.label);
                }}
                className={`w-full text-left p-2.5 rounded-xl border transition-all ${
                  isSelected
                    ? 'border-sky-500/50 bg-zinc-800/80 shadow-md ring-1 ring-sky-500/20'
                    : 'border-zinc-800/60 bg-zinc-950/40 hover:bg-zinc-800/40 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-xs font-semibold text-zinc-200">{s.label}</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-400 border border-zinc-700/50 font-mono">
                    {s.tag}
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400 leading-snug">{s.desc}</p>
              </button>
            );
          })}
        </div>
      </aside>

      {/* Main Area: Specimen Viewport & Controls */}
      <main className="flex-1 flex flex-col overflow-hidden bg-zinc-950">
        {/* Top Control Bar */}
        <header className="h-14 border-b border-zinc-800 px-6 flex items-center justify-between bg-zinc-900/60 backdrop-blur shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-xs text-zinc-400">Specimen:</span>
            <span className="text-xs font-bold text-white capitalize bg-zinc-800 px-2.5 py-1 rounded-lg border border-zinc-700/60 flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-sky-400 animate-pulse" />
              {component} • {resolvedState}
            </span>

            {/* Quick Variant Switcher */}
            {component === 'button' && (
              <div className="hidden sm:flex items-center gap-1 ml-2">
                {(['primary', 'secondary', 'destructive', 'outline'] as ComponentVariant[]).map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setVariant(v)}
                    className={`capitalize text-[11px] px-2 py-0.5 rounded-md font-medium transition-colors ${
                      variant === v ? 'bg-zinc-700 text-white' : 'text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            )}

            {/* Quick Size Switcher */}
            {component === 'button' && (
              <div className="hidden md:flex items-center gap-1 ml-1 border-l border-zinc-700/60 pl-2">
                {(['sm', 'md', 'lg'] as ComponentSize[]).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSize(s)}
                    className={`uppercase text-[10px] px-1.5 py-0.5 rounded font-mono font-medium transition-colors ${
                      size === s ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30 font-bold' : 'text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Animation Speed Selector (Slow Motion Inspector) */}
            <div className="flex items-center rounded-xl border border-zinc-800 bg-zinc-950/70 p-1" title="Spring & Ripple Animation Speed">
              <span className="text-[10px] text-zinc-500 font-medium px-1.5">Speed:</span>
              {([1, 0.5, 0.25] as AnimationSpeed[]).map((spd) => (
                <button
                  key={spd}
                  type="button"
                  onClick={() => setAnimSpeed(spd)}
                  className={`px-2 py-0.5 rounded-lg text-xs font-mono font-medium transition-all ${
                    animSpeed === spd ? 'bg-zinc-800 text-white font-bold' : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  {spd}x
                </button>
              ))}
            </div>

            {/* Touch Target Bounding Box Toggle */}
            <button
              type="button"
              onClick={() => {
                setShowTouchTarget(!showTouchTarget);
                triggerHaptic('A11y Overlay', !showTouchTarget ? 'Touch Target Enabled' : 'Disabled');
              }}
              className={`p-2 rounded-xl border transition-colors flex items-center gap-1.5 text-xs font-medium ${
                showTouchTarget
                  ? 'border-cyan-500/50 bg-cyan-500/20 text-cyan-300'
                  : 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white'
              }`}
              title="Toggle 48x48dp Touch Target Bounding Box"
            >
              <Crosshair className="h-4 w-4" />
              <span className="hidden md:inline">Target</span>
            </button>

            {/* Accent Color Palette Switcher */}
            <div className="flex items-center gap-1 px-1 py-1 rounded-xl border border-zinc-800 bg-zinc-950/70">
              {(['sky', 'emerald', 'violet', 'amber', 'rose'] as AccentColor[]).map((col) => (
                <button
                  key={col}
                  type="button"
                  onClick={() => setAccent(col)}
                  className={`h-4 w-4 rounded-full transition-transform ${ACCENT_STYLES[col].bg} ${
                    accent === col ? 'scale-125 ring-2 ring-white/60' : 'opacity-60 hover:opacity-100'
                  }`}
                  title={`Accent: ${col}`}
                />
              ))}
            </div>

            {/* Platform Toggle */}
            <div className="flex items-center rounded-xl border border-zinc-800 bg-zinc-950/70 p-1">
              <button
                type="button"
                onClick={() => {
                  setPlatform('ios');
                  triggerHaptic('Platform', 'Switched to iOS');
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                  platform === 'ios' ? 'bg-zinc-800 text-white font-semibold' : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                iOS
              </button>
              <button
                type="button"
                onClick={() => {
                  setPlatform('android');
                  triggerHaptic('Platform', 'Switched to Android');
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                  platform === 'android' ? 'bg-zinc-800 text-white font-semibold' : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                Android
              </button>
            </div>

            {/* Theme Toggle */}
            <button
              type="button"
              onClick={() => setIsDark(!isDark)}
              className="p-2 rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white transition-colors"
              title="Toggle Light/Dark Theme"
            >
              {isDark ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-sky-400" />}
            </button>
          </div>
        </header>

        {/* Live Canvas Viewport */}
        <div
          className={`flex-1 overflow-y-auto p-8 transition-colors flex flex-col items-center justify-center relative ${
            isDark ? 'bg-zinc-950' : 'bg-zinc-100'
          }`}
        >
          {/* Haptic Visualizer Toast */}
          {hapticFeedback && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-40 px-3.5 py-1.5 rounded-full bg-zinc-900/95 border border-sky-500/40 text-sky-300 text-xs font-mono flex items-center gap-2 shadow-2xl backdrop-blur animate-bounce">
              <Zap className="h-3.5 w-3.5 text-sky-400" />
              <span>{hapticFeedback}</span>
            </div>
          )}

          {/* MODE 1: Focused State Card */}
          {viewMode === 'focused' ? (
            <div className="w-full max-w-md flex flex-col items-center gap-4">
              <div
                className={`w-full rounded-3xl p-8 border shadow-2xl transition-all flex flex-col items-center justify-center min-h-[320px] relative ${
                  isDark
                    ? 'bg-zinc-900/90 border-zinc-800 text-white'
                    : 'bg-white border-zinc-200 text-zinc-900 shadow-zinc-200/50'
                }`}
              >
                {renderSpecimen(activeState, false)}
              </div>

              {/* Screen Reader VoiceOver Announcement Card */}
              <div className="w-full rounded-xl border border-zinc-800/80 bg-zinc-900/70 p-3 flex items-start gap-2.5">
                <Volume2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <span className="font-semibold text-zinc-300 block">VoiceOver / TalkBack Announcement:</span>
                  <span className="text-zinc-400 font-mono text-[11px] leading-relaxed italic">
                    "{a11yAnnouncement}"
                  </span>
                </div>
              </div>
            </div>
          ) : (
            /* MODE 2: 8-State Full Design System Matrix */
            <div className="w-full max-w-5xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-zinc-200">
                    Design System 8-State Matrix: <span className="text-sky-400 capitalize">{component}</span>
                  </h3>
                  <p className="text-xs text-zinc-500">
                    Simultaneous verification of all states across {platform.toUpperCase()} platform standards
                  </p>
                </div>
                <span className="text-xs font-mono text-zinc-400 px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800">
                  Target: {target === 'nativewind' ? 'NativeWind v4' : 'StyleSheet'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {STATES.map((s) => (
                  <div
                    key={s.id}
                    onClick={() => {
                      setActiveState(s.id);
                      setViewMode('focused');
                    }}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between min-h-[180px] hover:scale-[1.02] ${
                      activeState === s.id
                        ? 'border-sky-500 bg-zinc-900/90 shadow-xl ring-1 ring-sky-500/30'
                        : 'border-zinc-800/80 bg-zinc-900/40 hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold text-zinc-200">{s.label}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700/50">
                        {s.tag}
                      </span>
                    </div>

                    <div className="my-auto py-2 flex items-center justify-center w-full">
                      {renderSpecimen(s.id, true)}
                    </div>

                    <div className="text-[10px] text-zinc-500 text-center mt-2 border-t border-zinc-800/40 pt-1.5">
                      Click to inspect
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Inspector & Code Hub */}
        <footer className="h-56 border-t border-zinc-800 bg-zinc-900/90 flex flex-col shrink-0">
          {/* Inspector Header / Tabs */}
          <div className="px-6 py-2 border-b border-zinc-800 flex items-center justify-between bg-zinc-900 shrink-0">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('code')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  activeTab === 'code' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                <Terminal className="h-3.5 w-3.5 text-sky-400" />
                <span>JSX Usage Code</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('events')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  activeTab === 'events' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                <Activity className="h-3.5 w-3.5 text-emerald-400" />
                <span>Interaction Log</span>
                {events.length > 0 && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-400 font-mono">
                    {events.length}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('a11y')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  activeTab === 'a11y' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                <Shield className="h-3.5 w-3.5 text-amber-400" />
                <span>Accessibility Audit</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              {activeTab === 'events' && events.length > 0 && (
                <button
                  type="button"
                  onClick={clearEvents}
                  className="px-2.5 py-1 text-[11px] rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors"
                >
                  Clear Log
                </button>
              )}

              {activeTab === 'code' && (
                <button
                  type="button"
                  onClick={copyCode}
                  className="flex items-center gap-1.5 rounded-lg bg-zinc-800 px-3 py-1 text-xs font-medium text-zinc-300 hover:bg-zinc-700 hover:text-white transition-colors border border-zinc-700/60"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy JSX'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Tab 1: JSX Usage Code */}
          {activeTab === 'code' && (
            <pre className="p-4 text-xs font-mono text-zinc-300 overflow-x-auto flex-1 bg-zinc-950/70 select-text">
              <code>{codeSnippet}</code>
            </pre>
          )}

          {/* Tab 2: Live Interaction Log */}
          {activeTab === 'events' && (
            <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-zinc-950/70 font-mono text-xs">
              {events.length === 0 ? (
                <div className="py-6 text-center text-zinc-600">
                  <Activity className="h-5 w-5 mx-auto mb-1 opacity-50" />
                  <p>No interactions recorded yet.</p>
                  <p className="text-[11px] text-zinc-700">
                    Switch to "Live Interactive" mode and click, type, or toggle the component to record events.
                  </p>
                </div>
              ) : (
                events.map((e) => (
                  <div key={e.id} className="p-2 rounded-lg border border-zinc-800 bg-zinc-900/60 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-400 font-bold">{e.name}</span>
                      <span className="text-zinc-400 text-[11px]">{e.detail}</span>
                    </div>
                    <span className="text-zinc-600 text-[10px]">{e.timestamp}</span>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Tab 3: Accessibility Audit */}
          {activeTab === 'a11y' && (
            <div className="flex-1 overflow-y-auto p-4 bg-zinc-950/70 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-xl border border-zinc-800 bg-zinc-900/60">
                  <div className="text-[10px] text-zinc-500 font-semibold uppercase">WCAG Target Compliance</div>
                  <div className="text-base font-bold text-emerald-400 mt-0.5">48x48 dp (Passed)</div>
                  <div className="text-[11px] text-zinc-400 mt-1">Complies with Apple HIG & Android Material 3 minimum tap slop.</div>
                </div>

                <div className="p-3 rounded-xl border border-zinc-800 bg-zinc-900/60">
                  <div className="text-[10px] text-zinc-500 font-semibold uppercase">Role & Semantic Trait</div>
                  <div className="text-base font-bold text-sky-400 mt-0.5 font-mono">accessibilityRole="{component}"</div>
                  <div className="text-[11px] text-zinc-400 mt-1">Exposed correctly to Assistive Touch and TalkBack trees.</div>
                </div>

                <div className="p-3 rounded-xl border border-zinc-800 bg-zinc-900/60">
                  <div className="text-[10px] text-zinc-500 font-semibold uppercase">High-Contrast Contrast Ratio</div>
                  <div className="text-base font-bold text-emerald-400 mt-0.5 font-mono">11.8:1 (AAA)</div>
                  <div className="text-[11px] text-zinc-400 mt-1">Meets WCAG 2.1 AAA minimum threshold for readability.</div>
                </div>
              </div>
            </div>
          )}
        </footer>
      </main>
    </div>
  );
}
