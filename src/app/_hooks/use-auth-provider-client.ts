import { useLocale, useTranslations } from "next-intl";
import { useAuthReturnNavigation } from "./use-auth-return-navigation";
import { useFirebaseUi } from "./use-firebase-ui";
import { useFirebaseUiTranslations } from "./use-firebase-ui-translations";

export function useAuthProviderClient() {
  const locale = useLocale();
  const t = useTranslations("Auth");
  const { ui, isError } = useFirebaseUi();
  const { ready } = useAuthReturnNavigation(ui);
  useFirebaseUiTranslations(ui, locale);

  return { isError, isLoading: !isError && (!ui || !ready), t, ui };
}
