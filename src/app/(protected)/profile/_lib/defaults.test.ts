import { beforeEach, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ read: vi.fn(), getUI: vi.fn() }));
vi.mock("@/lib/firebase/client", () => ({ getFirebaseUI: mocks.getUI }));
vi.mock("@/lib/firebase/firestore/user-preferences", () => ({
  readUserPreferences: mocks.read,
}));

import { readProfileDefaults } from "./defaults";

beforeEach(() => {
  vi.resetAllMocks();
  mocks.read.mockResolvedValue({});
  mocks.getUI.mockReturnValue({
    get: () => ({
      auth: { currentUser: { uid: "user", displayName: null, email: null } },
    }),
  });
});

it("normalizes missing preferences using the active locale and system theme", async () => {
  expect(await readProfileDefaults("user", "pt-BR", () => true)).toEqual({
    values: { displayName: "", email: "", locale: "pt-BR", theme: "system" },
    theme: undefined,
  });
});

it("preserves stored locale and theme", async () => {
  mocks.read.mockResolvedValue({ locale: "es", theme: "dark" });
  expect(await readProfileDefaults("user", "en", () => true)).toMatchObject({
    values: { locale: "es", theme: "dark" },
    theme: "dark",
  });
});

it("does not read a client session after the owning lifecycle was cancelled", async () => {
  const read = Promise.withResolvers<object>();
  mocks.read.mockReturnValue(read.promise);
  let active = true;
  const pending = readProfileDefaults("user", "en", () => active);
  active = false;
  read.resolve({});
  expect(await pending).toBeNull();
  expect(mocks.getUI).not.toHaveBeenCalled();
});

it("rejects defaults resolved after the active user changes", async () => {
  mocks.getUI.mockReturnValue({
    get: () => ({ auth: { currentUser: { uid: "other" } } }),
  });
  expect(await readProfileDefaults("user", "en", () => true)).toBeNull();
});
