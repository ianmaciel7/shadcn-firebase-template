import { act, cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import en from "@/messages/en.json";
import { AuthNavButton } from "./auth-nav-button";

const mocks = vi.hoisted(() => ({
  subscribe: vi.fn(),
  unsubscribe: vi.fn(),
  getUI: vi.fn(),
}));

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) =>
    (en.App as Record<string, string>)[key] ?? key,
}));

vi.mock("firebase/auth", () => ({
  onAuthStateChanged: mocks.subscribe,
}));

vi.mock("@/lib/firebase/client", () => ({
  getFirebaseUI: mocks.getUI,
}));

describe("AuthNavButton", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.subscribe.mockReturnValue(mocks.unsubscribe);
    mocks.getUI.mockReturnValue({
      get: () => ({ auth: {} }),
    });
  });

  afterEach(cleanup);

  it("renders 'Sign In' linking to /sign-in when logged out", () => {
    render(<AuthNavButton />);
    const link = screen.getByRole("link", { name: en.App.signIn });
    expect(link.getAttribute("href")).toBe("/sign-in");

    act(() => {
      mocks.subscribe.mock.calls[0][1](null);
    });

    const updatedLink = screen.getByRole("link", { name: en.App.signIn });
    expect(updatedLink.getAttribute("href")).toBe("/sign-in");
  });

  it("renders 'Open App' linking to /profile when logged in", () => {
    render(<AuthNavButton />);

    act(() => {
      mocks.subscribe.mock.calls[0][1]({ uid: "user-123" });
    });

    const link = screen.getByRole("link", { name: en.App.openApp });
    expect(link.getAttribute("href")).toBe("/profile");
  });

  it("updates back to 'Sign In' when user signs out", () => {
    render(<AuthNavButton />);

    act(() => {
      mocks.subscribe.mock.calls[0][1]({ uid: "user-123" });
    });
    expect(
      screen.getByRole("link", { name: en.App.openApp }).getAttribute("href"),
    ).toBe("/profile");

    act(() => {
      mocks.subscribe.mock.calls[0][1](null);
    });
    expect(
      screen.getByRole("link", { name: en.App.signIn }).getAttribute("href"),
    ).toBe("/sign-in");
  });

  it("handles configuration errors gracefully and defaults to 'Sign In'", () => {
    mocks.getUI.mockImplementation(() => {
      throw new Error("missing configuration");
    });

    render(<AuthNavButton />);
    const link = screen.getByRole("link", { name: en.App.signIn });
    expect(link.getAttribute("href")).toBe("/sign-in");
  });

  it("cleans up auth subscription on unmount", () => {
    const { unmount } = render(<AuthNavButton />);
    expect(mocks.unsubscribe).not.toHaveBeenCalled();
    unmount();
    expect(mocks.unsubscribe).toHaveBeenCalledTimes(1);
  });
});
