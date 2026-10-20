import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  db: { name: "firestore" },
  ref: { path: "users/user-123" },
  doc: vi.fn(),
  getDoc: vi.fn(),
  setDoc: vi.fn(),
  getFirestore: vi.fn(),
}));

vi.mock("firebase/firestore", () => ({
  doc: mocks.doc,
  getDoc: mocks.getDoc,
  setDoc: mocks.setDoc,
}));

vi.mock("@/lib/firebase/client", () => ({
  getFirebaseFirestore: mocks.getFirestore,
}));

describe("user preferences", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.getFirestore.mockReturnValue(mocks.db);
    mocks.doc.mockReturnValue(mocks.ref);
    mocks.setDoc.mockResolvedValue(undefined);
  });

  it("reads only supported locale and theme values", async () => {
    mocks.getDoc.mockResolvedValue({
      data: () => ({ locale: "pt-BR", theme: "dark", extra: "ignored" }),
    });

    const { readUserPreferences } = await import("./user-preferences");

    await expect(readUserPreferences("user-123")).resolves.toEqual({
      locale: "pt-BR",
      theme: "dark",
    });
    expect(mocks.doc).toHaveBeenCalledWith(mocks.db, "users", "user-123");
  });

  it("drops invalid stored values", async () => {
    mocks.getDoc.mockResolvedValue({
      data: () => ({ locale: "fr", theme: "solarized" }),
    });

    const { readUserPreferences } = await import("./user-preferences");

    await expect(readUserPreferences("user-123")).resolves.toEqual({});
  });

  it("merges changes into the user's document", async () => {
    const { writeUserPreferences } = await import("./user-preferences");

    await writeUserPreferences("user-123", { theme: "light" });

    expect(mocks.setDoc).toHaveBeenCalledWith(
      mocks.ref,
      { theme: "light" },
      { merge: true },
    );
  });
});
