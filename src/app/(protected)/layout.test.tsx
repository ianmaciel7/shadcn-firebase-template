import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import ProtectedLayout from "./layout";

const mocks = vi.hoisted(() => ({
  router: { replace: vi.fn() },
  subscribe: vi.fn(),
  getUI: vi.fn(),
  currentUser: null as unknown,
}));

vi.mock("next/navigation", () => ({
  useRouter: () => mocks.router,
}));

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

vi.mock("firebase/auth", () => ({
  onAuthStateChanged: mocks.subscribe,
}));

vi.mock("@/lib/firebase/client", () => ({
  getFirebaseUI: mocks.getUI,
}));

describe("ProtectedLayout", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.getUI.mockReturnValue({
      get: () => ({
        auth: {
          get currentUser() {
            return mocks.currentUser;
          },
        },
      }),
    });
    mocks.subscribe.mockImplementation((_auth, callback) => {
      callback(mocks.currentUser);
      return () => {};
    });
  });

  afterEach(() => {
    cleanup();
    window.history.replaceState(null, "", "/");
  });

  it("renders loading indicator before auth resolves", () => {
    mocks.subscribe.mockReturnValue(() => {});
    render(
      <ProtectedLayout params={Promise.resolve({})}>
        <div>{"Protected Content"}</div>
      </ProtectedLayout>,
    );
    expect(screen.getByRole("status").textContent).toBe("loading");
    expect(screen.queryByText("Protected Content")).toBeNull();
  });

  it("redirects unauthenticated user to sign-in with return destination", () => {
    mocks.currentUser = null;
    window.history.replaceState(null, "", "/profile?tab=security");
    render(
      <ProtectedLayout params={Promise.resolve({})}>
        <div>{"Protected Content"}</div>
      </ProtectedLayout>,
    );
    expect(mocks.router.replace).toHaveBeenCalledWith(
      `/sign-in?next=${encodeURIComponent("/profile?tab=security")}`,
    );
    expect(screen.queryByText("Protected Content")).toBeNull();
  });

  it("renders children when authenticated", () => {
    mocks.currentUser = { uid: "user-123" };
    render(
      <ProtectedLayout params={Promise.resolve({})}>
        <div>{"Protected Content"}</div>
      </ProtectedLayout>,
    );
    expect(screen.getByText("Protected Content")).toBeTruthy();
  });

  it("shows configuration error when getFirebaseUI throws", () => {
    mocks.getUI.mockImplementation(() => {
      throw new Error("missing config");
    });
    const log = vi.spyOn(console, "error").mockImplementation(() => {});
    render(
      <ProtectedLayout params={Promise.resolve({})}>
        <div>{"Protected Content"}</div>
      </ProtectedLayout>,
    );
    expect(screen.getByRole("alert").textContent).toBe("configurationError");
    log.mockRestore();
  });
});
