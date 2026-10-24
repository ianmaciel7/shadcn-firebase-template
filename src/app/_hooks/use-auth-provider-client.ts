import { useLocale, useTranslations } from "next-intl";
import { useAuthReturnNavigation } from "./use-auth-return-navigation";
import { useAuthUiLocale } from "./use-auth-ui-locale";
import { useAuthUiStore } from "./use-auth-ui-store";

export function useAuthProviderClient() {
  const locale = useLocale();
  const t = useTranslations("Auth");
  const { ui, isError } = useAuthUiStore();
  const { ready } = useAuthReturnNavigation(ui);
  useAuthUiLocale(ui, locale);

  return { isError, isLoading: !isError && (!ui || !ready), t, ui };
}
