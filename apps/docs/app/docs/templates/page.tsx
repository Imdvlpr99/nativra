import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Screen Templates",
  description:
    "Full-screen composite mobile patterns and screen flows built with Nativra components",
};

interface ScreenTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  componentsUsed: string[];
  installCommand: string;
  previewHighlights: string[];
}

const TEMPLATES: ScreenTemplate[] = [
  {
    id: "analytics-dashboard",
    name: "Executive Analytics Dashboard",
    category: "SaaS & Dashboards",
    description:
      "Metronic-inspired executive analytics screen featuring 2x2 KPI metrics, 7d/30d filter pills, acquisition channel progress bars, and recent financial activity ledger.",
    componentsUsed: ["card", "badge", "button", "separator", "tabs", "text", "metric-card"],
    installCommand: "npx nativra add analytics-dashboard",
    previewHighlights: [
      "Revenue, Active Users, Conversion & Churn KPI cards",
      "Interactive 24h / 7d / 30d / YTD time window switcher",
      "Channel distribution bars with percentages",
      "Recent financial audit ledger with status coloring",
    ],
  },
  {
    id: "ecommerce-flow",
    name: "eCommerce Storefront & Cart",
    category: "Retail & Commerce",
    description:
      "Curated mobile storefront with promotional hero banner, category pills, product grid cards with star ratings, and floating cart drawer.",
    componentsUsed: ["card", "badge", "button", "separator", "text", "order-summary"],
    installCommand: "npx nativra add ecommerce-flow",
    previewHighlights: [
      "Featured hero showcase with limited edition badge",
      "Dynamic category filtering pills",
      "Product cards with customer rating stars",
      "Interactive cart counter with instant add action",
    ],
  },
  {
    id: "fintech-wallet",
    name: "Fintech & Crypto Multi-Chain Vault",
    category: "Finance & Banking",
    description:
      "High-impact personal finance wallet featuring total net worth header, Send/Receive/Swap action pills, multi-asset allocation cards, and recent ledger.",
    componentsUsed: ["card", "badge", "button", "separator", "text"],
    installCommand: "npx nativra add fintech-wallet",
    previewHighlights: [
      "Total valuation card with privacy hide/reveal balance toggle",
      "One-tap quick action bar for Send, Receive, and Swap",
      "Portfolio crypto/fiat asset allocation cards",
      "Filterable recent transaction history",
    ],
  },
  {
    id: "account-settings-flow",
    name: "Account Settings & Org Security Hub",
    category: "SaaS & Account Hub",
    description:
      "Enterprise SaaS account management hub featuring profile administration, organization seat quota tracking, active device session revocation, and invoice history ledger.",
    componentsUsed: ["card", "badge", "button", "separator", "segmented-control", "text", "switch"],
    installCommand: "npx nativra add account-settings-flow",
    previewHighlights: [
      "Profile & organization details management",
      "Team seat utilization progress bar (8/10 active)",
      "Two-Factor Authentication & active device revocation",
      "Enterprise subscription card with default payment method & invoice history",
    ],
  },
  {
    id: "chat-flow",
    name: "In-App Customer Messaging & Support Flow",
    category: "Communication & Support",
    description:
      "Full-featured mobile messaging flow featuring multi-tab inbox threads, message speech bubbles, online indicator status, and keyboard-aware input bar.",
    componentsUsed: ["card", "badge", "button", "separator", "text", "avatar"],
    installCommand: "npx nativra add chat-flow",
    previewHighlights: [
      "Filterable inbox threads (All / Support / Direct)",
      "Sent vs received speech bubbles with read-receipt checkmarks",
      "Integrated KeyboardAvoidingView text composer with attachment actions",
      "Agent online status pills and unread badge counters",
    ],
  },
  {
    id: "auth-flow",
    name: "Authentication Flow",
    category: "Onboarding & Auth",
    description:
      "A complete sign-in and account creation screen with input validation, password reveal state, social provider separator, and primary press actions.",
    componentsUsed: ["button", "input", "card", "separator", "text"],
    installCommand: "npx nativra add auth-flow",
    previewHighlights: [
      "Auto-capitalization and keyboardType presets",
      "Inline error validation and helper messages",
      "Semantic primary button with loading state",
    ],
  },
  {
    id: "onboarding-flow",
    name: "Onboarding Flow",
    category: "Welcome & Onboarding",
    description:
      "Multi-step walkthrough carousel with pagination indicator dots, rich feature highlights, skip action, and final get started CTA.",
    componentsUsed: ["button", "card", "badge", "text"],
    installCommand: "npx nativra add onboarding-flow",
    previewHighlights: [
      "Step pagination with animated dot indicator",
      "Feature highlights with icon badges",
      "Skip and Next/Finish navigation controls",
    ],
  },
  {
    id: "settings-flow",
    name: "Settings & Profile Flow",
    category: "User Preferences",
    description:
      "Comprehensive mobile settings screen featuring user profile card, notification toggle switches, dark mode preference, and security options.",
    componentsUsed: ["avatar", "badge", "card", "switch", "separator", "button"],
    installCommand: "npx nativra add settings-flow",
    previewHighlights: [
      "Avatar with fallback initials",
      "Accessible toggle switches for push alerts",
      "Destructive logout action with confirmation state",
    ],
  },
];

export default function TemplatesPage() {
  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="space-y-3 border-b border-border pb-8">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700 dark:border-sky-900 dark:bg-sky-950 dark:text-sky-300">
          Screen Architecture
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          Screen Templates
        </h1>
        <p className="text-base text-muted-foreground max-w-2xl leading-relaxed">
          Pre-assembled full mobile screen flows built exclusively with Nativra foundation components. Copy the screen code, own the layout, and adapt to your routing solution.
        </p>
      </div>

      {/* Templates Grid */}
      <div className="space-y-8">
        {TEMPLATES.map((tmpl) => (
          <div
            key={tmpl.id}
            className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-6"
          >
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold tracking-tight text-foreground">
                    {tmpl.name}
                  </h2>
                  <span className="rounded-full bg-sky-100 px-2.5 py-0.5 text-[10px] font-semibold text-sky-800 dark:bg-sky-950 dark:text-sky-300">
                    {tmpl.category}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1 max-w-xl">
                  {tmpl.description}
                </p>
              </div>

              {/* Install Command */}
              <div className="flex items-center gap-2 font-mono text-xs rounded-lg border border-border bg-muted/40 px-3 py-1.5">
                <span className="text-muted-foreground">$</span>
                <span className="text-foreground">{tmpl.installCommand}</span>
              </div>
            </div>

            {/* Architecture Details */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Components Used
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {tmpl.componentsUsed.map((comp) => (
                    <Link
                      key={comp}
                      href={`/docs/components/${comp}`}
                      className="rounded-md border border-border bg-muted/30 px-2.5 py-1 text-xs font-mono text-foreground hover:bg-muted transition-colors"
                    >
                      {comp}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Pattern Features
                </span>
                <ul className="space-y-1 text-xs text-muted-foreground">
                  {tmpl.previewHighlights.map((feat) => (
                    <li key={feat} className="flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
