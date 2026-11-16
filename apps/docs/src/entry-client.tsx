import React, { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import { HeadProvider } from "@/lib/head";
import { App } from "./App";
import "./styles.css";

const root = document.getElementById("root")!;
const app = (
  <StrictMode>
    <HeadProvider collector={null}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </HeadProvider>
  </StrictMode>
);

// Prerendered pages are hydrated, but only when the HTML was rendered for this URL. A host
// serves 404.html for unknown paths, and that markup can't match what the app renders there.
const prerenderedFor = document.querySelector<HTMLMetaElement>('meta[name="nativra-route"]')?.content;
const here = window.location.pathname.replace(/\/+$/, "") || "/";
if (root.firstElementChild && prerenderedFor === here) {
  hydrateRoot(root, app);
} else {
  createRoot(root).render(app);
}
