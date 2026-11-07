'use client';

import React from 'react';
import { RotateCw, Layers } from 'lucide-react';

export interface PreviewCanvasProps {
  device?: 'iphone' | 'android' | 'compact' | 'tablet';
  isLandscape?: boolean;
  zoom?: number;
  children: React.ReactNode;
  canvasMode?: 'light' | 'dark' | 'dots';
  appName?: string;
  onEvent?: (event: string, detail: string) => void;
  onRotate?: () => void;
}

const VIEWPORT_SPECS = {
  iphone: { name: 'Mobile', width: 393, minHeight: 740, label: '393 × 740' },
  android: { name: 'Android', width: 412, minHeight: 780, label: '412 × 780' },
  compact: { name: 'Compact', width: 360, minHeight: 660, label: '360 × 660' },
  tablet: { name: 'Tablet', width: 768, minHeight: 820, label: '768 × 820' },
};

export function PreviewCanvas({
  device = 'iphone',
  isLandscape = false,
  zoom = 100,
  children,
  canvasMode = 'dots',
  appName = 'Component Preview',
  onEvent,
  onRotate,
}: PreviewCanvasProps) {
  const spec = VIEWPORT_SPECS[device] ?? VIEWPORT_SPECS.iphone;
  const targetWidth = isLandscape ? spec.minHeight : spec.width;
  const targetHeight = isLandscape ? spec.width : spec.minHeight;

  const getViewportBg = () => {
    if (canvasMode === 'dark') {
      return 'bg-zinc-900 text-zinc-100';
    }
    return 'bg-white text-zinc-900';
  };

  return (
    <div className="relative flex flex-col items-center justify-center p-6 w-full">
      {/* Canvas Viewport Frame */}
      <div
        style={{
          width: `${targetWidth}px`,
          minHeight: `${targetHeight}px`,
          transform: `scale(${zoom / 100})`,
          transformOrigin: 'top center',
        }}
        className="relative flex flex-col rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xl shadow-black/20 dark:shadow-black/60 transition-all duration-300 overflow-hidden"
      >
        {/* Minimal Clean Canvas Top Bar */}
        <div className="flex h-10 shrink-0 items-center justify-between border-b border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/80 dark:bg-zinc-900/90 px-4 backdrop-blur select-none z-20">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
              {appName}
            </span>
            <span className="rounded bg-zinc-200/60 dark:bg-zinc-800 px-1.5 py-0.5 text-[10px] font-mono text-zinc-500 dark:text-zinc-400">
              {isLandscape ? `${targetWidth} × ${targetHeight}` : spec.label}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-zinc-400">
            {onRotate && (
              <button
                type="button"
                onClick={() => {
                  onRotate();
                  onEvent?.('Orientation', isLandscape ? 'Switched to Portrait' : 'Switched to Landscape');
                }}
                title="Rotate Orientation"
                className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-200/50 dark:hover:bg-zinc-800 hover:text-zinc-200 transition-colors"
              >
                <RotateCw className="h-3.5 w-3.5" />
              </button>
            )}
            <span className="text-[10px] text-zinc-400 uppercase tracking-wider font-mono">
              RN Preview
            </span>
          </div>
        </div>

        {/* Viewport Content Area */}
        <div className={`flex-1 w-full flex flex-col items-center justify-center p-6 overflow-y-auto relative ${getViewportBg()}`}>
          {children}
        </div>

        {/* Minimal Canvas Bottom Status Bar */}
        <div className="flex h-7 shrink-0 items-center justify-between border-t border-zinc-100 dark:border-zinc-800/60 bg-zinc-50/50 dark:bg-zinc-900/40 px-4 text-[10px] text-zinc-400 select-none">
          <div className="flex items-center gap-2">
            <Layers className="h-3 w-3 text-zinc-400" />
            <span>Interactive Visual Canvas</span>
          </div>
          <span className="font-mono text-zinc-500">Dual NativeWind v4 & StyleSheet</span>
        </div>
      </div>
    </div>
  );
}
