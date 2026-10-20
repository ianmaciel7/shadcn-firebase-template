import { defineRouting } from "next-intl/routing";
import { defaultLocale, isLocale, type Locale, locales } from "@/lib/locale";

export const routing = defineRouting({
  locales,
  defaultLocale,
});

export { defaultLocale, isLocale, type Locale, locales };

export const localeCookie = "NEXT_LOCALE";
