import { initializeUI } from "@firebase-oss/ui-core";
import type { FirebaseOptions } from "firebase/app";
import { getApp, getApps, initializeApp } from "firebase/app";
import { connectAuthEmulator, getAuth } from "firebase/auth";
import { connectDatabaseEmulator, getDatabase } from "firebase/database";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import { connectFunctionsEmulator, getFunctions } from "firebase/functions";
import { connectStorageEmulator, getStorage } from "firebase/storage";

function getFirebaseConfig(): FirebaseOptions {
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
  const databaseURL = process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL;

  return {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    ...(projectId
      ? { storageBucket: storageBucket || `${projectId}.appspot.com` }
      : {}),
    ...(databaseURL ? { databaseURL } : {}),
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

function getValidatedFirebaseConfig(): FirebaseOptions {
  const config = getFirebaseConfig();
  const missing = Object.entries(config)
    .filter(([, value]) => typeof value !== "string" || !value.trim())
    .map(([key]) => key);
  if (missing.length) {
    throw new Error(
      `Missing Firebase configuration: ${missing.join(", ")}. See .env.example.`,
    );
  }

  return config;
}

function connectFirebaseAuthEmulator(auth: ReturnType<typeof getAuth>) {
  const emulatorUrl = getEmulatorUrl();
  if (!emulatorUrl) return;

  if (process.env.NODE_ENV !== "development") {
    throw new Error(
      "The Auth emulator requires development mode. See .env.example.",
    );
  }

  if (!globalThis.firebaseAuthEmulatorConnected) {
    connectAuthEmulator(auth, emulatorUrl);
    globalThis.firebaseAuthEmulatorConnected = true;
  }
}

function getFirebaseAuthForApp(app: ReturnType<typeof getFirebaseApp>) {
  const auth = getAuth(app);
  connectFirebaseAuthEmulator(auth);
  return auth;
}

export function getFirebaseAuth() {
  return getFirebaseAuthForApp(getFirebaseApp(getValidatedFirebaseConfig()));
}

export function getFirebaseUI() {
  const app = getFirebaseApp(getValidatedFirebaseConfig());
  const auth = getFirebaseAuthForApp(app);
  globalThis.firebaseUIStore ??= initializeUI({ app, auth });
  return globalThis.firebaseUIStore;
}

export function getFirebaseApp(config = getFirebaseConfig()) {
  return getApps().some((item) => item.name === "[DEFAULT]")
    ? getApp()
    : initializeApp(config);
}

export function getFirebaseFirestore() {
  const firestore = getFirestore(getFirebaseApp(getValidatedFirebaseConfig()));
  const host = process.env.FIRESTORE_EMULATOR_HOST?.trim();

  if (!globalThis.firebaseFirestoreEmulatorConnected && host) {
    const url = new URL(host.includes("://") ? host : `http://${host}`);
    connectFirestoreEmulator(firestore, url.hostname, Number(url.port || 8080));
    globalThis.firebaseFirestoreEmulatorConnected = true;
  }

  return firestore;
}

export function getFirebaseDatabase() {
  const database = getDatabase(getFirebaseApp(getValidatedFirebaseConfig()));
  const host = (
    process.env.NEXT_PUBLIC_FIREBASE_DATABASE_EMULATOR_HOST ||
    process.env.FIREBASE_DATABASE_EMULATOR_HOST
  )?.trim();

  if (!globalThis.firebaseDatabaseEmulatorConnected && host) {
    const url = new URL(host.includes("://") ? host : `http://${host}`);
    connectDatabaseEmulator(database, url.hostname, Number(url.port || 9000));
    globalThis.firebaseDatabaseEmulatorConnected = true;
  }

  return database;
}

export function getFirebaseFunctions() {
  const functions = getFunctions(getFirebaseApp(getValidatedFirebaseConfig()));
  const host = (
    process.env.NEXT_PUBLIC_FIREBASE_FUNCTIONS_EMULATOR_HOST ||
    process.env.FUNCTIONS_EMULATOR_HOST
  )?.trim();

  if (!globalThis.firebaseFunctionsEmulatorConnected && host) {
    const url = new URL(host.includes("://") ? host : `http://${host}`);
    connectFunctionsEmulator(functions, url.hostname, Number(url.port || 5001));
    globalThis.firebaseFunctionsEmulatorConnected = true;
  }

  return functions;
}

export function getFirebaseStorage() {
  const storage = getStorage(getFirebaseApp(getValidatedFirebaseConfig()));
  const host = (
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_EMULATOR_HOST ||
    process.env.FIREBASE_STORAGE_EMULATOR_HOST
  )?.trim();

  if (!globalThis.firebaseStorageEmulatorConnected && host) {
    const url = new URL(host.includes("://") ? host : `http://${host}`);
    connectStorageEmulator(storage, url.hostname, Number(url.port || 9199));
    globalThis.firebaseStorageEmulatorConnected = true;
  }

  return storage;
}
