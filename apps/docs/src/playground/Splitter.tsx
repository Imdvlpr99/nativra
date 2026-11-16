import React, { useRef } from "react";

/**
 * A pane divider that resizes by pointer drag or by keyboard (arrow keys, Home/End), and resets on
 * double-click. It takes no layout space: an invisible hit area sits over the panes' shared border
 * and only shows a line on hover or focus. Dragging is never the only way: panes also collapse.
 */
export function Splitter({
  orientation,
  value,
  min,
  max,
  onChange,
  onReset,
  label,
  invert = false,
}: {
  /** "vertical" divides left/right panes; "horizontal" divides top/bottom. */
  orientation: "vertical" | "horizontal";
  value: number;
  min: number;
  max: number;
  onChange: (next: number) => void;
  onReset: () => void;
  label: string;
  /** The controlled pane sits after the divider (right or bottom), so dragging toward it shrinks it. */
  invert?: boolean;
}) {
  const start = useRef<{ pos: number; value: number } | null>(null);
  const clamp = (n: number) => Math.round(Math.min(max, Math.max(min, n)));
  const vertical = orientation === "vertical";

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    start.current = { pos: vertical ? e.clientX : e.clientY, value };
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!start.current) return;
    const delta = (vertical ? e.clientX : e.clientY) - start.current.pos;
    onChange(clamp(start.current.value + (invert ? -delta : delta)));
  };
  const onPointerUp = () => {
    start.current = null;
  };
  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const step = e.shiftKey ? 64 : 16;
    const grow = vertical ? (invert ? "ArrowLeft" : "ArrowRight") : invert ? "ArrowUp" : "ArrowDown";
    const shrink = vertical ? (invert ? "ArrowRight" : "ArrowLeft") : invert ? "ArrowDown" : "ArrowUp";
    if (e.key === grow) onChange(clamp(value + step));
    else if (e.key === shrink) onChange(clamp(value - step));
    else if (e.key === "Home") onChange(min);
    else if (e.key === "End") onChange(max);
    else return;
    e.preventDefault();
  };

  return (
    <div className={`relative z-20 shrink-0 ${vertical ? "w-0" : "h-0"}`}>
      <div
        role="separator"
        tabIndex={0}
        aria-label={label}
        aria-orientation={vertical ? "vertical" : "horizontal"}
        aria-valuenow={value}
        aria-valuemin={min}
        aria-valuemax={max}
        title={`${label} (drag, arrow keys, or double-click to reset)`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onDoubleClick={onReset}
        onKeyDown={onKeyDown}
        className={`group absolute flex touch-none items-center justify-center focus-visible:ring-0 focus-visible:ring-offset-0 ${
          vertical ? "inset-y-0 -left-1.5 w-3 cursor-col-resize" : "inset-x-0 -top-1.5 h-3 cursor-row-resize"
        }`}
      >
        <span
          aria-hidden="true"
          className={`bg-brand opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100 ${
            vertical ? "h-full w-0.5" : "h-0.5 w-full"
          }`}
        />
      </div>
    </div>
  );
}
