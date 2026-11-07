'use client';

import React, { useState } from 'react';
import {
  Maximize2,
  Smartphone,
  Tablet,
  Monitor,
  Shield,
  Sun,
  Moon,
  Sparkles,
  RotateCcw,
  Wifi,
  Battery,
  Layers,
  Activity,
} from 'lucide-react';

export type CanvasViewportPreset = 'fit' | 'iphone' | 'android' | 'tablet' | 'fluid';

export interface PreviewCanvasProps {
  preset?: CanvasViewportPreset | undefined;
  onPresetChange?: ((preset: CanvasViewportPreset) => void) | undefined;
  zoom?: number | undefined;
  onZoomChange?: ((zoom: number) => void) | undefined;
  canvasMode?: ('light' | 'dark' | 'dots') | undefined;
  onCanvasModeChange?: ((mode: 'light' | 'dark' | 'dots') => void) | undefined;
  appName?: string | undefined;
  category?: string | undefined;
  showSafeArea?: boolean | undefined;
  onToggleSafeArea?: (() => void) | undefined;
  onResetProps?: (() => void) | undefined;
  onEvent?: ((event: string, detail: string) => void) | undefined;
  lastEvent?: { name: string; detail: string; time: string } | null | undefined;
  targetFramework?: string | undefined;
  children: React.ReactNode;
  // Legacy backward compatibility
  device?: ('iphone' | 'android' | 'compact' | 'tablet') | undefined;
  isLandscape?: boolean | undefined;
  onRotate?: (() => void) | undefined;
}

export function PreviewCanvas({
  preset: controlledPreset,
  onPresetChange,
  zoom: controlledZoom,
  onZoomChange,
  canvasMode = 'dots',
  onCanvasModeChange,
  appName = 'Component Preview',
  category,
  showSafeArea: controlledShowSafeArea,
  onToggleSafeArea,
  onResetProps,
  onEvent,
  lastEvent,
  targetFramework = 'Dual NativeWind v4 & StyleSheet',
  children,
  // Legacy fallbacks
  device,
}: PreviewCanvasProps) {
  // Support both controlled and uncontrolled states
  const [internalPreset, setInternalPreset] = useState<CanvasViewportPreset>(
    device === 'tablet' ? 'tablet' : device === 'android' ? 'android' : 'fit'
  );
  const [internalZoom, setInternalZoom] = useState<number>(100);
  const [internalShowSafeArea, setInternalShowSafeArea] = useState<boolean>(false);

  const activePreset = controlledPreset ?? internalPreset;
  const activeZoom = controlledZoom ?? internalZoom;
  const activeShowSafeArea = controlledShowSafeArea ?? internalShowSafeArea;

  const handlePresetSelect = (newPreset: CanvasViewportPreset) => {
    if (onPresetChange) {
      onPresetChange(newPreset);
    } else {
      setInternalPreset(newPreset);
    }
    onEvent?.('PresetChange', `Switched viewport preset to ${newPreset}`);
  };

  const handleZoomSelect = (newZoom: number) => {
    if (onZoomChange) {
      onZoomChange(newZoom);
    } else {
      setInternalZoom(newZoom);
    }
    onEvent?.('ZoomChange', `Zoom adjusted to ${newZoom}%`);
  };

  const handleToggleSafeArea = () => {
    if (onToggleSafeArea) {
      onToggleSafeArea();
    } else {
      setInternalShowSafeArea((prev) => !prev);
    }
    onEvent?.('SafeAreaToggle', !activeShowSafeArea ? 'Enabled Safe Area overlay' : 'Disabled Safe Area overlay');
  };

  // Dimensions & styling per preset
  const getPresetConfig = () => {
    switch (activePreset) {
      case 'iphone':
        return {
          name: 'iPhone 16 Pro',
          label: '393 × 680',
          widthClass: 'w-[393px]',
          heightClass: 'h-[680px]',
          maxHeightStyle: '74vh',
          isPhone: true,
          platform: 'ios' as const,
        };
      case 'android':
        return {
          name: 'Pixel 8',
          label: '412 × 700',
          widthClass: 'w-[412px]',
          heightClass: 'h-[700px]',
          maxHeightStyle: '74vh',
          isPhone: true,
          platform: 'android' as const,
        };
      case 'tablet':
        return {
          name: 'Tablet',
          label: '640 × 520',
          widthClass: 'w-[640px]',
          heightClass: 'h-[520px]',
          maxHeightStyle: '74vh',
          isPhone: false,
          platform: 'tablet' as const,
        };
      case 'fluid':
        return {
          name: 'Fluid Stage',
          label: 'Responsive 100%',
          widthClass: 'w-full max-w-4xl',
          heightClass: 'min-h-[380px]',
          maxHeightStyle: '76vh',
          isPhone: false,
          platform: 'fluid' as const,
        };
      case 'fit':
      default:
        return {
          name: 'Adaptive Stage',
          label: 'Adaptive Fit',
          widthClass: 'w-full max-w-xl',
          heightClass: 'min-h-[280px]',
          maxHeightStyle: '74vh',
          isPhone: false,
          platform: 'fit' as const,
        };
    }
  };

  const presetConfig = getPresetConfig();

  // Canvas Stage Backgrounds
  const isLight = canvasMode === 'light';
  const stageBgClass = isLight
    ? 'bg-white text-zinc-900 border-zinc-200/90 shadow-xl shadow-zinc-900/10'
    : canvasMode === 'dark'
    ? 'bg-zinc-900 text-zinc-100 border-zinc-800 shadow-2xl shadow-black/80'
    : 'bg-zinc-900/95 text-zinc-100 border-zinc-800/90 backdrop-blur-md shadow-2xl shadow-black/60';

  const stageHeaderBgClass = isLight
    ? 'bg-zinc-50/90 border-b border-zinc-200/80 text-zinc-700'
    : 'bg-zinc-950/80 border-b border-zinc-800/80 text-zinc-300';

  return (
    <div className="relative flex-1 w-full h-full flex flex-col overflow-hidden select-none">
      {/* 1. Pro Integrated Canvas Header Toolbar */}
      <div className="flex h-12 shrink-0 items-center justify-between border-b border-zinc-800/80 bg-zinc-900/95 px-4 backdrop-blur z-20 gap-2">
        {/* Left: Component identifier */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-semibold text-zinc-100">{appName}</span>
          {category && (
            <span className="rounded-full bg-zinc-800/90 px-2 py-0.5 text-[10px] font-medium text-zinc-400 capitalize border border-zinc-700/50">
              {category}
            </span>
          )}
          <span className="hidden sm:inline-block text-[11px] font-mono text-zinc-500">
            {presetConfig.label}
          </span>
        </div>

        {/* Center: Stage Viewport Presets */}
        <div className="flex items-center gap-1 rounded-xl border border-zinc-800 bg-zinc-950/80 p-1 text-xs shadow-inner">
          <button
            type="button"
            onClick={() => handlePresetSelect('fit')}
            title="Adaptive Stage (Fit Component)"
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
              activePreset === 'fit'
                ? 'bg-zinc-800 text-sky-400 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Maximize2 className="h-3 w-3" />
            <span className="hidden md:inline">Adaptive</span>
            <span className="md:hidden">Fit</span>
          </button>

          <button
            type="button"
            onClick={() => handlePresetSelect('iphone')}
            title="iOS iPhone 16 Pro (393 × 680)"
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
              activePreset === 'iphone'
                ? 'bg-zinc-800 text-sky-400 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Smartphone className="h-3 w-3" />
            <span>iPhone</span>
          </button>

          <button
            type="button"
            onClick={() => handlePresetSelect('android')}
            title="Android Pixel 8 (412 × 700)"
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
              activePreset === 'android'
                ? 'bg-zinc-800 text-sky-400 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Smartphone className="h-3 w-3" />
            <span>Android</span>
          </button>

          <button
            type="button"
            onClick={() => handlePresetSelect('tablet')}
            title="Tablet Viewport (640 × 520)"
            className={`hidden lg:flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
              activePreset === 'tablet'
                ? 'bg-zinc-800 text-sky-400 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Tablet className="h-3 w-3" />
            <span>Tablet</span>
          </button>

          <button
            type="button"
            onClick={() => handlePresetSelect('fluid')}
            title="Fluid Responsive Canvas"
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
              activePreset === 'fluid'
                ? 'bg-zinc-800 text-sky-400 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Monitor className="h-3 w-3" />
            <span className="hidden sm:inline">Fluid</span>
          </button>
        </div>

        {/* Right: Stage Controls (Safe Area, Themes, Zoom, Reset) */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Safe Area Toggle on phone presets */}
          {presetConfig.isPhone && (
            <button
              type="button"
              onClick={handleToggleSafeArea}
              title="Toggle Safe Area Inset Overlay"
              className={`flex items-center gap-1 rounded-lg border px-2 py-1 text-xs font-medium transition-colors ${
                activeShowSafeArea
                  ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400'
                  : 'border-zinc-800 bg-zinc-950/60 text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Shield className="h-3 w-3" />
              <span className="hidden xl:inline text-[11px]">Safe Area</span>
            </button>
          )}

          {/* Canvas Mode Toggle */}
          {onCanvasModeChange && (
            <div className="flex items-center gap-0.5 rounded-lg border border-zinc-800 bg-zinc-950/80 p-0.5">
              <button
                type="button"
                onClick={() => onCanvasModeChange('light')}
                title="Light Canvas Stage"
                className={`p-1 rounded transition-colors ${
                  canvasMode === 'light' ? 'bg-zinc-800 text-amber-400' : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                <Sun className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onCanvasModeChange('dark')}
                title="Dark Canvas Stage"
                className={`p-1 rounded transition-colors ${
                  canvasMode === 'dark' ? 'bg-zinc-800 text-sky-400' : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                <Moon className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onCanvasModeChange('dots')}
                title="Dot Matrix Canvas Stage"
                className={`p-1 rounded transition-colors ${
                  canvasMode === 'dots' ? 'bg-zinc-800 text-emerald-400' : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                <Sparkles className="h-3.5 w-3.5" />
              </button>
            </div>
          )}

          {/* Zoom Buttons */}
          <div className="flex items-center gap-0.5 rounded-lg border border-zinc-800 bg-zinc-950/80 p-0.5">
            {[75, 100, 125].map((z) => (
              <button
                key={z}
                type="button"
                onClick={() => handleZoomSelect(z)}
                className={`rounded px-1.5 py-0.5 text-[10px] font-mono transition-colors ${
                  activeZoom === z ? 'bg-zinc-800 text-sky-400 font-bold' : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {z}%
              </button>
            ))}
          </div>

          {/* Reset Props */}
          {onResetProps && (
            <button
              type="button"
              onClick={onResetProps}
              title="Reset component props to defaults"
              className="rounded-lg border border-zinc-800 bg-zinc-950/80 p-1.5 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* 2. Scrollable Workbench Workspace */}
      <div className="flex-1 w-full overflow-auto p-4 sm:p-8 flex flex-col items-center justify-start">
        <div
          style={{
            transform: `scale(${activeZoom / 100})`,
            transformOrigin: 'top center',
          }}
          className="my-auto w-full flex flex-col items-center justify-center transition-transform duration-150 ease-out py-2"
        >
          {/* Stage Artboard Container */}
          <div
            style={{
              maxHeight: presetConfig.maxHeightStyle,
            }}
            className={`relative flex flex-col rounded-2xl border ${stageBgClass} ${presetConfig.widthClass} ${presetConfig.heightClass} transition-all duration-200 overflow-hidden`}
          >
            {/* Stage Window Header */}
            <div
              className={`flex h-9 shrink-0 items-center justify-between px-3.5 select-none z-20 ${stageHeaderBgClass}`}
            >
              {/* Traffic Light Dots */}
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
              </div>

              {/* Title & Dimension */}
              <div className="flex items-center gap-2 text-xs">
                <span className="font-semibold">{appName}</span>
                <span className="rounded bg-zinc-800/40 dark:bg-zinc-800 px-1.5 py-0.5 text-[10px] font-mono text-zinc-400">
                  {presetConfig.label}
                </span>
              </div>

              <div className="flex items-center gap-1 text-[10px] font-mono text-zinc-400">
                <span>RN Preview</span>
              </div>
            </div>

            {/* Simulated Phone Status Bar for iOS */}
            {activePreset === 'iphone' && (
              <div className="flex h-7 shrink-0 items-center justify-between px-5 text-[11px] font-semibold text-zinc-800 dark:text-zinc-200 border-b border-zinc-200/40 dark:border-zinc-800/40 bg-zinc-100/50 dark:bg-zinc-950/40 select-none">
                <span>9:41</span>
                {/* Dynamic Island */}
                <div className="h-4 w-20 rounded-full bg-black flex items-center justify-center">
                  <div className="h-1.5 w-1.5 rounded-full bg-zinc-700 mr-2" />
                  <div className="h-1.5 w-1.5 rounded-full bg-indigo-500/70" />
                </div>
                <div className="flex items-center gap-1.5 text-xs text-zinc-600 dark:text-zinc-300">
                  <Wifi className="h-3 w-3" />
                  <Battery className="h-3.5 w-3.5" />
                </div>
              </div>
            )}

            {/* Simulated Phone Status Bar for Android */}
            {activePreset === 'android' && (
              <div className="flex h-7 shrink-0 items-center justify-between px-5 text-[11px] font-medium text-zinc-800 dark:text-zinc-200 border-b border-zinc-200/40 dark:border-zinc-800/40 bg-zinc-100/50 dark:bg-zinc-950/40 select-none">
                <span>10:00</span>
                {/* Punch Hole Camera */}
                <div className="h-3 w-3 rounded-full bg-black shadow-inner" />
                <div className="flex items-center gap-1.5 text-xs text-zinc-600 dark:text-zinc-300">
                  <Wifi className="h-3 w-3" />
                  <span className="text-[10px] font-mono">100%</span>
                  <Battery className="h-3.5 w-3.5" />
                </div>
              </div>
            )}

            {/* Stage Interactive Viewport Body */}
            <div className="relative flex-1 w-full flex flex-col items-center justify-center p-6 sm:p-10 overflow-y-auto">
              {/* Optional Safe Area Overlay Guide */}
              {activeShowSafeArea && presetConfig.isPhone && (
                <div className="absolute inset-x-3 inset-y-2 pointer-events-none border border-dashed border-emerald-500/50 rounded-xl z-30 flex flex-col justify-between p-2">
                  <span className="self-center bg-emerald-500/20 text-emerald-400 text-[9px] font-mono px-1.5 py-0.5 rounded">
                    Top Safe Area Inset
                  </span>
                  <span className="self-center bg-emerald-500/20 text-emerald-400 text-[9px] font-mono px-1.5 py-0.5 rounded">
                    Bottom Safe Area Inset
                  </span>
                </div>
              )}

              {/* Component Rendering */}
              {children}
            </div>

            {/* Simulated Mobile Bottom Home Indicator */}
            {activePreset === 'iphone' && (
              <div className="flex h-5 shrink-0 items-center justify-center bg-transparent select-none pb-1">
                <div className="h-1 w-28 rounded-full bg-zinc-400/50 dark:bg-zinc-600/60" />
              </div>
            )}
            {activePreset === 'android' && (
              <div className="flex h-5 shrink-0 items-center justify-center bg-transparent select-none pb-1">
                <div className="h-1 w-20 rounded-full bg-zinc-400/40 dark:bg-zinc-600/50" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. Sleek Single Docked Bottom Status Bar */}
      <div className="flex h-9 shrink-0 items-center justify-between border-t border-zinc-800/80 bg-zinc-900/95 px-4 text-xs text-zinc-400 backdrop-blur z-20">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-emerald-400" />
          <span className="font-medium text-zinc-300">{targetFramework}</span>
          <span className="text-zinc-600">•</span>
          <span className="text-zinc-500 font-mono text-[11px]">{presetConfig.name}</span>
        </div>

        <div className="hidden md:flex items-center gap-1.5 text-[11px]">
          {lastEvent ? (
            <span className="inline-flex items-center gap-1 rounded bg-zinc-800/80 px-2 py-0.5 text-sky-400 font-mono border border-zinc-700/50">
              <Activity className="h-3 w-3" />
              <span>
                {lastEvent.name}: {lastEvent.detail}
              </span>
            </span>
          ) : (
            <span className="text-zinc-500">Interactive Visual Canvas • Real-time props reactive</span>
          )}
        </div>

        <div className="flex items-center gap-2 text-[11px] text-zinc-500">
          <Layers className="h-3 w-3" />
          <span>React Native 0.76+ • Expo</span>
        </div>
      </div>
    </div>
  );
}
