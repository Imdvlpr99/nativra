'use client';

import React from 'react';
import { Smartphone, Tablet, Sun, Moon, Grid3x3 } from 'lucide-react';

interface CanvasSelectorProps {
  device: 'iphone' | 'android' | 'compact' | 'tablet';
  isLandscape: boolean;
  zoom: number;
  canvasMode: 'light' | 'dark' | 'dots';
  onDeviceChange: (device: 'iphone' | 'android' | 'compact' | 'tablet') => void;
  onLandscapeToggle: () => void;
  onZoomChange: (zoom: number) => void;
  onCanvasModeChange: (mode: 'light' | 'dark' | 'dots') => void;
}

const DEVICES = [
  { id: 'iphone' as const, label: 'iPhone', icon: Smartphone },
  { id: 'android' as const, label: 'Android', icon: Smartphone },
  { id: 'compact' as const, label: 'Compact', icon: Smartphone },
  { id: 'tablet' as const, label: 'Tablet', icon: Tablet },
];

const CANVAS_MODES = [
  { id: 'light' as const, label: 'Light', icon: Sun },
  { id: 'dark' as const, label: 'Dark', icon: Moon },
  { id: 'dots' as const, label: 'Grid', icon: Grid3x3 },
];

export function CanvasSelector({
  device,
  isLandscape,
  zoom,
  canvasMode,
  onDeviceChange,
  onLandscapeToggle,
  onZoomChange,
  onCanvasModeChange,
}: CanvasSelectorProps) {
  return (
    <div className="flex flex-col gap-4 border-b border-border bg-card p-4">
      {/* Device Selector */}
      <div>
        <label className="mb-2 block text-xs font-medium text-muted-foreground">Device</label>
        <div className="grid grid-cols-4 gap-2">
          {DEVICES.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => onDeviceChange(id)}
              className={`flex items-center justify-center gap-1.5 rounded-lg px-2 py-2 text-xs font-medium transition-colors ${
                device === id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-border'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Canvas Mode */}
      <div>
        <label className="mb-2 block text-xs font-medium text-muted-foreground">Canvas</label>
        <div className="grid grid-cols-3 gap-2">
          {CANVAS_MODES.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => onCanvasModeChange(id)}
              className={`flex items-center justify-center gap-1.5 rounded-lg px-2 py-2 text-xs font-medium transition-colors ${
                canvasMode === id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-border'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Orientation & Zoom */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={onLandscapeToggle}
          className={`flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
            isLandscape
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-muted-foreground hover:bg-border'
          }`}
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6z" />
          </svg>
          <span>{isLandscape ? 'Landscape' : 'Portrait'}</span>
        </button>

        <div className="flex items-center gap-1.5 rounded-lg bg-muted px-2 py-1">
          <input
            type="range"
            min="50"
            max="200"
            step="10"
            value={zoom}
            onChange={(e) => onZoomChange(Number(e.target.value))}
            className="h-2 flex-1 cursor-pointer rounded-full accent-primary"
          />
          <span className="min-w-[2.5rem] text-right text-xs font-medium text-muted-foreground">{zoom}%</span>
        </div>
      </div>
    </div>
  );
}
