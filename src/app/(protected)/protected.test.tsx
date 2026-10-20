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
  toastAdd: vi.fn(),
  currentUser: null as unknown,
}));

vi.mock("next/navigation", () => ({
  useRouter: () => mocks.router,
}));

vi.mock("@/i18n/navigation", () => ({
  Link: ({
    href,
    children,
    ...props
  }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
  usePathname: () => "/profile",
  useRouter: () => mocks.router,
}));

const translate = (key: string) => key;

vi.mock("next-intl", () => ({
  hasLocale: (locales: readonly string[], value: unknown) =>
    typeof value === "string" && locales.includes(value),
  useTranslations: () => translate,
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

vi.mock("@/lib/firebase/client", () => ({
  getFirebaseStorage: mocks.getStorage,
  getFirebaseUI: mocks.getUI,
}));

vi.mock("@/components/ui/toast", () => ({
  toast: {
    add: mocks.toastAdd,
  },
}));

vi.mock("@/lib/firebase/firestore/user-preferences", () => ({
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
    mocks.subscribe.mockImplementation((_auth, callback) => {
      callback(mocks.currentUser);
      return () => {};
    });
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
      mocks.subscribe.mockReturnValue(() => {});
      render(
        <ProtectedLayout params={Promise.resolve({})}>
          <div>{"Protected Content"}</div>
        </ProtectedLayout>,
      );
      expect(screen.getByRole("status").textContent).toBe("loading");
      expect(screen.queryByText("Protected Content")).toBeNull();
    });

    it("redirects unauthenticated user to /sign-in", () => {
      mocks.currentUser = null;
      render(
        <ProtectedLayout params={Promise.resolve({})}>
          <div>{"Protected Content"}</div>
        </ProtectedLayout>,
      );
      expect(mocks.router.replace).toHaveBeenCalledWith("/sign-in");
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

  describe("ProfilePage", () => {
    it("renders nothing when user is null", () => {
      mocks.currentUser = null;
      const { container } = render(<ProfilePage />);
      expect(container.firstChild).toBeNull();
      expect(mocks.router.replace).toHaveBeenCalledWith("/sign-in");
    });

    it("renders user information with fallback when fields are not set", async () => {
      mocks.currentUser = { uid: "user-123", email: null, displayName: null };
      render(<ProfilePage />);

      await waitFor(() => {
        expect(screen.getByText("personalInfoTitle")).toBeTruthy();
      });
      expect(screen.getByPlaceholderText("notSet")).toBeTruthy();
      expect(
        (screen.getByLabelText("emailLabel") as HTMLInputElement).value,
      ).toBe("");
    });

    it("renders user profile with displayName, email, and photoURL", async () => {
      mocks.currentUser = {
        uid: "uid-abc",
        email: "user@example.com",
        displayName: "Ada Lovelace",
        photoURL: "https://example.com/photo.jpg",
      };
      render(<ProfilePage />);

      await waitFor(() => {
        expect(
          (screen.getByLabelText("displayNameLabel") as HTMLInputElement).value,
        ).toBe("Ada Lovelace");
      });
      expect(
        (screen.getByLabelText("emailLabel") as HTMLInputElement).value,
      ).toBe("user@example.com");
    });

    it("renders language and theme preferences", async () => {
      mocks.currentUser = { uid: "user-123" };

      render(<ProfilePage />);

      await waitFor(() => {
        expect(screen.getByLabelText("languageLabel")).toBeTruthy();
      });
      expect(screen.getByLabelText("themeLabel")).toBeTruthy();
    });

    it("uploads a new avatar and updates the auth profile", async () => {
      mocks.currentUser = {
        uid: "user-123",
        email: "user@example.com",
      };
      render(<ProfilePage />);

      const file = new File(["avatar"], "avatar.png", { type: "image/png" });
      fireEvent.change(await screen.findByLabelText("profilePhotoChange"), {
        target: { files: [file] },
      });
      fireEvent.click(screen.getByRole("button", { name: "saveProfile" }));

      await waitFor(() =>
        expect(mocks.uploadBytes).toHaveBeenCalledWith("avatar-ref", file, {
          contentType: "image/png",
        }),
      );
      expect(mocks.updateProfile).toHaveBeenCalledWith(mocks.currentUser, {
        displayName: null,
        photoURL: "https://example.com/avatar.png",
      });
      expect(mocks.toastAdd).toHaveBeenCalledWith({
        title: "profileSaved",
        type: "success",
      });
    });

    it("shows error toast when invalid avatar is chosen", async () => {
      mocks.currentUser = { uid: "user-123", email: "user@example.com" };
      render(<ProfilePage />);

      const file = new File(["test"], "test.txt", { type: "text/plain" });
      fireEvent.change(await screen.findByLabelText("profilePhotoChange"), {
        target: { files: [file] },
      });

      expect(mocks.toastAdd).toHaveBeenCalledWith({
        title: "profilePhotoInvalid",
        type: "error",
      });
    });

    it("applies saved preferences from the user's document", async () => {
      mocks.currentUser = { uid: "user-123" };
      mocks.readPreferences.mockResolvedValue({ locale: "es", theme: "dark" });

      render(<ProfilePage />);

      await waitFor(() => expect(mocks.setTheme).toHaveBeenCalledWith("dark"));
      expect(mocks.readPreferences).toHaveBeenCalledWith("user-123");
    });

    it("saves a changed theme preference and shows success toast", async () => {
      mocks.currentUser = { uid: "user-123", email: "user@example.com" };
      render(<ProfilePage />);

      fireEvent.click(await screen.findByLabelText("themeLabel"));
      const darkOption = await screen.findByRole("option", {
        name: "themeOptions.dark",
      });
      fireEvent.pointerDown(darkOption);
      fireEvent.pointerUp(darkOption);
      fireEvent.click(darkOption);

      fireEvent.click(screen.getByRole("button", { name: "saveProfile" }));

      await waitFor(() =>
        expect(mocks.writePreferences).toHaveBeenCalledWith("user-123", {
          locale: "en",
          theme: "dark",
        }),
      );
      expect(mocks.setTheme).toHaveBeenCalledWith("dark");
      expect(mocks.toastAdd).toHaveBeenCalledWith({
        title: "profileSaved",
        type: "success",
      });
    });

    it("updates the display name and requests email verification with toast", async () => {
      mocks.currentUser = {
        uid: "user-123",
        email: "old@example.com",
        displayName: "Old Name",
      };
      render(<ProfilePage />);

      fireEvent.change(await screen.findByLabelText("displayNameLabel"), {
        target: { value: "New Name" },
      });
      fireEvent.change(screen.getByLabelText("emailLabel"), {
        target: { value: "new@example.com" },
      });
      fireEvent.click(screen.getByRole("button", { name: "saveProfile" }));

      await waitFor(() =>
        expect(mocks.updateProfile).toHaveBeenCalledWith(mocks.currentUser, {
          displayName: "New Name",
          photoURL: undefined,
        }),
      );
      expect(mocks.verifyBeforeUpdateEmail).toHaveBeenCalledWith(
        mocks.currentUser,
        "new@example.com",
      );
      expect(mocks.toastAdd).toHaveBeenCalledWith({
        title: "emailVerificationSent",
        type: "success",
      });
    });

    it("saves a changed language preference and replaces the route", async () => {
      mocks.currentUser = { uid: "user-123", email: "user@example.com" };
      render(<ProfilePage />);

      fireEvent.click(await screen.findByLabelText("languageLabel"));
      const spanishOption = await screen.findByRole("option", {
        name: "languageOptions.es",
      });
      fireEvent.pointerDown(spanishOption);
      fireEvent.pointerUp(spanishOption);
      fireEvent.click(spanishOption);

      fireEvent.click(screen.getByRole("button", { name: "saveProfile" }));

      await waitFor(() =>
        expect(mocks.writePreferences).toHaveBeenCalledWith("user-123", {
          locale: "es",
          theme: "system",
        }),
      );
      expect(mocks.router.replace).toHaveBeenCalledWith("/profile", {
        locale: "es",
      });
      expect(mocks.toastAdd).toHaveBeenCalledWith({
        title: "profileSaved",
        type: "success",
      });
    });

    it("updates user state on auth change event", async () => {
      mocks.currentUser = null;
      let authCallback: (user: unknown) => void = () => {};
      mocks.subscribe.mockImplementation((_auth, callback) => {
        authCallback = callback;
        return () => {};
      });
      render(<ProfilePage />);
      const dynamicUser = {
        uid: "uid-dynamic",
        email: "dynamic@example.com",
        displayName: "Dynamic User",
      };
      mocks.currentUser = dynamicUser;
      act(() => {
        authCallback(dynamicUser);
      });
      expect(
        ((await screen.findByLabelText("displayNameLabel")) as HTMLInputElement)
          .value,
      ).toBe("Dynamic User");
    });

    it("signs out and redirects to /sign-in on click", async () => {
      mocks.currentUser = { uid: "user-123" };
      mocks.signOut.mockResolvedValue(undefined);
      render(<ProfilePage />);
      const signOutBtn = await screen.findByRole("button", { name: "signOut" });
      expect(signOutBtn.closest('[data-slot="card-content"]')).toBeTruthy();
      await act(async () => {
        fireEvent.click(signOutBtn);
      });
      expect(mocks.signOut).toHaveBeenCalled();
      expect(mocks.router.replace).toHaveBeenCalledWith("/sign-in");
    });

    it("shows error toast when sign out fails", async () => {
      mocks.currentUser = { uid: "user-123" };
      mocks.signOut.mockRejectedValue(new Error("sign out failed"));
      const log = vi.spyOn(console, "error").mockImplementation(() => {});
      render(<ProfilePage />);
      const signOutBtn = await screen.findByRole("button", { name: "signOut" });
      expect(signOutBtn.closest('[data-slot="card-content"]')).toBeTruthy();
      await act(async () => {
        fireEvent.click(signOutBtn);
      });
      expect(mocks.toastAdd).toHaveBeenCalledWith({
        title: "profileSaveError",
        type: "error",
      });
      log.mockRestore();
    });
  });
});
