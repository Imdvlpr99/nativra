import React from "react";
import { DocsSidebar } from "@/components/DocsSidebar";

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="flex">
        {/* Sticky Sidebar on Desktop */}
        <aside className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-64 shrink-0 overflow-y-auto border-r border-border py-8 pr-6 md:block">
          <DocsSidebar />
        </aside>

        {/* Main Content Area */}
        <main className="min-w-0 flex-1 py-8 md:pl-8 lg:pl-10">
          {children}
        </main>
      </div>
    </div>
  );
}
