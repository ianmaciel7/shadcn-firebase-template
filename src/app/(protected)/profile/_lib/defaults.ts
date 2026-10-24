import { getFirebaseUI } from "@/lib/firebase/client";
import { readUserPreferences } from "@/lib/firebase/firestore/user-preferences";
import type { Locale } from "@/lib/locale";
import type { ProfileValues } from "./definitions";

export async function readProfileDefaults(
  uid: string,
  activeLocale: Locale,
  isActive: () => boolean,
) {
  const preferences = await readUserPreferences(uid);
  if (!isActive()) return null;
  const currentUser = getFirebaseUI().get().auth.currentUser;
  if (!currentUser || currentUser.uid !== uid) return null;
  const values: ProfileValues = {
    displayName: currentUser.displayName ?? "",
    email: currentUser.email ?? "",
    locale: preferences.locale ?? activeLocale,
    theme: preferences.theme ?? "system",
  };
  return { values, theme: preferences.theme };
}
