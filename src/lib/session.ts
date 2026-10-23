import { onAuthStateChanged, type Unsubscribe, type User } from "firebase/auth";
import { getFirebaseUI } from "@/lib/firebase/client";

/** Observe the active session. Throws if Firebase is misconfigured. */
export function subscribeToSession(
  onChange: (user: User | null) => void,
  onError?: (error: Error) => void,
): Unsubscribe {
  return onAuthStateChanged(getFirebaseUI().get().auth, onChange, onError);
}

/** Return the active user, requiring it to match the expected uid. */
export function getActiveUser(expectedUser: User): User {
  const currentUser = getFirebaseUI().get().auth.currentUser;
  if (!currentUser || currentUser.uid !== expectedUser.uid) {
    throw new Error("Authentication session unavailable");
  }
  return currentUser;
}
