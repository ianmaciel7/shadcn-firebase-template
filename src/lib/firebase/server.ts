import "server-only";

import { initializeServerApp } from "firebase/app";
import { connectAuthEmulator, getAuth } from "firebase/auth";
import { headers } from "next/headers";
import { connection } from "next/server";
import { getFirebaseConfig } from "./config";

type FirebaseServerSession = {
  isBridgeActive: boolean;
  userId: string | null;
};

function readBearerToken(requestHeaders: Headers) {
  const authorization = requestHeaders.get("authorization");
  return authorization?.startsWith("Bearer ")
    ? authorization.slice("Bearer ".length)
    : undefined;
}

function connectServerAuthEmulator(auth: ReturnType<typeof getAuth>) {
  const emulatorHost =
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_HOST?.trim();
  if (process.env.NODE_ENV !== "development" || !emulatorHost) return;
  connectAuthEmulator(
    auth,
    emulatorHost.includes("://") ? emulatorHost : `http://${emulatorHost}`,
  );
}

async function verifyIdToken(authIdToken: string, requestHeaders: Headers) {
  try {
    // Firebase Auth reads the clock while initializing; defer it to request time.
    await connection();

    const app = initializeServerApp(getFirebaseConfig(), {
      authIdToken,
      releaseOnDeref: requestHeaders,
    });
    const auth = getAuth(app);
    connectServerAuthEmulator(auth);

    await auth.authStateReady();
    return auth.currentUser?.uid ?? null;
  } catch {
    // A malformed bearer token is an unverifiable session, not a server fault.
    return null;
  }
}

/**
 * Reads only a worker-injected, refreshed ID token. An absent worker is not an
 * unauthenticated verdict: the existing browser guard remains the first-load
 * fallback until the worker controls the tab.
 */
export async function getFirebaseServerSession(): Promise<FirebaseServerSession> {
  const requestHeaders = await headers();
  const isBridgeActive = requestHeaders.get("x-firebase-auth-bridge") === "1";
  const authIdToken = readBearerToken(requestHeaders);

  if (!isBridgeActive || !authIdToken) return { isBridgeActive, userId: null };

  return {
    isBridgeActive,
    userId: await verifyIdToken(authIdToken, requestHeaders),
  };
}
