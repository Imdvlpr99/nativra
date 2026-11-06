import { test, expect } from "@playwright/test";

/**
 * E2E tests for Nativra Docs
 * Tests key user journeys on the documentation site
 */

test.describe("Nativra Docs", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:3000");
  });

  test("homepage displays hero and feature grid", async ({ page }) => {
    // Hero section
    await expect(page.locator("h1")).toContainText("Native UI");
    await expect(page.locator("text=built your way")).toBeVisible();

    // Feature grid
    await expect(page.locator("text=Source ownership")).toBeVisible();
    await expect(page.locator("text=Native first")).toBeVisible();
    await expect(page.locator("text=Studio")).toBeVisible();
  });

  test("can navigate to components catalog", async ({ page }) => {
    await page.click('a:has-text("Browse components")');
    await expect(page).toHaveURL(/.*\/components/);
    await expect(page.locator("h1")).toContainText("Components");
  });

  test("components page lists all published items", async ({ page }) => {
    await page.goto("http://localhost:3000/docs/components");
    
    // Check for foundation components
    await expect(page.locator("text=Button")).toBeVisible();
    await expect(page.locator("text=Badge")).toBeVisible();
    await expect(page.locator("text=Input")).toBeVisible();
    await expect(page.locator("text=Card")).toBeVisible();
    
    // Check CLI install command
    await expect(page.locator("text=nativra add")).toBeVisible();
  });

  test("component detail page shows metadata and source", async ({ page }) => {
    await page.goto("http://localhost:3000/docs/components/button");
    
    // Metadata
    await expect(page.locator("text=Button")).toBeVisible();
    await expect(page.locator("text=Android")).toBeVisible();
    await expect(page.locator("text=iOS")).toBeVisible();
    
    // Install command
    await expect(page.locator("text=npx nativra add button")).toBeVisible();
    
    // Source code display
    await expect(page.locator("code")).toContainText("export function Button");
  });

  test("navigation links work", async ({ page }) => {
    // Components
    await page.click('a:has-text("Components")');
    await expect(page).toHaveURL(/.*\/components/);
    
    // Docs
    await page.click('a:has-text("Docs")');
    await expect(page).toHaveURL(/.*\/docs$/);
    
    // Home
    await page.click("a >> text=Nativra").first();
    await expect(page).toHaveURL(/.*\/$/);
  });
});
