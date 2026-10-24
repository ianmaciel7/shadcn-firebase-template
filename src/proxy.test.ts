// @vitest-environment node
import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";
import { proxy } from "./proxy";

const request = (path: string, locale?: string, headers?: HeadersInit) =>
  new NextRequest(`https://example.test${path}`, {
    headers: {
      ...headers,
      ...(locale ? { cookie: `NEXT_LOCALE=${locale}` } : {}),
    },
  });

describe("internal cookie locale routing", () => {
  it.each(["en", "pt-BR", "es"])(
    "rewrites HTML and navigation to %s without redirecting the browser",
    (locale) => {
      const response = proxy(request("/profile?edit=true", locale));
      expect(response.headers.get("x-middleware-rewrite")).toBe(
        `https://example.test/${locale}/profile?edit=true`,
      );
      expect(response.headers.get("location")).toBeNull();
      expect(response.headers.get("vary")).toContain("Cookie");
    },
  );

  it.each([undefined, "unsupported", "EN", "../../es"])(
    "falls back safely for cookie %s",
    (locale) => {
      expect(
        proxy(request("/", locale)).headers.get("x-middleware-rewrite"),
      ).toBe("https://example.test/en");
    },
  );

  it("preserves the RSC URL/query and selects the same destination as HTML", () => {
    expect(
      proxy(request("/sign-in?_rsc=abc", "es", { rsc: "1" })).headers.get(
        "x-middleware-rewrite",
      ),
    ).toBe("https://example.test/es/sign-in?_rsc=abc");
  });

  it.each(["/en", "/pt-BR/profile", "/es/sign-in?next=%2Fprofile"])(
    "canonicalizes a visible locale prefix in %s",
    (path) => {
      const response = proxy(request(path));
      const destination = new URL(response.headers.get("location") ?? "");
      expect(destination.pathname).not.toMatch(/^\/(en|pt-BR|es)(\/|$)/);
      expect(destination.search).toBe(
        new URL(`https://example.test${path}`).search,
      );
    },
  );

  it.each([
    "/_next/static/a.js",
    "/_next/image",
    "/api/health",
    "/api",
    "/emulator/auth/config",
    "/identitytoolkit.googleapis.com/v1/accounts",
    "/securetoken.googleapis.com/v1/token",
    "/favicon.ico",
    "/logo.svg",
  ])("does not rewrite infrastructure request %s", (path) => {
    expect(
      proxy(request(path, "es")).headers.get("x-middleware-rewrite"),
    ).toBeNull();
  });

  it("keeps unknown public paths in the selected locale for localized 404 handling", () => {
    expect(
      proxy(request("/missing-page", "pt-BR")).headers.get(
        "x-middleware-rewrite",
      ),
    ).toBe("https://example.test/pt-BR/missing-page");
  });
});
