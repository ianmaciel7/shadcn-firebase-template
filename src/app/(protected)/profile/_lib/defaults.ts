import { readUserPreferences } from "@/lib/firebase/firestore/user-preferences";
import type { Locale } from "@/lib/locale";
import { getSessionUser } from "@/lib/session";
import type { ProfileValues } from "./definitions";

export async function readProfileDefaults(
  uid: string,
  activeLocale: Locale,
  isActive: () => boolean,
) {
  const preferences = await readUserPreferences(uid);
  if (!isActive()) return null;
  const currentUser = getSessionUser();
  if (!currentUser || currentUser.uid !== uid) return null;
  const values: ProfileValues = {
    displayName: currentUser.displayName ?? "",
    email: currentUser.email ?? "",
    locale: preferences.locale ?? activeLocale,
    theme: preferences.theme ?? "system",
  };
  return { values, theme: preferences.theme };
}
