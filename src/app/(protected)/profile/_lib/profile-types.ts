import type { Locale } from "@/i18n/routing";
import type { ThemePreference } from "./user-preferences";

export type ProfileValues = {
  displayName: string;
  email: string;
  locale: Locale;
  theme: ThemePreference;
};
