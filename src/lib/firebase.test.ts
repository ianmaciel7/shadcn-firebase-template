import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  app: { name: "[DEFAULT]" },
  apps: [] as { name: string }[],
  auth: { currentUser: null },
  store: { id: "firebase-ui" },
  getApp: vi.fn(),
  getApps: vi.fn(),
  getAuth: vi.fn(),
  initializeApp: vi.fn(),
  initializeUI: vi.fn(),
  connectAuthEmulator: vi.fn(),
}));

vi.mock("firebase/app", () => ({
  getApp: mocks.getApp,
  getApps: mocks.getApps,
  initializeApp: mocks.initializeApp,
}));
vi.mock("firebase/auth", () => ({
  connectAuthEmulator: mocks.connectAuthEmulator,
  getAuth: mocks.getAuth,
}));
vi.mock("@firebase-oss/ui-core", () => ({ initializeUI: mocks.initializeUI }));

describe("getFirebaseUI", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
    vi.stubEnv("NEXT_PUBLIC_FIREBASE_API_KEY", "api-key");
    vi.stubEnv("NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN", "example.firebaseapp.com");
    vi.stubEnv("NEXT_PUBLIC_FIREBASE_PROJECT_ID", "example");
    vi.stubEnv("NEXT_PUBLIC_FIREBASE_APP_ID", "app-id");
    delete process.env.FIREBASE_AUTH_EMULATOR_HOST;
    delete process.env.NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_HOST;
    mocks.apps = [];
    mocks.getApps.mockImplementation(() => mocks.apps);
    mocks.getApp.mockReturnValue(mocks.app);
    mocks.getAuth.mockReturnValue(mocks.auth);
    mocks.initializeApp.mockReturnValue(mocks.app);
    mocks.initializeUI.mockReturnValue(mocks.store);
    globalThis.firebaseUIStore = undefined;
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    globalThis.firebaseUIStore = undefined;
  });

  it("reports missing public configuration", async () => {
    vi.stubEnv("NEXT_PUBLIC_FIREBASE_API_KEY", "");
    vi.stubEnv("NEXT_PUBLIC_FIREBASE_APP_ID", "");

    const { getFirebaseUI } = await import("./firebase");
    expect(() => getFirebaseUI()).toThrow(
      "Missing Firebase configuration: apiKey, appId. See .env.example.",
    );
    expect(mocks.initializeApp).not.toHaveBeenCalled();
  });

  it("rejects emulator use outside development or with non-demo project", async () => {
    vi.stubEnv("FIREBASE_AUTH_EMULATOR_HOST", "127.0.0.1:9099");

    const { getFirebaseUI } = await import("./firebase");
    expect(() => getFirebaseUI()).toThrow(
      "The Auth emulator requires development mode and a demo project (e.g. demo-*). See .env.example.",
    );
  });

  it("initializes Firebase and connects the emulator in the demo project", async () => {
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("NEXT_PUBLIC_FIREBASE_PROJECT_ID", "demo-test");
    vi.stubEnv("FIREBASE_AUTH_EMULATOR_HOST", "127.0.0.1:9098");

    const { getFirebaseUI } = await import("./firebase");
    expect(getFirebaseUI()).toBe(mocks.store);
    expect(mocks.initializeApp).toHaveBeenCalledWith({
      apiKey: "api-key",
      authDomain: "example.firebaseapp.com",
      projectId: "demo-test",
      appId: "app-id",
    });
    expect(mocks.connectAuthEmulator).toHaveBeenCalledWith(
      mocks.auth,
      "http://127.0.0.1:9098",
    );
    expect(mocks.initializeUI).toHaveBeenCalledWith({
      app: mocks.app,
      auth: mocks.auth,
    });
  });

  it("reuses an existing app and UI store", async () => {
    mocks.apps = [mocks.app];
    globalThis.firebaseUIStore = mocks.store as never;

    const { getFirebaseUI } = await import("./firebase");
    expect(getFirebaseUI()).toBe(mocks.store);
    expect(mocks.getApp).toHaveBeenCalledOnce();
    expect(mocks.initializeApp).not.toHaveBeenCalled();
    expect(mocks.initializeUI).not.toHaveBeenCalled();
  });
});
