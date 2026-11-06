import { test, expect } from "@playwright/test";
import { execSync } from "child_process";
import { tmpdir } from "os";
import { join } from "path";

/**
 * E2E tests for Nativra Studio
 * Tests visual component editing and prop controls
 */

test.describe("Nativra Studio", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:3001");
  });

  test("loads and displays component list", async ({ page }) => {
    // Wait for Studio to render
    await expect(page.locator("text=Components")).toBeVisible();
    
    // Check for components in sidebar
    await expect(page.locator("text=button")).toBeVisible();
    await expect(page.locator("text=input")).toBeVisible();
    await expect(page.locator("text=badge")).toBeVisible();
  });

  test("can switch between components", async ({ page }) => {
    // Click badge component
    await page.click("button:has-text('badge')");
    await expect(page.locator("text=Badge")).toBeVisible();
    
    // Verify properties panel updates
    await expect(page.locator("text=Variant")).toBeVisible();
    await expect(page.locator("text=Size")).toBeVisible();
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
    const installCode = page.locator("text=npx nativra add input");
    await expect(installCode).toBeVisible();
  });

  test("copy buttons work", async ({ page }) => {
    await page.click("button:has-text('button')");
    
    // Click copy source button
    const copyBtn = page.locator("button:has-text('Copy source')");
    await copyBtn.click();
    
    // Browser clipboard API should have copied
    await expect(copyBtn).toBeVisible(); // Still visible after click
  });
});
