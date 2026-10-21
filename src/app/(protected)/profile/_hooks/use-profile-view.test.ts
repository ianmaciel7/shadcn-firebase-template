import { renderHook } from "@testing-library/react";
import type { User } from "firebase/auth";
import { describe, expect, it, vi } from "vitest";
import type { useProfileSession } from "./use-profile-session";
import { useProfileView } from "./use-profile-view";

vi.mock("next-intl", () => ({ useTranslations: () => (key: string) => key }));

type Session = ReturnType<typeof useProfileSession>;
const user = { uid: "user-123" } as User;
const values = {
  displayName: "Ada",
  email: "ada@example.com",
  locale: "en" as const,
  theme: "system" as const,
};

function session(overrides: Partial<Session> = {}): Session {
  return {
    activeLocale: "en",
    authReady: true,
    avatarVersion: 0,
    defaultValues: values,
    error: null,
    photoURL: null,
    preferencesReady: true,
    savedValuesRef: { current: values },
    setAvatarVersion: vi.fn(),
    setPhotoURL: vi.fn(),
    setTheme: vi.fn(),
    user,
    ...overrides,
  };
}

describe("useProfileView", () => {
  it.each([
    session({ authReady: false }),
    session({ preferencesReady: false }),
  ])("waits for authentication and user preferences", (pending) => {
    const { result } = renderHook(() => useProfileView(pending));
    expect(result.current).toEqual({ status: "loading" });
  });

  it("hides the profile after unauthenticated redirect without an error", () => {
    const { result } = renderHook(() =>
      useProfileView(session({ user: null, defaultValues: null })),
    );
    expect(result.current).toEqual({ status: "hidden" });
  });

  it.each([
    { error: "Session unavailable", expected: "Session unavailable" },
    { error: null, expected: "profileSaveError" },
  ])(
    "resolves a missing-defaults error in the hook: $expected",
    ({ error, expected }) => {
      const { result } = renderHook(() =>
        useProfileView(session({ defaultValues: null, error })),
      );
      expect(result.current).toEqual({ status: "error", message: expected });
    },
  );

  it("renders an authentication error instead of hiding it", () => {
    const { result } = renderHook(() =>
      useProfileView(session({ user: null, error: "Authentication failed" })),
    );
    expect(result.current).toEqual({
      status: "error",
      message: "Authentication failed",
    });
  });

  it("provides the authenticated user's identity only when ready", () => {
    const { result } = renderHook(() => useProfileView(session()));
    expect(result.current).toEqual({ status: "ready", userId: "user-123" });
  });
});
