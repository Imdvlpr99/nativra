import React from "react";
import { Link, useLocation } from "react-router";
import { Seo } from "@/lib/head";

export default function NotFound() {
  const { pathname } = useLocation();
  return (
    <div className="mx-auto flex max-w-xl flex-col items-start gap-5 py-24">
      <Seo title="Page not found" description="This page does not exist." path={pathname} noindex />
      <p className="font-mono text-sm text-brand">404</p>
      <h1 className="text-3xl font-bold">This page doesn&apos;t exist.</h1>
      <p className="text-muted-foreground">
        It may have moved. Search with <kbd className="kbd">/</kbd>, or start from one of these:
      </p>
      <div className="flex flex-wrap gap-3">
        <Link to="/docs" className="btn-primary">
          Documentation
        </Link>
        <Link to="/docs/components" className="btn-secondary">
          Components
        </Link>
      </div>
    </div>
  );
}
