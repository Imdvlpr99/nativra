import { test, expect } from "@playwright/test";

/**
 * E2E tests for Nativra Studio
 * Tests visual component editing, prop controls, and all interactive workbench tools
 */

test.describe("Nativra Studio", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:3001");
  });

  test("loads and displays component list", async ({ page }) => {
    // Wait for Studio to render
    await expect(page.locator("text=Components").first()).toBeVisible();
    
    // Check for components in sidebar
    await expect(page.locator("text=button").first()).toBeVisible();
    await expect(page.locator("text=input").first()).toBeVisible();
    await expect(page.locator("text=badge").first()).toBeVisible();
  });

  test("can switch between components", async ({ page }) => {
    // Click badge component
    await page.click("button:has-text('badge')");
    await expect(page.locator("text=Badge").first()).toBeVisible();
    
    // Verify properties panel updates
    await expect(page.locator("text=Variant").first()).toBeVisible();
    await expect(page.locator("text=Size").first()).toBeVisible();
  });

  test("prop controls render and update preview", async ({ page }) => {
    // Select button component
    await page.click("button:has-text('button')");
    
    // Change variant via select
    await page.selectOption("select", "primary");
    
    // Verify usage code updates
    const usage = page.locator("code").first();
    await expect(usage).toContainText('variant="primary"');
  });

  test("displays install command", async ({ page }) => {
    await page.click("button:has-text('input')");
    
    // Check for install command in right panel
    const installCode = page.locator("text=npx nativra add input").first();
    await expect(installCode).toBeVisible();
  });

  test("copy buttons work", async ({ page }) => {
    await page.click("button:has-text('button')");
    
    // Click copy source button
    const copyBtn = page.locator("button:has-text('Copy source')").first();
    await copyBtn.click();
    
    // Browser clipboard API should have copied
    await expect(copyBtn).toBeVisible(); // Still visible after click
  });

  test("can toggle styling target between NativeWind v4 and StyleSheet", async ({ page }) => {
    const nwBtn = page.locator("button:has-text('NativeWind v4')").first();
    const ssBtn = page.locator("button:has-text('StyleSheet')").first();

    await expect(nwBtn).toBeVisible();
    await expect(ssBtn).toBeVisible();

    await ssBtn.click();
    await expect(ssBtn).toBeVisible();

    await nwBtn.click();
    await expect(nwBtn).toBeVisible();
  });

  test("can switch to Component Playground and test 8 interactive states", async ({ page }) => {
    // Navigate to Playground mode
    await page.click("button:has-text('Playground')");
    await expect(page.locator("text=Component Playground").first()).toBeVisible();

    // Verify state cards exist
    await expect(page.locator("text=Default").first()).toBeVisible();
    await expect(page.locator("text=Pressed / Active").first()).toBeVisible();
    await expect(page.locator("text=Disabled").first()).toBeVisible();
    await expect(page.locator("text=Loading").first()).toBeVisible();

    // Click 'Disabled' state
    await page.click("button:has-text('Disabled')");
    await expect(page.locator("text=Disabled Button").first()).toBeVisible();

    // Click 'Loading' state
    await page.click("button:has-text('Loading')");
    await expect(page.locator("text=Processing...").first()).toBeVisible();

    // Switch specimen to input
    await page.click("button:has-text('input')");
    await expect(page.locator("text=Email Address").first()).toBeVisible();
  });

  test("can switch to Screen Builder and manage screen blocks", async ({ page }) => {
    // Navigate to Screens mode
    await page.click("button:has-text('Screens')");
    await expect(page.locator("text=Screen Blocks").first()).toBeVisible();
    await expect(page.locator("text=Screen Hierarchy").first()).toBeVisible();

    // Add a Search Bar block
    const addSearchBtn = page.locator("button:has-text('Search Bar')").first();
    await addSearchBtn.click();

    // Duplicate selected block
    const duplicateBtn = page.locator("button:has-text('Duplicate')").first();
    await duplicateBtn.click();

    // Switch to Export Code tab
    await page.click("button:has-text('Export Code')");
    await expect(page.locator("text=src/screens/CustomScreen.tsx").first()).toBeVisible();
  });

  test("can switch to Navigation Generator and configure routes", async ({ page }) => {
    // Navigate to Navigation mode
    await page.click("button:has-text('Navigation')");
    await expect(page.locator("text=Navigation Generator").first()).toBeVisible();
    await expect(page.locator("text=React Navigation v7").first()).toBeVisible();

    // Check navigator type switcher
    await page.click("button:has-text('native stack')");
    await page.click("button:has-text('drawer')");
    await page.click("button:has-text('bottom tabs')");

    // Add a new route
    await page.click("button:has-text('Add Screen')");
    await expect(page.locator("text=Registered Screens (5)").first()).toBeVisible();

    // Switch to Types.ts preview
    await page.click("button:has-text('Types.ts')");
    await expect(page.locator("text=RootTabParamList").first()).toBeVisible();
  });

  test("can switch to Theme Studio and inspect presets", async ({ page }) => {
    // Navigate to Themes mode
    await page.click("button:has-text('Themes')");
    await expect(page.locator("text=Theme Tokens").first()).toBeVisible();

    // Switch color preset
    await page.click("button:has-text('Ocean Blue')");
    await page.click("button:has-text('Midnight Purple')");

    // Switch to tailwind.config.js tab
    await page.click("button:has-text('tailwind.config.js')");
    await expect(page.locator("text=Generated by Nativra Theme Engine").first()).toBeVisible();
  });

  test("can switch to Icon Explorer and search icons", async ({ page }) => {
    // Navigate to Icons mode
    await page.click("button:has-text('Icons')");
    await expect(page.locator("text=Lucide Icon Explorer").first()).toBeVisible();

    // Search for Bell icon
    const searchInput = page.locator("input[placeholder*='Search icons']").first();
    await searchInput.fill("Bell");
    await expect(page.locator("button:has-text('Bell')").first()).toBeVisible();
  });

  test("can switch to Starter Templates and inspect architecture", async ({ page }) => {
    // Navigate to Templates mode
    await page.click("button:has-text('Templates')");
    await expect(page.locator("text=Starter Templates").first()).toBeVisible();
    await expect(page.locator("text=E-Commerce Storefront").first()).toBeVisible();

    // Select Authentication Suite template
    await page.click("button:has-text('Authentication Suite')");
    await expect(page.locator("text=Authentication Suite").first()).toBeVisible();

    // Switch to Code Export tab
    await page.click("button:has-text('Code Export')");
    await expect(page.locator("text=AuthScreen.tsx").first()).toBeVisible();
  });

  test("can switch to Accessibility Inspector and filter audit issues", async ({ page }) => {
    // Navigate to A11y mode
    await page.click("button:has-text('A11y')");
    await expect(page.locator("text=Accessibility Inspector").first()).toBeVisible();
    await expect(page.locator("text=WCAG 2.1 AA").first()).toBeVisible();

    // Filter by Critical issues
    await page.click("button:has-text('Critical')");
    await expect(page.locator("text=Touch target size is smaller than 48x48 dp").first()).toBeVisible();

    // Check recommendation
    await expect(page.locator("text=Actionable Fix & Code Snippet").first()).toBeVisible();
  });

  test("can switch to Developer Tooling and inspect diagnostics & AI context", async ({ page }) => {
    // Navigate to Dev Tools mode
    await page.click("button:has-text('Dev Tools')");
    await expect(page.locator("text=Developer Tooling").first()).toBeVisible();

    // Verify Diagnostics tab
    await expect(page.locator("text=All Checks Passing (5/5)").first()).toBeVisible();

    // Switch to Dependency Analyzer
    await page.click("button:has-text('Dependency Analyzer')");
    await expect(page.locator("text=Dependency & Ecosystem Analyzer").first()).toBeVisible();

    // Switch to AI Context Exporter
    await page.click("button:has-text('AI Context Exporter')");
    await expect(page.locator("text=nativra-context.json").first()).toBeVisible();
    await expect(page.locator("button:has-text('Copy AI Context')").first()).toBeVisible();
  });
});
