import { useTranslations } from "next-intl";
import type { useProfileSession } from "./use-profile-session";

export function useProfileStatus(
  session: ReturnType<typeof useProfileSession>,
) {
  const t = useTranslations("Auth");
  const { user, error, defaultValues, authReady, preferencesReady } = session;
  if (!authReady || (user && !preferencesReady))
    return {
      isError: false,
      isHidden: false,
      isLoading: true,
      message: "",
      userId: "",
    };
  if (!user && !error)
    return {
      isError: false,
      isHidden: true,
      isLoading: false,
      message: "",
      userId: "",
    };
  if (!user || !defaultValues)
    return {
      isError: true,
      isHidden: false,
      isLoading: false,
      message: error ?? t("profileLoadError"),
      userId: "",
    };
  return {
    isError: false,
    isHidden: false,
    isLoading: false,
    message: "",
    userId: user.uid,
  };
}
