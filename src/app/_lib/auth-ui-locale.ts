import { enUs, esEs, ptBr } from "@firebase-oss/ui-translations";

export function getAuthUILocale(locale: string) {
  if (locale === "pt-BR") return ptBr;
  if (locale === "es") return esEs;
  return enUs;
}
