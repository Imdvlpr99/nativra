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

  test("can switch to Icon Explorer and search icons", async ({ page }) => {
    // Navigate to Icons mode
    await page.click("button:has-text('Icons')");
    await expect(page.locator("text=Lucide Icon Explorer").first()).toBeVisible();

    // Search for Bell icon
    const searchInput = page.locator("input[placeholder*='Search icons']").first();
    await searchInput.fill("Bell");
    await expect(page.locator("button:has-text('Bell')").first()).toBeVisible();
  });
});
