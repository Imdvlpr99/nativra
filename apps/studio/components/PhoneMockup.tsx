'use client';

import React from 'react';

interface PhoneMockupProps {
  device: 'iphone' | 'android' | 'compact' | 'tablet';
  isLandscape: boolean;
  zoom: number;
  children: React.ReactNode;
  canvasMode: 'light' | 'dark' | 'dots';
}

const DEVICE_SPECS = {
  iphone: {
    width: 393,
    height: 852,
    bezalSize: 12,
    cornerRadius: 48,
    notchWidth: 170,
    notchHeight: 28,
    statusBarHeight: 16,
    homeIndicatorHeight: 24,
  },
  android: {
    width: 412,
    height: 915,
    bezalSize: 8,
    cornerRadius: 32,
    notchWidth: 100,
    notchHeight: 24,
    statusBarHeight: 24,
    homeIndicatorHeight: 16,
  },
  compact: {
    width: 360,
    height: 720,
    bezalSize: 6,
    cornerRadius: 24,
    notchWidth: 120,
    notchHeight: 20,
    statusBarHeight: 16,
    homeIndicatorHeight: 20,
  },
  tablet: {
    width: 768,
    height: 1024,
    bezalSize: 16,
    cornerRadius: 32,
    notchWidth: 0,
    notchHeight: 0,
    statusBarHeight: 20,
    homeIndicatorHeight: 0,
  },
};

export function PhoneMockup({
  device,
  isLandscape,
  zoom,
  children,
  canvasMode,
}: PhoneMockupProps) {
  const spec = DEVICE_SPECS[device];
  const [displayWidth, displayHeight] = isLandscape
    ? [spec.height, spec.width]
    : [spec.width, spec.height];

  const scaledWidth = (displayWidth * zoom) / 100;
  const scaledHeight = (displayHeight * zoom) / 100;

  const getBgPattern = () => {
    switch (canvasMode) {
      case 'light':
        return 'bg-white';
      case 'dark':
        return 'bg-zinc-950';
      case 'dots':
        return 'bg-zinc-50 bg-dot-grid-light dark:bg-zinc-900 dark:bg-dot-grid';
    }
  };

  return (
    <div className="flex items-center justify-center p-8">
      <div
        style={{
          width: `${scaledWidth + spec.bezalSize * 2}px`,
          height: `${scaledHeight + spec.bezalSize * 2}px`,
          borderRadius: `${(spec.cornerRadius * scaledWidth) / displayWidth}px`,
        }}
        className="relative phone-shadow bg-black overflow-hidden"
      >
        {/* Bezel */}
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-800 to-zinc-900" />

        {/* Screen */}
        <div
          style={{
            top: `${spec.bezalSize}px`,
            left: `${spec.bezalSize}px`,
            width: `${scaledWidth}px`,
            height: `${scaledHeight}px`,
            borderRadius: `${(spec.cornerRadius * scaledWidth) / displayWidth - 4}px`,
          }}
          className={`absolute overflow-hidden ${getBgPattern()}`}
        >
          {/* Notch (iOS style) */}
          {spec.notchWidth > 0 && (
            <div
              style={{
                width: `${(spec.notchWidth * scaledWidth) / displayWidth}px`,
                height: `${(spec.notchHeight * scaledHeight) / displayHeight}px`,
                borderRadius: `0 0 ${(12 * scaledWidth) / displayWidth}px ${(12 * scaledWidth) / displayWidth}px`,
              }}
              className="phone-notch absolute top-0 left-1/2 -translate-x-1/2 z-50"
            />
          )}

          {/* Status Bar */}
          <div
            style={{
              height: `${(spec.statusBarHeight * scaledHeight) / displayHeight}px`,
            }}
            className="relative bg-white/5 backdrop-blur-sm border-b border-white/10"
          >
            <div className="flex items-center justify-between px-3 h-full text-[6px] font-medium text-white/70">
              <span>9:41</span>
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-white/70" />
                <div className="w-1.5 h-1.5 rounded-full bg-white/70" />
                <div className="w-1.5 h-1.5 rounded-full bg-white/70" />
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div
            style={{
              height: `calc(100% - ${(spec.statusBarHeight * scaledHeight) / displayHeight}px - ${
                spec.homeIndicatorHeight > 0 ? (spec.homeIndicatorHeight * scaledHeight) / displayHeight : 0
              }px)`,
              fontSize: `${Math.max(8, (scaledWidth / displayWidth) * 14)}px`,
            }}
            className="overflow-y-auto overflow-x-hidden"
          >
            {children}
          </div>

          {/* Home Indicator */}
          {spec.homeIndicatorHeight > 0 && (
            <div
              style={{
                height: `${(spec.homeIndicatorHeight * scaledHeight) / displayHeight}px`,
              }}
              className="flex items-center justify-center bg-white/5 backdrop-blur-sm border-t border-white/10"
            >
              <div
                style={{
                  width: `${(100 * scaledWidth) / displayWidth}px`,
                  height: '3px',
                }}
                className="rounded-full bg-white/60"
              />
            </div>
          )}
        </div>

        {/* Reflective glass effect */}
        <div className="absolute inset-0 rounded-full pointer-events-none opacity-10 bg-gradient-to-br from-white to-transparent" />
      </div>
    </div>
  );
}
