import React, { useLayoutEffect, useRef, useState } from "react";
import { BatteryFull, Signal, Wifi } from "lucide-react";

/** Matches the preview app's own backgrounds, so the status bar blends into the screen. */
const SCREEN = {
  light: { bg: "#ffffff", fg: "#09090b" },
  dark: { bg: "#09090b", fg: "#fafafa" },
} as const;

/** Logical size of the screen in CSS px (iPhone 15/16): apps lay out at a real phone's width. */
const SCREEN_W = 390;
const SCREEN_H = 844;
/** Frame (3px) + bezel (9px) on each side. */
const BORDER = 12;
const DEVICE_W = SCREEN_W + BORDER * 2;
const DEVICE_H = SCREEN_H + BORDER * 2;

// useLayoutEffect warns during server rendering (prerender); it only matters in the browser.
const useIsoLayoutEffect = typeof window === "undefined" ? () => {} : useLayoutEffect;

/**
 * A modern phone around a live preview: titanium body, bezel, side buttons, Dynamic Island,
 * status bar and home indicator. The device always renders at its real size (a 390×844 screen,
 * so the app lays out exactly as on a phone) and is scaled down as a whole to fit the space.
 * The status bar and home indicator sit above and below the app, like a device's safe areas.
 * The chrome is decorative and hidden from screen readers; the app inside stays accessible.
 */
export function PhoneMockup({
  scheme,
  children,
  className = "",
}: {
  scheme: "light" | "dark";
  children: React.ReactNode;
  className?: string;
}) {
  const s = SCREEN[scheme];
  const box = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useIsoLayoutEffect(() => {
    const el = box.current;
    if (!el) return;
    const fit = () => {
      const { width, height } = el.getBoundingClientRect();
      if (width > 0 && height > 0) setScale(Math.min(1, width / DEVICE_W, height / DEVICE_H));
    };
    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={box} className={`flex h-full w-full items-center justify-center ${className}`}>
      {/* Takes the scaled size in the layout; the device inside is drawn at full size and scaled. */}
      <div className="relative shrink-0" style={{ width: DEVICE_W * scale, height: DEVICE_H * scale }}>
        <div
          className="absolute left-0 top-0 origin-top-left"
          style={{ width: DEVICE_W, height: DEVICE_H, transform: `scale(${scale})` }}
        >
          {/* Side buttons: action, volume up, volume down (left); power (right). */}
          <span aria-hidden="true" className="absolute -left-[3px] top-[16%] h-[3.5%] w-[3px] rounded-l-sm bg-zinc-700" />
          <span aria-hidden="true" className="absolute -left-[3px] top-[23%] h-[7%] w-[3px] rounded-l-sm bg-zinc-700" />
          <span aria-hidden="true" className="absolute -left-[3px] top-[31.5%] h-[7%] w-[3px] rounded-l-sm bg-zinc-700" />
          <span aria-hidden="true" className="absolute -right-[3px] top-[26%] h-[11%] w-[3px] rounded-r-sm bg-zinc-700" />

          {/* Body and bezel */}
          <div className="flex h-full w-full flex-col rounded-[3.4rem] bg-gradient-to-b from-zinc-700 via-zinc-800 to-zinc-700 p-[3px] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.45)] ring-1 ring-black/40">
            <div className="flex h-full w-full flex-col overflow-hidden rounded-[3.25rem] bg-black p-[9px]">
              {/* Screen */}
              <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-[2.75rem]" style={{ backgroundColor: s.bg }}>
                {/* Status bar with the Dynamic Island */}
                <div
                  aria-hidden="true"
                  className="relative flex h-[54px] shrink-0 select-none items-center justify-between px-8 pt-1 text-[15px] font-semibold"
                  style={{ color: s.fg }}
                >
                  <span className="w-14 tabular-nums">9:41</span>
                  <span className="absolute left-1/2 top-[11px] h-[34px] w-[124px] -translate-x-1/2 rounded-full bg-black" />
                  <span className="flex w-14 items-center justify-end gap-1">
                    <Signal className="h-4 w-4" strokeWidth={2.5} />
                    <Wifi className="h-4 w-4" strokeWidth={2.5} />
                    <BatteryFull className="h-5 w-5" strokeWidth={2} />
                  </span>
                </div>

                {/* The app */}
                <div className="relative min-h-0 flex-1">{children}</div>

                {/* Home indicator */}
                <div aria-hidden="true" className="flex h-[34px] shrink-0 items-center justify-center">
                  <span className="h-[5px] w-[134px] rounded-full" style={{ backgroundColor: s.fg, opacity: 0.85 }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
