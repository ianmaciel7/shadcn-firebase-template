import { act, cleanup, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import en from "@/messages/en.json";
import { HomeContent } from "./home-content";

const mocks = vi.hoisted(() => ({
  subscribe: vi.fn(),
  unsubscribe: vi.fn(),
  getUI: vi.fn(),
}));
vi.mock("firebase/auth", () => ({ onAuthStateChanged: mocks.subscribe }));
vi.mock("@/lib/firebase/client", () => ({ getFirebaseUI: mocks.getUI }));

function renderHome() {
  return render(
    <NextIntlClientProvider locale="en" messages={en}>
      <HomeContent />
    </NextIntlClientProvider>,
  );
}

describe("home session", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.subscribe.mockReturnValue(mocks.unsubscribe);
    mocks.getUI.mockReturnValue({ get: () => ({ auth: {} }) });
  });
  afterEach(cleanup);
  it("waits for authentication before offering registration", () => {
    renderHome();
    expect(screen.queryByRole("link", { name: en.Home.getStarted })).toBeNull();
    expect(screen.queryByRole("heading", { level: 1 })).toBeNull();
    expect(screen.getByRole("status").textContent).toBe(en.Home.loading);
    act(() => mocks.subscribe.mock.calls[0][1](null));
    expect(
      screen
        .getByRole("link", { name: en.Home.getStarted })
        .getAttribute("href"),
    ).toBe("/register");
    expect(
      screen.getByRole("link", { name: en.Home.signIn }).getAttribute("href"),
    ).toBe("/sign-in");
  });
  it("personalizes the home and returns to visitor actions after sign out", () => {
    const { unmount } = renderHome();
    act(() =>
      mocks.subscribe.mock.calls[0][1]({
        displayName: "Alex Smith",
        email: "alex@example.test",
      }),
    );
    expect(screen.getByRole("heading", { level: 1 }).textContent).toContain(
      "Welcome, Alex Smith.",
    );
    expect(
      screen
        .getByRole("link", { name: en.Home.manageAccount })
        .getAttribute("href"),
    ).toBe("/profile");
    expect(screen.queryByRole("link", { name: en.Home.getStarted })).toBeNull();
    act(() => mocks.subscribe.mock.calls[0][1](null));
    expect(
      screen.getByRole("link", { name: en.Home.getStarted }),
    ).toBeDefined();
    unmount();
    expect(mocks.unsubscribe).toHaveBeenCalledOnce();
  });
  it("keeps visitor access available if Firebase configuration is missing", () => {
    mocks.getUI.mockImplementation(() => {
      throw new Error("missing configuration");
    });
    renderHome();
    expect(
      screen.getByRole("link", { name: en.Home.signIn }).getAttribute("href"),
    ).toBe("/sign-in");
  });
});
