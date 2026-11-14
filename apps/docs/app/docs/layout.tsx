import React from "react";
import { getDocsNav } from "@/lib/docs-nav";
import { DocsSidebar } from "@/components/docs/DocsSidebar";
import { DocsMobileNav } from "@/components/docs/DocsMobileNav";
import { DocsPager } from "@/components/docs/DocsPager";
import { OnThisPage } from "@/components/docs/OnThisPage";

export default async function DocsLayout({ children }: { children: React.ReactNode }) {
  const sections = await getDocsNav();

  return (
    <div className="container-docs">
      <DocsMobileNav sections={sections} />
      <div className="lg:grid lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10 xl:grid-cols-[240px_minmax(0,1fr)_200px]">
        <aside className="sticky top-[var(--header-height)] hidden h-[calc(100vh-var(--header-height))] overflow-y-auto overscroll-contain py-8 pr-2 lg:block">
          <DocsSidebar sections={sections} />
        </aside>

        <main id="main-content" tabIndex={-1} className="min-w-0 py-8 outline-none lg:py-10">
          <div id="docs-content" className="mx-auto w-full max-w-[50rem]">
            {children}
          </div>
          <div className="mx-auto w-full max-w-[50rem]">
            <DocsPager sections={sections} />
          </div>
        </main>

        <aside className="sticky top-[var(--header-height)] hidden h-[calc(100vh-var(--header-height))] overflow-y-auto py-10 xl:block">
          <OnThisPage />
        </aside>
      </div>
    </div>
  );
}
