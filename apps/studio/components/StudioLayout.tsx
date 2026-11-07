'use client';

import type { ReactNode } from 'react';

interface StudioLayoutProps {
  sidebar: ReactNode;
  canvas: ReactNode;
  inspector: ReactNode;
}

export function StudioLayout({ sidebar, canvas, inspector }: StudioLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Left Sidebar - Component Picker */}
      <aside className="w-64 shrink-0 overflow-y-auto border-r border-border bg-card">
        {sidebar}
      </aside>

      {/* Center Canvas */}
      <main className="flex-1 overflow-auto bg-gradient-to-br from-background to-muted/30">
        <div className="flex h-full items-center justify-center">
          {canvas}
        </div>
      </main>

      {/* Right Sidebar - Inspector */}
      <aside className="w-80 shrink-0 overflow-y-auto border-l border-border bg-card">
        {inspector}
      </aside>
    </div>
  );
}
