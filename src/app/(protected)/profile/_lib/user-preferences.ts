import { doc, getDoc, setDoc } from "firebase/firestore";
import { isLocale, type Locale } from "@/i18n/routing";
import { getFirebaseFirestore } from "../../../../lib/firebase/client";

export const themePreferences = ["light", "dark", "system"] as const;
export type ThemePreference = (typeof themePreferences)[number];

export type UserPreferences = {
  locale: Locale;
  theme: ThemePreference;
};

export function isThemePreference(value: unknown): value is ThemePreference {
  return (
    typeof value === "string" &&
    (themePreferences as readonly string[]).includes(value)
  );
}

export async function readUserPreferences(
  uid: string,
): Promise<Partial<UserPreferences>> {
  const snapshot = await getDoc(doc(getFirebaseFirestore(), "users", uid));
  const data = snapshot.data();

  return {
    ...(isLocale(data?.locale) ? { locale: data.locale } : {}),
    ...(isThemePreference(data?.theme) ? { theme: data.theme } : {}),
  };
}

export async function writeUserPreferences(
  uid: string,
  preferences: Partial<UserPreferences>,
) {
  await setDoc(doc(getFirebaseFirestore(), "users", uid), preferences, {
    merge: true,
  });
}
