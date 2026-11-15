import React, { lazy } from "react";
import { Route, Routes } from "react-router";
import { DocsLayout, RootLayout } from "@/components/layout/Layouts";
import { ITEM_TYPE_ORDER, TYPE_META } from "@/lib/item-types";
import Home from "@/pages/Home";
import CatalogPage from "@/pages/CatalogPage";
import NotFound from "@/pages/NotFound";
import Introduction from "@/pages/docs/Introduction";
import Installation from "@/pages/docs/Installation";
import Quickstart from "@/pages/docs/Quickstart";
import HowItWorks from "@/pages/docs/HowItWorks";
import Theming from "@/pages/docs/Theming";
import NativeWind from "@/pages/docs/NativeWind";
import StyleSheet from "@/pages/docs/StyleSheet";
import Updating from "@/pages/docs/Updating";
import DoctorAudit from "@/pages/docs/DoctorAudit";
import Registries from "@/pages/docs/Registries";
import Cli from "@/pages/docs/Cli";
import Configuration from "@/pages/docs/Configuration";
import Compatibility from "@/pages/docs/Compatibility";
import Contributing from "@/pages/docs/Contributing";

// Heavier pages load on demand: item pages carry the live preview, the changelog carries Markdown.
const ItemPage = lazy(() => import("@/pages/ItemPage"));
const Changelog = lazy(() => import("@/pages/docs/Changelog"));

/** Hand-written guide routes, relative to /docs. */
export const GUIDE_ROUTES: Array<{ path: string; element: React.ReactElement }> = [
  { path: "installation", element: <Installation /> },
  { path: "quickstart", element: <Quickstart /> },
  { path: "principles", element: <HowItWorks /> },
  { path: "theming", element: <Theming /> },
  { path: "styling/nativewind", element: <NativeWind /> },
  { path: "styling/stylesheet", element: <StyleSheet /> },
  { path: "updating", element: <Updating /> },
  { path: "doctor-audit", element: <DoctorAudit /> },
  { path: "registries", element: <Registries /> },
  { path: "cli", element: <Cli /> },
  { path: "configuration", element: <Configuration /> },
  { path: "compatibility", element: <Compatibility /> },
  { path: "changelog", element: <Changelog /> },
  { path: "contributing", element: <Contributing /> },
];

export function App() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route index element={<Home />} />
        <Route path="docs" element={<DocsLayout />}>
          <Route index element={<Introduction />} />
          {GUIDE_ROUTES.map((r) => (
            <Route key={r.path} path={r.path} element={r.element} />
          ))}
          {ITEM_TYPE_ORDER.map((type) => (
            <React.Fragment key={type}>
              <Route path={TYPE_META[type].segment} element={<CatalogPage type={type} />} />
              <Route path={`${TYPE_META[type].segment}/:id`} element={<ItemPage type={type} />} />
            </React.Fragment>
          ))}
          <Route path="*" element={<NotFound />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
