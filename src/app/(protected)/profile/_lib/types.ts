import type { ThemePreference } from "@/lib/firebase/firestore/user-preferences";
import type { Locale } from "@/lib/locale";

export type ProfileValues = {
  displayName: string;
  email: string;
  locale: Locale;
  theme: ThemePreference;
};
