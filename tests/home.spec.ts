import { expect, test } from "@playwright/test";
import { localeCookie, locales } from "../src/i18n/routing";

test.describe("home page smoke tests", () => {
  test("serves a usable page with document metadata", async ({ page }) => {
    const response = await page.goto("/");
    expect(response?.ok()).toBe(true);
    await expect(page.locator("main")).toBeVisible();
    await expect(page.getByRole("heading", { level: 1 }).first()).toBeVisible();
    await expect(page).toHaveTitle(/\S/);
  });

  test("protects links that open a new tab", async ({ page }) => {
    await page.goto("/");
    const links = page.locator('a[target="_blank"]');
    const count = await links.count();
    for (let i = 0; i < count; i++) {
      await expect(links.nth(i)).toHaveAttribute("rel", /\bnoopener\b/);
    }
  });

  for (const locale of locales) {
    test(`serves the configured locale ${locale} without an error`, async ({
      context,
      page,
    }) => {
      await context.addCookies([
        {
          name: localeCookie,
          value: locale,
          url: "http://127.0.0.1:3000",
        },
      ]);
      const response = await page.goto("/");
      expect(response?.ok()).toBe(true);
      await expect(page.locator("main")).toBeVisible();
      await expect(page.locator("html")).toHaveAttribute("lang", locale);
      expect(await response?.text()).toMatch(
        new RegExp(`<html[^>]*lang="${locale}"`),
      );
      expect(new URL(page.url()).pathname).toBe("/");
      await page.locator('a[href="/register"]').click();
      await expect(page).toHaveURL(/\/register$/);
      await expect(page.locator("html")).toHaveAttribute("lang", locale);
      await page.goBack();
      await expect(page).toHaveURL("http://127.0.0.1:3000/");
      await expect(page.locator("html")).toHaveAttribute("lang", locale);
    });

    test(`renders the document language ${locale} before JavaScript`, async ({
      context,
    }) => {
      await context.addCookies([
        { name: localeCookie, value: locale, url: "http://127.0.0.1:3000" },
      ]);
      const response = await context.request.get("/");
      expect(response.ok()).toBe(true);
      expect(await response.text()).toMatch(
        new RegExp(`<html[^>]*lang="${locale}"`),
      );
      expect(response.headers().vary).toContain("Cookie");
    });
  }

  test("serves the page without errors for an unsupported locale cookie", async ({
    context,
    page,
  }) => {
    await context.addCookies([
      {
        name: localeCookie,
        value: "unsupported-locale",
        url: "http://127.0.0.1:3000",
      },
    ]);
    const response = await page.goto("/");
    expect(response?.ok()).toBe(true);
    await expect(page.locator("main")).toBeVisible();
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    expect(await response?.text()).toMatch(/<html[^>]*lang="en"/);
  });

  test("selects fresh localized HTML when the locale cookie changes at the same URL", async ({
    context,
  }) => {
    for (const locale of ["pt-BR", "es", "en"]) {
      await context.addCookies([
        { name: localeCookie, value: locale, url: "http://127.0.0.1:3000" },
      ]);
      const response = await context.request.get("/");
      expect(await response.text()).toMatch(
        new RegExp(`<html[^>]*lang="${locale}"`),
      );
    }
  });

  test("localizes unknown routes and preserves static assets", async ({
    context,
    page,
  }) => {
    await context.addCookies([
      { name: localeCookie, value: "pt-BR", url: "http://127.0.0.1:3000" },
    ]);
    await page.goto("/missing-route-for-locale-test");
    await expect(page.getByRole("heading", { name: "404" })).toBeVisible();
    await expect(page.locator("html")).toHaveAttribute("lang", "pt-BR");
    expect(new URL(page.url()).pathname).toBe("/missing-route-for-locale-test");
    const asset = await context.request.get("/next.svg");
    expect(asset.ok()).toBe(true);
    expect(asset.headers()["content-type"]).toContain("image/svg+xml");
  });
});
