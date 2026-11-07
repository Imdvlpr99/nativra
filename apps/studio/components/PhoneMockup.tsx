'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Wifi,
  Lock,
  Bell,
  BellOff,
  ChevronLeft,
  MoreHorizontal,
  Camera,
  Flashlight,
  Volume2,
  VolumeX,
  Keyboard,
  Globe,
  Delete,
  Music,
} from 'lucide-react';

export interface PhoneMockupProps {
  device?: 'iphone' | 'android' | 'compact' | 'tablet';
  isLandscape?: boolean;
  zoom?: number;
  children: React.ReactNode;
  canvasMode?: 'light' | 'dark' | 'dots';
  appName?: string;
  themePrimary?: string;
  onEvent?: (event: string, detail: string) => void;
  showKeyboardToggle?: boolean;
}

const DEVICE_CONFIGS = {
  iphone: {
    name: 'iPhone 16 Pro',
    width: 393,
    height: 852,
    bezelSize: 12,
    cornerRadius: 52,
    hasDynamicIsland: true,
    hasPunchHole: false,
    notchWidth: 124,
    notchHeight: 34,
    hasActionBtn: true,
  },
  android: {
    name: 'Pixel 8 Pro',
    width: 412,
    height: 890,
    bezelSize: 9,
    cornerRadius: 38,
    hasDynamicIsland: false,
    hasPunchHole: true,
    notchWidth: 0,
    notchHeight: 0,
    hasActionBtn: false,
  },
  compact: {
    name: 'Compact Mobile',
    width: 360,
    height: 740,
    bezelSize: 10,
    cornerRadius: 42,
    hasDynamicIsland: true,
    hasPunchHole: false,
    notchWidth: 110,
    notchHeight: 30,
    hasActionBtn: true,
  },
  tablet: {
    name: 'iPad Pro',
    width: 660,
    height: 880,
    bezelSize: 14,
    cornerRadius: 32,
    hasDynamicIsland: false,
    hasPunchHole: false,
    notchWidth: 0,
    notchHeight: 0,
    hasActionBtn: false,
  },
};

export function PhoneMockup({
  device = 'iphone',
  isLandscape = false,
  zoom = 100,
  children,
  canvasMode = 'dots',
  appName = 'Nativra Mobile',
  themePrimary = '#18181b',
  onEvent,
  showKeyboardToggle = true,
}: PhoneMockupProps) {
  const config = DEVICE_CONFIGS[device] ?? DEVICE_CONFIGS.iphone;
  const [displayWidth, displayHeight] = isLandscape
    ? [config.height, config.width]
    : [config.width, config.height];

  // Hardware states
  const [isLocked, setIsLocked] = useState(false);
  const [volume, setVolume] = useState(75);
  const [showVolumeHud, setShowVolumeHud] = useState(false);
  const [silentMode, setSilentMode] = useState(false);
  const [showSilentHud, setShowSilentHud] = useState(false);
  const [dynamicIslandExpanded, setDynamicIslandExpanded] = useState(false);
  const [showVirtualKeyboard, setShowVirtualKeyboard] = useState(false);
  const [keyboardShift, setKeyboardShift] = useState(false);
  const [homeIndicatorPressed, setHomeIndicatorPressed] = useState(false);

  // Live real clock
  const [timeString, setTimeString] = useState('9:41');
  const [dateString, setDateString] = useState('Wednesday, Sep 18');

  const volumeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const silentTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeString(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
      );
      setDateString(
        now.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Volume HUD handler
  const handleVolumeChange = (delta: number) => {
    setVolume((prev) => {
      const next = Math.max(0, Math.min(100, prev + delta));
      onEvent?.('Volume', `Adjusted volume to ${next}%`);
      return next;
    });
    setShowVolumeHud(true);
    if (volumeTimeoutRef.current) clearTimeout(volumeTimeoutRef.current);
    volumeTimeoutRef.current = setTimeout(() => setShowVolumeHud(false), 2200);
  };

  // Action button handler
  const handleActionClick = () => {
    setSilentMode((prev) => {
      const next = !prev;
      onEvent?.('Action Button', `Silent mode: ${next ? 'ON' : 'OFF'}`);
      return next;
    });
    setShowSilentHud(true);
    if (silentTimeoutRef.current) clearTimeout(silentTimeoutRef.current);
    silentTimeoutRef.current = setTimeout(() => setShowSilentHud(false), 2400);
  };

  // Power / Lock toggle
  const handlePowerToggle = () => {
    setIsLocked((prev) => {
      const next = !prev;
      onEvent?.('Power Button', next ? 'Device locked (Sleep mode)' : 'Device unlocked (Awake)');
      return next;
    });
  };

  // Dynamic Island click
  const toggleDynamicIsland = () => {
    setDynamicIslandExpanded((prev) => {
      const next = !prev;
      onEvent?.('Dynamic Island', next ? 'Expanded live capsule' : 'Collapsed capsule');
      return next;
    });
  };

  // QWERTY Key Rows
  const keyRows = [
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
    ['shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'backspace'],
  ];

  return (
    <div className="relative flex flex-col items-center justify-center p-4">
      {/* Outer Hardware Chassis Wrapper */}
      <div
        style={{
          width: `${displayWidth + config.bezelSize * 2}px`,
          height: `${displayHeight + config.bezelSize * 2}px`,
          transform: `scale(${zoom / 100})`,
          transformOrigin: 'center center',
        }}
        className="relative select-none transition-transform duration-200"
      >
        {/* ================= PHYSICAL SIDE HARDWARE BUTTONS ================= */}
        {!isLandscape && (
          <>
            {/* LEFT SIDE: Action Button (iPhone only) */}
            {config.hasActionBtn && (
              <button
                type="button"
                onClick={handleActionClick}
                title="Action Button (Toggle Silent)"
                style={{ top: '96px', left: '-5px', width: '6px', height: '30px' }}
                className="absolute z-10 rounded-l-md hardware-button-left transition-transform active:translate-x-0.5 hover:brightness-125 focus:outline-none"
              />
            )}

            {/* LEFT SIDE: Volume Up */}
            <button
              type="button"
              onClick={() => handleVolumeChange(10)}
              title="Volume Up"
              style={{
                top: config.hasActionBtn ? '146px' : '108px',
                left: '-5px',
                width: '6px',
                height: '54px',
              }}
              className="absolute z-10 rounded-l-md hardware-button-left transition-transform active:translate-x-0.5 hover:brightness-125 focus:outline-none"
            />

            {/* LEFT SIDE: Volume Down */}
            <button
              type="button"
              onClick={() => handleVolumeChange(-10)}
              title="Volume Down"
              style={{
                top: config.hasActionBtn ? '214px' : '176px',
                left: '-5px',
                width: '6px',
                height: '54px',
              }}
              className="absolute z-10 rounded-l-md hardware-button-left transition-transform active:translate-x-0.5 hover:brightness-125 focus:outline-none"
            />

            {/* RIGHT SIDE: Power / Sleep Button */}
            <button
              type="button"
              onClick={handlePowerToggle}
              title={isLocked ? 'Wake Device' : 'Lock Device (Power)'}
              style={{ top: '160px', right: '-5px', width: '6px', height: '76px' }}
              className="absolute z-10 rounded-r-md hardware-button-right transition-transform active:-translate-x-0.5 hover:brightness-125 focus:outline-none"
            />
          </>
        )}

        {/* ================= TITANIUM BEZEL CHASSIS ================= */}
        <div
          style={{
            borderRadius: `${config.cornerRadius + 4}px`,
          }}
          className="relative h-full w-full titanium-chassis bg-gradient-to-b from-zinc-800 via-zinc-900 to-zinc-950 p-[3px] border border-zinc-700/60"
        >
          {/* Subtle Outer Titanium Rim Highlight */}
          <div
            style={{ borderRadius: `${config.cornerRadius + 2}px` }}
            className="absolute inset-[1px] pointer-events-none ring-1 ring-inset ring-white/10"
          />

          {/* Antenna Breaks (Top, Bottom, Sides) */}
          {!isLandscape && (
            <>
              <div
                style={{ top: '65px', left: '-3px' }}
                className="absolute h-1.5 w-1 rounded-l-sm antenna-band"
              />
              <div
                style={{ top: '65px', right: '-3px' }}
                className="absolute h-1.5 w-1 rounded-r-sm antenna-band"
              />
              <div
                style={{ bottom: '90px', left: '-3px' }}
                className="absolute h-1.5 w-1 rounded-l-sm antenna-band"
              />
              <div
                style={{ bottom: '90px', right: '-3px' }}
                className="absolute h-1.5 w-1 rounded-r-sm antenna-band"
              />
            </>
          )}

          {/* Micro Laser-Etched Ear Speaker Slit (Top Bezel) */}
          <div
            style={{ top: `${Math.max(4, config.bezelSize / 2 - 2)}px` }}
            className="absolute left-1/2 -translate-x-1/2 z-30 h-[3px] w-14 rounded-full bg-zinc-950 ring-1 ring-zinc-800/80"
          />

          {/* ================= INNER OLED SCREEN ================= */}
          <div
            style={{
              borderRadius: `${config.cornerRadius}px`,
            }}
            className="relative h-full w-full overflow-hidden bg-white text-zinc-900 shadow-inner flex flex-col"
          >
            {/* Specular Diagonal Glass Sheen */}
            <div className="absolute inset-0 pointer-events-none z-40 screen-sheen" />

            {/* ================= VOLUME SLIDER HUD ================= */}
            {showVolumeHud && (
              <div className="absolute left-2.5 top-36 z-50 flex items-center gap-2 rounded-2xl bg-zinc-900/90 p-2.5 text-white shadow-2xl backdrop-blur-md border border-white/10 animate-in fade-in slide-in-from-left duration-200">
                {volume === 0 ? (
                  <VolumeX className="h-4 w-4 text-zinc-400" />
                ) : (
                  <Volume2 className="h-4 w-4 text-zinc-300" />
                )}
                <div className="h-20 w-2.5 rounded-full bg-zinc-700/80 overflow-hidden relative flex flex-col justify-end">
                  <div
                    style={{ height: `${volume}%` }}
                    className="w-full bg-white rounded-full transition-all duration-100"
                  />
                </div>
              </div>
            )}

            {/* ================= SILENT MODE HUD ================= */}
            {showSilentHud && (
              <div className="absolute top-12 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-full bg-zinc-900/90 px-4 py-1.5 text-xs text-white shadow-2xl backdrop-blur-md border border-white/10 animate-in fade-in slide-in-from-top duration-200">
                {silentMode ? (
                  <>
                    <BellOff className="h-3.5 w-3.5 text-red-400" />
                    <span className="font-medium text-red-300">Silent Mode On</span>
                  </>
                ) : (
                  <>
                    <Bell className="h-3.5 w-3.5 text-zinc-300" />
                    <span className="font-medium text-zinc-200">Silent Mode Off</span>
                  </>
                )}
              </div>
            )}

            {/* ================= LOCKED / ALWAYS-ON DISPLAY MODE ================= */}
            {isLocked ? (
              <div
                onClick={() => setIsLocked(false)}
                className="relative h-full w-full flex flex-col justify-between items-center bg-black text-white p-6 cursor-pointer select-none"
              >
                {/* Lock Screen Header */}
                <div className="flex flex-col items-center mt-12 space-y-2">
                  <Lock className="h-4 w-4 text-zinc-400 animate-pulse" />
                  <span className="text-xs font-medium text-zinc-400 tracking-wide">
                    {dateString}
                  </span>
                  <h1 className="text-7xl font-extralight tracking-tight text-white/95">
                    {timeString}
                  </h1>
                </div>

                {/* Lock Screen Live Widget */}
                <div className="w-full max-w-[280px] rounded-2xl bg-zinc-900/70 p-3.5 border border-zinc-800/80 backdrop-blur">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-lg bg-zinc-800 flex items-center justify-center text-xs font-bold text-white border border-zinc-700">
                        N
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-zinc-200">{appName}</p>
                        <p className="text-[10px] text-zinc-400">Interactive Preview Active</p>
                      </div>
                    </div>
                    <span className="text-[10px] text-zinc-500 font-mono">Now</span>
                  </div>
                </div>

                {/* Bottom Lock Screen Actions */}
                <div className="w-full flex items-center justify-between px-4 pb-4">
                  <div className="h-10 w-10 rounded-full bg-zinc-900/80 border border-zinc-800 flex items-center justify-center text-zinc-300">
                    <Flashlight className="h-4 w-4" />
                  </div>

                  <div className="flex flex-col items-center gap-1">
                    <span className="text-[10px] text-zinc-500 tracking-wider font-medium">
                      TAP TO WAKE
                    </span>
                    <div className="h-1 w-28 rounded-full bg-zinc-600/60" />
                  </div>

                  <div className="h-10 w-10 rounded-full bg-zinc-900/80 border border-zinc-800 flex items-center justify-center text-zinc-300">
                    <Camera className="h-4 w-4" />
                  </div>
                </div>
              </div>
            ) : (
              /* ================= ACTIVE AWAKE DISPLAY MODE ================= */
              <div className="flex-1 flex flex-col h-full overflow-hidden">
                {/* 1. TOP STATUS BAR */}
                <div className="relative flex h-11 shrink-0 items-center justify-between px-6 bg-transparent select-none z-30 font-medium text-xs">
                  {/* Left: Clock */}
                  <span className="font-semibold tracking-tight text-zinc-900 text-[13px]">
                    {timeString}
                  </span>

                  {/* Center: Dynamic Island or Android Punch Hole */}
                  {config.hasDynamicIsland ? (
                    <div
                      onClick={toggleDynamicIsland}
                      title="Click to toggle Dynamic Island preview"
                      style={{
                        width: dynamicIslandExpanded ? '230px' : '118px',
                        height: dynamicIslandExpanded ? '44px' : '30px',
                      }}
                      className="absolute left-1/2 -translate-x-1/2 top-2 flex items-center justify-between px-3 rounded-full bg-black text-white cursor-pointer shadow-lg transition-all duration-300 ease-out z-40 group"
                    >
                      {dynamicIslandExpanded ? (
                        <div className="flex items-center justify-between w-full px-1">
                          <div className="flex items-center gap-1.5">
                            <div className="h-6 w-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                              <Music className="h-3.5 w-3.5 animate-pulse" />
                            </div>
                            <div>
                              <p className="text-[10px] font-semibold text-zinc-200">
                                Nativra Studio
                              </p>
                              <p className="text-[8px] text-zinc-400">120 FPS React Native</p>
                            </div>
                          </div>
                          {/* Mini visualizer bars */}
                          <div className="flex items-center gap-0.5">
                            <span className="h-3 w-0.5 rounded-full bg-emerald-400 animate-pulse" />
                            <span className="h-4 w-0.5 rounded-full bg-emerald-400 animate-pulse delay-75" />
                            <span className="h-2 w-0.5 rounded-full bg-emerald-400 animate-pulse delay-150" />
                          </div>
                        </div>
                      ) : (
                        <>
                          {/* Face ID / Ambient Light Sensor Aperture */}
                          <div className="h-2.5 w-2.5 rounded-full bg-zinc-950 border border-zinc-900/60" />

                          {/* Interactive subtle dot */}
                          <div className="h-1.5 w-1.5 rounded-full bg-emerald-500/80 animate-pulse group-hover:scale-125 transition-transform" />

                          {/* True Camera Lens with Anti-Reflective Glare */}
                          <div className="relative h-3 w-3 rounded-full camera-lens-glare ring-1 ring-zinc-800 flex items-center justify-center">
                            <div className="h-1 w-1 rounded-full bg-sky-300/60 blur-[0.3px]" />
                          </div>
                        </>
                      )}
                    </div>
                  ) : config.hasPunchHole ? (
                    <div className="absolute left-1/2 -translate-x-1/2 top-2.5 h-3.5 w-3.5 rounded-full camera-lens-glare ring-1 ring-zinc-800 flex items-center justify-center z-40">
                      <div className="h-1 w-1 rounded-full bg-sky-300/70" />
                    </div>
                  ) : null}

                  {/* Right: Cellular, WiFi, and Battery */}
                  <div className="flex items-center gap-1.5 text-zinc-900">
                    {/* 4-bar cellular signal */}
                    <div className="flex items-end gap-0.5 h-2.5">
                      <span className="w-0.5 h-1 bg-zinc-900 rounded-2xs" />
                      <span className="w-0.5 h-1.5 bg-zinc-900 rounded-2xs" />
                      <span className="w-0.5 h-2 bg-zinc-900 rounded-2xs" />
                      <span className="w-0.5 h-2.5 bg-zinc-900 rounded-2xs" />
                    </div>

                    <span className="text-[10px] font-bold tracking-tight">5G</span>

                    <Wifi className="h-3 w-3 text-zinc-900 stroke-[2.5]" />

                    {/* Battery Pill */}
                    <div className="flex items-center gap-0.5">
                      <div className="relative h-3 w-5 rounded-[4px] border-[1.2px] border-zinc-900 p-[1.5px] flex items-center">
                        <div className="h-full w-3.5 rounded-[1.5px] bg-zinc-900" />
                      </div>
                      <div className="h-1.5 w-[1.5px] rounded-r-xs bg-zinc-900" />
                    </div>
                  </div>
                </div>

                {/* 2. OPTIONAL NATIVE APP HEADER */}
                <div className="flex h-10 shrink-0 items-center justify-between border-b border-zinc-100 bg-white/95 px-4 backdrop-blur-sm z-20">
                  <div className="flex items-center gap-1 text-zinc-700 hover:text-zinc-900 cursor-pointer">
                    <ChevronLeft className="h-4 w-4" />
                    <span className="text-xs font-medium">Catalog</span>
                  </div>

                  <span className="text-xs font-semibold text-zinc-900 truncate max-w-[150px]">
                    {appName}
                  </span>

                  <div className="flex items-center gap-2">
                    {showKeyboardToggle && (
                      <button
                        type="button"
                        onClick={() => {
                          setShowVirtualKeyboard(!showVirtualKeyboard);
                          onEvent?.(
                            'Virtual Keyboard',
                            showVirtualKeyboard ? 'Keyboard hidden' : 'Keyboard displayed'
                          );
                        }}
                        title="Toggle iOS Virtual Keyboard"
                        className={`p-1 rounded transition-colors ${
                          showVirtualKeyboard
                            ? 'bg-zinc-100 text-sky-600'
                            : 'text-zinc-400 hover:text-zinc-700'
                        }`}
                      >
                        <Keyboard className="h-3.5 w-3.5" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => onEvent?.('Action Menu', 'Navigation action menu clicked')}
                      className="text-zinc-400 hover:text-zinc-700"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* 3. SCROLLABLE APP VIEWPORT */}
                <div
                  style={{
                    backgroundColor: canvasMode === 'dark' ? '#09090b' : '#ffffff',
                  }}
                  className="flex-1 overflow-y-auto px-4 py-5 flex flex-col items-center justify-start relative text-zinc-900"
                >
                  <div className="w-full flex flex-col items-center justify-center my-auto">
                    {children}
                  </div>
                </div>

                {/* 4. SIMULATED iOS VIRTUAL KEYBOARD (SLIDES UP) */}
                {showVirtualKeyboard && (
                  <div className="w-full bg-zinc-200/95 border-t border-zinc-300 p-1.5 shadow-2xl backdrop-blur-md z-30 animate-in slide-in-from-bottom duration-200 select-none">
                    {/* Keyboard suggestions bar */}
                    <div className="flex items-center justify-around py-1 text-xs text-zinc-600 border-b border-zinc-300/80 mb-1">
                      <span className="cursor-pointer hover:text-zinc-900">"nativra"</span>
                      <span className="cursor-pointer font-medium text-zinc-900">"ready"</span>
                      <span className="cursor-pointer hover:text-zinc-900">"mobile"</span>
                    </div>

                    {/* QWERTY Rows */}
                    <div className="space-y-1">
                      {keyRows.map((row, rIdx) => (
                        <div key={rIdx} className="flex justify-center gap-1">
                          {row.map((k) => {
                            if (k === 'shift') {
                              return (
                                <button
                                  key={k}
                                  type="button"
                                  onClick={() => setKeyboardShift(!keyboardShift)}
                                  className={`h-9 w-9 rounded-md flex items-center justify-center text-xs font-semibold shadow-sm transition-transform active:scale-95 ${
                                    keyboardShift
                                      ? 'bg-white text-sky-600'
                                      : 'bg-zinc-300 text-zinc-700'
                                  }`}
                                >
                                  ⇧
                                </button>
                              );
                            }
                            if (k === 'backspace') {
                              return (
                                <button
                                  key={k}
                                  type="button"
                                  onClick={() => onEvent?.('Keyboard', 'Backspace')}
                                  className="h-9 w-9 rounded-md bg-zinc-300 text-zinc-700 flex items-center justify-center shadow-sm transition-transform active:scale-95"
                                >
                                  <Delete className="h-4 w-4" />
                                </button>
                              );
                            }
                            const letter = keyboardShift ? k.toUpperCase() : k;
                            return (
                              <button
                                key={k}
                                type="button"
                                onClick={() => onEvent?.('Keyboard Input', `Typed "${letter}"`)}
                                className="h-9 min-w-[28px] flex-1 max-w-[34px] rounded-md bg-white text-zinc-900 font-medium text-sm flex items-center justify-center shadow-sm transition-transform active:scale-90 active:bg-zinc-100"
                              >
                                {letter}
                              </button>
                            );
                          })}
                        </div>
                      ))}

                      {/* Space & Action row */}
                      <div className="flex items-center justify-between gap-1 pt-0.5">
                        <button
                          type="button"
                          className="h-9 px-2 rounded-md bg-zinc-300 text-zinc-700 text-xs font-medium"
                        >
                          123
                        </button>
                        <button
                          type="button"
                          className="h-9 w-9 rounded-md bg-zinc-300 text-zinc-700 flex items-center justify-center"
                        >
                          <Globe className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onEvent?.('Keyboard Input', 'Space')}
                          className="h-9 flex-1 rounded-md bg-white text-xs font-medium text-zinc-700 shadow-sm active:bg-zinc-100"
                        >
                          space
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowVirtualKeyboard(false);
                            onEvent?.('Keyboard', 'Return / Done');
                          }}
                          style={{ backgroundColor: themePrimary }}
                          className="h-9 px-3 rounded-md text-white text-xs font-semibold shadow-sm active:opacity-90"
                        >
                          return
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* 5. NATIVE BOTTOM HOME GESTURE BAR */}
                <div
                  onClick={() => {
                    setHomeIndicatorPressed(true);
                    setTimeout(() => setHomeIndicatorPressed(false), 200);
                    onEvent?.('Home Gesture', 'Swiped up to Home');
                  }}
                  title="Home Indicator (Click to simulate home gesture)"
                  className="flex h-6 shrink-0 items-center justify-center bg-transparent z-20 cursor-pointer"
                >
                  <div
                    style={{
                      transform: homeIndicatorPressed ? 'scale(0.85) translateY(-2px)' : 'none',
                    }}
                    className="h-1 w-32 rounded-full bg-zinc-400/80 hover:bg-zinc-600 transition-all duration-150"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
