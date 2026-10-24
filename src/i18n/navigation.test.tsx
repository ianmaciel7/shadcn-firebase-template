import { cleanup, renderHook } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import type { ReactNode } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { usePathname, useRouter } from "./navigation";

const router = vi.hoisted(() => ({
  replace: vi.fn(),
  push: vi.fn(),
  refresh: vi.fn(),
  pathname: "/profile",
}));
vi.mock("next/navigation", () => ({
  useRouter: () => router,
  usePathname: () => router.pathname,
}));

describe("cookie-based locale navigation", () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
    router.pathname = "/profile";
  });
  it.each(["en", "pt-BR", "es"])(
    "keeps actual route paths when the locale is %s",
    (locale) => {
      const { result } = renderHook(() => useRouter(), {
        wrapper: ({ children }: { children: ReactNode }) => (
          <NextIntlClientProvider locale={locale} messages={{}}>
            {children}
          </NextIntlClientProvider>
        ),
      });
      result.current.replace("/profile");
      expect(router.replace).toHaveBeenCalledWith("/profile");
      result.current.replace("/sign-in");
      expect(router.replace).toHaveBeenCalledWith("/sign-in");
    },
  );
});

it.each([
  ["/en", "/"],
  ["/pt-BR/profile", "/profile"],
  ["/es/sign-in", "/sign-in"],
  ["/profile", "/profile"],
  ["/english/profile", "/english/profile"],
])("exposes public pathname %s as %s", (internalPath, publicPath) => {
  router.pathname = internalPath;
  const { result } = renderHook(() => usePathname());
  expect(result.current).toBe(publicPath);
});
