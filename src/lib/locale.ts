export const locales = ["en", "pt-BR", "es"] as const;
export const defaultLocale = "en" satisfies (typeof locales)[number];

export type Locale = (typeof locales)[number];

export function isLocale(value: unknown): value is Locale {
  return (
    typeof value === "string" && (locales as readonly string[]).includes(value)
  );
}
