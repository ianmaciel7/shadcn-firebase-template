import { initializeUI } from "@firebase-oss/ui-core";
import { getApp, getApps, initializeApp } from "firebase/app";
import { connectAuthEmulator, getAuth } from "firebase/auth";

const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export function getFirebaseUI() {
  const missing = Object.entries(config)
    .filter(([, value]) => !value)
    .map(([key]) => key);
  if (missing.length) {
    throw new Error(
      `Missing Firebase configuration: ${missing.join(", ")}. See .env.example.`,
    );
  }
  const useEmulator = process.env.NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR === "true";
  if (
    useEmulator &&
    (process.env.NODE_ENV !== "development" ||
      !config.projectId?.startsWith("demo-"))
  ) {
    throw new Error(
      "The Auth emulator requires development mode and a demo project (e.g. demo-*). See .env.example.",
    );
  }
  const app = getApps().some((item) => item.name === "[DEFAULT]")
    ? getApp()
    : initializeApp(config);
  const auth = getAuth(app);
  if (!globalThis.firebaseUIStore && useEmulator) {
    const rawHost =
      process.env.NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_HOST ||
      process.env.FIREBASE_AUTH_EMULATOR_HOST ||
      "http://127.0.0.1:9099";
    const emulatorHost =
      rawHost.startsWith("http://") || rawHost.startsWith("https://")
        ? rawHost
        : `http://${rawHost}`;
    connectAuthEmulator(auth, emulatorHost);
  }
  globalThis.firebaseUIStore ??= initializeUI({ app, auth });
  return globalThis.firebaseUIStore;
}
