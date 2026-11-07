"use client";

import React, { useState } from "react";
import { Smartphone, Wifi, Battery, Signal } from "lucide-react";

export interface DeviceFrameProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
}

export function DeviceFrame({ children, title, className = "" }: DeviceFrameProps) {
  const [device, setDevice] = useState<"iphone" | "android">("iphone");

  return (
    <div className={`flex flex-col items-center ${className}`}>
      {/* Device Switcher Toolbar */}
      <div className="mb-4 flex items-center justify-between gap-4 w-full max-w-[360px]">
        {title && (
          <span className="text-xs font-semibold text-muted-foreground truncate">
            {title}
          </span>
        )}
        <div className="flex items-center gap-1.5 rounded-xl border border-border bg-muted/40 p-1 ml-auto">
          <button
            onClick={() => setDevice("iphone")}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
              device === "iphone"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Smartphone className="h-3.5 w-3.5" />
            <span>iOS</span>
          </button>
          <button
            onClick={() => setDevice("android")}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
              device === "android"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Smartphone className="h-3.5 w-3.5" />
            <span>Android</span>
          </button>
        </div>
      </div>

      {/* Hardware Chassis */}
      <div
        className={`relative w-full max-w-[360px] overflow-hidden bg-black transition-all shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)] ${
          device === "iphone"
            ? "rounded-[48px] border-[10px] border-zinc-800 ring-1 ring-zinc-700/60"
            : "rounded-[36px] border-[8px] border-zinc-800 ring-1 ring-zinc-700/40"
        }`}
      >
        {/* Status Bar */}
        <div className="relative z-30 flex items-center justify-between px-6 pt-3.5 pb-1 text-white select-none">
          <span className="text-[12px] font-bold tracking-tight">9:41</span>

          {/* Dynamic Island (iPhone) or Punch Hole (Android) */}
          {device === "iphone" ? (
            <div className="flex h-5 w-24 items-center justify-center rounded-full bg-black ring-1 ring-zinc-800/80">
              <div className="h-2 w-2 rounded-full bg-zinc-900 ring-1 ring-zinc-800" />
            </div>
          ) : (
            <div className="h-3 w-3 rounded-full bg-zinc-950 ring-2 ring-zinc-900" />
          )}

          <div className="flex items-center gap-1.5 text-zinc-300">
            <Signal className="h-3 w-3" />
            <Wifi className="h-3 w-3" />
            <Battery className="h-3.5 w-3.5 text-white" />
          </div>
        </div>

        {/* Viewport Content */}
        <div className="h-[620px] overflow-y-auto bg-zinc-950 text-white scrollbar-thin scrollbar-thumb-zinc-800">
          {children}
        </div>

        {/* Bottom Home Indicator */}
        <div className="relative z-30 flex h-6 w-full items-center justify-center bg-zinc-950 select-none">
          <div
            className={`rounded-full bg-zinc-500/80 ${
              device === "iphone" ? "h-1 w-32" : "h-1 w-20"
            }`}
          />
        </div>
      </div>
    </div>
  );
}

