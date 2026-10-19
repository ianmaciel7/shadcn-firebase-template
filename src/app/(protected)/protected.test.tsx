import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import ProtectedLayout from "./layout";
import ProfilePage from "./profile/page";

const mocks = vi.hoisted(() => ({
  router: { replace: vi.fn(), push: vi.fn(), refresh: vi.fn() },
  subscribe: vi.fn(),
  signOut: vi.fn(),
  updateProfile: vi.fn(),
  verifyBeforeUpdateEmail: vi.fn(),
  uploadBytes: vi.fn(),
  getDownloadURL: vi.fn(),
  getUI: vi.fn(),
  getStorage: vi.fn(),
  readPreferences: vi.fn(),
  writePreferences: vi.fn(),
  setTheme: vi.fn(),
  currentUser: null as unknown,
}));

vi.mock("next/navigation", () => ({
  useRouter: () => mocks.router,
}));

vi.mock("next-intl", () => ({
  hasLocale: (locales: readonly string[], value: unknown) =>
    typeof value === "string" && locales.includes(value),
  useTranslations: () => (key: string) => key,
  useLocale: () => "en",
}));

vi.mock("next-themes", () => ({
  useTheme: () => ({ theme: "system", setTheme: mocks.setTheme }),
}));

vi.mock("firebase/auth", () => ({
  onAuthStateChanged: mocks.subscribe,
  signOut: mocks.signOut,
  updateProfile: mocks.updateProfile,
  verifyBeforeUpdateEmail: mocks.verifyBeforeUpdateEmail,
}));

vi.mock("firebase/storage", () => ({
  getDownloadURL: mocks.getDownloadURL,
  ref: vi.fn(() => "avatar-ref"),
  uploadBytes: mocks.uploadBytes,
}));

vi.mock("@/lib/firebase", () => ({
  getFirebaseStorage: mocks.getStorage,
  getFirebaseUI: mocks.getUI,
}));

vi.mock("@/app/(protected)/profile/_lib/user-preferences", () => ({
  isThemePreference: (value: unknown) =>
    value === "light" || value === "dark" || value === "system",
  readUserPreferences: mocks.readPreferences,
  themePreferences: ["light", "dark", "system"],
  writeUserPreferences: mocks.writePreferences,
}));

describe("Protected area", () => {
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
    mocks.subscribe.mockReturnValue(() => {});
    mocks.readPreferences.mockResolvedValue({});
    mocks.writePreferences.mockResolvedValue(undefined);
    mocks.updateProfile.mockResolvedValue(undefined);
    mocks.verifyBeforeUpdateEmail.mockResolvedValue(undefined);
    mocks.uploadBytes.mockResolvedValue(undefined);
    mocks.getDownloadURL.mockResolvedValue("https://example.com/avatar.png");
    mocks.getStorage.mockReturnValue("storage");
  });

  afterEach(cleanup);

  describe("ProtectedLayout", () => {
    it("renders loading indicator before auth resolves", () => {
      render(
        <ProtectedLayout params={Promise.resolve({})}>
          <div>{"Protected Content"}</div>
        </ProtectedLayout>,
      );
      expect(screen.getByRole("status").textContent).toBe("loading");
      expect(screen.queryByText("Protected Content")).toBeNull();
    });

    it("redirects unauthenticated user to /sign-in", () => {
      let authCallback: (user: unknown) => void = () => {};
      mocks.subscribe.mockImplementation((_auth, callback) => {
        authCallback = callback;
        return () => {};
      });
      render(
        <ProtectedLayout params={Promise.resolve({})}>
          <div>{"Protected Content"}</div>
        </ProtectedLayout>,
      );
      act(() => {
        authCallback(null);
      });
      expect(mocks.router.replace).toHaveBeenCalledWith("/sign-in");
      expect(screen.queryByText("Protected Content")).toBeNull();
    });

    it("renders children when authenticated", () => {
      let authCallback: (user: unknown) => void = () => {};
      mocks.subscribe.mockImplementation((_auth, callback) => {
        authCallback = callback;
        return () => {};
      });
      render(
        <ProtectedLayout params={Promise.resolve({})}>
          <div>{"Protected Content"}</div>
        </ProtectedLayout>,
      );
      act(() => {
        authCallback({ uid: "user-123" });
      });
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

  describe("ProfilePage", () => {
    it("renders nothing when user is null", () => {
      mocks.currentUser = null;
      const { container } = render(<ProfilePage />);
      expect(container.firstChild).toBeNull();
    });

    it("renders user information with fallback when fields are not set", () => {
      mocks.currentUser = { uid: "user-123", email: null, displayName: null };
      render(<ProfilePage />);
      expect(screen.getByText("personalInfoTitle")).toBeTruthy();
      expect(screen.getByDisplayValue("user-123")).toBeTruthy();
      expect(screen.getAllByPlaceholderText("notSet").length).toBe(1);
      expect(
        (screen.getByLabelText("emailLabel") as HTMLInputElement).value,
      ).toBe("");
    });

    it("renders user profile with displayName, email, and photoURL", () => {
      mocks.currentUser = {
        uid: "uid-abc",
        email: "user@example.com",
        displayName: "Ada Lovelace",
        photoURL: "https://example.com/photo.jpg",
      };
      render(<ProfilePage />);
      expect(
        (screen.getByLabelText("displayNameLabel") as HTMLInputElement).value,
      ).toBe("Ada Lovelace");
      expect(
        (screen.getByLabelText("emailLabel") as HTMLInputElement).value,
      ).toBe("user@example.com");
      expect(screen.getByDisplayValue("uid-abc")).toBeTruthy();
      expect(screen.getByText("backToHome").getAttribute("href")).toBe("/");
    });

    it("renders language and theme preferences", () => {
      mocks.currentUser = { uid: "user-123" };

      render(<ProfilePage />);

      expect(screen.getByText("preferencesTitle")).toBeTruthy();
      expect(screen.getByLabelText("languageLabel")).toBeTruthy();
      expect(screen.getByLabelText("themeLabel")).toBeTruthy();
    });

    it("uploads a new avatar and updates the auth profile", async () => {
      const reload = vi.fn().mockResolvedValue(undefined);
      mocks.currentUser = {
        uid: "user-123",
        email: "user@example.com",
        reload,
      };
      render(<ProfilePage />);

      const file = new File(["avatar"], "avatar.png", { type: "image/png" });
      fireEvent.change(screen.getByLabelText("profilePhotoChange"), {
        target: { files: [file] },
      });

      await waitFor(() =>
        expect(mocks.uploadBytes).toHaveBeenCalledWith("avatar-ref", file, {
          contentType: "image/png",
        }),
      );
      expect(mocks.updateProfile).toHaveBeenCalledWith(mocks.currentUser, {
        photoURL: "https://example.com/avatar.png",
      });
      expect(reload).toHaveBeenCalled();
    });

    it("applies saved preferences from the user's document", async () => {
      mocks.currentUser = { uid: "user-123" };
      mocks.readPreferences.mockResolvedValue({ locale: "es", theme: "dark" });

      render(<ProfilePage />);

      await waitFor(() => expect(mocks.setTheme).toHaveBeenCalledWith("dark"));
      expect(mocks.readPreferences).toHaveBeenCalledWith("user-123");
    });

    it("saves a changed theme preference", async () => {
      mocks.currentUser = { uid: "user-123" };
      render(<ProfilePage />);

      fireEvent.click(screen.getByLabelText("themeLabel"));
      const darkOption = await screen.findByRole("option", {
        name: "themeOptions.dark",
      });
      fireEvent.pointerDown(darkOption);
      fireEvent.pointerUp(darkOption);
      fireEvent.click(darkOption);

      await waitFor(() =>
        expect(mocks.writePreferences).toHaveBeenCalledWith("user-123", {
          theme: "dark",
        }),
      );
      expect(mocks.setTheme).toHaveBeenCalledWith("dark");
    });

    it("updates the display name and requests email verification", async () => {
      mocks.currentUser = {
        uid: "user-123",
        email: "old@example.com",
        displayName: "Old Name",
      };
      render(<ProfilePage />);

      fireEvent.change(screen.getByLabelText("displayNameLabel"), {
        target: { value: "New Name" },
      });
      fireEvent.change(screen.getByLabelText("emailLabel"), {
        target: { value: "new@example.com" },
      });
      fireEvent.click(screen.getByRole("button", { name: "saveProfile" }));

      await waitFor(() =>
        expect(mocks.updateProfile).toHaveBeenCalledWith(mocks.currentUser, {
          displayName: "New Name",
        }),
      );
      expect(mocks.verifyBeforeUpdateEmail).toHaveBeenCalledWith(
        mocks.currentUser,
        "new@example.com",
      );
      expect(screen.getByText("emailVerificationSent")).toBeTruthy();
    });

    it("saves a changed language preference and refreshes the route", async () => {
      mocks.currentUser = { uid: "user-123" };
      render(<ProfilePage />);

      fireEvent.click(screen.getByLabelText("languageLabel"));
      const spanishOption = await screen.findByRole("option", {
        name: "languageOptions.es",
      });
      fireEvent.pointerDown(spanishOption);
      fireEvent.pointerUp(spanishOption);
      fireEvent.click(spanishOption);

      await waitFor(() =>
        expect(mocks.writePreferences).toHaveBeenCalledWith("user-123", {
          locale: "es",
        }),
      );
      expect(mocks.router.refresh).toHaveBeenCalled();
    });

    it("updates user state on auth change event", () => {
      mocks.currentUser = null;
      let authCallback: (user: unknown) => void = () => {};
      mocks.subscribe.mockImplementation((_auth, callback) => {
        authCallback = callback;
        return () => {};
      });
      render(<ProfilePage />);
      act(() => {
        authCallback({
          uid: "uid-dynamic",
          email: "dynamic@example.com",
          displayName: "Dynamic User",
        });
      });
      expect(
        (screen.getByLabelText("displayNameLabel") as HTMLInputElement).value,
      ).toBe("Dynamic User");
    });

    it("signs out and redirects to /sign-in on click", async () => {
      mocks.currentUser = { uid: "user-123" };
      mocks.signOut.mockResolvedValue(undefined);
      render(<ProfilePage />);
      const signOutBtn = screen.getByRole("button", { name: "signOut" });
      await act(async () => {
        fireEvent.click(signOutBtn);
      });
      expect(mocks.signOut).toHaveBeenCalled();
      expect(mocks.router.replace).toHaveBeenCalledWith("/sign-in");
    });

    it("redirects to /sign-in even if sign out fails", async () => {
      mocks.currentUser = { uid: "user-123" };
      mocks.signOut.mockRejectedValue(new Error("sign out failed"));
      const log = vi.spyOn(console, "error").mockImplementation(() => {});
      render(<ProfilePage />);
      const signOutBtn = screen.getByRole("button", { name: "signOut" });
      await act(async () => {
        fireEvent.click(signOutBtn);
      });
      expect(mocks.router.replace).toHaveBeenCalledWith("/sign-in");
      log.mockRestore();
    });
  });
});
