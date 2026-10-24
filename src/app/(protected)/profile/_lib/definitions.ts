import type { Locale } from "@/lib/locale";
import type { ThemePreference } from "@/lib/theme";

export type ProfileValues = {
  displayName: string;
  email: string;
  locale: Locale;
  theme: ThemePreference;
};

export type ProfileFormValues = ProfileValues & { avatarFile: File | null };

export type SavedProfile = {
  values: ProfileValues;
  photoURL: string | null;
  avatarChanged: boolean;
  emailChanged: boolean;
};
