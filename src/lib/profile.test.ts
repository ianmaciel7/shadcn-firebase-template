import type { User } from "firebase/auth";
import { describe, expect, it, vi } from "vitest";
import {
  type ProfileDependencies,
  type ProfileValues,
  saveProfile,
} from "./profile";

const initial: ProfileValues = {
  displayName: "Before",
  email: "old@example.test",
  locale: "en",
  theme: "system",
};

function createDependencies() {
  const dependencies = {
    getActiveUser: vi.fn((user: User) => user),
    verifyBeforeUpdateEmail: vi.fn(async () => {}),
    updateProfile: vi.fn(async () => {}),
    uploadAvatar: vi.fn(async () => "https://example.test/avatar.png"),
    writeUserPreferences: vi.fn(async () => {}),
  } satisfies ProfileDependencies;
  return dependencies;
}

describe("saveProfile dependency boundaries", () => {
  it("runs only necessary adapters for unchanged profile data", async () => {
    const user = {
      uid: "user-1",
      email: initial.email,
      displayName: initial.displayName,
      photoURL: null,
    } as User;
    const dependencies = createDependencies();

    const result = await saveProfile(
      { user, previous: initial, values: initial, avatarFile: null },
      dependencies,
    );

    expect(dependencies.getActiveUser).toHaveBeenCalledWith(user);
    expect(dependencies.verifyBeforeUpdateEmail).not.toHaveBeenCalled();
    expect(dependencies.updateProfile).not.toHaveBeenCalled();
    expect(dependencies.writeUserPreferences).not.toHaveBeenCalled();
    expect(dependencies.uploadAvatar).toHaveBeenCalledWith(user, null);
    expect(result.emailChanged).toBe(false);
    expect(result.avatarChanged).toBe(false);
  });

  it("orchestrates profile, email, avatar and preference updates through injected adapters", async () => {
    const user = {
      uid: "user-1",
      email: initial.email,
      displayName: initial.displayName,
    } as User;
    const values: ProfileValues = {
      displayName: "After",
      email: "new@example.test",
      locale: "es",
      theme: "dark",
    };
    const file = new File(["avatar"], "avatar.png", { type: "image/png" });
    const dependencies = createDependencies();

    const result = await saveProfile(
      { user, previous: initial, values, avatarFile: file },
      dependencies,
    );

    expect(dependencies.verifyBeforeUpdateEmail).toHaveBeenCalledWith(
      user,
      values.email,
    );
    expect(dependencies.updateProfile).toHaveBeenCalledWith(user, {
      displayName: values.displayName,
      photoURL: "https://example.test/avatar.png",
    });
    expect(dependencies.writeUserPreferences).toHaveBeenCalledWith(user.uid, {
      locale: "es",
      theme: "dark",
    });
    expect(dependencies.uploadAvatar).toHaveBeenCalledWith(user, file);
    expect(result).toMatchObject({
      emailChanged: true,
      avatarChanged: true,
      photoURL: "https://example.test/avatar.png",
    });
    expect(result.values.email).toBe(initial.email);
  });

  it("does not persist other changes after email verification fails", async () => {
    const user = {
      uid: "user-1",
      email: initial.email,
      displayName: initial.displayName,
    } as User;
    const dependencies = createDependencies();
    dependencies.verifyBeforeUpdateEmail.mockRejectedValueOnce(
      new Error("verification unavailable"),
    );
    await expect(
      saveProfile(
        {
          user,
          previous: initial,
          values: { ...initial, email: "new@example.test" },
          avatarFile: null,
        },
        dependencies,
      ),
    ).rejects.toThrow("verification unavailable");
    expect(dependencies.uploadAvatar).not.toHaveBeenCalled();
    expect(dependencies.writeUserPreferences).not.toHaveBeenCalled();
    expect(dependencies.updateProfile).not.toHaveBeenCalled();
  });
});
