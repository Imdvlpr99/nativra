import React, { Suspense, useEffect } from "react";
import { Outlet, useLocation } from "react-router";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { Sidebar } from "./Sidebar";
import { MobileNav } from "./MobileNav";
import { Toc } from "./Toc";
import { Pager } from "./Pager";
import { ErrorBoundary } from "@/components/ErrorBoundary";

/** Scroll to the top on page changes, or to the hash target when there is one. */
function ScrollManager() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView();
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);
  return null;
}

function PageFallback() {
  return (
    <div className="space-y-4 py-4" aria-busy="true" aria-label="Loading">
      <div className="h-9 w-1/2 animate-pulse rounded-lg bg-muted" />
      <div className="h-5 w-3/4 animate-pulse rounded-lg bg-muted" />
      <div className="h-64 animate-pulse rounded-xl bg-muted" />
    </div>
  );
}

export function RootLayout() {
  const { pathname } = useLocation();
  return (
    <>
      <a
        href="#main-content"
        className="fixed left-4 top-3 z-[80] -translate-y-20 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition-transform focus-visible:translate-y-0"
      >
        Skip to content
      </a>
      <ScrollManager />
      <div className="relative flex min-h-screen flex-col">
        <Header />
        <div className="flex-1">
          <ErrorBoundary label="this page" resetKey={pathname}>
            <Suspense fallback={<PageFallback />}>
              <Outlet />
            </Suspense>
          </ErrorBoundary>
        </div>
        {/* The playground is a full-height app; a footer under it would only scroll the workspace away. */}
        {pathname !== "/playground" && <Footer />}
      </div>
    </>
  );
}

export function DocsLayout() {
  const { pathname } = useLocation();
  return (
    <div className="container-docs">
      <MobileNav />
      <div className="lg:grid lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-10 xl:grid-cols-[16rem_minmax(0,1fr)_13rem]">
        <aside className="sticky top-[var(--header-height)] hidden h-[calc(100vh-var(--header-height))] overflow-y-auto overscroll-contain py-8 pr-2 lg:block">
          <Sidebar />
        </aside>

        <main id="main-content" tabIndex={-1} className="min-w-0 py-8 outline-none lg:py-12">
          <div id="docs-content" className="mx-auto w-full max-w-[48rem]">
            <ErrorBoundary key={pathname} label="this page">
              <Suspense fallback={<PageFallback />}>
                <Outlet />
              </Suspense>
            </ErrorBoundary>
          </div>
          <div className="mx-auto w-full max-w-[48rem]">
            <Pager />
          </div>
        </main>

        <aside className="sticky top-[var(--header-height)] hidden h-[calc(100vh-var(--header-height))] overflow-y-auto py-12 xl:block">
          <Toc />
        </aside>
      </div>
    </div>
  );
}
