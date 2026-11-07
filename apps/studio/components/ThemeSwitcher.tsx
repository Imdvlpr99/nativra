'use client';

import React from 'react';
import { Palette } from 'lucide-react';

interface ThemeSwitcherProps {
  themes: Record<string, { primary: string; primaryFg: string; accent: string; name: string }>;
  activeTheme: string;
  onThemeChange: (theme: string) => void;
}

export function ThemeSwitcher({ themes, activeTheme, onThemeChange }: ThemeSwitcherProps) {
  return (
    <div className="space-y-3 border-b border-border p-4">
      <div className="flex items-center gap-2">
        <Palette className="h-4 w-4 text-muted-foreground" />
        <label className="text-xs font-medium text-muted-foreground">Theme</label>
      </div>
      <div className="grid grid-cols-1 gap-2">
        {Object.entries(themes).map(([key, { primary, primaryFg, name }]) => (
          <button
            key={key}
            onClick={() => onThemeChange(key)}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
              activeTheme === key
                ? 'ring-2 ring-offset-2 ring-primary bg-muted'
                : 'hover:bg-muted'
            }`}
          >
            <div className="flex gap-1.5">
              <div
                style={{ backgroundColor: primary }}
                className="h-5 w-5 rounded-md shadow-sm"
              />
              <div
                style={{ backgroundColor: primaryFg }}
                className="h-5 w-5 rounded-md shadow-sm border border-border"
              />
            </div>
            <span>{name}</span>
            {activeTheme === key && (
              <svg className="ml-auto h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
