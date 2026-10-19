import { initializeUI } from "@firebase-oss/ui-core";
import type { FirebaseOptions } from "firebase/app";
import { getApp, getApps, initializeApp } from "firebase/app";
import { connectAuthEmulator, getAuth } from "firebase/auth";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import { connectStorageEmulator, getStorage } from "firebase/storage";

function getFirebaseConfig(): FirebaseOptions {
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;

  return {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    ...(projectId
      ? { storageBucket: storageBucket || `${projectId}.appspot.com` }
      : {}),
  };
}

function getEmulatorUrl(): string | undefined {
  const host = (
    process.env.FIREBASE_AUTH_EMULATOR_HOST ||
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_HOST
  )?.trim();

  if (!host) return undefined;

  const url = host.includes("://") ? host : `http://${host}`;
  const parsed = new URL(url);
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    throw new Error(
      "The Auth emulator host must use http:// or https://. See .env.example.",
    );
  }

  return url.replace(/\/$/, "");
}

export function getFirebaseUI() {
  const config = getFirebaseConfig();
  const missing = Object.entries(config)
    .filter(([, value]) => typeof value !== "string" || !value.trim())
    .map(([key]) => key);
  if (missing.length) {
    throw new Error(
      `Missing Firebase configuration: ${missing.join(", ")}. See .env.example.`,
    );
  }
  const emulatorUrl = getEmulatorUrl();
  if (emulatorUrl && process.env.NODE_ENV !== "development") {
    throw new Error(
      "The Auth emulator requires development mode. See .env.example.",
    );
  }
  const app = getFirebaseApp(config);
  const auth = getAuth(app);
  if (!globalThis.firebaseUIStore && emulatorUrl) {
    connectAuthEmulator(auth, emulatorUrl);
  }
  globalThis.firebaseUIStore ??= initializeUI({ app, auth });
  return globalThis.firebaseUIStore;
}

export function getFirebaseApp(config = getFirebaseConfig()) {
  return getApps().some((item) => item.name === "[DEFAULT]")
    ? getApp()
    : initializeApp(config);
}

export function getFirebaseFirestore() {
  const firestore = getFirestore(getFirebaseApp());
  const host = process.env.FIRESTORE_EMULATOR_HOST?.trim();

  if (!globalThis.firebaseFirestoreEmulatorConnected && host) {
    const url = new URL(host.includes("://") ? host : `http://${host}`);
    connectFirestoreEmulator(firestore, url.hostname, Number(url.port || 8080));
    globalThis.firebaseFirestoreEmulatorConnected = true;
  }

  return firestore;
}

export function getFirebaseStorage() {
  const storage = getStorage(getFirebaseApp());
  const host = process.env.FIREBASE_STORAGE_EMULATOR_HOST?.trim();

  if (!globalThis.firebaseStorageEmulatorConnected && host) {
    const url = new URL(host.includes("://") ? host : `http://${host}`);
    connectStorageEmulator(storage, url.hostname, Number(url.port || 9199));
    globalThis.firebaseStorageEmulatorConnected = true;
  }

  return storage;
}
