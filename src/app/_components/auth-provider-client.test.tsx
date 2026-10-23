import { act, cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AuthProvider } from "./auth-provider-client";

const mocks = vi.hoisted(() => ({
  router: { replace: vi.fn() },
  subscribe: vi.fn(),
  setLocale: vi.fn(),
  getUI: vi.fn(),
}));
vi.mock("next/navigation", () => ({
  useRouter: () => mocks.router,
}));
vi.mock("next-intl", () => ({
  useLocale: () => "pt-BR",
  useTranslations: () => (key: string) => key,
}));
vi.mock("firebase/auth", () => ({ onAuthStateChanged: mocks.subscribe }));
vi.mock("@/lib/firebase/client", () => ({ getFirebaseUI: mocks.getUI }));
vi.mock("@firebase-oss/ui-react", () => ({
  FirebaseUIProvider: ({ children }: { children: React.ReactNode }) => children,
}));

describe("AuthProvider", () => {
  afterEach(() => {
    cleanup();
    window.history.replaceState(null, "", "/");
  });
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.getUI.mockReturnValue({
      get: () => ({ auth: {}, setLocale: mocks.setLocale }),
    });
    mocks.subscribe.mockReturnValue(() => {});
  });

  it("waits for the first auth state and renders the screen for a signed-out user", () => {
    render(
      <AuthProvider>
        <p>{"Screen"}</p>
      </AuthProvider>,
    );
    expect(screen.getByRole("status")).toBeTruthy();
    expect(screen.queryByText("Screen")).toBeNull();
    expect(mocks.setLocale).toHaveBeenCalled();
    act(() => mocks.subscribe.mock.calls[0][1](null));
    expect(screen.getByText("Screen")).toBeTruthy();
  });

  it("redirects a signed-in user without displaying the screen", () => {
    render(
      <AuthProvider>
        <p>{"Screen"}</p>
      </AuthProvider>,
    );
    act(() => mocks.subscribe.mock.calls[0][1]({ uid: "user" }));
    expect(mocks.router.replace).toHaveBeenCalledWith("/");
    expect(screen.queryByText("Screen")).toBeNull();
  });

  it("shows a configuration error", () => {
    mocks.getUI.mockImplementation(() => {
      throw new Error("missing configuration");
    });
    const log = vi.spyOn(console, "error").mockImplementation(() => {});
    render(
      <AuthProvider>
        <p>{"Screen"}</p>
      </AuthProvider>,
    );
    expect(screen.getByRole("alert").textContent).toBe("configurationError");
    log.mockRestore();
  });

  it.each([
    ["/profile?tab=security", "/profile?tab=security"],
    ["https://evil.example", "/"],
    ["/sign-in", "/"],
  ])("redirects safely after sign-in with next=%s", (next, destination) => {
    window.history.replaceState(
      null,
      "",
      `/sign-in?next=${encodeURIComponent(next)}`,
    );
    render(
      <AuthProvider>
        <p>{"Screen"}</p>
      </AuthProvider>,
    );
    act(() => mocks.subscribe.mock.calls[0][1]({ uid: "user" }));
    expect(mocks.router.replace).toHaveBeenCalledWith(destination);
    expect(screen.queryByText("Screen")).toBeNull();
  });
});
